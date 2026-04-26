'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type Conversation = {
  id: string
  customerPhone: string
  aiPaused: boolean
  updatedAt: string
  messages: { content: string; role: string }[]
}

type Message = {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
}

type Me = { email: string; name: string; products: { autochat: boolean; mailpilot: boolean }; gmailConnected: boolean }

export default function Dashboard() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [tab, setTab] = useState<'inbox' | 'abo'>('inbox')
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    const urlToken = new URLSearchParams(window.location.search).get('token')
    const stored = localStorage.getItem('jokaai-token')
    const t = urlToken || stored
    if (!t) { router.push('/anmelden'); return }
    if (urlToken) {
      localStorage.setItem('jokaai-token', urlToken)
      window.history.replaceState({}, '', '/dashboard')
    }
    setToken(t)
  }, [router])

  useEffect(() => {
    if (!token) return
    fetch(`/api/me?token=${token}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setMe(data) })
  }, [token])

  function logout() {
    localStorage.removeItem('jokaai-token')
    router.push('/anmelden')
  }

  if (!token) return null

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
          <div className="nav-items">
            <button
              onClick={() => setTab('inbox')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: tab === 'inbox' ? 700 : 400, color: tab === 'inbox' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              Inbox
            </button>
            <button
              onClick={() => setTab('abo')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.95rem', fontWeight: tab === 'abo' ? 700 : 400, color: tab === 'abo' ? 'var(--primary)' : 'var(--text-muted)' }}
            >
              Mein Abo
            </button>
            <button onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Abmelden
            </button>
          </div>
        </div>
      </nav>

      {tab === 'inbox' ? (
        me?.products.mailpilot && !me?.products.autochat
          ? <MailPilotTab gmailConnected={me.gmailConnected} />
          : <InboxTab token={token} />
      ) : (
        <AboTab token={token} />
      )}
    </>
  )
}

function InboxTab({ token }: { token: string }) {
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)

  async function loadConversations() {
    setLoadingConvs(true)
    const res = await fetch(`/api/inbox/conversations?token=${token}`)
    setLoadingConvs(false)
    if (res.ok) {
      const data = await res.json()
      setConversations(data.conversations)
    }
  }

  async function loadMessages(convId: string) {
    setLoadingMsgs(true)
    const res = await fetch(`/api/inbox/messages?token=${token}&conversationId=${convId}`)
    setLoadingMsgs(false)
    if (res.ok) {
      const data = await res.json()
      setMessages(data.conversation.messages)
      setConversations(prev => prev?.map(c =>
        c.id === convId ? { ...c, aiPaused: data.conversation.aiPaused } : c
      ) ?? null)
    }
  }

  async function sendReply() {
    if (!reply.trim() || !selected) return
    setSending(true)
    const res = await fetch('/api/inbox/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, conversationId: selected, text: reply }),
    })
    setSending(false)
    if (res.ok) { setReply(''); await loadMessages(selected) }
  }

  async function toggleAI(convId: string, currentlyPaused: boolean) {
    await fetch('/api/inbox/toggle-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, conversationId: convId, aiPaused: !currentlyPaused }),
    })
    setConversations(prev => prev?.map(c =>
      c.id === convId ? { ...c, aiPaused: !currentlyPaused } : c
    ) ?? null)
  }

  useEffect(() => { loadConversations() }, [])

  const selectedConv = conversations?.find(c => c.id === selected)

  return (
    <div style={{ paddingTop: '70px', height: '100vh', display: 'flex', background: 'var(--bg-body)' }}>
      {/* Sidebar */}
      <div style={{ width: '300px', flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.07)', background: 'white', overflowY: 'auto' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>Konversationen</strong>
          <button onClick={loadConversations} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.8rem' }}>↻ Aktualisieren</button>
        </div>
        {loadingConvs && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lade...</div>}
        {conversations?.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Noch keine Nachrichten.</div>}
        {conversations?.map(conv => (
          <button key={conv.id} onClick={() => { setSelected(conv.id); setMessages([]); loadMessages(conv.id) }} style={{
            padding: '1rem 1.5rem', background: selected === conv.id ? '#f0fdfa' : 'transparent',
            border: 'none', borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer', textAlign: 'left', width: '100%',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{conv.customerPhone}</span>
              {conv.aiPaused && <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '50px', fontWeight: 700 }}>KI aus</span>}
            </div>
            <p style={{ fontSize: '0.8rem', margin: 0, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {conv.messages[0]?.content ?? '—'}
            </p>
          </button>
        ))}
      </div>

      {/* Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {!selected ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Wähle eine Konversation aus
          </div>
        ) : (
          <>
            <div style={{ padding: '1rem 1.5rem', background: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <strong style={{ fontFamily: 'var(--font-heading)' }}>{selectedConv?.customerPhone}</strong>
              <button onClick={() => selectedConv && toggleAI(selectedConv.id, selectedConv.aiPaused)} style={{
                padding: '0.4rem 1rem', borderRadius: '50px', border: '1px solid',
                borderColor: selectedConv?.aiPaused ? '#99f6e4' : '#fcd34d',
                background: selectedConv?.aiPaused ? '#f0fdfa' : '#fffbeb',
                color: selectedConv?.aiPaused ? '#0d9488' : '#92400e',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              }}>
                {selectedConv?.aiPaused ? '✓ KI pausiert – Aktivieren' : '⏸ KI aktiv – Pausieren'}
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {loadingMsgs && <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Lade...</div>}
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'ASSISTANT' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    background: msg.role === 'ASSISTANT' ? 'var(--primary)' : 'white',
                    color: msg.role === 'ASSISTANT' ? 'white' : 'var(--text-main)',
                    padding: '0.65rem 1rem', borderRadius: msg.role === 'ASSISTANT' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    maxWidth: '65%', fontSize: '0.9rem', lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                  }}>
                    {msg.content}
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '3px', textAlign: 'right' }}>
                      {msg.role === 'ASSISTANT' ? 'AutoChat' : 'Kunde'} · {new Date(msg.createdAt).toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', gap: '0.75rem' }}>
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()}
                placeholder="Nachricht schreiben..."
                style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #e2e8f0', borderRadius: '50px', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', outline: 'none' }}
              />
              <button onClick={sendReply} disabled={sending || !reply.trim()} className="btn-primary small" style={{ borderRadius: '50px', flexShrink: 0 }}>
                {sending ? '...' : 'Senden'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MailPilotTab({ gmailConnected }: { gmailConnected: boolean }) {
  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
      <div className="form-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
        <h2 style={{ marginBottom: '0.75rem' }}>MailPilot</h2>
        {gmailConnected ? (
          <>
            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', color: '#0d9488', fontWeight: 600 }}>
              ✓ Gmail ist verbunden – E-Mails werden automatisch sortiert.
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Neue E-Mails werden automatisch kategorisiert. Termine landen direkt in deinem Google Kalender.</p>
          </>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Gmail ist noch nicht verbunden.</p>
            <a href="/onboarding" className="btn-primary" style={{ display: 'inline-block' }}>Gmail verbinden →</a>
          </>
        )}
      </div>
    </div>
  )
}

function AboTab({ token }: { token: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function openPortal() {
    setLoading(true)
    setError('')
    // Token → E-Mail lookup via API, dann Stripe Portal
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } else {
      setError('Fehler beim Öffnen des Portals.')
    }
  }

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-body)' }}>
      <div className="form-card" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
        <h2 style={{ marginBottom: '0.5rem' }}>Mein Abo</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
          Hier kannst du dein Abonnement verwalten, kündigen oder deine Zahlungsmethode ändern.
        </p>
        {error && <p style={{ color: '#dc2626', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <button onClick={openPortal} disabled={loading} className="btn-primary" style={{ width: '100%' }}>
          {loading ? 'Wird geladen...' : 'Abo verwalten → (Stripe Portal)'}
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Fragen? <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a>
        </p>
      </div>
    </div>
  )
}
