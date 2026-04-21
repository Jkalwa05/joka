import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token fehlt' }, { status: 401 })

  const customer = await prisma.customer.findFirst({
    where: { inboxToken: token, inboxTokenExpiry: { gt: new Date() } },
    include: { autoChatConfig: true, mailPilotConfig: true },
  })

  if (!customer) return NextResponse.json({ error: 'Ungültiger Token' }, { status: 401 })

  return NextResponse.json({
    email: customer.email,
    name: customer.name,
    products: {
      autochat: !!customer.autoChatConfig,
      mailpilot: !!customer.mailPilotConfig,
    },
    gmailConnected: !!customer.mailPilotConfig?.gmailAddress,
  })
}
