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
              <Link href="/kontakt?produkt=autochat" className="btn-primary">Jetzt anfragen</Link>
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

      {/* FEATURES */}
      <section className="section">
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
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
