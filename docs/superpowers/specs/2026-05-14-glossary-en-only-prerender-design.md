# Glossary: prerender /en only, redirect other locales — design

**Status:** approved (pre-implementation)
**Date:** 2026-05-14
**Branch:** `feat/newsroom-academy-app-router-migration`
**Scope:** Cut glossary prerender from 14 locales to one, redirect non-en glossary requests to `/en`.

## Motivation

`yarn build` reports 30,198 prerendered paths under `/[locale]/glossary/[slug]` — 14 locales × 2,157 entries. Inspecting `src/app/[locale]/glossary/[slug]/page.tsx` shows the body, the `<h1>{entry.title}` and the markdown excerpt are all read from `GLOSSARY` (English source). Only the surrounding chrome (back-link label, "content in English" banner, the `{term} | Glossary` SEO-title wrapper) is translated via `getTranslations`. The autolinker emits `/glossary/<slug>` from `auto-link-post-content.ts`, which next-intl rewrites to the user's locale prefix — so Google crawls every variant and finds 14 near-duplicate English pages per term.

This pattern hurts more than it helps:

- **SEO:** Google reads page language from the body, not the `<title>`. Fourteen near-duplicates with translated chrome around English content reads as either thin localized content or, if surfaced as hreflang alternates, misleading hreflang. The translated SEO title gives a tiny nudge in non-en SERPs but the language mismatch typically caps the gain.
- **Build cost:** ~28k of the 30k prerendered paths add zero unique signal but multiply build memory, build time, and CDN asset count.

Glossary is fundamentally a reference section that ships English-only. Treat it that way at the URL level and stop sending Google duplicate-language signals.

## Decisions (locked)

- **Canonical scope:** the glossary lives at `/en/glossary` and `/en/glossary/<slug>`. No other locale prerenders glossary pages.
- **Redirect status:** 308 (permanent, method-preserving). SEO-equivalent to 301 and the recommended Next.js default for static-shape redirects.
- **Mechanism:** middleware redirect inside `src/middleware.ts`, evaluated **before** `intlMiddleware`. Runs in the existing node runtime, no new edge surface.
- **Listing page parity:** non-en `/<locale>/glossary` (the index) also redirects to `/en/glossary`. Otherwise users would land on a page rendering translated chrome around English entry cards — same SEO and UX problem at smaller scale.
- **`locale !== 'en'` banner JSX in the slug page:** left untouched. The branch becomes unreachable after this change, but removing it is scope creep; if a future change brings real per-locale glossary content the branch is ready.
- **Autolinker output (`/glossary/<slug>` with no locale prefix):** unchanged. Clicks from a non-en reader will produce a double redirect (next-intl rewrites no-prefix → `/es/glossary/...`, then our middleware redirects → `/en/glossary/...`). Each hop is ~10–20 ms; optimizing to a single hop is an out-of-scope follow-up.

## Architecture

### Component touch list

| File | Change |
|---|---|
| `src/middleware.ts` | After the agent-md fast path and before `intlMiddleware(req)`, match `/<non-en-locale>/glossary` and `/<non-en-locale>/glossary/<slug>` and return `NextResponse.redirect(new URL('/en' + restOfPath, req.url), 308)`. Locales come from `routing.locales`; "non-en" = anything except `en`. |
| `src/app/[locale]/glossary/[slug]/page.tsx` | `generateStaticParams` returns `[]` when `params.locale !== 'en'`; otherwise returns the existing `GLOSSARY.map(...)`. Drops 13 × 2,157 ≈ 28k paths from the build. |
| `src/app/[locale]/glossary/page.tsx` | No code change required — the page is server-rendered and middleware intercepts before this component is hit. Add a one-line comment pointing future readers at the middleware rule. |

### What does NOT change

