'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function InboxContent() {
  const params = useSearchParams()
  const token = params.get('token')

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (token) {
    return <InboxApp token={token} />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/inbox/request-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoading(false)
    if (res.ok) {
      setSent(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Fehler beim Senden')
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
        </div>
      </nav>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <div className="form-card" style={{ width: '100%' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>AutoChat Inbox</h2>
          <p style={{ marginBottom: '2rem' }}>Gib deine E-Mail ein – wir schicken dir einen Link zu deinen Konversationen.</p>
          {sent ? (
            <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px', padding: '1.25rem', color: '#0d9488', fontWeight: 600 }}>
              ✓ Link wurde an {email} gesendet. Schau in dein Postfach!
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grp">
                <label>E-Mail-Adresse</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de" />
              </div>
              {error && <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Sende...' : 'Zugangslink senden →'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

function InboxApp({ token }: { token: string }) {
  const [conversations, setConversations] = useState<Conversation[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingConvs, setLoadingConvs] = useState(false)
  const [loadingMsgs, setLoadingMsgs] = useState(false)

  type Conversation = {
    id: string
    customerPhone: string
    aiPaused: boolean
    needsReview: boolean
    updatedAt: string
    messages: { content: string; role: string }[]
  }

  type Message = {
    id: string
    role: 'USER' | 'ASSISTANT'
    content: string
    createdAt: string
  }

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

  async function selectConversation(id: string) {
    setSelected(id)
    setMessages([])
    await loadMessages(id)
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
    if (res.ok) {
      setReply('')
      await loadMessages(selected)
    }
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

  if (!conversations && !loadingConvs) {
    loadConversations()
  }

  const selectedConv = conversations?.find(c => c.id === selected)

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>AutoChat Inbox</span>
        </div>
      </nav>
      <div style={{ paddingTop: '70px', height: '100vh', display: 'flex', background: 'var(--bg-body)' }}>

        {/* Sidebar */}
        <div style={{ width: '320px', flexShrink: 0, borderRight: '1px solid rgba(0,0,0,0.07)', background: 'white', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>Konversationen</strong>
          </div>
          {loadingConvs && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lade...</div>
          )}
          {conversations?.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Noch keine Nachrichten.</div>
          )}
          {conversations?.map(conv => (
            <button key={conv.id} onClick={() => selectConversation(conv.id)} style={{
              padding: '1rem 1.5rem',
              background: conv.needsReview ? '#fffbeb' : selected === conv.id ? '#f0fdfa' : 'transparent',
              borderLeft: conv.needsReview ? '3px solid #f59e0b' : '3px solid transparent',
              border: 'none', borderBottom: '1px solid rgba(0,0,0,0.04)', cursor: 'pointer',
              textAlign: 'left', transition: '0.15s',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{conv.customerPhone}</span>
                {conv.needsReview ? (
                  <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#92400e', padding: '1px 6px', borderRadius: '50px', fontWeight: 700 }}>📅 Termin</span>
                ) : conv.aiPaused ? (
                  <span style={{ fontSize: '0.65rem', background: '#f1f5f9', color: '#64748b', padding: '1px 6px', borderRadius: '50px', fontWeight: 700 }}>KI aus</span>
                ) : null}
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
              {/* Header */}
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

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loadingMsgs && <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lade...</div>}
                {messages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'ASSISTANT' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      background: msg.role === 'ASSISTANT' ? 'var(--primary)' : 'white',
                      color: msg.role === 'ASSISTANT' ? 'white' : 'var(--text-main)',
                      padding: '0.65rem 1rem', borderRadius: msg.role === 'ASSISTANT' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      maxWidth: '65%', fontSize: '0.9rem', lineHeight: 1.5,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    }}>
                      {msg.content}
                      <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '3px', textAlign: 'right' }}>
                        {msg.role === 'ASSISTANT' ? 'AutoChat' : 'Kunde'} · {new Date(msg.createdAt).toLocaleTimeString('de', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
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
    </>
  )
}

export default function InboxPage() {
  return (
    <Suspense>
      <InboxContent />
    </Suspense>
  )
}
