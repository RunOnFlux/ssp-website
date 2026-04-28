import { LRUCache } from 'lru-cache'
import type { AcademyCategory } from '@/constants/academy-categories'
import { ACADEMY_CATEGORIES } from '@/constants/academy-categories'
import type {
  NewsroomPost,
  CategoryWithCount,
  SeriesSummary,
  SeriesDetail,
  Author,
} from '@/types/newsroom'
import { cmsFetch, isCmsConfigured } from './cms/cms-fetch'
import { loadAllSeedPosts, loadSeedPostBySlug } from './cms/seed-loader'

const cache = new LRUCache<string, object>({ max: 256, ttl: 60_000 })

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
  } catch {
    const f = await fallback()
    cache.set(key, { v: f })
    return f
  }
}

function unwrapPosts(r: NewsroomPost[] | { posts: NewsroomPost[] }): NewsroomPost[] {
  return Array.isArray(r) ? r : r.posts
}

// ---- Newsroom ----

export async function getAllPosts(): Promise<NewsroomPost[]> {
  return withFallback(
    'allPosts',
    async () =>
      unwrapPosts(
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(
          '/api/v1/posts?section=newsroom&limit=100'
        )
      ),
    async () => (await loadAllSeedPosts()).filter(p => p.section === 'newsroom')
  )
}

export async function getPostBySlug(slug: string): Promise<NewsroomPost | undefined> {
  return withFallback(
    `post:${slug}`,
    async () => {
      try {
        return await cmsFetch<NewsroomPost>(`/api/v1/posts/${encodeURIComponent(slug)}`, 300)
      } catch {
        return undefined
      }
    },
    async () => loadSeedPostBySlug(slug)
  )
}

export async function getAllTags(): Promise<string[]> {
  return withFallback(
    'tags',
    async () => (await cmsFetch<{ tag: string; count: number }[]>('/api/v1/tags')).map(t => t.tag),
    async () => Array.from(new Set((await loadAllSeedPosts()).flatMap(p => p.tags))).sort()
  )
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getAllPosts()).map(p => p.slug)
}

// ---- Academy ----

export interface AcademyFilters {
  category?: AcademyCategory
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  series?: string
  featured?: boolean
  limit?: number
}

export async function getAcademyPosts(filters: AcademyFilters = {}): Promise<NewsroomPost[]> {
  const key = `academy:${JSON.stringify(filters)}`
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
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(`/api/v1/posts?${qs}`)
      )
    },
    async () => {
      let posts = (await loadAllSeedPosts()).filter(p => p.section === 'academy')
      if (filters.category) posts = posts.filter(p => p.category === filters.category)
      if (filters.difficulty) posts = posts.filter(p => p.difficulty === filters.difficulty)
      if (filters.series) posts = posts.filter(p => p.seriesSlug === filters.series)
      if (filters.featured) posts = posts.filter(p => !!p.featured)
      if (filters.limit) posts = posts.slice(0, filters.limit)
      return posts
    }
  )
}

export async function getAcademyPostBySlug(slug: string): Promise<NewsroomPost | undefined> {
  return getPostBySlug(slug)
}

export async function getAcademySlugs(): Promise<Array<{ category: string; slug: string }>> {
  const posts = await getAcademyPosts({ limit: 1000 })
  return posts.filter(p => p.category).map(p => ({ category: p.category as string, slug: p.slug }))
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  return withFallback(
    'categories',
    async () => cmsFetch<CategoryWithCount[]>('/api/v1/categories'),
    async () => {
      const academyPosts = (await loadAllSeedPosts()).filter(p => p.section === 'academy')
      return Object.entries(ACADEMY_CATEGORIES).map(([slug, meta]) => ({
        slug,
        title: meta.title,
        description: meta.description,
        postCount: academyPosts.filter(p => p.category === slug).length,
      }))
    }
  )
}

export async function getAllSeries(): Promise<SeriesSummary[]> {
  return withFallback(
    'series',
    async () => cmsFetch<SeriesSummary[]>('/api/v1/series'),
    async () => []
  )
}

export async function getSeriesBySlug(slug: string): Promise<SeriesDetail | undefined> {
  return withFallback(
    `series:${slug}`,
    async () => {
      try {
        return await cmsFetch<SeriesDetail>(`/api/v1/series/${encodeURIComponent(slug)}`, 300)
      } catch {
        return undefined
      }
    },
    async () => undefined
  )
}

export async function getRelatedPosts(post: NewsroomPost, limit = 3): Promise<NewsroomPost[]> {
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const found = await Promise.all(post.relatedSlugs.map(s => getPostBySlug(s)))
    return found.filter((p): p is NewsroomPost => !!p).slice(0, limit)
  }
  if (post.section === 'academy' && post.category) {
    const siblings = await getAcademyPosts({
      category: post.category as AcademyCategory,
      limit: limit + 1,
    })
    return siblings.filter(p => p.slug !== post.slug).slice(0, limit)
  }
  const all = await getAllPosts()
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

export async function getPostsByAuthor(authorId: string): Promise<NewsroomPost[]> {
  return (await getAllPosts()).filter(p => p.authorId === authorId)
}

export function extractHeadings(content: string): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm
  const headings: { id: string; text: string }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim().replace(/[*_`~]+/g, '')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    headings.push({ id, text })
  }
  return headings
}
