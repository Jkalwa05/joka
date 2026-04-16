'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  customerId: string
  product: string
  email: string
}

export default function OnboardingForm({ customerId, product, email }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    businessAddress: '',
    openingHours: '',
    services: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, ...form }),
    })
    router.push('/onboarding/success?product=autochat')
  }

  if (product === 'mailpilot') {
    return (
      <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <span className="sub-label">Schritt 1 von 1</span>
        <h1 style={{ marginBottom: '0.5rem' }}>Gmail verbinden</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Verbinde dein Google-Konto damit MailPilot deine E-Mails automatisch sortieren kann.
          Eingeloggt als <strong>{email}</strong>.
        </p>
        <a
          href={`/api/auth/google?customerId=${customerId}`}
          className="btn-primary"
          style={{ display: 'inline-block' }}
        >
          Mit Google verbinden
        </a>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <span className="sub-label">Schritt 1 von 1</span>
      <h1 style={{ marginBottom: '0.5rem' }}>Dein Business einrichten</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Diese Infos nutzt AutoChat um deine Kunden zu antworten. Dauert 5 Minuten.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            Name deines Unternehmens *
          </label>
          <input
            required
            type="text"
            placeholder="z.B. Friseur Mustermann"
            value={form.businessName}
            onChange={(e) => update('businessName', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            Adresse
          </label>
          <input
            type="text"
            placeholder="z.B. Musterstraße 1, 12345 Berlin"
            value={form.businessAddress}
            onChange={(e) => update('businessAddress', e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            Öffnungszeiten
          </label>
          <textarea
            placeholder="z.B. Mo–Fr 9–18 Uhr, Sa 9–14 Uhr, So geschlossen"
            value={form.openingHours}
            onChange={(e) => update('openingHours', e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
            Leistungen & Preise
          </label>
          <textarea
            placeholder="z.B. Herrenhaarschnitt €18, Damenhaarschnitt ab €35, Bartpflege €12"
            value={form.services}
            onChange={(e) => update('services', e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
          {saving ? 'Wird gespeichert...' : 'Speichern & weiter'}
        </button>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  border: '1.5px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}
