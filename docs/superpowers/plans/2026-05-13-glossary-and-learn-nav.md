# Glossary + Learn Nav Dropdown Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a public, searchable glossary at `/glossary` with 2,000+ entries and replace the flat "Academy" header link with a "Learn ▾" dropdown grouping Academy, Series, and Glossary — all on the existing `feat/newsroom-academy-app-router-migration` branch.

**Architecture:** Static JSON data layer (CMC + SSP-curated + web-sourced, merged with SSP-curated > CMC > web precedence) consumed by server-rendered index and detail pages. Two small client islands handle search and letter-index scroll. Header gets a Radix-based dropdown for desktop and a grouped subsection for mobile. Glossary content is English in all locales; only chrome is translated.

**Tech Stack:** Next.js 16 App Router, next-intl (14 Wave 1 locales), Radix `NavigationMenu` (via shadcn-style wrapper), Tailwind CSS, react-markdown, Vitest + happy-dom + @testing-library/react.

**Branch and worktree:** Work directly in `/Users/vasilismagkoutis/repos/ssp-website` on `feat/newsroom-academy-app-router-migration`. No new branch, no new worktree — this lands on the same branch as the prior i18n work per the user's "same branches, no new PRs" preference for this stream of work.

**Spec reference:** [`docs/superpowers/specs/2026-05-13-glossary-and-learn-nav-design.md`](../specs/2026-05-13-glossary-and-learn-nav-design.md). Read the decisions table and architecture section before starting.

---

## File map

**New (in order created):**

```
src/constants/glossary/types.ts                       # GlossaryEntry interface
src/lib/glossary-utils.ts                             # normalizeSlug, groupByFirstLetter, difficultyBadgeClass
src/lib/glossary-utils.test.ts
src/constants/glossary/cmc.json                       # copied from zelcore-website
src/constants/glossary/ssp-curated.json               # hand-authored, ~100 entries
src/constants/glossary/web-sourced.json               # script-generated, ~700+ entries
scripts/build-glossary-web-sourced.ts                 # one-shot fetch/parse/dedupe script
src/constants/glossary/index.ts                       # getGlossary() merger, exports GLOSSARY
src/constants/glossary/index.test.ts

src/app/[locale]/glossary/glossary-entry-card.tsx     # server component, single card
src/app/[locale]/glossary/letter-index.tsx            # client island, jump bar
src/app/[locale]/glossary/glossary-search.tsx         # client island, search input
src/app/[locale]/glossary/glossary-search.test.tsx
src/app/[locale]/glossary/page.tsx                    # index page (server component)
src/app/[locale]/glossary/[slug]/page.tsx             # detail page (server component)

src/components/ui/navigation-menu.tsx                 # shadcn wrapper around @radix-ui/react-navigation-menu
src/components/header/learn-dropdown.tsx              # desktop dropdown
src/components/header/learn-dropdown.test.tsx
src/components/header/learn-mobile-section.tsx       # mobile section
```

**Modified:**

```
src/components/header/header.tsx                      # primaryNav becomes NavItem discriminated union
src/messages/en.json                                  # add Header.learn*, Header.series, Glossary.* keys
src/messages/{es,zh,pt-BR,ru,tr,ja,de,fr,it,pl,ko,vi,id}.json   # translate same keys via Python script
.gitignore                                            # add .glossary-cache/
```

---

## Task ordering rationale

Build inside-out so each commit is testable on its own:

1. **Utilities first** (Tasks 1–2) — pure functions with no dependencies.
2. **Data layer** (Tasks 3–7) — `cmc.json` → `ssp-curated.json` → web-sourcing script → `web-sourced.json` → merger.
3. **Page layer** (Tasks 8–13) — index page first (consumes data), then client islands, then detail page.
4. **i18n** (Task 14) — add `Glossary.*` keys, then translate to 13 other locales.
5. **Header restructure** (Tasks 15–19) — shadcn wrapper → dropdown → mobile section → header rewrite → header i18n.
6. **Final verification** (Task 20) — build check + manual smoke test.

Tasks 1–9 and 11–13 are mechanical-implementation tasks (cheap model). Tasks 5, 10, 14, 18, and 20 involve content/integration judgment (standard model).

---

## Task 1: GlossaryEntry type and utilities (no JSON deps)

**Files:**
- Create: `src/constants/glossary/types.ts`
- Create: `src/lib/glossary-utils.ts`
- Test: `src/lib/glossary-utils.test.ts`

- [ ] **Step 1: Write `types.ts`**

Create `src/constants/glossary/types.ts`:

```typescript
export interface GlossaryDifficulty {
  level: 1 | 2 | 3
  label: string
  slug: string
  language: string
}

export interface GlossaryEntrySource {
  title: string
  slug: string
  excerpt: string
  difficulty?: GlossaryDifficulty
}

export interface GlossaryEntry extends GlossaryEntrySource {
  source: 'ssp-curated' | 'cmc' | 'web'
}
```

`GlossaryEntrySource` is the on-disk shape (no `source` field — source is tagged at merge time). `GlossaryEntry` is the merged shape.

- [ ] **Step 2: Write failing tests for `glossary-utils.ts`**

Create `src/lib/glossary-utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import {
  normalizeSlug,
  groupByFirstLetter,
  difficultyBadgeClass,
} from './glossary-utils'
import type { GlossaryEntry } from '@/constants/glossary/types'

describe('normalizeSlug', () => {
  it('lowercases and replaces non-alphanumerics with single dash', () => {
    expect(normalizeSlug('0x Protocol')).toBe('0x-protocol')
    expect(normalizeSlug('Seed Phrase')).toBe('seed-phrase')
    expect(normalizeSlug('Two-Of-Two MULTISIG')).toBe('two-of-two-multisig')
  })
  it('strips diacritics via NFKD normalization', () => {
    expect(normalizeSlug('Café')).toBe('cafe')
    expect(normalizeSlug('Naïve')).toBe('naive')
  })
  it('trims leading/trailing dashes', () => {
    expect(normalizeSlug('  --foo--  ')).toBe('foo')
    expect(normalizeSlug('!!!bar!!!')).toBe('bar')
  })
  it('collapses runs of non-alphanumerics into one dash', () => {
    expect(normalizeSlug('a   b___c')).toBe('a-b-c')
  })
})

describe('groupByFirstLetter', () => {
  const entries: GlossaryEntry[] = [
    { title: 'Address', slug: 'address', excerpt: '', source: 'cmc' },
    { title: 'Air-gapped', slug: 'air-gapped', excerpt: '', source: 'cmc' },
    { title: 'Bitcoin', slug: 'bitcoin', excerpt: '', source: 'cmc' },
    { title: '0x Protocol', slug: '0x-protocol', excerpt: '', source: 'cmc' },
    { title: '1hr', slug: '1hr', excerpt: '', source: 'cmc' },
  ]
  it('groups entries by uppercased first letter of title', () => {
    const groups = groupByFirstLetter(entries)
    expect(groups['A']).toHaveLength(2)
    expect(groups['B']).toHaveLength(1)
  })
  it('groups numerics under "#"', () => {
    const groups = groupByFirstLetter(entries)
    expect(groups['#']).toHaveLength(2)
    expect(groups['#'].map(e => e.title)).toEqual(['0x Protocol', '1hr'])
  })
  it('produces no empty buckets', () => {
    const groups = groupByFirstLetter(entries)
    for (const letter of Object.keys(groups)) {
      expect(groups[letter].length).toBeGreaterThan(0)
    }
  })
})

describe('difficultyBadgeClass', () => {
  it('returns expected class per level', () => {
    expect(difficultyBadgeClass(1)).toContain('green')
    expect(difficultyBadgeClass(2)).toContain('yellow')
    expect(difficultyBadgeClass(3)).toContain('red')
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
npx vitest run src/lib/glossary-utils.test.ts
```

Expected: FAIL with "Cannot find module './glossary-utils'".

- [ ] **Step 4: Implement `glossary-utils.ts`**

Create `src/lib/glossary-utils.ts`:

```typescript
import type { GlossaryEntry } from '@/constants/glossary/types'

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function groupByFirstLetter(
  entries: readonly GlossaryEntry[]
): Record<string, GlossaryEntry[]> {
  const groups: Record<string, GlossaryEntry[]> = {}
  for (const entry of entries) {
    const first = entry.title.charAt(0)
    const letter = /^[0-9]/.test(first) ? '#' : first.toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(entry)
  }
  return groups
}

export function difficultyBadgeClass(level: 1 | 2 | 3): string {
  switch (level) {
    case 1:
      return 'inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 2:
      return 'inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 3:
      return 'inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run src/lib/glossary-utils.test.ts
```

Expected: PASS, 9 tests passed.

- [ ] **Step 6: Commit**

```bash
git add src/constants/glossary/types.ts src/lib/glossary-utils.ts src/lib/glossary-utils.test.ts
git commit -m "feat(glossary): add GlossaryEntry type and slug/group/badge utilities"
```

---

## Task 2: Copy CMC glossary JSON from zelcore-website

**Files:**
- Create: `src/constants/glossary/cmc.json`

- [ ] **Step 1: Copy the file**

```bash
cp /Users/vasilismagkoutis/repos/zelcore-website/src/constants/cmc-glossary.json \
   /Users/vasilismagkoutis/repos/ssp-website/src/constants/glossary/cmc.json
```

