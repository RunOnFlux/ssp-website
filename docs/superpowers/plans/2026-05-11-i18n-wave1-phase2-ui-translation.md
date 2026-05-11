# i18n Wave 1 — Phase 2 (UI Translation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace every `__TODO_TRANSLATE__` placeholder in `src/messages/*.json` with a real translation so that every URL `/[locale]/…` for all 14 Wave 1 locales renders fully-translated UI on first visit. Also finalize the 15 pre-existing placeholders in `es.json` and `zh.json` from prior phases.

**Architecture:** One translator-subagent invocation per target locale, dispatched **sequentially** (the subagent-driven-development skill prohibits parallel implementation dispatches because of git index races). Each invocation consumes `src/messages/en.json` and `docs/i18n/glossary.md` and writes `src/messages/<locale>.json` plus an atomic commit. A `scripts/check-translations.ts` audit guards quality and is wired into `prebuild` so CI blocks merges with placeholder leakage, ICU drift, or locked-term translation.

**Tech Stack:** TypeScript 5 · Node 24 · next-intl · Vitest 4 · npm

**Spec:** `docs/superpowers/specs/2026-05-11-i18n-wave1-locale-expansion-design.md`
**Phase 1 plan:** `docs/superpowers/plans/2026-05-11-i18n-wave1-phase1-foundation.md`

**Scope (cms-backend and dashboard PRs are NOT touched by this phase):** all work lands in PR #10 (ssp-website) on branch `feat/i18n-wave1-locale-expansion`.

---

## File structure (changes)

| File | Action | Responsibility |
| --- | --- | --- |
| `scripts/check-translations.ts` | Create | Audit: no `__TODO_TRANSLATE__` markers, ICU placeholders match en, key structure matches en, locked terms preserved |
| `__tests__/scripts/check-translations.test.ts` | Create | Unit tests for the audit's per-rule checks |
| `package.json` | Modify | Wire `check-translations` into `prebuild` |
| `src/messages/es.json` | Modify | Close 15 existing `__TODO_TRANSLATE__` placeholders |
| `src/messages/zh.json` | Modify | Close 15 existing `__TODO_TRANSLATE__` placeholders |
| `src/messages/pt-BR.json` | Replace | Full translation |
| `src/messages/ru.json` | Replace | Full translation |
| `src/messages/tr.json` | Replace | Full translation |
| `src/messages/ja.json` | Replace | Full translation |
| `src/messages/de.json` | Replace | Full translation |
| `src/messages/fr.json` | Replace | Full translation |
| `src/messages/it.json` | Replace | Full translation |
| `src/messages/pl.json` | Replace | Full translation |
| `src/messages/ko.json` | Replace | Full translation |
| `src/messages/vi.json` | Replace | Full translation |
| `src/messages/id.json` | Replace | Full translation |
| `docs/i18n/glossary.md` | Modify (as needed) | Add per-locale notes surfaced during translation |

---

## Task 1: Audit script with tests (TDD)

**Files:**
- Create: `scripts/check-translations.ts`
- Create: `__tests__/scripts/check-translations.test.ts`
- Modify: `package.json` (prebuild)

The audit must catch four classes of regression:

1. **Residual placeholders.** Any value matching `__TODO_TRANSLATE__` → fail
2. **ICU placeholder drift.** Set of ICU patterns (`{name}`, `{name, plural, …}`, `<tag>…</tag>`) in each value must equal the set in the en.json value at the same path
3. **Key-structure drift.** Set of leaf paths in each non-en locale must equal the set in en
4. **Locked-term translation.** Locked terms from `docs/i18n/glossary.md` section 1 must appear verbatim in each locale's values that contain them in en

- [ ] **Step 1: Write failing tests**

Create `__tests__/scripts/check-translations.test.ts`:

