'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

const PRODUCTS = {
  autochat: {
    name: 'AutoChat',
    price: '€39',
    description: 'WhatsApp automatisch beantworten – 24/7, in deinem Namen.',
    contactLabel: 'Deine WhatsApp Business-Nummer',
    contactPlaceholder: '+49 151 12345678',
    contactHelp: 'Die Nummer, auf der deine Kunden dir schreiben. AutoChat antwortet ab morgen automatisch.',
  },
  mailpilot: {
    name: 'MailPilot',
    price: '€29',
    description: 'E-Mails automatisch sortieren & Termine in Google Kalender eintragen.',
    contactLabel: 'Deine Gmail-Adresse',
    contactPlaceholder: 'dein@gmail.com',
    contactHelp: 'Das Gmail-Konto, das MailPilot ab morgen automatisch sortiert.',
  },
}

function BestellenForm() {
  const params = useSearchParams()
  const produktKey = params.get('produkt') as 'autochat' | 'mailpilot' | null
  const trial = params.get('trial') === '1'
  const product = produktKey && PRODUCTS[produktKey] ? PRODUCTS[produktKey] : null

  const [form, setForm] = useState({ name: '', email: '', businessContact: '', agreed: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product || !produktKey) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        product: produktKey,
        email: form.email,
        name: form.name,
        businessContact: form.businessContact,
        trial,
      }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setError('Es ist ein Fehler aufgetreten. Bitte versuche es erneut oder schreib uns an jkbusiness@gmail.com.')
      setLoading(false)
    }
  }

  if (!product) {
    const trialParam = trial ? '&trial=1' : ''
    return (
      <div className="form-card" style={{ textAlign: 'center' }}>
        {trial && (
          <div style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem' }}>
            🎁 1 Monat gratis – kein Risiko, jederzeit kündbar
          </div>
        )}
        <h2 style={{ marginBottom: '1rem' }}>Welches Produkt möchtest du testen?</h2>
        <p style={{ marginBottom: '2rem' }}>Wähle dein Produkt – der erste Monat ist kostenlos.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/bestellen?produkt=autochat${trialParam}`} className="btn-primary">AutoChat – €39/Monat</Link>
          <Link href={`/bestellen?produkt=mailpilot${trialParam}`} className="btn-secondary">MailPilot – €29/Monat</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="form-card">
      {/* Product summary */}
      <div style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>{product.name}</span>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>{product.description}</p>
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)', whiteSpace: 'nowrap' }}>{product.price}<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-muted)' }}> / Monat</span></span>
      </div>

      {trial && (
        <div style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '12px', padding: '0.85rem 1.25rem', marginBottom: '1.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', textAlign: 'center' }}>
          🎁 1 Monat gratis – danach {product.price}/Monat, jederzeit kündbar
        </div>
      )}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{trial ? '1 Monat gratis starten' : 'Jetzt abonnieren'}</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Füll das Formular aus – danach gehst du zur sicheren Zahlung via Stripe. Monatlich kündbar.</p>

      <form onSubmit={handleSubmit}>
        <div className="grp">
          <label>Name</label>
          <input
            type="text"
            placeholder="Dein Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />
        </div>
        <div className="grp">
          <label>E-Mail-Adresse</label>
          <input
            type="email"
            placeholder="deine@email.de"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </div>
        <div className="grp">
          <label>{product.contactLabel}</label>
          <input
            type="text"
            placeholder={product.contactPlaceholder}
            value={form.businessContact}
            onChange={(e) => update('businessContact', e.target.value)}
            required
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{product.contactHelp}</p>
        </div>

        <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer', fontWeight: 400 }}>
            <input
              type="checkbox"
              checked={form.agreed}
              onChange={(e) => update('agreed', e.target.checked)}
              required
              style={{ marginTop: '3px', flexShrink: 0, width: '16px', height: '16px' }}
            />
            <span style={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
              Ich bestätige, dass ich hiermit ein <strong>kostenpflichtiges Abonnement für {product.price}/Monat</strong> abschließe. Das Abo ist monatlich kündbar. Nach dem Klick werde ich zu Stripe weitergeleitet, um die Zahlung sicher abzuschließen.
            </span>
          </label>
        </div>

        {error && (
          <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading || !form.agreed}
          className="btn-primary"
          style={{ width: '100%', opacity: !form.agreed ? 0.5 : 1, cursor: !form.agreed ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Wird weitergeleitet...' : trial ? `1 Monat gratis starten →` : `Weiter zur Zahlung → ${product.price}/Monat`}
        </button>
      </form>
    </div>
  )
}

export default function Bestellen() {
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
            <span className="sub-label">Abonnement abschließen</span>
          </div>
          <Suspense fallback={<div>Laden...</div>}>
            <BestellenForm />
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
