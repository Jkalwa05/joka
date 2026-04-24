'use client'

import { useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void> }
type Platform = 'ios' | 'android' | 'other'

function detectPlatform(): Platform {
  const ua = navigator.userAgent
  if (/iphone|ipad|ipod|macintosh/i.test(ua) && 'ontouchend' in document) return 'ios'
  if (/macintosh/i.test(ua) && !('ontouchend' in document)) return 'ios' // Mac Safari
  if (/android/i.test(ua)) return 'android'
  return 'other'
}

export default function PwaInstallPrompt() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [platform, setPlatform] = useState<Platform | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }
    setPlatform(detectPlatform())

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (installed || dismissed || !platform) return null

  // iOS/Mac Safari: kein beforeinstallprompt → manuelle Anleitung
  if (platform === 'ios' && !prompt) {
    return (
      <div style={{
        marginTop: '2rem',
        background: '#f0fdfa',
        border: '1.5px solid #99f6e4',
        borderRadius: '16px',
        padding: '1.5rem',
        textAlign: 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.8rem' }}>📲</span>
          <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>joka.ai als App installieren</strong>
        </div>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
          Füge joka.ai zu deinem Homescreen hinzu – so hast du die Inbox immer direkt zur Hand.
        </p>
        <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            <>Tippe auf das <strong>Teilen-Symbol</strong> in Safari (das Viereck mit dem Pfeil nach oben)</>,
            <>Scrolle nach unten und wähle <strong>„Zum Home-Bildschirm"</strong></>,
            <>Tippe oben rechts auf <strong>„Hinzufügen"</strong></>,
          ].map((step, i) => (
            <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{step}</li>
          ))}
        </ol>
        <button
          onClick={() => setDismissed(true)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem', padding: 0 }}
        >
          Schließen
        </button>
      </div>
    )
  }

  // Android/Chrome: nativer Install-Prompt
  if (!prompt) return null

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
          joka.ai als App installieren
        </strong>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
          Füge joka.ai zu deinem Homescreen hinzu – Inbox immer direkt zur Hand, ohne Browser.
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
