import type { AcademyCategory } from '@/constants/academy-categories'
import type { Locale } from '@/i18n/routing'

export type ArticleSection = 'newsroom' | 'academy'
export type ArticleDifficulty = 'beginner' | 'intermediate' | 'advanced'

export interface NewsroomPost {
  slug: string
  title: string
  description: string
  content: string
  image: string
  imageAlt: string
  imageSquare?: string | null
  imageSquareAlt?: string | null
  imageStory?: string | null
  imageStoryAlt?: string | null
  date: string
  modifiedDate?: string | null
  author: string
  authorId?: string | null
  readTime: number
  tags: string[]
  section: ArticleSection
  category?: AcademyCategory | null
  difficulty?: ArticleDifficulty | null
  seriesSlug?: string | null
  seriesOrder?: number | null
  featured?: boolean
  pinned?: boolean
  seoTitle?: string | null
  seoDescription?: string | null
  canonicalUrl?: string | null
  noindex?: boolean
  relatedSlugs?: string[]
  slugHistory?: string[]
  locale: Locale
  servedLocale: Locale
}

export interface Author {
  slug: string
  name: string
  title: string | null
  bio: string | null
  avatar: string | null
  twitterUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
}

export interface CategoryWithCount {
  slug: string
  title: string
  description: string
  postCount: number
}

export interface SeriesSummary {
  slug: string
  title: string
  description: string
  heroImage: string
  heroImageAlt: string
  category: string
  seoTitle: string | null
  seoDescription: string | null
  updatedAt: string
  postCount: number
  locale: Locale
  servedLocale: Locale
}

export interface SeriesDetail extends Omit<SeriesSummary, 'postCount'> {
  posts: NewsroomPost[]
}
