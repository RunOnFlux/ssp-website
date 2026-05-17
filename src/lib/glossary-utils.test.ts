import { describe, it, expect } from 'vitest'
import type { GlossaryEntry } from '@/constants/glossary/types'
import { normalizeSlug, groupByFirstLetter, difficultyBadgeClass } from './glossary-utils'

describe('normalizeSlug', () => {
  it('lowercases and replaces non-alphanumerics with single dash', () => {
    expect(normalizeSlug('0x Protocol')).toBe('0x-protocol')
    expect(normalizeSlug('Seed Phrase')).toBe('seed-phrase')
    expect(normalizeSlug('Two-Of-Two MULTISIG')).toBe('two-of-two-multisig')
  })
  it('strips diacritics via NFKD normalization', () => {
    expect(normalizeSlug('Café')).toBe('cafe')
    expect(normalizeSlug('Naïve')).toBe('naive')
  })
  it('trims leading/trailing dashes', () => {
    expect(normalizeSlug('  --foo--  ')).toBe('foo')
    expect(normalizeSlug('!!!bar!!!')).toBe('bar')
  })
  it('collapses runs of non-alphanumerics into one dash', () => {
    expect(normalizeSlug('a   b___c')).toBe('a-b-c')
  })
})

describe('groupByFirstLetter', () => {
  const entries: GlossaryEntry[] = [
    { title: 'Address', slug: 'address', excerpt: '', source: 'cmc' },
    { title: 'Air-gapped', slug: 'air-gapped', excerpt: '', source: 'cmc' },
    { title: 'Bitcoin', slug: 'bitcoin', excerpt: '', source: 'cmc' },
    { title: '0x Protocol', slug: '0x-protocol', excerpt: '', source: 'cmc' },
    { title: '1hr', slug: '1hr', excerpt: '', source: 'cmc' },
  ]
  it('groups entries by uppercased first letter of title', () => {
    const groups = groupByFirstLetter(entries)
    expect(groups['A']).toHaveLength(2)
    expect(groups['B']).toHaveLength(1)
  })
  it('groups numerics under "#"', () => {
    const groups = groupByFirstLetter(entries)
    expect(groups['#']).toHaveLength(2)
    expect(groups['#'].map(e => e.title)).toEqual(['0x Protocol', '1hr'])
  })
  it('produces no empty buckets', () => {
    const groups = groupByFirstLetter(entries)
    for (const letter of Object.keys(groups)) {
      expect(groups[letter].length).toBeGreaterThan(0)
    }
  })
})

describe('difficultyBadgeClass', () => {
  it('returns expected class per level', () => {
    expect(difficultyBadgeClass(1)).toContain('green')
    expect(difficultyBadgeClass(2)).toContain('yellow')
    expect(difficultyBadgeClass(3)).toContain('red')
  })
})
