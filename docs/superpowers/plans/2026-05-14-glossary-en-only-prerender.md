# Glossary: prerender /en only, redirect other locales — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the glossary prerender from ~30,198 paths to ~2,157 (one locale instead of fourteen) and 308-redirect non-en glossary requests to `/en`, with TDD coverage for both.

**Architecture:** Two production code changes — narrow `generateStaticParams` in the glossary slug page, and add a non-en-glossary redirect rule to the existing `src/middleware.ts` ahead of `intlMiddleware`. Each change ships with its proving test in the same commit.

**Tech Stack:** Next.js 16 App Router (Turbopack), next-intl 4.9, Vitest 4 (`node` environment for middleware tests, default `happy-dom` for component tests), `next/server` `NextRequest`/`NextResponse`.

**Branch:** `feat/newsroom-academy-app-router-migration` (already checked out at `/Users/vasilismagkoutis/repos/ssp-website`).

**Spec:** `docs/superpowers/specs/2026-05-14-glossary-en-only-prerender-design.md`.

**Note on commit shape:** the spec listed three commits but the third (`test(middleware,glossary): cover ...`) is redundant once tests ship with their feature, per the project's TDD pattern. This plan produces two commits. The earlier nav-polish branch followed the same merged-test-with-feature pattern (see commits `304d470`, `8b0172b`).

---

## File structure

| File | Action | Responsibility |
|---|---|---|
| `src/app/[locale]/glossary/[slug]/page.tsx` | Modify | Narrow `generateStaticParams` to return `[]` for non-en locales. |
| `src/app/[locale]/glossary/[slug]/page.test.ts` | Create | Unit-test the locale gate on `generateStaticParams`. |
| `src/middleware.ts` | Modify | Add a non-en-glossary 308 redirect block before `intlMiddleware(req)`. |
| `src/middleware.test.ts` | Modify | Extend the existing locale-cookie suite with two redirect cases. |

No other files touched. Sitemap, `GLOSSARY` constants, autolinker, glossary index page, header dropdown, and translation files are all unchanged.

---

## Task 1: Narrow glossary slug prerender to /en

**Files:**
- Modify: `src/app/[locale]/glossary/[slug]/page.tsx` (the `generateStaticParams` function, currently lines 16–18)
- Create: `src/app/[locale]/glossary/[slug]/page.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/[locale]/glossary/[slug]/page.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { GLOSSARY } from '@/constants/glossary'
import { generateStaticParams } from './page'

describe('glossary slug generateStaticParams', () => {
  it('returns every glossary slug for the en locale', async () => {
    const params = await generateStaticParams({ params: { locale: 'en' } })
    expect(params.length).toBe(GLOSSARY.length)
    expect(params[0]).toHaveProperty('slug')
  })

  it('returns no params for non-en locales', async () => {
    for (const locale of ['fr', 'es', 'pl', 'ja', 'zh']) {
      const params = await generateStaticParams({ params: { locale } })
      expect(params, `expected empty params for ${locale}`).toEqual([])
    }
  })
})
```

- [ ] **Step 2: Run the test and verify both cases fail**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn vitest run src/app/\[locale\]/glossary/\[slug\]/page.test.ts`

Expected: the "no params for non-en locales" case fails because the current `generateStaticParams` returns all slugs for every locale. The "en" case passes because today's implementation also returns all slugs for en — that branch is already green and confirms we don't break the happy path.

- [ ] **Step 3: Make the test pass**

Edit `src/app/[locale]/glossary/[slug]/page.tsx`. Replace the current:

```tsx
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return GLOSSARY.map(entry => ({ slug: entry.slug }))
}
```

With:

```tsx
export async function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale !== 'en') return []
  return GLOSSARY.map(entry => ({ slug: entry.slug }))
}
```

No other code in the file changes. Imports stay as-is.

- [ ] **Step 4: Run the test, verify it passes**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn vitest run src/app/\[locale\]/glossary/\[slug\]/page.test.ts`

