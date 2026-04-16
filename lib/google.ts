import { google } from 'googleapis'
import { prisma } from './prisma'

export function getOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
  )
}

export function getAuthUrl(customerId: string) {
  const oauth2Client = getOAuthClient()
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    state: customerId,
  })
}

export async function getClientForCustomer(customerId: string) {
  const token = await prisma.googleToken.findUnique({
    where: { customerId_scope: { customerId, scope: 'gmail calendar' } },
  })
  if (!token) throw new Error('Kein Google Token für diesen Kunden')

  const oauth2Client = getOAuthClient()
  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken ?? undefined,
    expiry_date: token.expiresAt?.getTime(),
  })

  // Auto-refresh und Token in DB aktualisieren
  oauth2Client.on('tokens', async (tokens) => {
    await prisma.googleToken.update({
      where: { customerId_scope: { customerId, scope: 'gmail calendar' } },
      data: {
        accessToken: tokens.access_token ?? token.accessToken,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      },
    })
  })

  return oauth2Client
}

export async function startGmailWatch(customerId: string) {
  const auth = await getClientForCustomer(customerId)
  const gmail = google.gmail({ version: 'v1', auth })
  const res = await gmail.users.watch({
    userId: 'me',
    requestBody: {
      topicName: process.env.GOOGLE_PUBSUB_TOPIC,
      labelIds: ['INBOX'],
    },
  })
  return res.data
}

export async function getNewMessages(customerId: string, sinceHistoryId: string) {
  const auth = await getClientForCustomer(customerId)
  const gmail = google.gmail({ version: 'v1', auth })

  const historyRes = await gmail.users.history.list({
    userId: 'me',
    startHistoryId: sinceHistoryId,
    historyTypes: ['messageAdded'],
    labelId: 'INBOX',
  })

  const messages: { id: string; subject: string; snippet: string; threadId: string }[] = []

  for (const record of historyRes.data.history ?? []) {
    for (const added of record.messagesAdded ?? []) {
      const msgId = added.message?.id
      if (!msgId) continue
      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: msgId,
        format: 'metadata',
        metadataHeaders: ['Subject'],
      })
      const subject =
        msg.data.payload?.headers?.find((h) => h.name === 'Subject')?.value ?? '(kein Betreff)'
      messages.push({
        id: msgId,
        subject,
        snippet: msg.data.snippet ?? '',
        threadId: msg.data.threadId ?? '',
      })
    }
  }

  return {
    messages,
    newHistoryId: historyRes.data.historyId ?? sinceHistoryId,
  }
}

export async function applyGmailLabel(
  customerId: string,
  messageId: string,
  labelName: string
) {
  const auth = await getClientForCustomer(customerId)
  const gmail = google.gmail({ version: 'v1', auth })

  // Label suchen oder anlegen
  const labelsRes = await gmail.users.labels.list({ userId: 'me' })
  let label = labelsRes.data.labels?.find(
    (l) => l.name?.toLowerCase() === labelName.toLowerCase()
  )
  if (!label) {
    const created = await gmail.users.labels.create({
      userId: 'me',
      requestBody: { name: labelName, messageListVisibility: 'show', labelListVisibility: 'labelShow' },
    })
    label = created.data
  }

  if (label.id) {
    await gmail.users.messages.modify({
      userId: 'me',
      id: messageId,
      requestBody: { addLabelIds: [label.id] },
    })
  }
}

export async function createCalendarEvent(
  customerId: string,
  title: string,
  date: string,
  time?: string
) {
  const auth = await getClientForCustomer(customerId)
  const calendar = google.calendar({ version: 'v3', auth })

  const startDateTime = time ? `${date}T${time}:00` : date
  const isAllDay = !time

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: title,
      ...(isAllDay
        ? { start: { date }, end: { date } }
        : {
            start: { dateTime: startDateTime, timeZone: 'Europe/Berlin' },
            end: { dateTime: startDateTime, timeZone: 'Europe/Berlin' },
          }),
    },
  })
}
