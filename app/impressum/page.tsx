import Link from 'next/link'

export default function Impressum() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link href="/" className="brand">Joka <span className="dot">Chat</span></Link>
          <div className="nav-items">
            <Link href="/autochat">AutoChat</Link>
            <Link href="/mailpilot">MailPilot</Link>
            <Link href="/website">Website</Link>
            <Link href="/kontakt" className="btn-primary small">Fragen?</Link>
          </div>
        </div>
      </nav>

      <section className="section" style={{ paddingTop: '10rem' }}>
        <div className="container-wide" style={{ maxWidth: '700px' }}>
          <span className="sub-label">Rechtliches</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Impressum</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Angaben gemäß § 5 TMG</h3>
              <p>Jonas Kalwa<br />Dinkelkamp 30<br />49377 Vechta<br />Deutschland</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Kontakt</h3>
              <p>E-Mail: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <p>Jonas Kalwa<br />Dinkelkamp 30<br />49377 Vechta</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Haftung für Inhalte</h3>
              <p>Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Haftung für Links</h3>
              <p>Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Urheberrecht</h3>
              <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '4rem' }}>
        <div className="container-wide footer-inner">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© 2026 Joka Chat.</p>
          <div className="footer-links">
            <Link href="/mein-abo">Mein Abo</Link>
            <span className="separator">|</span>
            <Link href="/impressum">Impressum</Link>
            <span className="separator">|</span>
            <Link href="/datenschutz">Datenschutz</Link>
            <span className="separator">|</span>
            <Link href="/agb">AGB</Link>
            <span className="separator">|</span>
            <Link href="/widerruf">Widerruf</Link>
          </div>
        </div>
      </footer>
    </>
  )
}
