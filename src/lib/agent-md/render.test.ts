import { describe, it, expect } from 'vitest'
import type { NewsroomPost, Author } from '@/types/newsroom'
import { renderArticleAsAgentMd, renderAuthorAsAgentMd } from './render'

const basePost: NewsroomPost = {
  slug: 'test-article',
  title: 'Test Article Title',
  description: 'A short description of the test article.',
  content: '## Body\n\nSome body content.',
  image: '/images/test.png',
  imageAlt: 'test image',
  date: '2026-01-15',
  author: 'SSP Team',
  readTime: 3,
  tags: ['security', 'multisig'],
  section: 'newsroom',
}

const baseAuthor: Author = {
  slug: 'ssp-team',
  name: 'SSP Team',
  title: 'Core Team',
  bio: 'The SSP Wallet core development team.',
  avatar: null,
  twitterUrl: 'https://twitter.com/sspwallet_io',
  linkedinUrl: null,
  githubUrl: 'https://github.com/RunOnFlux/ssp-wallet',
  websiteUrl: 'https://sspwallet.io',
}

describe('renderArticleAsAgentMd', () => {
  it('includes title, url, and last_reviewed in frontmatter', () => {
    const md = renderArticleAsAgentMd(basePost)
    expect(md).toContain('title: "Test Article Title"')
    expect(md).toContain('url: https://sspwallet.io/newsroom/test-article')
    expect(md).toContain('last_reviewed: 2026-01-15')
  })

  it('includes post description in body', () => {
    const md = renderArticleAsAgentMd(basePost)
    expect(md).toContain('A short description of the test article.')
  })

  it('includes section, tags, and content', () => {
    const md = renderArticleAsAgentMd(basePost)
    expect(md).toContain('section: newsroom')
    expect(md).toContain('tags: ["security","multisig"]')
    expect(md).toContain('## Body')
    expect(md).toContain('Some body content.')
  })

  it('builds academy path with category', () => {
    const post: NewsroomPost = {
      ...basePost,
      slug: 'multisig-basics',
      section: 'academy',
      category: 'multisig',
    }
    const md = renderArticleAsAgentMd(post)
    expect(md).toContain('url: https://sspwallet.io/academy/multisig/multisig-basics')
    expect(md).toContain('category: multisig')
  })

  it('renders related slugs when present', () => {
    const post: NewsroomPost = { ...basePost, relatedSlugs: ['other-article', 'third-article'] }
    const md = renderArticleAsAgentMd(post)
    expect(md).toContain('- /newsroom/other-article')
    expect(md).toContain('- /newsroom/third-article')
  })

  it('renders _(none)_ when no related slugs', () => {
    const md = renderArticleAsAgentMd(basePost)
    expect(md).toContain('_(none)_')
  })
})

describe('renderAuthorAsAgentMd', () => {
  it('includes title, url, and last_reviewed in frontmatter', () => {
    const md = renderAuthorAsAgentMd(baseAuthor)
    expect(md).toContain('title: "SSP Team"')
    expect(md).toContain('url: https://sspwallet.io/author/ssp-team')
    expect(md).toContain('last_reviewed:')
  })

  it('includes author bio in body', () => {
    const md = renderAuthorAsAgentMd(baseAuthor)
    expect(md).toContain('The SSP Wallet core development team.')
  })

  it('renders present links and omits null ones', () => {
    const md = renderAuthorAsAgentMd(baseAuthor)
    expect(md).toContain('- Website: https://sspwallet.io')
    expect(md).toContain('- Twitter: https://twitter.com/sspwallet_io')
    expect(md).toContain('- GitHub: https://github.com/RunOnFlux/ssp-wallet')
    expect(md).not.toContain('LinkedIn')
  })
})
