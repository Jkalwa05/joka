import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, escapeHtml } from '@/lib/security'
import { getIp } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { name, email, telefon, produkt, nachricht } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name und E-Mail sind Pflichtfelder.' }, { status: 400 })
  }

  const ip = getIp(req)
  if (!rateLimit(`kontakt:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Zu viele Anfragen. Bitte später erneut.' }, { status: 429 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY fehlt')
    return NextResponse.json({ error: 'E-Mail-Konfiguration fehlt.' }, { status: 500 })
  }

  const produktLabel =
    produkt === 'autochat' ? 'AutoChat (€39/Monat)' :
    produkt === 'mailpilot' ? 'MailPilot (€29/Monat)' :
    produkt === 'beides' ? 'AutoChat + MailPilot' :
    'Nicht angegeben'

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeTelefon = escapeHtml(telefon) || '–'
  const safeNachricht = escapeHtml(nachricht) || '–'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Joka Chat Anfragen <noreply@joka.ai>',
      to: 'joka.chat.business@gmail.com',
      reply_to: email,
      subject: `Neue Anfrage von ${safeName}`,
      html: `
        <h2>Neue Anfrage über Joka Chat</h2>
        <table style="border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Name</td><td><strong>${safeName}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">E-Mail</td><td><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Telefon</td><td>${safeTelefon}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Produkt</td><td>${produktLabel}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Nachricht</td><td>${safeNachricht}</td></tr>
        </table>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend Fehler:', err)
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
