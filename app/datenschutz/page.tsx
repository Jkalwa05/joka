import Link from 'next/link'

export default function Datenschutz() {
  return (
    <>
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

      <section className="section" style={{ paddingTop: '10rem' }}>
        <div className="container-wide" style={{ maxWidth: '700px' }}>
          <span className="sub-label">Rechtliches</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Datenschutzerklärung</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>1. Verantwortlicher</h3>
              <p>Jonas Kalwa, Dinkelkamp 30, 49377 Vechta<br />E-Mail: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>2. Welche Daten wir erheben</h3>
              <p>Beim Abschluss eines Abonnements erheben wir: Name, E-Mail-Adresse, Zahlungsdaten (verarbeitet durch Stripe), sowie produktspezifische Daten (WhatsApp-Nummer bei AutoChat, Gmail-Adresse bei MailPilot). Beim Besuch der Website werden keine Tracking-Cookies gesetzt.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>3. Zweck der Verarbeitung</h3>
              <p>Deine Daten werden ausschließlich zur Erbringung der gebuchten Leistungen (AutoChat, MailPilot) und zur Kommunikation mit dir verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>4. Drittanbieter</h3>
              <p><strong>Stripe:</strong> Zahlungsabwicklung. Datenschutzerklärung: stripe.com/de/privacy<br />
              <strong>Google:</strong> Bei MailPilot wird Gmail über die offizielle Google API verbunden. Deine Zugangsdaten werden nicht gespeichert. Google-Datenschutzerklärung: policies.google.com/privacy<br />
              <strong>Anthropic (Claude):</strong> KI-Verarbeitung eingehender Nachrichten. Es werden keine personenbezogenen Daten dauerhaft gespeichert.<br />
              <strong>Vercel:</strong> Hosting. Datenschutzerklärung: vercel.com/legal/privacy-policy</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>5. Speicherdauer</h3>
              <p>Deine Daten werden gespeichert solange dein Abonnement aktiv ist. Nach Kündigung werden deine Daten innerhalb von 30 Tagen gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>6. Deine Rechte</h3>
              <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten sowie das Recht auf Datenübertragbarkeit. Wende dich dazu an: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>7. Beschwerderecht</h3>
              <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Die zuständige Behörde in Niedersachsen ist der Landesbeauftragte für den Datenschutz Niedersachsen (lfd.niedersachsen.de).</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '4rem' }}>
        <div className="container-wide footer-inner">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka.</p>
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
