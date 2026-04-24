import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import CookieBanner from './components/CookieBanner'
import PwaSetup from './components/PwaSetup'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://joka.chat'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'joka.chat – WhatsApp & E-Mail automatisch beantworten',
    template: '%s | joka.chat',
  },
  description:
    'joka.chat automatisiert deinen WhatsApp und deine E-Mails. WhatsApp automatisch beantworten, E-Mails sortieren, Termine in Google Kalender eintragen – einmal einrichten, dauerhaft Zeit sparen.',
  keywords: [
    'WhatsApp automatisch beantworten',
    'WhatsApp Bot Deutsch',
    'E-Mail automatisch sortieren',
    'Gmail Automatisierung',
    'Outlook Automatisierung',
    'Termine in Google Kalender',
    'KI für Friseur',
    'Automatisierung Restaurant',
    'Chatbot WhatsApp Business',
    'Website erstellen lassen',
    'Webdesign für Kleinunternehmen',
    'SEO optimierte Website',
    'individuelle Website entwickeln',
    'joka.chat',
  ],
  authors: [{ name: 'Jonas Kalwa', url: 'https://www.linkedin.com/in/jonas-kalwa-3333612a1/' }],
  creator: 'Jonas Kalwa',
  publisher: 'joka.chat',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large', 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: SITE_URL,
    siteName: 'joka.chat',
    title: 'joka.chat – WhatsApp & E-Mail automatisch beantworten',
    description:
      'WhatsApp automatisch beantworten, E-Mails sortieren, Termine in Google Kalender oder Outlook eintragen. Einmal einrichten, täglich Stunden sparen.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'joka.chat – Automatisierung für lokale Businesses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'joka.chat – WhatsApp & E-Mail automatisch beantworten',
    description:
      'WhatsApp automatisch beantworten, E-Mails sortieren, Termine eintragen. Einmal einrichten, dauerhaft sparen.',
    images: ['/og.png'],
  },
  category: 'technology',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  other: { 'theme-color': '#006266' },
}

const jsonLdOrg = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'joka.chat',
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
  email: 'joka.chat.business@gmail.com',
  sameAs: ['https://www.linkedin.com/in/jonas-kalwa-3333612a1/'],
  founder: { '@type': 'Person', name: 'Jonas Kalwa' },
  areaServed: 'DE',
}

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'joka.chat',
  url: SITE_URL,
  inLanguage: 'de-DE',
  publisher: { '@type': 'Organization', name: 'joka.chat' },
}

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'joka.chat',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'joka.chat automatisiert WhatsApp-Antworten und sortiert E-Mails in Gmail oder Outlook. Termine werden automatisch in Google Kalender oder Outlook Kalender eingetragen.',
  offers: [
    { '@type': 'Offer', name: 'AutoChat', price: '39', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=autochat` },
    { '@type': 'Offer', name: 'MailPilot', price: '29', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=mailpilot` },
    { '@type': 'Offer', name: 'AutoChat + MailPilot Bundle', price: '49', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=bundle` },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '12' },
}

const jsonLdWebsiteService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Webdesign',
  name: 'Individuelle Website-Entwicklung',
  url: `${SITE_URL}/website`,
  provider: { '@type': 'Organization', name: 'joka.chat', url: SITE_URL },
  areaServed: 'DE',
  description:
    'Individuelle Website-Entwicklung für kleine Unternehmen – modern, performance-optimiert und SEO-ready. Von Konzept bis Launch aus einer Hand.',
}

const jsonLdFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Muss ich etwas installieren?',
      acceptedAnswer: { '@type': 'Answer', text: 'Nein. joka.chat läuft komplett im Hintergrund – kein Download, keine App, kein Aufwand.' },
    },
    {
      '@type': 'Question',
      name: 'Was passiert wenn die KI eine Frage nicht beantworten kann?',
      acceptedAnswer: { '@type': 'Answer', text: 'AutoChat antwortet ehrlich, dass es die Frage nicht beantworten kann, und weist den Kunden darauf hin, sich direkt zu melden. Über deine Inbox kannst du jederzeit selbst übernehmen.' },
    },
    {
      '@type': 'Question',
      name: 'Kann ich jederzeit kündigen?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ja. Kein Vertrag, monatlich kündbar. Über "Mein Abo" kannst du dein Abo jederzeit selbst verwalten.' },
    },
    {
      '@type': 'Question',
      name: 'Sind meine Daten sicher?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ja. Alle Daten werden verschlüsselt auf EU-Servern gespeichert. Kein Passwort wird bei uns hinterlegt. Die Verbindung zu WhatsApp und Gmail läuft ausschließlich über offizielle APIs – sicher und jederzeit widerrufbar.' },
    },
    {
      '@type': 'Question',
      name: 'Wie lange dauert die Einrichtung?',
      acceptedAnswer: { '@type': 'Answer', text: 'AutoChat ist nach einem kurzen Einrichtungs-Call einsatzbereit. MailPilot läuft nach dem Google-Login vollautomatisch an – das dauert unter 5 Minuten.' },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="joka.chat" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="afterInteractive" />
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
        <Script id="ld-software" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }} />
        <Script id="ld-website-service" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsiteService) }} />
        <Script id="ld-faq" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      </head>
      <body>{children}<Analytics /><CookieBanner /><PwaSetup /></body>
    </html>
  )
}
