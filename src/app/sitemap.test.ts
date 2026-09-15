import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  process.env.SSP_CMS_URL = 'https://cms.example.com'
  process.env.SSP_CMS_API_KEY = 'k'
})

describe('sitemap', () => {
  it('emits one entry per (locale, translated post) pair', async () => {
    vi.doMock('@/lib/cms', () => ({
      getAllPosts: vi.fn(async (locale: 'en' | 'es' | 'zh') => {
        if (locale === 'en')
          return [{ slug: 'foo-en', locale: 'en', servedLocale: 'en', date: '2026-01-01' }]
        if (locale === 'es')
          return [{ slug: 'foo-es', locale: 'es', servedLocale: 'es', date: '2026-01-01' }]
        return [{ slug: 'foo-en', locale: 'zh', servedLocale: 'en', date: '2026-01-01' }]
      }),
      getAcademyPosts: vi.fn(async () => []),
      getAllSeries: vi.fn(async () => []),
      getCategories: vi.fn(async () => []),
    }))
    const { default: sitemap } = await import('./sitemap')
    const entries = await sitemap()
    const urls = entries.map((e: { url: string }) => e.url)
    expect(urls.some((u: string) => u.endsWith('/en/newsroom/foo-en'))).toBe(true)
    expect(urls.some((u: string) => u.endsWith('/es/newsroom/foo-es'))).toBe(true)
    // ZH leg returns servedLocale='en' for the 'foo-en' slug — must NOT appear in sitemap
    expect(urls.some((u: string) => u.endsWith('/zh/newsroom/foo-en'))).toBe(false)
  })

  it('post with only EN translation emits a single URL', async () => {
    vi.doMock('@/lib/cms', () => ({
      getAllPosts: vi.fn(async (locale: 'en' | 'es' | 'zh') => {
        if (locale === 'en')
          return [{ slug: 'only-en', locale: 'en', servedLocale: 'en', date: '2026-01-01' }]
        return [{ slug: 'only-en', locale, servedLocale: 'en', date: '2026-01-01' }]
      }),
      getAcademyPosts: vi.fn(async () => []),
      getAllSeries: vi.fn(async () => []),
      getCategories: vi.fn(async () => []),
    }))
    const { default: sitemap } = await import('./sitemap')
    const entries = await sitemap()
    const onlyEnEntries = entries.filter((e: { url: string }) => e.url.includes('only-en'))
    expect(onlyEnEntries).toHaveLength(1)
    expect(onlyEnEntries[0].url).toContain('/en/newsroom/only-en')
  })
})

describe('sitemap lastModified', () => {
  /** Mocks the CMS with the given overrides, everything else empty. */
  async function loadSitemap(overrides: Record<string, unknown> = {}) {
    vi.doMock('@/lib/cms', () => ({
      getAllPosts: vi.fn(async () => []),
      getAcademyPosts: vi.fn(async () => []),
      getAllSeries: vi.fn(async () => []),
      getCategories: vi.fn(async () => []),
      ...overrides,
    }))
    const { default: sitemap } = await import('./sitemap')
    return sitemap()
  }

  const find = (entries: Array<{ url: string }>, suffix: string) =>
    entries.find(e => e.url.endsWith(suffix)) as
      | { url: string; lastModified?: Date }
      | undefined

  it('omits lastModified on static pages, which have no content date', async () => {
    const entries = await loadSitemap()

    for (const suffix of ['/en', '/en/privacy-policy', '/en/terms-of-service', '/en/features']) {
      const entry = find(entries, suffix)
      expect(entry, `expected ${suffix} in sitemap`).toBeDefined()
      expect(entry!.lastModified, `${suffix} must not carry a build-time date`).toBeUndefined()
    }
  })

  it('dates academy articles from the post, not from build time', async () => {
    const entries = await loadSitemap({
      getAcademyPosts: vi.fn(async () => [
        { slug: 'staking', category: 'basics', date: '2026-02-01T00:00:00.000Z' },
        {
          slug: 'edited',
          category: 'basics',
          date: '2026-01-01T00:00:00.000Z',
          modifiedDate: '2026-04-04T00:00:00.000Z',
        },
      ]),
    })

    expect(find(entries, '/en/academy/basics/staking')!.lastModified).toEqual(
      new Date('2026-02-01T00:00:00.000Z')
    )
    // modifiedDate wins over the original publish date
    expect(find(entries, '/en/academy/basics/edited')!.lastModified).toEqual(
      new Date('2026-04-04T00:00:00.000Z')
    )
  })

  it('still skips academy posts with no category', async () => {
    const entries = await loadSitemap({
      getAcademyPosts: vi.fn(async () => [
        { slug: 'orphan', category: null, date: '2026-02-01T00:00:00.000Z' },
      ]),
    })

    expect(find(entries, '/en/academy/null/orphan')).toBeUndefined()
    expect(entries.some(e => e.url.includes('orphan'))).toBe(false)
  })

  it('keeps newsroom and series entries on their own dates', async () => {
    const entries = await loadSitemap({
      getAllPosts: vi.fn(async (locale: string) =>
        locale === 'en'
          ? [
              {
                slug: 'news',
                servedLocale: 'en',
                date: '2026-01-01T00:00:00.000Z',
                modifiedDate: '2026-03-03T00:00:00.000Z',
              },
            ]
          : []
      ),
      getAllSeries: vi.fn(async (locale: string) =>
        locale === 'en'
          ? [{ slug: 'ser', servedLocale: 'en', updatedAt: '2026-05-05T00:00:00.000Z' }]
          : []
      ),
    })

    expect(find(entries, '/en/newsroom/news')!.lastModified).toEqual(
      new Date('2026-03-03T00:00:00.000Z')
    )
    expect(find(entries, '/en/academy/series/ser')!.lastModified).toEqual(
      new Date('2026-05-05T00:00:00.000Z')
    )
  })
})
