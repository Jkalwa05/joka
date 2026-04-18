'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: '1.25rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, width: 'min(560px, calc(100vw - 2rem))',
      background: 'white', borderRadius: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
      border: '1px solid rgba(0,0,0,0.07)', padding: '1.25rem 1.5rem',
      display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap',
    }}>
      <p style={{ margin: 0, fontSize: '0.88rem', color: '#374151', flex: 1, lineHeight: 1.5 }}>
        Wir nutzen Cookies für anonyme Nutzungsstatistiken (Vercel Analytics).{' '}
        <a href="/datenschutz" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Datenschutz</a>
      </p>
      <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
        <button onClick={decline} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#6b7280', fontFamily: 'inherit' }}>
          Ablehnen
        </button>
        <button onClick={accept} className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>
          Akzeptieren
        </button>
      </div>
    </div>
  )
}
