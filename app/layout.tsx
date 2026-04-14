import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowly – WhatsApp & E-Mail automatisch beantworten',
  description: 'Flowly automatisiert deinen WhatsApp und deine E-Mails. WhatsApp automatisch beantworten, E-Mails sortieren, Termine in Google Kalender eintragen – einmal einrichten, dauerhaft sparen.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="lazyOnload" />
      </head>
      <body>{children}</body>
    </html>
  )
}
