import { LRUCache } from 'lru-cache'
import type { AcademyCategory } from '@/constants/academy-categories'
import { ACADEMY_CATEGORY_SLUGS } from '@/constants/academy-categories'
import type { Locale } from '@/i18n/routing'
import type {
  NewsroomPost,
  CategoryWithCount,
  SeriesSummary,
  SeriesDetail,
  Author,
  ArticleDifficulty,
} from '@/types/newsroom'
import { cmsFetch, isCmsConfigured } from './cms/cms-fetch'
import { loadAllSeedPosts, loadSeedPostBySlug } from './cms/seed-loader'
import { cmsMediaUrl } from './cms-media'

const cache = new LRUCache<string, object>({ max: 256, ttl: 60_000 })

// Posts come back from the CMS with `image` / `imageSquare` / `imageStory` as
// site-rooted paths (e.g. `/media/123.png`). Rewrite them to absolute CMS URLs
// here, on the server, so client components and OG metadata receive ready-to-
// fetch URLs without needing the CMS-host env var exposed to the browser.
function normalizePostMedia<T extends Pick<NewsroomPost, 'image' | 'imageSquare' | 'imageStory'>>(
  post: T
): T {
  return {
    ...post,
    image: cmsMediaUrl(post.image),
    imageSquare: post.imageSquare ? cmsMediaUrl(post.imageSquare) : post.imageSquare,
    imageStory: post.imageStory ? cmsMediaUrl(post.imageStory) : post.imageStory,
  }
}

/** @internal exported for tests only */
export function __clearCmsCache(): void {
  cache.clear()
}

