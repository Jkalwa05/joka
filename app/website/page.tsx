import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Website – Professioneller Online-Auftritt | Joka Chat',
  description:
    'Wir entwickeln deine Website – modern, schnell und SEO-optimiert. Individuell auf dein Unternehmen zugeschnitten, damit mehr Kunden auf dich aufmerksam werden.',
  alternates: { canonical: '/website' },
  openGraph: {
    title: 'Website – Professioneller Online-Auftritt | Joka Chat',
    description:
      'Individuelle Website, performance- und SEO-optimiert. Mehr Sichtbarkeit und mehr Anfragen für dein Unternehmen.',
    url: '/website',
    type: 'website',
  },
}

export default function WebsitePage() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/website" style={{ color: 'var(--primary)', fontWeight: 700 }}>Website</Link>
            <Link href="/anmelden">Anmelden</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero-section" style={{ minHeight: '65vh', paddingBottom: '6rem' }}>
        <div className="container-wide">
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            <span className="product-tag" style={{ fontSize: '0.9rem', padding: '6px 18px', marginBottom: '1.5rem', display: 'inline-block' }}>Website</span>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4rem)', letterSpacing: '-2px' }}>Dein professioneller Auftritt im Netz.</h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '620px', margin: '0 auto' }}>
              Wir entwickeln deine Website – modern, schnell und SEO-optimiert. Individuell auf dein Unternehmen zugeschnitten.
            </p>
            <div className="hero-btns" style={{ justifyContent: 'center' }}>
              <Link href="/kontakt?produkt=website" className="btn-primary">Jetzt anfragen</Link>
              <Link href="/" className="btn-secondary">Alle Produkte</Link>
            </div>
          </div>
        </div>
      </header>

      {/* PROCESS */}
      <section className="section">
        <div className="container-wide">
          <div className="two-col">
            <div>
              <span className="sub-label">So läuft&apos;s ab</span>
              <h2>Von der Idee zur fertigen Website.</h2>
              <p>Kein langer Briefing-Marathon. Wir holen dich da ab, wo du stehst – und liefern schnell und zuverlässig.</p>
            </div>
            <div className="steps">
              {[
                { n: '01', title: 'Briefing-Call', desc: 'Wir besprechen dein Unternehmen, deine Ziele und deine Wünsche. Ein kurzes Gespräch reicht – du musst kein Webseiten-Experte sein.' },
                { n: '02', title: 'Design & Entwicklung', desc: 'Wir entwickeln deine Website – individuell, schnell und sauber umgesetzt. Du erhältst regelmäßige Updates und kannst Feedback geben.' },
                { n: '03', title: 'Launch & Übergabe', desc: 'Deine Website geht live. Du bekommst alle Zugänge und die volle Kontrolle über deinen neuen Online-Auftritt.' },
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

      {/* WHY */}
      <section className="section bg-light">
        <div className="container-wide">
          <div className="center-text">
            <span className="sub-label">Warum jetzt</span>
            <h2>Kunden googeln. Bist du da?</h2>
            <p>Wer online nicht professionell auftritt, verliert täglich potenzielle Kunden – an Konkurrenten, die einfach besser zu finden sind.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginTop: '2.5rem' }}>
            {[
              { icon: 'ph-duotone ph-trend-up', title: 'Mehr Anfragen', desc: 'Eine professionelle, gut gefundene Website bringt dir regelmäßig neue Kundenanfragen – automatisch, ohne aktives Akquirieren.' },
              { icon: 'ph-duotone ph-star', title: 'Erster Eindruck zählt', desc: 'Kunden entscheiden in Sekunden. Eine klare, moderne Website schafft Vertrauen – bevor du ein Wort gesagt hast.' },
              { icon: 'ph-duotone ph-currency-eur', title: 'Rechnet sich schnell', desc: 'Eine einzige Anfrage, die durch deine Website kommt, amortisiert die Investition oft schon im ersten Monat.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                <i className={icon} style={{ color: 'var(--primary)', fontSize: '2rem', marginBottom: '1rem', display: 'inline-block' }}></i>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ fontSize: '0.92rem', margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container-wide">
          <div className="cta-banner">
            <div className="cta-text">
              <h3>Bereit für deinen Online-Auftritt?</h3>
              <p>Schreib uns kurz, was du dir vorstellst – wir melden uns innerhalb von 24 Stunden.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/kontakt?produkt=website" style={{ display: 'inline-block', background: 'white', color: 'var(--primary)', fontWeight: 700, padding: '0.9rem 2rem', borderRadius: '50px', fontSize: '1rem', textDecoration: 'none' }}>Jetzt anfragen</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="container-wide footer-inner">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka Chat. <span style={{ fontSize: '0.8rem' }}>Support: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></span></p>
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
