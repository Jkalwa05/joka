import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/security'
import { getIp } from '@/lib/auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { email, token } = await req.json()

  if (!email && !token) {
    return NextResponse.json({ error: 'E-Mail oder Token fehlt.' }, { status: 400 })
  }

  const ip = getIp(req)
  const key = token ? `portal-token:${ip}` : `portal-email:${ip}:${String(email).toLowerCase()}`
  if (!rateLimit(key, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: true })
  }

  const customer = token
    ? await prisma.customer.findFirst({ where: { inboxToken: token, inboxTokenExpiry: { gt: new Date() } } })
    : await prisma.customer.findUnique({ where: { email } })

  if (!customer?.stripeCustomerId) {
    return NextResponse.json({ ok: true })
  }

  let session: { url: string }
  try {
    session = await stripe.billingPortal.sessions.create({
      customer: customer.stripeCustomerId,
      return_url: token ? `${process.env.NEXTAUTH_URL}/dashboard` : `${process.env.NEXTAUTH_URL}/mein-abo`,
    })
  } catch (err) {
    console.error('Stripe portal error:', err)
    return NextResponse.json({ error: 'Stripe Portal nicht verfügbar.' }, { status: 500 })
  }

  if (token) {
    return NextResponse.json({ url: session.url })
  }

  // Fire-and-forget: E-Mail-Versand blockiert die Antwort nicht
  fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'joka.ai <noreply@joka.ai>',
      to: email,
      subject: 'Dein joka.ai-Abo verwalten',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem">
          <h2 style="color:#0f172a;margin-bottom:0.5rem">Dein joka.ai-Abo</h2>
          <p style="color:#64748b;margin-bottom:2rem">Klick auf den Button um dein Abo zu verwalten – Kündigen, Zahlungsmethode ändern oder Rechnungen einsehen.</p>
          <a href="${session.url}"
             style="background:#006266;color:white;padding:0.85rem 2rem;border-radius:50px;text-decoration:none;font-weight:600;display:inline-block">
            Abo verwalten →
          </a>
          <p style="color:#94a3b8;font-size:0.82rem;margin-top:2rem">
            Dieser Link ist 24 Stunden gültig. Falls du diese E-Mail nicht angefordert hast, kannst du sie ignorieren.
          </p>
        </div>
      `,
    }),
  }).catch((err) => console.error('[stripe/portal] Mail fehlgeschlagen:', err))

  return NextResponse.json({ ok: true })
}
