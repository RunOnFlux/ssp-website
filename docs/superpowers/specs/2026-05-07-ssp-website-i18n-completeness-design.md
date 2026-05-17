# SSP Website i18n Completeness — Design Spec

> Phase A of a two-phase translation initiative. Phase B (CMS-served article translation) is a separate spec.

**Date:** 2026-05-07
**Repo:** `ssp-website`
**Branch:** `feature/i18n-phase-a`
**Prereq:** none
**Successor:** Phase B spec (CMS article translations) — to be written after this lands

## Goal

Every user-visible string rendered by `ssp-website` resolves through `next-intl`, with English as a silent fallback when a key is missing in `es` or `zh`. URLs already carry a locale segment (`/en/`, `/es/`, `/zh/`) and routing works; only the rendered text needs work.

## Background

`next-intl` is wired correctly:

- `src/i18n/routing.ts` — locales `['en', 'es', 'zh']`, `defaultLocale: 'en'`, `localePrefix: 'always'`
- `src/i18n/request.ts` — loads `src/messages/${locale}.json`
- `src/middleware.ts` — `createMiddleware(routing)` enforces locale prefix
- App tree under `src/app/[locale]/...` — every page calls `setRequestLocale(locale)`

Survey of the codebase (2026-05-07) found:

- Only **two** components actually call `useTranslations`: `src/components/newsroom/newsroom-listing.tsx` and `src/components/shared/post-article.tsx`.
- All article-page shells, breadcrumbs, page headers, and metadata exports use hardcoded English literals — even when serving `/es/` or `/zh/` URLs.
- `src/constants/academy-categories.ts` exposes `ACADEMY_CATEGORIES[c].title` as English strings; consumers render them directly.
- `metadata` is exported as a static value (e.g. `export const metadata = createMetadata({ title: 'Newsroom — …' })`), so SEO tags are English in every locale.

CMS-served fields (`title`, `description`, `content`, `imageAlt`, `seoTitle`, `seoDescription`, `tags`) are out of scope here — they require a CMS schema change covered in Phase B.

## Architecture

Five changes, each independently shippable.

### 1. English fallback in `src/i18n/request.ts`

Deep-merge the loaded `en.json` *under* the requested locale's messages so any missing key resolves to its English value automatically. Pattern (next-intl-recommended):

```ts
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale
  const localeMessages = (await import(`../messages/${locale}.json`)).default
  const englishMessages = locale === 'en'
    ? localeMessages
    : (await import('../messages/en.json')).default
  return {
    locale,
    messages: deepMerge(englishMessages, localeMessages),
  }
})
```

`deepMerge` is a small utility (recursive `Object.assign` with object detection); we'll write it inline rather than pull a dependency. Once landed, partial translation is never a regression — incomplete `es`/`zh` files render English for the missing keys instead of the next-intl error placeholder.

### 2. Site-wide literal audit & fix

Sweep these directories for user-visible English literals:

- `src/app/[locale]/**/*.tsx`
- `src/app/{not-found,error,global-error}.tsx` (root-level error pages)
- `src/components/**/*.tsx`
- `src/lib/**/*.ts(x)?` only if a string is rendered (most of `lib/` is data layer; should be empty)

What counts as a literal:

- JSX text nodes (`>Newsroom<`, `>Stay up to date<`)
- Props that render to the user: `title=`, `description=`, `aria-label=`, `aria-description=`, `placeholder=`, `alt=` (note: `alt` for CMS-served images is Phase B; `alt` for static decorative images is here), `<title>` content
- `Error('User-visible message')` thrown to a user-facing boundary

What does NOT count (leave alone):

- Test files, story files, dev-only console/log strings
- Internal route paths, slugs, IDs, environment-variable names
- Tailwind class names, ARIA roles, data-test-id values
- Markdown content authored in MDX (none exists currently — academy is CMS-driven)

Replace each literal with `useTranslations(namespace)` (client) or `getTranslations({ locale, namespace })` (server). Add the corresponding key to `src/messages/en.json` first, then translate to `es` and `zh` in the same commit. Group commits per surface area:

- `Newsroom` namespace — newsroom listing + slug page + components
- `Academy` namespace — academy listing + category + slug + components
- `Common` namespace — breadcrumbs, generic page header, error boundaries, not-found
- `Header` / `Footer` — already translated; only fix gaps surfaced by audit
- New namespaces only when content is shared across more than one surface and doesn't fit Common

### 3. Locale-aware metadata

Convert each affected page's static `metadata` export to `generateMetadata`:

```ts
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Newsroom' })
  return createMetadata({ title: t('metaTitle'), description: t('metaDescription') })
}
```

Affected pages (preliminary, finalized during audit):

- `src/app/[locale]/newsroom/page.tsx`
- `src/app/[locale]/newsroom/[slug]/page.tsx` — keep CMS-derived title/description for the slug shape, but breadcrumbs metadata is locale-derived
- `src/app/[locale]/academy/page.tsx`
- `src/app/[locale]/academy/[category]/page.tsx`
- `src/app/[locale]/academy/[category]/[slug]/page.tsx`
- `src/app/[locale]/layout.tsx` — root metadata if it sets any user-visible defaults

