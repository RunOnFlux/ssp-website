import { describe, it, expect } from 'vitest'
import type { NewsroomPost } from '@/types/newsroom'
import { buildAcademyArticleJsonLd, buildAcademyBreadcrumbJsonLd } from './seo-academy'

const samplePost: NewsroomPost = {
  slug: 'what-is-2-of-2-multisig',
  title: 'What is 2-of-2 multisig?',
  description: 'A primer on 2-of-2 multisignature.',
  content: '## Heading\n\nbody',
  image: '/images/multisig.jpg',
  imageAlt: 'Multisig diagram',
  date: '2025-01-01',
  author: 'SSP Team',
  authorId: 'ssp-team',
  readTime: 6,
  tags: ['multisig', 'security'],
  section: 'academy',
  category: 'multisig',
  difficulty: 'beginner',
}

describe('buildAcademyArticleJsonLd', () => {
  it('emits BlogPosting with article-section and learningResourceType', () => {
    const j = buildAcademyArticleJsonLd(samplePost, 'multisig', null) as Record<string, unknown>
    expect(j['@type']).toBe('BlogPosting')
    expect(j.articleSection).toBe('Multisig Explained')
    expect(j.learningResourceType).toBe('Article')
    expect(j.educationalLevel).toBe('beginner')
    expect(j.keywords).toBe('multisig,security')
  })
})

describe('buildAcademyBreadcrumbJsonLd', () => {
  it('emits BreadcrumbList with positioned items', () => {
    const j = buildAcademyBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Academy', url: '/academy' },
      { name: 'Multisig' },
    ]) as { itemListElement: Array<{ position: number; name: string }> }
    expect(j.itemListElement[0].position).toBe(1)
    expect(j.itemListElement[2].name).toBe('Multisig')
  })
})
