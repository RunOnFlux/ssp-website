import { describe, it, expect } from 'vitest'
import { scaffoldFromEnglish } from '../../scripts/scaffold-locale'

describe('scaffoldFromEnglish', () => {
  it('prefixes every string with __TODO_TRANSLATE__ <english>', () => {
    const input = { Common: { greet: 'Hello' } }
    const result = scaffoldFromEnglish(input)
    expect(result).toEqual({ Common: { greet: '__TODO_TRANSLATE__ Hello' } })
  })

  it('preserves nested object structure', () => {
    const input = { A: { B: { C: 'deep' } }, X: 'shallow' }
    const result = scaffoldFromEnglish(input)
    expect(result).toEqual({
      A: { B: { C: '__TODO_TRANSLATE__ deep' } },
      X: '__TODO_TRANSLATE__ shallow',
    })
  })

  it('preserves ICU placeholders verbatim inside the original value', () => {
    const input = { msg: 'You have {count} items' }
    const result = scaffoldFromEnglish(input)
    expect(result).toEqual({ msg: '__TODO_TRANSLATE__ You have {count} items' })
  })

  it('preserves complex ICU plural placeholders verbatim', () => {
    const input = { plural: '{count, plural, one {# apple} other {# apples}}' }
    const result = scaffoldFromEnglish(input) as Record<string, string>
    expect(result.plural).toBe('__TODO_TRANSLATE__ {count, plural, one {# apple} other {# apples}}')
  })

  it('passes through non-string leaves unchanged (numbers, booleans, null)', () => {
    const input = { n: 42, b: true, x: null, s: 'text' }
    const result = scaffoldFromEnglish(input as Record<string, unknown>)
    expect(result).toEqual({ n: 42, b: true, x: null, s: '__TODO_TRANSLATE__ text' })
  })

  it('preserves arrays of strings element-wise', () => {
    const input = { list: ['one', 'two'] }
    const result = scaffoldFromEnglish(input)
    expect(result).toEqual({ list: ['__TODO_TRANSLATE__ one', '__TODO_TRANSLATE__ two'] })
  })
})
