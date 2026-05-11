import { describe, it, expect } from 'vitest'
import {
  findPlaceholderResiduals,
  diffIcuPlaceholders,
  diffLeafPaths,
  findLockedTermTranslations,
} from '../../scripts/check-translations'

describe('findPlaceholderResiduals', () => {
  it('flags any value containing __TODO_TRANSLATE__', () => {
    const tree = { a: 'ok', b: '__TODO_TRANSLATE__ Hello', c: { d: 'fine' } }
    expect(findPlaceholderResiduals(tree)).toEqual(['b'])
  })

  it('returns empty when no placeholders remain', () => {
    expect(findPlaceholderResiduals({ a: 'ok', b: { c: 'fine' } })).toEqual([])
  })

  it('descends into arrays', () => {
    const tree = { list: ['ok', '__TODO_TRANSLATE__ leak'] }
    expect(findPlaceholderResiduals(tree)).toEqual(['list[1]'])
  })
})

describe('diffIcuPlaceholders', () => {
  it('returns no diff when target preserves all simple placeholders', () => {
    expect(diffIcuPlaceholders('You have {count} items', 'Tienes {count} items')).toEqual({
      missing: [],
      extra: [],
    })
  })

  it('flags missing placeholders', () => {
    expect(diffIcuPlaceholders('Hi {name}, you have {count}', 'Hola {name}')).toEqual({
      missing: ['{count}'],
      extra: [],
    })
  })

  it('flags extra placeholders not in source', () => {
    expect(diffIcuPlaceholders('Hi {name}', 'Hola {name}, {count}')).toEqual({
      missing: [],
      extra: ['{count}'],
    })
  })

  it('preserves plural/select structure markers', () => {
    const src = '{count, plural, one {1 item} other {# items}}'
    const tgt = '{count, plural, one {1 articulo} other {# articulos}}'
    expect(diffIcuPlaceholders(src, tgt)).toEqual({ missing: [], extra: [] })
  })

  it('preserves rich-text tags', () => {
    const src = 'Click <link>here</link>'
    const tgt = 'Haz clic <link>aqui</link>'
    expect(diffIcuPlaceholders(src, tgt)).toEqual({ missing: [], extra: [] })
  })
})

describe('diffLeafPaths', () => {
  it('returns no diff when key structures match', () => {
    const en = { A: 'a', B: { C: 'c' } }
    const tgt = { A: 'x', B: { C: 'y' } }
    expect(diffLeafPaths(en, tgt)).toEqual({ missing: [], extra: [] })
  })

  it('flags missing leaves', () => {
    expect(diffLeafPaths({ A: 'a', B: 'b' }, { A: 'x' })).toEqual({
      missing: ['B'],
      extra: [],
    })
  })

  it('flags extra leaves', () => {
    expect(diffLeafPaths({ A: 'a' }, { A: 'x', B: 'y' })).toEqual({
      missing: [],
      extra: ['B'],
    })
  })
})

describe('findLockedTermTranslations', () => {
  it('passes when locked terms appear verbatim in target', () => {
    const en = { brand: 'SSP wallet', proto: 'ERC-20 token' }
    const tgt = { brand: 'Carteira SSP', proto: 'Token ERC-20' }
    expect(findLockedTermTranslations(en, tgt, ['SSP', 'ERC-20'])).toEqual([])
  })

  it('flags when a locked term in en is missing in target', () => {
    const en = { brand: 'SSP wallet' }
    const tgt = { brand: 'Carteira ESSE' }
    expect(findLockedTermTranslations(en, tgt, ['SSP'])).toEqual([{ path: 'brand', term: 'SSP' }])
  })

  it('does not flag when target has same term in different casing intentionally (case-sensitive locked terms)', () => {
    const en = { x: 'ssp' }
    const tgt = { x: 'ssp' }
    expect(findLockedTermTranslations(en, tgt, ['SSP'])).toEqual([])
  })
})
