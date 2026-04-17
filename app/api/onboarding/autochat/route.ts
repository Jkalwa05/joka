import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getConfig(token: string) {
  const customer = await prisma.customer.findUnique({
    where: { inboxToken: token },
    include: { autoChatConfig: true },
  })
  if (!customer || !customer.inboxTokenExpiry || customer.inboxTokenExpiry < new Date()) return null
  if (!customer.autoChatConfig) return null
  return { customer, config: customer.autoChatConfig }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Kein Token' }, { status: 401 })

  const data = await getConfig(token)
  if (!data) return NextResponse.json({ error: 'Ungültig' }, { status: 401 })

  return NextResponse.json({
    businessName: data.config.businessName ?? '',
    businessAddress: data.config.businessAddress ?? '',
    openingHours: data.config.openingHours ?? '',
    services: data.config.services ?? '',
  })
}

export async function POST(req: NextRequest) {
  const { token, businessName, businessAddress, openingHours, services } = await req.json()
  if (!token) return NextResponse.json({ error: 'Kein Token' }, { status: 401 })

  const data = await getConfig(token)
  if (!data) return NextResponse.json({ error: 'Ungültig' }, { status: 401 })

  await prisma.autoChatConfig.update({
    where: { id: data.config.id },
    data: { businessName, businessAddress, openingHours, services },
  })

  return NextResponse.json({ ok: true })
}
