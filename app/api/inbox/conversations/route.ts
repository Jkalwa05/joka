import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateInboxToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  const conversations = await prisma.conversation.findMany({
    where: { autoChatConfigId: customer.autoChatConfig.id },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ conversations })
}
