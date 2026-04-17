import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function getCustomerFromToken(token: string) {
  const customer = await prisma.customer.findUnique({
    where: { inboxToken: token },
    include: { autoChatConfig: true },
  })
  if (!customer || !customer.inboxTokenExpiry) return null
  if (customer.inboxTokenExpiry < new Date()) return null
  return customer
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Kein Token' }, { status: 401 })

  const customer = await getCustomerFromToken(token)
  if (!customer?.autoChatConfig) return NextResponse.json({ error: 'Ungültig' }, { status: 401 })

  const conversations = await prisma.conversation.findMany({
    where: { autoChatConfigId: customer.autoChatConfig.id },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ conversations })
}
