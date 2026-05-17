import { describe, it, expect } from 'vitest'
import { getGlossary, GLOSSARY } from './index'

describe('getGlossary', () => {
  it('returns at least 2,000 merged entries', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(2000)
  })

  it('returns a frozen array (cannot push)', () => {
    expect(() => {
      // @ts-expect-error - intentional runtime mutation attempt
      GLOSSARY.push({
        title: 'Test',
        slug: 'test',
        excerpt: '',
        source: 'web',
      })
    }).toThrow()
  })

  it('has no duplicate slugs after dedup', () => {
    const slugs = new Set(GLOSSARY.map(e => e.slug))
    expect(slugs.size).toBe(GLOSSARY.length)
  })

  it('is sorted alphabetically by title (en-US locale collation)', () => {
    for (let i = 1; i < GLOSSARY.length; i++) {
      const prev = GLOSSARY[i - 1].title
      const curr = GLOSSARY[i].title
      expect(prev.localeCompare(curr, 'en')).toBeLessThanOrEqual(0)
    }
  })

  it('tags every entry with a source discriminator', () => {
    for (const entry of GLOSSARY) {
      expect(['ssp-curated', 'cmc', 'web']).toContain(entry.source)
    }
  })

  it('lets ssp-curated win over cmc on a known collision', () => {
    // "multisig" is in both cmc.json and ssp-curated.json.
    // ssp-curated should win per the merge precedence.
    const entry = GLOSSARY.find(e => e.slug === 'multisig')
    expect(entry).toBeDefined()
    expect(entry?.source).toBe('ssp-curated')
  })
})
