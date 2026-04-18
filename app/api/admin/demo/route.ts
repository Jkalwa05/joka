import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { constantTimeEqual } from '@/lib/security'
import crypto from 'crypto'

const COOKIE_NAME = 'joka_admin'

function authorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_KEY ?? ''
  if (!adminKey) return false
  const cookie = req.cookies.get(COOKIE_NAME)?.value
  if (cookie && constantTimeEqual(cookie, adminKey)) return true
  const query = req.nextUrl.searchParams.get('key')
  if (query && constantTimeEqual(query, adminKey)) return true
  return false
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = 'demo@joka.chat'
  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  const customer = await prisma.customer.upsert({
    where: { email },
    update: { inboxToken: token, inboxTokenExpiry: expiry },
    create: {
      email,
      name: 'Demo Account',
      stripeCustomerId: 'demo',
      subscriptionStatus: 'ACTIVE',
      inboxToken: token,
      inboxTokenExpiry: expiry,
    },
  })

  const config = await prisma.autoChatConfig.upsert({
    where: { customerId: customer.id },
    update: {},
    create: {
      customerId: customer.id,
      businessName: 'Friseur Mustermann',
      businessAddress: 'Musterstraße 1, 12345 Berlin',
      openingHours: 'Mo–Fr 9–18 Uhr, Sa 9–14 Uhr',
      services: 'Haarschnitt €18, Bart-Trim €10, Färben ab €35',
    },
  })

  const existing = await prisma.conversation.count({ where: { autoChatConfigId: config.id } })
  if (existing === 0) {
    await Promise.all([
      prisma.conversation.create({
        data: {
          autoChatConfigId: config.id,
          customerPhone: '+491511234567',
          messages: {
            create: [
              { role: 'USER', content: 'Hallo, was kostet ein Herrenhaarschnitt?' },
              { role: 'ASSISTANT', content: 'Hallo! Ein Herrenhaarschnitt kostet bei uns €18. Möchtest du einen Termin buchen?' },
              { role: 'USER', content: 'Ja, habt ihr Samstag um 10 Uhr was frei?' },
              { role: 'ASSISTANT', content: 'Samstag um 10 Uhr ist noch frei! Soll ich den Termin für dich reservieren?' },
            ],
          },
        },
      }),
      prisma.conversation.create({
        data: {
          autoChatConfigId: config.id,
          customerPhone: '+491709876543',
          messages: {
            create: [
              { role: 'USER', content: 'Macht ihr auch Färben?' },
              { role: 'ASSISTANT', content: 'Ja, Färben bieten wir ab €35 an. Soll ich dir einen Termin einrichten?' },
            ],
          },
        },
      }),
    ])
  }

  const base = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin
  const loginUrl = `${base}/auto-login?token=${token}`
  return NextResponse.redirect(loginUrl)
}
