import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token, conversationId, aiPaused } = await req.json()
  if (!token || !conversationId || aiPaused === undefined) {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }

  const customer = await prisma.customer.findUnique({
    where: { inboxToken: token },
    include: { autoChatConfig: true },
  })
  if (!customer || !customer.inboxTokenExpiry || customer.inboxTokenExpiry < new Date()) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, autoChatConfigId: customer.autoChatConfig!.id },
  })
  if (!conversation) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { aiPaused },
  })

  return NextResponse.json({ ok: true })
}
