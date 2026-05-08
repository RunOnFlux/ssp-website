# SSP Website i18n Phase B.3 — Locale-Aware CMS Fetch

> Final phase of the trilingual content initiative. Phase A handled static-string i18n; Phase B.1 added embedded translations to the CMS backend; Phase B.2 added locale-aware editing in the dashboard. This phase makes the public website consume the new locale-aware API.

**Date:** 2026-05-08
**Repo:** `ssp-website`
**Branch:** `feature/i18n-phase-b3-locale-aware-fetch`
**Base:** `feat/newsroom-academy-app-router-migration`
**Prereq:** Phase A (`feature/i18n-phase-a`, merged), Phase B.1 (`ssp-cms-backend@master`, merged), Phase B.2 (`ssp-relay-dashboard/feature/cms-module`, merged)
**Successor:** none — closes the i18n initiative

---

## Goal

Render trilingual articles (`en` / `es` / `zh`) on `ssp-website` by consuming the locale-aware public CMS API shipped in Phase B.1. Backward-compatible at the module API boundary; no breaking changes to public types beyond additive fields.

## Background

After Phase A, `ssp-website` translates all chrome (nav, footers, breadcrumbs, metadata) via `next-intl` with silent EN fallback for missing keys. Pages live under `src/app/[locale]/` and every page calls `setRequestLocale(locale)`.

