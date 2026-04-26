import Link from 'next/link'

export const metadata = {
  title: 'Allgemeine Geschäftsbedingungen | Joka Chat',
}

export default function AGB() {
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Allgemeine Geschäftsbedingungen (AGB)</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Stand: April 2026</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-muted)', lineHeight: 1.75 }}>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 1 Geltungsbereich, Anbieter</h3>
              <p>(1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge, die zwischen</p>
              <p style={{ marginTop: '0.5rem' }}>
                Jonas Kalwa – Joka Chat<br />
                Dinkelkamp 30, 49377 Vechta<br />
                E-Mail: <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a><br />
                (nachfolgend „Anbieter" oder „wir")
              </p>
              <p style={{ marginTop: '1rem' }}>und dem Kunden über die Nutzung der Dienste <strong>AutoChat</strong> und/oder <strong>MailPilot</strong> über die Website <a href="https://joka.ai" style={{ color: 'var(--primary)' }}>Joka Chat</a> abgeschlossen werden.</p>
              <p style={{ marginTop: '1rem' }}>(2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, wir stimmen ihrer Geltung ausdrücklich schriftlich zu.</p>
              <p style={{ marginTop: '0.5rem' }}>(3) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbstständigen beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 2 Leistungsbeschreibung</h3>
              <p>(1) <strong>AutoChat</strong> ist eine Software-as-a-Service-Lösung, die eingehende WhatsApp-Nachrichten des Kunden mittels KI automatisiert beantwortet, Termine in den verbundenen Kalender einträgt und die Konversationen in einer Web-Inbox bereitstellt.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) <strong>MailPilot</strong> ist eine Software-as-a-Service-Lösung, die eingehende E-Mails des Kunden (Gmail oder Outlook) automatisiert kategorisiert, unwichtige Nachrichten archiviert und Terminanfragen in den verbundenen Kalender einträgt.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Der Funktionsumfang ergibt sich aus der jeweils auf der Website aktuellen Produktbeschreibung. Wir behalten uns vor, den Dienst fortlaufend weiterzuentwickeln, solange die vertraglich zugesicherten Hauptfunktionen erhalten bleiben.</p>
              <p style={{ marginTop: '0.75rem' }}>(4) Die Erreichbarkeit des Dienstes beträgt im Jahresmittel 99 %. Geplante Wartungsfenster und Ausfälle aufgrund höherer Gewalt oder Ausfällen bei Upstream-Anbietern (Meta, Google, Microsoft, Anthropic, Vercel) sind ausgenommen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 3 Vertragsschluss</h3>
              <p>(1) Die Darstellung der Dienste auf der Website stellt kein rechtlich bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines Angebots.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Durch das Absenden der Bestellung im Bestellformular gibt der Kunde ein verbindliches Angebot zum Abschluss eines Abonnement-Vertrags ab. Die Annahme erfolgt spätestens durch Freischaltung des Zugangs und Versand der Bestätigungs-E-Mail.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Der Vertragstext wird nach Vertragsschluss gespeichert und dem Kunden per E-Mail zugesandt.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 4 Preise, Zahlung, Abrechnung</h3>
              <p>(1) Es gelten die zum Zeitpunkt des Vertragsschlusses auf der Website ausgewiesenen Preise. Die Preise sind Nettopreise zzgl. gesetzlicher Umsatzsteuer, soweit anwendbar. Als Kleinunternehmer i.S.d. § 19 UStG wird derzeit keine Umsatzsteuer ausgewiesen.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Die Abrechnung erfolgt monatlich im Voraus über unseren Zahlungsdienstleister Stripe (Stripe Payments Europe Ltd., Irland). Der Kunde ermächtigt Stripe, den Rechnungsbetrag vom angegebenen Zahlungsmittel einzuziehen.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Bei Zahlungsverzug sind wir berechtigt, den Zugang zum Dienst auszusetzen, bis alle offenen Beträge beglichen sind.</p>
              <p style={{ marginTop: '0.75rem' }}>(4) Ein ggf. angebotener Testzeitraum („1 Monat gratis") wandelt sich automatisch in ein kostenpflichtiges Abonnement um, sofern nicht vor Ende des Testzeitraums gekündigt wird.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 5 Laufzeit, Kündigung</h3>
              <p>(1) Das Abonnement läuft zunächst auf einen Monat und verlängert sich automatisch um jeweils einen weiteren Monat, wenn es nicht mit einer Frist von einem Tag zum Ende der jeweiligen Laufzeit gekündigt wird.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Die Kündigung kann jederzeit per E-Mail an <a href="mailto:joka.chat.business@gmail.com" style={{ color: 'var(--primary)' }}>joka.chat.business@gmail.com</a> oder direkt über das Stripe-Kundenportal unter <Link href="/mein-abo" style={{ color: 'var(--primary)' }}>/mein-abo</Link> erfolgen.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt für beide Seiten unberührt.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 6 Widerrufsrecht</h3>
              <p>Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Die ausführliche <Link href="/widerruf" style={{ color: 'var(--primary)' }}>Widerrufsbelehrung</Link> inkl. Muster-Widerrufsformular ist Bestandteil dieser AGB. Sofern der Kunde im Bestellprozess ausdrücklich verlangt, dass die Dienstleistung vor Ablauf der Widerrufsfrist beginnt, und bestätigt, dass er dadurch sein Widerrufsrecht verliert, erlischt das Widerrufsrecht mit vollständiger Vertragserfüllung bzw. Aktivierung des Dienstes.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 7 Pflichten des Kunden</h3>
              <p>(1) Der Kunde ist verpflichtet, seine Zugangsdaten geheim zu halten und uns unverzüglich zu informieren, wenn er eine unbefugte Nutzung seines Accounts feststellt.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Bei Nutzung von AutoChat ist der Kunde verpflichtet, einen eigenen WhatsApp-Business-Account (Meta Business Portfolio) bereitzustellen oder die von uns angebotene Einrichtung zu nutzen. Die geschäftlichen Nutzungsbedingungen von Meta (<a href="https://www.whatsapp.com/legal/business-policy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>WhatsApp Business Policy</a>) sind einzuhalten.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Der Kunde ist dafür verantwortlich, seine eigenen Endkunden in geeigneter Weise darüber zu informieren, dass Nachrichten automatisiert von einer KI verarbeitet werden (Transparenzpflicht gem. DSGVO und AI-Act).</p>
              <p style={{ marginTop: '0.75rem' }}>(4) Der Kunde verpflichtet sich, den Dienst nicht für rechtswidrige Zwecke, Spam, belästigende Kommunikation oder zur Verbreitung von Inhalten zu nutzen, die gegen geltendes Recht oder die Richtlinien der eingebundenen Dritt-Dienste verstoßen.</p>
              <p style={{ marginTop: '0.75rem' }}>(5) Der Kunde stellt uns frei von Ansprüchen Dritter, die aus einer schuldhaft rechtswidrigen Nutzung des Dienstes durch ihn resultieren.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 8 Auftragsverarbeitung (Art. 28 DSGVO)</h3>
              <p>(1) Soweit der Anbieter im Rahmen der Dienste personenbezogene Daten der Endkunden des Kunden verarbeitet, handelt er als Auftragsverarbeiter des Kunden. Mit Vertragsschluss schließen die Parteien einen Auftragsverarbeitungsvertrag (AVV) nach Art. 28 DSGVO mit folgendem Inhalt ab:</p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                <li><strong>Gegenstand:</strong> Automatisierte KI-gestützte Beantwortung, Klassifikation und Terminplanung eingehender Nachrichten.</li>
                <li><strong>Art und Zweck:</strong> Bereitstellung der Dienste AutoChat / MailPilot gemäß § 2.</li>
                <li><strong>Datenkategorien:</strong> Nachrichteninhalte, Telefonnummern, E-Mail-Adressen, Kalender-Einträge.</li>
                <li><strong>Betroffene:</strong> Kommunikationspartner des Kunden (Endkunden).</li>
                <li><strong>Dauer:</strong> Laufzeit des Hauptvertrags.</li>
                <li><strong>Unterauftragsverarbeiter:</strong> Die in der <Link href="/datenschutz" style={{ color: 'var(--primary)' }}>Datenschutzerklärung</Link> genannten Dienstleister (insb. Anthropic, Vercel, Supabase, Meta, Google, Microsoft, Stripe, Resend). Der Kunde stimmt deren Einsatz mit Vertragsschluss zu.</li>
                <li><strong>Technisch-organisatorische Maßnahmen:</strong> Verschlüsselung at-rest und in-transit, rollenbasierte Zugriffskontrolle, tägliches Backup, Logging, Zwei-Faktor-Absicherung des Admin-Zugangs.</li>
                <li><strong>Weisungsrecht:</strong> Der Anbieter verarbeitet personenbezogene Daten ausschließlich im Rahmen des Vertrags und nach dokumentierten Weisungen des Kunden.</li>
                <li><strong>Nach Vertragsende:</strong> Löschung oder Rückgabe der Daten binnen 30 Tagen nach Vertragsende, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen.</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>(2) Ein separater AVV-Text kann auf Anfrage zur Verfügung gestellt werden.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 9 Gewährleistung & Haftung</h3>
              <p>(1) Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Bei einfacher Fahrlässigkeit haftet der Anbieter nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten). Die Haftung ist in diesen Fällen auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden begrenzt. Sie ist der Höhe nach begrenzt auf das 12-fache der vom Kunden innerhalb der letzten 12 Monate an den Anbieter gezahlten Vergütung.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Eine Haftung für mittelbare Schäden, entgangenen Gewinn oder für Schäden aus der unsachgemäßen Nutzung durch den Kunden ist ausgeschlossen, soweit gesetzlich zulässig.</p>
              <p style={{ marginTop: '0.75rem' }}>(4) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.</p>
              <p style={{ marginTop: '0.75rem' }}>(5) Der Anbieter übernimmt keine Gewähr für inhaltliche Richtigkeit KI-generierter Antworten. Der Kunde ist angehalten, die Einträge regelmäßig in der Inbox zu prüfen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 10 Verfügbarkeit, Wartung</h3>
              <p>Der Anbieter ist berechtigt, den Dienst zur Durchführung notwendiger Wartungs- oder Sicherheitsmaßnahmen vorübergehend zu unterbrechen. Geplante Wartungsfenster werden nach Möglichkeit außerhalb üblicher Geschäftszeiten gelegt.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 11 Änderung der AGB</h3>
              <p>Der Anbieter kann die AGB mit einer Ankündigungsfrist von mindestens 30 Tagen in Textform ändern. Widerspricht der Kunde den Änderungen nicht innerhalb dieser Frist, gelten sie als genehmigt. Auf diese Folge wird der Anbieter in der Änderungsmitteilung gesondert hinweisen. Bei Widerspruch hat der Kunde das Recht zur außerordentlichen Kündigung zum Wirksamkeitsdatum der geänderten AGB.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 12 Online-Streitbeilegung</h3>
              <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>ec.europa.eu/consumers/odr</a>. Wir sind nicht bereit und nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
            </div>

            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>§ 13 Schlussbestimmungen</h3>
              <p>(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Zwingende Verbraucherschutzvorschriften des Landes, in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat, bleiben unberührt.</p>
              <p style={{ marginTop: '0.75rem' }}>(2) Erfüllungsort und – soweit rechtlich zulässig – Gerichtsstand für alle Streitigkeiten aus Verträgen mit Kaufleuten, juristischen Personen des öffentlichen Rechts oder öffentlich-rechtlichem Sondervermögen ist Vechta.</p>
              <p style={{ marginTop: '0.75rem' }}>(3) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
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
