# i18n Wave 1 — Locale Expansion Design

**Status:** Draft for review
**Date:** 2026-05-11
**Author:** Stultus Mundi
**Scope:** Cross-repo (ssp-website, ssp-cms-backend, ssp-relay-dashboard, ssp-cms-backend/.claude/skills/generate-article)
**Wave:** 1 of 2 (Wave 2 = Arabic + RTL design-system work, separate spec)

---

## Summary

Expand site, CMS, and dashboard support from 3 locales (`en`, `es`, `zh`) to 14 locales by adding 11 new LTR locales. Finalize the 15 remaining `__TODO_TRANSLATE__` placeholders in `es` and `zh`. Backfill every existing CMS post and series with translations into the 11 new locales. Translation production is done by Claude Code subagents (no API runtime cost), guided by a locked terminology glossary. Arabic and RTL design-system work is explicitly deferred to Wave 2.

## Goals

1. Every URL `/[locale]/…` for all 14 locales renders fully translated UI on day 1
2. Every existing post and series has translations stored in the CMS for all 14 locales on day 1
3. The infrastructure (schema, indexes, types, admin tabs, generate-article skill) supports all 14 locales such that Wave 2's Arabic addition is a small locale-list extension, not an architectural change
4. Translation quality is consistent within each locale (glossary-enforced) — no two strings render "wallet" two different ways within the same locale
5. CI guards prevent regression: no new `__TODO_TRANSLATE__` markers can land without explicit allow-list, no ICU placeholder corruption can land, no locked term can be translated

## Non-goals

- Arabic, Hebrew, or any RTL locale (Wave 2)
- Professional human translation review (ongoing post-launch initiative for high-traffic content)
- Splitting `zh` into `zh-Hans` / `zh-Hant`, `pt-BR` into `pt-BR` / `pt-PT`, or `es` into LatAm / Spain regional variants
- Locale-aware currency or number-format deep audit beyond next-intl's ICU defaults
- Real-time translation drift monitoring or alerting
- Per-locale CMS editor permissions (current role hierarchy suffices)
- Migration of the existing `zh` locale code to `zh-Hans` (kept as `zh` for backward compatibility with existing URLs and stored content)

---

## Locale set

The final Wave 1 locale list, in canonical order:

| Code    | Language               | Status              | Notes                                                                                    |
| ------- | ---------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `en`    | English                | Existing (source)   | Default locale. Source of truth for all translations. URL: `/en/…`                       |
| `es`    | Spanish                | Existing (finalize) | Latin-American Spanish baseline. 15 `__TODO_TRANSLATE__` placeholders to be closed.      |
| `zh`    | Chinese (Simplified)   | Existing (finalize) | Simplified Chinese. Code stays `zh` for back-compat with existing URLs and stored data.  |
| `pt-BR` | Portuguese (Brazil)    | New                 | Regional tag — crypto demand concentrates in Brazil. URL: `/pt-BR/…`                     |
| `ru`    | Russian                | New                 | Complex plural rules — handled by next-intl ICU natively.                                |
| `tr`    | Turkish                | New                 | High crypto-adoption market.                                                              |
| `ja`    | Japanese               | New                 | Established crypto market, technical audience.                                            |
| `de`    | German                 | New                 | DACH region.                                                                              |
| `fr`    | French                 | New                 | EU + Francophone Africa reach.                                                            |
| `it`    | Italian                | New                 | EU reach.                                                                                 |
| `pl`    | Polish                 | New                 | Complex plural rules — handled by next-intl ICU natively.                                |
| `ko`    | Korean                 | New                 | Established crypto market.                                                                |
| `vi`    | Vietnamese             | New                 | High crypto-adoption market.                                                              |
| `id`    | Indonesian             | New                 | High crypto-adoption market.                                                              |

**Locale tag convention** (documented in this spec for Wave 2 onwards):
- **Language-only** tag (e.g. `fr`, `de`) when a single market dominates and no regional split is anticipated.
- **Regional** tag (e.g. `pt-BR`) when a meaningful regional split exists or when one region is overwhelmingly dominant for the target audience.

