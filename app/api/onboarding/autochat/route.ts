import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateInboxToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }
  const cfg = customer.autoChatConfig
  const googleToken = await prisma.googleToken.findUnique({
    where: { customerId_scope: { customerId: customer.id, scope: 'gmail calendar' } },
  })
  return NextResponse.json({
    businessName: cfg.businessName ?? '',
    businessAddress: cfg.businessAddress ?? '',
    openingHours: cfg.openingHours ?? '',
    services: cfg.services ?? '',
    calendarConnected: !!googleToken,
  })
}

export async function POST(req: NextRequest) {
  const { token, businessName, businessAddress, openingHours, services } = await req.json()
  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  await prisma.autoChatConfig.update({
    where: { id: customer.autoChatConfig.id },
    data: { businessName, businessAddress, openingHours, services },
  })

  return NextResponse.json({ ok: true })
}
