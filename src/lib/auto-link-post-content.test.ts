import { describe, it, expect } from 'vitest'
import { autoLinkPostContent, MAX_LINKS_PER_POST } from './auto-link-post-content'

describe('autoLinkPostContent', () => {
  it('exposes the per-post cap as a public constant', () => {
    expect(MAX_LINKS_PER_POST).toBe(8)
  })

  it('links curated terms first', () => {
    const body = 'A multisig wallet protects against single-key compromise.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    expect(out).toContain('[multisig](/academy/multisig/what-is-2-of-2-multisig)')
  })

  it('falls back to glossary entries when no curated match exists', () => {
    // "merkle tree" exists in the 2,157-entry glossary but is NOT in the
    // 20-entry curated list, so the fallback tier should pick it up.
    const body = 'The merkle tree is a cryptographic structure used in blockchains.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    expect(out).toMatch(/\[merkle tree\]\(\/glossary\/[\w-]+\)/i)
  })

  it('caps total links at exactly MAX_LINKS_PER_POST when the body has more matches', () => {
    // Body contains >> MAX_LINKS_PER_POST distinct linkable terms (multisig,
    // bitcoin, ethereum, seed phrase, BIP48, BIP39, ERC-4337, gas, mempool,
    // finality, self-custody, hardware wallet, private key, public key,
    // signer, threshold, WalletConnect) — so the cap must fire and the
    // assertion pins the exact value, not just an upper bound.
    const body =
      'multisig bitcoin ethereum seed phrase BIP48 BIP39 ERC-4337 gas mempool finality ' +
      'self-custody hardware wallet private key public key signer threshold WalletConnect.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    const links = out.match(/\[[^\]]+\]\([^)]+\)/g) ?? []
    expect(links.length).toBe(MAX_LINKS_PER_POST)
  })

  it('does not link stop-words from common prose', () => {
    const body = 'The network address points at the node. A new block was added to the chain.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    expect(out).not.toContain('[network](')
    expect(out).not.toContain('[address](')
    expect(out).not.toContain('[node](')
    expect(out).not.toContain('[block](')
    expect(out).not.toContain('[chain](')
  })

  it('skips self-referential links when rendering an article on its own slug', () => {
    const body = 'A multisig wallet requires multiple signatures.'
    const out = autoLinkPostContent(body, 'what-is-2-of-2-multisig')
    expect(out).not.toContain('[multisig](')
  })
})