```ts
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
    expect(
      diffIcuPlaceholders('You have {count} items', 'Tienes {count} items'),
    ).toEqual({ missing: [], extra: [] })
  })

  it('flags missing placeholders', () => {
    expect(
      diffIcuPlaceholders('Hi {name}, you have {count}', 'Hola {name}'),
    ).toEqual({ missing: ['{count}'], extra: [] })
  })

  it('flags extra placeholders not in source', () => {
    expect(
      diffIcuPlaceholders('Hi {name}', 'Hola {name}, {count}'),
    ).toEqual({ missing: [], extra: ['{count}'] })
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
    expect(findLockedTermTranslations(en, tgt, ['SSP'])).toEqual([
      { path: 'brand', term: 'SSP' },
    ])
  })

  it('does not flag when target has same term in different casing intentionally (case-sensitive locked terms)', () => {
    const en = { x: 'ssp' }
    const tgt = { x: 'ssp' }
    expect(findLockedTermTranslations(en, tgt, ['SSP'])).toEqual([])
  })
})
```

- [ ] **Step 2: Run the test, expect FAIL**

```bash
npm run test -- __tests__/scripts/check-translations.test.ts
```

Expected: FAIL (module not found).

- [ ] **Step 3: Implement `scripts/check-translations.ts`**

