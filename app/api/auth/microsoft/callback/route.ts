import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  exchangeCodeForToken,
  getOutlookUserEmail,
  createOutlookSubscription,
} from '@/lib/microsoft'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const customerId = req.nextUrl.searchParams.get('state')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code || !customerId) {
    return NextResponse.json({ error: error ?? 'Ungültige Anfrage' }, { status: 400 })
  }

  const tokens = await exchangeCodeForToken(code)

  await prisma.microsoftToken.upsert({
    where: { customerId },
    update: {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
    create: {
      customerId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    },
  })

  const mailConfig = await prisma.mailPilotConfig.findUnique({ where: { customerId } })

  // E-Mail-Adresse abrufen
  let outlookAddress = ''
  try {
    outlookAddress = await getOutlookUserEmail(customerId)
  } catch (err) {
    console.error('Outlook user email konnte nicht geladen werden:', err)
  }

  if (mailConfig) {
    await prisma.mailPilotConfig.update({
      where: { customerId },
      data: {
        provider: 'OUTLOOK',
        outlookAddress: outlookAddress || mailConfig.outlookAddress,
      },
    })

    // Push-Subscription anlegen
    try {
      const sub = await createOutlookSubscription(customerId)
      await prisma.mailPilotConfig.update({
        where: { customerId },
        data: {
          outlookSubscriptionId: sub.id,
          outlookSubscriptionExpiry: sub.expiresAt,
        },
      })
    } catch (err) {
      console.error('Outlook Subscription konnte nicht erstellt werden:', err)
    }
  }

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/onboarding/success?product=mailpilot`)
}
