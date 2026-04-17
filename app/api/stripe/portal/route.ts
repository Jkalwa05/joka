import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-Mail fehlt.' }, { status: 400 })
  }

  const customer = await prisma.customer.findUnique({ where: { email } })

  if (!customer?.stripeCustomerId) {
    // Kein Hinweis ob E-Mail existiert (verhindert User-Enumeration)
    return NextResponse.json({ ok: true })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/mein-abo`,
  })

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Joka <onboarding@resend.dev>',
      to: email,
      subject: 'Dein Joka-Abo verwalten',
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:2rem">
          <h2 style="color:#0f172a;margin-bottom:0.5rem">Dein Joka-Abo</h2>
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
  })

  return NextResponse.json({ ok: true })
}
