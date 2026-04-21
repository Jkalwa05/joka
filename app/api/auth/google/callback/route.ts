import { NextRequest, NextResponse } from 'next/server'
import { getOAuthClient, startGmailWatch } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const customerId = req.nextUrl.searchParams.get('state')

  if (!code || !customerId) {
    return NextResponse.json({ error: 'Ungültige Anfrage' }, { status: 400 })
  }

  const oauth2Client = getOAuthClient()
  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  // E-Mail-Adresse abrufen
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data: userInfo } = await oauth2.userinfo.get()
  const email = userInfo.email ?? ''

  // Token speichern
  await prisma.googleToken.upsert({
    where: { customerId_scope: { customerId, scope: 'gmail calendar' } },
    update: {
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    },
    create: {
      customerId,
      scope: 'gmail calendar',
      accessToken: tokens.access_token!,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
    },
  })

  // Was für ein Kunde ist das? MailPilot, AutoChat, beides?
  const [mailConfig, autoConfig] = await Promise.all([
    prisma.mailPilotConfig.findUnique({ where: { customerId } }),
    prisma.autoChatConfig.findUnique({ where: { customerId } }),
  ])

  // MailPilot: Gmail-Adresse speichern + Watch starten
  if (mailConfig) {
    await prisma.mailPilotConfig.update({
      where: { customerId },
      data: { gmailAddress: email },
    })
    try {
      const watch = await startGmailWatch(customerId)
      await prisma.mailPilotConfig.update({
        where: { customerId },
        data: {
          gmailHistoryId: watch.historyId ?? undefined,
          gmailWatchExpiry: watch.expiration
            ? new Date(Number(watch.expiration))
            : undefined,
        },
      })
    } catch (err) {
      console.error('Gmail Watch konnte nicht gestartet werden:', err)
    }
  }

  // AutoChat: Kalender markieren als verbunden
  if (autoConfig && !autoConfig.calendarId) {
    await prisma.autoChatConfig.update({
      where: { customerId },
      data: { calendarId: 'primary' },
    })
  }

  const customer = await prisma.customer.findUnique({ where: { id: customerId }, select: { inboxToken: true } })
  const inboxToken = customer?.inboxToken ?? ''

  if (mailConfig) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?token=${inboxToken}`)
  }

  const redirectUrl = inboxToken
    ? `${process.env.NEXTAUTH_URL}/onboarding/autochat?token=${inboxToken}&calendar=connected`
    : `${process.env.NEXTAUTH_URL}/dashboard`
  return NextResponse.redirect(redirectUrl)
}
