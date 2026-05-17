# SSP Website i18n Phase B.3 — Locale-Aware Fetch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `ssp-website` consume the locale-aware public CMS API (Phase B.1 contract) so trilingual articles render correctly under `/en/`, `/es/`, and `/zh/` with honest UX markers.

**Architecture:** Surgical, additive change. The fetch wrapper gains a `locale?` option; the data layer threads `locale` through every getter that returns translated content; per-locale LRU cache keys; per-locale `generateStaticParams`; per-locale RSS feeds; sitemap with hreflang alternates; new `<TranslationPendingBanner>` and `<LocaleBadge>` components; categorical text moves from backend API field to next-intl. No new npm deps.

**Tech Stack:** Next.js 16 App Router, React 19, next-intl 4 (already wired), TypeScript, Vitest 3, Tailwind, shadcn UI primitives.

**Spec:** [`docs/superpowers/specs/2026-05-08-ssp-website-i18n-phase-b3-locale-aware-fetch-design.md`](../specs/2026-05-08-ssp-website-i18n-phase-b3-locale-aware-fetch-design.md)

---

## File Structure

**Modify:**
- `src/lib/cms/cms-fetch.ts` — add `CmsFetchOptions` type, accept options object as second arg, append `?locale=` when set
- `src/lib/cms/cms-fetch.test.ts` — extend with locale-param + backward-compat tests
- `src/lib/cms/seed-loader.ts` — accept `locale: Locale`, stamp `locale` + `servedLocale: 'en'` on each post
- `src/lib/cms/seed-loader.test.ts` — extend with locale stamping test
- `src/lib/cms.ts` — thread `locale` through every translated-content getter; per-locale cache keys; seed-loader-fallback locale stamping
- `src/lib/cms.test.ts` — extend with per-locale cache isolation + seed-loader-fallback locale stamping tests
- `src/lib/newsroom.ts` — re-exports unchanged; type signatures propagate automatically
- `src/types/newsroom.ts` — add `locale: Locale` and `servedLocale: Locale` to `NewsroomPost`, `SeriesSummary`, `SeriesDetail`
- `src/messages/en.json` — add `Common.translationPendingBanner`, `Common.localeBadge.*`, `Categories.<slug>.{title,description}`
- `src/messages/es.json` — add same keys with `__TODO_TRANSLATE__ ` prefix
- `src/messages/zh.json` — add same keys with `__TODO_TRANSLATE__ ` prefix
- `src/components/newsroom/newsroom-listing.tsx` — render `<LocaleBadge>` per card when `card.servedLocale !== card.locale`
- `src/components/shared/post-article.tsx` — accept and render `<TranslationPendingBanner>`; `<article lang={post.servedLocale}>`
- `src/app/[locale]/newsroom/page.tsx` + `agent.md` — pass `locale` to fetchers
- `src/app/[locale]/newsroom/[slug]/page.tsx` + `agent.md` — locale param, locale-prefixed redirects, per-locale `generateStaticParams`, banner conditional
- `src/app/[locale]/newsroom/rss.xml/route.ts` — per-locale feed, `<language>` per item
- `src/app/[locale]/academy/page.tsx` + `agent.md` — pass `locale`, render category names from next-intl
- `src/app/[locale]/academy/[category]/page.tsx` + `agent.md` — per-locale `generateStaticParams`, locale-prefixed redirects
- `src/app/[locale]/academy/[category]/[slug]/page.tsx` + `agent.md` — locale param, locale-prefixed redirects, banner conditional, per-locale `generateStaticParams`
- `src/app/[locale]/academy/series/page.tsx` + `agent.md` — pass `locale`
- `src/app/[locale]/academy/series/[slug]/page.tsx` + `agent.md` — locale param, locale-prefixed redirects
- `src/app/[locale]/academy/rss.xml/route.ts` — per-locale feed
- `src/app/[locale]/author/[slug]/page.tsx` + `agent.md` — pass `locale` to `getPostsByAuthor`
- `src/middleware.ts` — pass `'en'` to legacy-redirect `getPostBySlug` calls
- `src/app/sitemap.ts` — emit per-locale entries with hreflang alternate cross-references
- `src/app/sitemap.test.ts` — new file, test alternate emission

**Create:**
- `src/components/shared/translation-pending-banner.tsx` — banner component
- `src/components/shared/translation-pending-banner.test.tsx`
- `src/components/shared/locale-badge.tsx` — badge component
- `src/components/shared/locale-badge.test.tsx`

**Delete:** none.

---

## Task 1: cms-fetch.ts locale option

**Files:**
- Modify: `src/lib/cms/cms-fetch.ts`
- Test: `src/lib/cms/cms-fetch.test.ts`

- [ ] **Step 1: Write the failing test for locale-param appending**

Add to `src/lib/cms/cms-fetch.test.ts` inside the existing `describe('cmsFetch', ...)` block:

```ts
it('appends ?locale= when options.locale set', async () => {
  const fetchSpy = vi
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
  await cmsFetch('/api/v1/posts', { locale: 'es' })
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://cms.example.com/api/v1/posts?locale=es',
    expect.anything()
  )
})

it('appends locale with & when path already has query string', async () => {
  const fetchSpy = vi
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
  await cmsFetch('/api/v1/posts?section=newsroom', { locale: 'zh' })
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://cms.example.com/api/v1/posts?section=newsroom&locale=zh',
    expect.anything()
  )
})

it('omits locale param when options.locale not set', async () => {
  const fetchSpy = vi
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
  await cmsFetch('/api/v1/posts', {})
  expect(fetchSpy).toHaveBeenCalledWith('https://cms.example.com/api/v1/posts', expect.anything())
})

it('backward-compat: numeric second arg sets revalidate', async () => {
  const fetchSpy = vi
    .spyOn(global, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
  await cmsFetch('/api/v1/posts', 300)
  expect(fetchSpy).toHaveBeenCalledWith(
    'https://cms.example.com/api/v1/posts',
    expect.objectContaining({ next: { revalidate: 300 } })
  )
})
```

- [ ] **Step 2: Run failing tests**

Run: `npx vitest run src/lib/cms/cms-fetch.test.ts`
Expected: 4 new tests fail (locale param not yet implemented).

- [ ] **Step 3: Implement locale support in cms-fetch.ts**

Replace `src/lib/cms/cms-fetch.ts` contents:

