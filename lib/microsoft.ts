import { prisma } from './prisma'

const GRAPH = 'https://graph.microsoft.com/v1.0'
const OAUTH_BASE = 'https://login.microsoftonline.com/common/oauth2/v2.0'

const SCOPES = [
  'offline_access',
  'User.Read',
  'Mail.ReadWrite',
  'MailboxSettings.Read',
  'Calendars.ReadWrite',
].join(' ')

const SUBSCRIPTION_MAX_MS = 4200 * 60 * 1000 // ~70 Stunden (Graph Max: 4230 min)

function redirectUri(): string {
  return `${process.env.NEXTAUTH_URL}/api/auth/microsoft/callback`
}

export function getMicrosoftAuthUrl(customerId: string): string {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID ?? '',
    response_type: 'code',
    redirect_uri: redirectUri(),
    response_mode: 'query',
    scope: SCOPES,
    state: customerId,
    prompt: 'consent',
  })
  return `${OAUTH_BASE}/authorize?${params.toString()}`
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in: number
}> {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID ?? '',
    client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
    code,
    redirect_uri: redirectUri(),
    grant_type: 'authorization_code',
    scope: SCOPES,
  })
  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error(`Microsoft token exchange failed: ${res.status} ${await res.text()}`)
  return res.json()
}

async function refreshMicrosoftToken(refreshToken: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in: number
}> {
  const params = new URLSearchParams({
    client_id: process.env.MICROSOFT_CLIENT_ID ?? '',
    client_secret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
    scope: SCOPES,
  })
  const res = await fetch(`${OAUTH_BASE}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error(`Microsoft token refresh failed: ${res.status} ${await res.text()}`)
  return res.json()
}

export async function hasMicrosoftConnection(customerId: string): Promise<boolean> {
  const token = await prisma.microsoftToken.findUnique({ where: { customerId } })
  return !!token
}

async function getAccessToken(customerId: string): Promise<string> {
  const token = await prisma.microsoftToken.findUnique({ where: { customerId } })
  if (!token) throw new Error('Kein Microsoft Token für diesen Kunden')
  if (token.expiresAt && token.expiresAt.getTime() - Date.now() > 60_000) return token.accessToken
  if (!token.refreshToken) throw new Error('Kein Refresh Token – Reconnect nötig')
  const refreshed = await refreshMicrosoftToken(token.refreshToken)
  await prisma.microsoftToken.update({
    where: { customerId },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: new Date(Date.now() + refreshed.expires_in * 1000),
    },
  })
  return refreshed.access_token
}

async function graph<T = unknown>(customerId: string, path: string, init?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken(customerId)
  const res = await fetch(`${GRAPH}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(`Graph ${init?.method ?? 'GET'} ${path} failed: ${res.status} ${await res.text()}`)
  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

export async function getOutlookUserEmail(customerId: string): Promise<string> {
  const me = await graph<{ mail?: string; userPrincipalName?: string }>(customerId, '/me')
  return me.mail ?? me.userPrincipalName ?? ''
}

export async function getOutlookMessage(
  customerId: string,
  messageId: string
): Promise<{ id: string; subject: string; snippet: string }> {
  const msg = await graph<{ id: string; subject?: string; bodyPreview?: string }>(
    customerId,
    `/me/messages/${messageId}?$select=subject,bodyPreview,id`
  )
  return {
    id: msg.id,
    subject: msg.subject ?? '(kein Betreff)',
    snippet: msg.bodyPreview ?? '',
  }
}

export async function moveOutlookMessageToFolder(
  customerId: string,
  messageId: string,
  folderName: string
): Promise<void> {
  const filter = encodeURIComponent(`displayName eq '${folderName.replace(/'/g, "''")}'`)
  const folders = await graph<{ value: { id: string; displayName: string }[] }>(
    customerId,
    `/me/mailFolders?$filter=${filter}`
  )
  let folderId = folders.value[0]?.id
  if (!folderId) {
    const created = await graph<{ id: string }>(customerId, '/me/mailFolders', {
      method: 'POST',
      body: JSON.stringify({ displayName: folderName }),
    })
    folderId = created.id
  }
  await graph(customerId, `/me/messages/${messageId}/move`, {
    method: 'POST',
    body: JSON.stringify({ destinationId: folderId }),
  })
}

export async function createOutlookCalendarEvent(
  customerId: string,
  title: string,
  date: string,
  time?: string
): Promise<void> {
  const start = time ? new Date(`${date}T${time}:00`) : new Date(`${date}T00:00:00`)
  const end = time ? new Date(start.getTime() + 60 * 60 * 1000) : new Date(`${date}T23:59:59`)
  const body = {
    subject: title,
    start: { dateTime: start.toISOString(), timeZone: 'Europe/Berlin' },
    end: { dateTime: end.toISOString(), timeZone: 'Europe/Berlin' },
    isAllDay: !time,
  }
  await graph(customerId, '/me/events', { method: 'POST', body: JSON.stringify(body) })
}

export async function createOutlookSubscription(
  customerId: string
): Promise<{ id: string; expiresAt: Date }> {
  const clientState = process.env.OUTLOOK_WEBHOOK_SECRET
  if (!clientState) throw new Error('OUTLOOK_WEBHOOK_SECRET fehlt')
  const notificationUrl = `${process.env.NEXTAUTH_URL}/api/outlook/webhook`
  const expiry = new Date(Date.now() + SUBSCRIPTION_MAX_MS)

  const body = {
    changeType: 'created',
    notificationUrl,
    lifecycleNotificationUrl: notificationUrl,
    resource: "me/mailFolders('Inbox')/messages",
    expirationDateTime: expiry.toISOString(),
    clientState,
  }
  const sub = await graph<{ id: string; expirationDateTime: string }>(
    customerId,
    '/subscriptions',
    { method: 'POST', body: JSON.stringify(body) }
  )
  return { id: sub.id, expiresAt: new Date(sub.expirationDateTime) }
}

export async function renewOutlookSubscription(
  customerId: string,
  subscriptionId: string
): Promise<{ expiresAt: Date }> {
  const expiry = new Date(Date.now() + SUBSCRIPTION_MAX_MS)
  const updated = await graph<{ expirationDateTime: string }>(
    customerId,
    `/subscriptions/${subscriptionId}`,
    { method: 'PATCH', body: JSON.stringify({ expirationDateTime: expiry.toISOString() }) }
  )
  return { expiresAt: new Date(updated.expirationDateTime) }
}

export async function deleteOutlookSubscription(
  customerId: string,
  subscriptionId: string
): Promise<void> {
  await graph(customerId, `/subscriptions/${subscriptionId}`, { method: 'DELETE' })
}
