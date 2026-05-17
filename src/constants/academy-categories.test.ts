import { describe, it, expect } from 'vitest'
import { ACADEMY_CATEGORY_SLUGS, isAcademyCategory } from './academy-categories'

describe('ACADEMY_CATEGORY_SLUGS', () => {
  it('contains the 7 SSP category slugs in plan order', () => {
    expect([...ACADEMY_CATEGORY_SLUGS]).toEqual([
      'multisig',
      'getting-started',
      'security',
      'how-to',
      'coin-guides',
      'defi',
      'news-explained',
    ])
  })
})

describe('isAcademyCategory', () => {
  it('accepts every canonical slug', () => {
    for (const slug of ACADEMY_CATEGORY_SLUGS) {
      expect(isAcademyCategory(slug), slug).toBe(true)
    }
  })

  it('rejects non-slug strings', () => {
    expect(isAcademyCategory('multisig-extra')).toBe(false)
    expect(isAcademyCategory('')).toBe(false)
    expect(isAcademyCategory('nope')).toBe(false)
  })

  it('rejects null and undefined', () => {
    expect(isAcademyCategory(null)).toBe(false)
    expect(isAcademyCategory(undefined)).toBe(false)
  })

  it('rejects numbers', () => {
    expect(isAcademyCategory(0)).toBe(false)
    expect(isAcademyCategory(42)).toBe(false)
  })
})