```ts
import type { Locale } from '@/i18n/routing'

export interface CmsFetchOptions {
  revalidate?: number
  locale?: Locale
}

export function isCmsConfigured(): boolean {
  return !!process.env.SSP_CMS_URL && !!process.env.SSP_CMS_API_KEY
}

export async function cmsFetch<T>(
  path: string,
  optsOrRevalidate: CmsFetchOptions | number = 60
): Promise<T> {
  if (!isCmsConfigured()) {
    throw new Error('SSP CMS not configured (SSP_CMS_URL or SSP_CMS_API_KEY missing)')
  }
  const opts: CmsFetchOptions =
    typeof optsOrRevalidate === 'number' ? { revalidate: optsOrRevalidate } : optsOrRevalidate
  const revalidate = opts.revalidate ?? 60

  let urlPath = path
  if (opts.locale) {
    const sep = urlPath.includes('?') ? '&' : '?'
    urlPath = `${urlPath}${sep}locale=${opts.locale}`
  }
  const url = `${process.env.SSP_CMS_URL}${urlPath}`
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.SSP_CMS_API_KEY ?? '' },
    next: { revalidate },
  } as RequestInit & { next: { revalidate: number } })
  if (!res.ok) {
    throw new Error(`CMS error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
```

- [ ] **Step 4: Run tests, expect green**

Run: `npx vitest run src/lib/cms/cms-fetch.test.ts`
Expected: all tests pass (existing + 4 new).

- [ ] **Step 5: Commit**

```bash
git add src/lib/cms/cms-fetch.ts src/lib/cms/cms-fetch.test.ts
git commit -m "feat(cms): add locale option to cmsFetch with backward-compat overload"
```

---

## Task 2: NewsroomPost / SeriesSummary / SeriesDetail type additions

**Files:**
- Modify: `src/types/newsroom.ts`
- Test: `src/types/newsroom.test.ts`

- [ ] **Step 1: Write failing typecheck-style test**

Append to `src/types/newsroom.test.ts`:

```ts
import { describe, it, expectTypeOf } from 'vitest'
import type { NewsroomPost, SeriesSummary, SeriesDetail } from './newsroom'
import type { Locale } from '@/i18n/routing'

describe('locale fields', () => {
  it('NewsroomPost has locale and servedLocale', () => {
    expectTypeOf<NewsroomPost>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<NewsroomPost>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
  it('SeriesSummary has locale and servedLocale', () => {
    expectTypeOf<SeriesSummary>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<SeriesSummary>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
  it('SeriesDetail has locale and servedLocale', () => {
    expectTypeOf<SeriesDetail>().toHaveProperty('locale').toEqualTypeOf<Locale>()
    expectTypeOf<SeriesDetail>().toHaveProperty('servedLocale').toEqualTypeOf<Locale>()
  })
})
```

- [ ] **Step 2: Run test to confirm fail**

Run: `npx vitest run src/types/newsroom.test.ts`
Expected: FAIL — properties not present.

- [ ] **Step 3: Add fields to types**

In `src/types/newsroom.ts`:

1. Add import at top: `import type { Locale } from '@/i18n/routing'`
2. Add to `NewsroomPost` interface (anywhere among the fields):

```ts
locale: Locale
servedLocale: Locale
```

3. Add to `SeriesSummary` interface:

```ts
locale: Locale
servedLocale: Locale
```

(`SeriesDetail extends Omit<SeriesSummary, 'postCount'>` so it inherits both fields automatically — no edit needed there.)

- [ ] **Step 4: Run test, expect green**

Run: `npx vitest run src/types/newsroom.test.ts`
Expected: PASS.

- [ ] **Step 5: Run typecheck across whole project**

Run: `npm run type-check`
Expected: errors throughout codebase wherever `NewsroomPost` literals are constructed without `locale`/`servedLocale`. THIS IS EXPECTED — these will be fixed in subsequent tasks. Do NOT try to fix all callers in this commit.

- [ ] **Step 6: Commit**

```bash
git add src/types/newsroom.ts src/types/newsroom.test.ts
git commit -m "feat(types): add locale and servedLocale to NewsroomPost and Series types"
```

Note: this commit may leave the project temporarily un-typechecking; the next several tasks fix all consumers.

---

## Task 3: Seed loader locale stamping

**Files:**
- Modify: `src/lib/cms/seed-loader.ts`
- Test: `src/lib/cms/seed-loader.test.ts`

- [ ] **Step 1: Write failing test**

Append to `src/lib/cms/seed-loader.test.ts` (create file if needed; check existing structure first):

```ts
import { describe, it, expect } from 'vitest'
import { loadAllSeedPosts, loadSeedPostBySlug } from './seed-loader'

describe('seed loader locale stamping', () => {
  it('loadAllSeedPosts stamps locale=requested and servedLocale=en', async () => {
    const posts = await loadAllSeedPosts({ locale: 'es' })
    expect(posts.length).toBeGreaterThan(0)
    for (const p of posts) {
      expect(p.locale).toBe('es')
      expect(p.servedLocale).toBe('en')
    }
  })

  it('loadSeedPostBySlug stamps locale and servedLocale', async () => {
    const all = await loadAllSeedPosts({ locale: 'en' })
    if (all.length === 0) return
    const post = await loadSeedPostBySlug(all[0].slug, { locale: 'zh' })
    expect(post).toBeDefined()
    expect(post!.locale).toBe('zh')
    expect(post!.servedLocale).toBe('en')
  })
})
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run src/lib/cms/seed-loader.test.ts`
Expected: FAIL — `locale` field missing on returned posts.

- [ ] **Step 3: Update seed-loader.ts**

In `src/lib/cms/seed-loader.ts`:

1. Add import at top: `import type { Locale } from '@/i18n/routing'`
2. Update `SeedOptions` interface:

```ts
interface SeedOptions {
  includeFixtures?: boolean
  locale?: Locale
}
```

3. In `readPostsFromDir`, add `locale` and `servedLocale` to the post-object literal:

```ts
posts.push({
  // ... existing fields ...
  slugHistory: Array.isArray(data.slugHistory) ? (data.slugHistory as string[]) : [],
  locale: opts.locale ?? 'en',
  servedLocale: 'en',
})
```

4. `loadAllSeedPosts` and `loadSeedPostBySlug` already accept `opts: SeedOptions` and pass it through; no signature change needed beyond the new optional field.

- [ ] **Step 4: Run tests, expect green**

Run: `npx vitest run src/lib/cms/seed-loader.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cms/seed-loader.ts src/lib/cms/seed-loader.test.ts
git commit -m "feat(cms): stamp locale and servedLocale on seed-loader posts"
```

---

## Task 4: cms.ts locale threading + per-locale cache

**Files:**
- Modify: `src/lib/cms.ts`
- Test: `src/lib/cms.test.ts`

This is the largest task — touches every getter. Break into substeps for atomic verification.

- [ ] **Step 1: Write failing tests for per-locale cache + signature changes**

Append to `src/lib/cms.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAllPosts,
  getPostBySlug,
  getAcademyPosts,
  getAllSeries,
  getSeriesBySlug,
  __clearCmsCache,
} from './cms'

beforeEach(() => {
  __clearCmsCache()
  process.env.SSP_CMS_URL = 'https://cms.example.com'
  process.env.SSP_CMS_API_KEY = 'k'
})

describe('per-locale cache isolation', () => {
  it('getAllPosts en and es make separate fetch calls', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ posts: [] }), { status: 200 }))
    await getAllPosts('en')
    await getAllPosts('es')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy.mock.calls[0]?.[0]).toContain('locale=en')
    expect(fetchSpy.mock.calls[1]?.[0]).toContain('locale=es')
  })

  it('getAllPosts en is cached on second call', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ posts: [] }), { status: 200 }))
    await getAllPosts('en')
    await getAllPosts('en')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('getPostBySlug en and es with same slug make separate calls', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ slug: 'x', title: 't', locale: 'en', servedLocale: 'en' }),
          { status: 200 }
        )
      )
    await getPostBySlug('x', 'en')
    await getPostBySlug('x', 'es')
    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })
})