async function withFallback<T>(
  key: string,
  primary: () => Promise<T>,
  fallback: () => Promise<T>
): Promise<T> {
  if (cache.has(key)) return (cache.get(key) as { v: T }).v
  if (!isCmsConfigured()) {
    const f = await fallback()
    cache.set(key, { v: f })
    return f
  }
  try {
    const p = await primary()
    cache.set(key, { v: p })
    return p
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[cms] primary failed for ${key}, falling back to seed`, err)
    const f = await fallback()
    cache.set(key, { v: f })
    return f
  }
}

function unwrapPosts(r: NewsroomPost[] | { posts: NewsroomPost[] }): NewsroomPost[] {
  return (Array.isArray(r) ? r : r.posts).map(normalizePostMedia)
}

// ---- Newsroom ----

export async function getAllPosts(locale: Locale): Promise<NewsroomPost[]> {
  return withFallback(
    `allPosts:${locale}`,
    async () =>
      unwrapPosts(
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(
          '/api/v1/posts?section=newsroom&limit=100',
          { locale }
        )
      ),
    async () => (await loadAllSeedPosts({ locale })).filter(p => p.section === 'newsroom')
  )
}

export async function getPostBySlug(
  slug: string,
  locale: Locale
): Promise<NewsroomPost | undefined> {
  return withFallback(
    `post:${locale}:${slug}`,
    async () => {
      try {
        const post = await cmsFetch<NewsroomPost>(`/api/v1/posts/${encodeURIComponent(slug)}`, {
          revalidate: 300,
          locale,
        })
        return normalizePostMedia(post)
      } catch {
        return undefined
      }
    },
    async () => {
      const seed = await loadSeedPostBySlug(slug, { locale })
      return seed ? normalizePostMedia(seed) : seed
    }
  )
}

export async function getAllTags(section?: 'newsroom' | 'academy'): Promise<string[]> {
  const cacheKey = `tags:${section ?? 'all'}`
  const url = section ? `/api/v1/tags?section=${section}` : '/api/v1/tags'
  return withFallback(
    cacheKey,
    async () => (await cmsFetch<{ tag: string; count: number }[]>(url)).map(t => t.tag),
    async () => {
      const seed = await loadAllSeedPosts()
      const filtered = section ? seed.filter(p => p.section === section) : seed
      return Array.from(new Set(filtered.flatMap(p => p.tags))).sort()
    }
  )
}

export async function getAllSlugs(locale: Locale): Promise<string[]> {
  return (await getAllPosts(locale)).map(p => p.slug)
}

// ---- Academy ----

export interface AcademyFilters {
  category?: AcademyCategory
  difficulty?: ArticleDifficulty
  series?: string
  featured?: boolean
  limit?: number
}

export async function getAcademyPosts(
  filters: AcademyFilters = {},
  locale: Locale
): Promise<NewsroomPost[]> {
  const key = `academy:${locale}:${JSON.stringify(filters)}`
  return withFallback(
    key,
    async () => {
      const qs = new URLSearchParams({ section: 'academy' })
      if (filters.category) qs.set('category', filters.category)
      if (filters.difficulty) qs.set('difficulty', filters.difficulty)
      if (filters.series) qs.set('series', filters.series)
      if (filters.featured) qs.set('featured', 'true')
      if (filters.limit) qs.set('limit', String(filters.limit))
      return unwrapPosts(
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(`/api/v1/posts?${qs}`, {
          locale,
        })
      )
    },
    async () => {
      let posts = (await loadAllSeedPosts({ locale })).filter(p => p.section === 'academy')
      if (filters.category) posts = posts.filter(p => p.category === filters.category)
      if (filters.difficulty) posts = posts.filter(p => p.difficulty === filters.difficulty)
      if (filters.series) posts = posts.filter(p => p.seriesSlug === filters.series)
      if (filters.featured) posts = posts.filter(p => !!p.featured)
      if (filters.limit) posts = posts.slice(0, filters.limit)
      return posts
    }
  )
}

export async function getAcademyPostBySlug(
  slug: string,
  locale: Locale
): Promise<NewsroomPost | undefined> {
  return getPostBySlug(slug, locale)
}

export async function getAcademySlugs(
  locale: Locale
): Promise<Array<{ category: string; slug: string }>> {
  const posts = await getAcademyPosts({ limit: 1000 }, locale)
  return posts.filter(p => p.category).map(p => ({ category: p.category as string, slug: p.slug }))
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  return withFallback(
    'categories',
    async () => cmsFetch<CategoryWithCount[]>('/api/v1/categories'),
    async () => {
      const academyPosts = (await loadAllSeedPosts()).filter(p => p.section === 'academy')
      return ACADEMY_CATEGORY_SLUGS.map(slug => ({
        slug,
        title: '',
        description: '',
        postCount: academyPosts.filter(p => p.category === slug).length,
      }))
    }
  )
}

export async function getAllSeries(locale: Locale): Promise<SeriesSummary[]> {
  return withFallback(
    `series:${locale}`,
    async () => cmsFetch<SeriesSummary[]>('/api/v1/series', { locale }),
    async () => []
  )
}

export async function getSeriesBySlug(
  slug: string,
  locale: Locale
): Promise<SeriesDetail | undefined> {
  return withFallback(
    `series:${locale}:${slug}`,
    async () => {
      try {
        return await cmsFetch<SeriesDetail>(`/api/v1/series/${encodeURIComponent(slug)}`, {
          revalidate: 300,
          locale,
        })
      } catch {
        return undefined
      }
    },
    async () => undefined
  )
}

export async function getRelatedPosts(post: NewsroomPost, limit = 3): Promise<NewsroomPost[]> {
  const locale = post.locale
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const found = await Promise.all(post.relatedSlugs.map(s => getPostBySlug(s, locale)))
    return found.filter((p): p is NewsroomPost => !!p).slice(0, limit)
  }
  if (post.section === 'academy' && post.category) {
    const siblings = await getAcademyPosts(
      { category: post.category as AcademyCategory, limit: limit + 1 },
      locale
    )
    return siblings.filter(p => p.slug !== post.slug).slice(0, limit)
  }
  const all = await getAllPosts(locale)
  return all.filter(p => p.slug !== post.slug).slice(0, limit)
}

export async function getAuthorBySlug(slugOrId: string): Promise<Author | null> {
  return withFallback(
    `author:${slugOrId}`,
    async () => {
      try {
        return await cmsFetch<Author>(`/api/v1/authors/${encodeURIComponent(slugOrId)}`, 300)
      } catch {
        return null
      }
    },
    async () => {
      try {
        const fsmod = await import('fs/promises')
        const pathmod = await import('path')
        const file = pathmod.resolve(process.cwd(), 'content/authors', `${slugOrId}.json`)
        const raw = await fsmod.readFile(file, 'utf8')
        return JSON.parse(raw) as Author
      } catch {
        return null
      }
    }
  )
}

export async function getPostsByAuthor(authorId: string, locale: Locale): Promise<NewsroomPost[]> {
  return (await getAllPosts(locale)).filter(p => p.authorId === authorId)
}

export { extractHeadings } from './content-utils'
