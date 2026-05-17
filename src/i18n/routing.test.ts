import { describe, expect, it } from 'vitest'
import { routing } from './routing'

describe('routing', () => {
  it('contains all 14 Wave 1 locales in the canonical order', () => {
    expect([...routing.locales]).toEqual([
      'en',
      'es',
      'zh',
      'pt-BR',
      'ru',
      'tr',
      'ja',
      'de',
      'fr',
      'it',
      'pl',
      'ko',
      'vi',
      'id',
    ])
  })

  it('uses en as the default locale', () => {
    expect(routing.defaultLocale).toBe('en')
  })

  it('always emits a locale prefix', () => {
    expect(routing.localePrefix).toBe('always')
  })
})
