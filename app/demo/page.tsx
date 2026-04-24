import { prisma } from '@/lib/prisma'
import { constantTimeEqual } from '@/lib/security'
import crypto from 'crypto'
import DemoSetup from './DemoSetup'

export const dynamic = 'force-dynamic'

export default async function DemoPage({ searchParams }: { searchParams: { key?: string } }) {
  const adminKey = process.env.ADMIN_KEY ?? ''
  const providedKey = searchParams.key ?? ''

  if (!adminKey || !providedKey || !constantTimeEqual(providedKey, adminKey)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#dc2626' }}>Unauthorized – ungültiger Admin-Key.</p>
      </div>
    )
  }

  try {
    const email = 'demo@joka.ai'
    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

    const customer = await prisma.customer.upsert({
      where: { email },
      update: { inboxToken: token, inboxTokenExpiry: expiry, subscriptionStatus: 'ACTIVE' },
      create: {
        email,
        name: 'Demo Account',
        stripeCustomerId: 'demo',
        subscriptionStatus: 'ACTIVE',
        inboxToken: token,
        inboxTokenExpiry: expiry,
      },
    })

    const config = await prisma.autoChatConfig.upsert({
      where: { customerId: customer.id },
      update: {},
      create: {
        customerId: customer.id,
        businessName: 'Friseur Mustermann',
        businessAddress: 'Musterstraße 1, 12345 Berlin',
        openingHours: 'Mo–Fr 9–18 Uhr, Sa 9–14 Uhr',
        services: 'Haarschnitt €18, Bart-Trim €10, Färben ab €35',
      },
    })

    const existing = await prisma.conversation.count({ where: { autoChatConfigId: config.id } })
    if (existing === 0) {
      await prisma.conversation.create({
        data: {
          autoChatConfigId: config.id,
          customerPhone: '+491511234567',
          messages: {
            create: [
              { role: 'USER', content: 'Hallo, was kostet ein Herrenhaarschnitt?' },
              { role: 'ASSISTANT', content: 'Hallo! Ein Herrenhaarschnitt kostet bei uns €18. Möchtest du einen Termin buchen?' },
              { role: 'USER', content: 'Ja, habt ihr Samstag um 10 Uhr was frei?' },
              { role: 'ASSISTANT', content: 'Samstag um 10 Uhr ist noch frei! Soll ich den Termin für dich reservieren?' },
            ],
          },
        },
      })
      await prisma.conversation.create({
        data: {
          autoChatConfigId: config.id,
          customerPhone: '+491709876543',
          messages: {
            create: [
              { role: 'USER', content: 'Macht ihr auch Färben?' },
              { role: 'ASSISTANT', content: 'Ja, Färben bieten wir ab €35 an. Soll ich dir einen Termin einrichten?' },
            ],
          },
        },
      })
    }

    return <DemoSetup token={token} />
  } catch (err) {
    const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
    const stack = err instanceof Error && err.stack ? err.stack : ''
    console.error('Demo setup error:', err)
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: 'monospace', background: '#fff' }}>
        <h1 style={{ color: '#dc2626', fontFamily: 'sans-serif' }}>Demo Setup Error</h1>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#fef2f2', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>{message}</pre>
        {stack && <pre style={{ whiteSpace: 'pre-wrap', background: '#f9fafb', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', marginTop: '1rem' }}>{stack}</pre>}
      </div>
    )
  }
}
