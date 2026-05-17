import { describe, it, expect } from 'vitest'
import { buildFallbackTermMap, STOP_WORDS } from './build-fallback-term-map'

describe('buildFallbackTermMap', () => {
  it('returns a Map keyed by lowercase term title', () => {
    const map = buildFallbackTermMap(new Set())
    expect(map.size).toBeGreaterThan(100)
    for (const key of map.keys()) {
      expect(key).toBe(key.toLowerCase())
    }
  })

  it('excludes terms whose label is shorter than 3 characters', () => {
    const map = buildFallbackTermMap(new Set())
    for (const key of map.keys()) {
      expect(key.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('excludes stop-words even if they appear in the source glossary', () => {
    const map = buildFallbackTermMap(new Set())
    for (const stop of STOP_WORDS) {
      expect(map.has(stop)).toBe(false)
    }
  })

  it('excludes terms whose lowercased label is in the curated set', () => {
    const curated = new Set(['bitcoin', 'ethereum'])
    const map = buildFallbackTermMap(curated)
    expect(map.has('bitcoin')).toBe(false)
    expect(map.has('ethereum')).toBe(false)
  })

  it('entries point at /glossary/<slug>', () => {
    const map = buildFallbackTermMap(new Set())
    for (const term of map.values()) {
      expect(term.href).toMatch(/^\/glossary\/[\w-]+$/)
    }
  })

  it('inserts entries in length-desc order (longest first)', () => {
    const map = buildFallbackTermMap(new Set())
    const keys = [...map.keys()]
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i].length).toBeLessThanOrEqual(keys[i - 1].length)
    }
  })

  it('STOP_WORDS contains the common prose noise list', () => {
    const expected = [
      'address',
      'block',
      'chain',
      'coin',
      'fee',
      'fork',
      'hash',
      'key',
      'network',
      'node',
      'token',
      'wallet',
      'transaction',
      'signature',
      'protocol',
      'consensus',
      'mining',
      'staking',
      'validator',
      'account',
      'balance',
      'peer',
      'client',
      'server',
      'script',
      'index',
    ]
    for (const word of expected) {
      expect(STOP_WORDS.has(word)).toBe(true)
    }
  })
})
