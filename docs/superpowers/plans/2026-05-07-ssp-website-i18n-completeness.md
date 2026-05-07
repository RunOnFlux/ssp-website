# SSP Website i18n Completeness Implementation Plan (Phase A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every user-visible string rendered by `ssp-website` resolves through `next-intl`, with English silently filling in any key missing from `es` or `zh`.

**Architecture:** `next-intl` is wired correctly today; the gap is hardcoded literals in pages, components, and metadata exports — plus an `ACADEMY_CATEGORIES` constant whose titles need to live in messages. We add an English-fallback merge to `i18n/request.ts`, run a literal audit to produce a worklist, then fix surface-by-surface. AI-translates new keys to `es`/`zh` inline. A guard test prevents regressions.

**Tech Stack:** Next 16 (App Router), next-intl 4, React 19, Vitest 4, Tailwind 4.

**Spec:** [`docs/superpowers/specs/2026-05-07-ssp-website-i18n-completeness-design.md`](../specs/2026-05-07-ssp-website-i18n-completeness-design.md).

---

## Conventions used in this plan

- All paths are relative to the worktree root: `/Users/vasilismagkoutis/repos/ssp-website/.worktrees/i18n-phase-a/`.
- "Run checks" means: `npm run check-all`. Build (`npm run build`) is reserved for the final verification task because it is slow.
- Each task is one atomic commit unless explicitly split. Commit message style is `type(scope): subject` per existing repo convention. No `Co-Authored-By: Claude` trailer.
- When a step adds an English message key, the same step adds the `es` and `zh` translations. The fallback in Task 1 means missing translations don't break the UI, but we ship complete coverage.
- Translation tone for new keys: match the existing `es.json` / `zh.json` register (formal Spanish, Simplified Chinese with full-width punctuation). Keep brand names ("SSP", "Newsroom", "Academy") as proper nouns unless the existing files already translate them.

---

## Task 1: English fallback in `src/i18n/request.ts`

**Files:**
- Modify: `src/i18n/request.ts`
- Create: `src/i18n/deep-merge.ts`
- Test: `src/i18n/deep-merge.test.ts`

**Why:** Once landed, missing keys in `es`/`zh` resolve to English instead of a next-intl error placeholder. This unlocks shipping partial translation safely as we audit.

- [ ] **Step 1.1: Write the failing test for `deepMerge`**

Create `src/i18n/deep-merge.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { deepMerge } from './deep-merge'

describe('deepMerge', () => {
  it('returns base when override is empty', () => {
    expect(deepMerge({ a: 1, b: 2 }, {})).toEqual({ a: 1, b: 2 })
  })
  it('override wins for top-level keys', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 })
  })
  it('merges nested objects recursively', () => {
    const en = { Common: { hello: 'Hello', bye: 'Bye' }, Header: { home: 'Home' } }
    const es = { Common: { hello: 'Hola' } }
    expect(deepMerge(en, es)).toEqual({
      Common: { hello: 'Hola', bye: 'Bye' },
      Header: { home: 'Home' },
    })
  })
  it('does not mutate inputs', () => {
    const en = { a: { b: 1 } }
    const es = { a: { c: 2 } }
    const merged = deepMerge(en, es)
    expect(en).toEqual({ a: { b: 1 } })
    expect(es).toEqual({ a: { c: 2 } })
    expect(merged).toEqual({ a: { b: 1, c: 2 } })
  })
  it('treats arrays as scalar values (override replaces, not merges)', () => {
    expect(deepMerge({ tags: ['a', 'b'] }, { tags: ['c'] })).toEqual({ tags: ['c'] })
  })
  it('handles null override values by keeping base', () => {
    expect(deepMerge({ a: 1 }, { a: null as never })).toEqual({ a: 1 })
  })
})
```

- [ ] **Step 1.2: Run the test to verify it fails**

Run: `npm test -- src/i18n/deep-merge.test.ts`
Expected: FAIL with "Cannot find module './deep-merge'".

- [ ] **Step 1.3: Implement `deepMerge`**

Create `src/i18n/deep-merge.ts`:

```ts
type AnyObject = Record<string, unknown>

function isPlainObject(v: unknown): v is AnyObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype
}

export function deepMerge<T extends AnyObject>(base: T, override: AnyObject): T {
  const result: AnyObject = { ...base }
  for (const [key, overrideValue] of Object.entries(override)) {
    if (overrideValue == null) continue
    const baseValue = result[key]
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      result[key] = deepMerge(baseValue, overrideValue)
    } else {
      result[key] = overrideValue
    }
  }
  return result as T
}
```