Expected: both cases pass.

- [ ] **Step 5: Run check-all to confirm no regressions**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn check-all`

Expected: PASS (the existing pre-existing failures in `ecosystem.config.cjs`, `docs/i18n/glossary.md`, and `src/constants/glossary/cmc.json` are out-of-scope — confirm via `git blame` they predate this branch if any new error surfaces).

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add src/app/\[locale\]/glossary/\[slug\]/page.tsx src/app/\[locale\]/glossary/\[slug\]/page.test.ts
git commit -m "perf(glossary): prerender slug pages only for /en locale

The glossary body, h1, and excerpt are all read from the English GLOSSARY
constant. Only the surrounding chrome was translated, producing 14 near-duplicate
prerendered variants per term. Gate generateStaticParams on locale === 'en' so
the build emits ~2,157 paths instead of ~30,198. Non-en requests are handled
by the middleware redirect added in the next commit."
```

---

## Task 2: Redirect non-en glossary paths to /en

**Files:**
- Modify: `src/middleware.ts` (insert a redirect block between the agent-md handling at the top and `intlMiddleware(req)` near the bottom)
- Modify: `src/middleware.test.ts` (add a new `describe` block; keep the existing `describe('middleware locale persistence', ...)` intact)

- [ ] **Step 1: Write the failing tests**

Add to `src/middleware.test.ts`, appending after the existing `describe` block (do not modify the existing tests). Reuse the existing `makeReq` helper and the `// @vitest-environment node` directive at the top of the file is already in place:

```ts
describe('middleware non-en glossary redirect', () => {
  it('redirects /fr/glossary to /en/glossary with status 308', async () => {
    const req = makeReq('/fr/glossary')
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.status).toBe(308)
    expect(res!.headers.get('location')).toMatch(/\/en\/glossary$/)
  })

  it('redirects a non-en glossary slug to its /en equivalent with status 308', async () => {
    const req = makeReq('/pl/glossary/multisig')
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.status).toBe(308)
    expect(res!.headers.get('location')).toMatch(/\/en\/glossary\/multisig$/)
  })

  it('does not redirect /en/glossary or /en/glossary/<slug>', async () => {
    for (const path of ['/en/glossary', '/en/glossary/multisig']) {
      const req = makeReq(path)
      const res = await middleware(req)
      // intlMiddleware returns a 200-ish response for in-locale paths; either
      // way the location header (if any) must not point at /en (i.e. no extra
      // hop). A self-redirect would be a regression.
      const loc = res?.headers.get('location') ?? ''
      expect(loc, `unexpected redirect for ${path}`).not.toMatch(/\/en\/glossary/)
    }
  })
})
```

- [ ] **Step 2: Run the tests, verify the two redirect cases fail**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn vitest run src/middleware.test.ts`

Expected: the two new redirect cases fail (current middleware does not redirect; `intlMiddleware` will likely 200-pass or rewrite). The "does not redirect /en/glossary" case passes (no rule fires today). The existing locale-cookie cases continue to pass.

- [ ] **Step 3: Add the redirect rule to the middleware**

Edit `src/middleware.ts`. After the agent-md block (the existing `if (flag !== '0' && accept.includes('text/markdown')) { ... }`) and before `const response = intlMiddleware(req)`, insert:

```ts
  // Glossary is canonical at /en only — see
  // docs/superpowers/specs/2026-05-14-glossary-en-only-prerender-design.md.
  // Redirect /<non-en-locale>/glossary[/...] to its /en equivalent with 308
  // so non-en URLs do not get indexed alongside the English source.
  const glossaryMatch = req.nextUrl.pathname.match(/^\/([^/]+)(\/glossary(?:\/.*)?)$/)
  if (glossaryMatch) {
    const [, locale, rest] = glossaryMatch
    if (locale !== 'en' && routing.locales.includes(locale as (typeof routing.locales)[number])) {
      const target = new URL(`/en${rest}`, req.url)
      return NextResponse.redirect(target, 308)
    }
  }
