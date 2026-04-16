import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const product = req.nextUrl.searchParams.get('product')

  if (!sessionId || !product) {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
  const email =
    stripeSession.customer_email ?? stripeSession.customer_details?.email

  if (!email) {
    return NextResponse.json({ error: 'Keine E-Mail in Session' }, { status: 400 })
  }

  // Bis zu 5 Versuche — Webhook kann kurz verzögert sein
  for (let i = 0; i < 5; i++) {
    const customer = await prisma.customer.findUnique({ where: { email } })
    if (customer) {
      return NextResponse.json({ customerId: customer.id, email, product })
    }
    await new Promise((r) => setTimeout(r, 1000))
  }

  return NextResponse.json(
    { error: 'Kunde noch nicht in Datenbank. Bitte Seite neu laden.' },
    { status: 404 }
  )
}