**URL routing rules:**
- `routing.localePrefix: 'always'` is unchanged — every URL is `/[locale]/…`
- BCP-47 tags with hyphens (`pt-BR`) work natively with Next.js + next-intl; no special handling
- Existing `en`, `es`, `zh` URLs are not disturbed
- `defaultLocale` remains `en`

---

## Architecture

### Source-of-truth for locale list

A single TypeScript constant is the source of truth in **each repo that needs to enumerate locales**. The three lists must agree at all times; agreement is enforced by a cross-repo test (see Phase 4).

**`ssp-website/src/i18n/routing.ts`** (existing file, extended):

```ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: [
    'en', 'es', 'zh',
    'pt-BR', 'ru', 'tr', 'ja', 'de', 'fr', 'it', 'pl', 'ko', 'vi', 'id',
  ],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
```

**`ssp-cms-backend/src/i18n/locales.ts`** (new file):

```ts
export const LOCALES = [
  'en', 'es', 'zh',
  'pt-BR', 'ru', 'tr', 'ja', 'de', 'fr', 'it', 'pl', 'ko', 'vi', 'id',
] as const

export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const NON_DEFAULT_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE)
```

**`ssp-cms-backend/.claude/skills/generate-article/scripts/locales.ts`** (new file): same constant, re-exported.

**`ssp-relay-dashboard` cms-module**: imports the locale list from a shared constant within its own codebase that mirrors the cms-backend list.

### CMS schema strategy

`Post` and `Series` entities own their JSON schemas (per `ssp-cms-backend/CLAUDE.md`). The `translations` field is restructured to be generated from `LOCALES`, not hand-rolled per locale.

**Before (Post.ts):**

```ts
type Translations = {
  en: PostTranslation
  es?: PostTranslation
  zh?: PostTranslation
}
```

**After:**

```ts
import { type Locale } from '@/i18n/locales'

type Translations =
  & { en: PostTranslation }
  & Partial<Record<Exclude<Locale, 'en'>, PostTranslation>>
```

The JSON schema (`POST_PROPERTIES` etc.) is generated by mapping over `LOCALES`. Adding Wave 2's `ar` becomes a single line in `LOCALES`.

### Index migration

For every locale in `LOCALES`, a sparse-unique index on `translations.<locale>.slug` is required on both `posts` and `series` collections. The existing `en`, `es`, `zh` indexes already exist.

A new migration script `ssp-cms-backend/src/scripts/migrate-locale-indexes.ts` is run once per environment:

- For every locale in `LOCALES`, every collection (`posts`, `series`), check whether the sparse-unique index on `translations.<locale>.slug` exists; if not, create it
- Idempotent — re-running creates no duplicate indexes, drops nothing
- Purely additive — never drops indexes, even if a locale is later removed from `LOCALES` (avoids data-loss surprises)
- Logs every action taken for the operator

### Website scaffolding

`ssp-website/src/messages/<new-locale>.json` files are created for all 11 new locales. Each file is structurally identical to `en.json` (same key tree) but with every leaf value prefixed `__TODO_TRANSLATE__ <english source>`. This makes the site immediately serve every locale URL — content falls back via the existing translation-pending banner pattern — and gives Phase 2 a known-good starting point.

Scaffolding script: `ssp-website/scripts/scaffold-locale.ts`. Inputs: target locale code. Reads `en.json`, walks the tree, prefixes every string with `__TODO_TRANSLATE__ `, preserves ICU placeholders verbatim, writes the target file. Idempotent.

### Hreflang and sitemap

The existing per-locale sitemap and page-level hreflang alternates code in `ssp-website` already iterates `routing.locales`. Expanding the list automatically expands coverage. The only verification needed: confirm the output contains alternates for all 14 locales and that per-locale sitemaps are generated correctly.

### Admin dashboard locale tabs

`ssp-relay-dashboard` cms-module renders a tab per locale in the post and series editor. Tabs are generated from the locale list, so extending the list automatically extends the editor. The `en` tab is required (cannot be deleted); all others can be empty (saved as missing translation, not empty string).

### generate-article skill

