'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('trial-widget-dismissed')) setShowWidget(true)

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

  function dismissWidget() {
    sessionStorage.setItem('trial-widget-dismissed', '1')
    setShowWidget(false)
  }

  return (
    <>
      {/* NAV */}
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka<span className="dot">_</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section" style={{ paddingBottom: '8rem' }}>
        <div className="container-wide">
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <div className="status-badge fade-in" style={{ margin: '0 auto 2rem auto' }}><span className="status-dot"></span> Jetzt verfügbar</div>
            <h1 className="fade-in" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', letterSpacing: '-2px' }}>Dein Joker. Wenn es um Automatisierung geht.</h1>
            <p className="fade-in delay-1" style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
              WhatsApp automatisch beantworten. E-Mails automatisch sortieren. Einmal einrichten – und du sparst täglich Stunden.
            </p>
            <div className="hero-btns fade-in delay-2" style={{ justifyContent: 'center' }}>
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
                <div className="product-price">€39 <span>/ Monat</span></div>
                <Link href="/bestellen?produkt=autochat" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '1rem' }}>Jetzt abonnieren</Link>
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
                <div className="product-price">€29 <span>/ Monat</span></div>
                <Link href="/bestellen?produkt=mailpilot" className="btn-primary" style={{ width: '100%', textAlign: 'center', display: 'block', marginTop: '1rem' }}>Jetzt abonnieren</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div className="container-wide">
          <div className="two-col">
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
              <p>Einmal einrichten, dauerhaft Zeit sparen. Kein Vertrag, monatlich kündbar.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/bestellen?produkt=autochat" className="btn-primary">AutoChat – €39/Monat</Link>
              <Link href="/bestellen?produkt=mailpilot" className="btn-secondary" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>MailPilot – €29/Monat</Link>
            </div>
          </div>
        </div>
      </section>

      {/* JK AUTOMATION BANNER */}
      <section style={{ background: 'var(--primary)', padding: '1.25rem 0' }}>
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="ph-duotone ph-lightning" style={{ color: 'white', fontSize: '1.1rem' }}></i>
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Weitere Automationen im Kopf?</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', margin: 0 }}>Wir schauen gemeinsam, was möglich ist.</p>
            </div>
          </div>
          <a href="https://jonaskalwa.de" target="_blank" rel="noopener noreferrer" style={{ background: 'white', color: 'var(--primary)', padding: '0.6rem 1.4rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap' }}>
            JK Automation ansehen →
          </a>
        </div>
      </section>

      {/* TRIAL WIDGET */}
      {showWidget && (
        <div className="trial-widget" style={{
          position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: '1.25rem',
          background: 'white', color: 'var(--text-main)',
          padding: '0.75rem 0.75rem 0.75rem 1.5rem',
          borderRadius: '50px', boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>1 Monat kostenlos testen</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kein Risiko · Jederzeit kündbar</span>
          </div>
          <Link
            href="/bestellen?trial=1"
            className="btn-primary small"
            style={{ flexShrink: 0, fontSize: '0.88rem' }}
          >
            Jetzt starten
          </Link>
          <button
            onClick={dismissWidget}
            aria-label="Schließen"
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1,
              padding: '0 0.5rem 0 0', flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* FOOTER */}
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
