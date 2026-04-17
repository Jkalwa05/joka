import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MailPilot – E-Mails automatisch sortieren & Termine eintragen | Joka',
  description: 'MailPilot liest dein Gmail oder Outlook, sortiert E-Mails automatisch in Ordner und trägt Termine in deinen Google Kalender ein. Für Freelancer und Selbstständige. Ab €19/Monat.',
}

export default function MailPilot() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot" style={{ color: 'var(--primary)', fontWeight: 700 }}>MailPilot</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section" style={{ minHeight: '65vh', paddingBottom: '8rem' }}>
        <div className="container-wide">
          <div style={{ maxWidth: '760px' }}>
            <span className="sub-label">MailPilot</span>
            <h1>E-Mails automatisch sortieren.</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '580px' }}>
              MailPilot liest dein Postfach, sortiert jede Mail in den richtigen Ordner und trägt Termine direkt in deinen Google Kalender ein. Kein manuelles Aufräumen mehr.
            </p>
            <div className="hero-btns">
              <Link href="/kontakt?produkt=mailpilot" className="btn-primary">Jetzt anfragen</Link>
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
              <h2>Einmal verbinden. Für immer aufgeräumt.</h2>
              <p style={{ marginBottom: '2rem' }}>Du verbindest dein Gmail oder Outlook einmalig. MailPilot liest dann im Hintergrund jede eingehende E-Mail und sortiert sie – vollautomatisch.</p>
              <div className="steps">
                {[
                  { n: '01', title: 'Gmail oder Outlook verbinden', desc: 'Du loggst dich einmalig über Google oder Microsoft ein. MailPilot bekommt Lesezugriff – sicher und widerrufbar.' },
                  { n: '02', title: 'Ordner & Regeln festlegen', desc: 'Du sagst uns einmal: Rechnungen in den Ordner "Finanzen", Terminbestätigungen in den Kalender. Fertig.' },
                  { n: '03', title: 'MailPilot übernimmt', desc: 'Jede neue Mail wird automatisch erkannt, sortiert und – wenn ein Termin drin steckt – im Kalender eingetragen.' },
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
              <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', width: '340px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.06)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                  <i className="ph-fill ph-envelope-simple" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
                  <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>MailPilot – Posteingang</strong>
                  <span style={{ marginLeft: 'auto', background: '#f0fdfa', color: 'var(--primary)', padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 700 }}>LIVE</span>
                </div>
                {[
                  { from: 'Steuerberater GmbH', subject: 'Ihre Rechnung März 2026', folder: '📁 Finanzen', color: '#fef3c7' },
                  { from: 'Dr. Meier Praxis', subject: 'Terminbestätigung 22.04.', folder: '📅 Kalender', color: '#f0fdfa' },
                  { from: 'Newsletter XY', subject: 'Angebote diese Woche', folder: '🗑 Werbung', color: '#fef2f2' },
                  { from: 'Kunde Schneider', subject: 'Angebot Anfrage Website', folder: '📁 Anfragen', color: '#f0f9ff' },
                ].map((mail, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '0.7rem', borderRadius: '8px', marginBottom: '0.5rem', background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.78rem' }}>{mail.from}</span>
                      <span style={{ background: mail.color, padding: '2px 8px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 600 }}>{mail.folder}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{mail.subject}</span>
                  </div>
                ))}
                <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>✓ 4 Mails automatisch sortiert</div>
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
            <h2>Was MailPilot kann.</h2>
          </div>
          <div className="skills-grid">
            {[
              { icon: 'ph-duotone ph-folders', title: 'Automatisches Sortieren', desc: 'Rechnungen, Anfragen, Newsletter – jede Mail landet im richtigen Ordner. Ohne dass du einen Finger rührst.' },
              { icon: 'ph-duotone ph-calendar-check', title: 'Termine automatisch eintragen', desc: 'Steckt ein Termin in der Mail? MailPilot erkennt ihn und legt ihn direkt in deinem Google Kalender an.' },
              { icon: 'ph-duotone ph-shield-check', title: 'Sicher & DSGVO-konform', desc: 'Verbindung über offizielle Google- und Microsoft-APIs. Kein Passwort wird gespeichert. Jederzeit widerrufbar.' },
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
              <h3>€29 pro Monat. Kein Vertrag.</h3>
              <p>Monatlich kündbar. Einrichtung inklusive.</p>
            </div>
            <Link href="/bestellen?produkt=mailpilot" className="btn-primary">Jetzt abonnieren</Link>
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
