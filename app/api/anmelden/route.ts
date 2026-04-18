import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'E-Mail und Passwort erforderlich.' }, { status: 400 })

    const customer = await prisma.customer.findUnique({ where: { email } })

    if (!customer || customer.subscriptionStatus === 'CANCELED') {
      return NextResponse.json({ error: 'Kein aktives Konto gefunden.' }, { status: 401 })
    }

    if (!customer.passwordHash) {
      return NextResponse.json({ error: 'Noch kein Passwort gesetzt. Bitte nutze den Link aus deiner Willkommens-E-Mail.' }, { status: 401 })
    }

    const valid = verifyPassword(password, customer.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    await prisma.customer.update({
      where: { id: customer.id },
      data: { inboxToken: token, inboxTokenExpiry: expiry },
    })

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Anmelden error:', err)
    return NextResponse.json({ error: 'Serverfehler. Bitte versuche es erneut.' }, { status: 500 })
  }
}
