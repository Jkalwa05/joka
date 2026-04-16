type Props = {
  searchParams: { product?: string }
}

const content = {
  autochat: {
    title: 'AutoChat ist eingerichtet!',
    text: 'Wir verbinden jetzt deine WhatsApp-Nummer. Das dauert in der Regel 24 Stunden. Du bekommst eine E-Mail sobald alles läuft.',
    next: 'Was passiert als nächstes? Unser Team meldet sich bei dir um deine Geschäftsnummer zu verbinden.',
  },
  mailpilot: {
    title: 'MailPilot ist verbunden!',
    text: 'Dein Gmail-Konto ist jetzt verbunden. MailPilot sortiert ab sofort jede neue E-Mail automatisch in den richtigen Ordner.',
    next: 'Neue E-Mails werden automatisch sortiert. Eingehende Termine landen direkt in deinem Google Kalender.',
  },
}

export default function SuccessPage({ searchParams }: Props) {
  const product = (searchParams.product ?? 'autochat') as keyof typeof content
  const c = content[product] ?? content.autochat

  return (
    <div style={{ maxWidth: '520px', margin: '6rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
      <h1 style={{ marginBottom: '0.75rem' }}>{c.title}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{c.text}</p>
      <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '2rem', textAlign: 'left', fontSize: '0.9rem', color: '#0d9488' }}>
        {c.next}
      </div>
      <a href="/" className="btn-secondary">Zurück zur Startseite</a>
    </div>
  )
}
