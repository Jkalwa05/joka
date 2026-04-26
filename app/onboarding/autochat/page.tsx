'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

function AutoChatOnboardingForm() {
  const params = useSearchParams()
  const token = params.get('token')

  const [form, setForm] = useState({
    businessName: '',
    businessAddress: '',
    openingHours: '',
    services: '',
  })
  const [calendarConnected, setCalendarConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch(`/api/onboarding/autochat?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError('Link ungültig oder abgelaufen.'); setLoading(false); return }
        setForm({
          businessName: data.businessName ?? '',
          businessAddress: data.businessAddress ?? '',
          openingHours: data.openingHours ?? '',
          services: data.services ?? '',
        })
        setCalendarConnected(!!data.calendarConnected)
        setLoading(false)
      })
  }, [token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/onboarding/autochat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...form }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
    } else {
      setError('Fehler beim Speichern. Bitte versuche es erneut.')
    }
  }

  if (!token) return (
    <div className="form-card" style={{ textAlign: 'center' }}>
      <p>Kein gültiger Link. Bitte schreib uns an <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></p>
    </div>
  )

  if (loading) return <div className="form-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Lade...</div>

  if (error) return (
    <div className="form-card" style={{ textAlign: 'center' }}>
      <p style={{ color: '#dc2626', marginBottom: '1.5rem' }}>{error}</p>
      <Link href="/kontakt" className="btn-primary">Hilfe anfordern</Link>
    </div>
  )

  if (saved) return (
    <div className="form-card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
      <h2 style={{ marginBottom: '0.5rem' }}>Infos gespeichert!</h2>
      <p style={{ marginBottom: '2rem' }}>AutoChat antwortet ab sofort mit deinen Angaben. Du kannst die Infos jederzeit hier aktualisieren.</p>
      <button onClick={() => setSaved(false)} className="btn-secondary" style={{ marginBottom: '1rem', width: '100%' }}>
        Infos bearbeiten
      </button>
      <Link href={`/inbox?token=${token}`} className="btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%' }}>
        Zur Inbox →
      </Link>
    </div>
  )

  return (
    <div className="form-card">
      <h2 style={{ marginBottom: '0.4rem' }}>Deine Business-Infos</h2>
      <p style={{ marginBottom: '2rem' }}>AutoChat antwortet deinen Kunden basierend auf diesen Angaben. Je mehr du ausfüllst, desto besser die Antworten.</p>

      <form onSubmit={handleSubmit}>
        <div className="grp">
          <label>Unternehmensname</label>
          <input
            type="text"
            placeholder="z.B. Friseur Mustermann"
            value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            required
          />
        </div>

        <div className="grp">
          <label>Adresse</label>
          <input
            type="text"
            placeholder="z.B. Musterstraße 1, 12345 Musterstadt"
            value={form.businessAddress}
            onChange={e => setForm(f => ({ ...f, businessAddress: e.target.value }))}
          />
        </div>

        <div className="grp">
          <label>Öffnungszeiten</label>
          <textarea
            rows={4}
            placeholder={`z.B.\nMo–Fr: 9:00–18:00 Uhr\nSa: 9:00–14:00 Uhr\nSo: Geschlossen`}
            value={form.openingHours}
            onChange={e => setForm(f => ({ ...f, openingHours: e.target.value }))}
            style={{ width: '100%', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', background: '#f8f9fa', resize: 'vertical' }}
          />
        </div>

        <div className="grp">
          <label>Leistungen & Preise</label>
          <textarea
            rows={6}
            placeholder={`z.B.\nHerrenhaarschnitt: €18\nDamenhaarschnitt: €35\nKinderhaarschnitt: €12\nTermine: telefonisch oder per WhatsApp`}
            value={form.services}
            onChange={e => setForm(f => ({ ...f, services: e.target.value }))}
            style={{ width: '100%', padding: '1rem', border: '2px solid #e2e8f0', borderRadius: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', background: '#f8f9fa', resize: 'vertical' }}
          />
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>Trag hier alles ein was Kunden oft fragen – Preise, Leistungen, Besonderheiten.</p>
        </div>

        {error && <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}

        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
          {saving ? 'Wird gespeichert...' : 'Infos speichern →'}
        </button>
      </form>

      {/* Google Kalender verbinden */}
      <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: calendarConnected ? '#f0fdfa' : '#f8f9fa', borderRadius: '14px', border: `1px solid ${calendarConnected ? 'rgba(0,98,102,0.2)' : 'rgba(0,0,0,0.06)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <i className="ph-duotone ph-calendar-check" style={{ color: 'var(--primary)', fontSize: '1.5rem' }}></i>
          <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Google Kalender verbinden</strong>
          {calendarConnected && (
            <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700 }}>✓ Verbunden</span>
          )}
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: 1.55 }}>
          {calendarConnected
            ? 'Perfekt. AutoChat trägt neue Terminwünsche ab sofort direkt in deinen Google Kalender ein.'
            : 'Wenn ein Kunde auf WhatsApp einen Termin wünscht, trägt AutoChat ihn automatisch in deinen Google Kalender ein und bestätigt dem Kunden sofort.'}
        </p>
        {!calendarConnected && (
          <a href={`/api/auth/google/connect?token=${token}`} className="btn-primary" style={{ display: 'inline-block', fontSize: '0.9rem' }}>
            Mit Google verbinden →
          </a>
        )}
      </div>

      {/* Hilfe benötigt */}
      <div style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', background: '#f8f9fa', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', textAlign: 'center' }}>
        <p style={{ fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.4rem 0', fontSize: '0.95rem' }}>Hilfe benötigt?</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1rem 0' }}>Nicht sicher was du eintragen sollst? Wir helfen dir kostenlos weiter.</p>
        <a href="mailto:joka.chat.business@gmail.com?subject=Hilfe beim AutoChat Onboarding" className="btn-secondary" style={{ fontSize: '0.9rem' }}>
          Joka Chat kontaktieren
        </a>
      </div>
    </div>
  )
}

export default function AutoChatOnboarding() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
        </div>
      </nav>

      <section className="section" style={{ paddingTop: '10rem' }}>
        <div className="container-wide" style={{ maxWidth: '680px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="sub-label">AutoChat Einrichtung</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '0.75rem' }}>Erzähl uns von deinem Business.</h1>
            <p>Diese Infos nutzt AutoChat um Kundenfragen automatisch zu beantworten.</p>
          </div>
          <Suspense fallback={<div>Laden...</div>}>
            <AutoChatOnboardingForm />
          </Suspense>
        </div>
      </section>
    </>
  )
}
