import { describe, it, expect } from 'vitest'
import type { GlossaryTerm } from './academy-terms'
import { autoLinkContent } from './glossary-linker'

const TERMS: GlossaryTerm[] = [
  { term: 'multisig', definition: '', href: '/academy/multisig/x' },
  { term: 'mempool', definition: '', href: '/academy/getting-started/y#mempool' },
]
const map = new Map(TERMS.map(t => [t.term.toLowerCase(), t]))

describe('autoLinkContent', () => {
  it('links the first occurrence of each term', () => {
    const out = autoLinkContent(
      'Bitcoin uses a mempool. The mempool fills up.',
      'some-other-slug',
      map
    )
    expect(out).toContain('[mempool](/academy/getting-started/y#mempool)')
    expect(out.match(/\[mempool\]/g)?.length).toBe(1)
  })

  it("skips self-references on the term's own article", () => {
    const out = autoLinkContent(
      'A multisig wallet…',
      'x',
      new Map([['multisig', { term: 'multisig', definition: '', href: '/academy/multisig/x' }]])
    )
    expect(out).not.toContain('[multisig]')
  })

  it('does not link inside fenced code blocks', () => {
    const md = '```\nmultisig\n```\n\nThe multisig.'
    const out = autoLinkContent(md, 'other', map)
    expect(out).toContain('```\nmultisig\n```')
    expect(out).toContain('[multisig](/academy/multisig/x)')
  })

  it('does not link inside inline code', () => {
    const md = '`multisig` is great. Use multisig.'
    const out = autoLinkContent(md, 'other', map)
    expect(out).toContain('`multisig`')
    expect(out).toContain('[multisig](/academy/multisig/x)')
  })

  it('does not link inside existing markdown links', () => {
    const md = '[multisig](https://elsewhere.com) is fine.'
    const out = autoLinkContent(md, 'other', map)
    expect(out).toContain('[multisig](https://elsewhere.com)')
    expect(out.match(/\[multisig\]/g)?.length).toBe(1)
  })

  it('matches case-insensitively', () => {
    const out = autoLinkContent('Multisig is great.', 'other', map)
    expect(out).toContain('[Multisig](/academy/multisig/x)')
  })

  it('prefers the longer term when terms overlap', () => {
    const overlapping: GlossaryTerm[] = [
      { term: 'multisig', definition: '', href: '/academy/multisig/x' },
      { term: '2-of-2 multisig', definition: '', href: '/academy/multisig/x#2-of-2' },
    ]
    const overlapMap = new Map(overlapping.map(t => [t.term.toLowerCase(), t]))
    const out = autoLinkContent('A 2-of-2 multisig wallet uses two signers.', 'other', overlapMap)
    expect(out).toContain('[2-of-2 multisig](/academy/multisig/x#2-of-2)')
    expect(out).not.toContain('[multisig](')
  })

  it('does not corrupt user text containing PH<n> tokens', () => {
    const out = autoLinkContent('See PH0 for details. multisig wallet.', 'other', map)
    expect(out).toContain('PH0 for details')
    expect(out).not.toContain('undefined')
    expect(out).toContain('[multisig](/academy/multisig/x)')
  })

  it('does not link inside reference-style markdown links', () => {
    const md = 'See [multisig][1] elsewhere. Now multisig is here.\n\n[1]: https://example.com'
    const out = autoLinkContent(md, 'other', map)
    expect(out).toContain('[multisig][1]')
    expect(out).toContain('[multisig](/academy/multisig/x)')
    expect(out.match(/\[multisig\]/g)?.length).toBe(2)
  })

  it('respects the maxLinks cap', () => {
    const many: GlossaryTerm[] = Array.from({ length: 20 }, (_, i) => ({
      term: `term${i}`,
      definition: '',
      href: `/x/${i}`,
    }))
    const manyMap = new Map(many.map(t => [t.term.toLowerCase(), t]))
    const body = many.map(t => t.term).join(' ')
    const out = autoLinkContent(body, 'other', manyMap, { maxLinks: 8 })
    const linkCount = (out.match(/\[term\d+\]\(\/x\/\d+\)/g) ?? []).length
    expect(linkCount).toBe(8)
  })

  it('links from the fallback map when not in the primary map', () => {
    const primary: GlossaryTerm[] = [
      { term: 'multisig', definition: '', href: '/academy/multisig/x' },
    ]
    const fallback: GlossaryTerm[] = [{ term: 'merkle', definition: '', href: '/glossary/merkle' }]
    const primaryMap = new Map(primary.map(t => [t.term.toLowerCase(), t]))
    const fallbackMap = new Map(fallback.map(t => [t.term.toLowerCase(), t]))
    const out = autoLinkContent('A merkle tree is fun.', 'other', primaryMap, {
      fallbackTermMap: fallbackMap,
    })
    expect(out).toContain('[merkle](/glossary/merkle)')
  })

  it('prefers the primary map over the fallback for the same term', () => {
    const primaryMap = new Map([
      ['multisig', { term: 'multisig', definition: '', href: '/academy/multisig/x' }],
    ])
    const fallbackMap = new Map([
      ['multisig', { term: 'multisig', definition: '', href: '/glossary/multisig' }],
    ])
    const out = autoLinkContent('A multisig wallet.', 'other', primaryMap, {
      fallbackTermMap: fallbackMap,
    })
    expect(out).toContain('[multisig](/academy/multisig/x)')
    expect(out).not.toContain('[multisig](/glossary/multisig)')
  })

  it('cap counts primary and fallback together', () => {
    const primaryMap = new Map([
      ['alpha', { term: 'alpha', definition: '', href: '/p/alpha' }],
      ['beta', { term: 'beta', definition: '', href: '/p/beta' }],
      ['gamma', { term: 'gamma', definition: '', href: '/p/gamma' }],
      ['delta', { term: 'delta', definition: '', href: '/p/delta' }],
    ])
    const fallbackMap = new Map([
      ['epsilon', { term: 'epsilon', definition: '', href: '/f/epsilon' }],
      ['zeta', { term: 'zeta', definition: '', href: '/f/zeta' }],
      ['eta', { term: 'eta', definition: '', href: '/f/eta' }],
      ['theta', { term: 'theta', definition: '', href: '/f/theta' }],
      ['iota', { term: 'iota', definition: '', href: '/f/iota' }],
    ])
    const body = 'alpha beta gamma delta epsilon zeta eta theta iota'
    const out = autoLinkContent(body, 'other', primaryMap, {
      fallbackTermMap: fallbackMap,
      maxLinks: 8,
    })
    const linkCount = (out.match(/\[\w+\]\([^)]+\)/g) ?? []).length
    expect(linkCount).toBe(8)
    expect(out).toContain('[alpha](/p/alpha)')
    expect(out).toContain('[delta](/p/delta)')
    expect(out).not.toContain('[iota](/f/iota)')
  })

  it('does not link if the only matchable term hits a self-referential fallback href', () => {
    const fallbackMap = new Map([
      ['bitcoin', { term: 'bitcoin', definition: '', href: '/glossary/bitcoin' }],
    ])
    const out = autoLinkContent('Bitcoin is great.', 'bitcoin', new Map(), {
      fallbackTermMap: fallbackMap,
    })
    expect(out).not.toContain('[Bitcoin](')
    expect(out).not.toContain('[bitcoin](')
  })

  it('defaults maxLinks to Infinity when not provided (back-compat)', () => {
    const many: GlossaryTerm[] = Array.from({ length: 12 }, (_, i) => ({
      term: `t${i}`,
      definition: '',
      href: `/x/${i}`,
    }))
    const manyMap = new Map(many.map(t => [t.term.toLowerCase(), t]))
    const body = many.map(t => t.term).join(' ')
    const out = autoLinkContent(body, 'other', manyMap)
    const linkCount = (out.match(/\[t\d+\]\(\/x\/\d+\)/g) ?? []).length
    expect(linkCount).toBe(12)
  })
})
