# Glossary Auto-Linker Retarget + Foundational Academy Articles — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retarget the existing academy auto-linker to a two-tier (curated + 2,157-entry glossary fallback) implementation with a per-article cap, wire it into newsroom as well as academy, author the 8 foundational academy articles the curated tier wants to link to, and surgically fix the two stub anchors in the existing intro article body.

**Architecture:** The linker stays a pure function over markdown. A new server-only helper `auto-link-post-content.ts` composes the curated map (20 entries) with a fallback map derived from `GLOSSARY` (2,157 entries minus stop-words and short labels) and calls the linker with `maxLinks: 8`. The 8 articles ship through the existing `generate-article` skill (English draft → 14-locale translation → admin-API POST with auto-generated cover). The intro-article fix is a one-shot idempotent TypeScript script that rewrites two bare category anchors to specific deep-article anchors, then PUTs the result back through the admin API.

**Tech Stack:** TypeScript 5.9, Next.js 16, next-intl 4.9, React 19, react-markdown 10, remark-gfm, Vitest 4, happy-dom, the `generate-article` Claude skill (lives in `ssp-cms-backend/.claude/skills/generate-article/`), `scripts/generate-cover.py`.

**Branch:** `feat/newsroom-academy-app-router-migration` (continuing from `e3e5b48`). No new branch, no new PR — consistent with sub-project 1's "same branches" precedent.

**Spec:** [`docs/superpowers/specs/2026-05-13-glossary-autolinker-and-foundational-articles-design.md`](../specs/2026-05-13-glossary-autolinker-and-foundational-articles-design.md)

**Repository:** All file paths in this plan are in `/Users/vasilismagkoutis/repos/ssp-website` unless explicitly stated otherwise.

---

## File Inventory

**Files to create:**

- `src/lib/build-fallback-term-map.ts` — derives the fallback `Map<string, GlossaryTerm>` from the 2,157-entry `GLOSSARY`, filters short labels + stop-words + curated overlap.
- `src/lib/build-fallback-term-map.test.ts` — unit tests for the filter pipeline.
- `src/lib/auto-link-post-content.ts` — server-only seam used by both academy and newsroom pages. Composes curated + fallback maps, calls `autoLinkContent` with `maxLinks: 8`.
- `src/lib/auto-link-post-content.test.ts` — integration test over a realistic post body.
- `scripts/fix-intro-stubs.ts` — one-shot script that rewrites bare `/academy/getting-started` and `/academy/multisig` anchors to deep-article anchors, idempotent.
- `docs/article-publish-logs/2026-05-13-<slug>.md` — one publish-receipt per article (8 files).

**Files to modify:**

- `src/lib/glossary-linker.ts` — extend signature with an options object (`maxLinks`, `fallbackTermMap`), update iteration to merge tiers and enforce cap.
- `src/lib/glossary-linker.test.ts` — add 6 new tests for the two-tier behavior and cap.
- `src/app/[locale]/academy/[category]/[slug]/page.tsx` — replace inline `autoLinkContent` call (line 98–99) with `autoLinkPostContent`. Drop unused imports.
- `src/app/[locale]/newsroom/[slug]/page.tsx` — compute `linkedContent` via `autoLinkPostContent` and pass as the `content` prop to `PostArticle`.

**Files NOT to modify (intentional):**

- `src/lib/academy-terms.ts` — the curated 20 stays as-is; map composition happens in the new helper.
- `src/components/shared/post-article.tsx` — the renderer already accepts an optional `content` override (line 178 in current file). No changes needed.
- `src/app/[locale]/glossary/[slug]/page.tsx` — glossary detail stays plain (per spec Section 3, definitions don't auto-link).

---

## Task 1: Extend `autoLinkContent` signature with options object

**Files:**
- Modify: `src/lib/glossary-linker.ts`
- Test: `src/lib/glossary-linker.test.ts`

This task changes the linker's signature in a backward-compatible way. Existing callers (currently the academy page) still work because all new parameters live under an optional `options` object and `maxLinks` defaults to `Infinity`.

- [ ] **Step 1: Add the failing test for the options object**

Add this block to `src/lib/glossary-linker.test.ts` immediately after the existing `describe('autoLinkContent', () => {` opening line so the new tests live inside the same `describe`. Append above the closing `})`:

```typescript
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
    const fallback: GlossaryTerm[] = [
      { term: 'merkle', definition: '', href: '/glossary/merkle' },
    ]
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
    // All 4 primary linked; only 4 of 5 fallback fit.
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
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `npx vitest run src/lib/glossary-linker.test.ts`

Expected: the 6 new tests FAIL with messages like `Expected 8, Received 20` (cap not enforced), `Expected output to contain "[merkle](/glossary/merkle)"` (fallback ignored). The 9 pre-existing tests continue to pass.

- [ ] **Step 3: Update the linker implementation to the new signature**

Replace the entire content of `src/lib/glossary-linker.ts` with:

```typescript
import type { GlossaryTerm } from './academy-terms'

const SKIP_PATTERN = /```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\[[^\]]+\]\[[^\]]*\]/g

function maskedToken(index: number): string {
  return `\x01PH${index}\x01`
}

export interface AutoLinkOptions {
  /** Maximum number of links to inject across both maps. Defaults to Infinity. */
  maxLinks?: number
  /** Lower-priority term map consulted after `termMap`. Same shape and semantics. */
  fallbackTermMap?: Map<string, GlossaryTerm>
}

interface TieredKey {
  key: string
  tier: 0 | 1
}

export function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>,
  options: AutoLinkOptions = {}
): string {
  const { maxLinks = Infinity, fallbackTermMap } = options
  const placeholders: string[] = []
  let masked = content.replace(SKIP_PATTERN, m => {
    placeholders.push(m)
    return maskedToken(placeholders.length - 1)
  })

  // Build a tiered iteration list: primary keys first (tier 0), then any
  // fallback key that is not already present in the primary map (tier 1).
  // Sort by length desc; ties broken by tier asc so the primary tier wins
  // when a key happens to exist in both maps.
  const keys: TieredKey[] = [...termMap.keys()].map(key => ({ key, tier: 0 as const }))
  if (fallbackTermMap) {
    for (const key of fallbackTermMap.keys()) {
      if (!termMap.has(key)) keys.push({ key, tier: 1 })
    }
  }
  keys.sort((a, b) => {
    if (b.key.length !== a.key.length) return b.key.length - a.key.length
    return a.tier - b.tier
  })

  let linkCount = 0
  for (const { key, tier } of keys) {
    if (linkCount >= maxLinks) break
    const term = tier === 0 ? termMap.get(key) : fallbackTermMap?.get(key)
    if (!term) continue
    if (term.href.endsWith(`/${selfSlug}`) || term.href.includes(`/${selfSlug}#`)) continue
    const escaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const pattern = new RegExp(`\\b(${escaped})\\b`, 'i')
    if (!pattern.test(masked)) continue
    masked = masked.replace(pattern, matchText => {
      placeholders.push(`[${matchText}](${term.href})`)
      return maskedToken(placeholders.length - 1)
    })
    linkCount++
  }

  // eslint-disable-next-line no-control-regex -- intentional sentinel chars that cannot appear in normal Markdown
  return masked.replace(/\x01PH(\d+)\x01/g, (_, i) => placeholders[Number(i)])
}
```

- [ ] **Step 4: Run all linker tests**

Run: `npx vitest run src/lib/glossary-linker.test.ts`

Expected: all 15 tests pass (9 original + 6 new). If any of the original 9 fail, the new implementation broke back-compat — re-check that single-map callers behave identically (no options object means `maxLinks: Infinity` and no fallback).

- [ ] **Step 5: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint src/lib/glossary-linker.ts src/lib/glossary-linker.test.ts`

Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add src/lib/glossary-linker.ts src/lib/glossary-linker.test.ts
git commit -m 'refactor(glossary-linker): accept maxLinks and fallback term map'
```

---

## Task 2: Add `buildFallbackTermMap` helper

**Files:**
- Create: `src/lib/build-fallback-term-map.ts`
- Test: `src/lib/build-fallback-term-map.test.ts`

This task introduces the function that derives a fallback term map from the 2,157-entry `GLOSSARY` constant, filtering out short labels, stop-words, and any term already in the curated map.

- [ ] **Step 1: Write the failing test**

Create `src/lib/build-fallback-term-map.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { buildFallbackTermMap, STOP_WORDS } from './build-fallback-term-map'