After Phase B.1, the public CMS API (`/api/v1/posts`, `/api/v1/series`, etc.) accepts a `?locale=en|es|zh` query param. Responses include `locale` (requested) and `servedLocale` (actually served — falls back to `en` if the requested translation doesn't exist). Per-locale slug uniqueness is enforced in MongoDB.

After Phase B.2, dashboard editors author posts in three locales via tabs and a translate proxy.

Today, `ssp-website` calls the public API without a locale param, so the backend defaults to `en` content under every URL. Spanish and Chinese URLs (`/es/newsroom/...`, `/zh/newsroom/...`) already route correctly (Phase A) and render translated chrome, but the article body is always English. This phase fixes that.

## Architecture

Five layers change. All changes are surgical, additive at the public type level, and gated behind explicit locale parameters at the data-layer boundary.

### 1. Fetch wrapper — `src/lib/cms/cms-fetch.ts`

Add an `options` overload accepting `{ revalidate?: number; locale?: Locale }`. When `locale` is set, append `?locale=<x>` to the URL (with `&` if the path already contains a `?`). Existing two-arg callers (`cmsFetch(path, 300)`) keep working — the second arg accepts either a number (legacy) or an options object.

```ts
export type CmsFetchOptions = { revalidate?: number; locale?: Locale }

export async function cmsFetch<T>(
  path: string,
  optsOrRevalidate: CmsFetchOptions | number = 60,
): Promise<T>
```

The function:
1. Normalises args (number → `{ revalidate }`).
2. Builds URL: if `opts.locale` set, append `locale=<x>` query param using `URLSearchParams` semantics so existing query strings survive.
3. Sends the request as today (`x-api-key` header, `next.revalidate`).
4. Returns parsed JSON. Errors propagate unchanged.

### 2. Data layer — `src/lib/cms.ts`

Every getter that returns translated content gains a required `locale: Locale` parameter. The LRU cache key prefix gains the locale segment. Seed-loader fallback marks returned posts with `servedLocale: 'en'` so the banner triggers under non-EN.

| Function | Signature change |
|---|---|
| `getAllPosts()` | `getAllPosts(locale: Locale)` |
| `getPostBySlug(slug)` | `getPostBySlug(slug, locale: Locale)` |
| `getAllTags()` | unchanged — tags are language-neutral identifiers |
| `getAllSlugs()` | `getAllSlugs(locale: Locale)` — returns the locale's slug per post |
| `getAcademyPosts(filters)` | `getAcademyPosts(filters, locale: Locale)` |
| `getAcademyPostBySlug(slug)` | `getAcademyPostBySlug(slug, locale: Locale)` |
| `getAcademySlugs()` | `getAcademySlugs(locale: Locale)` |
| `getCategories()` | unchanged — backend returns EN titles, frontend renders via `next-intl` (see §6) |
| `getAllSeries()` | `getAllSeries(locale: Locale)` |
| `getSeriesBySlug(slug)` | `getSeriesBySlug(slug, locale: Locale)` |
| `getRelatedPosts(post, limit?)` | locale derived from `post.locale` (no separate param) |
| `getAuthorBySlug(slugOrId)` | unchanged — author bios untranslated by design |
| `getPostsByAuthor(authorId)` | `getPostsByAuthor(authorId, locale: Locale)` |

LRU cache keys take the form `${kind}:${locale}:${id}` (e.g. `post:es:introduccion-a-multisig`). The pre-existing key shapes (`post:foo`) cannot collide with the new format because the in-process cache resets on deploy.

### 3. Type layer — `src/types/newsroom.ts`

```ts
import type { Locale } from '@/i18n/routing'

export interface NewsroomPost {
  // existing fields...
  locale: Locale       // NEW — what the caller requested
  servedLocale: Locale // NEW — what the API actually served (may === 'en' as fallback)
}

export interface SeriesSummary {
  // existing fields...
  locale: Locale
  servedLocale: Locale
}

export interface SeriesDetail extends SeriesSummary {
  posts: NewsroomPost[]
}
```

Both fields mirror the public API DTO from Phase B.1's `toPublicPost` / `toPublicSeries`.

### 4. App routes — `src/app/[locale]/...`

Every page reads `locale` from `params` (already does for Phase A), threads it into `cms.ts` calls, and makes redirect targets locale-prefixed.

**`generateStaticParams` migration.** Next.js passes parent params to child `generateStaticParams`. Per-locale generation:

```ts
export async function generateStaticParams({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  try {
    const slugs = await getAllSlugs(locale)
    return slugs.map(slug => ({ slug }))
  } catch {
    return []
  }
}
```

Each locale-leg gets exactly its own slug list. `dynamicParams` stays at the Next.js default (`true`) so post-build-added translations render on demand.

**Redirect locale-prefix fix.** Today every page does `permanentRedirect(`/newsroom/${post.slug}`)` — this drops the locale prefix and would land non-EN visitors on the default locale. New form: `permanentRedirect(`/${locale}/newsroom/${post.slug}`)`.

**Render-time servedLocale handling.**
- If `post.servedLocale !== post.locale` and no redirect fired, render `<TranslationPendingBanner />` above the article body.
- Set `<article lang={post.servedLocale}>` on the article container so screen readers and search engines understand the actual content language. `<html lang>` stays the URL locale (chrome IS in the URL locale).

**Listing pages.** Pass through whatever the API returned (Q3-C decision: keep listings dense). Cards where `post.servedLocale !== post.locale` render with a `<LocaleBadge locale={post.servedLocale} />` pill.

### 5. SEO surface

**`src/app/sitemap.ts`** — for each post/series, emit one entry per locale that actually has a translation. Each entry carries `xhtml:link rel="alternate" hreflang="<x>" href="<url>"` cross-references to its sibling translations. Posts with only EN translation emit exactly one entry (no false alternates). Helper: `buildLocaleAlternates(item, baseUrl)` returns the alternate URL set; called for both posts and series.

**RSS feeds** (`src/app/[locale]/newsroom/rss.xml/route.ts`, `src/app/[locale]/academy/rss.xml/route.ts`) — pass `locale` from route segment, build per-locale feed URL, set `<language>` per item to `post.servedLocale`. Same content rule as listings (Q3-C: include all posts).

## Components

### `<TranslationPendingBanner>` — `src/components/shared/translation-pending-banner.tsx`

Renders above the article body when `servedLocale !== locale`. Static (non-dismissible) state indicator. Single-line copy, neutral styling consistent with other in-article notices. Single i18n key: `Common.translationPendingBanner` (no ICU placeholders — keeps the copy short and avoids needing locale display-name resolution at render time). Example EN copy: "This article isn't translated yet — showing English."

### `<LocaleBadge locale="en" | "es" | "zh">` — `src/components/shared/locale-badge.tsx`

Small pill on listing cards when the card's `servedLocale !== locale`. Pure indicator, no behavior. Uses `Common.localeBadge.<x>` keys (three short strings: "EN", "ES", "ZH" — typically rendered as-is but key-driven so future renaming is centralised).

Both components import `useTranslations('Common')` and live in `src/components/shared/` per the established convention.

## i18n keys

Per CLAUDE.md policy: add canonical strings to `en.json`. Replicate to `es.json` and `zh.json` with the `__TODO_TRANSLATE__ ` prefix on every string value (the prefix sits *outside* any ICU placeholders, so translators can swap the wrapped text while preserving `{name}`-style tokens verbatim). Phase A established the deep-merge silent-fallback in `src/i18n/request.ts`, which means any deep-nested key only present in `en.json` resolves to its English value automatically — but a key that exists in `es.json` with `__TODO_TRANSLATE__ ` PREFIX renders that prefixed string literally until human translators land. The visible prefix is the intentional dev signal that translation is pending. Human translation of all B.3 keys is a follow-up tracked outside this spec.

**New `Common` keys.** Two additions to en.json:

```json
{
  "Common": {
    "translationPendingBanner": "This article isn't translated yet — showing English.",
    "localeBadge": { "en": "EN", "es": "ES", "zh": "ZH" }
  }
}
```

The `translationPendingBanner` string in es.json/zh.json gets `"__TODO_TRANSLATE__ This article isn't translated yet — showing English."` until translators land. The `localeBadge` entries are 2-letter ISO codes that read identically across locales; they ship with the same EN/ES/ZH literals in all three locale files (no `__TODO_TRANSLATE__ ` prefix because there is no translation to perform).

**New `Categories` namespace** — 7 academy slugs from `src/constants/academy-categories.ts`, each with `title` and `description` (14 strings). en.json gets the canonical English copy (matching today's backend `ACADEMY_CATEGORIES[slug].{title,description}` literals); es.json and zh.json get `__TODO_TRANSLATE__ <english>` for each. Existing components rendering `category.title` / `category.description` from the API field switch to `t(`Categories.${slug}.title`)` / `t(`Categories.${slug}.description`)`. The API still returns these fields; the website ignores them. This decouples backend taxonomy from website copy.

```json
{
  "Categories": {
    "<slug>": { "title": "...", "description": "..." }
  }
}
```

## agent.md siblings

CLAUDE.md mandates that any edit to `src/app/[locale]/<route>/page.tsx` updates its sibling `agent.md` in the same commit (`scripts/check-agent-md-staleness.ts` blocks the build otherwise). For this phase, all touched routes need their agent.md content reviewed:

- `[locale]/newsroom/page.tsx` and `agent.md`
- `[locale]/newsroom/[slug]/page.tsx` and `agent.md`
- `[locale]/academy/page.tsx` and `agent.md`
- `[locale]/academy/[category]/page.tsx` and `agent.md`
- `[locale]/academy/[category]/[slug]/page.tsx` and `agent.md`
- `[locale]/academy/series/page.tsx` and `agent.md`
- `[locale]/academy/series/[slug]/page.tsx` and `agent.md`
- `[locale]/author/[slug]/page.tsx` and `agent.md`

Where the agent.md content is locale-agnostic narrative ("This route shows the newsroom listing"), no content change is needed but the staleness checker is satisfied by the page-file modification triggering a paired touch. Where dynamic agent.md synthesis depends on post fields (article-body routes), the synthesis becomes locale-aware in the same commit as the page change.

## Data flow examples

### Translated article — `/es/newsroom/introduccion-a-multisig`

1. Page reads `{ locale: 'es', slug: 'introduccion-a-multisig' }`.
2. `getPostBySlug('introduccion-a-multisig', 'es')`.
3. cms.ts cache miss for `post:es:introduccion-a-multisig`.
4. `cmsFetch('/api/v1/posts/introduccion-a-multisig', { locale: 'es' })`.
5. Backend matches `translations.es.slug`, returns post with `locale: 'es'`, `servedLocale: 'es'`, `slug: 'introduccion-a-multisig'`, ES content.
6. `post.slug === slug`: no redirect. No banner (servedLocale === locale). Renders.

### Cross-locale-slug hit — `/es/newsroom/multisig-101` for translated post

1. Backend ES-slug match fails; EN-slug match hits.
2. Returns post with `servedLocale: 'es'` (translation exists), `slug: 'introduccion-a-multisig'` (the ES slug).
3. `post.slug !== slug` → `permanentRedirect(`/es/newsroom/introduccion-a-multisig`)`.

### Untranslated post — `/es/newsroom/multisig-101` (en-only post)

1. Backend EN-slug match hits, no ES translation.
2. Returns post with `servedLocale: 'en'`, `slug: 'multisig-101'`.
3. `post.slug === slug` → no redirect. Renders with `<TranslationPendingBanner />` and `<article lang="en">`.

### Slug history — `/es/newsroom/<old-es-slug>`

1. Backend matches via slugHistory → 301 to `/api/v1/posts/<new-es-slug>?locale=es`.
2. cmsFetch follows the redirect (Node fetch default `redirect: 'follow'`), receives canonical post.
3. Page sees `post.slug !== slug` → `permanentRedirect(`/es/newsroom/<new-es-slug>`)`.

### Listing — `/es/newsroom`

1. `getAllPosts('es')` → `cmsFetch('/api/v1/posts?section=newsroom&limit=100', { locale: 'es' })`.
2. API returns array; each item carries its own `servedLocale`.
3. Cards render with `<LocaleBadge locale="en" />` for items where `servedLocale !== locale`.

## Error handling, redirects, edge cases

**Redirect priority** per article page (evaluated in order):

1. Section mismatch (academy post hit via newsroom URL): `permanentRedirect(`/${locale}/academy/${post.category}/${post.slug}`)`.
2. Slug mismatch (covers slug-history, cross-locale-slug, and any other slug normalisation): `permanentRedirect(`/${locale}/<route>/${post.slug}`)`.
3. Render.

**Banner trigger:** `post.servedLocale !== post.locale` AND no redirect fired. Only path: URL slug = EN slug, requested locale = non-EN, no translation exists for that post.

**`<article lang>` reflects content language**, not URL locale. `<html lang>` stays URL locale (chrome IS in that locale).

**Static generation:** option-A from Q2 — `generateStaticParams` accepts parent `locale`, calls `getAllSlugs(locale)`, default `dynamicParams = true` for post-build adds.

**Sitemap edge case:** EN-only post emits exactly one entry — no false alternate hreflang siblings. Avoids telling Google `/es/newsroom/<en-slug>` is the canonical Spanish page.

**RSS edge case:** every locale's feed includes all posts (matches listing rule), each item's `<language>` reflects `servedLocale`.

**Seed-loader degraded mode:** when backend is down on `/es/newsroom`, every card shows `<LocaleBadge locale="en" />`, every article renders with `<TranslationPendingBanner />`. Symmetric and self-explaining.

**Middleware legacy redirects** (`src/middleware.ts:45,51,57`): pass `'en'` — these legacy URL shapes predate locale-prefix routing and are EN-by-definition. Future-proofing legacy redirects to non-EN is out of scope.

**Revalidation budget:** unchanged (60 s lists, 300 s items). Per-locale variants get their own cache entries.

## Testing

**Unit:**

- `cms-fetch.test.ts` — locale param appended; backward-compat with two-arg `cmsFetch(path, 300)` signature; URLSearchParams handling preserves existing query strings.
- `cms.test.ts` (new file or extend existing) — per-locale cache isolation (calling `getAllPosts('en')` then `getAllPosts('es')` makes two distinct cmsFetch calls); seed-loader fallback marks returned posts with `servedLocale: 'en'`.
- `seed-loader.test.ts` — accepts locale param, stamps `locale` and `servedLocale: 'en'`.

**Component:**

- `translation-pending-banner.test.tsx` — copy renders from i18n; ICU `{locale}` placeholder substitutes correctly.
- `locale-badge.test.tsx` — variant per locale; copy from i18n keys.

**Integration:**

- `sitemap.test.ts` (new) — hreflang alternates emitted for translated posts; EN-only posts emit single entry; series follow same rule.
- RSS route tests — per-locale feed URL, `<language>` per item from `servedLocale`.

**Existing tests** must continue to pass. The cmsFetch backward-compat overload is mandatory.

## Out of scope / migration safety / known follow-ups

**Out of scope** for B.3:

- Author bio translation (backend doesn't support per-locale author entities; future phase).
- Tag translation (tags are language-neutral identifiers by design).
- CMS dashboard admin (B.2 already covered).
- Phase A static-string completeness (separate effort; this phase only spillovers `Categories.*` plus B.3-specific keys).
- Human translation of newly added i18n keys (es.json/zh.json placeholders are tracked and translated via the project's normal translation workflow).

**Migration safety:**

- No production data migration — production is fresh per the B.1 decision.
- `cmsFetch` second-arg overload preserves all existing callers.
- `NewsroomPost` / `SeriesSummary` / `SeriesDetail` add fields only; no consumer outside ssp-website depends on these types.
- LRU cache key change is in-process; resets on deploy. No cache invalidation needed.

**Known follow-ups:**

- Human translation of `Common.translationPendingBanner`, `Common.localeBadge.*`, and all `Categories.*` strings in es.json and zh.json (placeholders ship in this phase per CLAUDE.md policy).
- Optional: per-locale OG images / hero artwork (currently the same image per post across locales).

## Acceptance criteria

1. `/en/newsroom`, `/es/newsroom`, `/zh/newsroom` all render their listing pages, each card showing a `<LocaleBadge>` when the card's `servedLocale !== locale`.
2. `/es/newsroom/<es-slug-of-translated-post>` renders the Spanish article with no banner.
3. `/es/newsroom/<en-slug-of-translated-post>` redirects to the canonical Spanish slug URL.
4. `/es/newsroom/<en-slug-of-untranslated-post>` renders English content with `<TranslationPendingBanner />` and `<article lang="en">`.
5. `/es/newsroom/<old-slug>` (slug-history hit) redirects to the canonical current-locale slug.
6. Sitemap entries for translated posts carry hreflang alternate cross-references; EN-only posts emit a single entry.
7. `/es/newsroom/rss.xml` returns a valid RSS 2.0 feed with per-item `<language>` reflecting `servedLocale`.
8. `npm run check-all` passes (typecheck, lint, tests, agent-md-staleness, public-safe).
9. All touched `[locale]/<route>/page.tsx` files have corresponding `agent.md` updates in the same commit.