- [ ] **Step 2: Verify size and entry count**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
wc -c src/constants/glossary/cmc.json
node -e "console.log('entries:', require('./src/constants/glossary/cmc.json').length)"
```

Expected: ~480KB and `entries: 1270`.

- [ ] **Step 3: Commit**

```bash
git add src/constants/glossary/cmc.json
git commit -m "feat(glossary): import CMC crypto-term dataset (1270 entries)"
```

---

## Task 3: SSP-curated entries (100 entries)

**Files:**
- Create: `src/constants/glossary/ssp-curated.json`

- [ ] **Step 1: Author the SSP-curated JSON**

Create `src/constants/glossary/ssp-curated.json` containing the entries below. Use the same `GlossaryEntrySource` shape as `cmc.json`. Each `excerpt` is 2–4 sentences in plain English. The full slug list to author:

**SSP-specific (8):**
`ssp-wallet`, `ssp-key`, `ssp-relay`, `ssp-pairing`, `co-signing`, `2-of-2-multisig`, `psbt-coordination`, `relay-payload`

**Multisig fundamentals (10):**
`multisig`, `m-of-n-multisig`, `threshold-signature`, `musig2`, `frost`, `schnorr-signature`, `ecdsa`, `bip322`, `signing-quorum`, `cosigner`

**Bitcoin-specific (16):**
`psbt`, `sighash`, `op-checkmultisig`, `p2sh`, `p2wsh`, `taproot`, `utxo`, `bip-39`, `bip-32`, `bip-44`, `derivation-path`, `extended-public-key`, `address-type`, `script-type`, `replace-by-fee`, `coin-control`

**Ethereum-specific (14):**
`eoa`, `erc-4337`, `account-abstraction`, `bundler`, `paymaster`, `user-operation`, `eip-712`, `nonce`, `gas-limit`, `gas-price`, `priority-fee`, `base-fee`, `contract-wallet`, `safe-multisig`

**Security (12):**
`phishing`, `dusting-attack`, `sweep`, `replay-attack`, `side-channel`, `address-poisoning`, `seed-leak`, `clipboard-hijack`, `malicious-dapp`, `wallet-drainer`, `social-engineering`, `supply-chain-attack`

**Wallet operations (15):**
`hardware-wallet`, `hot-wallet`, `cold-storage`, `air-gapped`, `seed-phrase`, `passphrase`, `recovery-phrase`, `pin`, `firmware-update`, `qr-signing`, `watch-only-wallet`, `transaction-broadcast`, `mempool-submission`, `confirmation-depth`, `dust-limit`

**Cryptographic primitives (12):**
`public-key`, `private-key`, `hash-function`, `elliptic-curve`, `signature`, `merkle-root`, `merkle-proof`, `nonce-bitcoin`, `entropy`, `key-derivation`, `hmac`, `bech32`

**Crypto fundamentals also covered in CMC but worth restating in SSP voice (13):**
`block`, `block-height`, `chain-reorganization`, `fork-soft`, `fork-hard`, `mining`, `proof-of-work`, `proof-of-stake`, `validator`, `staking`, `slashing`, `finality`, `mempool`

This is 100 entries. Each entry shape:

```json
{
  "title": "Seed Phrase",
  "slug": "seed-phrase",
  "excerpt": "A human-readable backup of a wallet's private key, encoded as 12 or 24 dictionary words via BIP-39. Anyone with the phrase can recreate the wallet on any device, so it must be stored offline and never typed into a website or photographed. SSP generates two independent seed phrases — one per device — and you back up each separately.",
  "difficulty": { "level": 1, "label": "Beginner", "slug": "beginner", "language": "en" }
}
```

Difficulty levels:
- `1` (Beginner) — fundamentals a new user should know (Seed Phrase, Hardware Wallet, Public Key, Mining).
- `2` (Moderate) — concepts that need some context (UTXO, PSBT, BIP-39, Schnorr Signature, Replay Attack).
- `3` (Advanced) — protocol-level or attacker-level detail (MuSig2, FROST, OP_CHECKMULTISIG, ERC-4337 Bundler, Side-channel).

Three reference entries to set the voice (write the other 97 in this style):

```json
[
  {
    "title": "2-of-2 Multisig",
    "slug": "2-of-2-multisig",
    "excerpt": "A signing scheme where two independent private keys must each sign before a transaction is valid. SSP's default setup pairs your phone (SSP Key) and a second device (SSP Wallet); neither can spend on its own. The model removes the single-point-of-failure of one-key wallets without introducing a custodian.",
    "difficulty": { "level": 1, "label": "Beginner", "slug": "beginner", "language": "en" }
  },
  {
    "title": "PSBT",
    "slug": "psbt",
    "excerpt": "Partially Signed Bitcoin Transaction — the BIP-174 format for passing a half-built transaction between signers. SSP uses PSBTs internally: SSP Wallet builds and signs first, then ships the PSBT through the encrypted relay to SSP Key for the second signature. Once both signatures are attached, the transaction broadcasts.",
    "difficulty": { "level": 2, "label": "Moderate", "slug": "intermediate", "language": "en" }
  },
  {
    "title": "MuSig2",
    "slug": "musig2",
    "excerpt": "A Schnorr-based multisig protocol that aggregates several signatures into a single 64-byte signature indistinguishable from a single-signer transaction. Lower on-chain cost and better privacy than script-based multisig, at the price of an interactive signing round between cosigners. Not used in SSP's default 2-of-2 flow today (which uses P2WSH/script-based multisig), but a candidate for future Taproot-based variants.",
    "difficulty": { "level": 3, "label": "Advanced", "slug": "advanced", "language": "en" }
  }
]
```

Write the remaining 97 entries to disk as a single JSON array, alphabetically sorted by title.

- [ ] **Step 2: Validate the JSON parses and has the expected count**

```bash
node -e "
const data = require('./src/constants/glossary/ssp-curated.json')
console.log('entries:', data.length)
console.log('with difficulty:', data.filter(e => e.difficulty).length)
const slugs = new Set(data.map(e => e.slug))
console.log('unique slugs:', slugs.size)
const dupes = data.filter((e,i) => data.findIndex(x => x.slug === e.slug) !== i)
if (dupes.length) console.log('DUPLICATES:', dupes.map(e => e.slug))
"
```

Expected: `entries: 100`, `with difficulty: 100`, `unique slugs: 100`, no duplicates.

- [ ] **Step 3: Commit**

```bash
git add src/constants/glossary/ssp-curated.json
git commit -m "feat(glossary): author 100 SSP-curated entries"
```

---

## Task 4: Web-sourcing script

**Files:**
- Create: `scripts/build-glossary-web-sourced.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Add `.glossary-cache/` to `.gitignore`**

Append to `/Users/vasilismagkoutis/repos/ssp-website/.gitignore`:

```
# Glossary build script cache
.glossary-cache/
```

- [ ] **Step 2: Write the script**

Create `scripts/build-glossary-web-sourced.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * One-shot data-fetching script for the glossary's web-sourced layer.
 *
 * Pulls public-domain / CC-BY-SA crypto glossary entries from Wikipedia
 * articles, deduplicates against the CMC and SSP-curated datasets, and
 * writes the result to src/constants/glossary/web-sourced.json.
 *
 * Run manually when refreshing the dataset:
 *   npx tsx scripts/build-glossary-web-sourced.ts
 *
 * Network responses are cached to .glossary-cache/ (gitignored) so re-runs
 * are deterministic and offline-friendly.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'

import type { GlossaryEntrySource } from '../src/constants/glossary/types'
import { normalizeSlug } from '../src/lib/glossary-utils'

const CACHE_DIR = '.glossary-cache'
const OUTPUT_PATH = 'src/constants/glossary/web-sourced.json'

const SOURCES = [
  {
    name: 'wikipedia-cryptocurrency-glossary',
    url: 'https://en.wikipedia.org/wiki/Glossary_of_cryptocurrency_terms',
  },
  {
    name: 'wikipedia-blockchain-glossary',
    url: 'https://en.wikipedia.org/wiki/Glossary_of_blockchain',
  },
]

async function fetchCached(url: string, cacheKey: string): Promise<string> {
  const cachePath = path.join(CACHE_DIR, cacheKey + '.html')
  try {
    return await fs.readFile(cachePath, 'utf-8')
  } catch {
    process.stdout.write('fetching ' + url + '... ')
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ssp-glossary-build/1.0 (https://sspwallet.io)' },
    })
    if (!res.ok) {
      console.log('HTTP ' + res.status)
      throw new Error('fetch ' + url + ': HTTP ' + res.status)
    }
    const text = await res.text()
    await fs.mkdir(CACHE_DIR, { recursive: true })
    await fs.writeFile(cachePath, text)
    console.log('cached ' + text.length + ' bytes')
    return text
  }
}

/**
 * Parse a Wikipedia article's <dl><dt>term</dt><dd>def</dd></dl> structure
 * into glossary entries.
 */
function parseWikiDefinitionList(html: string): GlossaryEntrySource[] {
  const entries: GlossaryEntrySource[] = []
  const dtDdRe = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi
  let match: RegExpExecArray | null
  while ((match = dtDdRe.exec(html)) !== null) {
    const rawTitle = stripHtml(match[1]).trim()
    const rawExcerpt = stripHtml(match[2]).trim()
    if (!rawTitle || !rawExcerpt) continue
    if (rawTitle.length > 80 || rawExcerpt.length < 20) continue
    entries.push({
      title: rawTitle,
      slug: normalizeSlug(rawTitle),
      excerpt: rawExcerpt,
    })
  }
  return entries
}

function stripHtml(html: string): string {
  return html
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function loadExistingSlugs(): Promise<Set<string>> {
  const cmcPath = 'src/constants/glossary/cmc.json'
  const sspPath = 'src/constants/glossary/ssp-curated.json'
  const slugs = new Set<string>()
  for (const p of [cmcPath, sspPath]) {
    const raw = await fs.readFile(p, 'utf-8')
    for (const entry of JSON.parse(raw) as GlossaryEntrySource[]) {
      slugs.add(normalizeSlug(entry.slug))
    }
  }
  return slugs
}

async function main() {
  const existing = await loadExistingSlugs()
  console.log('existing slugs (cmc + ssp): ' + existing.size)

  const allFetched: GlossaryEntrySource[] = []
  for (const source of SOURCES) {
    try {
      const html = await fetchCached(source.url, source.name)
      const parsed = parseWikiDefinitionList(html)
      console.log('  ' + source.name + ': parsed ' + parsed.length + ' entries')
      allFetched.push(...parsed)
    } catch (e) {
      console.warn('  ' + source.name + ': SKIPPED (' + (e as Error).message + ')')
    }
  }

  const seen = new Set<string>()
  const dedupedFetched: GlossaryEntrySource[] = []
  for (const entry of allFetched) {
    const key = normalizeSlug(entry.slug)
    if (seen.has(key)) continue
    seen.add(key)
    dedupedFetched.push(entry)
  }
  console.log('fetched after internal dedupe: ' + dedupedFetched.length)

  const novel = dedupedFetched.filter(e => !existing.has(normalizeSlug(e.slug)))
  console.log('novel after gap-filter: ' + novel.length)

  novel.sort((a, b) => a.title.localeCompare(b.title, 'en'))
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(novel, null, 2) + '\n')
  console.log('wrote ' + novel.length + ' entries to ' + OUTPUT_PATH)

  const totalAfterMerge = existing.size + novel.length
  console.log('projected total after merge: ' + totalAfterMerge)
  if (totalAfterMerge < 2000) {
    console.warn('WARNING: total is below 2000 target. Either expand SSP-curated or add more sources.')
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
```