describe('buildFallbackTermMap', () => {
  it('returns a Map keyed by lowercase term title', () => {
    const map = buildFallbackTermMap(new Set())
    expect(map.size).toBeGreaterThan(100)
    for (const key of map.keys()) {
      expect(key).toBe(key.toLowerCase())
    }
  })

  it('excludes terms whose label is shorter than 3 characters', () => {
    const map = buildFallbackTermMap(new Set())
    for (const key of map.keys()) {
      expect(key.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('excludes stop-words even if they appear in the source glossary', () => {
    const map = buildFallbackTermMap(new Set())
    for (const stop of STOP_WORDS) {
      expect(map.has(stop)).toBe(false)
    }
  })

  it('excludes terms whose lowercased label is in the curated set', () => {
    const curated = new Set(['bitcoin', 'ethereum'])
    const map = buildFallbackTermMap(curated)
    expect(map.has('bitcoin')).toBe(false)
    expect(map.has('ethereum')).toBe(false)
  })

  it('entries point at /glossary/<slug>', () => {
    const map = buildFallbackTermMap(new Set())
    for (const term of map.values()) {
      expect(term.href).toMatch(/^\/glossary\/[\w-]+$/)
    }
  })

  it('STOP_WORDS contains the common prose noise list', () => {
    const expected = [
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
    ]
    for (const word of expected) {
      expect(STOP_WORDS.has(word)).toBe(true)
    }
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/build-fallback-term-map.test.ts`

Expected: FAIL with `Cannot find module './build-fallback-term-map'`.

- [ ] **Step 3: Implement the helper**

Create `src/lib/build-fallback-term-map.ts`:

```typescript
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
 * Memoized per curated fingerprint — call sites typically pass the same
 * curated key set on every server render.
 */
export function buildFallbackTermMap(
  curatedLowercaseKeys: ReadonlySet<string>
): Map<string, GlossaryTerm> {
  const fp = curatedFingerprint(curatedLowercaseKeys)
  if (cached && cachedCuratedKey === fp) return cached

  const map = new Map<string, GlossaryTerm>()
  for (const entry of GLOSSARY) {
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/build-fallback-term-map.test.ts`

Expected: 6 tests pass.

- [ ] **Step 5: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint src/lib/build-fallback-term-map.ts src/lib/build-fallback-term-map.test.ts`

Expected: no errors, no warnings.

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add src/lib/build-fallback-term-map.ts src/lib/build-fallback-term-map.test.ts
git commit -m 'feat(glossary-linker): add buildFallbackTermMap helper'
```

---

## Task 3: Add `autoLinkPostContent` server helper

**Files:**
- Create: `src/lib/auto-link-post-content.ts`
- Test: `src/lib/auto-link-post-content.test.ts`

This is the single seam used by both academy and newsroom pages. It composes the curated map (`getTermMap()` from `academy-terms.ts`) with the fallback map (`buildFallbackTermMap`) and calls `autoLinkContent` with the agreed `maxLinks: 8`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/auto-link-post-content.test.ts`:

```typescript
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
    // "Merkle tree" exists in the 2,157-entry glossary but is NOT in the
    // 20-entry curated list, so the fallback tier should pick it up.
    const body = 'The merkle tree is a cryptographic structure used in blockchains.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    expect(out).toMatch(/\[merkle tree\]\(\/glossary\/[\w-]+\)/i)
  })

  it('caps total links at MAX_LINKS_PER_POST', () => {
    // Construct a body with many linkable terms; assert at most 8 links emerge.
    const body =
      'multisig bitcoin ethereum seed phrase BIP48 BIP39 ERC-4337 gas mempool finality ' +
      'self-custody hardware wallet private key public key signer threshold WalletConnect.'
    const out = autoLinkPostContent(body, 'unrelated-slug')
    const links = out.match(/\[[^\]]+\]\([^)]+\)/g) ?? []
    expect(links.length).toBeLessThanOrEqual(8)
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
    // When we render `/academy/multisig/what-is-2-of-2-multisig`, the word
    // "multisig" in its own body should NOT auto-link back to the same page.
    const body = 'A multisig wallet requires multiple signatures.'
    const out = autoLinkPostContent(body, 'what-is-2-of-2-multisig')
    expect(out).not.toContain('[multisig](')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/auto-link-post-content.test.ts`

Expected: FAIL with `Cannot find module './auto-link-post-content'`.

- [ ] **Step 3: Implement the helper**

Create `src/lib/auto-link-post-content.ts`:

```typescript
import { getTermMap } from './academy-terms'
import { buildFallbackTermMap } from './build-fallback-term-map'
import { autoLinkContent } from './glossary-linker'

export const MAX_LINKS_PER_POST = 8

let cachedCurated: ReturnType<typeof getTermMap> | null = null
let cachedFallback: ReturnType<typeof buildFallbackTermMap> | null = null

function getCuratedMap(): ReturnType<typeof getTermMap> {
  if (!cachedCurated) cachedCurated = getTermMap()
  return cachedCurated
}

function getFallbackMap(): ReturnType<typeof buildFallbackTermMap> {
  if (!cachedFallback) {
    const curated = getCuratedMap()
    cachedFallback = buildFallbackTermMap(new Set(curated.keys()))
  }
  return cachedFallback
}

/**
 * Auto-links a post body using both the curated academy term map and the
 * 2,157-entry glossary as a fallback. Caps total inline links at
 * `MAX_LINKS_PER_POST` to avoid link-soup prose.
 *
 * Server-only — runs during SSR / generateStaticParams. The composed maps are
 * memoized at module scope; rebuilding them on every request would re-walk the
 * full glossary unnecessarily.
 */
export function autoLinkPostContent(content: string, selfSlug: string): string {
  return autoLinkContent(content, selfSlug, getCuratedMap(), {
    maxLinks: MAX_LINKS_PER_POST,
    fallbackTermMap: getFallbackMap(),
  })
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/auto-link-post-content.test.ts`

Expected: 6 tests pass.

If the "merkle tree" fallback assertion fails, the 2,157-entry glossary may not include "merkle tree" as a separate entry. In that case adjust the assertion to use a known-present glossary entry (run `node -e "const g=require('./src/constants/glossary/index.ts');console.log(g.GLOSSARY.slice(0,30).map(e=>e.title))"` if needed — but `merkle tree` is a Wikipedia-sourced term and should be present from sub-project 1's web-sourced layer).

- [ ] **Step 5: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint src/lib/auto-link-post-content.ts src/lib/auto-link-post-content.test.ts`

Expected: no errors. If `server-only` import warns, confirm `next` is in `dependencies` (it is — `next ~16.2.4`).

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add src/lib/auto-link-post-content.ts src/lib/auto-link-post-content.test.ts
git commit -m 'feat(glossary-linker): add auto-link-post-content server helper'
```

---

## Task 4: Wire helper into the academy article page

**Files:**
- Modify: `src/app/[locale]/academy/[category]/[slug]/page.tsx:11-14, 98-99`

This task replaces the inline `getTermMap()` + `autoLinkContent(...)` calls with a single `autoLinkPostContent(...)` call.

- [ ] **Step 1: Apply the edit**

In `src/app/[locale]/academy/[category]/[slug]/page.tsx`:

Replace the imports block (lines 11–14):

```typescript
import { getTermMap } from '@/lib/academy-terms'
import { getAcademyPostBySlug, getAcademySlugs, getAuthorBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
import { autoLinkContent } from '@/lib/glossary-linker'
```

with:

```typescript
import { autoLinkPostContent } from '@/lib/auto-link-post-content'
import { getAcademyPostBySlug, getAcademySlugs, getAuthorBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
```

(Imports remain alphabetized — `auto-link-post-content` precedes `cms`.)

Replace the body block (lines 98–99):

```typescript
  const termMap = getTermMap()
  const linkedContent = autoLinkContent(post.content, post.slug, termMap)
```

with:

```typescript
  const linkedContent = autoLinkPostContent(post.content, post.slug)
```

- [ ] **Step 2: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint 'src/app/[locale]/academy/[category]/[slug]/page.tsx'`

Expected: no errors.

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`

Expected: all tests pass — the page-level edit doesn't affect any test directly, but the change should not break existing tests.

- [ ] **Step 4: Smoke test (manual)**

Start the dev server in a separate terminal: `npm run dev`

Then `curl -sS http://localhost:3000/en/academy/multisig/what-is-2-of-2-multisig | head -20` — this URL will 404 until Task 6 completes (the article doesn't exist yet). For now, just confirm the dev server starts without compile errors. Look for `✓ Compiled` in the dev-server output.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add 'src/app/[locale]/academy/[category]/[slug]/page.tsx'
git commit -m 'refactor(academy): use auto-link-post-content helper'
```

---

## Task 5: Wire helper into the newsroom article page

**Files:**
- Modify: `src/app/[locale]/newsroom/[slug]/page.tsx`

This task adds the same `autoLinkPostContent` call to the newsroom article page. Newsroom currently doesn't pass a `content` prop, so `PostArticle` falls back to `post.content`. After this task, `PostArticle` receives the linked content explicitly.

- [ ] **Step 1: Apply the edit**

In `src/app/[locale]/newsroom/[slug]/page.tsx`:

Add the import after line 10 (`import type { LocalizedPaths } ...`). Keep the import block alphabetized — `auto-link-post-content` precedes `cms`:

Replace the imports section (lines 7–11):

```typescript
import { routing, type Locale } from '@/i18n/routing'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
import type { LocalizedPaths } from '@/lib/i18n/localized-paths'
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, siteUrl } from '@/lib/seo'
```

with:

```typescript
import { routing, type Locale } from '@/i18n/routing'
import { autoLinkPostContent } from '@/lib/auto-link-post-content'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
import type { LocalizedPaths } from '@/lib/i18n/localized-paths'
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, siteUrl } from '@/lib/seo'
```

Then, in the `NewsroomArticlePage` component body, after the existing `const relatedPosts = await getRelatedPosts(post)` line (currently line 78), insert:

```typescript
  const linkedContent = autoLinkPostContent(post.content, post.slug)
```

Then in the `<PostArticle ... />` JSX block (currently lines 115–120), add the `content` prop:

Replace:

```tsx
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref='/newsroom'
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
```

with:

```tsx
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref='/newsroom'
        content={linkedContent}
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
```

- [ ] **Step 2: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint 'src/app/[locale]/newsroom/[slug]/page.tsx'`

Expected: no errors.

- [ ] **Step 3: Run all tests**

Run: `npx vitest run`

Expected: all tests pass.

- [ ] **Step 4: Smoke test (manual)**

Start dev server: `npm run dev`

Then `curl -sS http://localhost:3000/en/newsroom | head -40` — confirm the newsroom index renders (200). Pick a published newsroom post slug visible in the listing and `curl -sS http://localhost:3000/en/newsroom/<slug> | grep -oE 'href="/(academy|glossary)/[^"]*"' | head -10` — confirm at least one auto-linked href appears (academy or glossary). If no terms in the post body match anything in the curated 20 or the 2,157-entry glossary, this will return empty — that's acceptable for small posts. Try a longer/more technical post for a clearer signal.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add 'src/app/[locale]/newsroom/[slug]/page.tsx'
git commit -m 'feat(newsroom): apply glossary auto-linker to newsroom articles'
```

---

## Task 6: Publish article 1 — `multisig/what-is-2-of-2-multisig`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-what-is-2-of-2-multisig.md`

This task drafts and publishes the first foundational article using the `generate-article` Claude skill. The skill handles English drafting, 14-locale translation, SSP-brand cover generation, and the admin-API POST.

**Required anchor ids in the article body:** `#bip48`, `#signer`, `#threshold`, `#2-of-2`. The curated map in `academy-terms.ts` deep-links to these.

- [ ] **Step 1: Verify the publishing environment**

Run:

```bash
[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING SSP_CMS_INTERNAL_API_KEY"
echo "SSP_CMS_BASE_URL=${SSP_CMS_BASE_URL:-http://localhost:3007}"
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/admin/authors" -H "x-internal-key: $SSP_CMS_INTERNAL_API_KEY" -H "x-user-role: admin" -H "x-user-email: info@bbsolutions.services"
```

Expected: `key set`, the base URL, and `200` from the admin endpoint. If anything fails, fix it before invoking the skill.

- [ ] **Step 2: Confirm or create the `SSP Editorial Team` author record**

Run:

```bash
curl -sS "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/admin/authors" -H "x-internal-key: $SSP_CMS_INTERNAL_API_KEY" -H "x-user-role: admin" -H "x-user-email: info@bbsolutions.services" | grep -o '"name":"[^"]*"' | head -20
```

If `"SSP Editorial Team"` does NOT appear in the output, create it:

```bash
curl -sS -X POST "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/admin/authors" \
  -H "x-internal-key: $SSP_CMS_INTERNAL_API_KEY" \
  -H "x-user-role: admin" \
  -H "x-user-email: info@bbsolutions.services" \
  -H "content-type: application/json" \
  -d '{"name":"SSP Editorial Team","slug":"ssp-editorial-team","bio":"The editorial team at SSP Wallet writes about multisig, self-custody, and the chains SSP supports."}'
```

Expected: HTTP 201 with the new author record. Note the returned `id` or `slug` (we will reuse it for all 8 articles).

- [ ] **Step 3: Invoke the `generate-article` skill**

In your driver agent (or via the `/skill` mechanism in your runtime), invoke `generate-article` with these inputs. The skill will drive the rest of the interactive flow (drafting English, translating, generating cover, POSTing).

Inputs to provide to the skill:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `multisig` |
| Working title | `What is 2-of-2 multisig?` |
| Target word count | `1400` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Diagram of a 2-of-2 multisig wallet showing two signers approving one transaction` |
| Translations | All 14 Wave 1 locales (`en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id`) |

**Drafting constraints to pass to the skill (paste verbatim into the topic prompt):**

> Article must define BIP48, signer, threshold, and the 2-of-2 model. The English body must contain `<span id="bip48"></span>`, `<span id="signer"></span>`, `<span id="threshold"></span>`, and `<span id="2-of-2"></span>` placed near the first mention of each concept. These ids are required by the auto-linker. The article should explain: why 2-of-2 removes the single-point-of-failure of a 12-word seed, what attacker scenarios (phishing, malware, lost device, physical coercion) are handled by which signer, and how BIP48 differs from BIP44. Audience is technically curious users, not engineers — concrete examples beat abstract proofs. End with a transition to the SSP setup walkthrough at `/academy/getting-started/setting-up-your-first-ssp-wallet`.

- [ ] **Step 4: Verify the publish succeeded**

Once the skill reports success, capture the returned post id. Then:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/what-is-2-of-2-multisig"
```

Expected: `200`.

- [ ] **Step 5: Smoke test the rendered page**

Start dev server: `npm run dev`

Then in another terminal:

```bash
curl -sS http://localhost:3000/en/academy/multisig/what-is-2-of-2-multisig | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/ja/academy/multisig/what-is-2-of-2-multisig | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/multisig/what-is-2-of-2-multisig | grep -c 'id="bip48"\|id="signer"\|id="threshold"\|id="2-of-2"'
```

Expected:
- English `<h1>` contains the title.
- Japanese `<h1>` contains the translated title.
- The anchor count is at least 4 (one match per required id).

Stop the dev server.

- [ ] **Step 6: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-what-is-2-of-2-multisig.md`:

```markdown
# Publish log — what-is-2-of-2-multisig

- **Date:** 2026-05-13
- **Section / category:** academy / multisig
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** #bip48, #signer, #threshold, #2-of-2
- **Smoke test:**
  - `GET /en/academy/multisig/what-is-2-of-2-multisig` — 200
  - `GET /ja/academy/multisig/what-is-2-of-2-multisig` — 200
  - Required anchor ids present in rendered HTML — verified
```

- [ ] **Step 7: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-what-is-2-of-2-multisig.md
git commit -m 'feat(academy): publish what-is-2-of-2-multisig'
```

---

## Task 7: Publish article 2 — `security/seed-phrase-best-practices`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-seed-phrase-best-practices.md`

**Required anchor ids:** `#bip39`, `#bip32`, `#hot-wallet`, `#cold-wallet`, `#hardware-wallet`, `#private-key`, `#public-key`.

- [ ] **Step 1: Verify env (same as Task 6 Step 1)**

Run:

```bash
[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING SSP_CMS_INTERNAL_API_KEY"
```

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `security` |
| Working title | `Seed phrase best practices` |
| Target word count | `1400` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Twelve-word seed phrase printed on a paper card next to a hardware wallet` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Article must explain BIP39 (mnemonic seed phrase standard) and BIP32 (hierarchical-deterministic derivation) and define hot wallet, cold wallet, hardware wallet, private key, and public key. The English body must contain `<span id="bip39"></span>`, `<span id="bip32"></span>`, `<span id="hot-wallet"></span>`, `<span id="cold-wallet"></span>`, `<span id="hardware-wallet"></span>`, `<span id="private-key"></span>`, and `<span id="public-key"></span>` placed near the first mention of each concept. These ids are required by the auto-linker. Cover: how to store a seed phrase safely (paper vs metal vs cloud), do/don't checklist, the threat model for each storage method, how SSP's 2-of-2 model means a single leaked seed is not catastrophic. Audience is concerned users who hold non-trivial crypto, not engineers.

- [ ] **Step 3: Verify the publish succeeded**

Run:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/seed-phrase-best-practices"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

Start dev server: `npm run dev`

```bash
curl -sS http://localhost:3000/en/academy/security/seed-phrase-best-practices | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/zh/academy/security/seed-phrase-best-practices | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/security/seed-phrase-best-practices | grep -c 'id="bip39"\|id="bip32"\|id="hot-wallet"\|id="cold-wallet"\|id="hardware-wallet"\|id="private-key"\|id="public-key"'
```

Expected: English and Chinese h1 contain the title; anchor count is at least 7.

Stop the dev server.

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-seed-phrase-best-practices.md`:

```markdown
# Publish log — seed-phrase-best-practices

- **Date:** 2026-05-13
- **Section / category:** academy / security
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** #bip39, #bip32, #hot-wallet, #cold-wallet, #hardware-wallet, #private-key, #public-key
- **Smoke test:**
  - `GET /en/academy/security/seed-phrase-best-practices` — 200
  - `GET /zh/academy/security/seed-phrase-best-practices` — 200
  - Required anchor ids present in rendered HTML — verified
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-seed-phrase-best-practices.md
git commit -m 'feat(academy): publish seed-phrase-best-practices'
```

---

## Task 8: Publish article 3 — `getting-started/setting-up-your-first-ssp-wallet`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-setting-up-your-first-ssp-wallet.md`

**Required anchor ids:** `#gas`, `#mempool`, `#finality`.

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `getting-started` |
| Working title | `Setting up your first SSP wallet` |
| Target word count | `1200` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Step-by-step illustration of an SSP wallet being set up on a phone and a browser` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Step-by-step walkthrough format. The English body must contain `<span id="gas"></span>`, `<span id="mempool"></span>`, and `<span id="finality"></span>` placed near the first mention of each concept. These ids are required by the auto-linker. Walk the reader through: installing the SSP mobile app, installing the SSP browser extension, pairing the two devices, generating the 2-of-2 wallet, sending the first test transaction. At the "first transaction" step, define gas (the fee paid to validators), mempool (where the transaction waits), and finality (when it is irreversibly confirmed). Audience is a complete beginner who has never held crypto.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/setting-up-your-first-ssp-wallet"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/getting-started/setting-up-your-first-ssp-wallet | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/de/academy/getting-started/setting-up-your-first-ssp-wallet | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/getting-started/setting-up-your-first-ssp-wallet | grep -c 'id="gas"\|id="mempool"\|id="finality"'
kill %1
```

Expected: English and German h1 contain the title; anchor count is at least 3.

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-setting-up-your-first-ssp-wallet.md`:

```markdown
# Publish log — setting-up-your-first-ssp-wallet

- **Date:** 2026-05-13
- **Section / category:** academy / getting-started
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** #gas, #mempool, #finality
- **Smoke test:**
  - `GET /en/academy/getting-started/setting-up-your-first-ssp-wallet` — 200
  - `GET /de/academy/getting-started/setting-up-your-first-ssp-wallet` — 200
  - Required anchor ids present in rendered HTML — verified
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-setting-up-your-first-ssp-wallet.md
git commit -m 'feat(academy): publish setting-up-your-first-ssp-wallet'
```

---

## Task 9: Publish article 4 — `security/why-self-custody-matters-now`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-why-self-custody-matters-now.md`

No required anchor ids — the linker references this article as the destination for the bare term "self-custody".

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `security` |
| Working title | `Why self-custody matters now` |
| Target word count | `1000` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `A vault icon shielding a user wallet from an exchange logo, indicating self-custody` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Threat-modelled "why not exchanges" piece. Cover: the historic pattern of exchange failures (Mt. Gox 2014, FTX 2022 — primary-sourced and date-stamped, no speculation about ongoing matters), what specifically goes wrong when an exchange is custodian (commingled funds, rehypothecation, freezes), how a 2-of-2 multisig like SSP shifts the threat model (no single point of failure even on user side), and the practical trade-off (you are now responsible for your seed). No required anchor ids. Audience is a user who has crypto on an exchange and is considering self-custody.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/why-self-custody-matters-now"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/security/why-self-custody-matters-now | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/fr/academy/security/why-self-custody-matters-now | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
kill %1
```

Expected: English and French h1 contain the title.

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-why-self-custody-matters-now.md`:

```markdown
# Publish log — why-self-custody-matters-now

- **Date:** 2026-05-13
- **Section / category:** academy / security
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** (none required)
- **Smoke test:**
  - `GET /en/academy/security/why-self-custody-matters-now` — 200
  - `GET /fr/academy/security/why-self-custody-matters-now` — 200
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-why-self-custody-matters-now.md
git commit -m 'feat(academy): publish why-self-custody-matters-now'
```

---

## Task 10: Publish article 5 — `defi/what-is-account-abstraction-erc-4337`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-what-is-account-abstraction-erc-4337.md`

No required anchor ids — the curated map references the article URL without anchors for "ERC-4337" and "account abstraction".

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `defi` |
| Working title | `What is account abstraction (ERC-4337)?` |
| Target word count | `1300` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Smart-contract wallet diagram with a UserOperation flowing through a bundler` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Non-engineer explainer of ERC-4337. Cover: what was wrong with the pre-AA externally-owned-account model (one private key controls everything, no recovery, no batch transactions), what ERC-4337 introduces (UserOperation, EntryPoint, bundler, paymaster — define each in one sentence), and what AA enables in practice for SSP users (gas sponsorship, social recovery, session keys). Cite the EIP at https://eips.ethereum.org/EIPS/eip-4337 as the primary source. Compare AA to SSP's 2-of-2 BIP48 model — both eliminate single-key risk, but via different mechanisms. Audience is a DeFi-curious user who has heard "account abstraction" but doesn't know what it means.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/what-is-account-abstraction-erc-4337"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/defi/what-is-account-abstraction-erc-4337 | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/ko/academy/defi/what-is-account-abstraction-erc-4337 | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
kill %1
```

Expected: English and Korean h1 contain the title.

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-what-is-account-abstraction-erc-4337.md`:

```markdown
# Publish log — what-is-account-abstraction-erc-4337

- **Date:** 2026-05-13
- **Section / category:** academy / defi
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** (none required)
- **Smoke test:**
  - `GET /en/academy/defi/what-is-account-abstraction-erc-4337` — 200
  - `GET /ko/academy/defi/what-is-account-abstraction-erc-4337` — 200
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-what-is-account-abstraction-erc-4337.md
git commit -m 'feat(academy): publish what-is-account-abstraction-erc-4337'
```

---

## Task 11: Publish article 6 — `how-to/sending-bitcoin-with-ssp`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-sending-bitcoin-with-ssp.md`

**Required anchor id:** `#walletconnect`.

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `how-to` |
| Working title | `Sending Bitcoin with SSP` |
| Target word count | `1000` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Screenshot of the SSP send-Bitcoin screen with the second signer prompt visible on a phone` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Step-by-step how-to format. The English body must contain `<span id="walletconnect"></span>` placed near the first mention of WalletConnect. This id is required by the auto-linker. Walk the reader through: opening the wallet, selecting Bitcoin, entering the recipient address (with a note on address-poisoning hygiene), entering the amount, reviewing the fee, signing on the second device, watching the transaction broadcast. Briefly cover the WalletConnect alternative for sending from a connected dApp. Avoid prose between numbered steps — each step is a single action with one screenshot description.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/sending-bitcoin-with-ssp"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/how-to/sending-bitcoin-with-ssp | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/vi/academy/how-to/sending-bitcoin-with-ssp | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/how-to/sending-bitcoin-with-ssp | grep -c 'id="walletconnect"'
kill %1
```

Expected: English and Vietnamese h1 contain the title; anchor count is at least 1.

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-sending-bitcoin-with-ssp.md`:

```markdown
# Publish log — sending-bitcoin-with-ssp

- **Date:** 2026-05-13
- **Section / category:** academy / how-to
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** #walletconnect
- **Smoke test:**
  - `GET /en/academy/how-to/sending-bitcoin-with-ssp` — 200
  - `GET /vi/academy/how-to/sending-bitcoin-with-ssp` — 200
  - Required anchor id present in rendered HTML — verified
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-sending-bitcoin-with-ssp.md
git commit -m 'feat(academy): publish sending-bitcoin-with-ssp'
```

---

## Task 12: Publish article 7 — `coin-guides/bitcoin-in-ssp`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-bitcoin-in-ssp.md`

This is a category-seed article. No required anchor ids.

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `coin-guides` |
| Working title | `Bitcoin in SSP` |
| Target word count | `1000` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `Bitcoin logo with the SSP wallet icon, both rendered in the SSP brand palette` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Per-asset deep dive for Bitcoin in SSP. Cover: a one-paragraph primer on what Bitcoin is (UTXO model, PoW consensus, ~10-minute blocks, fixed supply of 21M), how SSP supports Bitcoin (BIP48 2-of-2 multisig on the mainnet), how send/receive works in the SSP UX (with a pointer to the dedicated `sending-bitcoin-with-ssp` how-to), common pitfalls (address-poisoning, fee mis-estimation on a busy mempool, sending to wrong-format addresses), and a note on what SSP intentionally does not support (custom RBF, custom signatures outside BIP48). Audience is a user evaluating SSP for Bitcoin custody.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/bitcoin-in-ssp"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/coin-guides/bitcoin-in-ssp | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/pt-BR/academy/coin-guides/bitcoin-in-ssp | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/coin-guides | grep -c 'bitcoin-in-ssp'
kill %1
```

Expected: English and Brazilian-Portuguese h1 contain the title; the coin-guides hub page lists the article (count > 0).

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-bitcoin-in-ssp.md`:

```markdown
# Publish log — bitcoin-in-ssp

- **Date:** 2026-05-13
- **Section / category:** academy / coin-guides (seed article)
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** (none required)
- **Smoke test:**
  - `GET /en/academy/coin-guides/bitcoin-in-ssp` — 200
  - `GET /pt-BR/academy/coin-guides/bitcoin-in-ssp` — 200
  - Coin-guides hub now lists the article
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-bitcoin-in-ssp.md
git commit -m 'feat(academy): publish bitcoin-in-ssp'
```

---

## Task 13: Publish article 8 — `news-explained/what-is-on-chain-analytics`

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-what-is-on-chain-analytics.md`

Category-seed article. No required anchor ids.

- [ ] **Step 1: Verify env**

Run: `[ -n "$SSP_CMS_INTERNAL_API_KEY" ] && echo "key set" || echo "MISSING"`

Expected: `key set`.

- [ ] **Step 2: Invoke the `generate-article` skill**

Inputs:

| Field | Value |
|---|---|
| Section | `academy` |
| Category | `news-explained` |
| Working title | `What is on-chain analytics?` |
| Target word count | `1000` |
| Author | `SSP Editorial Team` |
| Featured image | Auto-generate via `scripts/generate-cover.py` |
| Image alt | `A blockchain explorer view showing transaction flows being grouped by entity` |
| Translations | All 14 Wave 1 locales |

**Drafting constraints:**

> Evergreen primer for the news-explained category. Cover: what on-chain analytics means (clustering addresses, labelling entities, following flows), who does it (Chainalysis, Arkham, Nansen — date-stamp and link to each as primary sources), what it does to user privacy (everything on-chain is permanently public; "pseudonymous" not "anonymous"), what SSP users can do (use new receiving addresses, avoid linking accounts via dust, prefer privacy-respecting chains where applicable). Audience is a privacy-curious user who has seen "on-chain analytics firm tracks..." headlines and wants to understand what that means for them.

- [ ] **Step 3: Verify the publish succeeded**

```bash
curl -sS -o /dev/null -w '%{http_code}\n' "${SSP_CMS_BASE_URL:-http://localhost:3007}/api/v1/posts/what-is-on-chain-analytics"
```

Expected: `200`.

- [ ] **Step 4: Smoke test**

```bash
npm run dev &
sleep 5
curl -sS http://localhost:3000/en/academy/news-explained/what-is-on-chain-analytics | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/it/academy/news-explained/what-is-on-chain-analytics | grep -oE '<h1[^>]*>[^<]*</h1>' | head -1
curl -sS http://localhost:3000/en/academy/news-explained | grep -c 'what-is-on-chain-analytics'
kill %1
```

Expected: English and Italian h1 contain the title; news-explained hub lists the article (count > 0).

- [ ] **Step 5: Write the publish log**

Create `docs/article-publish-logs/2026-05-13-what-is-on-chain-analytics.md`:

```markdown
# Publish log — what-is-on-chain-analytics

- **Date:** 2026-05-13
- **Section / category:** academy / news-explained (seed article)
- **CMS post id:** <fill in from skill output>
- **Author:** SSP Editorial Team
- **Translations published:** en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id (14)
- **Required anchors verified:** (none required)
- **Smoke test:**
  - `GET /en/academy/news-explained/what-is-on-chain-analytics` — 200
  - `GET /it/academy/news-explained/what-is-on-chain-analytics` — 200
  - News-explained hub now lists the article
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-what-is-on-chain-analytics.md
git commit -m 'feat(academy): publish what-is-on-chain-analytics'
```

---

## Task 14: Add the `fix-intro-stubs` one-shot script

**Files:**
- Create: `scripts/fix-intro-stubs.ts`

The script identifies the existing intro post on the CMS whose body contains bare `/academy/getting-started` or `/academy/multisig` anchors, prompts the operator for confirmation, rewrites all 14 translations, and PUTs them back. Idempotent.

- [ ] **Step 1: Create the script**

Create `scripts/fix-intro-stubs.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * One-shot script: re-point bare category-hub anchors in the intro article
 * body to the specific deep articles they were obviously meant to reference.
 *
 * Idempotent — anchors that already point at a deeper path are skipped.
 *
 * Env required:
 *   SSP_CMS_URL                 (defaults to http://localhost:3007)
 *   SSP_CMS_INTERNAL_API_KEY    (required)
 *
 * Usage:
 *   npx tsx scripts/fix-intro-stubs.ts
 */
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const BASE_URL = process.env.SSP_CMS_URL ?? 'http://localhost:3007'
const KEY = process.env.SSP_CMS_INTERNAL_API_KEY
const USER_EMAIL = process.env.SSP_CMS_USER_EMAIL ?? 'info@bbsolutions.services'

if (!KEY) {
  console.error('Missing SSP_CMS_INTERNAL_API_KEY')
  process.exit(1)
}

const STUB_RULES: Array<{ from: string; to: string }> = [
  {
    from: '](/academy/getting-started)',
    to: '](/academy/getting-started/setting-up-your-first-ssp-wallet)',
  },
  {
    from: '](/academy/multisig)',
    to: '](/academy/multisig/what-is-2-of-2-multisig)',
  },
]

interface Translation {
  locale: string
  body: string
  // Other fields exist on the CMS contract but are pass-through for this script.
  [key: string]: unknown
}

interface AdminPost {
  _id: string
  slug: string
  translations: Translation[]
  [key: string]: unknown
}

function adminHeaders(): Record<string, string> {
  return {
    'x-internal-key': KEY as string,
    'x-user-role': 'admin',
    'x-user-email': USER_EMAIL,
    'content-type': 'application/json',
  }
}

async function fetchAllPosts(): Promise<AdminPost[]> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/posts?status=published&limit=500`, {
    headers: adminHeaders(),
  })
  if (!res.ok) {
    throw new Error(`GET posts failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { posts?: AdminPost[] } | AdminPost[]
  return Array.isArray(data) ? data : (data.posts ?? [])
}

interface RewriteResult {
  body: string
  modifications: number
}

function rewriteBody(body: string): RewriteResult {
  let next = body
  let modifications = 0
  for (const rule of STUB_RULES) {
    const before = next
    next = next.split(rule.from).join(rule.to)
    if (next !== before) {
      modifications += before.split(rule.from).length - 1
    }
  }
  return { body: next, modifications }
}

function summarisePost(post: AdminPost): { hits: number; perLocale: Array<[string, number]> } {
  let hits = 0
  const perLocale: Array<[string, number]> = []
  for (const t of post.translations) {
    const r = rewriteBody(t.body)
    if (r.modifications > 0) {
      hits += r.modifications
      perLocale.push([t.locale, r.modifications])
    }
  }
  return { hits, perLocale }
}

async function putPost(post: AdminPost, newTranslations: Translation[]): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/posts/${post._id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ ...post, translations: newTranslations }),
  })
  if (!res.ok) {
    throw new Error(`PUT post ${post._id} failed: ${res.status} ${await res.text()}`)
  }
}

async function main() {
  console.log(`Scanning ${BASE_URL}/api/v1/admin/posts for stub anchors…`)
  const posts = await fetchAllPosts()
  const affected: Array<{
    post: AdminPost
    hits: number
    perLocale: Array<[string, number]>
  }> = []
  for (const post of posts) {
    const { hits, perLocale } = summarisePost(post)
    if (hits > 0) affected.push({ post, hits, perLocale })
  }
  if (affected.length === 0) {
    console.log('No posts contain bare /academy/getting-started or /academy/multisig anchors.')
    console.log('Nothing to do.')
    return
  }
  console.log(`\nFound ${affected.length} post(s) with stub anchors:\n`)
  for (const a of affected) {
    console.log(`  - ${a.post.slug} (${a.post._id}): ${a.hits} total`)
    for (const [loc, n] of a.perLocale) console.log(`      ${loc}: ${n}`)
  }
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (await rl.question('\nProceed? [y/N] ')).trim().toLowerCase()
  rl.close()
  if (answer !== 'y' && answer !== 'yes') {
    console.log('Aborted.')
    return
  }
  for (const { post } of affected) {
    const newTranslations: Translation[] = post.translations.map(t => {
      const r = rewriteBody(t.body)
      return r.modifications > 0 ? { ...t, body: r.body } : t
    })
    await putPost(post, newTranslations)
    console.log(`  ✓ updated ${post.slug}`)
  }
  console.log('\nDone.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Run type-check and lint**

Run: `npx tsc --noEmit && npx eslint scripts/fix-intro-stubs.ts`

Expected: no errors.

- [ ] **Step 3: Dry-run the script (no posts affected = no mutation)**

Set `SSP_CMS_URL=http://localhost:3007` (or your local CMS) and the internal key:

```bash
SSP_CMS_URL=http://localhost:3007 npx tsx scripts/fix-intro-stubs.ts
```

If the intro post has stubs: the script prints the affected post id and translation counts, then asks `Proceed? [y/N]`. Answer `n` to abort without mutation.

If no posts have stubs: the script prints `Nothing to do.` and exits cleanly.

Both outcomes verify the script runs and the API contract works. **Do not answer `y` yet — that happens in Task 15.**

- [ ] **Step 4: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add scripts/fix-intro-stubs.ts
git commit -m 'chore(scripts): add fix-intro-stubs script'
```

---

## Task 15: Run `fix-intro-stubs` and commit the execution log

**Files:**
- Create: `docs/article-publish-logs/2026-05-13-fix-intro-stubs-run.md`

This task actually applies the rewrite to the prod CMS post(s) and records the execution.

- [ ] **Step 1: Confirm all 8 articles are live**

Before running the script, verify each target deep-article URL returns 200:

```bash
for path in \
  /api/v1/posts/what-is-2-of-2-multisig \
  /api/v1/posts/seed-phrase-best-practices \
  /api/v1/posts/setting-up-your-first-ssp-wallet \
  /api/v1/posts/why-self-custody-matters-now \
  /api/v1/posts/what-is-account-abstraction-erc-4337 \
  /api/v1/posts/sending-bitcoin-with-ssp \
  /api/v1/posts/bitcoin-in-ssp \
  /api/v1/posts/what-is-on-chain-analytics
do
  code=$(curl -sS -o /dev/null -w '%{http_code}' "${SSP_CMS_URL:-http://localhost:3007}$path")
  echo "$code $path"
done
```

Expected: 8 lines of `200 ...`. If any returns 404, the corresponding article task (6–13) did not complete successfully — fix that first before proceeding.

- [ ] **Step 2: Run the script and answer `y`**

```bash
SSP_CMS_URL="${SSP_CMS_URL:-http://localhost:3007}" npx tsx scripts/fix-intro-stubs.ts 2>&1 | tee /tmp/fix-intro-stubs-run.log
```

When prompted `Proceed? [y/N]`, answer `y`.

Expected output:
```
Scanning .../api/v1/admin/posts for stub anchors…

Found 1 post(s) with stub anchors:

  - <intro-slug> (<id>): N total
      <locale>: <n>
      ...

Proceed? [y/N] y
  ✓ updated <intro-slug>

Done.
```

Capture the affected slug and id; you'll write them into the log file.

- [ ] **Step 3: Verify idempotency by re-running**

Re-run the script (without piping this time):

```bash
SSP_CMS_URL="${SSP_CMS_URL:-http://localhost:3007}" npx tsx scripts/fix-intro-stubs.ts
```

Expected: `Nothing to do.` — confirms the rewrite landed and the script is idempotent.

- [ ] **Step 4: Smoke test the intro post**

Start dev server: `npm run dev`

```bash
# Replace <intro-slug> with the slug reported by the script.
INTRO_SLUG="<intro-slug>"
SECTION="academy"  # or newsroom — whichever section the post is in; check via curl /api/v1/posts/<slug>
CATEGORY="<category>"  # only relevant if SECTION=academy; check via the same call
URL="http://localhost:3000/en/${SECTION}/${CATEGORY:+$CATEGORY/}${INTRO_SLUG}"
curl -sS "$URL" | grep -oE 'href="/academy/[^"]+"' | sort -u
```

Expected: the output contains `/academy/getting-started/setting-up-your-first-ssp-wallet` and `/academy/multisig/what-is-2-of-2-multisig` and does **not** contain bare `/academy/getting-started` or `/academy/multisig`.

Stop the dev server.

- [ ] **Step 5: Write the execution log**

Create `docs/article-publish-logs/2026-05-13-fix-intro-stubs-run.md`:

```markdown
# Execution log — fix-intro-stubs

- **Date:** 2026-05-13
- **Script:** `scripts/fix-intro-stubs.ts`
- **CMS URL:** <SSP_CMS_URL used>
- **Post(s) modified:**
  - `<slug>` (`<id>`): <N> total replacements across <M> translations
- **Rules applied:**
  - `](/academy/getting-started)` → `](/academy/getting-started/setting-up-your-first-ssp-wallet)`
  - `](/academy/multisig)` → `](/academy/multisig/what-is-2-of-2-multisig)`
- **Idempotency:** re-running the script reported `Nothing to do.`
- **Smoke test:**
  - Intro post no longer contains bare `/academy/getting-started` or `/academy/multisig` hrefs.
  - The two anchors now resolve to the deep articles published in Tasks 6 and 8.
```

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add docs/article-publish-logs/2026-05-13-fix-intro-stubs-run.md
git commit -m 'chore(cms): re-point intro article academy stubs to deep articles'
```

---

## Final verification

After all 15 tasks complete, run the full check suite:

- [ ] **Step 1: Run all tests**

Run: `npm run test`

Expected: all tests pass (the 9 existing linker tests + 6 new linker tests + 6 fallback-map tests + 6 auto-link-post-content tests + the entire pre-existing suite of 156 from sub-project 1).

- [ ] **Step 2: Run type-check, lint, format-check**

Run: `npm run check-all`

Expected: all four checks pass — `type-check`, `lint`, `format:check`, `test`.

- [ ] **Step 3: Production build**

Run: `npm run build`

Expected: clean build. Static page count should include ~30,200 glossary pages + 8 new academy slugs × 14 locales = ~30,312 total. Look for `✓ Generating static pages (<N>/<N>)` with no errors.

- [ ] **Step 4: Push to origin**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git push origin feat/newsroom-academy-app-router-migration
```

Expected: the 15 new commits land on the remote branch. Output ends with `feat/newsroom-academy-app-router-migration -> feat/newsroom-academy-app-router-migration`.

---

## Notes for the executor

**Why the 8 articles are not strictly TDD.** Content authoring tasks (6–13) don't follow the write-failing-test-first cycle — there is no failing test for an article body. The equivalent gates are: (a) the smoke-test step verifies the article renders in at least two locales, (b) the anchor-id count step verifies the curated auto-linker's deep-link contract, and (c) the publish-log file makes the action auditable in `git log`. These three together substitute for a unit test on prose.

**If a translation fails partway.** The `generate-article` skill is the source of truth for partial-failure handling. If translation 11 of 14 fails (e.g. rate limit), retry the skill call for the remaining locales rather than re-running all 14 — the admin PUT contract supports per-locale upserts.

**If the CMS has duplicate `/academy/getting-started` or `/academy/multisig` anchors in multiple posts.** The script handles N posts naturally — the affected-list printout in Task 15 Step 2 will show all of them. Operator confirmation gate covers the "did you expect to mutate 12 posts?" case.

**The auto-linker's `selfSlug` is the post slug, not the URL.** Both the academy and newsroom page calls pass `post.slug`. The self-reference check in the linker (`term.href.endsWith('/${selfSlug}')`) compares slug-only — this is correct because curated and fallback hrefs both end in `/<slug>`.

**Per-locale curated maps are out of scope.** Today the linker uses English curated terms even when rendering a Spanish or Japanese body. The case-insensitive word-boundary match still picks up English loanwords ("multisig", "ERC-4337", "BIP48") which appear untranslated in most locales. If a future locale's translation rewrites "multisig" to a native term, that won't auto-link — that's a known and intentional limitation, deferred per the spec's "Out of scope" section.