```ts
#!/usr/bin/env tsx
/**
 * check-translations.ts
 *
 * Audit src/messages/<locale>.json files for translation quality issues:
 *  - Residual __TODO_TRANSLATE__ markers
 *  - ICU placeholder drift vs en.json
 *  - Key-structure drift vs en.json
 *  - Locked-term translation (from docs/i18n/glossary.md section 1)
 *
 * Exits 0 if clean; non-zero with a per-locale report otherwise.
 *
 * Run as part of prebuild, or directly: `npm run tsx scripts/check-translations.ts`
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { routing } from '../src/i18n/routing'

const REPO_ROOT = process.cwd()
const MARKER = '__TODO_TRANSLATE__'

// Pattern matchers for ICU + rich-text. Conservative — match what next-intl
// actually uses. False positives are preferable to false negatives.
const ICU_PATTERNS = [
  /\{[^{}]+(?:\{[^{}]*\}[^{}]*)*\}/g, // {name}, {count, plural, ...}
  /<[a-zA-Z][a-zA-Z0-9-]*>/g, // <link>, <strong>, etc.
  /<\/[a-zA-Z][a-zA-Z0-9-]*>/g, // </link>
]

type LeafEntry = { path: string; value: string }

export function findPlaceholderResiduals(tree: unknown, prefix = ''): string[] {
  if (typeof tree === 'string') {
    return tree.includes(MARKER) ? [prefix] : []
  }
  if (Array.isArray(tree)) {
    return tree.flatMap((v, i) => findPlaceholderResiduals(v, `${prefix}[${i}]`))
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.entries(tree).flatMap(([k, v]) =>
      findPlaceholderResiduals(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return []
}

export function diffIcuPlaceholders(
  source: string,
  target: string,
): { missing: string[]; extra: string[] } {
  const extract = (s: string): string[] =>
    ICU_PATTERNS.flatMap((pat) => Array.from(s.matchAll(pat)).map((m) => m[0])).sort()
  const src = extract(source)
  const tgt = extract(target)
  const srcCount = new Map<string, number>()
  for (const p of src) srcCount.set(p, (srcCount.get(p) ?? 0) + 1)
  const tgtCount = new Map<string, number>()
  for (const p of tgt) tgtCount.set(p, (tgtCount.get(p) ?? 0) + 1)
  const missing: string[] = []
  const extra: string[] = []
  for (const [p, n] of srcCount) {
    const t = tgtCount.get(p) ?? 0
    for (let i = 0; i < n - t; i++) missing.push(p)
  }
  for (const [p, n] of tgtCount) {
    const s = srcCount.get(p) ?? 0
    for (let i = 0; i < n - s; i++) extra.push(p)
  }
  return { missing, extra }
}

function collectLeafPaths(tree: unknown, prefix = ''): Set<string> {
  if (tree === null || typeof tree !== 'object') return new Set([prefix])
  if (Array.isArray(tree)) {
    const out = new Set<string>()
    tree.forEach((v, i) => collectLeafPaths(v, `${prefix}[${i}]`).forEach((p) => out.add(p)))
    return out
  }
  const out = new Set<string>()
  for (const [k, v] of Object.entries(tree)) {
    collectLeafPaths(v, prefix ? `${prefix}.${k}` : k).forEach((p) => out.add(p))
  }
  return out
}

export function diffLeafPaths(
  source: unknown,
  target: unknown,
): { missing: string[]; extra: string[] } {
  const src = collectLeafPaths(source)
  const tgt = collectLeafPaths(target)
  return {
    missing: [...src].filter((p) => !tgt.has(p)).sort(),
    extra: [...tgt].filter((p) => !src.has(p)).sort(),
  }
}

function collectLeafEntries(tree: unknown, prefix = ''): LeafEntry[] {
  if (typeof tree === 'string') return [{ path: prefix, value: tree }]
  if (Array.isArray(tree)) {
    return tree.flatMap((v, i) => collectLeafEntries(v, `${prefix}[${i}]`))
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.entries(tree).flatMap(([k, v]) =>
      collectLeafEntries(v, prefix ? `${prefix}.${k}` : k),
    )
  }
  return []
}

export function findLockedTermTranslations(
  source: unknown,
  target: unknown,
  lockedTerms: readonly string[],
): { path: string; term: string }[] {
  const srcEntries = new Map(collectLeafEntries(source).map((e) => [e.path, e.value]))
  const tgtEntries = new Map(collectLeafEntries(target).map((e) => [e.path, e.value]))
  const issues: { path: string; term: string }[] = []
  for (const [p, srcVal] of srcEntries) {
    const tgtVal = tgtEntries.get(p)
    if (typeof tgtVal !== 'string') continue
    for (const term of lockedTerms) {
      if (srcVal.includes(term) && !tgtVal.includes(term)) {
        issues.push({ path: p, term })
      }
    }
  }
  return issues
}

async function parseGlossaryLockedTerms(glossaryPath: string): Promise<string[]> {
  const raw = await fs.readFile(glossaryPath, 'utf8')
  // Extract section 1: lines under "## 1. Locked terms" until the next "## " heading.
  const startIdx = raw.indexOf('## 1.')
  if (startIdx < 0) return []
  const after = raw.slice(startIdx)
  const endIdx = after.indexOf('\n## 2.')
  const section = endIdx > 0 ? after.slice(0, endIdx) : after
  // Collect bullet items: lines starting with "- " up to the first comma, paren, or end-of-line.
  const terms: string[] = []
  for (const line of section.split('\n')) {
    const m = line.match(/^-\s+([^,()\n]+)/)
    if (!m) continue
    const term = m[1].trim()
    // Skip "EIP-<number>" template line
    if (term.includes('<') || term.includes('>')) continue
    if (term.length > 0) terms.push(term)
  }
  return terms
}

async function main(): Promise<void> {
  const messagesDir = path.join(REPO_ROOT, 'src/messages')
  const glossaryPath = path.join(REPO_ROOT, 'docs/i18n/glossary.md')
  const enRaw = await fs.readFile(path.join(messagesDir, 'en.json'), 'utf8')
  const en = JSON.parse(enRaw) as unknown
  const lockedTerms = await parseGlossaryLockedTerms(glossaryPath)

  const otherLocales = routing.locales.filter((l) => l !== 'en')
  const failures: { locale: string; reason: string; detail: string }[] = []

  for (const locale of otherLocales) {
    const localePath = path.join(messagesDir, `${locale}.json`)
    let localeJson: unknown
    try {
      localeJson = JSON.parse(await fs.readFile(localePath, 'utf8'))
    } catch (err) {
      failures.push({
        locale,
        reason: 'missing-or-invalid',
        detail: err instanceof Error ? err.message : String(err),
      })
      continue
    }

    // 1. Placeholder residuals
    const residuals = findPlaceholderResiduals(localeJson)
    if (residuals.length > 0) {
      failures.push({
        locale,
        reason: 'placeholder-residuals',
        detail: `${residuals.length} keys still contain __TODO_TRANSLATE__: ${residuals.slice(0, 5).join(', ')}${residuals.length > 5 ? '…' : ''}`,
      })
    }

    // 2. Leaf-path structure
    const pathDiff = diffLeafPaths(en, localeJson)
    if (pathDiff.missing.length > 0 || pathDiff.extra.length > 0) {
      failures.push({
        locale,
        reason: 'key-structure-drift',
        detail: `missing in target: ${pathDiff.missing.slice(0, 5).join(', ') || '(none)'}; extra: ${pathDiff.extra.slice(0, 5).join(', ') || '(none)'}`,
      })
    }

    // 3. ICU placeholder drift per leaf
    const srcEntries = collectLeafEntries(en)
    const tgtMap = new Map(collectLeafEntries(localeJson).map((e) => [e.path, e.value]))
    const icuDriftPaths: string[] = []
    for (const e of srcEntries) {
      const tgtVal = tgtMap.get(e.path)
      if (typeof tgtVal !== 'string') continue
      const d = diffIcuPlaceholders(e.value, tgtVal)
      if (d.missing.length > 0 || d.extra.length > 0) icuDriftPaths.push(e.path)
    }
    if (icuDriftPaths.length > 0) {
      failures.push({
        locale,
        reason: 'icu-drift',
        detail: `${icuDriftPaths.length} keys have placeholder drift: ${icuDriftPaths.slice(0, 5).join(', ')}${icuDriftPaths.length > 5 ? '…' : ''}`,
      })
    }

    // 4. Locked term preservation
    const lockedIssues = findLockedTermTranslations(en, localeJson, lockedTerms)
    if (lockedIssues.length > 0) {
      const summary = lockedIssues.slice(0, 5).map((i) => `${i.path}=${i.term}`).join(', ')
      failures.push({
        locale,
        reason: 'locked-term-translated',
        detail: `${lockedIssues.length} locked-term occurrences missing in target: ${summary}${lockedIssues.length > 5 ? '…' : ''}`,
      })
    }
  }

  if (failures.length === 0) {
    process.stdout.write(`check-translations: ${otherLocales.length} locale(s) clean\n`)
    process.exit(0)
  }
  process.stderr.write(`check-translations: ${failures.length} issue(s)\n\n`)
  for (const f of failures) {
    process.stderr.write(`  [${f.locale}] ${f.reason}: ${f.detail}\n`)
  }
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    process.stderr.write(`check-translations failed: ${err instanceof Error ? err.message : String(err)}\n`)
    process.exit(1)
  })
}
```