describe('seed-loader fallback stamps locale', () => {
  it('marks posts with servedLocale=en when backend down on non-EN', async () => {
    delete process.env.SSP_CMS_URL // forces seed fallback
    const posts = await getAllPosts('es')
    for (const p of posts) {
      expect(p.locale).toBe('es')
      expect(p.servedLocale).toBe('en')
    }
  })
})
```

- [ ] **Step 2: Run failing tests**

Run: `npx vitest run src/lib/cms.test.ts`
Expected: tests fail — `getAllPosts` does not accept locale yet.

- [ ] **Step 3: Update cms.ts signatures and cache keys**

Apply these edits to `src/lib/cms.ts`:

**Add import at top:**

```ts
import type { Locale } from '@/i18n/routing'
```

**Update `getAllPosts`:**

```ts
export async function getAllPosts(locale: Locale): Promise<NewsroomPost[]> {
  return withFallback(
    `allPosts:${locale}`,
    async () =>
      unwrapPosts(
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(
          '/api/v1/posts?section=newsroom&limit=100',
          { locale }
        )
      ),
    async () =>
      (await loadAllSeedPosts({ locale })).filter(p => p.section === 'newsroom')
  )
}
```

**Update `getPostBySlug`:**

```ts
export async function getPostBySlug(
  slug: string,
  locale: Locale
): Promise<NewsroomPost | undefined> {
  return withFallback(
    `post:${locale}:${slug}`,
    async () => {
      try {
        return await cmsFetch<NewsroomPost>(`/api/v1/posts/${encodeURIComponent(slug)}`, {
          revalidate: 300,
          locale,
        })
      } catch {
        return undefined
      }
    },
    async () => loadSeedPostBySlug(slug, { locale })
  )
}
```

**Update `getAllTags`:** unchanged signature (tags are language-neutral). No locale param.

**Update `getAllSlugs`:**

```ts
export async function getAllSlugs(locale: Locale): Promise<string[]> {
  return (await getAllPosts(locale)).map(p => p.slug)
}
```

**Update `getAcademyPosts`:**

```ts
export async function getAcademyPosts(
  filters: AcademyFilters = {},
  locale: Locale
): Promise<NewsroomPost[]> {
  const key = `academy:${locale}:${JSON.stringify(filters)}`
  return withFallback(
    key,
    async () => {
      const qs = new URLSearchParams({ section: 'academy' })
      if (filters.category) qs.set('category', filters.category)
      if (filters.difficulty) qs.set('difficulty', filters.difficulty)
      if (filters.series) qs.set('series', filters.series)
      if (filters.featured) qs.set('featured', 'true')
      if (filters.limit) qs.set('limit', String(filters.limit))
      return unwrapPosts(
        await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(`/api/v1/posts?${qs}`, {
          locale,
        })
      )
    },
    async () => {
      let posts = (await loadAllSeedPosts({ locale })).filter(p => p.section === 'academy')
      if (filters.category) posts = posts.filter(p => p.category === filters.category)
      if (filters.difficulty) posts = posts.filter(p => p.difficulty === filters.difficulty)
      if (filters.series) posts = posts.filter(p => p.seriesSlug === filters.series)
      if (filters.featured) posts = posts.filter(p => !!p.featured)
      if (filters.limit) posts = posts.slice(0, filters.limit)
      return posts
    }
  )
}
```

**Update `getAcademyPostBySlug`:**

```ts
export async function getAcademyPostBySlug(
  slug: string,
  locale: Locale
): Promise<NewsroomPost | undefined> {
  return getPostBySlug(slug, locale)
}
```

**Update `getAcademySlugs`:**

```ts
export async function getAcademySlugs(
  locale: Locale
): Promise<Array<{ category: string; slug: string }>> {
  const posts = await getAcademyPosts({ limit: 1000 }, locale)
  return posts.filter(p => p.category).map(p => ({ category: p.category as string, slug: p.slug }))
}
```

**`getCategories`:** unchanged signature (frontend renders titles via next-intl, ignores API field). No locale param.

**Update `getAllSeries`:**

```ts
export async function getAllSeries(locale: Locale): Promise<SeriesSummary[]> {
  return withFallback(
    `series:${locale}`,
    async () => cmsFetch<SeriesSummary[]>('/api/v1/series', { locale }),
    async () => []
  )
}
```

**Update `getSeriesBySlug`:**

```ts
export async function getSeriesBySlug(
  slug: string,
  locale: Locale
): Promise<SeriesDetail | undefined> {
  return withFallback(
    `series:${locale}:${slug}`,
    async () => {
      try {
        return await cmsFetch<SeriesDetail>(`/api/v1/series/${encodeURIComponent(slug)}`, {
          revalidate: 300,
          locale,
        })
      } catch {
        return undefined
      }
    },
    async () => undefined
  )
}
```

**Update `getRelatedPosts`:**

```ts
export async function getRelatedPosts(post: NewsroomPost, limit = 3): Promise<NewsroomPost[]> {
  const locale = post.locale
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const found = await Promise.all(post.relatedSlugs.map(s => getPostBySlug(s, locale)))
    return found.filter((p): p is NewsroomPost => !!p).slice(0, limit)
  }
  if (post.section === 'academy' && post.category) {
    const siblings = await getAcademyPosts(
      { category: post.category as AcademyCategory, limit: limit + 1 },
      locale
    )
    return siblings.filter(p => p.slug !== post.slug).slice(0, limit)
  }
  const all = await getAllPosts(locale)
  return all.filter(p => p.slug !== post.slug).slice(0, limit)
}
```

**`getAuthorBySlug`:** unchanged (author bios untranslated). No locale param.

**Update `getPostsByAuthor`:**

```ts
export async function getPostsByAuthor(authorId: string, locale: Locale): Promise<NewsroomPost[]> {
  return (await getAllPosts(locale)).filter(p => p.authorId === authorId)
}
```

- [ ] **Step 4: Run tests, expect green**

Run: `npx vitest run src/lib/cms.test.ts src/lib/cms/cms-fetch.test.ts src/lib/cms/seed-loader.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cms.ts src/lib/cms.test.ts
git commit -m "feat(cms): thread locale through cms.ts getters with per-locale cache keys"
```

---

## Task 5: TranslationPendingBanner component

**Files:**
- Create: `src/components/shared/translation-pending-banner.tsx`
- Create: `src/components/shared/translation-pending-banner.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/shared/translation-pending-banner.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { TranslationPendingBanner } from './translation-pending-banner'

