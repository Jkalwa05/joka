'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  customerId: string
  product: string
  email: string
  inboxToken: string
}

export default function OnboardingForm({ customerId, product, email, inboxToken }: Props) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    businessAddress: '',
    openingHours: '',
    services: '',
  })

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPasswordError('')
    if (password.length < 8) {
      setPasswordError('Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    if (password !== passwordConfirm) {
      setPasswordError('Passwörter stimmen nicht überein.')
      return
    }
    setSavingPassword(true)
    const res = await fetch('/api/passwort-setzen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: inboxToken, password }),
    })
    setSavingPassword(false)
    if (!res.ok) {
      const { error } = await res.json()
      setPasswordError(error || 'Fehler beim Speichern.')
      return
    }
    setPasswordSaved(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, ...form }),
    })
    router.push('/onboarding/success?product=' + product)
  }

  if (!passwordSaved) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <span className="sub-label">Schritt 1 von 2</span>
        <h1 style={{ marginBottom: '0.5rem' }}>Passwort festlegen</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Lege dein Passwort fest. Du kannst dich danach unter{' '}
          <strong>joka.chat/anmelden</strong> mit <strong>{email}</strong> einloggen.
        </p>
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
              Passwort (mind. 8 Zeichen) *
            </label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem' }}>
              Passwort wiederholen *
            </label>
            <input
              required
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              style={inputStyle}
            />
          </div>
          {passwordError && (
            <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0 }}>{passwordError}</p>
          )}
          <button type="submit" disabled={savingPassword} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            {savingPassword ? 'Wird gespeichert...' : 'Weiter →'}
          </button>
        </form>
      </div>
    )
  }

  if (product === 'mailpilot') {
    return (
      <div style={{ maxWidth: '560px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <span className="sub-label">Schritt 2 von 2</span>
        <h1 style={{ marginBottom: '0.5rem' }}>Postfach verbinden</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Verbinde dein Gmail oder Outlook damit MailPilot deine E-Mails automatisch sortieren und Termine eintragen kann.
          Eingeloggt als <strong>{email}</strong>.
        </p>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <a
            href={`/api/auth/google?customerId=${customerId}`}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', fontSize: '1rem' }}
          >
            <i className="ph-fill ph-google-logo"></i> Mit Gmail verbinden
          </a>
          <a
            href={`/api/auth/microsoft?customerId=${customerId}`}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', fontSize: '1rem' }}
          >
            <i className="ph-fill ph-microsoft-outlook-logo"></i> Mit Outlook verbinden
          </a>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
          Du kannst später jederzeit den Zugriff in deinen Google- oder Microsoft-Sicherheitseinstellungen widerrufen.
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '520px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <span className="sub-label">Schritt 2 von 2</span>
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
