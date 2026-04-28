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
})
