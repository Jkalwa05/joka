import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'AutoChat – WhatsApp automatisch beantworten | Joka',
  description: 'AutoChat beantwortet deine WhatsApp-Nachrichten automatisch – Öffnungszeiten, Preise, Terminanfragen. Für Friseure, Restaurants und lokale Geschäfte. Ab €39/Monat.',
}

export default function AutoChat() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
          <div className="nav-items">
            <Link href="/autochat" style={{ color: 'var(--primary)', fontWeight: 700 }}>AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/inbox" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Anmelden</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section" style={{ minHeight: '65vh', paddingBottom: '8rem' }}>
        <div className="container-wide">
          <div style={{ maxWidth: '760px' }}>
            <span className="sub-label">AutoChat</span>
            <h1>WhatsApp automatisch beantworten.</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '580px' }}>
              Kunden schreiben dir – AutoChat antwortet sofort. Rund um die Uhr, in deinem Namen, mit deinen Infos. Du merkst es kaum, sie aber schon.
            </p>
            <div className="hero-btns">
              <Link href="/bestellen?produkt=autochat" className="btn-primary">Jetzt abonnieren</Link>
              <a href="#wie-es-funktioniert" className="btn-secondary">Wie es funktioniert</a>
            </div>
          </div>
        </div>
      </header>

      {/* WIE ES FUNKTIONIERT */}
      <section id="wie-es-funktioniert" className="section bg-light">
        <div className="container-wide">
          <div className="two-col">
            <div>
              <span className="sub-label">Wie es funktioniert</span>
              <h2>Deine Nummer. Unsere KI.</h2>
              <p style={{ marginBottom: '2rem' }}>Deine Kunden schreiben weiterhin dieselbe Nummer wie immer. Im Hintergrund beantwortet AutoChat jede Nachricht – basierend auf Infos, die du einmal hinterlegst.</p>
              <div className="steps">
                {[
                  { n: '01', title: 'Infos hinterlegen', desc: 'Du gibst uns deine Öffnungszeiten, Preise und häufige Fragen. Einmalig, dauert 5 Minuten.' },
                  { n: '02', title: 'WhatsApp verbinden', desc: 'In einem kurzen Call verbinden wir deine Geschäftsnummer. Deine Kunden merken nichts.' },
                  { n: '03', title: 'AutoChat antwortet', desc: 'Ab sofort beantwortet AutoChat jede Nachricht automatisch – auch nachts und am Wochenende.' },
                ].map(({ n, title, desc }) => (
                  <div key={n} className="step">
                    <span className="step-num">{n}</span>
                    <div>
                      <strong>{title}</strong>
                      <p style={{ fontSize: '0.95rem', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/kontakt" className="btn-primary" style={{ display: 'block', width: '100%', textAlign: 'center', marginTop: '1.5rem' }}>Fragen?</Link>
            </div>

            {/* MOCKUP */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#075e54', borderRadius: '24px', padding: '1.5rem', width: '320px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <div style={{ background: '#128c7e', borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="ph-fill ph-scissors" style={{ color: 'white', fontSize: '1rem' }}></i>
                  </div>
                  <div>
                    <strong style={{ color: 'white', fontSize: '0.9rem', display: 'block' }}>Friseur Mustermann</strong>
                    <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>online</span>
                  </div>
                </div>
                {[
                  { text: 'Hallo, was kostet ein Herrenhaarschnitt?', own: false },
                  { text: 'Hallo! Ein Herrenhaarschnitt kostet bei uns €18. Möchtest du einen Termin buchen?', own: true },
                  { text: 'Ja, habt ihr Samstag um 10 Uhr was frei?', own: false },
                  { text: 'Samstag um 10 Uhr ist noch frei! Soll ich den Termin für dich reservieren?', own: true },
                ].map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.own ? 'flex-end' : 'flex-start', marginBottom: '0.6rem' }}>
                    <div style={{ background: msg.own ? '#dcf8c6' : 'white', padding: '0.6rem 0.9rem', borderRadius: msg.own ? '12px 12px 2px 12px' : '12px 12px 12px 2px', maxWidth: '85%', fontSize: '0.82rem', color: '#111', lineHeight: 1.4 }}>
                      {msg.text}
                      {msg.own && <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end', marginTop: '2px' }}><span style={{ fontSize: '0.65rem', color: '#999' }}>AutoChat</span><i className="ph-fill ph-checks" style={{ color: '#53bdeb', fontSize: '0.75rem' }}></i></div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INBOX */}
      <section className="section">
        <div className="container-wide">
          <div className="two-col">
            <div>
              <span className="sub-label">Dein Posteingang</span>
              <h2>Du behältst die Kontrolle.</h2>
              <p style={{ marginBottom: '1.5rem' }}>AutoChat antwortet automatisch – aber du siehst jedes Gespräch. In deinem eigenen Joka-Posteingang kannst du Unterhaltungen lesen, selbst eingreifen oder die KI für einzelne Kunden pausieren.</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { icon: 'ph-duotone ph-chat-dots', text: 'Alle Kundengespräche auf einen Blick' },
                  { icon: 'ph-duotone ph-pencil-simple', text: 'Jederzeit selbst antworten oder übernehmen' },
                  { icon: 'ph-duotone ph-toggle-right', text: 'KI pro Gespräch ein- oder ausschalten' },
                  { icon: 'ph-duotone ph-bell', text: 'Benachrichtigung bei wichtigen Nachrichten' },
                ].map(({ icon, text }) => (
                  <li key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                    <i className={icon} style={{ color: 'var(--primary)', fontSize: '1.3rem', flexShrink: 0 }}></i>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* INBOX MOCKUP */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'white', borderRadius: '20px', width: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ background: 'var(--primary)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <i className="ph-fill ph-chat-dots" style={{ color: 'white', fontSize: '1.3rem' }}></i>
                  <strong style={{ color: 'white', fontSize: '0.95rem' }}>Joka Posteingang</strong>
                  <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>3 neu</span>
                </div>
                {/* Conversation list */}
                {[
                  { name: 'Kunde Anna M.', msg: 'Habt ihr morgen noch was frei?', time: '09:14', ai: true, unread: true },
                  { name: 'Kunde Tom B.', msg: 'Danke! Bis Samstag.', time: 'Gestern', ai: true, unread: false },
                  { name: 'Kunde Julia K.', msg: 'Was kostet ein Bart-Trim?', time: 'Gestern', ai: false, unread: true },
                ].map(({ name, msg, time, ai, unread }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.25rem', borderBottom: '1px solid #f1f5f9', background: unread ? '#f8fffe' : 'white' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e2f8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="ph-fill ph-user" style={{ color: 'var(--primary)', fontSize: '1rem' }}></i>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.82rem', color: 'var(--text-main)' }}>{name}</strong>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg}</p>
                    </div>
                    <span style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: '50px', background: ai ? '#f0fdfa' : '#fef3c7', color: ai ? 'var(--primary)' : '#92400e', fontWeight: 700, flexShrink: 0 }}>{ai ? 'KI' : 'Du'}</span>
                  </div>
                ))}
                <div style={{ padding: '0.85rem 1.25rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Alle Gespräche ansehen →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section bg-light">
        <div className="container-wide">
          <div className="center-text">
            <span className="sub-label">Features</span>
            <h2>Was AutoChat kann.</h2>
          </div>
          <div className="skills-grid">
            {[
              { icon: 'ph-duotone ph-clock', title: '24/7 verfügbar', desc: 'AutoChat schläft nicht. Auch sonntags um 22 Uhr bekommt dein Kunde sofort eine Antwort.' },
              { icon: 'ph-duotone ph-brain', title: 'Intelligente Antworten', desc: 'Die KI versteht den Kontext. Kein starres FAQ – echte Konversation auf Basis deiner Infos.' },
              { icon: 'ph-duotone ph-phone', title: 'Deine Nummer bleibt', desc: 'Kein Nummernwechsel, keine Weiterleitung. Deine Kunden merken keinen Unterschied.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="skill-card">
                <div className="card-header"><i className={icon}></i><h3>{title}</h3></div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-light">
        <div className="container-wide">
          <div className="cta-banner">
            <div className="cta-text">
              <h3>€39 pro Monat. Kein Vertrag.</h3>
              <p>Monatlich kündbar. Einrichtung inklusive.</p>
            </div>
            <Link href="/bestellen?produkt=autochat" className="btn-primary">Jetzt abonnieren</Link>
          </div>
        </div>
      </section>

      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></span></p>
            <a href="https://jonaskalwa.de" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
          </div>
          <div className="footer-links">
            <Link href="/mein-abo">Mein Abo</Link>
            <span className="separator">|</span>
            <Link href="/so-funktionierts">Überblick</Link>
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