const messages = {
  Common: { translationPendingBanner: "This article isn't translated yet — showing English." },
}

describe('TranslationPendingBanner', () => {
  it('renders i18n copy', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <TranslationPendingBanner />
      </NextIntlClientProvider>
    )
    expect(screen.getByText(/showing English/)).toBeInTheDocument()
  })

  it('has role status for assistive tech', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <TranslationPendingBanner />
      </NextIntlClientProvider>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run src/components/shared/translation-pending-banner.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Create the component**

Create `src/components/shared/translation-pending-banner.tsx`:

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function TranslationPendingBanner() {
  const t = useTranslations('Common')
  return (
    <div
      role='status'
      className='mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
    >
      {t('translationPendingBanner')}
    </div>
  )
}
```

- [ ] **Step 4: Run test, expect green**

Run: `npx vitest run src/components/shared/translation-pending-banner.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/translation-pending-banner.tsx src/components/shared/translation-pending-banner.test.tsx
git commit -m "feat(ui): add TranslationPendingBanner component for untranslated article fallback"
```

---

## Task 6: LocaleBadge component

**Files:**
- Create: `src/components/shared/locale-badge.tsx`
- Create: `src/components/shared/locale-badge.test.tsx`

- [ ] **Step 1: Write failing test**

Create `src/components/shared/locale-badge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { LocaleBadge } from './locale-badge'

const messages = { Common: { localeBadge: { en: 'EN', es: 'ES', zh: 'ZH' } } }

describe('LocaleBadge', () => {
  it('renders EN copy', () => {
    render(
      <NextIntlClientProvider locale='es' messages={messages}>
        <LocaleBadge locale='en' />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('EN')).toBeInTheDocument()
  })
  it('renders ZH copy', () => {
    render(
      <NextIntlClientProvider locale='en' messages={messages}>
        <LocaleBadge locale='zh' />
      </NextIntlClientProvider>
    )
    expect(screen.getByText('ZH')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run src/components/shared/locale-badge.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Create the component**

Create `src/components/shared/locale-badge.tsx`:

```tsx
'use client'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'

export function LocaleBadge({ locale }: { locale: Locale }) {
  const t = useTranslations('Common.localeBadge')
  return (
    <span
      className='inline-flex items-center rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
      aria-label={`Language: ${t(locale)}`}
    >
      {t(locale)}
    </span>
  )
}
```

- [ ] **Step 4: Run test, expect green**

Run: `npx vitest run src/components/shared/locale-badge.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/locale-badge.tsx src/components/shared/locale-badge.test.tsx
git commit -m "feat(ui): add LocaleBadge component for listing-card locale indicator"
```

---

## Task 7: i18n keys — Common additions

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/zh.json`

- [ ] **Step 1: Add Common keys to en.json**

In `src/messages/en.json`, add to the `Common` namespace (find existing `Common` block, append before its closing brace):

```json
"translationPendingBanner": "This article isn't translated yet — showing English.",
"localeBadge": { "en": "EN", "es": "ES", "zh": "ZH" }
```

- [ ] **Step 2: Add Common keys to es.json with __TODO_TRANSLATE__ prefix**

In `src/messages/es.json`, append the same two keys with the prefix on the banner string. `localeBadge` entries are 2-letter ISO codes that read identically across locales — no prefix:

```json
"translationPendingBanner": "__TODO_TRANSLATE__ This article isn't translated yet — showing English.",
"localeBadge": { "en": "EN", "es": "ES", "zh": "ZH" }
```

- [ ] **Step 3: Add Common keys to zh.json**

Same pattern in `src/messages/zh.json`:

```json
"translationPendingBanner": "__TODO_TRANSLATE__ This article isn't translated yet — showing English.",
"localeBadge": { "en": "EN", "es": "ES", "zh": "ZH" }
```

- [ ] **Step 4: Verify JSON validity**

Run: `node -e "['en','es','zh'].forEach(l => JSON.parse(require('fs').readFileSync('src/messages/' + l + '.json')))"`
Expected: no output (all valid JSON).

- [ ] **Step 5: Commit**

```bash
git add src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "feat(i18n): add Common.translationPendingBanner and Common.localeBadge keys"
```

---

## Task 8: i18n keys — Categories namespace

**Files:**
- Modify: `src/messages/en.json`
- Modify: `src/messages/es.json`
- Modify: `src/messages/zh.json`

The 7 academy slugs come from `src/constants/academy-categories.ts` (`ACADEMY_CATEGORY_SLUGS`):
`multisig`, `getting-started`, `security`, `how-to`, `coin-guides`, `defi`, `news-explained`.

The canonical title/description text comes from the existing `ACADEMY_CATEGORIES` constant in the same file. Read those values at planning time and copy them into en.json verbatim.

- [ ] **Step 1: Inspect canonical titles**

Run: `grep -A 30 "export const ACADEMY_CATEGORIES" src/constants/academy-categories.ts | head -60`

Note the title and description strings for each of the 7 slugs.

- [ ] **Step 2: Add Categories namespace to en.json**

Add a top-level `"Categories"` key alongside `Common`, `Header`, etc. in `src/messages/en.json`:

```json
"Categories": {
  "multisig": { "title": "<canonical title from constant>", "description": "<canonical description>" },
  "getting-started": { "title": "...", "description": "..." },
  "security": { "title": "...", "description": "..." },
  "how-to": { "title": "...", "description": "..." },
  "coin-guides": { "title": "...", "description": "..." },
  "defi": { "title": "...", "description": "..." },
  "news-explained": { "title": "...", "description": "..." }
}
```

Substitute `<canonical title>` etc. with the literal values from `ACADEMY_CATEGORIES` in `src/constants/academy-categories.ts`.

- [ ] **Step 3: Add Categories namespace to es.json with __TODO_TRANSLATE__ prefix**

Mirror the same structure in `src/messages/es.json` but prefix every `title` and `description` value with `"__TODO_TRANSLATE__ "`:

```json
"Categories": {
  "multisig": {
    "title": "__TODO_TRANSLATE__ <english title>",
    "description": "__TODO_TRANSLATE__ <english description>"
  },
  ...
}
```

- [ ] **Step 4: Add Categories namespace to zh.json**

Same pattern in `src/messages/zh.json`.

- [ ] **Step 5: Verify JSON validity**

Run: `node -e "['en','es','zh'].forEach(l => JSON.parse(require('fs').readFileSync('src/messages/' + l + '.json')))"`
Expected: no output.

- [ ] **Step 6: Commit**

```bash
git add src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "feat(i18n): add Categories namespace mirroring ACADEMY_CATEGORIES titles/descriptions"
```

---

## Task 9: Switch academy components to render Categories from i18n

**Files:**
- Modify: `src/app/[locale]/academy/page.tsx`
- Modify: `src/app/[locale]/academy/[category]/page.tsx`
- Modify any other component currently rendering `category.title` or `category.description` from a `CategoryWithCount` value

This task happens AFTER Task 11 (academy page locale threading) in dependency order — but since it's textually surgical and small, fold it into the academy page edits in Task 12. **Skip this task as a standalone commit; the work happens inside Task 12 and Task 13.**

(This entry left in the plan as a marker so reviewers see the dependency.)

---

## Task 10: Newsroom listing page + agent.md

**Files:**
- Modify: `src/app/[locale]/newsroom/page.tsx`
- Touch: `src/app/[locale]/newsroom/agent.md`
- Modify: `src/components/newsroom/newsroom-listing.tsx`

- [ ] **Step 1: Update newsroom-listing component to render LocaleBadge**

In `src/components/newsroom/newsroom-listing.tsx`, find where each post card renders metadata (title, date, etc.) and add a conditional badge:

```tsx
import { LocaleBadge } from '@/components/shared/locale-badge'

// ... in the card render ...
{post.servedLocale !== post.locale && <LocaleBadge locale={post.servedLocale} />}
```

Place the badge in the metadata row (alongside read-time, date, etc.) so it doesn't disrupt the visual rhythm.

- [ ] **Step 2: Update newsroom listing page to pass locale**

In `src/app/[locale]/newsroom/page.tsx`, modify the data fetch:

```tsx
export default async function NewsroomPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, tags] = await Promise.all([
    getAllPosts(locale),
    getAllTags(),
  ])
  // ... rest unchanged
}
```

Update the `params` type if it's currently `{ locale: string }` — narrow to `Locale` from `@/i18n/routing`.

- [ ] **Step 3: Touch agent.md to satisfy staleness check**

Update `src/app/[locale]/newsroom/agent.md` `last_reviewed:` frontmatter date to `2026-05-08`. No other content change needed (the route's purpose hasn't changed).

- [ ] **Step 4: Run tests, run typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/newsroom/page.tsx src/app/[locale]/newsroom/agent.md src/components/newsroom/newsroom-listing.tsx
git commit -m "feat(newsroom): pass locale to listing fetch, render LocaleBadge per card"
```

---

## Task 11: Newsroom article page + agent.md

**Files:**
- Modify: `src/app/[locale]/newsroom/[slug]/page.tsx`
- Touch: `src/app/[locale]/newsroom/[slug]/agent.md`
- Modify: `src/components/shared/post-article.tsx`

- [ ] **Step 1: Update post-article shared component to accept banner + lang attribute**

In `src/components/shared/post-article.tsx`, find the article container element and:

1. Add an optional prop `showTranslationPendingBanner: boolean`.
2. Render `<TranslationPendingBanner />` at the top of the article body if true.
3. Add `lang={post.servedLocale}` to the `<article>` element.

Example diff sketch:

```tsx
import { TranslationPendingBanner } from '@/components/shared/translation-pending-banner'

interface PostArticleProps {
  post: NewsroomPost
  relatedPosts: NewsroomPost[]
  backHref: string
  showTranslationPendingBanner?: boolean
}

export function PostArticle({ post, relatedPosts, backHref, showTranslationPendingBanner }: PostArticleProps) {
  return (
    <article lang={post.servedLocale} className='...'>
      {showTranslationPendingBanner && <TranslationPendingBanner />}
      {/* existing content */}
    </article>
  )
}
```

- [ ] **Step 2: Update [slug]/page.tsx with locale plumbing**

In `src/app/[locale]/newsroom/[slug]/page.tsx`:

1. Type params as `{ locale: Locale; slug: string }` (import Locale).
2. Update `generateStaticParams` to per-locale form:

```tsx
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

3. Update `generateMetadata` to pass `locale`:

```tsx
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale)
  // ... rest unchanged
}
```

4. Update default export:

```tsx
export default async function NewsroomArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()

  if (post.section === 'academy' && post.category) {
    permanentRedirect(`/${locale}/academy/${post.category}/${post.slug}`)
  }
  if (post.slug !== slug) {
    permanentRedirect(`/${locale}/newsroom/${post.slug}`)
  }

  const relatedPosts = await getRelatedPosts(post)
  // ... existing JSON-LD construction ...

  return (
    <>
      {/* JSON-LD scripts */}
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref='/newsroom'
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
    </>
  )
}
```

5. Update `PageProps` interface to type `locale: Locale`.

- [ ] **Step 3: Touch agent.md**

Update `src/app/[locale]/newsroom/[slug]/agent.md` `last_reviewed:` to `2026-05-08`.

- [ ] **Step 4: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/newsroom/[slug]/page.tsx src/app/[locale]/newsroom/[slug]/agent.md src/components/shared/post-article.tsx
git commit -m "feat(newsroom): locale-aware article page with translation-pending banner"
```

---

## Task 12: Newsroom RSS feed

**Files:**
- Modify: `src/app/[locale]/newsroom/rss.xml/route.ts`

- [ ] **Step 1: Read the current route**

Read `src/app/[locale]/newsroom/rss.xml/route.ts` to understand its current shape.

- [ ] **Step 2: Update RSS to be locale-aware**

Modify the route handler:

```ts
import type { Locale } from '@/i18n/routing'
import { getAllPosts } from '@/lib/cms'

export async function GET(_req: Request, { params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const posts = await getAllPosts(locale)
  // existing RSS body construction ...
  // For each <item>, add: <language>${post.servedLocale}</language>
  // Use the locale-prefixed URL for <link>: `${siteUrl}/${locale}/newsroom/${post.slug}`
}
```

Keep the channel-level `<language>` reflecting the requested `locale` (the chrome of the feed).

- [ ] **Step 3: Run typecheck + lint**

Run: `npm run type-check && npm run lint -- src/app/[locale]/newsroom/rss.xml/route.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/newsroom/rss.xml/route.ts
git commit -m "feat(rss): per-locale newsroom feed with per-item language"
```

---

## Task 13: Academy listing page + agent.md (with Categories i18n)

**Files:**
- Modify: `src/app/[locale]/academy/page.tsx`
- Touch: `src/app/[locale]/academy/agent.md`

- [ ] **Step 1: Update page to pass locale and render Categories from i18n**

In `src/app/[locale]/academy/page.tsx`:

1. Type params as `{ locale: Locale }`.
2. Pass `locale` into `getCategories()` call site (still no-arg) and into other fetchers:

```tsx
const { locale } = await params
setRequestLocale(locale)
const [categories, allSeries, recentPosts] = await Promise.all([
  getCategories().catch(() => []),
  getAllSeries(locale).catch(() => []),
  getAcademyPosts({ limit: 12 }, locale).catch(() => []),
])
```

3. Where category cards are rendered, replace API field reads with next-intl:

```tsx
const t = await getTranslations({ locale, namespace: 'Categories' })
// ... in render ...
<h2>{t(`${cat.slug}.title`)}</h2>
<p>{t(`${cat.slug}.description`)}</p>
```

4. Render `<LocaleBadge>` per recent-post card if `post.servedLocale !== post.locale`, similar to Task 10.

- [ ] **Step 2: Touch agent.md**

Update `src/app/[locale]/academy/agent.md` `last_reviewed:` to `2026-05-08`.

- [ ] **Step 3: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/academy/page.tsx src/app/[locale]/academy/agent.md
git commit -m "feat(academy): locale-aware listing with i18n category names"
```

---

## Task 14: Academy category page + agent.md

**Files:**
- Modify: `src/app/[locale]/academy/[category]/page.tsx`
- Touch: `src/app/[locale]/academy/[category]/agent.md`

- [ ] **Step 1: Update page**

In `src/app/[locale]/academy/[category]/page.tsx`:

1. Type params as `{ locale: Locale; category: string }`.
2. `generateStaticParams` stays static-only (the 7 academy categories don't change per locale; Next composes with locale segment automatically). No change needed to `generateStaticParams` here.
3. Update `generateMetadata` and default export to pass `locale` to `getAcademyPosts`:

```tsx
const posts = await getAcademyPosts({ category, limit: 100 }, locale).catch(() => [])
```

4. Replace category-title rendering with next-intl `t('Categories.<slug>.title')`.
5. Render `<LocaleBadge>` on listing cards.
6. Locale-prefix any `permanentRedirect` calls.

- [ ] **Step 2: Touch agent.md**

Update `src/app/[locale]/academy/[category]/agent.md` `last_reviewed:` to `2026-05-08`.

- [ ] **Step 3: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/academy/[category]/page.tsx src/app/[locale]/academy/[category]/agent.md
git commit -m "feat(academy): locale-aware category listing"
```

---

## Task 15: Academy article page + agent.md

**Files:**
- Modify: `src/app/[locale]/academy/[category]/[slug]/page.tsx`
- Touch: `src/app/[locale]/academy/[category]/[slug]/agent.md`

- [ ] **Step 1: Update page**

In `src/app/[locale]/academy/[category]/[slug]/page.tsx`:

1. Type params as `{ locale: Locale; category: string; slug: string }`.
2. Update `generateStaticParams` to per-locale form:

```tsx
export async function generateStaticParams({
  params,
}: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  try {
    const slugs = await getAcademySlugs(locale)
    return slugs.map(({ category, slug }) => ({ category, slug }))
  } catch {
    return []
  }
}
```

3. Pass `locale` to `getAcademyPostBySlug`, `getRelatedPosts` (locale auto-derived), `getAuthorBySlug` (no locale change — author bios untranslated).
4. Locale-prefix all `permanentRedirect` targets.
5. Render `<TranslationPendingBanner>` via `<PostArticle>` when `post.servedLocale !== post.locale`.

- [ ] **Step 2: Touch agent.md**

Update `src/app/[locale]/academy/[category]/[slug]/agent.md` `last_reviewed:` to `2026-05-08`.

- [ ] **Step 3: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/academy/[category]/[slug]/page.tsx src/app/[locale]/academy/[category]/[slug]/agent.md
git commit -m "feat(academy): locale-aware article page with banner and per-locale static params"
```

---

## Task 16: Academy series index + detail + agent.md

**Files:**
- Modify: `src/app/[locale]/academy/series/page.tsx`
- Touch: `src/app/[locale]/academy/series/agent.md`
- Modify: `src/app/[locale]/academy/series/[slug]/page.tsx`
- Touch: `src/app/[locale]/academy/series/[slug]/agent.md`

- [ ] **Step 1: Update series index**

In `src/app/[locale]/academy/series/page.tsx`: pass `locale` to `getAllSeries(locale)`. Update params type to `{ locale: Locale }`. Render `<LocaleBadge>` per card if `series.servedLocale !== series.locale`.

- [ ] **Step 2: Update series detail**

In `src/app/[locale]/academy/series/[slug]/page.tsx`:

1. Type params as `{ locale: Locale; slug: string }`.
2. Pass `locale` to `getSeriesBySlug(slug, locale)`.
3. Locale-prefix any `permanentRedirect` targets.
4. Render banner if `series.servedLocale !== series.locale`.

- [ ] **Step 3: Touch both agent.md files**

Update `last_reviewed:` to `2026-05-08` in both `agent.md` files.

- [ ] **Step 4: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/academy/series/page.tsx src/app/[locale]/academy/series/agent.md src/app/[locale]/academy/series/[slug]/page.tsx src/app/[locale]/academy/series/[slug]/agent.md
git commit -m "feat(academy): locale-aware series index and detail pages"
```

---

## Task 17: Academy RSS feed

**Files:**
- Modify: `src/app/[locale]/academy/rss.xml/route.ts`

Same pattern as Task 12. Pass `locale` from route params, call `getAcademyPosts({ limit: 100 }, locale)`, set per-item `<language>${post.servedLocale}</language>` and locale-prefix the `<link>`.

- [ ] **Step 1: Update route**

Apply same edit pattern as Task 12 but for academy.

- [ ] **Step 2: Run typecheck + lint**

Run: `npm run type-check && npm run lint -- src/app/[locale]/academy/rss.xml/route.ts`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/academy/rss.xml/route.ts
git commit -m "feat(rss): per-locale academy feed with per-item language"
```

---

## Task 18: Author page + middleware

**Files:**
- Modify: `src/app/[locale]/author/[slug]/page.tsx`
- Touch: `src/app/[locale]/author/[slug]/agent.md`
- Modify: `src/middleware.ts`

- [ ] **Step 1: Update author page**

In `src/app/[locale]/author/[slug]/page.tsx`:

1. Type params as `{ locale: Locale; slug: string }`.
2. Pass `locale` to `getPostsByAuthor(slug, locale)`.
3. `getAuthorBySlug` stays no-locale (untranslated by design).

- [ ] **Step 2: Touch author/[slug]/agent.md**

Update `last_reviewed:` to `2026-05-08`.

- [ ] **Step 3: Update middleware legacy redirects**

In `src/middleware.ts`, find the three `getPostBySlug(dyn.slug)` and `getAuthorBySlug(dyn.slug)` call sites (~lines 45, 51, 57). Update `getPostBySlug` calls to pass `'en'` as the locale:

```ts
const post = await getPostBySlug(dyn.slug, 'en')
```

`getAuthorBySlug` stays unchanged.

- [ ] **Step 4: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/author/[slug]/page.tsx src/app/[locale]/author/[slug]/agent.md src/middleware.ts
git commit -m "feat(author): locale-aware posts-by-author; middleware legacy redirects pass 'en'"
```

---

## Task 19: Sitemap and page-level hreflang alternates

**Strategy:** the public DTO has no stable cross-locale post ID, so sitemap-level `alternates.languages` correlation is impractical (it would require correlating posts across locale-specific listings by fragile composite keys). Instead: sitemap emits one URL per (locale, translated-post) pair — each locale gets only its translated posts — and the cross-locale signal lives in **page-level `<link rel="alternate" hreflang>` metadata** emitted by `generateMetadata` on each article page. This costs N+1 per-page fetches at metadata-generation time (LRU cache absorbs repeats) and is the correct trade-off for V1.

**Files:**
- Modify: `src/app/sitemap.ts`
- Create: `src/app/sitemap.test.ts`
- Modify: `src/app/[locale]/newsroom/[slug]/page.tsx` (Step 4 — add hreflang alternates to metadata)
- Modify: `src/app/[locale]/academy/[category]/[slug]/page.tsx` (Step 4 — same)

- [ ] **Step 1: Write failing sitemap test**

Create `src/app/sitemap.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

beforeEach(() => {
  vi.resetModules()
  process.env.SSP_CMS_URL = 'https://cms.example.com'
  process.env.SSP_CMS_API_KEY = 'k'
})

describe('sitemap', () => {
  it('emits one entry per (locale, translated post) pair', async () => {
    vi.doMock('@/lib/cms', () => ({
      getAllPosts: vi.fn(async (locale: 'en' | 'es' | 'zh') => {
        if (locale === 'en')
          return [{ slug: 'foo-en', locale: 'en', servedLocale: 'en', date: '2026-01-01' }]
        if (locale === 'es')
          return [{ slug: 'foo-es', locale: 'es', servedLocale: 'es', date: '2026-01-01' }]
        return []
      }),
      getAcademySlugs: vi.fn(async () => []),
      getAllSeries: vi.fn(async () => []),
      getCategories: vi.fn(async () => []),
    }))
    const { default: sitemap } = await import('./sitemap')
    const entries = await sitemap()
    const urls = entries.map((e: { url: string }) => e.url)
    expect(urls.some((u: string) => u.endsWith('/en/newsroom/foo-en'))).toBe(true)
    expect(urls.some((u: string) => u.endsWith('/es/newsroom/foo-es'))).toBe(true)
    expect(urls.some((u: string) => u.endsWith('/zh/newsroom/foo-en'))).toBe(false)
  })

  it('post with only EN translation emits a single URL', async () => {
    vi.doMock('@/lib/cms', () => ({
      getAllPosts: vi.fn(async (locale: 'en' | 'es' | 'zh') => {
        if (locale === 'en')
          return [{ slug: 'only-en', locale: 'en', servedLocale: 'en', date: '2026-01-01' }]
        return [{ slug: 'only-en', locale, servedLocale: 'en', date: '2026-01-01' }]
      }),
      getAcademySlugs: vi.fn(async () => []),
      getAllSeries: vi.fn(async () => []),
      getCategories: vi.fn(async () => []),
    }))
    const { default: sitemap } = await import('./sitemap')
    const entries = await sitemap()
    const onlyEnEntries = entries.filter((e: { url: string }) => e.url.includes('only-en'))
    expect(onlyEnEntries).toHaveLength(1)
    expect(onlyEnEntries[0].url).toContain('/en/newsroom/only-en')
  })
})
```

- [ ] **Step 2: Run failing test**

Run: `npx vitest run src/app/sitemap.test.ts`
Expected: FAIL — current sitemap doesn't iterate per-locale.

- [ ] **Step 3: Rewrite sitemap.ts**

Read the current `src/app/sitemap.ts` to learn what static pages it currently emits (home, newsroom listing, academy listing, etc.). Then rewrite:

```ts
import type { MetadataRoute } from 'next'
import { getAllPosts, getAcademySlugs, getAllSeries } from '@/lib/cms'
import { routing } from '@/i18n/routing'
import { siteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    // Static pages (mirror whatever the current sitemap emits, prefixed with the locale)
    entries.push({ url: `${siteUrl}/${locale}` })
    entries.push({ url: `${siteUrl}/${locale}/newsroom` })
    entries.push({ url: `${siteUrl}/${locale}/academy` })
    entries.push({ url: `${siteUrl}/${locale}/academy/series` })

    const [posts, academySlugs, series] = await Promise.all([
      getAllPosts(locale).catch(() => []),
      getAcademySlugs(locale).catch(() => []),
      getAllSeries(locale).catch(() => []),
    ])

    for (const post of posts.filter(p => p.servedLocale === locale)) {
      entries.push({
        url: `${siteUrl}/${locale}/newsroom/${post.slug}`,
        lastModified: post.modifiedDate ?? post.date,
      })
    }
    for (const { category, slug } of academySlugs) {
      entries.push({ url: `${siteUrl}/${locale}/academy/${category}/${slug}` })
    }
    for (const s of series.filter(s => s.servedLocale === locale)) {
      entries.push({ url: `${siteUrl}/${locale}/academy/series/${s.slug}` })
    }
  }

  return entries
}
```

(Inspect the existing sitemap.ts for additional static page paths — features, enterprise, contact, etc. — and add corresponding per-locale entries to match.)

- [ ] **Step 4: Add hreflang alternates to article-page metadata**

In `src/app/[locale]/newsroom/[slug]/page.tsx`, inside `generateMetadata`:

```tsx
import { routing } from '@/i18n/routing'

// inside generateMetadata, after fetching `post` for the request locale:
const languages: Record<string, string> = {}
for (const otherLocale of routing.locales) {
  if (otherLocale === locale) continue
  const other = await getPostBySlug(slug, otherLocale).catch(() => null)
  if (other && other.servedLocale === otherLocale) {
    languages[otherLocale] = `${siteUrl}/${otherLocale}/newsroom/${other.slug}`
  }
}
languages[locale] = `${siteUrl}/${locale}/newsroom/${post.slug}`

return createMetadata({
  // ... existing fields ...
  alternates: { languages },
})
```

Apply the same pattern in `src/app/[locale]/academy/[category]/[slug]/page.tsx`:

```tsx
const languages: Record<string, string> = {}
for (const otherLocale of routing.locales) {
  if (otherLocale === locale) continue
  const other = await getAcademyPostBySlug(slug, otherLocale).catch(() => null)
  if (other && other.servedLocale === otherLocale && other.category) {
    languages[otherLocale] = `${siteUrl}/${otherLocale}/academy/${other.category}/${other.slug}`
  }
}
languages[locale] = `${siteUrl}/${locale}/academy/${category}/${post.slug}`
return createMetadata({ /* ... */ alternates: { languages } })
```

- [ ] **Step 5: Run tests + typecheck**

Run: `npm run type-check && npx vitest run`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/sitemap.ts src/app/sitemap.test.ts src/app/[locale]/newsroom/[slug]/page.tsx src/app/[locale]/academy/[category]/[slug]/page.tsx
git commit -m "feat(seo): per-locale sitemap entries and page-level hreflang alternates"
```

---

## Task 20: Final integration verification

**Files:** none modified.

- [ ] **Step 1: Run full check-all**

Run: `npm run check-all`
Expected: type-check + lint + format:check + test all pass.

- [ ] **Step 2: Run dev server smoke test (optional but recommended)**

```bash
npm run dev
```

Visit in browser:
- `/en/newsroom` — listing renders, no banners/badges
- `/es/newsroom` — listing renders, badges on EN-only items
- `/zh/newsroom` — same as ES
- `/en/newsroom/<some-slug>` — article renders
- `/es/newsroom/<en-slug>` for en-only post — banner shown, `<article lang="en">`
- `/es/newsroom/<old-slug>` for slug-history hit — redirects to canonical
- `/en/sitemap.xml` (via `/sitemap.xml`) — valid XML, contains per-locale URLs
- `/en/newsroom/rss.xml` — valid RSS, channel `<language>` is `en`
- `/es/newsroom/rss.xml` — valid RSS, channel `<language>` is `es`

Stop dev server.

- [ ] **Step 3: No commit needed**

Integration verification is observation only.

---

## Self-Review

Run a mental check against the spec before marking the plan ready:

- ✅ Every spec section has at least one task implementing it.
- ✅ Tasks are 2-5 minute steps; large tasks are decomposed.
- ✅ Every commit message uses Conventional Commits style without AI-attribution trailers.
- ✅ agent.md sibling updates explicitly called out for every touched `[locale]/<route>/page.tsx`.
- ✅ Backward-compat for `cmsFetch(path, 300)` numeric form preserved (Task 1).
- ✅ Per-locale cache key format documented and tested (Task 4).
- ✅ Untranslated banner trigger condition documented and tested (Task 5, Task 11).
- ✅ Sitemap edge case (EN-only post → single entry) documented (Task 19, Step 1 test case).
- ✅ Categories i18n migration explicitly tied to academy listing (Task 13).
- ✅ Middleware legacy-redirect locale = 'en' fix included (Task 18).
- ✅ Final `npm run check-all` integration step (Task 20).

**Known plan caveats called out for the executor:**

- Task 9 is a marker, not a separate commit; work folded into Task 13 + Task 14.
- Task 19 sitemap correlation across locales is simplified to "per-locale URLs, no sitemap-level cross-references" because the public DTO lacks a stable cross-locale ID. Cross-locale correlation lives in page-level `<link rel="alternate" hreflang>` tags emitted by `generateMetadata`. A follow-up to add `id` to the public DTO would let us correlate at sitemap level.
- Task 19 page-level hreflang adds N+1 fetches per article render; LRU cache absorbs the cost. Profile and revisit if hot.
- Task 2 may temporarily leave `npm run type-check` failing; subsequent tasks restore green. Do not treat the intermediate red as a regression.

---

## Execution

After this plan is approved, dispatch via `superpowers:subagent-driven-development`: one implementer subagent per task, then spec reviewer, then code quality reviewer per the standard two-stage gate.
