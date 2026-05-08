import { describe, it, expect } from 'vitest'
import { loadAllSeedPosts, loadSeedPostBySlug, isTestFixture } from './seed-loader'

describe('isTestFixture', () => {
  it('flags files prefixed with underscore', () => {
    expect(isTestFixture('_test-fixture.md')).toBe(true)
    expect(isTestFixture('real-article.md')).toBe(false)
  })
})

describe('loadAllSeedPosts', () => {
  it('returns posts from /content/newsroom and /content/academy/*', async () => {
    const posts = await loadAllSeedPosts({ includeFixtures: true })
    expect(posts.length).toBeGreaterThanOrEqual(1)
    const fixture = posts.find(p => p.slug === 'test-fixture')
    expect(fixture).toBeDefined()
    expect(fixture?.section).toBe('newsroom')
    expect(fixture?.tags).toContain('fixture')
  })

  it('excludes test fixtures by default', async () => {
    const posts = await loadAllSeedPosts()
    expect(posts.find(p => p.slug === 'test-fixture')).toBeUndefined()
  })

  it('returns sorted by date descending', async () => {
    const posts = await loadAllSeedPosts({ includeFixtures: true })
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime()
      )
    }
  })
})

describe('loadSeedPostBySlug', () => {
  it('returns the matching post', async () => {
    const p = await loadSeedPostBySlug('test-fixture', { includeFixtures: true })
    expect(p?.slug).toBe('test-fixture')
  })

  it('returns undefined for unknown slugs', async () => {
    const p = await loadSeedPostBySlug('definitely-not-a-real-slug')
    expect(p).toBeUndefined()
  })
})

describe('seed loader locale stamping', () => {
  it('loadAllSeedPosts stamps locale=requested and servedLocale=en', async () => {
    const posts = await loadAllSeedPosts({ locale: 'es', includeFixtures: true })
    expect(posts.length).toBeGreaterThan(0)
    for (const p of posts) {
      expect(p.locale).toBe('es')
      expect(p.servedLocale).toBe('en')
    }
  })

  it('loadAllSeedPosts defaults locale to en when not specified', async () => {
    const posts = await loadAllSeedPosts({ includeFixtures: true })
    expect(posts.length).toBeGreaterThan(0)
    for (const p of posts) {
      expect(p.locale).toBe('en')
      expect(p.servedLocale).toBe('en')
    }
  })

  it('loadSeedPostBySlug stamps locale and servedLocale', async () => {
    const all = await loadAllSeedPosts({ includeFixtures: true })
    if (all.length === 0) return
    const post = await loadSeedPostBySlug(all[0].slug, { locale: 'zh', includeFixtures: true })
    expect(post).toBeDefined()
    expect(post!.locale).toBe('zh')
    expect(post!.servedLocale).toBe('en')
  })
})