`createMetadata` (from `src/lib/metadata.ts` per existing pattern) keeps producing the OpenGraph + Twitter card; only `title` / `description` (and any other locale-sensitive fields it consumes) get translated input.

### 4. `ACADEMY_CATEGORIES` titles via messages

Current `src/constants/academy-categories.ts` mixes routing concerns (slug, parent section) with display concerns (title, description). Split:

- **Constant keeps:** `slug`, `section`, ordering, anything not user-visible.
- **Messages own:** `title`, `description` per category, keyed by slug:

```jsonc
{
  "Academy": {
    "categories": {
      "multisig": { "title": "Multisig Wallets", "description": "Self-custody with multiple keys" },
      "getting-started": { "title": "Getting Started", "description": "..." },
      // ...
    }
  }
}
```

Components that today read `ACADEMY_CATEGORIES[c].title` switch to:

```tsx
const t = useTranslations('Academy.categories')
const title = t(`${slug}.title`)
const description = t(`${slug}.description`)
```

A small helper (`getCategoryTitle(slug, t)`) may be added if the call pattern repeats more than 3× across components.

### 5. AI-translate new keys to `es` + `zh`

Once the English keys are added per surface, I AI-translate to `es` and `zh` inline in the same commit. With the fallback from change 1 in place, missing entries fall back to English silently — but we ship complete coverage.

Style guide for translations:

- Match the existing tone in current `es.json` / `zh.json` entries (formal Spanish, Simplified Chinese)
- Keep English brand names: "SSP", "Newsroom", "Academy" stay as proper nouns even in translations *unless* the existing files already translate them
- Punctuation conventions: Spanish uses `¿…?` / `¡…!`; Chinese uses 全角 punctuation (`，` `。` `？`)
- Length: button labels and breadcrumbs should not exceed ~1.5× the English source character count to avoid layout breakage

## Verification

### Automated

1. **Hardcoded-string guard test** — `__tests__/i18n/no-hardcoded-strings.test.ts`. A grep-style test that scans `src/app/[locale]/**` and `src/components/**` for suspicious patterns. Implementation: walk the file tree, parse each `.tsx` with a regex pass for JSX text content matching `>[A-Z][a-z]+ ?[A-Z]?[a-z]*<` (capitalized text between JSX tags), filter out an explicit allow-list (component names, brand strings like `SSP`, `Newsroom`, `Academy`). Test fails if any match falls outside the allow-list, with a helpful error message naming the file and matched string. The allow-list is committed alongside the test.

2. **Type-check, lint, unit tests, build** — `yarn type-check && yarn lint && yarn test && yarn build` all green.

3. **Locale-completeness check** — `__tests__/i18n/locale-coverage.test.ts`. Loads `en.json`, `es.json`, `zh.json` and asserts every key present in `en.json` exists in `es.json` and `zh.json` (deep). Reports which keys are missing if any. With the fallback in place, missing keys are not a runtime error, but this test catches accidental drift during development.

### Manual

Browse each locale and confirm no English bleed-through on:

- `/{locale}/` (home)
- `/{locale}/newsroom`
- `/{locale}/newsroom/{slug-of-existing-post}`
- `/{locale}/academy`
- `/{locale}/academy/{category}`
- `/{locale}/academy/{category}/{slug-of-existing-post}`
- `/{locale}/not-found-route` → not-found page
- View page source: `<title>` and `<meta name="description">` are translated
- View page source: `<html lang="es">` / `<html lang="zh">` is correct (already handled by existing layout — confirm not regressed)

## Out of Scope

- CMS-served fields: `Post.title`, `Post.description`, `Post.content`, `Post.imageAlt`, `Post.imageSquareAlt`, `Post.imageStoryAlt`, `Post.seoTitle`, `Post.seoDescription` — Phase B.
- User-defined `Post.tags` strings — Phase B (or deferred indefinitely if tags are kept English-only).
- `Post.author` display names — author identity is language-neutral, not translated.
- Adding new locales beyond `en`/`es`/`zh` — out of scope; spec is locale-set-stable.
- Backend / CMS changes — none.

## Risks

- **Layout breakage from longer translations.** Spanish translations of UI labels are typically 1.2–1.4× the English length. We watch for clipped buttons / wrapped breadcrumbs during manual verification.
- **AI translation tone drift.** Mitigated by following the existing translated content's tone and the user reviewing in the PR; correction PRs are cheap and expected.
- **Regression on the two components already using `useTranslations`.** Touching their namespaces could rename keys; we keep existing keys stable and only add new ones, no renames.
- **`generateMetadata` async cost.** `getTranslations` in `generateMetadata` is the documented next-intl pattern; no measurable cost, but it does mean metadata is dynamic now. If any deployment caches static-metadata-only routes, they need to handle dynamic metadata. We confirm the build output still tags pages as appropriate.
