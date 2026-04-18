import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWhatsAppReply } from '@/lib/claude'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

const APPOINTMENT_KEYWORDS = ['termin', 'buchen', 'reservier', 'verfügbar', 'frei haben', 'frei am', 'frei um', 'wann kann', 'wann habt', 'noch platz', 'appointment']

export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const entry = body.entry?.[0]
  const change = entry?.changes?.[0]
  const value = change?.value

  const messageObj = value?.messages?.[0]
  if (!messageObj || messageObj.type !== 'text') {
    return NextResponse.json({ received: true })
  }

  const phoneNumberId: string = value.metadata?.phone_number_id
  const from: string = messageObj.from
  const text: string = messageObj.text?.body ?? ''

  if (!text || !phoneNumberId) return NextResponse.json({ received: true })

  const config = await prisma.autoChatConfig.findFirst({ where: { phoneNumberId } })
  if (!config || !config.accessToken) return NextResponse.json({ received: true })

  // Fetch conversation without messages first to avoid loading history on early exits
  let conversation = await prisma.conversation.findFirst({
    where: { autoChatConfigId: config.id, customerPhone: from },
  })

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { autoChatConfigId: config.id, customerPhone: from },
    })
  }

  await prisma.message.create({
    data: { conversationId: conversation.id, role: 'USER', content: text },
  })

  if (conversation.aiPaused) return NextResponse.json({ received: true })

  const lowerText = text.toLowerCase()
  if (APPOINTMENT_KEYWORDS.some(kw => lowerText.includes(kw))) {
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { aiPaused: true, needsReview: true },
    })
    return NextResponse.json({ received: true })
  }

  // Load message history only when AI will actually respond
  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    take: 20,
  })

  const systemPrompt =
    config.systemPrompt ??
    `Du bist ein freundlicher WhatsApp-Assistent für ${config.businessName ?? 'dieses Unternehmen'}.
Adresse: ${config.businessAddress ?? 'nicht angegeben'}
Öffnungszeiten: ${config.openingHours ?? 'nicht angegeben'}
Leistungen & Preise: ${config.services ?? 'nicht angegeben'}

Antworte kurz und freundlich auf Deutsch. Wenn du etwas nicht weißt, sage es ehrlich.`

  const history = messages.map((m) => ({
    role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }))
  history.push({ role: 'user', content: text })

  const reply = await getWhatsAppReply(systemPrompt, history)

  await Promise.all([
    prisma.message.create({ data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply } }),
    sendWhatsAppMessage(from, reply, phoneNumberId, config.accessToken),
  ])

  return NextResponse.json({ received: true })
}
