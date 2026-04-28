import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { AcademyCategory } from '@/constants/academy-categories'
import { isAcademyCategory } from '@/constants/academy-categories'
import type { NewsroomPost } from '@/types/newsroom'

const CONTENT_DIR = path.resolve(process.cwd(), 'content')

export function isTestFixture(filename: string): boolean {
  return path.basename(filename).startsWith('_')
}

interface SeedOptions {
  includeFixtures?: boolean
}

async function readPostsFromDir(
  dir: string,
  section: 'newsroom' | 'academy',
  category: AcademyCategory | undefined,
  opts: SeedOptions
): Promise<NewsroomPost[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(dir)
  } catch {
    return []
  }
  const posts: NewsroomPost[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    if (!opts.includeFixtures && isTestFixture(entry)) continue
    const fullPath = path.join(dir, entry)
    const raw = await fs.readFile(fullPath, 'utf8')
    const { data, content } = matter(raw)
    posts.push({
      slug: (data.slug as string) ?? entry.replace(/^_/, '').replace(/\.md$/, ''),
      title: (data.title as string) ?? '',
      description: (data.description as string) ?? '',
      content,
      image: (data.image as string) ?? '/og-image.png',
      imageAlt: (data.imageAlt as string) ?? '',
      imageSquare: (data.imageSquare as string) ?? null,
      imageSquareAlt: (data.imageSquareAlt as string) ?? null,
      imageStory: (data.imageStory as string) ?? null,
      imageStoryAlt: (data.imageStoryAlt as string) ?? null,
      date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
      modifiedDate: (data.modifiedDate as string | null) ?? null,
      author: (data.author as string) ?? 'SSP Team',
      authorId: (data.authorId as string | null) ?? null,
      readTime: typeof data.readTime === 'number' ? data.readTime : 5,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      section,
      category: category ?? (data.category as NewsroomPost['category']) ?? null,
      difficulty: (data.difficulty as NewsroomPost['difficulty']) ?? null,
      seriesSlug: (data.seriesSlug as string | null) ?? null,
      seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : null,
      featured: !!data.featured,
      pinned: !!data.pinned,
      seoTitle: (data.seoTitle as string | null) ?? null,
      seoDescription: (data.seoDescription as string | null) ?? null,
      canonicalUrl: (data.canonicalUrl as string | null) ?? null,
      noindex: !!data.noindex,
      relatedSlugs: Array.isArray(data.relatedSlugs) ? (data.relatedSlugs as string[]) : [],
      slugHistory: Array.isArray(data.slugHistory) ? (data.slugHistory as string[]) : [],
    })
  }
  return posts
}

async function readAcademyPosts(opts: SeedOptions): Promise<NewsroomPost[]> {
  const academyDir = path.join(CONTENT_DIR, 'academy')
  let categories: string[]
  try {
    categories = await fs.readdir(academyDir)
  } catch {
    return []
  }
  const all: NewsroomPost[] = []
  for (const cat of categories) {
    const catDir = path.join(academyDir, cat)
    const stat = await fs.stat(catDir).catch(() => null)
    if (!stat?.isDirectory()) continue
    const catSlug = isAcademyCategory(cat) ? cat : undefined
    const posts = await readPostsFromDir(catDir, 'academy', catSlug, opts)
    all.push(...posts)
  }
  return all
}

export async function loadAllSeedPosts(opts: SeedOptions = {}): Promise<NewsroomPost[]> {
  const newsroomDir = path.join(CONTENT_DIR, 'newsroom')
  const [newsroom, academy] = await Promise.all([
    readPostsFromDir(newsroomDir, 'newsroom', undefined, opts),
    readAcademyPosts(opts),
  ])
  const posts = [...newsroom, ...academy]
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return posts
}

export async function loadSeedPostBySlug(
  slug: string,
  opts: SeedOptions = {}
): Promise<NewsroomPost | undefined> {
  const all = await loadAllSeedPosts(opts)
  return all.find(p => p.slug === slug || (p.slugHistory ?? []).includes(slug))
}
