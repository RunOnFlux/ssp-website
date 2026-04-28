import { describe, it, expect } from 'vitest'
import { resolveAgentMdPath, isDynamicArticleRoute } from './resolve'

describe('resolveAgentMdPath', () => {
  it('maps /en/features to its sibling agent.md', () => {
    expect(resolveAgentMdPath('/en/features')).toBe('src/app/[locale]/features/agent.md')
  })

  it('maps locale root /en to home agent.md', () => {
    expect(resolveAgentMdPath('/en')).toBe('src/app/[locale]/agent.md')
  })

  it('treats /es/guide as the same English agent.md (en-only for v1)', () => {
    expect(resolveAgentMdPath('/es/guide')).toBe('src/app/[locale]/guide/agent.md')
  })

  it('returns null for routes without static agent.md', () => {
    expect(resolveAgentMdPath('/api/contact')).toBeNull()
  })
})

describe('isDynamicArticleRoute', () => {
  it('detects newsroom article route', () => {
    expect(isDynamicArticleRoute('/en/newsroom/some-slug')).toEqual({
      kind: 'newsroom',
      slug: 'some-slug',
    })
  })

  it('detects academy article route', () => {
    expect(isDynamicArticleRoute('/en/academy/security/some-slug')).toEqual({
      kind: 'academy',
      category: 'security',
      slug: 'some-slug',
    })
  })

  it('detects series route', () => {
    expect(isDynamicArticleRoute('/en/academy/series/some-slug')).toEqual({
      kind: 'series',
      slug: 'some-slug',
    })
  })

  it('detects author route', () => {
    expect(isDynamicArticleRoute('/en/author/ssp-team')).toEqual({
      kind: 'author',
      slug: 'ssp-team',
    })
  })

  it('returns null for static routes', () => {
    expect(isDynamicArticleRoute('/en/features')).toBeNull()
  })
})
