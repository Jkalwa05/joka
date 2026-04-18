import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWhatsAppReply, parseAppointmentIntent } from '@/lib/claude'
import { sendWhatsAppMessage } from '@/lib/whatsapp'
import { verifyHmacSignature } from '@/lib/security'
import { hasGoogleConnection, createCalendarEvent } from '@/lib/google'

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
  const raw = await req.text()

  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (appSecret) {
    const sig = req.headers.get('x-hub-signature-256')
    if (!verifyHmacSignature(raw, sig, appSecret, 'sha256')) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  } else {
    console.warn('[whatsapp] WHATSAPP_APP_SECRET fehlt – Webhook-Signatur wird NICHT verifiziert')
  }

  let body: {
    entry?: Array<{
      changes?: Array<{
        value?: {
          metadata?: { phone_number_id?: string }
          messages?: Array<{ type?: string; from?: string; text?: { body?: string } }>
        }
      }>
    }>
  }
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const value = body.entry?.[0]?.changes?.[0]?.value
  const messageObj = value?.messages?.[0]
  if (!messageObj || messageObj.type !== 'text') {
    return NextResponse.json({ received: true })
  }

  const phoneNumberId = value?.metadata?.phone_number_id
  const from = messageObj.from
  const text = messageObj.text?.body ?? ''

  if (!text || !phoneNumberId || !from) return NextResponse.json({ received: true })

  const config = await prisma.autoChatConfig.findFirst({ where: { phoneNumberId } })
  if (!config || !config.accessToken) return NextResponse.json({ received: true })

  let conversation = await prisma.conversation.findFirst({
    where: { autoChatConfigId: config.id, customerPhone: from },
  })
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { autoChatConfigId: config.id, customerPhone: from },
    })
  }

  if (conversation.aiPaused) {
    await prisma.message.create({
      data: { conversationId: conversation.id, role: 'USER', content: text },
    })
    return NextResponse.json({ received: true })
  }

  const lowerText = text.toLowerCase()
  const maybeAppointment = APPOINTMENT_KEYWORDS.some((kw) => lowerText.includes(kw))

  // Historie vorab laden (neueste 20, chronologisch)
  const recent = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  recent.reverse()
  const history: { role: 'user' | 'assistant'; content: string }[] = recent.map((m) => ({
    role: m.role === 'USER' ? 'user' : 'assistant',
    content: m.content,
  }))

  // TERMINWUNSCH: Wenn Kalender verbunden, versuche automatische Buchung
  if (maybeAppointment) {
    const calendarConnected = await hasGoogleConnection(config.customerId)

    if (calendarConnected) {
      const parsed = await parseAppointmentIntent(
        text,
        { businessName: config.businessName, services: config.services, openingHours: config.openingHours },
        history
      )

      if (parsed) {
        try {
          await createCalendarEvent(config.customerId, `${parsed.title} (${from})`, parsed.date, parsed.time)
          const humanDate = new Date(parsed.date + (parsed.time ? `T${parsed.time}` : 'T00:00')).toLocaleDateString('de-DE', {
            weekday: 'long', day: '2-digit', month: 'long',
          })
          const confirm = parsed.time
            ? `Dein Termin am ${humanDate} um ${parsed.time} Uhr ist eingetragen. Bis dann!`
            : `Dein Termin am ${humanDate} ist eingetragen. Bis dann!`

          await Promise.all([
            prisma.message.create({ data: { conversationId: conversation.id, role: 'USER', content: text } }),
            prisma.message.create({ data: { conversationId: conversation.id, role: 'ASSISTANT', content: confirm } }),
            sendWhatsAppMessage(from, confirm, phoneNumberId, config.accessToken),
          ])
          return NextResponse.json({ received: true })
        } catch (err) {
          console.error('[whatsapp] Kalender-Event fehlgeschlagen:', err)
          // Fallback: markiere für manuelle Prüfung (siehe unten)
        }
      }
    }

    // Kein Kalender / Parsing fehlgeschlagen → manuelle Prüfung
    await Promise.all([
      prisma.message.create({ data: { conversationId: conversation.id, role: 'USER', content: text } }),
      prisma.conversation.update({
        where: { id: conversation.id },
        data: { aiPaused: true, needsReview: true },
      }),
    ])
    return NextResponse.json({ received: true })
  }

  const systemPrompt =
    config.systemPrompt ??
    `Du bist ein freundlicher WhatsApp-Assistent für ${config.businessName ?? 'dieses Unternehmen'}.
Adresse: ${config.businessAddress ?? 'nicht angegeben'}
Öffnungszeiten: ${config.openingHours ?? 'nicht angegeben'}
Leistungen & Preise: ${config.services ?? 'nicht angegeben'}

Antworte kurz und freundlich auf Deutsch. Wenn du etwas nicht weißt, sage es ehrlich.`

  history.push({ role: 'user', content: text })

  // Parallel: User-Message speichern + Claude-Antwort holen
  const [, reply] = await Promise.all([
    prisma.message.create({
      data: { conversationId: conversation.id, role: 'USER', content: text },
    }),
    getWhatsAppReply(systemPrompt, history),
  ])

  // Parallel: Assistant-Message speichern + Senden
  await Promise.all([
    prisma.message.create({
      data: { conversationId: conversation.id, role: 'ASSISTANT', content: reply },
    }),
    sendWhatsAppMessage(from, reply, phoneNumberId, config.accessToken),
  ])

  return NextResponse.json({ received: true })
}
