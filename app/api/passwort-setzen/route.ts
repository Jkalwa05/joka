import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { token, password } = await req.json()

  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Token und Passwort (min. 8 Zeichen) erforderlich.' }, { status: 400 })
  }

  const customer = await prisma.customer.findFirst({
    where: { inboxToken: token, inboxTokenExpiry: { gt: new Date() } },
  })

  if (!customer) {
    return NextResponse.json({ error: 'Ungültiger oder abgelaufener Link.' }, { status: 401 })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.customer.update({
    where: { id: customer.id },
    data: { passwordHash },
  })

  return NextResponse.json({ ok: true })
}