- [ ] **Step 1.4: Run the test to verify it passes**

Run: `npm test -- src/i18n/deep-merge.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 1.5: Update `src/i18n/request.ts` to use `deepMerge`**

Replace the entire file with:

```ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import { deepMerge } from './deep-merge'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale
  }
  const localeMessages = (await import(`../messages/${locale}.json`)).default as Record<string, unknown>
  if (locale === routing.defaultLocale) {
    return { locale, messages: localeMessages }
  }
  const englishMessages = (await import('../messages/en.json')).default as Record<string, unknown>
  return {
    locale,
    messages: deepMerge(englishMessages, localeMessages),
  }
})
```

- [ ] **Step 1.6: Run all tests + type-check**

Run: `npm run type-check && npm test`
Expected: type-check clean, all 83 existing tests + 6 new tests pass.

- [ ] **Step 1.7: Commit**

```bash
git add src/i18n/deep-merge.ts src/i18n/deep-merge.test.ts src/i18n/request.ts
git commit -m "feat(i18n): fall back to English when key is missing in locale"
```

---

## Task 2: Locale-coverage test

**Files:**
- Test: `__tests__/i18n/locale-coverage.test.ts`

**Why:** Catches accidental drift between `en.json` and `es.json`/`zh.json`. The fallback from Task 1 means missing keys aren't a runtime error — but this test surfaces them in CI so we ship complete coverage on purpose, not by accident.

- [ ] **Step 2.1: Write the test**

Create `__tests__/i18n/locale-coverage.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import en from '@/messages/en.json'
import es from '@/messages/es.json'
import zh from '@/messages/zh.json'

type AnyObj = Record<string, unknown>

