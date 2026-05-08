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
      getAcademySlugs: vi.fn(async () => []),
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
      getAcademySlugs: vi.fn(async () => []),
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
