import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('lists en, es, zh as supported locales', () => {
    expect(routing.locales).toEqual(['en', 'es', 'zh'])
  })

  it('uses en as the default locale', () => {
    expect(routing.defaultLocale).toBe('en')
  })

  it('always emits a locale prefix', () => {
    expect(routing.localePrefix).toBe('always')
  })
})
