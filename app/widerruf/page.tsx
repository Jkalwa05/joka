import Link from 'next/link'

export const metadata = {
  title: 'Widerrufsbelehrung | Joka Chat',
}

export default function Widerruf() {
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
        <div className="container-wide" style={{ maxWidth: '760px' }}>
          <span className="sub-label">Rechtliches</span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Widerrufsbelehrung</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Für Verbraucher i.S.d. § 13 BGB</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Widerrufsrecht</h3>
              <p>Du hast das Recht, binnen <strong>vierzehn Tagen</strong> ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
              <p style={{ marginTop: '1rem' }}>Um dein Widerrufsrecht auszuüben, musst du uns</p>
              <p style={{ marginTop: '0.5rem' }}>
                Jonas Kalwa – Joka Chat<br />
                Dinkelkamp 30, 49377 Vechta<br />
                E-Mail: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a>
              </p>
              <p style={{ marginTop: '1rem' }}>mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder eine E-Mail) über deinen Entschluss, diesen Vertrag zu widerrufen, informieren. Du kannst dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.</p>
              <p style={{ marginTop: '1rem' }}>Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Folgen des Widerrufs</h3>
              <p>Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser Rückzahlung Entgelte berechnet.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Vorzeitiges Erlöschen des Widerrufsrechts (digitale Dienstleistungen)</h3>
              <p>Dein Widerrufsrecht erlischt bei einem Vertrag über die Bereitstellung nicht auf einem körperlichen Datenträger befindlicher digitaler Inhalte bzw. digitaler Dienstleistungen, wenn</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li>du ausdrücklich zugestimmt hast, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen,</li>
                <li>du deine Kenntnis davon bestätigt hast, dass du durch deine Zustimmung mit Beginn der Ausführung des Vertrags dein Widerrufsrecht verlierst, und</li>
                <li>wir dir eine Bestätigung dieser Zustimmung auf einem dauerhaften Datenträger (z.B. per E-Mail) zur Verfügung gestellt haben.</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>Beim Abschluss im Bestellformular bist du durch entsprechende Checkboxen auf diese Folgen hingewiesen worden.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Leistungen, die bereits begonnen haben</h3>
              <p>Hast du verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen sollen, so hast du uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem du uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichtest, bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.</p>
            </div>

            <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.5rem 1.75rem', border: '1px solid rgba(0,0,0,0.06)' }}>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Muster-Widerrufsformular</h3>
              <p style={{ marginBottom: '1rem', fontSize: '0.88rem' }}>(Wenn du den Vertrag widerrufen willst, dann fülle dieses Formular aus und sende es zurück.)</p>
              <div style={{ fontSize: '0.9rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-all', background: 'white', padding: '1rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', lineHeight: 1.8, overflowX: 'auto', maxWidth: '100%' }}>
{`An:
Jonas Kalwa – Joka Chat
Dinkelkamp 30
49377 Vechta
E-Mail: joka.chat.business@gmail.com

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*)
abgeschlossenen Vertrag über die Erbringung der
folgenden Dienstleistung (*):

___________________________________________________

Bestellt am (*) / erhalten am (*): __________________
Name des/der Verbraucher(s): _______________________
Anschrift des/der Verbraucher(s): __________________
___________________________________________________
Datum: ________________
Unterschrift des/der Verbraucher(s)
(nur bei Mitteilung auf Papier): ___________________

(*) Unzutreffendes streichen.`}
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Ausschluss / Besonderheiten für Unternehmer</h3>
              <p>Das gesetzliche Widerrufsrecht besteht ausschließlich für Verbraucher im Sinne des § 13 BGB. Schließt du das Abonnement im Rahmen einer gewerblichen oder selbstständigen beruflichen Tätigkeit ab (Unternehmer i.S.d. § 14 BGB), besteht <strong>kein</strong> gesetzliches Widerrufsrecht. Unabhängig davon kannst du dein Abonnement jederzeit monatlich kündigen.</p>
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
