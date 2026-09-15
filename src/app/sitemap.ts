import type { MetadataRoute } from 'next'
import { routing, type Locale } from '@/i18n/routing'
import { getAllPosts, getAcademyPosts, getAllSeries } from '@/lib/cms'
import { siteUrl } from '@/lib/seo'
import type { NewsroomPost, SeriesSummary } from '@/types/newsroom'

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency']

const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFrequency
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

/**
 * Listing pages. They hold no date of their own, but they are how Google
 * discovers new articles — so each is dated from the newest thing it lists
 * rather than left undated.
 */
const INDEX_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: ChangeFrequency
  datedFrom: 'newsroom' | 'academy' | 'series' | 'nothing'
}> = [
  { path: '/newsroom', priority: 0.8, changeFrequency: 'daily', datedFrom: 'newsroom' },
  { path: '/academy', priority: 0.8, changeFrequency: 'daily', datedFrom: 'academy' },
  { path: '/academy/articles', priority: 0.7, changeFrequency: 'weekly', datedFrom: 'academy' },
  { path: '/academy/series', priority: 0.7, changeFrequency: 'weekly', datedFrom: 'series' },
  // The glossary is a static term list with no dated source.
  { path: '/glossary', priority: 0.6, changeFrequency: 'monthly', datedFrom: 'nothing' },
]

function buildLocaleUrl(locale: string, path: string): string {
  return `${siteUrl}/${locale}${path === '/' ? '' : path}`
}

function languagesFor(path: string): Record<string, string> {
  return Object.fromEntries(routing.locales.map(l => [l, buildLocaleUrl(l, path)]))
}

/** Newest of a set of date strings, or undefined when none are usable. */
function newestDate(values: Array<string | null | undefined>): Date | undefined {
  let newest: number | undefined

  for (const value of values) {
    if (!value) continue
    const time = new Date(value).getTime()
    if (Number.isNaN(time)) continue
    if (newest === undefined || time > newest) newest = time
  }

  return newest === undefined ? undefined : new Date(newest)
}

type DatedPost = { date: string; modifiedDate?: string | null }
const contentDate = (post: DatedPost) => post.modifiedDate ?? post.date

/** Spreads to `{ lastModified }`, or to nothing when there is no real date. */
const lastModified = (date: Date | undefined) => (date ? { lastModified: date } : {})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // One fetch per locale, shared by the index pages and the entries below. A CMS
  // outage degrades to empty lists so static and index routes still ship.
  const content = new Map<
    Locale,
    { posts: NewsroomPost[]; academy: NewsroomPost[]; series: SeriesSummary[] }
  >()

  for (const locale of routing.locales) {
    const [posts, academy, series] = await Promise.all([
      getAllPosts(locale).catch(() => []),
      getAcademyPosts({ limit: 1000 }, locale).catch(() => []),
      getAllSeries(locale).catch(() => []),
    ])
    content.set(locale, { posts, academy, series })
  }

  const translatedPosts = (locale: Locale) =>
    content.get(locale)!.posts.filter(p => p.servedLocale === locale)
  const categorisedAcademy = (locale: Locale) =>
    content
      .get(locale)!
      .academy.filter((p): p is NewsroomPost & { category: string } => Boolean(p.category))
  const translatedSeries = (locale: Locale) =>
    content.get(locale)!.series.filter(s => s.servedLocale === locale)

  // Static routes carry no content date. Stamping build time on them would tell
  // Google every page changed on every deploy, which costs us the credibility of
  // the dates that are real — so the field is omitted instead.
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: buildLocaleUrl(locale, route.path),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: languagesFor(route.path) },
      })
    }
  }

  // Listing pages, dated from the newest item each one lists.
  for (const route of INDEX_ROUTES) {
    for (const locale of routing.locales) {
      const date =
        route.datedFrom === 'newsroom'
          ? newestDate(translatedPosts(locale).map(contentDate))
          : route.datedFrom === 'academy'
            ? newestDate(categorisedAcademy(locale).map(contentDate))
            : route.datedFrom === 'series'
              ? newestDate(translatedSeries(locale).map(s => s.updatedAt))
              : undefined

      entries.push({
        url: buildLocaleUrl(locale, route.path),
        ...lastModified(date),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: { languages: languagesFor(route.path) },
      })
    }
  }

  // Academy category pages. The page marks itself noindex when it has no posts,
  // so deriving the list from the posts themselves keeps empty categories out.
  for (const locale of routing.locales) {
    const datesByCategory = new Map<string, string[]>()

    for (const post of categorisedAcademy(locale)) {
      const dates = datesByCategory.get(post.category) ?? []
      dates.push(contentDate(post))
      datesByCategory.set(post.category, dates)
    }

    for (const [category, dates] of datesByCategory) {
      entries.push({
        url: buildLocaleUrl(locale, `/academy/${category}`),
        ...lastModified(newestDate(dates)),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Newsroom posts — per locale, only emit when the post is genuinely translated
  for (const locale of routing.locales) {
    for (const post of translatedPosts(locale)) {
      entries.push({
        url: buildLocaleUrl(locale, `/newsroom/${post.slug}`),
        lastModified: new Date(contentDate(post)),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // Academy articles — getAcademySlugs() discards the post dates, so read posts directly
  for (const locale of routing.locales) {
    for (const post of categorisedAcademy(locale)) {
      entries.push({
        url: buildLocaleUrl(locale, `/academy/${post.category}/${post.slug}`),
        lastModified: new Date(contentDate(post)),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // Academy series — per locale, only emit when the series is genuinely translated
  for (const locale of routing.locales) {
    for (const series of translatedSeries(locale)) {
      entries.push({
        url: buildLocaleUrl(locale, `/academy/series/${series.slug}`),
        lastModified: new Date(series.updatedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      })
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
