import { describe, it, expect } from 'vitest'
import {
  ACADEMY_CATEGORIES,
  ACADEMY_CATEGORY_SLUGS,
  isAcademyCategory,
} from './academy-categories'

describe('ACADEMY_CATEGORIES', () => {
  it('includes all 7 SSP categories in plan order', () => {
    expect(Object.keys(ACADEMY_CATEGORIES)).toEqual([
      'multisig',
      'getting-started',
      'security',
      'how-to',
      'coin-guides',
      'defi',
      'news-explained',
    ])
  })

  it('every entry has title and description', () => {
    for (const [slug, meta] of Object.entries(ACADEMY_CATEGORIES)) {
      expect(meta.title, `${slug}.title`).toBeTruthy()
      expect(meta.description, `${slug}.description`).toBeTruthy()
    }
  })
})

describe('isAcademyCategory', () => {
  it('returns true for known slugs', () => {
    expect(isAcademyCategory('multisig')).toBe(true)
    expect(isAcademyCategory('defi')).toBe(true)
  })

  it('returns false for unknown', () => {
    expect(isAcademyCategory('nope')).toBe(false)
    expect(isAcademyCategory(42)).toBe(false)
    expect(isAcademyCategory(undefined)).toBe(false)
  })
})

describe('ACADEMY_CATEGORY_SLUGS', () => {
  it('matches the keys of ACADEMY_CATEGORIES', () => {
    expect([...ACADEMY_CATEGORY_SLUGS]).toEqual(Object.keys(ACADEMY_CATEGORIES))
  })
})
