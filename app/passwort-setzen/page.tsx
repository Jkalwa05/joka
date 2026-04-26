'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function PasswortSetzenForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError('Passwörter stimmen nicht überein.'); return }
    if (password.length < 8) { setError('Mindestens 8 Zeichen.'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/passwort-setzen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    setLoading(false)
    if (res.ok) {
      setDone(true)
      setTimeout(() => router.push('/anmelden'), 2000)
    } else {
      const data = await res.json()
      setError(data.error || 'Fehler beim Setzen des Passworts.')
    }
  }

  if (!token) return (
    <div className="form-card" style={{ textAlign: 'center' }}>
      <p style={{ color: '#dc2626' }}>Ungültiger Link. Bitte nutze den Link aus deiner Willkommens-E-Mail.</p>
    </div>
  )

  return (
    <div className="form-card" style={{ maxWidth: '440px' }}>
      <span className="sub-label">Einmalige Einrichtung</span>
      <h2 style={{ marginBottom: '0.5rem' }}>Passwort setzen</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Wähle ein Passwort für deinen Joka Chat-Account.</p>
      {done ? (
        <div style={{ background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '12px', padding: '1.25rem', color: '#0d9488', fontWeight: 600, textAlign: 'center' }}>
          ✓ Passwort gesetzt! Du wirst weitergeleitet…
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grp">
            <label>Passwort</label>
            <input type="password" required minLength={8} placeholder="Mindestens 8 Zeichen" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="grp">
            <label>Passwort bestätigen</label>
            <input type="password" required placeholder="Nochmal eingeben" value={confirm} onChange={e => setConfirm(e.target.value)} />
          </div>
          {error && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Wird gesetzt...' : 'Passwort speichern →'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function PasswortSetzen() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
        </div>
      </nav>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <Suspense>
          <PasswortSetzenForm />
        </Suspense>
      </div>
    </>
  )
}
