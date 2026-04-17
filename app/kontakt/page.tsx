'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function KontaktForm() {
  const params = useSearchParams()
  const [form, setForm] = useState({
    name: '', email: '', telefon: '', produkt: params.get('produkt') || '', nachricht: '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/kontakt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Unbekannter Fehler.')
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="form-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✓</div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Nachricht angekommen!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Wir melden uns innerhalb von 24h bei dir.</p>
      </div>
    )
  }

  return (
    <div className="form-card">
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Fragen? Meld dich.</h2>
      <p style={{ marginBottom: '2rem' }}>Schreib uns kurz – wir antworten innerhalb von 24h.</p>

      <form onSubmit={handleSubmit}>
        <div className="grp">
          <label>Name</label>
          <input type="text" placeholder="Dein Name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
        </div>
        <div className="grp">
          <label>E-Mail</label>
          <input type="email" placeholder="deine@email.de" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </div>
        <div className="grp">
          <label>Telefonnummer (optional)</label>
          <input type="tel" placeholder="+49 ..." value={form.telefon} onChange={(e) => update('telefon', e.target.value)} />
        </div>
        <div className="grp">
          <label>Ich interessiere mich für</label>
          <select value={form.produkt} onChange={(e) => update('produkt', e.target.value)}>
            <option value="">Bitte wählen</option>
            <option value="autochat">AutoChat – WhatsApp automatisch beantworten (€39/Monat)</option>
            <option value="mailpilot">MailPilot – E-Mails automatisch sortieren (€29/Monat)</option>
            <option value="beides">Beides</option>
          </select>
        </div>
        <div className="grp">
          <label>Kurze Beschreibung (optional)</label>
          <textarea rows={3} placeholder="Was machst du, was beschäftigt dich?" value={form.nachricht} onChange={(e) => update('nachricht', e.target.value)} />
        </div>
        {error && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Wird gesendet...' : 'Nachricht senden'}
        </button>
      </form>
    </div>
  )
}

export default function Kontakt() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      <section className="section" style={{ paddingTop: '10rem' }}>
        <div className="container-wide" style={{ maxWidth: '700px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="sub-label">Kontakt</span>
          </div>
          <Suspense fallback={<div>Laden...</div>}>
            <KontaktForm />
          </Suspense>
        </div>
      </section>

      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:jkbusiness@gmail.com" style={{ color: 'var(--primary)' }}>jkbusiness@gmail.com</a></span></p>
            <a href="https://jonaskalwa.de" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
          </div>
          <div className="footer-links">
            <Link href="/mein-abo">Mein Abo</Link>
            <span className="separator">|</span>
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
