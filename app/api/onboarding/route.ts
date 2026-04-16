import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { customerId, businessName, businessAddress, openingHours, services } =
    await req.json()

  if (!customerId) {
    return NextResponse.json({ error: 'customerId fehlt' }, { status: 400 })
  }

  await prisma.autoChatConfig.update({
    where: { customerId },
    data: { businessName, businessAddress, openingHours, services },
  })

  return NextResponse.json({ ok: true })
}