- The `/en/glossary/...` routes themselves — fully prerendered, fully cached, identical behavior.
- `src/app/sitemap.ts` — glossary URLs were never emitted; no diff.
- `src/constants/glossary/*` — same English entry data.
- `src/lib/auto-link-post-content.ts`, `glossary-linker.ts`, `build-fallback-term-map.ts` — still emit `/glossary/<slug>`. The double-hop is acceptable for v1.
- The Learn dropdown's `/glossary` link in `src/components/header/learn-dropdown.tsx` — next-intl resolves to `/<locale>/glossary`, the middleware redirects to `/en/glossary`. One hop on click, no UX surprise.

### Redirect flow

1. **Spanish user clicks an autolinker `/glossary/multisig` link.**
   - next-intl middleware sees no locale prefix → rewrites to `/es/glossary/multisig` (based on `NEXT_LOCALE=es` cookie).
   - Our new rule sees `/es/glossary/multisig` → 308 → `/en/glossary/multisig`.
   - Page renders.
2. **Direct visit to `/fr/glossary`.**
   - Our new rule sees `/fr/glossary` → 308 → `/en/glossary`.
   - Index page renders.
3. **Visit to `/en/glossary/multisig`.**
   - No redirect. `intlMiddleware` handles it. Renders.
4. **Bot crawl of stale `/de/glossary/bitcoin` link.**
   - 308 → `/en/glossary/bitcoin`. Google consolidates signal on `/en/glossary/bitcoin`.

## Testing

### Updated tests

- `src/middleware.test.ts` — add two cases that complement the existing locale-cookie suite:
  - `/fr/glossary` request → 308 with `Location: /en/glossary`.
  - `/pl/glossary/multisig` request → 308 with `Location: /en/glossary/multisig`.
  - Existing cookie-precedence tests remain green (the new rule fires only for `/<locale>/glossary[...]`).

### New tests

- `src/app/[locale]/glossary/[slug]/page.test.ts` — verify the prerender gate:
  - `generateStaticParams({ params: { locale: 'fr' } })` returns `[]`.
  - `generateStaticParams({ params: { locale: 'en' } })` returns 2,157 entries (one per glossary slug).

### Manual smoke

`yarn dev`, then in a private window:

1. Visit `/es/glossary` → URL changes to `/en/glossary`. Browser network panel shows a 308.
2. Visit `/pl/glossary/multisig` → URL changes to `/en/glossary/multisig`. Page renders.
3. Click a `/glossary/<slug>` autolink from `/es/academy/...` → lands on `/en/glossary/<slug>` after two redirects. Acceptable for v1.
4. `yarn build` → confirm the prerender count drops from ~30k to ~2.2k glossary pages.

## Out-of-scope follow-ups

- **Single-hop autolinks:** teach `auto-link-post-content.ts` (or its callers) to emit `/en/glossary/<slug>` directly, eliminating the next-intl rewrite step.
- **Footer glossary link parity:** if the footer has its own `/glossary` link wired through next-intl, the same redirect catches it; verify post-launch.
- **Banner cleanup:** remove the now-dead `locale !== 'en'` JSX from `src/app/[locale]/glossary/[slug]/page.tsx` if it bothers a future reader.
- **hreflang audit:** confirm no sitemap or page-level hreflang lists translated glossary alternates (current sitemap doesn't; verify there's no per-page `<link rel="alternate">` for glossary entries).

## Risks

- **External backlinks to `/<locale>/glossary/<slug>`:** unlikely (the section is newly translated and not surfaced in sitemap), and 308 preserves them. Risk is low.
- **Crawler thrash during the first crawl after deploy:** Google will re-process the 28k formerly-indexed URLs as 308s and consolidate. Standard transition; no action needed beyond letting it run.
- **Double redirect cost on autolink clicks:** ~30 ms extra on first click; not user-visible in practice. Out-of-scope follow-up addresses if anyone complains.

## Commit shape

Three atomic commits on `feat/newsroom-academy-app-router-migration` (no AI co-author per `CLAUDE.md`):

1. `perf(glossary): prerender slug pages only for /en locale`
2. `feat(middleware): redirect non-en glossary paths to /en`
3. `test(middleware,glossary): cover non-en glossary redirect + prerender gate`

`yarn check-all` passes after each.
