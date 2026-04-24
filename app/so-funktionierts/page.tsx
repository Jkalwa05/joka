import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'So funktioniert\'s – AutoChat & MailPilot | joka.ai',
  description: 'Einfach erklärt: Wie AutoChat deine WhatsApp-Nachrichten automatisch beantwortet und wie MailPilot deine E-Mails sortiert.',
}

export default function SoFunktionierts() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">joka<span className="dot">.ai</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/website">Website</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      <section className="section" style={{ paddingTop: '10rem' }}>
        <div className="container-wide" style={{ maxWidth: '780px' }}>

          <div style={{ marginBottom: '5rem' }}>
            <span className="sub-label">Überblick</span>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', marginBottom: '1rem' }}>Was genau passiert im Hintergrund?</h1>
            <p style={{ fontSize: '1.15rem', maxWidth: '600px' }}>Kein Fachjargon. Einfach erklärt was passiert, nachdem du dich anmeldest.</p>
          </div>

          {/* AUTOCHAT */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--primary-glow)', borderRadius: '14px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ph-duotone ph-whatsapp-logo" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}></i>
              </div>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>AutoChat</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  n: '01',
                  title: 'Du gibst uns deine WhatsApp-Nummer',
                  text: 'Du teilst uns die Nummer mit, auf der deine Kunden dir schreiben – zum Beispiel die Nummer deines Geschäfts. Das kann eine neue Nummer sein oder eine bestehende.',
                },
                {
                  n: '02',
                  title: 'Die Nummer wird mit unserer KI verbunden',
                  text: 'Wir verknüpfen deine Nummer technisch mit dem AutoChat-System. Ab diesem Moment laufen alle eingehenden Nachrichten automatisch durch die KI.',
                },
                {
                  n: '03',
                  title: 'Ein Kunde schreibt dir auf WhatsApp',
                  text: 'Sobald jemand eine Nachricht schickt, landet sie bei AutoChat. Die KI liest die Nachricht und versteht, worum es geht – ob Preisfrage, Terminanfrage oder eine allgemeine Frage.',
                },
                {
                  n: '04',
                  title: 'Die KI antwortet automatisch – mit deinen Infos',
                  text: 'AutoChat antwortet innerhalb von Sekunden, basierend auf den Infos die du einmal hinterlegt hast: Öffnungszeiten, Preise, häufige Fragen. Die Antwort kommt so, als hättest du selbst geschrieben.',
                },
                {
                  n: '05',
                  title: 'Du kannst jederzeit selbst übernehmen',
                  text: 'Über deine persönliche joka.ai-Inbox kannst du alle Gespräche einsehen und bei Bedarf selbst antworten. Du kannst die KI für einzelne Gespräche pausieren – zum Beispiel wenn ein Kunde ein komplexes Anliegen hat.',
                },
              ].map(({ n, title, text }) => (
                <div key={n} className="step">
                  <span className="step-num">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p style={{ fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', background: '#fef2f2', border: '1.5px solid #fca5a5', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <p style={{ color: '#991b1b', fontWeight: 700, margin: '0 0 0.4rem 0', fontSize: '0.95rem' }}>⚠️ Wichtig zu wissen</p>
              <p style={{ color: '#b91c1c', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                Die Nummer die du für AutoChat verwendest, kann danach nicht mehr parallel in der normalen WhatsApp-App genutzt werden. Alle Nachrichten laufen ausschließlich über AutoChat. Wir empfehlen deshalb eine dedizierte Geschäftsnummer – nicht deine private Nummer.
              </p>
            </div>
          </div>

          {/* MAILPILOT */}
          <div style={{ marginBottom: '5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ background: 'var(--primary-glow)', borderRadius: '14px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className="ph-duotone ph-envelope-simple" style={{ fontSize: '1.8rem', color: 'var(--primary)' }}></i>
              </div>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>MailPilot</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                {
                  n: '01',
                  title: 'Du verbindest einmalig dein Gmail-Konto',
                  text: 'Du loggst dich einmal über Google ein und erlaubst MailPilot, dein Postfach zu lesen. Das funktioniert über die offizielle Google-Schnittstelle – sicher und jederzeit widerrufbar.',
                },
                {
                  n: '02',
                  title: 'MailPilot beobachtet deinen Posteingang',
                  text: 'Sobald eine neue E-Mail ankommt, wird MailPilot automatisch benachrichtigt. Du musst nichts tun – das passiert komplett im Hintergrund.',
                },
                {
                  n: '03',
                  title: 'Die KI liest Betreff und Inhalt',
                  text: 'MailPilot analysiert jede eingehende Mail und versteht worum es geht: Ist es eine Rechnung? Eine Terminbestätigung? Werbung? Eine Kundenanfrage?',
                },
                {
                  n: '04',
                  title: 'Die Mail landet automatisch im richtigen Ordner',
                  text: 'Je nach Inhalt wird die Mail in den passenden Ordner verschoben – Finanzen, Anfragen, Werbung oder Termine. Dein Posteingang bleibt aufgeräumt, ohne dass du einen Finger rührst.',
                },
                {
                  n: '05',
                  title: 'Termine werden direkt in den Kalender eingetragen',
                  text: 'Steckt in der Mail ein Termin – z.B. eine Terminbestätigung vom Arzt oder ein Meeting – trägt MailPilot ihn automatisch in deinen Google Kalender ein.',
                },
              ].map(({ n, title, text }) => (
                <div key={n} className="step">
                  <span className="step-num">{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p style={{ fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '2rem', background: '#f0fdfa', border: '1.5px solid #99f6e4', borderRadius: '14px', padding: '1.25rem 1.5rem' }}>
              <p style={{ color: '#0d9488', fontWeight: 700, margin: '0 0 0.4rem 0', fontSize: '0.95rem' }}>✓ Deine Mails bleiben deine Mails</p>
              <p style={{ color: '#0f766e', margin: 0, fontSize: '0.9rem', lineHeight: 1.6 }}>
                MailPilot liest deine Mails nur um sie zu sortieren – es werden keine Inhalte gespeichert oder weitergegeben. Der Zugriff läuft ausschließlich über die offizielle Google API und kann jederzeit in deinen Google-Kontoeinstellungen widerrufen werden.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-banner">
            <div className="cta-text">
              <h3>Noch Fragen?</h3>
              <p>Wir erklären dir alles persönlich – kostenlos und unverbindlich.</p>
            </div>
            <Link href="/kontakt" className="btn-primary">Jetzt anfragen</Link>
          </div>

        </div>
      </section>

      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 joka.ai. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></span></p>
            <a href="https://www.linkedin.com/in/jonas-kalwa-3333612a1/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
          </div>
          <div className="footer-links">
            <Link href="/mein-abo">Mein Abo</Link>
            <span className="separator">|</span>
            <Link href="/so-funktionierts">Überblick</Link>
            <span className="separator">|</span>
            <Link href="/agb">AGB</Link>
            <span className="separator">|</span>
            <Link href="/widerruf">Widerruf</Link>
            <span className="separator">|</span>
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
