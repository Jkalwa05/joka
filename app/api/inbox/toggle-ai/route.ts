import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateInboxToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { token, conversationId, aiPaused } = await req.json()
  if (!token || !conversationId || typeof aiPaused !== 'boolean') {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }

  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, autoChatConfigId: customer.autoChatConfig.id },
    select: { id: true },
  })
  if (!conversation) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { aiPaused },
  })

  return NextResponse.json({ ok: true })
}
