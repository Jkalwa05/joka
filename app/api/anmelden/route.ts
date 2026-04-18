import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-Mail fehlt' }, { status: 400 })

  const customer = await prisma.customer.findUnique({ where: { email } })
  if (!customer || customer.subscriptionStatus === 'CANCELED') {
    return NextResponse.json({ error: 'Kein aktives Konto gefunden.' }, { status: 404 })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  await prisma.customer.update({
    where: { id: customer.id },
    data: { inboxToken: token, inboxTokenExpiry: expiry },
  })

  return NextResponse.json({ token })
}
