import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNewMessages, applyGmailLabel, createCalendarEvent } from '@/lib/google'
import { classifyEmail } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Pub/Sub Nachricht dekodieren
  const messageData = body.message?.data
  if (!messageData) return NextResponse.json({ ok: true })

  const decoded = JSON.parse(Buffer.from(messageData, 'base64').toString('utf-8'))
  const gmailAddress: string = decoded.emailAddress
  const historyId: string = String(decoded.historyId)

  if (!gmailAddress) return NextResponse.json({ ok: true })

  // MailPilotConfig anhand Gmail-Adresse finden
  const config = await prisma.mailPilotConfig.findFirst({
    where: { gmailAddress },
  })
  if (!config || !config.gmailHistoryId) return NextResponse.json({ ok: true })

  // Neue Nachrichten seit letztem historyId holen
  const { messages, newHistoryId } = await getNewMessages(
    config.customerId,
    config.gmailHistoryId
  )

  // Jede neue Nachricht klassifizieren und verarbeiten
  for (const msg of messages) {
    try {
      const { label, calendarEvent } = await classifyEmail(msg.subject, msg.snippet)

      await applyGmailLabel(config.customerId, msg.id, label)

      if (calendarEvent) {
        await createCalendarEvent(
          config.customerId,
          calendarEvent.title,
          calendarEvent.date,
          calendarEvent.time
        )
      }
    } catch (err) {
      console.error(`Fehler bei Nachricht ${msg.id}:`, err)
    }
  }

  // historyId aktualisieren
  await prisma.mailPilotConfig.update({
    where: { id: config.id },
    data: { gmailHistoryId: newHistoryId },
  })

  return NextResponse.json({ ok: true })
}
