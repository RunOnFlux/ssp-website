import { describe, it, expect } from 'vitest'
import { deepMerge } from './deep-merge'

describe('deepMerge', () => {
  it('returns base when override is empty', () => {
    expect(deepMerge({ a: 1, b: 2 }, {})).toEqual({ a: 1, b: 2 })
  })
  it('override wins for top-level keys', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
  })
  it('merges nested objects recursively', () => {
    const en = { Common: { hello: 'Hello', bye: 'Bye' }, Header: { home: 'Home' } }
    const es = { Common: { hello: 'Hola' } }
    expect(deepMerge(en, es)).toEqual({
      Common: { hello: 'Hola', bye: 'Bye' },
      Header: { home: 'Home' },
    })
  })
  it('does not mutate inputs', () => {
    const en = { a: { b: 1 } }
    const es = { a: { c: 2 } }
    const merged = deepMerge(en, es)
    expect(en).toEqual({ a: { b: 1 } })
    expect(es).toEqual({ a: { c: 2 } })
    expect(merged).toEqual({ a: { b: 1, c: 2 } })
  })
  it('treats arrays as scalar values (override replaces, not merges)', () => {
    expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['c'] })).toEqual({ tags: ['c'] })
  })
  it('handles null override values by keeping base', () => {
    expect(deepMerge({ a: 1 }, { a: null as never })).toEqual({ a: 1 })
  })
})
