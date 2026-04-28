import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getAllPosts,
  getPostBySlug,
  getAcademyPosts,
  getCategories,
  getAllTags,
  extractHeadings,
  __clearCmsCache,
} from './cms'

const ORIG_ENV = { ...process.env }

beforeEach(() => {
  vi.restoreAllMocks()
  __clearCmsCache()
})

afterEach(() => {
  process.env = { ...ORIG_ENV }
})

describe('getAllPosts', () => {
  it('returns seed posts when CMS not configured', async () => {
    delete process.env.SSP_CMS_URL
    delete process.env.SSP_CMS_API_KEY
    const posts = await getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
  })

  it('falls back to seed when CMS errors', async () => {
    process.env.SSP_CMS_URL = 'https://cms.example.com'
    process.env.SSP_CMS_API_KEY = 'k'
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'))
    const posts = await getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
  })

  it('uses CMS when configured and reachable', async () => {
    process.env.SSP_CMS_URL = 'https://cms.example.com'
    process.env.SSP_CMS_API_KEY = 'k'
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          posts: [
            {
              slug: 'cms-only',
              section: 'newsroom',
              title: 'CMS',
              description: '',
              content: '',
              image: '',
              imageAlt: '',
              date: '2025-01-01',
              author: 'SSP',
              readTime: 1,
              tags: [],
            },
          ],
        }),
        { status: 200 }
      )
    )
    const posts = await getAllPosts()
    expect(posts[0].slug).toBe('cms-only')
  })
})

describe('getPostBySlug', () => {
  it('returns undefined for unknown slug (seed mode)', async () => {
    delete process.env.SSP_CMS_URL
    expect(await getPostBySlug('not-a-slug')).toBeUndefined()
  })
})

describe('getCategories', () => {
  it('returns 7 SSP categories with counts', async () => {
    delete process.env.SSP_CMS_URL
    const cats = await getCategories()
    expect(cats.length).toBe(7)
    expect(cats.map(c => c.slug).sort()).toEqual([
      'coin-guides',
      'defi',
      'getting-started',
      'how-to',
      'multisig',
      'news-explained',
      'security',
    ])
  })
})

describe('getAllTags', () => {
  it('aggregates unique tags from all posts', async () => {
    delete process.env.SSP_CMS_URL
    const tags = await getAllTags()
    expect(Array.isArray(tags)).toBe(true)
  })
})

describe('getAcademyPosts', () => {
  it('returns only academy section', async () => {
    delete process.env.SSP_CMS_URL
    const posts = await getAcademyPosts()
    expect(posts.every(p => p.section === 'academy')).toBe(true)
  })
})

describe('extractHeadings', () => {
  it('extracts h2 headings', () => {
    const md = `# Title\n\n## First section\nText\n\n## Second section`
    expect(extractHeadings(md)).toEqual([
      { id: 'first-section', text: 'First section' },
      { id: 'second-section', text: 'Second section' },
    ])
  })

  it('strips markdown emphasis', () => {
    expect(extractHeadings('## Bold *italic* word')).toEqual([
      { id: 'bold-italic-word', text: 'Bold italic word' },
    ])
  })

  it('handles special characters in slug', () => {
    expect(extractHeadings('## ERC-4337 & friends!')).toEqual([
      { id: 'erc-4337-friends', text: 'ERC-4337 & friends!' },
    ])
  })

  it('returns empty for content with no h2', () => {
    expect(extractHeadings('# h1\n### h3')).toEqual([])
  })

  it('skips ## inside fenced code blocks', () => {
    const md = [
      '## Real heading',
      '',
      '```md',
      '## Not a heading (in fence)',
      '```',
      '',
      '## Another real heading',
    ].join('\n')
    expect(extractHeadings(md)).toEqual([
      { id: 'real-heading', text: 'Real heading' },
      { id: 'another-real-heading', text: 'Another real heading' },
    ])
  })

  it('dedupes colliding slugs with numeric suffixes', () => {
    expect(extractHeadings('## Foo\n\n## Foo\n\n## Foo')).toEqual([
      { id: 'foo', text: 'Foo' },
      { id: 'foo-1', text: 'Foo' },
      { id: 'foo-2', text: 'Foo' },
    ])
  })
})

describe('withFallback (via getAllPosts)', () => {
  it('logs a warning when CMS primary fails', async () => {
    process.env.SSP_CMS_URL = 'https://cms.example.com'
    process.env.SSP_CMS_API_KEY = 'k'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'))
    await getAllPosts()
    expect(warnSpy).toHaveBeenCalled()
    const firstCallArgs = warnSpy.mock.calls[0]
    expect(String(firstCallArgs[0])).toMatch(/cms.*allPosts/i)
  })
})
