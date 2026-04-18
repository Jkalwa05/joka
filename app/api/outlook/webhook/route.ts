import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { classifyEmail } from '@/lib/claude'
import {
  getOutlookMessage,
  moveOutlookMessageToFolder,
  createOutlookCalendarEvent,
  renewOutlookSubscription,
} from '@/lib/microsoft'
import { constantTimeEqual } from '@/lib/security'

type GraphNotification = {
  subscriptionId: string
  clientState?: string
  changeType: string
  resource: string
  resourceData?: { id?: string; '@odata.id'?: string; '@odata.type'?: string }
  lifecycleEvent?: 'reauthorizationRequired' | 'subscriptionRemoved' | 'missed'
}

export async function POST(req: NextRequest) {
  // Microsoft Graph Subscription Validation (erster POST bei Anlage)
  const validationToken = req.nextUrl.searchParams.get('validationToken')
  if (validationToken) {
    return new NextResponse(validationToken, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const secret = process.env.OUTLOOK_WEBHOOK_SECRET ?? ''
  if (!secret) {
    console.warn('[outlook] OUTLOOK_WEBHOOK_SECRET fehlt – Webhook nicht sicher')
  }

  let body: { value?: GraphNotification[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const notifications = body.value ?? []
  if (notifications.length === 0) return NextResponse.json({ ok: true })

  await Promise.all(
    notifications.map(async (n) => {
      try {
        // clientState prüfen
        if (secret && (!n.clientState || !constantTimeEqual(n.clientState, secret))) {
          console.warn('[outlook] Ungültiger clientState')
          return
        }

        const config = await prisma.mailPilotConfig.findFirst({
          where: { outlookSubscriptionId: n.subscriptionId },
        })
        if (!config) return

        // Lifecycle Events
        if (n.lifecycleEvent === 'reauthorizationRequired') {
          try {
            const updated = await renewOutlookSubscription(config.customerId, n.subscriptionId)
            await prisma.mailPilotConfig.update({
              where: { id: config.id },
              data: { outlookSubscriptionExpiry: updated.expiresAt },
            })
          } catch (err) {
            console.error('[outlook] Subscription renewal fehlgeschlagen:', err)
          }
          return
        }
        if (n.lifecycleEvent === 'subscriptionRemoved') {
          await prisma.mailPilotConfig.update({
            where: { id: config.id },
            data: { outlookSubscriptionId: null, outlookSubscriptionExpiry: null },
          })
          return
        }

        // Change notifications für neue Mails
        if (n.changeType !== 'created') return
        const messageId = n.resourceData?.id
        if (!messageId) return

        const msg = await getOutlookMessage(config.customerId, messageId)
        const { label, calendarEvent } = await classifyEmail(msg.subject, msg.snippet)

        await moveOutlookMessageToFolder(config.customerId, messageId, label)
        if (calendarEvent) {
          await createOutlookCalendarEvent(
            config.customerId,
            calendarEvent.title,
            calendarEvent.date,
            calendarEvent.time
          )
        }
      } catch (err) {
        console.error('[outlook] Notification-Fehler:', err)
      }
    })
  )

  return NextResponse.json({ ok: true })
}
