import { NextRequest, NextResponse } from 'next/server'
import { validateInboxToken } from '@/lib/auth'
import { getMicrosoftAuthUrl } from '@/lib/microsoft'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  // Variante A: direkter customerId (vom Onboarding nach Stripe-Checkout)
  const customerId = req.nextUrl.searchParams.get('customerId')
  if (customerId) {
    const exists = await prisma.customer.findUnique({ where: { id: customerId }, select: { id: true } })
    if (!exists) return NextResponse.json({ error: 'Unbekannter Kunde' }, { status: 404 })
    return NextResponse.redirect(getMicrosoftAuthUrl(customerId))
  }

  // Variante B: per inbox-token (nachträgliches Verbinden aus der Inbox)
  const token = req.nextUrl.searchParams.get('token')
  const customer = await validateInboxToken(token)
  if (!customer) {
    return NextResponse.json({ error: 'Ungültiger Zugang' }, { status: 401 })
  }
  return NextResponse.redirect(getMicrosoftAuthUrl(customer.id))
}
