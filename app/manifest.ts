import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Joka Chat – WhatsApp & E-Mail automatisch beantworten',
    short_name: 'Joka Chat',
    description: 'WhatsApp automatisch beantworten, E-Mails sortieren, Termine eintragen.',
    start_url: '/dashboard',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#ffffff',
    theme_color: '#006266',
    categories: ['business', 'productivity'],
    icons: [
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      {
        name: 'Inbox öffnen',
        url: '/dashboard',
        description: 'WhatsApp-Inbox öffnen',
      },
    ],
  }
}
