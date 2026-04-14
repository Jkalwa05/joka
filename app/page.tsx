'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll('.fade-in, .fade-up').forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible')
      })
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* NAV */}
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Flowly<span className="dot">_</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/kontakt" className="btn-primary small">Kostenlos starten</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section">
        <div className="container-wide">
          <div style={{ maxWidth: '820px' }}>
            <div className="status-badge fade-in"><span className="status-dot"></span> Jetzt verfügbar</div>
            <h1 className="fade-in">Dein Business.<br />Läuft von selbst.</h1>
            <p className="fade-in delay-1" style={{ fontSize: '1.25rem', maxWidth: '600px' }}>
              WhatsApp automatisch beantworten. E-Mails automatisch sortieren. Einmal einrichten – und du sparst täglich Stunden.
            </p>
            <div className="hero-btns fade-in delay-2">
              <Link href="/autochat" className="btn-primary">AutoChat entdecken</Link>
              <Link href="/mailpilot" className="btn-secondary">MailPilot entdecken</Link>
            </div>
          </div>
        </div>
      </header>

      {/* PRODUCTS */}
      <section className="section bg-light">
        <div className="container-wide">
          <div className="center-text fade-up">
            <span className="sub-label">Unsere Tools</span>
            <h2>Zwei Produkte. Ein Ziel.</h2>
            <p>Weniger Handarbeit, mehr Zeit für das Wesentliche – egal ob Friseur, Restaurant oder Selbstständiger.</p>
          </div>

          <div className="products-grid">
            {/* AutoChat */}
            <div className="product-card fade-up">
              <div className="product-icon"><i className="ph-duotone ph-whatsapp-logo"></i></div>
              <span className="product-tag">AutoChat</span>
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>WhatsApp automatisch beantworten</h3>
              <p style={{ marginTop: '0.75rem' }}>Kunden schreiben dir auf WhatsApp – AutoChat antwortet sofort, rund um die Uhr. Öffnungszeiten, Preise, Terminanfragen – alles automatisch.</p>
              <ul className="product-features">
                <li><i className="ph-bold ph-check-circle"></i> Antwortet 24/7 auf WhatsApp-Nachrichten</li>
                <li><i className="ph-bold ph-check-circle"></i> Kennt deine Öffnungszeiten, Preise & Infos</li>
                <li><i className="ph-bold ph-check-circle"></i> Deine Nummer bleibt deine Nummer</li>
                <li><i className="ph-bold ph-check-circle"></i> Einrichtung in einem 15-Minuten-Call</li>
              </ul>
              <div style={{ marginTop: '1.5rem', background: '#f0fdfa', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className="ph-fill ph-clock" style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Spart dir bis zu 30 Stunden im Monat</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                <Link href="/kontakt?produkt=autochat" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Jetzt anfragen</Link>
              </div>
            </div>

            {/* MailPilot */}
            <div className="product-card fade-up delay-1">
              <div className="product-icon"><i className="ph-duotone ph-envelope-simple"></i></div>
              <span className="product-tag">MailPilot</span>
              <h3 style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>E-Mails automatisch sortieren & Termine eintragen</h3>
              <p style={{ marginTop: '0.75rem' }}>MailPilot liest dein Postfach, sortiert E-Mails in die richtigen Ordner und trägt Termine automatisch in deinen Google Kalender ein.</p>
              <ul className="product-features">
                <li><i className="ph-bold ph-check-circle"></i> E-Mails automatisch in Ordner sortieren</li>
                <li><i className="ph-bold ph-check-circle"></i> Termine direkt in Google Kalender eintragen</li>
                <li><i className="ph-bold ph-check-circle"></i> Funktioniert mit Gmail & Outlook</li>
                <li><i className="ph-bold ph-check-circle"></i> Kein Download, läuft im Hintergrund</li>
              </ul>
              <div style={{ marginTop: '1.5rem', background: '#f0fdfa', borderRadius: '10px', padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <i className="ph-fill ph-clock" style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600 }}>Spart dir bis zu 20 Stunden im Monat</span>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                <Link href="/kontakt?produkt=mailpilot" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block' }}>Jetzt anfragen</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container-wide">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
            <div className="fade-up">
              <span className="sub-label">So einfach geht's</span>
              <h2>Einrichten in unter 20 Minuten.</h2>
              <p>Keine IT-Kenntnisse nötig. Kein Download. Kein Aufwand.</p>
            </div>
            <div className="steps fade-up delay-1">
              {[
                { n: '01', title: 'Produkt wählen & abonnieren', desc: 'AutoChat, MailPilot oder beides – Zahlung per Kreditkarte, jederzeit kündbar.' },
                { n: '02', title: 'Kurzer Einrichtungs-Call', desc: 'Wir verbinden dein WhatsApp oder Gmail in einem 15-Minuten-Telefonat. Du brauchst nichts vorzubereiten.' },
                { n: '03', title: 'Fertig. Läuft.', desc: 'Ab jetzt antwortet dein WhatsApp automatisch und deine Mails sortieren sich von selbst.' },
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
        </div>
      </section>

      {/* FOR WHO */}
      <section className="section bg-light">
        <div className="container-wide">
          <div className="center-text fade-up">
            <span className="sub-label">Für wen</span>
            <h2>Wer davon profitiert.</h2>
            <p>Überall dort, wo täglich dieselben Nachrichten und E-Mails reinkommen.</p>
          </div>
          <div className="skills-grid">
            {[
              { icon: 'ph-duotone ph-scissors', title: 'Friseure & Kosmetik', desc: 'Terminanfragen, Preisfragen, Öffnungszeiten – alles automatisch beantwortet.' },
              { icon: 'ph-duotone ph-fork-knife', title: 'Restaurants & Cafés', desc: 'Reservierungen, Speisekarten, Öffnungszeiten. Kein Stress mehr am Telefon.' },
              { icon: 'ph-duotone ph-briefcase', title: 'Freelancer & Berater', desc: 'Anfragen filtern, Mails sortieren, Termine automatisch eintragen. Fokus aufs Wesentliche.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="skill-card fade-up">
                <div className="card-header">
                  <i className={icon}></i>
                  <h3>{title}</h3>
                </div>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-wide">
          <div className="cta-banner fade-up">
            <div className="cta-text">
              <h3>Bereit loszulegen?</h3>
              <p>Einmal einrichten, dauerhaft Zeit sparen. Preis klären wir gemeinsam im Gespräch.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/kontakt?produkt=autochat" className="btn-primary">AutoChat anfragen</Link>
              <Link href="/kontakt?produkt=mailpilot" className="btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>MailPilot anfragen</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Flowly. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:jkbusiness@gmail.com" style={{ color: 'var(--primary)' }}>jkbusiness@gmail.com</a></span></p>
            <a href="https://jonaskalwa.de" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
          </div>
          <div className="footer-links">
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
