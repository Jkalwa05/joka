'use client'

import { useState } from 'react'

export default function AdminLogin() {
  const [key, setKey] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = `/admin?key=${encodeURIComponent(key)}`
  }

  return (
    <div style={{ maxWidth: '360px', margin: '6rem auto', padding: '0 1.5rem' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Admin</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Admin-Key eingeben.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          required
          value={key}
          onChange={(e) => setKey(e.target.value)}
          autoComplete="off"
          style={{ width: '100%', padding: '0.7rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem' }}
        />
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          Anmelden
        </button>
      </form>
    </div>
  )
}