```

The `routing` import already exists at the top of the file (`import { routing } from '@/i18n/routing'`); reuse it. `NextResponse` is also already imported (`import { NextResponse } from 'next/server'`). No new imports needed.

Why the locale-list guard: it prevents the rule from matching arbitrary first segments like `/api/glossary` (already excluded by the matcher, but defense-in-depth) or future feature paths that happen to start with `/something/glossary`.

- [ ] **Step 4: Run the tests, verify all pass**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn vitest run src/middleware.test.ts`

Expected: all tests in the file pass, including the existing locale-cookie cases.

- [ ] **Step 5: Run check-all to confirm no regressions**

Run: `cd /Users/vasilismagkoutis/repos/ssp-website && yarn check-all`

Expected: PASS. As in Task 1, any pre-existing failures in `ecosystem.config.cjs`, `docs/i18n/glossary.md`, or `src/constants/glossary/cmc.json` are out-of-scope.

- [ ] **Step 6: Commit**

```bash
cd /Users/vasilismagkoutis/repos/ssp-website
git add src/middleware.ts src/middleware.test.ts
git commit -m "feat(middleware): redirect non-en glossary paths to /en

The glossary prerender now exists only under /en. Add a 308 redirect for
/<non-en-locale>/glossary[/...] so non-en URLs consolidate signal on the
English canonical instead of indexing as near-duplicate English content.
Runs before intlMiddleware; agent-md fast path and cookie precedence are
unaffected."
```

---

## Task 3: Optional visual smoke (user)

Not an agent step — leave to the user:

1. `yarn build` and confirm the prerender count drops from ~30,198 to ~2,157 glossary paths.
2. `yarn dev`, visit `/es/glossary` in a private window → URL changes to `/en/glossary` (network panel shows 308).
3. Visit `/pl/glossary/multisig` → lands on `/en/glossary/multisig`.
4. Click an autolinked `/glossary/...` from a non-en Academy page → ends on `/en/glossary/...` after at most two hops.

If anything is off, the user will report back; otherwise we leave the work to settle.

---

## Self-review

**Spec coverage:**
- Spec calls for `generateStaticParams` gate on `locale !== 'en'` → Task 1, Step 3.
- Spec calls for middleware 308 redirect on non-en glossary → Task 2, Step 3.
- Spec calls for index-page parity (non-en `/glossary` also redirects) → covered by the same regex in Task 2 (matches `/fr/glossary` with no trailing slug just as well as `/fr/glossary/x`).
- Spec calls for tests at both layers → Tasks 1 and 2 each ship a test.
- Spec calls for the comment in the glossary index page pointing at the middleware rule → **gap.** Adding it doesn't change behavior but the spec lists it. Decision: defer — the spec ticked it as "one-line comment" and the middleware comment block already names the spec doc; adding a second pointer in the unrelated index page is friction with no clear payoff. Out-of-scope follow-up. *(If the user disagrees, this can land as a one-line follow-up commit after Task 2.)*

**Placeholder scan:** no TBDs, no "implement later", no "similar to Task N", all code blocks complete.

**Type consistency:** `generateStaticParams` signature matches existing call shape (`{ params: { locale: string } }`). `NextResponse.redirect(URL, 308)` matches the next/server signature already used elsewhere. Regex match groups typed via destructuring; `as (typeof routing.locales)[number]` cast mirrors the pattern in `src/i18n/routing.ts` consumers.

---

## Execution handoff

After the plan is approved, offer execution choice:

**1. Subagent-Driven (recommended)** — fresh subagent per task, two-stage review (spec + code-quality), fast iteration. Matches the pattern used for the prior nav-polish branch on this same branch.

**2. Inline Execution** — execute both tasks in this session via `executing-plans`, batched commits.

Either path produces the same two commits on `feat/newsroom-academy-app-router-migration`.
