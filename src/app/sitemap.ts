import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getAllPosts, getAcademySlugs, getAllSeries } from '@/lib/cms'
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

  // Static routes
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

  // Newsroom posts — per locale, only emit when the post is genuinely translated
  for (const locale of routing.locales) {
    try {
      const newsroomPosts = await getAllPosts(locale)
      for (const post of newsroomPosts.filter(p => p.servedLocale === locale)) {
        entries.push({
          url: buildLocaleUrl(locale, `/newsroom/${post.slug}`),
          lastModified: new Date(post.modifiedDate ?? post.date),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    } catch {
      // CMS unavailable — skip dynamic newsroom entries for this locale
    }
  }

  // Academy articles — per locale, only emit when the post is genuinely translated
  for (const locale of routing.locales) {
    try {
      const academySlugs = await getAcademySlugs(locale)
      for (const { category, slug } of academySlugs) {
        entries.push({
          url: buildLocaleUrl(locale, `/academy/${category}/${slug}`),
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    } catch {
      // CMS unavailable — skip dynamic academy entries for this locale
    }
  }

  // Academy series — per locale, only emit when the series is genuinely translated
  for (const locale of routing.locales) {
    try {
      const allSeries = await getAllSeries(locale)
      for (const series of allSeries.filter(s => s.servedLocale === locale)) {
        entries.push({
          url: buildLocaleUrl(locale, `/academy/series/${series.slug}`),
          lastModified: new Date(series.updatedAt),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    } catch {
      // CMS unavailable — skip dynamic series entries for this locale
    }
  }

  // Author profiles
  try {
    const fs = await import('fs/promises')
    const path = await import('path')
    const authorsDir = path.resolve(process.cwd(), 'content/authors')
    const authorEntries = await fs.readdir(authorsDir).catch(() => [] as string[])
    for (const entry of authorEntries) {
      if (!entry.endsWith('.json')) continue
      const slug = entry.replace(/\.json$/, '')
      for (const locale of routing.locales) {
        entries.push({
          url: buildLocaleUrl(locale, `/author/${slug}`),
          lastModified,
          changeFrequency: 'monthly',
          priority: 0.5,
        })
      }
    }
  } catch {
    // content/authors missing — skip author entries
  }

  return entries
}
