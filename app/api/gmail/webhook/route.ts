import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getNewMessages, applyGmailLabel, createCalendarEvent } from '@/lib/google'
import { classifyEmail } from '@/lib/claude'
import { constantTimeEqual } from '@/lib/security'

export async function POST(req: NextRequest) {
  const secret = process.env.GMAIL_WEBHOOK_SECRET
  if (secret) {
    const provided =
      req.nextUrl.searchParams.get('token') ||
      req.headers.get('x-webhook-secret') ||
      ''
    if (!provided || !constantTimeEqual(provided, secret)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else {
    console.warn('[gmail] GMAIL_WEBHOOK_SECRET fehlt – Webhook ist nicht authentifiziert')
  }

  const body = await req.json()

  const messageData = body.message?.data
  if (!messageData) return NextResponse.json({ ok: true })

  let decoded: { emailAddress?: string; historyId?: number | string }
  try {
    decoded = JSON.parse(Buffer.from(messageData, 'base64').toString('utf-8'))
  } catch {
    return NextResponse.json({ ok: true })
  }

  const gmailAddress = decoded.emailAddress
  if (!gmailAddress) return NextResponse.json({ ok: true })

  const config = await prisma.mailPilotConfig.findFirst({ where: { gmailAddress } })
  if (!config || !config.gmailHistoryId) return NextResponse.json({ ok: true })

  const { messages, newHistoryId } = await getNewMessages(config.customerId, config.gmailHistoryId)

  await Promise.all(
    messages.map(async (msg) => {
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
    })
  )

  await prisma.mailPilotConfig.update({
    where: { id: config.id },
    data: { gmailHistoryId: String(newHistoryId) },
  })

  return NextResponse.json({ ok: true })
}