`ssp-cms-backend/.claude/skills/generate-article/` already produces translations for new articles. Extension:
- Locale list extended to all 14 locales (Wave 1) / all 15 (after Wave 2 lands)
- Per-locale prompt registry that includes the glossary reference and locale-specific style notes (e.g. ja honorifics, ru formal/informal register)
- `post-article.ts` payload shape unchanged (already uses the embedded-translations pattern)

---

## Glossary & translation contract

### Glossary file

Lives at `ssp-website/docs/i18n/glossary.md`. Structure:

```markdown
# SSP Translation Glossary

This glossary is consumed by translator subagents. Edits affect every
locale's translation output.

## Locked terms — leave-as-is in every locale

These terms are brand names, project names, or technical identifiers
that must appear in English regardless of target locale:

- SSP
- Zelcore, Flux
- Bitcoin, Ethereum, Solana, ... (full list maintained alongside src/constants/supported-chains.ts)
- ERC-20, ERC-721, ERC-4337
- Layer 1, Layer 2, ZK-Rollup
- (full list inline)

## Term policy table

| English term       | Domain       | Policy                                                                                  |
| ------------------ | ------------ | --------------------------------------------------------------------------------------- |
| self-custody       | crypto       | Translate; preserve the "self-" prefix nuance (e.g. de: "Selbstverwahrung")             |
| multisig           | crypto       | Leave-as-is in body copy; in glossary-style definitions, expand on first use            |
| seed phrase        | crypto       | Translate to the locale's standard term                                                 |
| hardware wallet    | crypto       | Translate                                                                               |
| dApp               | crypto       | Leave-as-is                                                                             |
| smart contract     | crypto       | Translate                                                                               |
| ... (full list)    | ...          | ...                                                                                     |

## Per-locale exceptions

### ja
- "seed phrase" → 「シードフレーズ」 (preferred over 「シード文」)
- Honorifics: use 「です・ます」 register throughout

### ko
- "seed phrase" → "시드 구문"
- Register: formal (-습니다)

### zh
- Already-translated content uses 简体中文; preserve that register

### (per-locale notes added as discovered during Phase 2)
```

The glossary is committed and version-controlled. Translator subagents read it as part of their input.

### Translator skill

A new project-local skill: `ssp-website/.claude/skills/translate-i18n/SKILL.md`. Inputs:

- `--source` — path to source locale JSON (typically `src/messages/en.json`)
- `--target` — target locale code (must be in `routing.locales` and not `en`)
- `--glossary` — path to `docs/i18n/glossary.md`
- `--output` — path to write target locale JSON (typically `src/messages/<locale>.json`)

The skill's instructions to the subagent:

1. Read source JSON. Walk the tree.
2. For each string value, produce a translation into target locale that:
   - Preserves every ICU placeholder verbatim (`{count}`, `{name, plural, one {…} other {…}}`, `{role, select, …}`)
   - Preserves all markdown markup including links, bold/italic, code spans
   - Never translates any locked term from the glossary
   - Follows per-term policies in the glossary
   - Follows per-locale style notes in the glossary
3. Write the output JSON, preserving the exact same key structure and ordering as the source.
4. Self-check pass: re-read the output and verify (a) every ICU placeholder from the source appears in the output, (b) no locked term has been translated, (c) no value is empty, (d) no `__TODO_TRANSLATE__` marker survives.
5. Report: lines translated, any per-locale notes worth adding to the glossary.

### Article translation

For Phase 3, a sibling skill `ssp-cms-backend/.claude/skills/translate-articles/SKILL.md` does the same thing for post/series content. The subagent:

- Reads the post via admin GET
- For each missing locale: translates `title`, `description`, `content`, `seoTitle`, `seoDescription`, `tags` using the glossary; generates a locale-appropriate slug (using a slugifier that handles non-ASCII, e.g. transliteration for ru/zh/ja/ko, lowercase-with-hyphens for Latin scripts)
- PATCHes the post via the admin endpoint with the new translation
- Logs success / failure per locale

---

## Phase-by-phase execution

### Phase 1 — Foundation (4 parallel PRs)

**Goal:** infrastructure for 14 locales is in place; visiting any new-locale URL renders English with the translation-pending banner.

**Deliverables per repo:**

