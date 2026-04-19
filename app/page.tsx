'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [showWidget, setShowWidget] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('trial-widget-dismissed')) setShowWidget(true)

    const targets = document.querySelectorAll('.fade-in, .fade-up')

    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px 0px 0px', threshold: 0 }
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
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
            <Link href="/anmelden">Anmelden</Link>
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

          {/* BUNDLE */}
          <div style={{ marginTop: '2rem', background: 'var(--primary)', borderRadius: '20px', padding: '2rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <span style={{ background: 'rgba(255,255,255,0.18)', color: 'white', borderRadius: '50px', padding: '3px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>KOMBI-PAKET</span>
              <h3 style={{ color: 'white', fontSize: '1.6rem', margin: '0.75rem 0 0.4rem 0', letterSpacing: '-0.5px' }}>AutoChat + MailPilot</h3>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.95rem' }}>Beide Tools zusammen – WhatsApp automatisch beantworten <em>und</em> E-Mails sortieren. Einmal einrichten, dauerhaft sparen.</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                {['WhatsApp 24/7 automatisch', 'E-Mails sortieren & Kalender', 'Kein Vertrag, monatlich kündbar'].map(f => (
                  <span key={f} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <i className="ph-bold ph-check-circle" style={{ color: 'white' }}></i> {f}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', textDecoration: 'line-through' }}>€68 / Monat</div>
              <div style={{ color: 'white', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>€49 <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>/ Monat</span></div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '0.25rem', marginBottom: '1rem' }}>Du sparst €19 im Monat</div>
              <Link href="/bestellen?produkt=bundle" style={{ display: 'inline-block', background: 'white', color: '#0d3d35', fontWeight: 700, padding: '0.75rem 1.75rem', borderRadius: '50px', fontSize: '1rem', textDecoration: 'none' }}>Jetzt abonnieren</Link>
            </div>
          </div>
        </div>
      </section>

      {/* WAS BRINGT DIR DAS */}
      <section className="section">
        <div className="container-wide">
          <div className="center-text fade-up">
            <span className="sub-label">Was du davon hast</span>
            <h2>Konkret: Was Joka für dich macht.</h2>
            <p>Kein Marketing-Gerede. Das sind die Dinge, die du ab Tag 1 spürst.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            {[
              { icon: 'ph-duotone ph-clock-countdown', title: '30+ Stunden im Monat gespart', desc: 'Du antwortest nicht mehr manuell auf jede WhatsApp-Nachricht. AutoChat erledigt 80–90% der Routine-Fragen. Der Rest landet strukturiert in deiner Inbox.' },
              { icon: 'ph-duotone ph-phone-outgoing', title: 'Keine Anrufe nachts um 22 Uhr', desc: 'Kunden wollen sofort Antwort – auch abends. AutoChat antwortet sekundenschnell, du bleibst ungestört und verlierst keinen Auftrag.' },
              { icon: 'ph-duotone ph-calendar-plus', title: 'Termine direkt im Kalender', desc: 'Wenn ein Kunde per WhatsApp oder Mail einen Termin anfragt, landet er automatisch in deinem Google Kalender oder Outlook. Keine doppelte Arbeit mehr.' },
              { icon: 'ph-duotone ph-funnel', title: 'Nur echte Anfragen erreichen dich', desc: 'Werbung, Newsletter und Spam werden automatisch sortiert. Deine Inbox zeigt nur die Mails, die wirklich deine Aufmerksamkeit brauchen.' },
              { icon: 'ph-duotone ph-smiley', title: 'Kunden sind zufriedener', desc: 'Sofortige Antwort auf jede Frage – auch wenn du gerade arbeitest oder im Urlaub bist. Kein "wir melden uns" – direkt die Info, die der Kunde braucht.' },
              { icon: 'ph-duotone ph-currency-eur', title: 'Rechnet sich ab Tag 1', desc: 'Eine Stunde deiner Arbeitszeit kostet mehr als ein ganzer Monat Joka. Ab der ersten eingesparten Stunde zahlt sich der Dienst aus.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.05)' }} className="fade-up">
                <i className={icon} style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}></i>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
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
                { n: '02', title: 'Einmalig einrichten', desc: 'MailPilot verbindest du selbst in 2 Minuten per Google- oder Outlook-Login. Bei AutoChat richten wir deine WhatsApp-Nummer kurz gemeinsam ein.' },
                { n: '03', title: 'Fertig. Läuft.', desc: 'Ab jetzt antwortet dein WhatsApp automatisch, Mails sortieren sich von selbst und Termine landen direkt im Kalender.' },
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

      {/* FAQ */}
      <section className="section bg-light">
        <div className="container-wide" style={{ maxWidth: '780px' }}>
          <div className="center-text fade-up">
            <span className="sub-label">FAQ</span>
            <h2>Häufige Fragen.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { q: 'Muss ich etwas installieren?', a: 'Nein. Joka läuft komplett im Hintergrund – kein Download, keine App, kein Aufwand.' },
              { q: 'Was passiert wenn die KI eine Frage nicht beantworten kann?', a: 'AutoChat antwortet ehrlich, dass es die Frage nicht beantworten kann, und weist den Kunden darauf hin, sich direkt zu melden. Über deine Inbox kannst du jederzeit selbst übernehmen.' },
              { q: 'Kann ich jederzeit kündigen?', a: 'Ja. Kein Vertrag, monatlich kündbar. Über "Mein Abo" kannst du dein Abo jederzeit selbst verwalten.' },
              { q: 'Sind meine Daten sicher?', a: 'Ja. Alle Daten werden verschlüsselt auf EU-Servern gespeichert. Kein Passwort wird bei uns hinterlegt. Die Verbindung zu WhatsApp und Gmail läuft ausschließlich über offizielle APIs – sicher und jederzeit widerrufbar.' },
              { q: 'Wie lange dauert die Einrichtung?', a: 'AutoChat ist nach einem kurzen Einrichtungs-Call einsatzbereit. MailPilot läuft nach dem Google-Login vollautomatisch an – das dauert unter 5 Minuten.' },
            ].map(({ q, a }, i) => (
              <details key={i} style={{ background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', padding: '1.25rem 1.5rem', cursor: 'pointer' }}>
                <summary style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  {q}
                  <span style={{ color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>+</span>
                </summary>
                <p style={{ marginTop: '0.75rem', marginBottom: 0, fontSize: '0.95rem', lineHeight: 1.7 }}>{a}</p>
              </details>
            ))}
          </div>

          {/* Datenschutz-Hinweis */}
          <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', borderRadius: '14px', padding: '1rem 1.5rem', border: '1px solid rgba(0,0,0,0.06)' }}>
            <i className="ph-duotone ph-shield-check" style={{ fontSize: '1.8rem', color: 'var(--primary)', flexShrink: 0 }}></i>
            <p style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-main)' }}>DSGVO-konform & sicher.</strong>{' '}
              Deine Daten werden verschlüsselt auf EU-Servern gespeichert. Keine Passwörter, keine Weitergabe. <Link href="/datenschutz" style={{ color: 'var(--primary)' }}>Datenschutzerklärung →</Link>
            </p>
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

      {/* JK AUTOMATION BANNER – ausgeblendet bis jonaskalwa.de fertig */}

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
            <span className="trial-title" style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>1 Monat kostenlos testen</span>
            <span className="trial-subtitle" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Kein Risiko · Jederzeit kündbar</span>
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
            <a href="https://www.linkedin.com/in/jonas-kalwa-3333612a1/" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none' }}>Ein Projekt von Jonas Kalwa →</a>
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
