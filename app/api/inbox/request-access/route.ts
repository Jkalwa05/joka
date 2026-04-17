import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'E-Mail fehlt' }, { status: 400 })

  const customer = await prisma.customer.findUnique({
    where: { email },
    include: { autoChatConfig: true },
  })

  if (!customer || !customer.autoChatConfig) {
    return NextResponse.json({ error: 'Kein AutoChat-Konto gefunden' }, { status: 404 })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

  await prisma.customer.update({
    where: { id: customer.id },
    data: { inboxToken: token, inboxTokenExpiry: expiry },
  })

  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/inbox?token=${token}`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Joka <onboarding@resend.dev>',
      to: email,
      subject: 'Dein Joka Inbox-Zugang',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:2rem">
          <h2 style="color:#0f172a">Dein Inbox-Link</h2>
          <p style="color:#64748b">Klick auf den Button um deine WhatsApp-Konversationen einzusehen und zu antworten.</p>
          <a href="${link}" style="display:inline-block;margin-top:1rem;background:#006266;color:white;padding:0.75rem 1.5rem;border-radius:50px;text-decoration:none;font-weight:600">Inbox öffnen →</a>
          <p style="color:#94a3b8;font-size:0.8rem;margin-top:2rem">Link ist 24 Stunden gültig.</p>
        </div>
      `,
    }),
  })

  return NextResponse.json({ ok: true })
}