**ssp-website:**
- Extend `src/i18n/routing.ts` with the 11 new locales
- Scaffold `src/messages/<new-locale>.json` for each new locale (placeholders only)
- Update tests in `src/i18n/audit.ts` and friends to expect the new locale count
- Verify sitemap and hreflang generation expand correctly (visual check + test coverage)
- Add the glossary doc at `docs/i18n/glossary.md`
- Add the translator skill at `.claude/skills/translate-i18n/SKILL.md`
- Add the scaffold script at `scripts/scaffold-locale.ts`

**ssp-cms-backend:**
- Add `src/i18n/locales.ts`
- Refactor `Post.ts` and `Series.ts` `translations` types to be generated from `LOCALES`
- Update `toPublicPost` / `toPublicSeries` and JSON schemas accordingly
- Add `src/scripts/migrate-locale-indexes.ts` (idempotent, additive)
- Run migration script in dev environment
- Update `PostService` / `SeriesService` to accept any `Locale` in queries (was previously hardcoded to `en | es | zh`)

**ssp-relay-dashboard (cms-module):**
- Mirror `LOCALES` in a local constant
- Extend editor locale tabs to render all 14 locales
- Verify the tab UI accommodates 14 tabs gracefully (overflow / scroll behavior)

**generate-article skill (`ssp-cms-backend/.claude/skills/generate-article/`):**
- Extend locale list in `scripts/locales.ts`
- Extend per-locale prompt registry
- Verify `post-article.ts` works with a 14-locale payload (manual end-to-end test creating a throwaway draft)

**Ships when:**
- `yarn check-all` / equivalent green in all four repos
- Visiting `/pt-BR/`, `/ru/`, `/ja/`, etc. on the running website renders English content with the translation-pending banner
- Creating a draft post in the admin UI shows tabs for all 14 locales
- Migration script run in dev confirms 14 sparse-unique indexes per collection

### Phase 2 — UI string translation (1 PR in ssp-website)

**Goal:** every locale's `messages/<locale>.json` is fully translated. No `__TODO_TRANSLATE__` markers survive.

**Execution:**
- Dispatch 11 parallel translator-subagents (one per new locale), each invoking the translate-i18n skill
- In the same PR, run the translator-subagent against `es` and `zh` to close the existing 15 `__TODO_TRANSLATE__` placeholders (treat them as a partial re-translation, not a full re-translation — pass only the placeholder keys)
- Add the glossary-consistency audit script `scripts/check-translations.ts` to `prebuild`:
  - Walks every `messages/<locale>.json`
  - Fails if any value contains `__TODO_TRANSLATE__` (allow-list optional, per-key)
  - Fails if ICU placeholders in non-`en` locales don't match the structure in `en.json`
  - Fails if any locked-term-from-glossary appears translated in any locale
  - Fails if key structure has drifted from `en.json`

**Ships when:**
- `check-translations.ts` audit clean
- `vitest` green
- Manual browser spot-check on 3 representative locales (one Cyrillic = `ru`; one CJK = `ja`; one Latin = `pt-BR`) — load 5 representative pages per locale, eyeball quality

### Phase 3 — Article backfill (script-driven, commits per locale)

**Goal:** every existing post and series has translations in the CMS for all 14 locales.

**Execution:**
- Author the backfill script: `ssp-cms-backend/.claude/skills/generate-article/scripts/backfill-translations.ts`
- Script inputs: `--locale <code>` (one or more), `--force` (re-translate even if locale present), `--dry-run`
- For each (post × missing-locale) pair: invoke the translate-articles skill subagent, PATCH the result via the admin endpoint
- Failure-isolation: per-pair failure logged; script continues
- End-of-run report: success count, failure count, per-locale counts, list of failures with reasons
- Idempotent: re-running with the same args skips already-translated pairs (unless `--force`)

**Ships when:**
- Backfill report shows 0 failures across all post×locale combinations
- Spot-check: open 2 randomly-selected articles in 3 randomly-selected locales on the running website — verify content renders without the translation-pending banner

### Phase 4 — Polish, validation, docs

**Goal:** guardrails in place; future locale additions are smooth.

