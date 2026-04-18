import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateInboxToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const conversationId = req.nextUrl.searchParams.get('conversationId')
  if (!token || !conversationId) {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }

  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, autoChatConfigId: customer.autoChatConfig.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  })

  if (!conversation) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  return NextResponse.json({ conversation })
}
