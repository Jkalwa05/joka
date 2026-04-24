import type { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://joka.chat'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/autochat', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/mailpilot', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/website', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/so-funktionierts', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/bestellen', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/kontakt', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/anmelden', priority: 0.4, changeFrequency: 'yearly' },
    { path: '/impressum', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/datenschutz', priority: 0.3, changeFrequency: 'yearly' },
  ]
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
