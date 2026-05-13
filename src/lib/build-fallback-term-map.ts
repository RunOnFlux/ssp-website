import { GLOSSARY } from '@/constants/glossary'
import type { GlossaryTerm } from './academy-terms'

export const STOP_WORDS: ReadonlySet<string> = new Set([
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
])

const MIN_TERM_LENGTH = 3

let cached: Map<string, GlossaryTerm> | null = null
let cachedCuratedKey: string | null = null

function curatedFingerprint(curated: ReadonlySet<string>): string {
  return [...curated].sort().join('|')
}

/**
 * Builds the fallback term map consulted by `autoLinkContent` after the curated
 * `academy-terms.ts` map. Filters glossary entries that are too short to be
 * useful as inline links, that overlap with the curated set, or that match the
 * STOP_WORDS list of common prose noise.
 *
 * Entries are inserted length-desc so the Map's iteration order is longest-
 * first — the linker iterates fallback in insertion order and relies on this
 * ordering to make longer overlapping terms (e.g. "merkle tree" before
 * "merkle") consume their match ahead of the shorter term.
 *
 * Memoized per curated fingerprint — call sites typically pass the same
 * curated key set on every server render.
 */
export function buildFallbackTermMap(
  curatedLowercaseKeys: ReadonlySet<string>
): Map<string, GlossaryTerm> {
  const fp = curatedFingerprint(curatedLowercaseKeys)
  if (cached && cachedCuratedKey === fp) return cached

  // Sort entries length-desc before inserting so the Map's insertion order is
  // longest-first. The linker iterates fallback in insertion order, so this
  // makes longer overlapping terms (e.g. "merkle tree" before "merkle")
  // consume their match first and shadow the shorter term.
  const sorted = [...GLOSSARY].sort((a, b) => b.title.length - a.title.length)
  const map = new Map<string, GlossaryTerm>()
  for (const entry of sorted) {
    const key = entry.title.toLowerCase()
    if (key.length < MIN_TERM_LENGTH) continue
    if (STOP_WORDS.has(key)) continue
    if (curatedLowercaseKeys.has(key)) continue
    map.set(key, {
      term: entry.title,
      definition: entry.excerpt,
      href: `/glossary/${entry.slug}`,
    })
  }
  cached = map
  cachedCuratedKey = fp
  return map
}
