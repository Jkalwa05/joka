'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> }

export default function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Bereits installiert?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (installed || dismissed || !prompt) return null

  async function install() {
    if (!prompt) return
    await prompt.prompt()
    setPrompt(null)
    setInstalled(true)
  }

  return (
    <div style={{
      marginTop: '2rem',
      background: '#f0fdfa',
      border: '1.5px solid #99f6e4',
      borderRadius: '16px',
      padding: '1.5rem',
      textAlign: 'left',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
    }}>
      <div style={{ fontSize: '2.5rem', lineHeight: 1, flexShrink: 0 }}>📲</div>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-main)' }}>
          Joka als App installieren
        </strong>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
          Füge Joka zu deinem Homescreen hinzu – so hast du deine Inbox immer direkt zur Hand, ohne Browser.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={install} className="btn-primary" style={{ fontSize: '0.9rem', padding: '0.6rem 1.5rem' }}>
            Installieren
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', color: 'var(--text-muted)' }}
          >
            Nein danke
          </button>
        </div>
      </div>
    </div>
  )
}
