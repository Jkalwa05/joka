import Link from 'next/link'

export const metadata = {
  title: 'Datenschutzerklärung | Joka Chat',
}

export default function Datenschutz() {
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Datenschutzerklärung</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Stand: April 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>1. Verantwortlicher</h3>
              <p>Verantwortlich im Sinne der DSGVO ist:<br />
              Jonas Kalwa – Joka Chat<br />
              Dinkelkamp 30, 49377 Vechta, Deutschland<br />
              E-Mail: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a></p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>2. Überblick: Was macht Joka Chat?</h3>
              <p>Joka Chat betreibt zwei Dienste: <strong>AutoChat</strong> beantwortet WhatsApp-Nachrichten deiner Endkunden automatisch per KI. <strong>MailPilot</strong> sortiert deine Gmail- oder Outlook-E-Mails automatisch und trägt Termine in deinen Kalender ein. In beiden Fällen verarbeiten wir personenbezogene Daten – deine eigenen (als Joka Chat-Kunde) und Daten deiner Endkunden (Dritter, die mit dir kommunizieren).</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>3. Welche Daten werden verarbeitet?</h3>

              <p style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>a) Account- und Vertragsdaten (du als Kunde)</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                <li>Name, E-Mail-Adresse, Passwort (als Hash), Anmeldestatus</li>
                <li>Zahlungsdaten (verarbeitet durch Stripe Payments Europe Ltd.)</li>
                <li>Stripe-Kunden-ID, Abonnement-Status, Rechnungshistorie</li>
                <li>IP-Adresse und Zeitstempel bei Logins und API-Anfragen (Rate Limiting / Missbrauchsschutz)</li>
              </ul>

              <p style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>b) AutoChat: WhatsApp-bezogene Daten</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                <li>Deine Geschäftsangaben (Firmenname, Adresse, Öffnungszeiten, Leistungen, Preise)</li>
                <li>Deine WhatsApp-Business-Nummer inkl. Meta Phone Number ID und Access Token</li>
                <li>Eingehende und ausgehende Nachrichteninhalte zwischen dir und deinen Endkunden</li>
                <li>Telefonnummern deiner Endkunden und Zeitstempel ihrer Nachrichten</li>
                <li>Konversations-Metadaten (z.B. „KI pausiert", „Review erforderlich")</li>
              </ul>

              <p style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>c) MailPilot: E-Mail- und Kalender-Daten</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                <li>Deine Gmail- oder Outlook-Adresse</li>
                <li>OAuth-Zugangstokens von Google bzw. Microsoft (verschlüsselt gespeichert)</li>
                <li>Inhalte eingehender E-Mails, soweit zur Kategorisierung nötig</li>
                <li>Kalender-Einträge, soweit zur Terminprüfung nötig (Google Calendar / Outlook Calendar)</li>
              </ul>

              <p style={{ marginTop: '1rem', marginBottom: '0.5rem', color: 'var(--text-main)', fontWeight: 600 }}>d) Website und Kontakt</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem' }}>
                <li>Server-Logs (IP-Adresse, User Agent, Zeitpunkt des Zugriffs) beim Hoster Vercel</li>
                <li>Formulardaten bei Kontaktanfragen (Name, E-Mail, Telefon, Nachricht)</li>
                <li>Ein technisch notwendiges Token im Local Storage deines Browsers, um dich eingeloggt zu halten (kein Tracking-Cookie)</li>
              </ul>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>4. Zwecke & Rechtsgrundlagen</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li><strong>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO):</strong> Bereitstellung der gebuchten Dienste, Zahlungsabwicklung, Support.</li>
                <li><strong>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO):</strong> IT-Sicherheit, Missbrauchsschutz, Server-Logs.</li>
                <li><strong>Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO):</strong> Steuer- und handelsrechtliche Aufbewahrung von Rechnungen (i.d.R. 10 Jahre).</li>
                <li><strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO):</strong> OAuth-Verbindung zu Google/Microsoft. Du kannst die Einwilligung jederzeit widerrufen, indem du den Zugang in deinem Google- bzw. Microsoft-Konto widerrufst oder uns schreibst.</li>
              </ul>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>5. KI-Verarbeitung (Anthropic / Claude)</h3>
              <p>Zur automatischen Beantwortung von WhatsApp-Nachrichten (AutoChat) und zur Sortierung von E-Mails (MailPilot) senden wir den jeweiligen Nachrichtentext an die Schnittstelle von <strong>Anthropic PBC, 548 Market Street, San Francisco, CA 94104, USA</strong> (Modellfamilie Claude). Anthropic verarbeitet die Inhalte zur Erzeugung der Antwort bzw. Klassifikation und speichert sie nach eigener Auskunft nicht dauerhaft (Zero Data Retention im API-Enterprise-Betrieb). Die Übermittlung in die USA erfolgt auf Grundlage von EU-Standardvertragsklauseln (Art. 46 DSGVO). Wir haben mit Anthropic einen Auftragsverarbeitungsvertrag geschlossen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>6. Empfänger & Auftragsverarbeiter</h3>
              <p>Folgende Dienstleister verarbeiten Daten in unserem Auftrag:</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li><strong>Vercel Inc., USA</strong> – Hosting der Website und API (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Supabase Inc., USA</strong> – Datenbank-Hosting in der EU (Frankfurt) (<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Anthropic PBC, USA</strong> – KI-Verarbeitung von Nachrichteninhalten (<a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Meta Platforms Ireland Ltd., Irland</strong> – WhatsApp Business API für AutoChat (<a href="https://www.whatsapp.com/legal/privacy-policy-eea" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Google Ireland Ltd., Irland</strong> – Gmail/Google Calendar API für MailPilot (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Microsoft Ireland Operations Ltd., Irland</strong> – Outlook/Microsoft Graph API für MailPilot (<a href="https://privacy.microsoft.com/de-de/privacystatement" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Stripe Payments Europe Ltd., Irland</strong> – Zahlungsabwicklung (<a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
                <li><strong>Resend Inc., USA</strong> – Transaktions-E-Mails (<a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>Datenschutz</a>)</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>Soweit Daten in Drittländer (z.B. USA) übermittelt werden, erfolgt dies auf Grundlage von Standardvertragsklauseln der EU-Kommission (Art. 46 DSGVO) oder – soweit zertifiziert – auf Basis des EU-US Data Privacy Framework.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>7. Speicherdauer</h3>
              <ul style={{ paddingLeft: '1.25rem' }}>
                <li>Account- und Vertragsdaten: für die Dauer des Abonnements und bis zu 30 Tage danach.</li>
                <li>Rechnungsdaten: 10 Jahre aufgrund steuer- und handelsrechtlicher Pflichten.</li>
                <li>WhatsApp-Konversationen (AutoChat): solange das Abonnement aktiv ist, spätestens jedoch 90 Tage nach der letzten Nachricht, sofern du nicht eine frühere Löschung wünschst.</li>
                <li>E-Mail- und Kalender-Zugriffsdaten (MailPilot): werden nur kurzzeitig zur Verarbeitung im Arbeitsspeicher gehalten und nicht dauerhaft gespeichert. OAuth-Tokens werden bis zum Widerruf oder Abo-Ende gespeichert.</li>
                <li>Server-Logs: max. 30 Tage.</li>
                <li>Kontaktanfragen: bis zur abschließenden Bearbeitung, max. 12 Monate.</li>
              </ul>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>8. Verarbeitung von Endkunden-Daten (Dritte)</h3>
              <p>Wenn du AutoChat oder MailPilot nutzt, verarbeitet Joka Chat auch Daten von Personen, die <em>dir</em> schreiben (deine Endkunden). Gegenüber diesen Personen bist <strong>du</strong> der Verantwortliche im Sinne der DSGVO; Joka Chat handelt insoweit als dein <strong>Auftragsverarbeiter</strong> gemäß Art. 28 DSGVO. Durch den Abschluss des Abonnements schließt du mit uns einen Auftragsverarbeitungsvertrag ab, dessen Inhalt in unseren <Link href="/agb" style={{ color: 'var(--primary)' }}>AGB</Link> geregelt ist. Du bist verpflichtet, deine Endkunden in geeigneter Form über den Einsatz einer KI-gestützten Antwort- bzw. Sortierlösung zu informieren.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>9. Cookies, Tracking & Analyse</h3>
              <p>Joka Chat setzt <strong>keine</strong> Tracking-Cookies, kein Google Analytics, keine Werbe-Pixel. Es wird lediglich ein technisch notwendiges Authentifizierungs-Token im Local Storage deines Browsers abgelegt, damit du eingeloggt bleibst. Dieses Token enthält keine personenbezogenen Daten.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>10. Deine Rechte</h3>
              <p>Dir stehen die folgenden Rechte gegenüber dem Verantwortlichen zu:</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li>Auskunft über verarbeitete Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung (Art. 17 DSGVO) – sofern keine Aufbewahrungspflichten entgegenstehen</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen Verarbeitung auf Grundlage berechtigter Interessen (Art. 21 DSGVO)</li>
                <li>Widerruf einer Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>Zur Ausübung genügt eine formlose E-Mail an <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a>.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>11. Beschwerderecht</h3>
              <p>Du hast das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist für uns die <strong>Landesbeauftragte für den Datenschutz Niedersachsen</strong>, Prinzenstraße 5, 30159 Hannover (<a href="https://lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>lfd.niedersachsen.de</a>).</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>12. Automatisierte Entscheidungen</h3>
              <p>Die KI-gestützten Antworten und Sortierungen von Joka Chat stellen <strong>keine automatisierte Entscheidung im Einzelfall mit rechtlicher Wirkung</strong> im Sinne von Art. 22 DSGVO dar. Du kannst jederzeit selbst antworten und die KI für einzelne Konversationen pausieren.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>13. Änderungen dieser Erklärung</h3>
              <p>Wir passen diese Erklärung an, wenn sich Funktionen, Dienstleister oder Rechtslage ändern. Die jeweils aktuelle Fassung findest du unter joka.ai/datenschutz.</p>
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
