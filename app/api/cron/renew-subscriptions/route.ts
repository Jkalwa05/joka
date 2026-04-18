import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startGmailWatch } from '@/lib/google'
import { renewOutlookSubscription } from '@/lib/microsoft'
import { constantTimeEqual } from '@/lib/security'

export async function GET(req: NextRequest) {
  // Vercel Cron sendet Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization') ?? ''
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`
  if (!process.env.CRON_SECRET || !constantTimeEqual(authHeader, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const soon = new Date(Date.now() + 24 * 60 * 60 * 1000) // in 24h
  const now = new Date()

  const [gmailConfigs, outlookConfigs] = await Promise.all([
    prisma.mailPilotConfig.findMany({
      where: {
        provider: 'GMAIL',
        gmailWatchExpiry: { lt: soon, gt: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.mailPilotConfig.findMany({
      where: {
        provider: 'OUTLOOK',
        outlookSubscriptionId: { not: null },
        outlookSubscriptionExpiry: { lt: soon },
      },
    }),
  ])

  const results = { gmail: 0, outlook: 0, errors: [] as string[] }

  await Promise.all([
    ...gmailConfigs.map(async (cfg) => {
      try {
        const watch = await startGmailWatch(cfg.customerId)
        await prisma.mailPilotConfig.update({
          where: { id: cfg.id },
          data: {
            gmailHistoryId: watch.historyId ?? cfg.gmailHistoryId,
            gmailWatchExpiry: watch.expiration ? new Date(Number(watch.expiration)) : undefined,
          },
        })
        results.gmail++
      } catch (err) {
        results.errors.push(`gmail:${cfg.customerId}:${(err as Error).message}`)
      }
    }),
    ...outlookConfigs.map(async (cfg) => {
      if (!cfg.outlookSubscriptionId) return
      try {
        const r = await renewOutlookSubscription(cfg.customerId, cfg.outlookSubscriptionId)
        await prisma.mailPilotConfig.update({
          where: { id: cfg.id },
          data: { outlookSubscriptionExpiry: r.expiresAt },
        })
        results.outlook++
      } catch (err) {
        results.errors.push(`outlook:${cfg.customerId}:${(err as Error).message}`)
      }
    }),
  ])

  return NextResponse.json({ ok: true, ...results })
}