- [ ] **Step 3: Run the script**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
npx tsx scripts/build-glossary-web-sourced.ts
```

Expected output:
```
existing slugs (cmc + ssp): 1370
  wikipedia-cryptocurrency-glossary: parsed N entries
  wikipedia-blockchain-glossary: parsed M entries
fetched after internal dedupe: ...
novel after gap-filter: ...
wrote ... entries to src/constants/glossary/web-sourced.json
projected total after merge: >= 2000
```

If `projected total after merge < 2000`, expand `ssp-curated.json` (Task 3) by the shortfall before continuing. The 2,000 target is firm.

- [ ] **Step 4: Inspect the output**

```bash
node -e "
const data = require('./src/constants/glossary/web-sourced.json')
console.log('entries:', data.length)
console.log('first 3:', JSON.stringify(data.slice(0, 3), null, 2))
const slugs = new Set(data.map(e => e.slug))
console.log('unique slugs:', slugs.size)
"
```

Expected: `unique slugs === entries`. Skim the first 3 to confirm coherent English sentences.

- [ ] **Step 5: Commit**

```bash
git add .gitignore scripts/build-glossary-web-sourced.ts src/constants/glossary/web-sourced.json
git commit -m "feat(glossary): add Wikipedia-sourced web layer (~700 entries) and build script"
```

---

## Task 5: Glossary merger and unit tests

**Files:**
- Create: `src/constants/glossary/index.ts`
- Test: `src/constants/glossary/index.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/constants/glossary/index.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { getGlossary, GLOSSARY } from './index'

describe('getGlossary', () => {
  it('returns at least 2,000 merged entries', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(2000)
  })

  it('returns a frozen array (cannot push)', () => {
    expect(() => {
      // @ts-expect-error - intentional runtime mutation attempt
      GLOSSARY.push({
        title: 'Test',
        slug: 'test',
        excerpt: '',
        source: 'web',
      })
    }).toThrow()
  })

  it('has no duplicate slugs after dedup', () => {
    const slugs = new Set(GLOSSARY.map(e => e.slug))
    expect(slugs.size).toBe(GLOSSARY.length)
  })

  it('is sorted alphabetically by title (en-US locale collation)', () => {
    for (let i = 1; i < GLOSSARY.length; i++) {
      const prev = GLOSSARY[i - 1].title
      const curr = GLOSSARY[i].title
      expect(prev.localeCompare(curr, 'en')).toBeLessThanOrEqual(0)
    }
  })

  it('tags every entry with a source discriminator', () => {
    for (const entry of GLOSSARY) {
      expect(['ssp-curated', 'cmc', 'web']).toContain(entry.source)
    }
  })

  it('lets ssp-curated win over cmc on a known collision', () => {
    const entry = GLOSSARY.find(e => e.slug === 'multisig')
    expect(entry).toBeDefined()
    expect(entry?.source).toBe('ssp-curated')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/constants/glossary/index.test.ts
```

Expected: FAIL with "Cannot find module './index'".

- [ ] **Step 3: Implement the merger**

Create `src/constants/glossary/index.ts`:

```typescript
import { normalizeSlug } from '@/lib/glossary-utils'
import cmcRaw from './cmc.json' assert { type: 'json' }
import sspCuratedRaw from './ssp-curated.json' assert { type: 'json' }
import webSourcedRaw from './web-sourced.json' assert { type: 'json' }
import type { GlossaryEntry, GlossaryEntrySource } from './types'

const cmc = cmcRaw as GlossaryEntrySource[]
const sspCurated = sspCuratedRaw as GlossaryEntrySource[]
const webSourced = webSourcedRaw as GlossaryEntrySource[]

export function getGlossary(): readonly GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>()

  // Lowest precedence first; later sets override earlier sets on slug collision.
  for (const entry of webSourced) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'web' })
  }
  for (const entry of cmc) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'cmc' })
  }
  for (const entry of sspCurated) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'ssp-curated' })
  }

  const merged = Array.from(map.values()).sort((a, b) =>
    a.title.localeCompare(b.title, 'en')
  )
  return Object.freeze(merged)
}

export const GLOSSARY = getGlossary()
export type { GlossaryEntry, GlossaryEntrySource } from './types'
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run src/constants/glossary/index.test.ts
```

Expected: PASS, 6 tests. If "ssp-curated wins over cmc on multisig" fails, ensure `ssp-curated.json` has a `multisig` entry.

- [ ] **Step 5: Commit**

```bash
git add src/constants/glossary/index.ts src/constants/glossary/index.test.ts
git commit -m "feat(glossary): merge cmc + ssp-curated + web with SSP-curated precedence"
```

---

## Task 6: Glossary entry card (server component)

**Files:**
- Create: `src/app/[locale]/glossary/glossary-entry-card.tsx`

- [ ] **Step 1: Write the component**

Create `src/app/[locale]/glossary/glossary-entry-card.tsx`:

```tsx
import { Link } from '@/i18n/navigation'
import type { GlossaryEntry } from '@/constants/glossary/types'
import { difficultyBadgeClass } from '@/lib/glossary-utils'

interface Props {
  entry: GlossaryEntry
}

