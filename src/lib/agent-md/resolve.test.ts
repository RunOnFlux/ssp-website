import { readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { resolveAgentMdPath, isDynamicArticleRoute } from './resolve'

const APP_DIR = 'src/app/[locale]'

/** Route paths (relative to APP_DIR) of every static page that ships a sibling agent.md. */
function staticAgentMdRoutes(dir = ''): string[] {
  const entries = readdirSync(path.join(APP_DIR, dir), { withFileTypes: true })
  return entries.flatMap(entry => {
    if (entry.isFile() && entry.name === 'agent.md') return [dir]
    if (entry.isDirectory() && !entry.name.startsWith('[')) {
      return staticAgentMdRoutes(dir ? `${dir}/${entry.name}` : entry.name)
    }
    return []
  })
}

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

  it('maps every static page that has a sibling agent.md', () => {
    const routes = staticAgentMdRoutes()
    expect(routes).toContain('brand')
    for (const route of routes) {
      const expected = route ? `${APP_DIR}/${route}/agent.md` : `${APP_DIR}/agent.md`
      expect(resolveAgentMdPath(route ? `/en/${route}` : '/en')).toBe(expected)
    }
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
