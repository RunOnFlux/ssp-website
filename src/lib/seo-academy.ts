import type { AcademyCategory } from '@/constants/academy-categories'
import type { NewsroomPost, Author } from '@/types/newsroom'
import { siteName, siteUrl, createBreadcrumbJsonLd } from './seo'

function abs(url: string): string {
  return url.startsWith('http') ? url : `${siteUrl}${url}`
}

export function buildAcademyArticleJsonLd(
  post: NewsroomPost,
  category: AcademyCategory | string,
  author: Author | null,
  categoryTitle?: string
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/academy/${category}/${post.slug}`) },
    headline: post.title,
    description: post.description,
    image: abs(post.image),
    datePublished: post.date,
    dateModified: post.modifiedDate ?? post.date,
    author: author
      ? {
          '@type': 'Person',
          name: author.name,
          ...(author.websiteUrl ? { url: author.websiteUrl } : {}),
        }
      : { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/ssp-logo-black-512x512.png` },
    },
    articleSection: categoryTitle ?? category,
    learningResourceType: 'Article',
    ...(post.difficulty ? { educationalLevel: post.difficulty } : {}),
    keywords: post.tags.join(','),
  }
}

export function buildAcademyBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
): Record<string, unknown> {
  return createBreadcrumbJsonLd(items)
}
