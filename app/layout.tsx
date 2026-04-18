import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import CookieBanner from './components/CookieBanner'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://joka.chat'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Joka – WhatsApp & E-Mail automatisch beantworten',
    template: '%s | Joka',
  },
  description:
    'Joka automatisiert deinen WhatsApp und deine E-Mails. WhatsApp automatisch beantworten, E-Mails sortieren, Termine in Google Kalender eintragen – einmal einrichten, dauerhaft Zeit sparen.',
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
    'Joka',
  ],
  authors: [{ name: 'Jonas Kalwa', url: 'https://jonaskalwa.de' }],
  creator: 'Jonas Kalwa',
  publisher: 'Joka',
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
    siteName: 'Joka',
    title: 'Joka – WhatsApp & E-Mail automatisch beantworten',
    description:
      'WhatsApp automatisch beantworten, E-Mails sortieren, Termine in Google Kalender oder Outlook eintragen. Einmal einrichten, täglich Stunden sparen.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Joka – Automatisierung für lokale Businesses' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joka – WhatsApp & E-Mail automatisch beantworten',
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
  name: 'Joka',
  url: SITE_URL,
  logo: `${SITE_URL}/og.png`,
  email: 'joka.chat.business@gmail.com',
  sameAs: ['https://jonaskalwa.de'],
  founder: { '@type': 'Person', name: 'Jonas Kalwa' },
  areaServed: 'DE',
}

const jsonLdWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Joka',
  url: SITE_URL,
  inLanguage: 'de-DE',
  publisher: { '@type': 'Organization', name: 'Joka' },
}

const jsonLdSoftware = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Joka',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description:
    'Joka automatisiert WhatsApp-Antworten und sortiert E-Mails in Gmail oder Outlook. Termine werden automatisch in Google Kalender oder Outlook Kalender eingetragen.',
  offers: [
    { '@type': 'Offer', name: 'AutoChat', price: '39', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=autochat` },
    { '@type': 'Offer', name: 'MailPilot', price: '29', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=mailpilot` },
    { '@type': 'Offer', name: 'AutoChat + MailPilot Bundle', price: '49', priceCurrency: 'EUR', url: `${SITE_URL}/bestellen?produkt=bundle` },
  ],
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '12' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="afterInteractive" />
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
        <Script id="ld-software" type="application/ld+json" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftware) }} />
      </head>
      <body>{children}<Analytics /><CookieBanner /></body>
    </html>
  )
}
