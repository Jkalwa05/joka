import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, telefon, produkt, nachricht } = await req.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name und E-Mail sind Pflichtfelder.' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('RESEND_API_KEY fehlt')
    return NextResponse.json({ error: 'E-Mail-Konfiguration fehlt.' }, { status: 500 })
  }

  const produktLabel = produkt === 'autochat' ? 'AutoChat (€39/Monat)' : produkt === 'mailpilot' ? 'MailPilot (€29/Monat)' : produkt === 'beides' ? 'AutoChat + MailPilot' : 'Nicht angegeben'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Joka Anfragen <onboarding@resend.dev>',
      to: 'kalwajonas@gmail.com',
      reply_to: email,
      subject: `Neue Anfrage von ${name}`,
      html: `
        <h2>Neue Anfrage über joka.de</h2>
        <table style="border-collapse:collapse;font-size:15px;">
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Name</td><td><strong>${name}</strong></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">E-Mail</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Telefon</td><td>${telefon || '–'}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Produkt</td><td>${produktLabel}</td></tr>
          <tr><td style="padding:6px 16px 6px 0;color:#64748b">Nachricht</td><td>${nachricht || '–'}</td></tr>
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