function flattenKeys(obj: AnyObj, prefix = ''): string[] {
  const keys: string[] = []
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v as AnyObj, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

describe('locale coverage', () => {
  const enKeys = new Set(flattenKeys(en as AnyObj))
  for (const [name, locale] of [['es', es], ['zh', zh]] as const) {
    it(`${name}.json contains every key from en.json`, () => {
      const localeKeys = new Set(flattenKeys(locale as AnyObj))
      const missing = [...enKeys].filter(k => !localeKeys.has(k))
      expect(missing, `Keys missing from ${name}.json:\n${missing.join('\n')}`).toEqual([])
    })
    it(`${name}.json has no orphan keys (not in en.json)`, () => {
      const localeKeys = new Set(flattenKeys(locale as AnyObj))
      const orphans = [...localeKeys].filter(k => !enKeys.has(k))
      expect(orphans, `Orphan keys in ${name}.json:\n${orphans.join('\n')}`).toEqual([])
    })
  }
})
```

- [ ] **Step 2.2: Run the test**

Run: `npm test -- __tests__/i18n/locale-coverage.test.ts`

Two cases:
- (a) PASS — current locale files are aligned. Proceed to commit.
- (b) FAIL — drift exists. Fix `es.json` / `zh.json` to align with `en.json` (translate any newly missing keys, delete orphans), re-run until green, commit both fixes together.

- [ ] **Step 2.3: Commit**

```bash
git add __tests__/i18n/locale-coverage.test.ts
# only if drift was found in step 2.2:
git add src/messages/es.json src/messages/zh.json
git commit -m "test(i18n): assert es/zh locale files cover every en.json key"
```

---

## Task 3: Inventory of hardcoded literals

**Files:**
- Create: `scripts/audit-i18n.ts`
- Create: `docs/i18n/audit-2026-05-07.md`

**Why:** The fix tasks below need a definitive worklist. Producing it once mechanically beats grepping ad-hoc per task. The output is committed as documentation that fix tasks reference and check off.

- [ ] **Step 3.1: Write the audit script**

Create `scripts/audit-i18n.ts` that walks `src/app/[locale]/**` and `src/components/**` plus root-level error pages, applying these heuristic regexes:

- JSX text node with capitalized multi-word content (e.g. `>Browse by topic<`)
- JSX text node with single capitalized word ≥5 chars (e.g. `>Newsroom<`)
- Prop literals on `title`, `description`, `aria-label`, `aria-description`, `placeholder`, `alt` whose value starts with a capital letter

Filter out test files, story files, type-only files. Maintain an `ALLOW` set seeded with brand strings (`SSP`, `Newsroom`, `Academy`, `Flux`, `GitHub`) to keep the inventory actionable.

Output format: markdown grouped by file, with `**L<line>** (<reason>): <snippet>` entries.

- [ ] **Step 3.2: Run the audit and capture output**

```bash
mkdir -p docs/i18n
npx tsx scripts/audit-i18n.ts > docs/i18n/audit-2026-05-07.md
```

- [ ] **Step 3.3: Manually review the audit**

Skim each entry. Some hits will be false positives (component names, brand strings, JSON-LD constants, type names). Add them to the `ALLOW` set in the script and re-run. Goal: every remaining hit is something we will fix in tasks 4+.

- [ ] **Step 3.4: Commit**

```bash
git add scripts/audit-i18n.ts docs/i18n/audit-2026-05-07.md
git commit -m "tools(i18n): add literal-audit script and capture initial inventory"
```

---

## Task 4: Migrate `ACADEMY_CATEGORIES` titles to messages

**Files:**
- Modify: `src/constants/academy-categories.ts`
- Modify: `src/constants/academy-categories.test.ts`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json`
- Touch: any file consuming `ACADEMY_CATEGORIES[c].title` or `.description`

**Why:** Categories appear in URLs (`/academy/multisig`) and in UI (`<h3>{title}</h3>`). Slugs must stay English; titles + descriptions must translate.

- [ ] **Step 4.1: Add `Academy.categories` keys to `en.json`**

Inside the existing `Academy` namespace, add a `categories` object with title + description for each of the seven slugs, using the exact strings from `src/constants/academy-categories.ts` so en behavior is unchanged.

- [ ] **Step 4.2: Add the same keys to `es.json` (translated)**

Formal Spanish:

| Slug | title | description |
|---|---|---|
| `multisig` | Multifirma explicada | Cómo funciona realmente la firma múltiple 2-de-2 en SSP — y por qué importa. |
| `getting-started` | Conceptos básicos de cripto | Conceptos fundamentales que todo usuario de cripto debe conocer. |
| `security` | Seguridad y autocustodia | Protege tus criptos: semillas, phishing, hardware, modelos de amenaza. |
| `how-to` | Guías paso a paso | Tutoriales detallados para las tareas más comunes de SSP. |
| `coin-guides` | Guías de monedas y cadenas | Análisis a fondo de las monedas y cadenas que SSP soporta. |
| `defi` | DeFi y Account Abstraction | Staking, préstamos, swaps y ERC-4337 explicados. |
| `news-explained` | Noticias y análisis del sector | Contexto y análisis sobre noticias y regulación cripto. |

- [ ] **Step 4.3: Add the same keys to `zh.json` (translated)**

Simplified Chinese with full-width punctuation:

| Slug | title | description |
|---|---|---|
| `multisig` | 多重签名详解 | SSP 中的 2/2 多重签名实际如何运作——以及为何重要。 |
| `getting-started` | 加密入门 | 每位加密用户都应了解的基础概念。 |
| `security` | 安全与自托管 | 保护你的加密资产：助记词、钓鱼、硬件钱包、威胁模型。 |
| `how-to` | 操作指南 | SSP 常见任务的分步演练。 |
| `coin-guides` | 币种与链指南 | 深入了解 SSP 支持的各个币种和区块链。 |
| `defi` | DeFi 与账户抽象 | 解析质押、借贷、兑换以及 ERC-4337。 |
| `news-explained` | 新闻与行业分析 | 加密新闻与监管动态的背景与解读。 |

- [ ] **Step 4.4: Slim `ACADEMY_CATEGORIES` constant to slugs only**

Replace `src/constants/academy-categories.ts` with:

```ts
export const ACADEMY_CATEGORY_SLUGS = [
  'multisig',
  'getting-started',
  'security',
  'how-to',
  'coin-guides',
  'defi',
  'news-explained',
] as const

export type AcademyCategory = (typeof ACADEMY_CATEGORY_SLUGS)[number]

export function isAcademyCategory(value: unknown): value is AcademyCategory {
  return typeof value === 'string' && (ACADEMY_CATEGORY_SLUGS as readonly string[]).includes(value)
}
```

- [ ] **Step 4.5: Update `academy-categories.test.ts`**

Replace with tests that exercise the slug list ordering and the type guard (every slug accepted, non-slug strings rejected, null/undefined rejected).

- [ ] **Step 4.6: Update consumers**

```bash
grep -rln "ACADEMY_CATEGORIES" src/
```

For each match (excluding the constant file and its test), replace `ACADEMY_CATEGORIES[c].title`/`.description` with `t(\`${c}.title\`)` / `t(\`${c}.description\`)` from `useTranslations('Academy.categories')` (client) or `await getTranslations({ locale, namespace: 'Academy.categories' })` (server).

- [ ] **Step 4.7: Run checks**

```bash
npm run check-all
```

- [ ] **Step 4.8: Commit**

```bash
git add src/constants/academy-categories.ts src/constants/academy-categories.test.ts \
        src/messages/en.json src/messages/es.json src/messages/zh.json \
        src/app src/components
git commit -m "feat(i18n): move ACADEMY_CATEGORIES titles into messages"
```

---

## Task 5: Newsroom landing page

**Files:**
- Modify: `src/app/[locale]/newsroom/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json`

**Why:** Page metadata, breadcrumb JSON-LD names, and `PageHeader` props are hardcoded English even at `/es/newsroom` and `/zh/newsroom`. Concrete literals to fix:
- `metadata.title` = `'Newsroom — Latest News & Updates'`
- `metadata.description` = `'Stay up to date with the latest news, product updates, and announcements from SSP.'`
- `<PageHeader title='Newsroom' description='Stay up to date with…' />`
- `breadcrumbJsonLd` names: `'Home'`, `'Newsroom'`

`Newsroom.title` and `Newsroom.description` already exist in en.json; we add only `Newsroom.metaTitle`, `Newsroom.metaDescription`, and shared `Common.breadcrumbHome`.

- [ ] **Step 5.1: Add new keys to all three locale files**

en.json additions (`Common` + `Newsroom`):
- `Common.breadcrumbHome`: `"Home"`
- `Newsroom.metaTitle`: `"Newsroom — Latest News & Updates"`
- `Newsroom.metaDescription`: `"Stay up to date with the latest news, product updates, and announcements from SSP."`

es.json additions:
- `Common.breadcrumbHome`: `"Inicio"`
- `Newsroom.metaTitle`: `"Sala de prensa — Últimas noticias y novedades"`
- `Newsroom.metaDescription`: `"Mantente al día con las últimas noticias, actualizaciones de producto y anuncios de SSP."`

zh.json additions:
- `Common.breadcrumbHome`: `"主页"`
- `Newsroom.metaTitle`: `"新闻中心 — 最新新闻与更新"`
- `Newsroom.metaDescription`: `"及时了解 SSP 的最新新闻、产品更新与公告。"`

- [ ] **Step 5.2: Convert `metadata` to `generateMetadata` and translate the page**

Replace `src/app/[locale]/newsroom/page.tsx`:

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomListing } from '@/components/newsroom/newsroom-listing'
import { getAllPosts, getAllTags } from '@/lib/cms'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Newsroom' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/newsroom',
  })
}

export default async function NewsroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, tags, t, tCommon] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getTranslations({ locale, namespace: 'Newsroom' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('title'), url: '/newsroom' },
  ])
  const collectionJsonLd = createCollectionPageJsonLd(
    posts.map(p => ({ title: p.title, url: `/newsroom/${p.slug}`, date: p.date }))
  )
  return (
    <>
      <Script id='breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id='collection-page-jsonld' type='application/ld+json'>
        {JSON.stringify(collectionJsonLd)}
      </Script>
      <PageHeader title={t('title')} description={t('description')} />
      <NewsroomListing posts={posts} tags={tags} />
    </>
  )
}
```

- [ ] **Step 5.3: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/newsroom/page.tsx src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate newsroom landing page metadata, header, and breadcrumbs"
```

---

## Task 6: Newsroom article page (`[slug]`)

**Files:**
- Modify: `src/app/[locale]/newsroom/[slug]/page.tsx`

**Why:** The breadcrumb JSON-LD uses literal `'Home'` and `'Newsroom'` names. CMS-served `post.title`, `post.description`, etc. stay as they are (Phase B). Per-post metadata is already dynamic from CMS.

- [ ] **Step 6.1: Update the breadcrumb JSON-LD to use translations**

In the `NewsroomArticlePage` body (`locale` is already destructured), replace:

```tsx
const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Newsroom', url: '/newsroom' },
  { name: post.title, url: `/newsroom/${post.slug}` },
])
```

with:

```tsx
const [tCommon, tNewsroom] = await Promise.all([
  getTranslations({ locale, namespace: 'Common' }),
  getTranslations({ locale, namespace: 'Newsroom' }),
])
const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: tCommon('breadcrumbHome'), url: '/' },
  { name: tNewsroom('title'), url: '/newsroom' },
  { name: post.title, url: `/newsroom/${post.slug}` },
])
```

Add `getTranslations` to the imports: `import { setRequestLocale, getTranslations } from 'next-intl/server'`.

- [ ] **Step 6.2: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/newsroom/[slug]/page.tsx
git commit -m "fix(i18n): translate newsroom article breadcrumb labels"
```

---

## Task 7: Academy landing page

**Files:**
- Modify: `src/app/[locale]/academy/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json` (add `Academy.metaTitle`, `Academy.metaDescription`)

**Why:** Same pattern as Task 5 — static `metadata`, hardcoded `<PageHeader>`, hardcoded section headings (`Browse by topic`, `Learning paths`, `View all`, `Latest articles`), the `coming soon` message, the inline `{count} article{s}` template, and category title/description rendering.

`Academy.title`, `Academy.description`, `browseByTopic`, `learningPaths`, `viewAllSeries`, `latestArticles`, `comingSoon`, `articleCount`, `partsCount` already exist. We add only `metaTitle` + `metaDescription`.

- [ ] **Step 7.1: Add `Academy.metaTitle` and `Academy.metaDescription` to all three locales**

en:
- `Academy.metaTitle`: `"SSP Academy — Learn Crypto Self-Custody"`
- `Academy.metaDescription`: `"Guides, tutorials, and deep dives on SSP, multisig, security, DeFi, and more."`

es:
- `Academy.metaTitle`: `"SSP Academy — Aprende autocustodia cripto"`
- `Academy.metaDescription`: `"Guías, tutoriales y análisis a fondo sobre SSP, multifirma, seguridad, DeFi y más."`

zh:
- `Academy.metaTitle`: `"SSP 学院 — 学习加密自托管"`
- `Academy.metaDescription`: `"关于 SSP、多重签名、安全、DeFi 等的指南、教程与深入解读。"`

- [ ] **Step 7.2: Rewrite the page to use translations**

Note: `getCategories()` returns CMS-derived data. For the seven canonical academy categories, read from `Academy.categories` messages; for any non-canonical category slug returned by the CMS, fall back to the CMS-supplied `c.title` / `c.description`.

Skeleton (full code structure mirrors current page, with these substitutions):

- Replace static `metadata` export with `generateMetadata` like Task 5.
- Inside `AcademyLandingPage`, parallelize `getTranslations` calls for `Academy`, `Academy.categories`, `Common`.
- Replace `<PageHeader title='SSP Academy' description='Guides, …' />` with `<PageHeader title={t('title')} description={t('description')} />`.
- Replace `<h2>Browse by topic</h2>` with `<h2>{t('browseByTopic')}</h2>`.
- For each category card, use `isAcademyCategory(c.slug) ? tCats(\`${c.slug}.title\`) : c.title` and the same for description.
- Replace `{c.postCount} article{c.postCount === 1 ? '' : 's'}` with `{t('articleCount', { count: c.postCount })}`.
- Replace `<h2>Learning paths</h2>` with `<h2>{t('learningPaths')}</h2>`.
- Replace the `View all` link text with `{t('viewAllSeries')}`.
- Replace `{s.postCount} parts` with `{t('partsCount', { count: s.postCount })}`.
- Replace `<h2>Latest articles</h2>` with `<h2>{t('latestArticles')}</h2>`.
- Replace `New articles coming soon — check back shortly.` with `{t('comingSoon')}`.
- Replace breadcrumb names `'Home'` / `'Academy'` with `tCommon('breadcrumbHome')` / `t('title')`.

Imports to add: `getTranslations` from `next-intl/server`, `isAcademyCategory` from `@/constants/academy-categories`.

- [ ] **Step 7.3: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/academy/page.tsx src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate academy landing page (header, sections, metadata)"
```

---

## Task 8: Academy category page

**Files:**
- Modify: `src/app/[locale]/academy/[category]/page.tsx`
- Modify: `src/app/[locale]/academy/[category]/_content/index.tsx` (if it contains literals)
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json` if new keys are needed

**Why:** Renders a category's `title` + `description` (covered by Task 4) plus likely a hardcoded breadcrumb and metadata.

- [ ] **Step 8.1: Read both files and inventory the literals**

Cross-reference against `docs/i18n/audit-2026-05-07.md`. Note literals that are CMS-served (out of scope) vs UI shells (in scope).

- [ ] **Step 8.2: Add any new keys needed**

Likely candidates (add only if used):
- `Academy.categoryMetaTitle`: `"{category} — SSP Academy"` / `"{category} — SSP Academy"` / `"{category} — SSP 学院"`
- `Academy.viewAllInCategory`: appropriate translations

If `metaTitle` should be parameterized by category, use ICU placeholders.

- [ ] **Step 8.3: Convert `metadata` to `generateMetadata` if it currently exports a static `metadata`**

Use `getTranslations` and the category slug from `params` to look up the right title and description.

- [ ] **Step 8.4: Replace literals in JSX with `t(...)` calls**

- [ ] **Step 8.5: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/academy/[category]/ src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate academy category page"
```

---

## Task 9: Academy article page (`[category]/[slug]`)

**Files:**
- Modify: `src/app/[locale]/academy/[category]/[slug]/page.tsx`

**Why:** Breadcrumb labels are hardcoded `'Home'` / `'Academy'` / `ACADEMY_CATEGORIES[category].title` and `backLabel='Back to ${...}'`. CMS-served fields stay as-is (Phase B).

- [ ] **Step 9.1: Add new keys**

en: `Academy.backToCategory`: `"Back to {category}"`
es: `Academy.backToCategory`: `"Volver a {category}"`
zh: `Academy.backToCategory`: `"返回{category}"`

- [ ] **Step 9.2: Update the page**

Replace literal breadcrumb names with `t()` calls. Replace `backLabel='Back to ${ACADEMY_CATEGORIES[category].title}'` with `t('backToCategory', { category: tCats(\`${category}.title\`) })`.

- [ ] **Step 9.3: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/academy/[category]/[slug]/page.tsx src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate academy article breadcrumbs and back-link"
```

---

## Task 10: Academy series pages

**Files:**
- Modify: `src/app/[locale]/academy/series/page.tsx`
- Modify: `src/app/[locale]/academy/series/[slug]/page.tsx`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json`

**Why:** Likely hardcoded `Series`, `All series`, breadcrumb labels, metadata.

- [ ] **Step 10.1: Read both files and inventory literals**

- [ ] **Step 10.2: Extend the `Academy` namespace (or add a `Series` sub-namespace) with the needed keys**

Candidates:
- `Academy.allSeries` / `Academy.seriesMetaTitle` / `Academy.seriesMetaDescription`

- [ ] **Step 10.3: Replace literals with `t()` calls; convert metadata exports to `generateMetadata`**

- [ ] **Step 10.4: Run checks + commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/academy/series/ src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate academy series listing and slug pages"
```

---

## Task 11: Author pages

**Files:**
- Modify: `src/app/[locale]/author/**`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json` if needed

**Why:** Already has an `Author` namespace in messages (`title`, `postsBy`, `noPosts`). Audit confirms whether the author pages use it; fix if they don't.

- [ ] **Step 11.1: Read author page files and check usage**

If the page already uses `useTranslations('Author')` / `getTranslations`, this task touches only breadcrumbs and metadata.

- [ ] **Step 11.2: Replace literals; add keys; commit**

```bash
npm run type-check && npm test
git add src/app/[locale]/author/ src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate author page"
```

---

## Task 12: Marketing pages — Features, Enterprise, Support, Contact, Download, Guide

**Files:**
- Modify: `src/app/[locale]/features/**`
- Modify: `src/app/[locale]/enterprise/**`
- Modify: `src/app/[locale]/support/**`
- Modify: `src/app/[locale]/contact/**`
- Modify: `src/app/[locale]/download/**`
- Modify: `src/app/[locale]/guide/**`
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json` — likely add `Features`, `Enterprise`, `Support`, `Contact`, `Download`, `Guide` namespaces

**Why:** These pages were not part of the initial i18n migration. Audit will reveal hardcoded strings.

> **Note for the executor:** This task may be split into one task per page if the literal count is high (>10 per page). Default to a single task per surface area; split only if commits would exceed ~150 lines of changes per page.

- [ ] **Step 12.1: For each page, read the file and inventory literals**

- [ ] **Step 12.2: Choose namespace per page (use `Features`, `Enterprise`, etc.)**

- [ ] **Step 12.3: Add keys to en.json + translate to es/zh**

- [ ] **Step 12.4: Replace literals with `t()` / convert metadata to `generateMetadata`**

- [ ] **Step 12.5: Commit per page**

Six commits, message format:
- `fix(i18n): translate features page`
- `fix(i18n): translate enterprise page`
- `fix(i18n): translate support page`
- `fix(i18n): translate contact page`
- `fix(i18n): translate download page`
- `fix(i18n): translate guide page`

---

## Task 13: Legal + transactional pages — Privacy Policy, Terms of Service, Cookie Policy, Case Studies, Checkout Success/Failure

**Files:**
- Modify: `src/app/[locale]/privacy-policy/**`
- Modify: `src/app/[locale]/terms-of-service/**`
- Modify: `src/app/[locale]/cookie-policy/**`
- Modify: `src/app/[locale]/case-studies/**`
- Modify: `src/app/[locale]/checkout_success/**`
- Modify: `src/app/[locale]/checkout_failure/**`

**Why:** Same pattern. Legal text bodies may already live in MDX files. **If a page imports an MDX file with English-only legal text, the legal text body itself is out of scope for this task** — translating legal text requires legal review per locale; flag it in the audit doc for a separate effort. UI shells (titles, headers, navigation back-links) ARE in scope.

- [ ] **Step 13.1-13.6: Same pattern, one commit per page**

Where a legal page renders MDX content directly, leave the body as-is; translate only the page title, headings outside the MDX, and metadata.

---

## Task 14: Home page + root layout + special pages

**Files:**
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/layout.tsx` (if it has user-visible literals)
- Modify: `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx` (if they exist)
- Modify: `src/messages/en.json`, `src/messages/es.json`, `src/messages/zh.json`

**Why:** Home page is the most important translation target by traffic. Error / not-found pages need to render correctly for users hitting bad URLs in any locale.

- [ ] **Step 14.1: Audit and fix the home page**

May warrant a dedicated `Home` namespace given hero copy, feature highlights, etc. Could be substantial — split into sub-tasks if the literal count is large (>15).

- [ ] **Step 14.2: Audit + fix root layout literals (if any)**

Likely empty or just metadata defaults.

- [ ] **Step 14.3: Audit + fix error / not-found / global-error pages**

Add `Common` keys: `notFoundTitle`, `notFoundDescription`, `goHome`, `errorTitle`, `errorDescription`, `tryAgain` (translate to es/zh too).

- [ ] **Step 14.4: Commit per page**

```bash
npm run type-check && npm test
git add src/app/[locale]/page.tsx src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate home page"

git add src/app/not-found.tsx src/app/error.tsx src/app/global-error.tsx src/messages/en.json src/messages/es.json src/messages/zh.json
git commit -m "fix(i18n): translate not-found and error boundary pages"
```

---

## Task 15: Shared components

**Files:**
- Modify: any file in `src/components/**` flagged by the audit

**Why:** Components rendered across multiple pages (PageHeader, Breadcrumbs, NewsroomCard, etc.) — fixing them once benefits every consumer.

- [ ] **Step 15.1: Re-run the audit to capture remaining `src/components/**` hits**

```bash
npx tsx scripts/audit-i18n.ts > /tmp/audit-components-only.md
grep -A1 'src/components/' /tmp/audit-components-only.md
```

- [ ] **Step 15.2: For each remaining component, decide on namespace**

Generic components (Breadcrumbs, PageHeader, ErrorBoundary) use `Common`. Surface-specific components (`newsroom/*`, `academy/*`, `header/*`, `footer/*`) use their existing namespace.

- [ ] **Step 15.3: Replace literals; add keys; translate; commit per component group**

Group commits by namespace owner (one commit per `src/components/<area>` directory).

---

## Task 16: Hardcoded-string guard test

**Files:**
- Create: `__tests__/i18n/no-hardcoded-strings.test.ts`
- Refactor: `scripts/audit-i18n.ts` → split logic into `src/i18n/audit.ts` (library) + `scripts/audit-i18n.ts` (thin CLI wrapper)

**Why:** Prevents regressions. From now on, any hardcoded English literal added to a page or component fails CI.

- [ ] **Step 16.1: Refactor the audit script into a library + wrapper**

Move the `audit()` function and the `Hit` type into `src/i18n/audit.ts`, exported. Keep the script as a thin wrapper that imports and prints.

- [ ] **Step 16.2: Write the guard test**

Create `__tests__/i18n/no-hardcoded-strings.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { audit } from '@/i18n/audit'

describe('no hardcoded strings in app pages and components', () => {
  it('reports zero literals after the i18n migration', async () => {
    const hits = await audit()
    const preview = hits.slice(0, 20)
      .map(h => `  ${h.file}:${h.line} (${h.reason}) ${h.snippet}`)
      .join('\n')
    const overflow = hits.length > 20 ? `\n  ... and ${hits.length - 20} more` : ''
    expect(
      hits,
      `Found ${hits.length} hardcoded literal(s):\n${preview}${overflow}`
    ).toEqual([])
  })
})
```

- [ ] **Step 16.3: Run the test**

```bash
npm test -- __tests__/i18n/no-hardcoded-strings.test.ts
```

- (a) PASS: proceed.
- (b) FAIL: fix each remaining literal in a follow-up commit per offender, OR add a justified entry to the script's `ALLOW` set with a comment naming why (e.g. `'GitHub'` — proper noun never translated).

- [ ] **Step 16.4: Commit**

```bash
git add src/i18n/audit.ts scripts/audit-i18n.ts __tests__/i18n/no-hardcoded-strings.test.ts
git commit -m "test(i18n): guard against new hardcoded strings in pages and components"
```

---

## Task 17: Final verification + PR

**Files:** none (verification only)

- [ ] **Step 17.1: Run full check suite**

```bash
npm run type-check
npm run lint
npm test
npm run build
```

All must be clean.

- [ ] **Step 17.2: Manual browser verification**

Start dev server: `npm run dev`.

Visit each URL and confirm no English bleed-through outside CMS-served content (Phase B will translate that):

- `/en` and `/es` and `/zh` — home
- `/{locale}/newsroom`
- `/{locale}/newsroom/<slug-of-existing-post>` (use one published seed post)
- `/{locale}/academy`
- `/{locale}/academy/multisig` (or any category)
- `/{locale}/academy/multisig/<slug>` (any published academy post)
- `/{locale}/features` and the other marketing pages
- `/{locale}/this-route-does-not-exist` → not-found

For each visited page, view source and confirm:
- `<html lang="..">` matches the locale segment
- `<title>` is translated
- `<meta name="description">` is translated
- Breadcrumb JSON-LD `name` fields are translated

- [ ] **Step 17.3: Note any layout issues**

Spanish text is typically 1.2–1.4× English length; watch for clipped buttons or wrapped breadcrumbs. If found, file a follow-up issue rather than blocking the PR.

- [ ] **Step 17.4: Push and open PR**

```bash
git push -u origin feature/i18n-phase-a
gh pr create --base feat/newsroom-academy-app-router-migration \
  --title "feat(i18n): Phase A — site-wide UI translation completeness" \
  --body-file docs/i18n/pr-body.md
```

(Create `docs/i18n/pr-body.md` ahead of the `gh pr create` call with the summary + test plan.)

---

## Self-review notes

- **Spec coverage:** every spec section maps to at least one task. Section 1 (fallback) → Task 1. Section 2 (audit + fix) → Tasks 3, 5–15. Section 3 (metadata) → Tasks 5, 7, 8, 9, 10, 12, 13, 14. Section 4 (academy categories) → Task 4. Section 5 (AI-translate) → embedded in every fix task. Verification → Tasks 2, 16, 17.
- **Type consistency:** `deepMerge` signature in Task 1 matches the call site in `request.ts`. `getTranslations` namespace strings (`Newsroom`, `Academy`, `Common`, `Academy.categories`) match keys added to `en.json` in their respective tasks. `isAcademyCategory` from Task 4 is consumed in Task 7. `Common.breadcrumbHome` defined in Task 5 is reused in Tasks 6, 7, 9.
- **Placeholders:** Tasks 8, 10, 11, 12, 13, 14, 15 use the phrase "audit and inventory" because the exact literal count per surface is not pre-known. Each has concrete file paths, the audit script from Task 3 produces the worklist, and each task ends in a commit. The pattern (add key → translate → replace literal → commit) is fully specified in Tasks 5–7 as templates. Pre-listing every literal across ~20 pages would balloon the plan beyond actionable size; mechanical discovery via the audit is intentional.