export function GlossaryEntryCard({ entry }: Props) {
  return (
    <Link
      href={{ pathname: '/glossary/[slug]', params: { slug: entry.slug } }}
      data-glossary-card
      data-title={entry.title}
      id={entry.slug}
      className='dark:bg-dark-900 dark:hover:bg-dark-800 block scroll-mt-24 rounded-2xl bg-gray-50 p-6 transition-colors hover:bg-gray-100'
    >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{entry.title}</h3>
      <p className='mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400'>{entry.excerpt}</p>
      {entry.difficulty && (
        <span className={'mt-3 ' + difficultyBadgeClass(entry.difficulty.level)}>
          {entry.difficulty.label}
        </span>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS. If the typed-route pathname syntax errors, downgrade to `href={'/glossary/' + entry.slug}` and revisit after Task 9 lays down the page.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/glossary/glossary-entry-card.tsx
git commit -m "feat(glossary): server-rendered entry card component"
```

---

## Task 7: Letter index client island

**Files:**
- Create: `src/app/[locale]/glossary/letter-index.tsx`

- [ ] **Step 1: Write the component**

Create `src/app/[locale]/glossary/letter-index.tsx`:

```tsx
'use client'

interface Props {
  letters: string[]
}

export function LetterIndex({ letters }: Props) {
  const handleClick = (letter: string) => {
    const el = document.getElementById('letter-' + letter)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label='Glossary letter index'
      className='dark:bg-dark-900/40 sticky top-16 z-10 flex flex-wrap justify-center gap-1 bg-white/80 px-4 py-3 backdrop-blur md:top-20'
    >
      {letters.map(letter => (
        <button
          key={letter}
          type='button'
          onClick={() => handleClick(letter)}
          className='hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 flex h-8 min-w-[2rem] items-center justify-center rounded text-sm font-semibold text-gray-700 transition-colors dark:text-gray-300'
        >
          {letter}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/glossary/letter-index.tsx
git commit -m "feat(glossary): client letter-index jump bar"
```

---

## Task 8: Glossary search client island

**Files:**
- Create: `src/app/[locale]/glossary/glossary-search.tsx`
- Test: `src/app/[locale]/glossary/glossary-search.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/app/[locale]/glossary/glossary-search.test.tsx`:

```tsx
import { describe, it, expect, beforeEach } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { GlossarySearch } from './glossary-search'

describe('GlossarySearch', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <input data-search-input />
      </div>
      <section data-letter-section data-letter="A">
        <a data-glossary-card data-title="Address">Address</a>
        <a data-glossary-card data-title="Air-gapped">Air-gapped</a>
      </section>
      <section data-letter-section data-letter="B">
        <a data-glossary-card data-title="Bitcoin">Bitcoin</a>
      </section>
    `
  })

  it('shows all cards when query is empty', () => {
    render(<GlossarySearch placeholder='Search…' totalLabel='3 terms' />)
    expect(screen.getByText('3 terms')).toBeInTheDocument()
    const cards = document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    for (const card of cards) {
      expect(card.style.display).toBe('')
    }
  })

  it('filters cards by case-insensitive substring on title', () => {
    render(<GlossarySearch placeholder='Search…' totalLabel='3 terms' />)
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'air' } })

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    )
    const visible = cards.filter(c => c.style.display !== 'none')
    expect(visible.map(c => c.dataset.title)).toEqual(['Air-gapped'])
    expect(screen.getByText('1 matches')).toBeInTheDocument()
  })

  it('hides letter sections with no visible cards', () => {
    render(<GlossarySearch placeholder='Search…' totalLabel='3 terms' />)
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'bitcoin' } })

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('[data-letter-section]')
    )
    const sectionA = sections.find(s => s.dataset.letter === 'A')
    const sectionB = sections.find(s => s.dataset.letter === 'B')
    expect(sectionA?.style.display).toBe('none')
    expect(sectionB?.style.display).toBe('')
  })

  it('restores all cards when query is cleared', () => {
    render(<GlossarySearch placeholder='Search…' totalLabel='3 terms' />)
    const input = screen.getByPlaceholderText('Search…') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'air' } })
    fireEvent.change(input, { target: { value: '' } })

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    )
    for (const card of cards) {
      expect(card.style.display).toBe('')
    }
    expect(screen.getByText('3 terms')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run "src/app/[locale]/glossary/glossary-search.test.tsx"
```

Expected: FAIL with "Cannot find module './glossary-search'".

- [ ] **Step 3: Implement the component**

Create `src/app/[locale]/glossary/glossary-search.tsx`:

```tsx
'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  placeholder: string
  totalLabel: string
  matchesLabel?: (count: number) => string
}

export function GlossarySearch({
  placeholder,
  totalLabel,
  matchesLabel = c => c + ' matches',
}: Props) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const q = query.trim().toLowerCase()
    let visible = 0
    const cards = document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    for (const card of cards) {
      const title = (card.dataset.title ?? '').toLowerCase()
      const matches = q === '' || title.includes(q)
      card.style.display = matches ? '' : 'none'
      if (matches) visible++
    }
    const sections = document.querySelectorAll<HTMLElement>('[data-letter-section]')
    for (const section of sections) {
      const hasMatch = Array.from(
        section.querySelectorAll<HTMLElement>('[data-glossary-card]')
      ).some(c => c.style.display !== 'none')
      section.style.display = hasMatch ? '' : 'none'
    }
    setVisibleCount(visible)
  }, [query])

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='relative'>
        <Search
          className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400'
          aria-hidden
        />
        <input
          type='search'
          placeholder={placeholder}
          aria-label={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='dark:bg-dark-900 dark:border-dark-700 w-full rounded-full border border-gray-200 bg-white py-3 pr-4 pl-12 text-base text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500'
        />
      </div>
      <p className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
        {query ? matchesLabel(visibleCount) : totalLabel}
      </p>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run "src/app/[locale]/glossary/glossary-search.test.tsx"
```

Expected: PASS, 4 tests.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/glossary/glossary-search.tsx src/app/[locale]/glossary/glossary-search.test.tsx
git commit -m "feat(glossary): client search island with DOM-direct filtering"
```

---

## Task 9: Glossary index page

**Files:**
- Create: `src/app/[locale]/glossary/page.tsx`

- [ ] **Step 1: Implement the page**

Create `src/app/[locale]/glossary/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { GLOSSARY } from '@/constants/glossary'
import { groupByFirstLetter } from '@/lib/glossary-utils'
import { Link } from '@/i18n/navigation'
import { createMetadata } from '@/lib/seo'
import type { Locale } from '@/i18n/routing'
import { GlossaryEntryCard } from './glossary-entry-card'
import { GlossarySearch } from './glossary-search'
import { LetterIndex } from './letter-index'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Glossary' })
  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    path: '/glossary',
  })
}

export default async function GlossaryPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Glossary' })

  const groups = groupByFirstLetter(GLOSSARY)
  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#') return -1
    if (b === '#') return 1
    return a.localeCompare(b)
  })

  return (
    <>
      <section className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden bg-linear-to-b from-white to-gray-50 pb-12 md:pb-16 lg:pb-24'>
        <div className='container-custom relative z-10 pt-24 md:pt-32 lg:pt-40'>
          <h1 className='max-w-[900px] text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-[60px] lg:leading-[1.2] dark:text-white'>
            {t('title')}
          </h1>
          <p className='mt-6 max-w-[800px] text-lg text-gray-600 md:text-xl dark:text-gray-400'>
            {t('description')}
          </p>
          {locale !== 'en' && (
            <p className='mt-4 text-sm text-gray-500 dark:text-gray-500'>
              {t.rich('contentInEnglishBanner', {
                academyLink: chunks => (
                  <Link href='/academy' className='underline'>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
          <div className='mt-8'>
            <GlossarySearch
              placeholder={t('searchPlaceholder')}
              totalLabel={t('total', { count: GLOSSARY.length })}
              matchesLabel={c => t('matches', { count: c })}
            />
          </div>
        </div>
      </section>

      <LetterIndex letters={letters} />

      <section className='container-custom py-12'>
        {letters.map(letter => (
          <div
            key={letter}
            id={'letter-' + letter}
            data-letter-section
            data-letter={letter}
            className='mb-12 scroll-mt-24'
          >
            <h2 className='mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-white'>
              {letter}
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {groups[letter].map(entry => (
                <GlossaryEntryCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className='container-custom border-t border-gray-200 pt-8 pb-12 text-sm text-gray-500 dark:border-white/10 dark:text-gray-500'>
        {t('attribution')}
      </footer>
    </>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: errors will surface for missing `Glossary.*` keys — fixed in Task 11. To unblock locally, you may temporarily comment out the `getTranslations` lines, or proceed and fix in Task 11 (the type-check gate is at Task 19).

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/glossary/page.tsx
git commit -m "feat(glossary): index page with letter groups and search"
```

---

## Task 10: Glossary detail page

**Files:**
- Create: `src/app/[locale]/glossary/[slug]/page.tsx`

- [ ] **Step 1: Implement the detail page**

Create `src/app/[locale]/glossary/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { Link } from '@/i18n/navigation'
import { GLOSSARY } from '@/constants/glossary'
import { difficultyBadgeClass } from '@/lib/glossary-utils'
import { createMetadata } from '@/lib/seo'
import type { Locale } from '@/i18n/routing'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams({
  params,
}: {
  params: { locale: string }
}) {
  return GLOSSARY.map(entry => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const entry = GLOSSARY.find(e => e.slug === slug)
  if (!entry) return {}
  const t = await getTranslations({ locale, namespace: 'Glossary' })
  return createMetadata({
    title: t('termSeoTitle', { term: entry.title }),
    description: entry.excerpt.slice(0, 160),
    path: '/glossary/' + slug,
  })
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const entry = GLOSSARY.find(e => e.slug === slug)
  if (!entry) notFound()

  const t = await getTranslations({ locale, namespace: 'Glossary' })

  return (
    <article className='container-custom my-12 md:my-16 lg:my-24'>
      <Link
        href='/glossary'
        className='text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      >
        ← {t('backToGlossary')}
      </Link>

      <h1 className='mt-6 max-w-[900px] text-4xl leading-tight font-bold text-gray-900 md:text-5xl dark:text-white'>
        {entry.title}
      </h1>

      {entry.difficulty && (
        <div className='mt-4'>
          <span className={difficultyBadgeClass(entry.difficulty.level)}>
            {entry.difficulty.label}
          </span>
        </div>
      )}

      {locale !== 'en' && (
        <p className='mt-6 text-sm text-gray-500 dark:text-gray-500'>
          {t.rich('contentInEnglishBanner', {
            academyLink: chunks => (
              <Link href='/academy' className='underline'>
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}

      <div className='prose prose-lg dark:prose-invert mt-8 max-w-none'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.excerpt}</ReactMarkdown>
      </div>

      {/* Reserved slot for sub-project 2: "Appears in articles" — intentionally empty in v1 */}
    </article>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/glossary/[slug]/page.tsx
git commit -m "feat(glossary): per-term detail page with SSG for all slugs"
```

---

## Task 11: Add Glossary translation keys to en.json

**Files:**
- Modify: `src/messages/en.json`

- [ ] **Step 1: Inspect current en.json structure**

```bash
node -e "
const m = require('./src/messages/en.json')
console.log('top-level keys:', Object.keys(m))
console.log('has Glossary?', 'Glossary' in m)
"
```

If `'Glossary' in m` is `false`, proceed; otherwise merge into the existing namespace.

- [ ] **Step 2: Add the Glossary namespace**

Add the `Glossary` namespace to `src/messages/en.json` at the appropriate alphabetical position (after `Footer`, before `Guide` by current convention):

```json
"Glossary": {
  "title": "Glossary",
  "description": "Crypto, blockchain, and SSP terms explained. 2,000+ entries from CoinMarketCap, Wikipedia, and the SSP team.",
  "searchPlaceholder": "Search 2,000+ terms…",
  "total": "{count} terms",
  "matches": "{count, plural, =0 {No matches} =1 {1 match} other {# matches}}",
  "backToGlossary": "Back to glossary",
  "termSeoTitle": "{term} — SSP Glossary",
  "seoTitle": "Crypto Glossary — SSP",
  "seoDescription": "A glossary of crypto, blockchain, and SSP-specific terms. Search 2,000+ entries.",
  "attribution": "Some entries adapted from Wikipedia's \"Glossary of cryptocurrency terms\" under CC BY-SA 3.0. Other entries from the CoinMarketCap glossary and SSP team curation.",
  "contentInEnglishBanner": "Glossary content is shown in English. For localized articles, see the <academyLink>Academy</academyLink>."
}
```

- [ ] **Step 3: Validate the JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('./src/messages/en.json'))" && echo OK
```

Expected: `OK`.

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json
git commit -m "feat(i18n): add Glossary namespace to en.json"
```

---

## Task 12: Translate Glossary keys to 13 other locales

**Files:**
- Modify: all of `src/messages/{es,zh,pt-BR,ru,tr,ja,de,fr,it,pl,ko,vi,id}.json`

- [ ] **Step 1: Write the Python translation script**

Create `/tmp/translate-glossary-namespace.py`:

```python
#!/usr/bin/env python3
"""Insert the Glossary namespace into each non-English locale file."""
import json
from pathlib import Path

ROOT = Path("/Users/vasilismagkoutis/repos/ssp-website/src/messages")

TRANSLATIONS = {
    "es": {
        "title": "Glosario",
        "description": "Términos de criptomonedas, blockchain y SSP explicados. Más de 2.000 entradas de CoinMarketCap, Wikipedia y el equipo de SSP.",
        "searchPlaceholder": "Buscar más de 2.000 términos…",
        "total": "{count} términos",
        "matches": "{count, plural, =0 {Sin resultados} =1 {1 resultado} other {# resultados}}",
        "backToGlossary": "Volver al glosario",
        "termSeoTitle": "{term} — Glosario SSP",
        "seoTitle": "Glosario de criptomonedas — SSP",
        "seoDescription": "Glosario de términos de criptomonedas, blockchain y SSP. Más de 2.000 entradas.",
        "attribution": "Algunas entradas adaptadas de \"Glosario de términos de criptomonedas\" de Wikipedia bajo CC BY-SA 3.0. Otras del glosario de CoinMarketCap y la curaduría del equipo SSP.",
        "contentInEnglishBanner": "El contenido del glosario se muestra en inglés. Para artículos localizados, consulta la <academyLink>Academia</academyLink>.",
    },
    "zh": {
        "title": "术语表",
        "description": "加密货币、区块链和 SSP 相关术语解释。包含来自 CoinMarketCap、维基百科和 SSP 团队整理的 2,000+ 条目。",
        "searchPlaceholder": "搜索 2,000+ 术语…",
        "total": "{count} 条",
        "matches": "{count, plural, =0 {无匹配} =1 {1 条匹配} other {# 条匹配}}",
        "backToGlossary": "返回术语表",
        "termSeoTitle": "{term} — SSP 术语表",
        "seoTitle": "加密货币术语表 — SSP",
        "seoDescription": "加密货币、区块链和 SSP 相关术语词典。2,000+ 条目可搜索。",
        "attribution": "部分条目改编自维基百科《加密货币术语表》(CC BY-SA 3.0)。其他条目来自 CoinMarketCap 术语表和 SSP 团队整理。",
        "contentInEnglishBanner": "术语表内容以英文显示。如需本地化文章，请访问<academyLink>学院</academyLink>。",
    },
    "pt-BR": {
        "title": "Glossário",
        "description": "Termos de criptomoedas, blockchain e SSP explicados. Mais de 2.000 entradas do CoinMarketCap, Wikipedia e equipe SSP.",
        "searchPlaceholder": "Pesquise mais de 2.000 termos…",
        "total": "{count} termos",
        "matches": "{count, plural, =0 {Nenhum resultado} =1 {1 resultado} other {# resultados}}",
        "backToGlossary": "Voltar ao glossário",
        "termSeoTitle": "{term} — Glossário SSP",
        "seoTitle": "Glossário de criptomoedas — SSP",
        "seoDescription": "Glossário de termos de criptomoedas, blockchain e SSP. Mais de 2.000 entradas.",
        "attribution": "Algumas entradas adaptadas do \"Glossário de termos de criptomoedas\" da Wikipedia sob CC BY-SA 3.0. Outras do glossário CoinMarketCap e da curadoria SSP.",
        "contentInEnglishBanner": "O conteúdo do glossário é exibido em inglês. Para artigos localizados, consulte a <academyLink>Academia</academyLink>.",
    },
    "ru": {
        "title": "Глоссарий",
        "description": "Термины криптовалют, блокчейна и SSP с пояснениями. Более 2 000 записей из CoinMarketCap, «Википедии» и подборки команды SSP.",
        "searchPlaceholder": "Поиск среди 2 000+ терминов…",
        "total": "{count} терминов",
        "matches": "{count, plural, =0 {Совпадений нет} one {# совпадение} few {# совпадения} many {# совпадений} other {# совпадений}}",
        "backToGlossary": "Назад к глоссарию",
        "termSeoTitle": "{term} — Глоссарий SSP",
        "seoTitle": "Криптовалютный глоссарий — SSP",
        "seoDescription": "Глоссарий терминов криптовалют, блокчейна и SSP. Более 2 000 записей.",
        "attribution": "Некоторые статьи адаптированы из «Глоссария криптовалютных терминов» «Википедии» (CC BY-SA 3.0). Другие — из глоссария CoinMarketCap и подборки команды SSP.",
        "contentInEnglishBanner": "Содержимое глоссария показано на английском. Локализованные статьи доступны в <academyLink>Академии</academyLink>.",
    },
    "tr": {
        "title": "Sözlük",
        "description": "Kripto, blokzincir ve SSP'ye özgü terimler. CoinMarketCap, Wikipedia ve SSP ekibinden 2.000+ giriş.",
        "searchPlaceholder": "2.000+ terim arasında ara…",
        "total": "{count} terim",
        "matches": "{count, plural, =0 {Eşleşme yok} =1 {1 eşleşme} other {# eşleşme}}",
        "backToGlossary": "Sözlüğe dön",
        "termSeoTitle": "{term} — SSP Sözlüğü",
        "seoTitle": "Kripto Sözlüğü — SSP",
        "seoDescription": "Kripto para, blokzincir ve SSP terimleri sözlüğü. 2.000+ giriş aranabilir.",
        "attribution": "Bazı girişler Wikipedia'nın \"Kripto para birimi terimleri sözlüğü\"nden CC BY-SA 3.0 lisansıyla uyarlanmıştır. Diğerleri CoinMarketCap sözlüğünden ve SSP ekibinden.",
        "contentInEnglishBanner": "Sözlük içeriği İngilizce olarak gösterilmektedir. Yerelleştirilmiş makaleler için <academyLink>Akademi</academyLink>'yi ziyaret edin.",
    },
    "ja": {
        "title": "用語集",
        "description": "暗号資産、ブロックチェーン、SSP 関連用語の解説。CoinMarketCap、Wikipedia、SSP チームによる 2,000+ エントリー。",
        "searchPlaceholder": "2,000+ 用語を検索…",
        "total": "{count} 件",
        "matches": "{count, plural, =0 {一致なし} =1 {1 件一致} other {# 件一致}}",
        "backToGlossary": "用語集に戻る",
        "termSeoTitle": "{term} — SSP 用語集",
        "seoTitle": "暗号資産用語集 — SSP",
        "seoDescription": "暗号資産、ブロックチェーン、SSP 関連用語の検索可能な用語集。2,000+ エントリー。",
        "attribution": "一部のエントリーは Wikipedia「暗号資産用語集」(CC BY-SA 3.0) を改変。他は CoinMarketCap 用語集および SSP チームによるキュレーション。",
        "contentInEnglishBanner": "用語集のコンテンツは英語で表示されます。各言語向けの記事は<academyLink>アカデミー</academyLink>をご覧ください。",
    },
    "de": {
        "title": "Glossar",
        "description": "Begriffe rund um Krypto, Blockchain und SSP. Über 2.000 Einträge von CoinMarketCap, Wikipedia und dem SSP-Team.",
        "searchPlaceholder": "2.000+ Begriffe durchsuchen…",
        "total": "{count} Begriffe",
        "matches": "{count, plural, =0 {Keine Treffer} =1 {1 Treffer} other {# Treffer}}",
        "backToGlossary": "Zurück zum Glossar",
        "termSeoTitle": "{term} — SSP-Glossar",
        "seoTitle": "Krypto-Glossar — SSP",
        "seoDescription": "Glossar mit Krypto-, Blockchain- und SSP-Begriffen. Über 2.000 durchsuchbare Einträge.",
        "attribution": "Einige Einträge stammen aus Wikipedias \"Glossar der Kryptowährungsbegriffe\" unter CC BY-SA 3.0. Andere aus dem CoinMarketCap-Glossar und der Auswahl des SSP-Teams.",
        "contentInEnglishBanner": "Der Glossar-Inhalt wird in Englisch angezeigt. Lokalisierte Artikel finden Sie in der <academyLink>Akademie</academyLink>.",
    },
    "fr": {
        "title": "Glossaire",
        "description": "Termes crypto, blockchain et propres à SSP. Plus de 2 000 entrées issues de CoinMarketCap, Wikipédia et de l'équipe SSP.",
        "searchPlaceholder": "Rechercher parmi 2 000+ termes…",
        "total": "{count} termes",
        "matches": "{count, plural, =0 {Aucun résultat} =1 {1 résultat} other {# résultats}}",
        "backToGlossary": "Retour au glossaire",
        "termSeoTitle": "{term} — Glossaire SSP",
        "seoTitle": "Glossaire crypto — SSP",
        "seoDescription": "Glossaire de termes crypto, blockchain et SSP. Plus de 2 000 entrées recherchables.",
        "attribution": "Certaines entrées sont adaptées du « Glossaire des termes de cryptomonnaie » de Wikipédia sous CC BY-SA 3.0. D'autres proviennent du glossaire CoinMarketCap et de la sélection de l'équipe SSP.",
        "contentInEnglishBanner": "Le contenu du glossaire est affiché en anglais. Pour des articles localisés, consultez l'<academyLink>Académie</academyLink>.",
    },
    "it": {
        "title": "Glossario",
        "description": "Termini di criptovalute, blockchain e SSP. Oltre 2.000 voci da CoinMarketCap, Wikipedia e curatela del team SSP.",
        "searchPlaceholder": "Cerca tra oltre 2.000 termini…",
        "total": "{count} termini",
        "matches": "{count, plural, =0 {Nessun risultato} =1 {1 risultato} other {# risultati}}",
        "backToGlossary": "Torna al glossario",
        "termSeoTitle": "{term} — Glossario SSP",
        "seoTitle": "Glossario crypto — SSP",
        "seoDescription": "Glossario di termini cripto, blockchain e SSP. Oltre 2.000 voci ricercabili.",
        "attribution": "Alcune voci sono adattate dal \"Glossario dei termini di criptovaluta\" di Wikipedia con licenza CC BY-SA 3.0. Altre provengono dal glossario CoinMarketCap e dalla curatela del team SSP.",
        "contentInEnglishBanner": "Il contenuto del glossario è mostrato in inglese. Per articoli localizzati, consulta l'<academyLink>Academy</academyLink>.",
    },
    "pl": {
        "title": "Słownik",
        "description": "Pojęcia kryptowalut, blockchaina i SSP. Ponad 2000 haseł z CoinMarketCap, Wikipedii i zespołu SSP.",
        "searchPlaceholder": "Szukaj wśród ponad 2000 haseł…",
        "total": "{count} haseł",
        "matches": "{count, plural, =0 {Brak wyników} one {# wynik} few {# wyniki} many {# wyników} other {# wyników}}",
        "backToGlossary": "Wróć do słownika",
        "termSeoTitle": "{term} — Słownik SSP",
        "seoTitle": "Słownik kryptowalut — SSP",
        "seoDescription": "Słownik pojęć kryptowalut, blockchaina i SSP. Ponad 2000 wyszukiwalnych haseł.",
        "attribution": "Część haseł zaczerpnięto ze „Słownika pojęć kryptowalut" Wikipedii na licencji CC BY-SA 3.0. Inne pochodzą ze słownika CoinMarketCap i kuratorskiego zestawu zespołu SSP.",
        "contentInEnglishBanner": "Treść słownika wyświetlana jest po angielsku. Artykuły w Twoim języku znajdziesz w <academyLink>Akademii</academyLink>.",
    },
    "ko": {
        "title": "용어집",
        "description": "암호화폐, 블록체인, SSP 관련 용어 해설. CoinMarketCap, Wikipedia, SSP 팀이 정리한 2,000개 이상 항목.",
        "searchPlaceholder": "2,000개 이상 용어 검색…",
        "total": "{count}개 용어",
        "matches": "{count, plural, =0 {결과 없음} =1 {1개 일치} other {#개 일치}}",
        "backToGlossary": "용어집으로 돌아가기",
        "termSeoTitle": "{term} — SSP 용어집",
        "seoTitle": "암호화폐 용어집 — SSP",
        "seoDescription": "암호화폐, 블록체인, SSP 용어집. 2,000개 이상의 검색 가능한 항목.",
        "attribution": "일부 항목은 Wikipedia의 \"암호화폐 용어집\"(CC BY-SA 3.0)을 각색했습니다. 나머지는 CoinMarketCap 용어집과 SSP 팀의 큐레이션입니다.",
        "contentInEnglishBanner": "용어집은 영어로 표시됩니다. 현지화된 아티클은 <academyLink>아카데미</academyLink>에서 확인하세요.",
    },
    "vi": {
        "title": "Bảng thuật ngữ",
        "description": "Thuật ngữ về tiền mã hóa, blockchain và SSP. Hơn 2.000 mục từ CoinMarketCap, Wikipedia và đội ngũ SSP.",
        "searchPlaceholder": "Tìm trong hơn 2.000 thuật ngữ…",
        "total": "{count} thuật ngữ",
        "matches": "{count, plural, =0 {Không có kết quả} =1 {1 kết quả} other {# kết quả}}",
        "backToGlossary": "Quay lại bảng thuật ngữ",
        "termSeoTitle": "{term} — Bảng thuật ngữ SSP",
        "seoTitle": "Bảng thuật ngữ tiền mã hóa — SSP",
        "seoDescription": "Bảng thuật ngữ về tiền mã hóa, blockchain và SSP. Hơn 2.000 mục có thể tìm kiếm.",
        "attribution": "Một số mục được điều chỉnh từ \"Bảng thuật ngữ tiền mã hóa\" của Wikipedia theo CC BY-SA 3.0. Các mục khác từ bảng thuật ngữ CoinMarketCap và đội ngũ SSP.",
        "contentInEnglishBanner": "Nội dung bảng thuật ngữ được hiển thị bằng tiếng Anh. Để xem bài viết theo ngôn ngữ của bạn, hãy truy cập <academyLink>Học viện</academyLink>.",
    },
    "id": {
        "title": "Glosarium",
        "description": "Istilah kripto, blockchain, dan SSP. Lebih dari 2.000 entri dari CoinMarketCap, Wikipedia, dan tim SSP.",
        "searchPlaceholder": "Cari lebih dari 2.000 istilah…",
        "total": "{count} istilah",
        "matches": "{count, plural, =0 {Tidak ada hasil} =1 {1 hasil} other {# hasil}}",
        "backToGlossary": "Kembali ke glosarium",
        "termSeoTitle": "{term} — Glosarium SSP",
        "seoTitle": "Glosarium Kripto — SSP",
        "seoDescription": "Glosarium istilah kripto, blockchain, dan SSP. Lebih dari 2.000 entri yang dapat dicari.",
        "attribution": "Beberapa entri diadaptasi dari \"Glosarium istilah kriptokurensi\" Wikipedia di bawah lisensi CC BY-SA 3.0. Entri lain berasal dari glosarium CoinMarketCap dan kurasi tim SSP.",
        "contentInEnglishBanner": "Isi glosarium ditampilkan dalam bahasa Inggris. Untuk artikel yang dilokalkan, kunjungi <academyLink>Academy</academyLink>.",
    },
}

assert len(TRANSLATIONS) == 13, f"expected 13 locales, got {len(TRANSLATIONS)}"

for locale, glossary in TRANSLATIONS.items():
    file_path = ROOT / f"{locale}.json"
    with file_path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    data["Glossary"] = glossary
    with file_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"updated {file_path.name}")

print("done")
```

- [ ] **Step 2: Run the script**

```bash
python3 /tmp/translate-glossary-namespace.py
```

Expected: 13 lines of `updated <locale>.json`, then `done`.

- [ ] **Step 3: Validate translation completeness**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
npx tsx scripts/check-translations.ts
```

Expected: PASS (clean exit, no per-locale report).

- [ ] **Step 4: Commit**

```bash
git add src/messages/es.json src/messages/zh.json src/messages/pt-BR.json src/messages/ru.json src/messages/tr.json src/messages/ja.json src/messages/de.json src/messages/fr.json src/messages/it.json src/messages/pl.json src/messages/ko.json src/messages/vi.json src/messages/id.json
git commit -m "feat(i18n): translate Glossary namespace to 13 Wave 1 locales"
```

---

## Task 13: shadcn `navigation-menu.tsx` wrapper

**Files:**
- Create: `src/components/ui/navigation-menu.tsx`
- Modify (if needed): `src/lib/utils.ts`

- [ ] **Step 1: Verify `cn()` utility exists**

```bash
grep -l 'export function cn' /Users/vasilismagkoutis/repos/ssp-website/src/lib/utils.ts
```

If missing, append to `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Both `clsx` and `tailwind-merge` are already in `package.json`. No install needed.

- [ ] **Step 2: Verify `class-variance-authority` is installed**

```bash
grep '"class-variance-authority"' /Users/vasilismagkoutis/repos/ssp-website/package.json
```

Already in deps. No install.

- [ ] **Step 3: Create the wrapper**

Create `src/components/ui/navigation-menu.tsx`:

```tsx
'use client'

import * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
    {...props}
  >
    {children}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn('group flex flex-1 list-none items-center justify-center space-x-1', className)}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium transition-colors hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:text-primary-600 dark:data-[active]:text-primary-400 data-[state=open]:text-primary-600 dark:data-[state=open]:text-primary-400'
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle(), 'group', className)}
    {...props}
  >
    {children}
    <ChevronDown
      className='relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180'
      aria-hidden='true'
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = NavigationMenuPrimitive.Link

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={cn('absolute left-0 top-full flex justify-center')}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-gray-200 dark:border-white/10 bg-white dark:bg-dark-900 text-gray-900 dark:text-white shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName = NavigationMenuPrimitive.Viewport.displayName

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/navigation-menu.tsx src/lib/utils.ts
git commit -m "feat(ui): add shadcn navigation-menu primitive wrapper"
```

---

## Task 14: Learn dropdown component + test

**Files:**
- Create: `src/components/header/learn-dropdown.tsx`
- Test: `src/components/header/learn-dropdown.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/header/learn-dropdown.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { LearnDropdown } from './learn-dropdown'

const messages = {
  Header: {
    learn: 'Learn',
    academy: 'Academy',
    series: 'Series',
    learnGlossary: 'Glossary',
    learnAcademyDescription: 'Articles by category',
    learnSeriesDescription: 'Multi-part paths',
    learnGlossaryDescription: 'Crypto terms',
  },
}

describe('LearnDropdown', () => {
  it('renders the trigger label "Learn"', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LearnDropdown isActive={false} />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('Learn')).toBeInTheDocument()
  })

  it('applies active class when isActive is true', () => {
    const { container } = render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LearnDropdown isActive />
      </NextIntlClientProvider>
    )
    const trigger = container.querySelector('[data-active]') ?? container.querySelector('button')
    expect(trigger?.className).toMatch(/text-primary/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/components/header/learn-dropdown.test.tsx
```

Expected: FAIL with "Cannot find module './learn-dropdown'".

- [ ] **Step 3: Implement the component**

Create `src/components/header/learn-dropdown.tsx`:

```tsx
'use client'

import { BookA, BookOpen, Compass } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

interface Props {
  isActive: boolean
}

export function LearnDropdown({ isActive }: Props) {
  const t = useTranslations('Header')

  const items = [
    {
      href: '/academy' as const,
      icon: BookOpen,
      label: t('academy'),
      desc: t('learnAcademyDescription'),
    },
    {
      href: '/academy/series' as const,
      icon: Compass,
      label: t('series'),
      desc: t('learnSeriesDescription'),
    },
    {
      href: '/glossary' as const,
      icon: BookA,
      label: t('learnGlossary'),
      desc: t('learnGlossaryDescription'),
    },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={isActive ? 'text-primary-600 dark:text-primary-400' : ''}
            data-active={isActive || undefined}
          >
            {t('learn')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[360px] gap-2 p-3'>
              {items.map(item => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className='dark:hover:bg-dark-800 flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-gray-50'
                    >
                      <item.icon className='mt-1 h-5 w-5 shrink-0' />
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {item.label}
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{item.desc}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/components/header/learn-dropdown.test.tsx
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Commit**

```bash
git add src/components/header/learn-dropdown.tsx src/components/header/learn-dropdown.test.tsx
git commit -m "feat(header): Radix-based Learn dropdown with Academy/Series/Glossary"
```

---

## Task 15: Learn mobile section

**Files:**
- Create: `src/components/header/learn-mobile-section.tsx`

- [ ] **Step 1: Write the component**

Create `src/components/header/learn-mobile-section.tsx`:

```tsx
'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  pathname: string
  onItemClick: () => void
}

export function LearnMobileSection({ pathname, onItemClick }: Props) {
  const t = useTranslations('Header')

  const items: Array<{ href: '/academy' | '/academy/series' | '/glossary'; label: string }> = [
    { href: '/academy', label: t('academy') },
    { href: '/academy/series', label: t('series') },
    { href: '/glossary', label: t('learnGlossary') },
  ]

  return (
    <div className='py-2'>
      <div className='px-4 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
        {t('learn')}
      </div>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            'block px-6 py-2 text-base font-medium transition-colors duration-200',
            pathname === item.href || pathname.startsWith(item.href + '/')
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'hover:text-primary-600 dark:hover:bg-dark-800 dark:hover:text-primary-400 text-gray-700 hover:bg-gray-50 dark:text-gray-300'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/header/learn-mobile-section.tsx
git commit -m "feat(header): mobile menu Learn subsection"
```

---

## Task 16: Add Header.learn* and Header.series keys to en.json

**Files:**
- Modify: `src/messages/en.json`

- [ ] **Step 1: Locate the `Header` namespace block**

```bash
grep -n '"Header":' /Users/vasilismagkoutis/repos/ssp-website/src/messages/en.json
```

- [ ] **Step 2: Add the new keys to the Header block**

Add these keys inside the `Header` namespace of `src/messages/en.json`:

```json
"learn": "Learn",
"series": "Series",
"learnGlossary": "Glossary",
"learnAcademyDescription": "Long-form articles organized by category",
"learnSeriesDescription": "Guided multi-part learning paths",
"learnGlossaryDescription": "Crypto and SSP terms, 2,000+ entries"
```

Place them alphabetically within `Header`.

- [ ] **Step 3: Validate JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('./src/messages/en.json'))" && echo OK
```

- [ ] **Step 4: Commit**

```bash
git add src/messages/en.json
git commit -m "feat(i18n): add Header.learn* keys to en.json for Learn dropdown"
```

---

## Task 17: Translate Header.learn* keys to 13 other locales

**Files:**
- Modify: `src/messages/{es,zh,pt-BR,ru,tr,ja,de,fr,it,pl,ko,vi,id}.json`

- [ ] **Step 1: Write the Python merge script**

Create `/tmp/translate-header-learn.py`:

```python
#!/usr/bin/env python3
"""Add Header.learn*/Header.series keys to each non-English locale file."""
import json
from pathlib import Path

ROOT = Path("/Users/vasilismagkoutis/repos/ssp-website/src/messages")

TRANSLATIONS = {
    "es": {
        "learn": "Aprender",
        "series": "Series",
        "learnGlossary": "Glosario",
        "learnAcademyDescription": "Artículos extensos organizados por categoría",
        "learnSeriesDescription": "Rutas de aprendizaje guiadas en varias partes",
        "learnGlossaryDescription": "Términos de cripto y SSP, más de 2.000 entradas",
    },
    "zh": {
        "learn": "学习",
        "series": "系列",
        "learnGlossary": "术语表",
        "learnAcademyDescription": "按分类整理的长篇文章",
        "learnSeriesDescription": "多章节系统学习路径",
        "learnGlossaryDescription": "加密货币与 SSP 术语，2,000+ 条目",
    },
    "pt-BR": {
        "learn": "Aprenda",
        "series": "Séries",
        "learnGlossary": "Glossário",
        "learnAcademyDescription": "Artigos longos organizados por categoria",
        "learnSeriesDescription": "Trilhas de aprendizado em várias partes",
        "learnGlossaryDescription": "Termos de cripto e SSP, mais de 2.000 entradas",
    },
    "ru": {
        "learn": "Обучение",
        "series": "Циклы",
        "learnGlossary": "Глоссарий",
        "learnAcademyDescription": "Подробные статьи по категориям",
        "learnSeriesDescription": "Многосерийные учебные маршруты",
        "learnGlossaryDescription": "Криптовалютные и SSP-термины, более 2 000 записей",
    },
    "tr": {
        "learn": "Öğren",
        "series": "Seriler",
        "learnGlossary": "Sözlük",
        "learnAcademyDescription": "Kategoriye göre düzenlenmiş uzun makaleler",
        "learnSeriesDescription": "Çok bölümlü rehberli öğrenme yolları",
        "learnGlossaryDescription": "Kripto ve SSP terimleri, 2.000+ giriş",
    },
    "ja": {
        "learn": "学ぶ",
        "series": "シリーズ",
        "learnGlossary": "用語集",
        "learnAcademyDescription": "カテゴリー別の詳細記事",
        "learnSeriesDescription": "複数パートの学習パス",
        "learnGlossaryDescription": "暗号資産・SSP 用語、2,000+ エントリー",
    },
    "de": {
        "learn": "Lernen",
        "series": "Reihen",
        "learnGlossary": "Glossar",
        "learnAcademyDescription": "Lange Beiträge, nach Kategorie sortiert",
        "learnSeriesDescription": "Mehrteilige Lernpfade",
        "learnGlossaryDescription": "Krypto- und SSP-Begriffe, über 2.000 Einträge",
    },
    "fr": {
        "learn": "Apprendre",
        "series": "Séries",
        "learnGlossary": "Glossaire",
        "learnAcademyDescription": "Articles approfondis classés par catégorie",
        "learnSeriesDescription": "Parcours d'apprentissage en plusieurs parties",
        "learnGlossaryDescription": "Termes crypto et SSP, plus de 2 000 entrées",
    },
    "it": {
        "learn": "Impara",
        "series": "Serie",
        "learnGlossary": "Glossario",
        "learnAcademyDescription": "Articoli approfonditi per categoria",
        "learnSeriesDescription": "Percorsi di apprendimento in più parti",
        "learnGlossaryDescription": "Termini crypto e SSP, oltre 2.000 voci",
    },
    "pl": {
        "learn": "Nauka",
        "series": "Serie",
        "learnGlossary": "Słownik",
        "learnAcademyDescription": "Długie artykuły pogrupowane tematycznie",
        "learnSeriesDescription": "Wieloczęściowe ścieżki nauki",
        "learnGlossaryDescription": "Pojęcia kryptowalut i SSP, ponad 2000 haseł",
    },
    "ko": {
        "learn": "학습",
        "series": "시리즈",
        "learnGlossary": "용어집",
        "learnAcademyDescription": "카테고리별 심층 기사",
        "learnSeriesDescription": "여러 부로 구성된 학습 경로",
        "learnGlossaryDescription": "암호화폐 및 SSP 용어, 2,000개 이상",
    },
    "vi": {
        "learn": "Học",
        "series": "Loạt bài",
        "learnGlossary": "Bảng thuật ngữ",
        "learnAcademyDescription": "Bài viết dài được phân loại theo chuyên mục",
        "learnSeriesDescription": "Lộ trình học nhiều phần",
        "learnGlossaryDescription": "Thuật ngữ kripto và SSP, hơn 2.000 mục",
    },
    "id": {
        "learn": "Belajar",
        "series": "Seri",
        "learnGlossary": "Glosarium",
        "learnAcademyDescription": "Artikel panjang yang dikelompokkan per kategori",
        "learnSeriesDescription": "Jalur belajar multi-bagian",
        "learnGlossaryDescription": "Istilah kripto dan SSP, lebih dari 2.000 entri",
    },
}

assert len(TRANSLATIONS) == 13

for locale, additions in TRANSLATIONS.items():
    path = ROOT / f"{locale}.json"
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    header = data.setdefault("Header", {})
    header.update(additions)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"updated {path.name}")

print("done")
```

- [ ] **Step 2: Run the script**

```bash
python3 /tmp/translate-header-learn.py
```

Expected: 13 lines of `updated <locale>.json`, then `done`.

- [ ] **Step 3: Run the translation checker**

```bash
npx tsx scripts/check-translations.ts
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/messages/es.json src/messages/zh.json src/messages/pt-BR.json src/messages/ru.json src/messages/tr.json src/messages/ja.json src/messages/de.json src/messages/fr.json src/messages/it.json src/messages/pl.json src/messages/ko.json src/messages/vi.json src/messages/id.json
git commit -m "feat(i18n): translate Header.learn* keys to 13 Wave 1 locales"
```

---

## Task 18: Restructure `header.tsx` to support the Learn dropdown

**Files:**
- Modify: `src/components/header/header.tsx`

- [ ] **Step 1: Replace `header.tsx` contents**

Overwrite `src/components/header/header.tsx` with:

```tsx
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { LocaleSwitcher } from '@/components/header/locale-switcher'
import { LearnDropdown } from '@/components/header/learn-dropdown'
import { LearnMobileSection } from '@/components/header/learn-mobile-section'
import { Logo } from '@/components/logo'
import { useTheme } from '@/hooks/use-theme'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type LinkItem = { kind: 'link'; name: string; href: string }
type GroupItem = { kind: 'group'; key: 'learn'; name: string }
type NavItem = LinkItem | GroupItem

export function Header() {
  const t = useTranslations('Header')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()
  const pathname = usePathname()

  const primaryNav: NavItem[] = [
    { kind: 'link', name: t('home'), href: '/' },
    { kind: 'link', name: t('enterprise'), href: '/enterprise' },
    { kind: 'link', name: t('features'), href: '/features' },
    { kind: 'link', name: t('newsroom'), href: '/newsroom' },
    { kind: 'group', key: 'learn', name: t('learn') },
    { kind: 'link', name: t('guide'), href: '/guide' },
    { kind: 'link', name: t('support'), href: '/support' },
    { kind: 'link', name: t('contact'), href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const isLearnActive =
    pathname === '/academy' ||
    pathname.startsWith('/academy/') ||
    pathname === '/glossary' ||
    pathname.startsWith('/glossary/')

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'dark:bg-dark-900/80 border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:border-white/10'
          : 'bg-transparent'
      )}
    >
      <nav className='container-custom'>
        <div className='flex h-16 items-center justify-between md:h-20'>
          <Link href='/' className='flex items-center space-x-2'>
            <Logo width={120} height={40} className='h-8 md:h-10' />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-6 lg:flex'>
            {primaryNav.map(item => {
              if (item.kind === 'group') {
                return <LearnDropdown key='learn' isActive={isLearnActive} />
              }
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'hover:text-primary-600 dark:hover:text-primary-400 relative text-sm font-medium transition-colors duration-200',
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      className='bg-primary-600 dark:bg-primary-400 absolute right-0 -bottom-1 left-0 h-0.5'
                      layoutId='activeTab'
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.15 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className='flex items-center space-x-3'>
            {mounted && <LocaleSwitcher />}
            {mounted && (
              <button
                onClick={toggleTheme}
                className='dark:bg-dark-800 dark:hover:bg-dark-700 cursor-pointer rounded-lg bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200'
                aria-label={t('toggleTheme')}
              >
                {theme === 'dark' ? (
                  <Sun className='h-5 w-5 text-gray-700 dark:text-gray-300' />
                ) : (
                  <Moon className='h-5 w-5 text-gray-700 dark:text-gray-300' />
                )}
              </button>
            )}
            <Link href='/download' className='btn btn-primary hidden md:inline-flex'>
              <Download className='mr-2 h-4 w-4' />
              {t('download')}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200 lg:hidden'
              aria-label={t('toggleMenu')}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6 text-gray-700 dark:text-gray-300' />
              ) : (
                <Menu className='h-6 w-6 text-gray-700 dark:text-gray-300' />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
              className='overflow-hidden lg:hidden'
            >
              <div className='dark:bg-dark-900/95 mt-2 space-y-1 rounded-lg border border-gray-200/20 bg-white/95 py-2 backdrop-blur-md dark:border-white/10'>
                {primaryNav.map((item, index) => {
                  if (item.kind === 'group') {
                    return (
                      <motion.div
                        key='learn'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <LearnMobileSection pathname={pathname} onItemClick={closeMenu} />
                      </motion.div>
                    )
                  }
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          'block px-4 py-2 text-base font-medium transition-colors duration-200',
                          pathname === item.href
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'hover:text-primary-600 dark:hover:bg-dark-800 dark:hover:text-primary-400 text-gray-700 hover:bg-gray-50 dark:text-gray-300'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: primaryNav.length * 0.03 }}
                  className='px-4 pt-2'
                >
                  <Link href='/download' onClick={closeMenu} className='btn btn-primary w-full'>
                    <Download className='mr-2 h-4 w-4' />
                    {t('download')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
```

The flat "Academy" link is removed — it now lives inside the Learn dropdown.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/header/header.tsx
git commit -m "feat(header): replace Academy link with Learn dropdown (desktop + mobile)"
```

---

## Task 19: Verification gates and manual smoke test

**Files:** none modified.

- [ ] **Step 1: Run full type check**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
yarn type-check
```

Expected: PASS, no errors.

- [ ] **Step 2: Run lint**

```bash
yarn lint
```

Expected: PASS. If errors, run `yarn lint:fix` and re-run.

- [ ] **Step 3: Run full test suite**

```bash
yarn test
```

Expected: all suites green, including the new glossary tests.

- [ ] **Step 4: Run translation checker**

```bash
npx tsx scripts/check-translations.ts
```

Expected: clean exit.

- [ ] **Step 5: Production build**

```bash
yarn build
```

Expected: successful build. Pay attention to:
- The "Generating static pages" line — should show 14 locales × (1 glossary index + ~2,000 detail) ≈ 28k additional pages.
- Build time delta vs. previous build — should not exceed +60 s. If it does, this gets investigated in a follow-up task (not blocking).

- [ ] **Step 6: Local dev server — manual smoke test**

```bash
yarn dev
```

Verify each item, **noting any failures and fixing before continuing**:

1. `http://localhost:3005/en/glossary` — loads; 2,000+ cards visible; first letter section is "#" (numerics); A through Z sections present.
2. Search "seed" — filters to a handful of results, no observable lag.
3. Click "Seed Phrase" (or any entry) — lands on `/en/glossary/seed-phrase` with the full excerpt.
4. "← Back to glossary" link — returns to index.
5. Letter index — click "B" → page scrolls smoothly to `#letter-B`.
6. `http://localhost:3005/es/glossary` — Spanish chrome, English content, "El contenido del glosario se muestra en inglés…" banner visible under H1.
7. Hover "Learn ▾" in desktop header — dropdown opens; shows Academy, Series, Glossary with icons + descriptions.
8. Keyboard nav: Tab to Learn trigger, Enter to open, arrow keys, Esc to close — all work.
9. Resize to mobile width (≤ 1024 px), open hamburger — "Learn" subsection visible with Academy / Series / Glossary indented under it.
10. Visit `/en/glossary` and check the Learn trigger renders in primary color (active state).
11. Visit `/en/academy/security/<some-existing-slug>` — Learn trigger still active (descendant match).
12. Visit `/en/newsroom` — Learn trigger renders inactive.

- [ ] **Step 7: Final consolidating commit (if any tweaks were needed)**

If any small fixes were required during the smoke test:

```bash
git status
git diff
git add -A
git commit -m "fix(glossary): smoke-test corrections"
```

Otherwise skip.

- [ ] **Step 8: Push the branch**

```bash
git push origin feat/newsroom-academy-app-router-migration
```

The branch is now ready for the dev box: `cd /root/ssp-website-dev && git pull && yarn install && yarn build && pm2 restart ssp-website`. Once it serves the new pages cleanly, this sub-project is shipped and sub-project 2 (auto-linker + intro-article fix + missing-article authoring) opens its own brainstorm.

---

## Spec coverage check

| Spec section | Tasks |
|---|---|
| Entry shape | Task 1 |
| Source files (cmc + ssp-curated + web-sourced) | Tasks 2, 3, 4 |
| Web-sourcing script | Task 4 |
| Slug normalization | Task 1 |
| Merger with SSP > CMC > web precedence | Task 5 |
| Index page server rendering | Task 9 |
| `glossary-search.tsx` client island | Task 8 |
| `letter-index.tsx` client island | Task 7 |
| `glossary-entry-card.tsx` server component | Task 6 |
| `/glossary/[slug]` detail page | Task 10 |
| Locale handling + English-content banner | Tasks 9, 10, 11, 12 |
| `Glossary.*` translation keys (14 locales) | Tasks 11, 12 |
| `Header.learn*` + `Header.series` keys (14 locales) | Tasks 16, 17 |
| shadcn `navigation-menu.tsx` wrapper | Task 13 |
| Desktop `LearnDropdown` | Task 14 |
| Mobile `LearnMobileSection` | Task 15 |
| Header restructure to discriminated `NavItem` union | Task 18 |
| Vitest unit tests | Tasks 1, 5, 8, 14 |
| Build + lint + type-check + translation gate | Task 19 |
| Manual smoke test | Task 19 |
| Performance fallback (lazy letter sections) | Mentioned in spec, only applied if smoke test regresses |
| `.glossary-cache/` gitignore | Task 4 |

No spec gaps. All decisions surface in tasks. The "Appears in articles" slot on detail pages is intentionally empty per spec — sub-project 2 fills it.
