'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const links = [
  { href: '/dashboard', title: 'Dashboard / Inbox', desc: '3 Demo-Gespräche (eins gelb markiert für Review)' },
  { href: '/onboarding/autochat', title: 'Onboarding AutoChat', desc: 'Business-Infos + Google Kalender verbinden' },
  { href: '/onboarding', title: 'Onboarding MailPilot', desc: 'Gmail oder Outlook auswählen' },
  { href: '/onboarding/success', title: 'Checkout Success', desc: 'PWA-Install-Prompt testen' },
  { href: '/', title: 'Homepage', desc: 'Öffentliche Landingpage' },
  { href: '/autochat', title: 'AutoChat Produktseite', desc: 'Öffentlich' },
  { href: '/mailpilot', title: 'MailPilot Produktseite', desc: 'Öffentlich' },
]

export default function DemoSetup({ token }: { token: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('inboxToken', token)
    } catch {}
    setReady(true)
  }, [token])

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#006266', fontWeight: 700, letterSpacing: '1px', marginBottom: '0.5rem' }}>DEMO-ZUGANG AKTIVIERT</div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.75rem', color: '#0f172a' }}>Joka Demo</h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            {ready ? 'Du bist eingeloggt als demo@joka.chat. Klick dich durch.' : 'Wird eingerichtet…'}
          </p>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {links.map(({ href, title, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'block',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{title} →</div>
              <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{desc}</div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: '2.5rem', padding: '1rem 1.25rem', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', fontSize: '0.85rem', color: '#92400e' }}>
          <strong>Hinweis:</strong> Der Demo-Account hat subscriptionStatus=ACTIVE und einen 1-Jahr-gültigen inboxToken. Alle Änderungen hier beeinflussen keine echten Kunden.
        </div>
      </div>
    </div>
  )
}