**Deliverables:**
- `check-translations.ts` is in CI (added in Phase 2; this phase verifies it actually runs in CI, not just locally)
- A regression test in ssp-website that asserts hreflang alternates emit all 14 locales on representative pages (home, academy index, an academy article, a newsroom article)
- A regression test in ssp-website that asserts per-locale sitemaps generate the expected entry count
- A cross-repo locale-list consistency test: a small script (committed to ssp-website, runnable manually) that reads the locale list from all 3 repos' source-of-truth files and fails if any disagrees
- Update `CLAUDE.md` in each repo to document the locale-add procedure for Wave 2 (Arabic) and beyond

---

## Validation, rollback, error handling

### Per-phase rollback

| Phase | Rollback path                                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Revert the 4 PRs. Migration script is purely additive — leaving the new indexes in place after revert is safe (they cost ~negligible disk).   |
| 2     | Revert the ssp-website PR. Site re-falls back to existing en/es/zh; new-locale URLs serve English with the translation-pending banner again.  |
| 3     | Provide `unbackfill-translations.ts --locale <x>` helper that `$unset`s `translations.<locale>` per post/series. Forward-only safe op.        |
| 4     | Revert the test additions. Pure removal, no side effects.                                                                                     |

### Failure-mode handling

| Failure                                       | Handling                                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Translator subagent fails for a locale        | Skip that locale, continue with others. Report flags the locale. Operator re-runs for that one.       |
| Translator subagent corrupts ICU placeholders | Audit script in Phase 2/CI fails the build. Operator re-runs for affected keys.                       |
| CMS PATCH fails on an article                 | Per-article-per-locale recorded as failed. Others continue. Operator re-runs with `--locale` filter.  |
| Glossary audit failure                        | Blocks PR merge. Operator fixes glossary or re-runs translator with updated glossary, re-runs audit.  |
| Migration script fails partway                | Script is idempotent and resumable. Re-run from scratch.                                              |

### Definition of done for Wave 1

- Every URL `/[locale]/...` for all 14 locales renders fully translated UI (no translation-pending banner anywhere on first visit)
- Every existing post and series has translations stored in the CMS for all 14 locales
- `check-translations.ts` audit passes in CI on the merge commit
- Cross-repo locale-list consistency test passes
- Sitemap and hreflang regression tests pass
- Glossary doc is committed
- Translator and article-translator skills are committed
- CLAUDE.md updated in each repo with locale-add procedure

---

## Open questions / decisions to confirm during implementation

- **Glossary completeness:** the term policy table will grow during Phase 2 as translators discover ambiguities. Treat this as expected; commit glossary updates alongside translation PRs.
- **Style register per locale:** ja/ko have multiple registers (formal/informal). Wave 1 defaults to formal across all locales for marketing consistency; flagged for review post-launch if user feedback suggests otherwise.
- **`es` / `zh` partial finalization:** the 15 `__TODO_TRANSLATE__` markers per file (1 for `Common.translationPendingBanner` + 14 for the 7 academy `Categories.*` titles and descriptions) in `es.json` and `zh.json` will be closed in Phase 2 alongside the new-locale translation pass.

---

## Repos and branches affected

| Repo                                                 | Branch (Wave 1)                              | Base                                                  |
| ---------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| ssp-website                                          | `feat/i18n-wave1-locale-expansion`           | `feat/newsroom-academy-app-router-migration` HEAD     |
| ssp-cms-backend                                      | `feat/i18n-wave1-locale-expansion`           | `master` HEAD                                         |
| ssp-relay-dashboard (cms-module worktree)            | `feat/i18n-wave1-locale-expansion`           | `feature/cms-module` HEAD                             |

Final merge order:

1. **ssp-cms-backend** — schema generalization, index migration, `src/i18n/locales.ts`, and `.claude/skills/generate-article/` extensions all land in one PR (single repo, atomic).
2. **ssp-website** — Phase 1 scaffolding PR, then Phase 2 translation PR (two separate PRs in this repo).
3. **ssp-relay-dashboard** — admin UI locale tabs PR (depends on cms-backend's schema being live).

Phase 3 (article backfill) does not produce code PRs — it runs the backfill script against the deployed CMS and writes per-locale translation data into MongoDB.
