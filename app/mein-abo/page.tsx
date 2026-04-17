'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function MeinAbo() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setSent(true)
    } else {
      setError('Etwas ist schiefgelaufen. Bitte versuche es erneut.')
    }
    setLoading(false)
  }

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

      <section className="section" style={{ paddingTop: '10rem', minHeight: '80vh' }}>
        <div className="container-wide" style={{ maxWidth: '520px' }}>
          {sent ? (
            <div className="form-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Link gesendet!</h2>
              <p style={{ marginBottom: '1.5rem' }}>
                Falls ein Joka-Konto mit dieser E-Mail existiert, hast du soeben einen Link erhalten um dein Abo zu verwalten.
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Nichts erhalten? Schau im Spam-Ordner oder schreib uns: <a href="mailto:jkbusiness@gmail.com" style={{ color: 'var(--primary)' }}>jkbusiness@gmail.com</a>
              </p>
            </div>
          ) : (
            <div className="form-card">
              <span className="sub-label">Abo-Verwaltung</span>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Mein Abo</h2>
              <p style={{ marginBottom: '2rem' }}>
                Gib deine E-Mail-Adresse ein – wir schicken dir einen Link um dein Abo zu verwalten, zu kündigen oder deine Zahlungsmethode zu ändern.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="grp">
                  <label>E-Mail-Adresse</label>
                  <input
                    type="email"
                    placeholder="deine@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Wird gesendet...' : 'Link senden →'}
                </button>
              </form>

              <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Fragen? <a href="mailto:jkbusiness@gmail.com" style={{ color: 'var(--primary)' }}>jkbusiness@gmail.com</a>
              </p>
            </div>
          )}
        </div>
      </section>

      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:jkbusiness@gmail.com" style={{ color: 'var(--primary)' }}>jkbusiness@gmail.com</a></span></p>
            <a href="https://jonaskalwa.de" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
          </div>
          <div className="footer-links">
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
