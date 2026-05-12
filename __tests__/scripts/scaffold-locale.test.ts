import { describe, it, expect } from 'vitest'
import { scaffoldFromEnglish } from '../../scripts/scaffold-locale'

describe('scaffoldFromEnglish', () => {
  it('copies string values verbatim from the English source', () => {
    const input = { Common: { greet: 'Hello' } }
    expect(scaffoldFromEnglish(input)).toEqual({ Common: { greet: 'Hello' } })
  })

  it('preserves nested object structure', () => {
    const input = { A: { B: { C: 'deep' } }, X: 'shallow' }
    expect(scaffoldFromEnglish(input)).toEqual({
      A: { B: { C: 'deep' } },
      X: 'shallow',
    })
  })

  it('preserves ICU placeholders verbatim', () => {
    const input = { msg: 'You have {count} items' }
    expect(scaffoldFromEnglish(input)).toEqual({ msg: 'You have {count} items' })
  })

  it('preserves complex ICU plural placeholders verbatim', () => {
    const input = { plural: '{count, plural, one {# apple} other {# apples}}' }
    const result = scaffoldFromEnglish(input) as Record<string, string>
    expect(result.plural).toBe('{count, plural, one {# apple} other {# apples}}')
  })

  it('passes through non-string leaves unchanged (numbers, booleans, null)', () => {
    const input = { n: 42, b: true, x: null, s: 'text' }
    expect(scaffoldFromEnglish(input as Record<string, unknown>)).toEqual({
      n: 42,
      b: true,
      x: null,
      s: 'text',
    })
  })

  it('preserves arrays of strings element-wise', () => {
    const input = { list: ['one', 'two'] }
    expect(scaffoldFromEnglish(input)).toEqual({ list: ['one', 'two'] })
  })
})