- [ ] **Step 4: Run the test, expect PASS**

```bash
npm run test -- __tests__/scripts/check-translations.test.ts
```

Expected: all 13 tests PASS.

- [ ] **Step 5: Wire into prebuild**

Edit `package.json`. Find the `prebuild` script:

```json
"prebuild": "tsx scripts/check-public-safe.ts && tsx scripts/check-agent-md-staleness.ts && tsx scripts/generate-chains-skill.ts",
```

Replace with:

```json
"prebuild": "tsx scripts/check-public-safe.ts && tsx scripts/check-agent-md-staleness.ts && tsx scripts/generate-chains-skill.ts && tsx scripts/check-translations.ts",
```

(Order matters: check-translations runs LAST so the cheaper checks fail fast.)

- [ ] **Step 6: Run audit against current state, expect FAIL**

```bash
npx tsx scripts/check-translations.ts
```

Expected: failures for all 11 new locales (placeholder-residuals on every key) and for es/zh (15 residuals each). This proves the audit catches the current state.

- [ ] **Step 7: Run check-all (should still pass — prebuild isn't invoked by check-all)**

```bash
npm run check-all
```

Expected: 121 + 13 = 134 tests PASS. `check-all` runs `type-check && lint && format:check && test` — none of those invoke `prebuild`, so the failing audit doesn't break check-all yet. The audit fires on `npm run build`.

- [ ] **Step 8: Commit**

```bash
git add scripts/check-translations.ts __tests__/scripts/check-translations.test.ts package.json
git commit -m "feat(i18n): add check-translations audit for Phase 2 quality gate

Audit src/messages/<locale>.json for: residual __TODO_TRANSLATE__,
ICU placeholder drift vs en, key-structure drift vs en, and locked-term
translation (parsed from docs/i18n/glossary.md section 1). Wired into
prebuild so 'next build' fails if any locale regresses.

Currently fails for all non-en locales (placeholders not yet translated);
subsequent Phase 2 commits land per-locale translations that progressively
clean the audit."
```

---

## Task 2: Finalize 15 placeholders in es.json and zh.json

**Files:**
- Modify: `src/messages/es.json` (15 keys)
- Modify: `src/messages/zh.json` (15 keys)

The placeholders are at known paths (1 `Common.translationPendingBanner` + 14 in `Categories.<slug>.{title,description}`). Translate them in-place with reference to the existing well-translated content in the rest of each file (so the register and term-choices stay consistent within each locale).

- [ ] **Step 1: Identify the 15 paths**

```bash
grep -n "__TODO_TRANSLATE__" src/messages/es.json
grep -n "__TODO_TRANSLATE__" src/messages/zh.json
```

Expected paths (in both files):
- `Common.translationPendingBanner`
- `Categories.<category>.title` and `Categories.<category>.description` for each of the 7 academy categories

- [ ] **Step 2: Translate each placeholder**

Open each placeholder location. The English source is preserved after the marker prefix. Strip the `__TODO_TRANSLATE__ ` prefix and replace the value with the locale-appropriate translation. Reference the glossary (`docs/i18n/glossary.md`) for per-term policy and per-locale style.

Quality bar: the translation must read naturally in context (these strings render as category card titles + description text on the academy index page). Don't word-for-word translate from English — translate idea-for-idea.

- [ ] **Step 3: Run the audit**

```bash
npx tsx scripts/check-translations.ts
```

Expected: `es` and `zh` no longer report `placeholder-residuals`. Other locales still fail (they haven't been translated yet).

- [ ] **Step 4: Run check-all**

```bash
npm run check-all
```

Expected: 134 tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/messages/es.json src/messages/zh.json
git commit -m "feat(i18n): finalize 15 remaining placeholders in es and zh

Close the __TODO_TRANSLATE__ markers in Common.translationPendingBanner
(1 key each) and the 7 academy Categories.*.{title,description} (14 keys
each). Translations follow the established register in each file and
the glossary at docs/i18n/glossary.md."
```

---

## Tasks 3–13: Translate each new locale (one task per locale)

Each task follows the same shape. **Dispatch one implementer-subagent per task, sequentially** (parallel dispatch is forbidden by subagent-driven-development — the git index races and the subagent prompts inherit the parent's context state, which evolves between dispatches).

Order: **pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id** (mirrors the canonical locale-list order).

### Task template (apply for each of the 11 locales)

**Files:**
- Replace: `src/messages/<locale>.json`
- Possibly modify: `docs/i18n/glossary.md` (if translator surfaces new per-locale notes)

- [ ] **Step 1: Dispatch translator-subagent**

Invoke the translate-i18n skill via a fresh implementer-subagent with this contract:
- `--source` = `<worktree>/src/messages/en.json`
- `--target` = `<locale-code>`
- `--glossary` = `<worktree>/docs/i18n/glossary.md`
- `--output` = `<worktree>/src/messages/<locale-code>.json`

The subagent reads source + glossary, produces a full translation preserving ICU placeholders, markdown, and locked terms, runs its own self-check pass, writes the output file, and returns a report.

- [ ] **Step 2: Run the audit on this one locale**

After the subagent reports DONE, run:

```bash
npx tsx scripts/check-translations.ts
```

The audit's stderr lists per-locale issues. For the locale just translated, there should be NO entries (no `placeholder-residuals`, no `icu-drift`, no `key-structure-drift`, no `locked-term-translated`). Other locales still fail (they're not done yet) — that's expected.

If the just-translated locale has any audit failure, re-dispatch the subagent with the audit output as feedback. Continue until clean.

- [ ] **Step 3: Run check-all**

```bash
npm run check-all
```

Expected: 134 tests still pass.

- [ ] **Step 4: Visual smoke check (optional — controller's discretion based on locale risk)**

Start the dev server briefly, open `/<locale>/`, eyeball that the homepage renders without obviously broken layout. Stop the dev server.

For Cyrillic (ru), CJK (ja, ko), and unusual-script locales (tr with İ/ı, pl with ą/ę/ó, vi with diacritics), the visual check is more important. For Latin-script locales (de, fr, it, pt-BR, id), the audit is usually sufficient.

- [ ] **Step 5: Commit**

```bash
git add src/messages/<locale-code>.json docs/i18n/glossary.md
git commit -m "feat(i18n): translate UI strings into <locale-code>

1542 keys translated from en.json using the translate-i18n skill and
the glossary at docs/i18n/glossary.md. Audit (scripts/check-translations.ts)
clean: no __TODO_TRANSLATE__ residuals, no ICU placeholder drift, no
locked-term translation, no key-structure drift."
```

If the translator added entries to the glossary's per-locale section, the commit includes `docs/i18n/glossary.md` too.

---

## Task 14: Final integration verification

**Files:** none modified

- [ ] **Step 1: Run the full translation audit, expect PASS**

```bash
npx tsx scripts/check-translations.ts
```

Expected stdout: `check-translations: 13 locale(s) clean`. Exit 0.

- [ ] **Step 2: Run check-all**

```bash
npm run check-all
```

Expected: 134 tests still pass.

- [ ] **Step 3: Run prebuild to confirm the audit fires in build flow**

```bash
npm run prebuild
```

Expected: all four prebuild scripts succeed, including the new `check-translations`.

- [ ] **Step 4: Dev server smoke test**

```bash
PORT=3011 npm run dev > /tmp/website-dev.log 2>&1 &
sleep 12
for loc in en es zh pt-BR ru tr ja de fr it pl ko vi id; do
  code=$(curl -sL -o /dev/null -w "%{http_code}" "http://localhost:3011/${loc}/")
  echo "${loc}: ${code}"
done
```

Expected: every line `200`.

Then verify no `__TODO_TRANSLATE__` leaks in rendered HTML:

```bash
for loc in pt-BR ru ja; do
  count=$(curl -sL "http://localhost:3011/${loc}" | grep -c "__TODO_TRANSLATE__")
  echo "${loc}: ${count} placeholder leaks"
done
```

Expected: every line shows `0`.

Stop the dev server.

- [ ] **Step 5: Push to PR #10**

```bash
git push origin feat/i18n-wave1-locale-expansion
```

The PR is updated automatically. CI runs prebuild, which now includes `check-translations`. PR is mergeable when CI is green.

- [ ] **Step 6: No new commit for this task.**

---

## Out of scope for Phase 2 (deferred)

- Article-content backfill — Phase 3
- Per-locale CMS editor permissions — Wave 2 or later
- Locale-aware currency/number deep audit — deferred
- Arabic + RTL design-system — Wave 2 (own spec)

---

## Self-review

- ✅ Audit script covers all four failure classes from the spec (Phase 2 ships-when criteria)
- ✅ One translator-subagent per locale; sequential dispatch
- ✅ One atomic commit per locale (PR diff is reviewable locale-by-locale)
- ✅ Glossary updates ride alongside translation commits when surfaced
- ✅ Final verification covers audit + check-all + dev render
- ✅ Phase 3 + Phase 4 explicitly deferred
