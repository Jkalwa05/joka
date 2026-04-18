import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/password'
import { rateLimit } from '@/lib/security'
import { getIp } from '@/lib/auth'
import crypto from 'crypto'

const GENERIC_ERROR = 'E-Mail oder Passwort falsch.'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    const ip = getIp(req)
    if (!rateLimit(`login:${ip}`, 10, 60_000) || !rateLimit(`login:email:${String(email).toLowerCase()}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Zu viele Versuche. Bitte kurz warten.' }, { status: 429 })
    }

    const customer = await prisma.customer.findUnique({ where: { email } })
    const hasUsableAccount =
      !!customer && customer.subscriptionStatus !== 'CANCELED' && !!customer.passwordHash

    // timing-stabile Prüfung: verifyPassword läuft in allen Pfaden (Dummy-Hash fallback intern)
    const valid = verifyPassword(password, customer?.passwordHash ?? null)

    if (!hasUsableAccount || !valid) {
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    await prisma.customer.update({
      where: { id: customer!.id },
      data: { inboxToken: token, inboxTokenExpiry: expiry },
    })

    return NextResponse.json({ token })
  } catch (err) {
    console.error('Anmelden error:', err)
    return NextResponse.json({ error: 'Serverfehler. Bitte versuche es erneut.' }, { status: 500 })
  }
}
