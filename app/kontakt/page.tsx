'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function KontaktForm() {
  const params = useSearchParams()
  const produkt = params.get('produkt') || ''

  return (
    <div className="form-card">
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Jetzt starten.</h2>
      <p style={{ marginBottom: '2rem' }}>Trag dich ein – wir melden uns innerhalb von 24h und richten alles gemeinsam ein.</p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grp">
          <label>Name</label>
          <input type="text" placeholder="Dein Name" required />
        </div>
        <div className="grp">
          <label>E-Mail</label>
          <input type="email" placeholder="deine@email.de" required />
        </div>
        <div className="grp">
          <label>Telefonnummer (optional)</label>
          <input type="tel" placeholder="+49 ..." />
        </div>
        <div className="grp">
          <label>Ich interessiere mich für</label>
          <select defaultValue={produkt}>
            <option value="">Bitte wählen</option>
            <option value="autochat">AutoChat – WhatsApp automatisch beantworten (€39/Monat)</option>
            <option value="mailpilot">MailPilot – E-Mails automatisch sortieren (€29/Monat)</option>
            <option value="beides">Beides</option>
          </select>
        </div>
        <div className="grp">
          <label>Kurze Beschreibung (optional)</label>
          <textarea rows={3} placeholder="Was machst du, was beschäftigt dich?" />
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Anfrage absenden</button>
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
            <Link href="/kontakt" className="btn-primary small">Kostenlos starten</Link>
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
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
