'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Anmelden() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/anmelden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Fehler beim Anmelden.')
      return
    }

    localStorage.setItem('jokaai-token', data.token)
    router.push('/dashboard')
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
        </div>
      </nav>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="form-card" style={{ width: '100%', maxWidth: '440px' }}>
          <span className="sub-label">Kundenbereich</span>
          <h2 style={{ marginBottom: '0.5rem' }}>Anmelden</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Melde dich mit deiner E-Mail und deinem Passwort an.</p>
          <form onSubmit={handleSubmit}>
            <div className="grp">
              <label>E-Mail-Adresse</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
            </div>
            <div className="grp">
              <label>Passwort</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Dein Passwort" />
            </div>
            {error && <p style={{ color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden →'}
            </button>
          </form>
          <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Noch kein Konto? <Link href="/bestellen" style={{ color: 'var(--primary)' }}>Jetzt abonnieren</Link>
          </p>
        </div>
      </div>
    </>
  )
}
