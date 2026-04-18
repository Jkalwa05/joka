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

export async function hasGoogleConnection(customerId: string): Promise<boolean> {
  const token = await prisma.googleToken.findUnique({
    where: { customerId_scope: { customerId, scope: 'gmail calendar' } },
  })
  return !!token
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

  const ids: string[] = []
  const seen = new Set<string>()
  for (const record of historyRes.data.history ?? []) {
    for (const added of record.messagesAdded ?? []) {
      const msgId = added.message?.id
      if (msgId && !seen.has(msgId)) {
        seen.add(msgId)
        ids.push(msgId)
      }
    }
  }

  const results = await Promise.all(
    ids.map((id) =>
      gmail.users.messages
        .get({ userId: 'me', id, format: 'metadata', metadataHeaders: ['Subject'] })
        .then((msg) => ({
          id,
          subject:
            msg.data.payload?.headers?.find((h) => h.name === 'Subject')?.value ?? '(kein Betreff)',
          snippet: msg.data.snippet ?? '',
          threadId: msg.data.threadId ?? '',
        }))
        .catch((err) => {
          console.error(`gmail.messages.get fehlgeschlagen (${id}):`, err)
          return null
        })
    )
  )

  const messages = results.filter((m): m is NonNullable<typeof m> => m !== null)

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

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: title,
      ...(time
        ? (() => {
            const start = new Date(`${date}T${time}:00`)
            const end = new Date(start.getTime() + 60 * 60 * 1000)
            return {
              start: { dateTime: start.toISOString(), timeZone: 'Europe/Berlin' },
              end: { dateTime: end.toISOString(), timeZone: 'Europe/Berlin' },
            }
          })()
        : { start: { date }, end: { date } }),
    },
  })
}
