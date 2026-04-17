import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWhatsAppReply } from '@/lib/claude'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

// Meta Webhook-Verifizierung
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}

// Eingehende WhatsApp-Nachrichten
export async function POST(req: NextRequest) {
  const body = await req.json()

  const entry = body.entry?.[0]
  const change = entry?.changes?.[0]
  const value = change?.value

  // Nur Text-Nachrichten verarbeiten
  const messageObj = value?.messages?.[0]
  if (!messageObj || messageObj.type !== 'text') {
    return NextResponse.json({ received: true })
  }

  const phoneNumberId: string = value.metadata?.phone_number_id
  const from: string = messageObj.from // Kundentelefonnummer
  const text: string = messageObj.text?.body ?? ''

  if (!text || !phoneNumberId) return NextResponse.json({ received: true })

  // AutoChatConfig anhand der Phone Number ID finden
  const config = await prisma.autoChatConfig.findFirst({
    where: { phoneNumberId },
  })
  if (!config || !config.accessToken) return NextResponse.json({ received: true })

  // Conversation holen oder anlegen
  let conversation = await prisma.conversation.findFirst({
    where: { autoChatConfigId: config.id, customerPhone: from },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { autoChatConfigId: config.id, customerPhone: from },
      include: { messages: { orderBy: { createdAt: 'asc' }, take: 20 } },
    })
  }

  // Neue Nachricht speichern
  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'USER', content: text },
  })

  // KI pausiert → nicht antworten
  if (conversation.aiPaused) return NextResponse.json({ received: true })

  // System Prompt zusammenbauen
  const systemPrompt =
    config.systemPrompt ??
    `Du bist ein freundlicher WhatsApp-Assistent für ${config.businessName ?? 'dieses Unternehmen'}.
Adresse: ${config.businessAddress ?? 'nicht angegeben'}
Öffnungszeiten: ${config.openingHours ?? 'nicht angegeben'}
Leistungen & Preise: ${config.services ?? 'nicht angegeben'}

Antworte kurz und freundlich auf Deutsch. Wenn du etwas nicht weißt, sage es ehrlich.`

  // Claude-Antwort generieren
  const history = conversation.messages.map((m) => ({
    role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }))
  history.push({ role: 'user', content: text })

  const reply = await getWhatsAppReply(systemPrompt, history)

  // Antwort speichern
  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply },
  })

  // Antwort senden
  await sendWhatsAppMessage(from, reply, phoneNumberId, config.accessToken)

  return NextResponse.json({ received: true })
}
