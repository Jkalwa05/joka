import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { rateLimit } from '@/lib/security'
import { getIp } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()

    if (!token || !password || password.length < 8) {
      return NextResponse.json({ error: 'Token und Passwort (min. 8 Zeichen) erforderlich.' }, { status: 400 })
    }

    const ip = getIp(req)
    if (!rateLimit(`pwset:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Zu viele Versuche. Bitte kurz warten.' }, { status: 429 })
    }

    const customer = await prisma.customer.findFirst({
      where: { inboxToken: token, inboxTokenExpiry: { gt: new Date() } },
      select: { id: true },
    })

    if (!customer) {
      return NextResponse.json({ error: 'Ungültiger oder abgelaufener Link.' }, { status: 401 })
    }

    const passwordHash = hashPassword(password)
    await prisma.customer.update({
      where: { id: customer.id },
      data: { passwordHash },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Passwort-setzen error:', err)
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 })
  }
}
