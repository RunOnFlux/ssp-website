import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/seo'

const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
}> = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/enterprise', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/download', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/guide', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/support', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/case-studies/flux-foundation', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy', priority: 0.2, changeFrequency: 'yearly' },
]

function buildLocaleUrl(locale: string, path: string): string {
  return `${siteUrl}/${locale}${path === '/' ? '' : path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: buildLocaleUrl(locale, route.path),
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map(l => [l, buildLocaleUrl(l, route.path)])
          ),
        },
      })
    }
  }
  return entries
}
