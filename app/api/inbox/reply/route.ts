import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { validateInboxToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { token, conversationId, text } = await req.json()
  if (!token || !conversationId || !text) {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }

  const customer = await validateInboxToken(token)
  if (!customer?.autoChatConfig) {
    return NextResponse.json({ error: 'Ungültig' }, { status: 401 })
  }

  const config = customer.autoChatConfig
  if (!config.phoneNumberId || !config.accessToken) {
    return NextResponse.json({ error: 'WhatsApp nicht konfiguriert' }, { status: 400 })
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, autoChatConfigId: config.id },
  })
  if (!conversation) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  await sendWhatsAppMessage(conversation.customerPhone, text, config.phoneNumberId, config.accessToken)

  await Promise.all([
    prisma.message.create({
      data: { conversationId, role: 'ASSISTANT', content: text },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date(), needsReview: false },
    }),
  ])

  return NextResponse.json({ ok: true })
}
