# Newsroom + Academy with App-Router Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the SSP wallet website end-to-end from Pages Router (JS) to App Router (TS) with `next-intl` i18n, then build full Newsroom and Academy sections (mirroring Zelcore's contract, re-skinned to SSP tokens) backed by a CMS client with a seed-fallback so the site renders before the SSP dashboard CMS exists.

**Architecture:** Single PR off `master` to branch `feat/newsroom-academy-app-router-migration`. App Router + TypeScript + next-intl + Tailwind v4. Newsroom/Academy content flows through `src/lib/cms.ts` which targets a Zelcore-compatible CMS API; when env vars are unset or the CMS errors, it falls back to publication-ready Markdown shipped under `/content/`. Every static route gets a sibling `agent.md` served via `Accept: text/markdown` middleware. Open-source commit hygiene enforced by a `prebuild` guard.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind v4, next-intl 3, Radix UI, react-markdown + remark-gfm + rehype-pretty-code, gray-matter, lru-cache, Vitest, Framer Motion, Lucide.

**Source spec:** `docs/superpowers/specs/2026-04-27-newsroom-academy-app-router-migration-design.md`

**Branch:** `feat/newsroom-academy-app-router-migration` (already created, off `master`).

**Commit author rule:** Every commit must be authored by `Stultus Mundi`. **No `Co-Authored-By: Claude` trailer. No "Generated with Claude Code" line. No Claude mentions in commit bodies.** This is non-negotiable.

**Open-source commit rule:** Only publication-ready content. No internal API keys, no internal hostnames, no embargoed material, no draft articles. The `scripts/check-public-safe.ts` (built in Phase 21) enforces this in `prebuild`.

---

## Phase Map

| Phase | Scope | Acceptance |
|-------|-------|-----------|
| 0 | Branch verification | On `feat/newsroom-academy-app-router-migration` |
| 1 | Tooling: deps, tsconfig, next.config | `tsc --noEmit` passes; `next dev` boots |
| 2 | i18n + locale shell + middleware | Empty `/en` route 200s |
| 3 | Theme + root layout chrome | `/en` renders with theme provider |
| 4 | Header/Footer/Logo migrated | `/en` renders with chrome, theme toggle works |
| 5 | SEO library | `seo.ts` tested green |
| 6 | Homepage migrated | `/en` matches production homepage |
| 7 | Other static pages migrated | All 12 static routes match production |
| 8 | API routes migrated | `/api/contact`, `/api/support` POST works |
| 9 | Sitemap + robots route handlers | `/sitemap.xml`, `/robots.txt` serve correctly |
| 10 | Delete `pages/` and old `components/` | Repo is fully app-router |
| **GATE** | **Foundation acceptance** | Lighthouse parity, visual diff, all tests pass |
| 11 | Types + constants | `NewsroomPost`, `AcademyCategory`, `supportedChains` defined |
| 12 | CMS client + seed-fallback (TDD) | All `cms.ts` functions tested green |
| 13 | SEO academy + glossary linker (TDD) | `seo-academy.ts`, `glossary-linker.ts` tested green |
| 14 | Agent.md resolver + middleware integration (TDD) | `agent-md/resolve.ts` tested; `Accept: text/markdown` works |
| 15 | Newsroom + shared components | Components render in dev harness |
| 16 | Newsroom routes + RSS | `/newsroom`, `/newsroom/[slug]`, `/newsroom/rss.xml` |
| 17 | Academy routes + RSS | All `/academy/*` routes |
| 18 | Author route | `/author/[slug]` |
| 19 | Seed content (USER REVIEW GATE) | 10 articles + author + 15-20 glossary terms |
| 20 | Header/Footer updates | Newsroom + Academy nav, locale switcher, Learn column |
| 21 | Agent skills + check scripts | `prebuild` scripts in place |
| 22 | Docs updates | README, CLAUDE.md, content-authoring.md, cms-integration.md, .env.example |
| 23 | Final verification | All gates from spec §6 pass |

---

## Conventions used throughout this plan

**TDD discipline (mandatory for new logic — Phases 12, 13, 14, 21):**
1. Write the failing test.
2. Run it. Confirm it fails for the expected reason.
3. Write the minimal code to pass.
4. Run it. Confirm green.
5. Refactor (if needed). Re-run.
6. Commit.

**Visual / migration tasks (Phases 6, 7, 15, 16, 17, 18):** No unit tests — verification is `npm run dev`, screenshot the route, compare to production. The plan calls out the URL to check and what to verify.

**Commit format:** `<type>(<scope>): <subject>`. Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`. Scope examples: `cms`, `newsroom`, `academy`, `i18n`, `migration`, `seo`, `agent-md`. **Never** include Claude trailers.

**Path conventions:** All new code under `src/`. Imports use `@/` alias. Component file names are kebab-case (`newsroom-card.tsx`).

**JSON-LD insertion convention (used throughout):** Use Next.js `<Script>` with children for inline JSON-LD, like:

```tsx
<Script id="my-jsonld" type="application/ld+json" strategy="afterInteractive">
  {JSON.stringify(createBlogPostingJsonLd(post))}
</Script>
```

This avoids the legacy inline-HTML prop pattern entirely and renders the JSON-LD as the script body. Pure server-rendered JSON of structures we control — never user input.

---

## Phase 0 — Branch verification

### Task 0.1: Confirm branch state

**Files:** none

- [ ] **Step 1: Verify branch and clean tree**

Run:
```bash
git branch --show-current
git status
```
Expected: `feat/newsroom-academy-app-router-migration` and a clean tree (the spec doc commit `207a9da` is already there).

If on `master`, run `git checkout feat/newsroom-academy-app-router-migration`. If the branch doesn't exist, create it: `git checkout -b feat/newsroom-academy-app-router-migration master`.

---

## Phase 1 — Tooling: TypeScript + dependencies + config

### Task 1.1: Install runtime + dev dependencies

**Files:** `package.json`, `package-lock.json` (npm updates)

- [ ] **Step 1: Install runtime deps**

```bash
npm install \
  next-intl@^3 \
  @radix-ui/react-dialog@^1 \
  @radix-ui/react-dropdown-menu@^2 \
  @radix-ui/react-navigation-menu@^1 \
  @radix-ui/react-tabs@^1 \
  @radix-ui/react-accordion@^1 \
  @radix-ui/react-toast@^1 \
  @radix-ui/react-slot@^1 \
  class-variance-authority@^0.7 \
  tailwind-merge@^2 \
  tailwindcss-animate@^1 \
  react-markdown@^10 \
  remark-gfm@^4 \
  rehype-pretty-code@^0.14 \
  gray-matter@^4 \
  lru-cache@^11
```

- [ ] **Step 2: Install dev deps**

```bash
npm install --save-dev \
  typescript@~5.9 \
  @types/node@~25 \
  @types/react@~19 \
  @types/react-dom@~19 \
  vitest@^4 \
  @vitest/ui@^4 \
  happy-dom@^20 \
  tsx@^4
```

- [ ] **Step 3: Verify**

`npx tsc --version && npx vitest --version && npx tsx --version` — all three print versions.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(deps): add typescript, next-intl, radix, markdown, and test toolchain"
```

### Task 1.2: tsconfig.json + next-env.d.ts

**Files:** Create `tsconfig.json`, `next-env.d.ts`

- [ ] **Step 1: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 3: Verify** — `npx tsc --noEmit` passes (zero errors).

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json next-env.d.ts
git commit -m "chore(ts): add tsconfig with @/* path alias"
```

### Task 1.3: Convert next.config.js → next.config.ts with next-intl

**Files:** delete `next.config.js`, create `next.config.ts`

- [ ] **Step 1: Read existing `next.config.js`** to capture all settings.

- [ ] **Step 2: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
  experimental: { scrollRestoration: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Delete old config** — `rm next.config.js`

- [ ] **Step 4: Commit**

```bash
git add next.config.ts
git rm next.config.js
git commit -m "chore(config): convert next.config to TypeScript and wire next-intl"
```

### Task 1.4: package.json scripts overhaul

**Files:** modify `package.json`

- [ ] **Step 1: Replace scripts block**

```json
"scripts": {
  "dev": "next dev",
  "prebuild": "tsx scripts/check-public-safe.ts && tsx scripts/check-agent-md-staleness.ts && tsx scripts/generate-chains-skill.ts",
  "build": "next build",
  "start": "next start",
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "type-check": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:ui": "vitest --ui",
  "check:public-safe": "tsx scripts/check-public-safe.ts",
  "check:agent-md-staleness": "tsx scripts/check-agent-md-staleness.ts",
  "agent-skills:generate": "tsx scripts/generate-chains-skill.ts",
  "pre-commit": "npm run lint:fix && npm run format",
  "check-all": "npm run type-check && npm run lint && npm run format:check && npm run test"
}
```

`prebuild` will fail until the three scripts exist (Phase 21). Until then, run `npm run dev` for local iteration; skip `npm run build` until Phase 21.

- [ ] **Step 2: Drop next-sitemap dep**

```bash
npm uninstall next-sitemap
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore(scripts): rewrite npm scripts for app-router workflow; drop next-sitemap"
```

### Task 1.5: Vitest config

**Files:** create `vitest.config.ts`

- [ ] **Step 1: Write**

```ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'content'],
  },
  resolve: { alias: { '@': resolve(__dirname, './src') } },
});
```

- [ ] **Step 2: Verify** — `npx vitest run` reports "No test files found" (correct for now).

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore(test): add vitest config with @/* alias and happy-dom"
```

### Task 1.6: ESLint sanity check

- [ ] **Step 1: Run `npm run lint`** — expect no errors. The existing `next/core-web-vitals` config understands TS files.
- [ ] **Step 2: Read `.prettierignore`.** If it excludes `.ts`/`.tsx`, remove that line. Commit if changed.

---

## Phase 2 — i18n + locale shell + middleware

### Task 2.1: i18n routing + request + navigation modules

**Files:** create `src/i18n/{routing,request,navigation}.ts`

- [ ] **Step 1: `src/i18n/routing.ts`**

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'es', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
```

- [ ] **Step 2: `src/i18n/request.ts`**

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 3: `src/i18n/navigation.ts`**

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

- [ ] **Step 4: Commit**

```bash
git add src/i18n/
git commit -m "feat(i18n): add next-intl routing, request, and navigation helpers"
```

### Task 2.2: Message catalogs

**Files:** create `src/messages/{en,es,zh}.json`

- [ ] **Step 1: Write `src/messages/en.json`** (canonical English copy — source of truth)

```json
{
  "Common": {
    "skipToContent": "Skip to content",
    "loading": "Loading…",
    "error": "Something went wrong.",
    "retry": "Retry",
    "readMore": "Read more"
  },
  "Header": {
    "home": "Home",
    "enterprise": "Enterprise",
    "features": "Features",
    "newsroom": "Newsroom",
    "academy": "Academy",
    "guide": "Guide",
    "support": "Support",
    "contact": "Contact",
    "more": "More",
    "download": "Download",
    "toggleTheme": "Toggle theme",
    "toggleMenu": "Toggle menu",
    "selectLanguage": "Select language"
  },
  "Footer": {
    "navigation": "Navigation",
    "product": "Product",
    "learn": "Learn",
    "community": "Community",
    "legal": "Legal",
    "supportedChains": "Supported Chains",
    "rssFeed": "RSS Feed",
    "cookieSettings": "Cookie Settings",
    "rights": "All rights reserved.",
    "builtForWeb3": "Built with ❤️ for Web3",
    "poweredByFlux": "Powered by Flux"
  },
  "Newsroom": {
    "title": "Newsroom",
    "description": "Latest news, product updates, and announcements from SSP.",
    "filterAll": "All",
    "loadMore": "Load more",
    "noArticles": "No articles match this filter yet.",
    "backToNewsroom": "Back to Newsroom",
    "shareTitle": "Share this article",
    "shareTwitter": "Share on Twitter",
    "shareFacebook": "Share on Facebook",
    "shareTelegram": "Share on Telegram",
    "shareReddit": "Share on Reddit",
    "shareCopy": "Copy link",
    "shareCopied": "Link copied!",
    "tableOfContents": "On this page",
    "relatedArticles": "Related articles",
    "minRead": "{minutes} min read",
    "byAuthor": "By {author}",
    "publishedOn": "Published {date}",
    "updatedOn": "Updated {date}"
  },
  "Academy": {
    "title": "SSP Academy",
    "description": "Guides, tutorials, and deep dives to help you master self-custody with SSP.",
    "browseByTopic": "Browse by topic",
    "learningPaths": "Learning paths",
    "viewAllSeries": "View all",
    "latestArticles": "Latest articles",
    "comingSoon": "New articles coming soon — check back shortly.",
    "categoryEmpty": "New articles coming soon. In the meantime, explore related topics:",
    "articleCount": "{count, plural, =0 {No articles} =1 {1 article} other {# articles}}",
    "partsCount": "{count, plural, =0 {No parts} =1 {1 part} other {# parts}}",
    "difficulty": {
      "beginner": "Beginner",
      "intermediate": "Intermediate",
      "advanced": "Advanced"
    },
    "atAGlance": "At a glance",
    "seriesPart": "Part {order} of {total}",
    "previousPart": "Previous part",
    "nextPart": "Next part"
  },
  "Author": {
    "title": "{name}",
    "postsBy": "Posts by {name}",
    "noPosts": "No posts yet."
  }
}
```

- [ ] **Step 2: Generate es.json + zh.json with TODO markers**

```bash
node -e "
const fs = require('fs');
const en = require('./src/messages/en.json');
function mark(o) {
  if (typeof o === 'string') return '__TODO_TRANSLATE__ ' + o;
  if (Array.isArray(o)) return o.map(mark);
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k,v]) => [k, mark(v)]));
  return o;
}
fs.writeFileSync('./src/messages/es.json', JSON.stringify(mark(en), null, 2) + '\n');
fs.writeFileSync('./src/messages/zh.json', JSON.stringify(mark(en), null, 2) + '\n');
"
```

ICU placeholders like `{minutes}`, `{count, plural, …}` MUST be preserved verbatim through translation. The `__TODO_TRANSLATE__` prefix sits *outside* placeholders, so translators just unwrap each string while preserving the inner template.

- [ ] **Step 3: Verify shape parity**

```bash
node -e "
const en = require('./src/messages/en.json');
const es = require('./src/messages/es.json');
const zh = require('./src/messages/zh.json');
function keys(o, p='') { const out = []; for (const [k,v] of Object.entries(o)) { const q = p?p+'.'+k:k; if (v && typeof v==='object' && !Array.isArray(v)) out.push(...keys(v,q)); else out.push(q); } return out; }
const ek = JSON.stringify(keys(en).sort());
console.log('es match:', ek === JSON.stringify(keys(es).sort()));
console.log('zh match:', ek === JSON.stringify(keys(zh).sort()));
"
```
Expected: `es match: true` and `zh match: true`.

- [ ] **Step 4: Commit**

```bash
git add src/messages/
git commit -m "feat(i18n): seed en/es/zh message catalogs (es/zh marked TODO for translators)"
```

### Task 2.3: Middleware (i18n-only; markdown serving comes in Phase 14)

**Files:** create `src/middleware.ts`

- [ ] **Step 1: Write**

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat(i18n): add next-intl middleware with locale prefix matcher"
```

### Task 2.4: Locale layout placeholder + smoke route

**Files:** create `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`

- [ ] **Step 1: `src/app/layout.tsx`** (passthrough)

```tsx
import type { ReactNode } from 'react';
export default function RootLayout({ children }: { children: ReactNode }) { return children; }
```

- [ ] **Step 2: `src/app/[locale]/layout.tsx`** (placeholder; Phase 3 fills it)

```tsx
import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: `src/app/[locale]/page.tsx`** (temp)

```tsx
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('Header');
  return (
    <main style={{ padding: '2rem' }}>
      <h1>{t('home')}</h1>
      <p>Foundation migration in progress. Replaced in Phase 6.</p>
    </main>
  );
}
```

- [ ] **Step 4: Verify**

`npm run dev`. Visit `/en` (placeholder Home), `/` (redirects to `/en`), `/es` and `/zh` (show `__TODO_TRANSLATE__ Home`). Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/app/
git commit -m "feat(app-router): bootstrap locale-aware [locale] layout with i18n provider"
```

### Task 2.5: Smoke test for routing config

**Files:** create `src/i18n/routing.test.ts`

- [ ] **Step 1: Write the test**

```ts
import { describe, it, expect } from 'vitest';
import { routing } from './routing';

describe('routing', () => {
  it('lists en, es, zh as supported locales', () => {
    expect(routing.locales).toEqual(['en', 'es', 'zh']);
  });
  it('uses en as the default locale', () => {
    expect(routing.defaultLocale).toBe('en');
  });
  it('always emits a locale prefix', () => {
    expect(routing.localePrefix).toBe('always');
  });
});
```

- [ ] **Step 2: Run** — `npx vitest run src/i18n/routing.test.ts` → 3 passing.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/routing.test.ts
git commit -m "test(i18n): smoke-test routing config"
```

---

(Phases 3–23 follow in subsequent sections of this plan document. The plan is split for readability; everything from Phase 3 onward is appended in subsequent sections of the same file.)

---

## Phase 3 — Theme tokens + root layout chrome

### Task 3.1: Move globals.css to src/app and add Tailwind v4 @theme block

**Files:** read `styles/globals.css`, create `src/app/globals.css`, delete `styles/globals.css`

- [ ] **Step 1: Read existing `styles/globals.css`** in full to capture every rule.

- [ ] **Step 2: Write `src/app/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import 'tailwindcss';
@plugin 'tailwindcss-animate';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-display: 'Space Grotesk', 'Inter', sans-serif;

  --color-primary-50:  #fffbeb;
  --color-primary-100: #fef3c7;
  --color-primary-200: #fde68a;
  --color-primary-300: #fcd34d;
  --color-primary-400: #fbbf24;
  --color-primary-500: #f59e0b;
  --color-primary-600: #d97706;
  --color-primary-700: #b45309;
  --color-primary-800: #92400e;
  --color-primary-900: #78350f;

  --color-dark-50:  #f8fafc;
  --color-dark-100: #f1f5f9;
  --color-dark-200: #e2e8f0;
  --color-dark-300: #cbd5e1;
  --color-dark-400: #94a3b8;
  --color-dark-500: #64748b;
  --color-dark-600: #475569;
  --color-dark-700: #334155;
  --color-dark-800: #1e293b;
  --color-dark-900: #0f172a;
  --color-dark-950: #020617;

  --radius-card: 1.25rem;
  --radius-pill: 9999px;
}

@layer base {
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-sans); @apply bg-white text-gray-900 antialiased; }
  .dark body { @apply bg-dark-950 text-gray-100; }
}

@layer components {
  .container-custom { @apply mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8; }
  .section-padding { @apply py-16 md:py-24; }
  .btn { @apply inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-150; }
  .btn-primary { @apply bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-950; }
  .btn-secondary { @apply border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-100 dark:hover:bg-dark-700; }
  .card { @apply rounded-card border border-gray-200 bg-white p-6 shadow-sm dark:border-dark-700 dark:bg-dark-800; }
}
```

If the original had additional rules (cookie banner styles, custom animations, etc.), append them to the appropriate `@layer` block.

- [ ] **Step 3: Delete old globals.css**

```bash
rm styles/globals.css
rmdir styles 2>/dev/null || true
```

- [ ] **Step 4: Wire into locale layout** — add `import '@/app/globals.css';` as the first import of `src/app/[locale]/layout.tsx`.

- [ ] **Step 5: Verify** — `npm run dev`, visit `/en`, confirm Inter font loads. Stop dev.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/[locale]/layout.tsx
git rm styles/globals.css
git commit -m "feat(theme): port globals.css to src/app with Tailwind v4 @theme tokens"
```

### Task 3.2: Port useTheme hook

**Files:** read `hooks/useTheme.js`, create `src/hooks/use-theme.ts`

- [ ] **Step 1: Write**

```ts
'use client';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  function toggleTheme() { setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'); }
  return { theme: resolvedTheme, setTheme, toggleTheme, mounted };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/use-theme.ts
git commit -m "feat(theme): port useTheme hook to TypeScript"
```

### Task 3.3: Port ThemeProvider

**Files:** read `components/ThemeProvider.js`, create `src/components/theme-provider.tsx`

- [ ] **Step 1: Write**

```tsx
'use client';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/theme-provider.tsx
git commit -m "feat(theme): port ThemeProvider to TypeScript"
```

### Task 3.4: Port CookieConsent

**Files:** read `components/CookieConsent.js`, create `src/components/cookie-consent.tsx`

- [ ] **Step 1: Read the original** in full. The component is non-trivial — it manages cookie state, opens a settings modal, conditionally loads GA. Preserve all behavior verbatim.

- [ ] **Step 2: Translate to TS** at `src/components/cookie-consent.tsx`. Add `'use client'`. Type all state/refs/handlers. Replace `from '../lib/gtag'` with `from '@/lib/gtag'` (we port gtag in Task 3.5).

If the component uses globals like `window.openCookieSettings`, declare them:

```tsx
declare global {
  interface Window {
    openCookieSettings?: () => void;
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/cookie-consent.tsx
git commit -m "feat(theme): port CookieConsent to TypeScript"
```

### Task 3.5: Port lib/gtag.js + lib/utils.js

**Files:** create `src/lib/gtag.ts` and `src/lib/utils.ts`

- [ ] **Step 1: `src/lib/gtag.ts`**

```ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export function pageview(url: string): void {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) return;
  window.gtag('config', GA_TRACKING_ID, { page_path: url });
}

interface GtagEvent { action: string; category: string; label: string; value?: number; }

export function event({ action, category, label, value }: GtagEvent): void {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', action, { event_category: category, event_label: label, value });
}
```

Preserve any extra exports the original `lib/gtag.js` had.

- [ ] **Step 2: `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

If the original `lib/utils.js` had additional helpers, port them too with proper types.

- [ ] **Step 3: Commit**

```bash
git add src/lib/gtag.ts src/lib/utils.ts
git commit -m "feat(lib): port gtag and utils helpers to TypeScript"
```

### Task 3.6: Wire chrome into the locale layout

**Files:** modify `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Replace contents**

```tsx
import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Space_Grotesk } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/theme-provider';
import { CookieConsent } from '@/components/cookie-consent';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://sspwallet.io'),
  title: {
    default: 'SSP Wallet — Secure, Simple, Powerful Crypto Wallet',
    template: '%s | SSP Wallet',
  },
  description:
    'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/ssp-logo-black.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'SSP Wallet',
    images: [{ url: '/og-image.png', width: 1200, height: 630, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sspwallet_io',
    creator: '@sspwallet_io',
    images: ['/og-image.png'],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as never)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            {children}
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* SoftwareApplication JSON-LD — moved into seo.ts in Phase 5; this is the placeholder. */}
        <Script id="ssp-software-application-jsonld" type="application/ld+json" strategy="afterInteractive">
          {`{"@context":"https://schema.org","@type":["SoftwareApplication","WebApplication"],"name":"SSP Wallet","url":"https://sspwallet.io"}`}
        </Script>

        {/* kapa.ai widget — preserved verbatim from old _document.js */}
        <Script
          async
          strategy="afterInteractive"
          src="https://widget.kapa.ai/kapa-widget.bundle.js"
          data-website-id="1d29b730-6686-4ae2-b724-41d41c754e7b"
          data-project-name="SSP"
          data-project-color="#f59e0b"
          data-user-analytics-fingerprint-enabled="true"
          data-search-mode-enabled="true"
          data-project-logo="https://raw.githubusercontent.com/RunOnFlux/ssp-wallet/refs/heads/master/public/ssp-logo-white.svg"
          data-modal-image="https://raw.githubusercontent.com/RunOnFlux/ssp-wallet/refs/heads/master/public/ssp-logo-black.svg"
          data-button-image-width="18"
          data-button-image-height="24"
          data-button-height="3.125rem"
          data-button-width="2.8125rem"
          data-button-text-font-size="0.7rem"
          data-modal-image-width="36"
          data-modal-image-height="48"
          data-modal-disclaimer="This is a custom LLM for answering questions about SSP and other Flux products."
          data-button-hide="false"
          data-modal-override-open-id="kapa-button"
          data-mcp-enabled="true"
          data-mcp-server-url="https://flux.mcp.kapa.ai"
        />
      </body>
    </html>
  );
}
```

The minimal SSP `SoftwareApplication` JSON-LD placeholder is upgraded in Phase 5 Task 5.1 (replaced by `createSoftwareApplicationJsonLd()` from `src/lib/seo.ts`, which emits the **full** structure preserved from the old `pages/_document.js`).

- [ ] **Step 2: Verify** — `npm run dev`, visit `/en`. Confirm fonts load, theme provider works, kapa.ai widget appears bottom-right. Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(layout): wire ThemeProvider, fonts, JSON-LD placeholder, and kapa.ai widget"
```

---

## Phase 4 — Header, Footer, Logo migrated

### Task 4.1: Port Logo

**Files:** read `components/Logo.js`, create `src/components/logo.tsx`

- [ ] **Step 1: Read original** to capture the theme-switching mechanism.

- [ ] **Step 2: Write**

```tsx
'use client';
import Image from 'next/image';
import { useTheme } from '@/hooks/use-theme';

interface LogoProps { width?: number; height?: number; className?: string; }

export function Logo({ width = 120, height = 40, className }: LogoProps) {
  const { theme, mounted } = useTheme();
  const src = mounted && theme === 'dark' ? '/ssp-logo-white.svg' : '/ssp-logo-black.svg';
  return <Image src={src} alt="SSP Wallet" width={width} height={height} priority className={className} />;
}
```

If the original used a different mechanism (e.g. CSS `dark:hidden` toggle between two `<img>`s), preserve that approach — the version above avoids hydration flicker.

- [ ] **Step 3: Commit**

```bash
git add src/components/logo.tsx
git commit -m "feat(components): port Logo to TypeScript"
```

### Task 4.2: Port Header

**Files:** read `components/Header.js`, create `src/components/header/header.tsx`

- [ ] **Step 1: Translate verbatim** — preserve mobile menu, theme toggle, scroll-state, route-aware active link.

Key translations:
- `useRouter` from `next/router` → `usePathname` from `next/navigation` (compares against `pathname`).
- `Link` from `next/link` → `Link` from `@/i18n/navigation` (locale-aware).
- All `cn(…)` calls keep working via `@/lib/utils`.
- Hardcoded `"Home"`/`"Features"` etc. → `t('home')`/`t('features')` etc. with `const t = useTranslations('Header');`.
- `'use client'` directive at the top.

**Newsroom + Academy nav items + locale switcher land in Phase 20**, NOT here.

For active-link comparison: `usePathname` from `@/i18n/navigation` strips the locale prefix, so comparing to `'/features'` works directly.

- [ ] **Step 2: Commit**

```bash
git add src/components/header/header.tsx
git commit -m "feat(header): port Header to TypeScript with locale-aware navigation"
```

### Task 4.3: Port Footer + extract supported chains constant

**Files:** read `components/Footer.js`, create `src/constants/supported-chains.ts`, create `src/components/footer/footer.tsx`

- [ ] **Step 1: `src/constants/supported-chains.ts`**

```ts
export interface SupportedChain { symbol: string; name: string; network: 'utxo' | 'evm'; }

export const SUPPORTED_CHAINS: readonly SupportedChain[] = [
  { symbol: 'BTC',   name: 'Bitcoin',           network: 'utxo' },
  { symbol: 'ETH',   name: 'Ethereum',          network: 'evm' },
  { symbol: 'LTC',   name: 'Litecoin',          network: 'utxo' },
  { symbol: 'ZEC',   name: 'Zcash',             network: 'utxo' },
  { symbol: 'RVN',   name: 'Ravencoin',         network: 'utxo' },
  { symbol: 'DOGE',  name: 'Dogecoin',          network: 'utxo' },
  { symbol: 'BCH',   name: 'Bitcoin Cash',      network: 'utxo' },
  { symbol: 'FLUX',  name: 'Flux',              network: 'utxo' },
  { symbol: 'MATIC', name: 'Polygon',           network: 'evm' },
  { symbol: 'BSC',   name: 'BNB Smart Chain',   network: 'evm' },
  { symbol: 'AVAX',  name: 'Avalanche',         network: 'evm' },
  { symbol: 'BASE',  name: 'Base',              network: 'evm' },
] as const;
```

The Footer and the homepage `SupportedChains` component (Phase 6) both import from here. `scripts/generate-chains-skill.ts` (Phase 21) reads this file to regenerate the agent-skill SKILL.md.

- [ ] **Step 2: `src/components/footer/footer.tsx`** — translate `components/Footer.js` to TS, replace inline chain array with `import { SUPPORTED_CHAINS } from '@/constants/supported-chains'`, replace `Link` imports with locale-aware versions, replace hardcoded section headings with `t('navigation')`/`t('product')`/etc. The **Learn** column is added in Phase 20, not here. `'use client'` is required (cookie-settings button uses `window.openCookieSettings`).

- [ ] **Step 3: Commit**

```bash
git add src/constants/supported-chains.ts src/components/footer/footer.tsx
git commit -m "feat(footer): port Footer to TypeScript and extract SUPPORTED_CHAINS constant"
```

### Task 4.4: Wire Header + Footer into locale layout

**Files:** modify `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add imports**

```tsx
import { Header } from '@/components/header/header';
import { Footer } from '@/components/footer/footer';
```

- [ ] **Step 2: Wrap children**

Replace the body inner block with:

```tsx
<NextIntlClientProvider locale={locale} messages={messages}>
  <ThemeProvider>
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden pt-16 md:pt-20">{children}</main>
      <Footer />
    </div>
    <CookieConsent />
  </ThemeProvider>
</NextIntlClientProvider>
```

- [ ] **Step 3: Verify** — `npm run dev`. `/en` shows full chrome (header + theme toggle + Download button + footer). Theme toggle works. Mobile menu opens at narrow widths.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/layout.tsx
git commit -m "feat(layout): wire Header and Footer into locale layout"
```

---

## Phase 5 — SEO library

### Task 5.1: Build src/lib/seo.ts (TDD)

**Files:** create `src/lib/seo.ts` and `src/lib/seo.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/seo.test.ts
import { describe, it, expect } from 'vitest';
import { createMetadata, siteUrl, siteName, createSoftwareApplicationJsonLd, createBlogPostingJsonLd, createBreadcrumbJsonLd, createCollectionPageJsonLd } from './seo';

describe('siteUrl', () => {
  it('is the production SSP URL', () => {
    expect(siteUrl).toBe('https://sspwallet.io');
  });
});

describe('createMetadata', () => {
  it('builds a canonical URL from path', () => {
    const m = createMetadata({ title: 'X', description: 'Y', path: '/foo' });
    expect(m.alternates?.canonical).toBe('https://sspwallet.io/foo');
  });
  it('respects an override canonical', () => {
    const m = createMetadata({ title: 'X', description: 'Y', path: '/foo', canonical: 'https://example.com/x' });
    expect(m.alternates?.canonical).toBe('https://example.com/x');
  });
  it('flips to noindex when noindex=true', () => {
    const m = createMetadata({ title: 'X', description: 'Y', path: '/foo', noindex: true });
    expect(m.robots).toEqual({ index: false, follow: true });
  });
  it('promotes a relative ogImage url to absolute', () => {
    const m = createMetadata({
      title: 'X', description: 'Y', path: '/foo',
      ogImage: { url: '/x.png', width: 1200, height: 630, alt: 'x' },
    });
    expect((m.openGraph?.images as Array<{ url: string }>)[0].url).toBe('https://sspwallet.io/x.png');
  });
  it('preserves an absolute ogImage url', () => {
    const m = createMetadata({
      title: 'X', description: 'Y', path: '/foo',
      ogImage: { url: 'https://cdn.example.com/x.png', width: 1200, height: 630, alt: 'x' },
    });
    expect((m.openGraph?.images as Array<{ url: string }>)[0].url).toBe('https://cdn.example.com/x.png');
  });
  it('emits article meta when type=article', () => {
    const m = createMetadata({
      title: 'X', description: 'Y', path: '/n/x', type: 'article',
      articleMeta: { publishedTime: '2025-01-01', modifiedTime: '2025-02-01', author: 'SSP Team', tags: ['multisig'] },
    });
    expect(m.openGraph?.type).toBe('article');
  });
});

describe('siteName', () => {
  it('is "SSP Wallet"', () => {
    expect(siteName).toBe('SSP Wallet');
  });
});

describe('createSoftwareApplicationJsonLd', () => {
  it('returns SoftwareApplication + WebApplication schema', () => {
    const j = createSoftwareApplicationJsonLd();
    expect((j as { '@type': string[] })['@type']).toEqual(['SoftwareApplication', 'WebApplication']);
    expect((j as { name: string }).name).toBe('SSP Wallet');
  });
});

describe('createBlogPostingJsonLd', () => {
  it('builds BlogPosting JSON-LD', () => {
    const j = createBlogPostingJsonLd({
      title: 'X', description: 'Y', url: '/newsroom/x',
      imageUrl: '/img.png', authorName: 'SSP Team',
      publishDate: '2025-01-01',
    });
    expect((j as { '@type': string })['@type']).toBe('BlogPosting');
    expect((j as { headline: string }).headline).toBe('X');
  });
});

describe('createBreadcrumbJsonLd', () => {
  it('builds BreadcrumbList from items', () => {
    const j = createBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Newsroom' }]);
    expect((j as { '@type': string })['@type']).toBe('BreadcrumbList');
  });
});

describe('createCollectionPageJsonLd', () => {
  it('builds CollectionPage from items', () => {
    const j = createCollectionPageJsonLd([{ title: 'A', url: '/a', date: '2025-01-01' }]);
    expect((j as { '@type': string })['@type']).toBe('CollectionPage');
  });
});
```

- [ ] **Step 2: Run** — `npx vitest run src/lib/seo.test.ts` → all fail.

- [ ] **Step 3: Implement `src/lib/seo.ts`**

```ts
import type { Metadata } from 'next';

export const siteUrl = 'https://sspwallet.io';
export const siteName = 'SSP Wallet';
export const siteDescription =
  'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.';
export const twitterHandle = '@sspwallet_io';
export const defaultOgImage = `${siteUrl}/og-image.png`;

interface OgImage { url: string; width: number; height: number; alt: string; }
interface ArticleMeta { publishedTime?: string; modifiedTime?: string; author?: string; tags?: string[]; }
interface CreateMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImage?: OgImage;
  type?: 'website' | 'article';
  articleMeta?: ArticleMeta;
  noindex?: boolean;
  canonical?: string;
}

function absoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function createMetadata(input: CreateMetadataInput): Metadata {
  const canonical = input.canonical ?? absoluteUrl(input.path);
  const og = input.ogImage ?? { url: defaultOgImage, width: 1200, height: 630, alt: siteName };
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      url: canonical,
      siteName,
      title: input.title,
      description: input.description,
      images: [{ url: absoluteUrl(og.url), width: og.width, height: og.height, alt: og.alt }],
      ...(input.type === 'article' && input.articleMeta
        ? {
            publishedTime: input.articleMeta.publishedTime,
            modifiedTime: input.articleMeta.modifiedTime,
            authors: input.articleMeta.author ? [input.articleMeta.author] : undefined,
            tags: input.articleMeta.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: input.title,
      description: input.description,
      images: [absoluteUrl(og.url)],
    },
  };
}

interface BlogPostingInput {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  authorName: string;
  publishDate: string;
  modifiedDate?: string;
}

export function createBlogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.url) },
    headline: input.title,
    description: input.description,
    image: absoluteUrl(input.imageUrl),
    datePublished: input.publishDate,
    dateModified: input.modifiedDate ?? input.publishDate,
    author: { '@type': 'Person', name: input.authorName },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/ssp-logo-black-512x512.png` },
    },
  };
}

export function createBreadcrumbJsonLd(items: Array<{ name: string; url?: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

export function createCollectionPageJsonLd(items: Array<{ title: string; url: string; date: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    hasPart: items.map((item) => ({
      '@type': 'BlogPosting',
      headline: item.title,
      url: absoluteUrl(item.url),
      datePublished: item.date,
    })),
  };
}

export function createSoftwareApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'WebApplication'],
    name: siteName,
    alternateName: 'Secure Simple Powerful Wallet',
    description: siteDescription,
    applicationCategory: ['FinanceApplication', 'SecurityApplication', 'UtilitiesApplication'],
    operatingSystem: ['Chrome Extension', 'Browser Extension', 'iOS', 'Android'],
    url: siteUrl,
    downloadUrl: `${siteUrl}/download`,
    datePublished: '2023-01-01',
    author: { '@type': 'Organization', name: 'InFlux Technologies', url: 'https://runonflux.com' },
    creator: { '@type': 'Organization', name: 'InFlux Technologies', url: 'https://runonflux.com' },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/ssp-logo-black-512x512.png`, width: 512, height: 512 },
      sameAs: [
        'https://twitter.com/sspwallet_io',
        'https://github.com/RunOnFlux/ssp-wallet',
        'https://discord.gg/runonflux',
        'https://medium.com/@ssp_wallet',
        'https://www.youtube.com/@ZelLabs',
        'https://docs.sspwallet.io',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@sspwallet.io',
        url: `${siteUrl}/support`,
        availableLanguage: ['English'],
      },
    },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    featureList: [
      'True 2-of-2 BIP48 Multisignature',
      'Account Abstraction (ERC-4337)',
      'WalletConnect v2 Support',
      '15+ Blockchain Support',
      'Built-in Crypto Swap',
      'Fiat On/Off Ramp',
      'Mobile 2FA Security',
      'Open Source & Audited',
    ],
    screenshots: [`${siteUrl}/screenshot.png`],
    supportedCryptocurrencies: [
      'Bitcoin (BTC)', 'Ethereum (ETH)', 'Litecoin (LTC)', 'Zcash (ZEC)', 'Ravencoin (RVN)',
      'Dogecoin (DOGE)', 'Bitcoin Cash (BCH)', 'Flux (FLUX)', 'Polygon (MATIC)',
      'Binance Smart Chain (BSC)', 'Avalanche (AVAX)', 'Base',
    ],
  };
}
```

- [ ] **Step 4: Run tests** — `npx vitest run src/lib/seo.test.ts` → all 11 passing.

- [ ] **Step 5: Replace the layout placeholder JSON-LD**

In `src/app/[locale]/layout.tsx`:
- Add: `import { createSoftwareApplicationJsonLd } from '@/lib/seo';`
- Replace the placeholder JSON-LD `<Script>` body with `{JSON.stringify(createSoftwareApplicationJsonLd())}`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts src/app/[locale]/layout.tsx
git commit -m "feat(seo): add createMetadata and JSON-LD builders with full SoftwareApplication schema"
```

---

## Phase 6 — Migrate the homepage

### Task 6.1: Port components/home/* to TypeScript

**Files:** read everything in `components/home/`, create matching `.tsx` under `src/components/home/`

For each file in `components/home/` (Hero.js, Features.js, Security.js, EnterpriseBand.js, SupportedChains.js, CTA.js, plus any others):

- [ ] **Step 1: Read JS file**.
- [ ] **Step 2: Translate to TS** at `src/components/home/<kebab-name>.tsx`. File name kebab-case (`Hero.js` → `hero.tsx`). Add `'use client'` if hooks/animations are used. Replace `next/router` with `usePathname`/`useRouter` from `@/i18n/navigation`. Replace `next/link` with `Link` from `@/i18n/navigation`. Type props with interfaces. `cn` from `@/lib/utils`. Hardcoded English copy stays for now.
- [ ] **Step 3: Repeat for every file in components/home/**. When porting `SupportedChains.js`, replace inline chain array with `import { SUPPORTED_CHAINS } from '@/constants/supported-chains'`.
- [ ] **Step 4: Commit** — `feat(home): port homepage components to TypeScript`.

### Task 6.2: Port InteractiveDemo

- [ ] Read every file in `components/InteractiveDemo/`.
- [ ] Create matching `.tsx` under `src/components/interactive-demo/`. Preserve framer-motion variants verbatim.
- [ ] Commit: `feat(home): port InteractiveDemo to TypeScript`.

### Task 6.3: Port components/features/

- [ ] Read every file in `components/features/`.
- [ ] Create matching `.tsx` under `src/components/features/`.
- [ ] Commit: `feat(features): port feature-section components to TypeScript`.

### Task 6.4: Homepage page.tsx

**Files:** replace `src/app/[locale]/page.tsx`

- [ ] **Step 1: Read `pages/index.js`** to capture exact section composition + Head metadata.

- [ ] **Step 2: Write**

```tsx
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/home/cta';
import { EnterpriseBand } from '@/components/home/enterprise-band';
import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { Security } from '@/components/home/security';
import { SupportedChains } from '@/components/home/supported-chains';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'SSP Wallet — Secure, Simple, Powerful Crypto Wallet',
  description: 'True 2-of-2 multisig crypto wallet. Browser extension + mobile required for every transaction. Supports Bitcoin, Ethereum, and 15+ blockchains.',
  path: '/',
});

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Hero />
      <Features />
      <Security />
      <EnterpriseBand />
      <SupportedChains />
      <CTA />
    </>
  );
}
```

If `pages/index.js` had additional sections, add them in order.

- [ ] **Step 3: Verify** — `npm run dev`. Visit `http://localhost:3000/en`. Compare visually to `https://sspwallet.io`:
  - [ ] Hero, Features, Security, EnterpriseBand, SupportedChains, CTA each render identically.
  - [ ] Light/dark theme works on every section.
  - [ ] No console errors.
  - [ ] No layout shifts.

If anything is off, fix in the offending component.

- [ ] **Step 4: Commit** — `feat(home): migrate homepage to app router`.

### Task 6.5: Sibling agent.md for homepage

**Files:** create `src/app/[locale]/agent.md`

- [ ] **Step 1: Write**

```markdown
---
title: SSP Wallet
url: https://sspwallet.io
last_reviewed: 2026-04-27
---

SSP Wallet is the secure, simple, powerful crypto wallet with true 2-of-2 BIP48
multisignature security. Every transaction requires both the browser extension
and the mobile SSP Key app — a single compromised device cannot sign.

## Key facts

- 2-of-2 multisignature on every signed action; not optional, not configurable.
- Account Abstraction (ERC-4337) for EVM chains; native multisig for UTXO chains.
- Supports 15+ blockchains: Bitcoin, Ethereum, Litecoin, Zcash, Ravencoin,
  Dogecoin, Bitcoin Cash, Flux, Polygon, BNB Smart Chain, Avalanche, Base, and more.
- Open source under AGPL-3.0; audited by Halborn.
- Browser extension (Chrome / Firefox / Brave) + iOS + Android.

## What you can do

- Download SSP Wallet → /download
- Read the setup guide → /guide
- See feature comparison → /features
- Contact support → /support
- Read the latest news → /newsroom
- Learn crypto self-custody → /academy
- For enterprise inquiries → /enterprise

## Related pages

- /features
- /enterprise
- /case-studies/flux-foundation
- /newsroom
- /academy
```

- [ ] **Step 2: Commit** — `docs(agent-md): add sibling agent.md for the homepage`.

---

## Phase 7 — Migrate the remaining static pages

Each page follows the same recipe. Where a page uses components in `components/<group>/`, those that haven't been ported yet get ported now.

**Migration recipe (apply to each page below):**

1. Read the old `pages/<route>.js`.
2. Identify components used. Port any unported ones to `src/components/<group>/<kebab>.tsx`.
3. Create `src/app/[locale]/<route>/page.tsx` with `metadata` via `createMetadata`, `setRequestLocale`, and the migrated JSX.
4. Create `src/app/[locale]/<route>/agent.md` (under 2KB; same shape as Phase 6.5).
5. Verify visually against production at `http://localhost:3000/en/<route>`.
6. Commit each page in its own commit: `feat(migration): migrate /<route> to app router`.

### Task 7.1: /features
- [ ] Port any unported components used by `pages/features.js`.
- [ ] Create `src/app/[locale]/features/page.tsx`.
- [ ] Create `src/app/[locale]/features/agent.md`.
- [ ] Verify `/en/features` matches production.
- [ ] Commit.

### Task 7.2: /guide
- [ ] Port components.
- [ ] Create `src/app/[locale]/guide/page.tsx`.
- [ ] Create `src/app/[locale]/guide/agent.md`.
- [ ] Verify at `/en/guide`. Embedded video plays.
- [ ] Commit.

### Task 7.3: /support
- [ ] Port form + FAQ. Convert FAQ to Radix `accordion`:
  ```tsx
  import * as Accordion from '@radix-ui/react-accordion';
  ```
  Preserve every Q&A item from the original.
- [ ] Create `src/app/[locale]/support/page.tsx`.
- [ ] Create `src/app/[locale]/support/agent.md` — emphasise FAQ + ticket form.
- [ ] Verify at `/en/support`. Form will 404 until Phase 8 is done; that's fine.
- [ ] Commit.

### Task 7.4: /contact
- [ ] Port components and form.
- [ ] Create `src/app/[locale]/contact/page.tsx`.
- [ ] Create `src/app/[locale]/contact/agent.md`.
- [ ] Verify visually.
- [ ] Commit.

### Task 7.5: /download
- [ ] Port components (browser extensions, mobile QR codes / store badges).
- [ ] Create `src/app/[locale]/download/page.tsx`.
- [ ] Create `src/app/[locale]/download/agent.md` — list every download URL (Chrome Web Store, Firefox Add-ons, App Store, Play Store).
- [ ] Verify; click each download link.
- [ ] Commit.

### Task 7.6: /enterprise
- [ ] Port components.
- [ ] Create `src/app/[locale]/enterprise/page.tsx`.
- [ ] Create `src/app/[locale]/enterprise/agent.md`.
- [ ] Verify.
- [ ] Commit.

### Task 7.7: /case-studies/flux-foundation
- [ ] Port the case-study components and copy verbatim.
- [ ] Create `src/app/[locale]/case-studies/flux-foundation/page.tsx`.
- [ ] Create `src/app/[locale]/case-studies/flux-foundation/agent.md`.
- [ ] Verify.
- [ ] Commit.

### Task 7.8: /privacy-policy, /terms-of-service, /cookie-policy
For each:
- [ ] Create `src/app/[locale]/<route>/page.tsx` with `metadata` and the JSX content.
- [ ] Create sibling `agent.md` (frontmatter + summary + last-reviewed date).
- [ ] Verify each renders.
- [ ] Commit each separately.

### Task 7.9: /checkout_success and /checkout_failure
Stripe-redirect landing pages.
- [ ] Port both with `noindex: true` in metadata (transactional pages should not be indexed).
- [ ] No agent.md — transactional pages.
- [ ] Verify by loading the URL directly.
- [ ] Commit.

### Task 7.10: not-found

**Files:** read `pages/404.js`, create `src/app/not-found.tsx` (root, not under `[locale]`)

- [ ] **Step 1: Write**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found | SSP Wallet' };

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
        We couldn’t find the page you’re looking for.
      </p>
      <Link href="/en" className="btn btn-primary">Back to home</Link>
    </div>
  );
}
```

If the original 404 had richer content, port verbatim.

- [ ] **Step 2: Verify** — visit `/en/this-route-does-not-exist` → 404 page.

- [ ] **Step 3: Commit** — `feat(migration): migrate 404 page to app-router not-found`.

---

## Phase 8 — API routes

### Task 8.1: Migrate /api/contact

**Files:** read `pages/api/contact.js`, create `src/app/api/contact/route.ts`

- [ ] **Step 1: Read original** to capture method allowed, validation, relay URL, error responses, security headers.

- [ ] **Step 2: Write**

```ts
import { NextRequest, NextResponse } from 'next/server';

const CONTACT_RELAY = process.env.NEXT_PUBLIC_CONTACT_API ?? 'https://relay.ssp.runonflux.io/v1/contact';

interface ContactBody {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  // Add any other fields the original handler accepts.
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  if (!body.email || !body.message) {
    return NextResponse.json({ error: 'Email and message are required' }, { status: 400 });
  }
  try {
    const upstream = await fetch(CONTACT_RELAY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) return NextResponse.json({ error: 'Relay error' }, { status: upstream.status });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Relay unreachable' }, { status: 502 });
  }
}
```

**Re-read the original** carefully and preserve every challenge header, field validation, and rate-limit/CAPTCHA mechanism.

- [ ] **Step 3: Verify**

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","message":"hello"}'
```
Expected: `{"ok":true}` if relay accepts; `{"error":"Relay error"}` if relay rejects test traffic. Either confirms the route handler works.

- [ ] **Step 4: Commit** — `feat(api): migrate /api/contact to app-router route handler`.

### Task 8.2: Migrate /api/support

Same recipe against `pages/api/support.js`.
- [ ] Read original.
- [ ] Create `src/app/api/support/route.ts` (POST handler forwarding to `https://relay.ssp.runonflux.io/v1/ticket`).
- [ ] Verify with curl.
- [ ] Commit: `feat(api): migrate /api/support to app-router route handler`.

---

## Phase 9 — Sitemap + robots route handlers

### Task 9.1: src/app/sitemap.ts

**Files:** create `src/app/sitemap.ts`

- [ ] **Step 1: Read** the existing `next-sitemap.config.js` for priorities and changefreq.

- [ ] **Step 2: Write**

```ts
import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';
import { routing } from '@/i18n/routing';

const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
  { path: '/',                                priority: 1.0, changeFrequency: 'weekly' },
  { path: '/features',                        priority: 0.9, changeFrequency: 'monthly' },
  { path: '/enterprise',                      priority: 0.9, changeFrequency: 'monthly' },
  { path: '/download',                        priority: 0.9, changeFrequency: 'monthly' },
  { path: '/guide',                           priority: 0.8, changeFrequency: 'monthly' },
  { path: '/support',                         priority: 0.7, changeFrequency: 'weekly' },
  { path: '/case-studies/flux-foundation',    priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact',                         priority: 0.6, changeFrequency: 'monthly' },
  { path: '/privacy-policy',                  priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-of-service',                priority: 0.3, changeFrequency: 'yearly' },
  { path: '/cookie-policy',                   priority: 0.2, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const route of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${siteUrl}/${locale}${route.path === '/' ? '' : route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${siteUrl}/${l}${route.path === '/' ? '' : route.path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
```

Phase 16/17/18 extend this file with newsroom slugs, academy `[category]/[slug]`s, series, and authors — each fetched via `cms.ts` with try/catch fallback so a CMS outage doesn't break the sitemap.

- [ ] **Step 3: Verify** — visit `/sitemap.xml` → well-formed XML, every static route × every locale, with hreflang links.

- [ ] **Step 4: Commit** — `feat(seo): replace next-sitemap with app-router sitemap.ts`.

### Task 9.2: src/app/robots.txt route handler

**Files:** create `src/app/robots.txt/route.ts`

- [ ] **Step 1: Write**

```ts
import { NextResponse } from 'next/server';
import { siteUrl } from '@/lib/seo';

const ROBOTS = `
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI crawlers — allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

# Block irrelevant paths
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Allow important files
Allow: /api/sitemap
Allow: /_next/static/
`.trim();

export function GET(): NextResponse {
  return new NextResponse(ROBOTS, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
```

- [ ] **Step 2: Verify** — visit `/robots.txt` → identical content to old `public/robots.txt`.

- [ ] **Step 3: Commit** — `feat(seo): replace public/robots.txt with route handler`.

### Task 9.3: Delete legacy public/robots.txt and next-sitemap.config.js

```bash
rm public/robots.txt
rm -f public/sitemap.xml
rm next-sitemap.config.js
```

- [ ] Verify `grep next-sitemap package.json` returns nothing.
- [ ] Commit:
```bash
git rm public/robots.txt next-sitemap.config.js
[ -f public/sitemap.xml ] && git rm public/sitemap.xml || true
git commit -m "chore(seo): drop legacy robots.txt and next-sitemap config"
```

---

## Phase 10 — Delete the old `pages/` and `components/` trees

This is the cleanup commit. After this, the codebase is fully app-router. Run only after every page in Phase 7 has been verified visually.

### Task 10.1: Final cleanup

**Files:** delete `pages/`, `components/`, `hooks/`, `lib/`

- [ ] **Step 1: Confirm migration**

```bash
ls components hooks lib 2>/dev/null
# Manually verify every old route has a counterpart in src/app/[locale]/
```

- [ ] **Step 2: Delete**

```bash
rm -rf pages components hooks lib
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```

Visit each migrated route. Every route still works. If any 500s, grep for stale imports: `grep -r "from '../components" src/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(migration): delete legacy pages/, components/, hooks/, lib/ trees"
```

---

## ✅ Foundation acceptance gate

Before starting Phase 11, the foundation must pass:

- [ ] `npx tsc --noEmit` clean.
- [ ] `npm run lint` clean.
- [ ] `npm run test` clean.
- [ ] `npm run dev` boots; every migrated route renders without errors.
- [ ] Visual diff: `/en`, `/en/features`, `/en/guide`, `/en/support`, `/en/contact`, `/en/download`, `/en/enterprise`, `/en/case-studies/flux-foundation`, `/en/privacy-policy`, `/en/terms-of-service`, `/en/cookie-policy`, `/en/checkout_success`, `/en/checkout_failure`, `/en/some-404` — pixel-close to production.
- [ ] Light/dark theme toggle works on every page.
- [ ] `/api/contact` and `/api/support` POSTs reach the SSP relay (curl smoke test).
- [ ] `/sitemap.xml` and `/robots.txt` render.
- [ ] Lighthouse SEO + Performance + Accessibility within ±2 points of production for `/en`, `/en/features`, `/en/guide`. Capture numbers in PR description.

If anything fails: stop, fix, re-verify before Phase 11.

---

## Phase 11 — Types + constants for newsroom/academy

### Task 11.1: src/types/newsroom.ts

**Files:** create `src/types/newsroom.ts` and `src/types/newsroom.test.ts`

- [ ] **Step 1: Write the type file**

```ts
import type { AcademyCategory } from '@/constants/academy-categories';

export type ArticleSection = 'newsroom' | 'academy';
export type ArticleDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface NewsroomPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  imageAlt: string;
  imageSquare?: string | null;
  imageSquareAlt?: string | null;
  imageStory?: string | null;
  imageStoryAlt?: string | null;
  date: string;
  modifiedDate?: string | null;
  author: string;
  authorId?: string | null;
  readTime: number;
  tags: string[];
  section: ArticleSection;
  category?: AcademyCategory | null;
  difficulty?: ArticleDifficulty | null;
  seriesSlug?: string | null;
  seriesOrder?: number | null;
  featured?: boolean;
  pinned?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noindex?: boolean;
  relatedSlugs?: string[];
  slugHistory?: string[];
}

export interface Author {
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
}

export interface CategoryWithCount {
  slug: string;
  title: string;
  description: string;
  postCount: number;
}

export interface SeriesSummary {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  category: string;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
  postCount: number;
}

export interface SeriesDetail extends Omit<SeriesSummary, 'postCount'> {
  posts: NewsroomPost[];
}
```

- [ ] **Step 2: Smoke test**

```ts
import { describe, it, expectTypeOf } from 'vitest';
import type { NewsroomPost, Author, ArticleSection } from './newsroom';

describe('NewsroomPost', () => {
  it('compiles', () => {
    expectTypeOf<NewsroomPost['section']>().toEqualTypeOf<ArticleSection>();
    expectTypeOf<Author['slug']>().toEqualTypeOf<string>();
  });
});
```

Run: `npx vitest run src/types/newsroom.test.ts` → passing.

- [ ] **Step 3: Commit** — `feat(types): add NewsroomPost, Author, Series, Category types`.

### Task 11.2: src/constants/academy-categories.ts

**Files:** create `src/constants/academy-categories.ts` and `src/constants/academy-categories.test.ts`

- [ ] **Step 1: Write**

```ts
export const ACADEMY_CATEGORIES = {
  'multisig':         { title: 'Multisig Explained',          description: 'How 2-of-2 multisignature actually works in SSP — and why it matters.' },
  'getting-started':  { title: 'Crypto Basics',               description: 'Foundational concepts every crypto user should know.' },
  'security':         { title: 'Security & Self-Custody',     description: 'Protect your crypto: seeds, phishing, hardware, threat models.' },
  'how-to':           { title: 'How-To Guides',               description: 'Step-by-step walkthroughs for common SSP tasks.' },
  'coin-guides':      { title: 'Coin & Chain Guides',         description: 'Deep dives into individual coins and chains SSP supports.' },
  'defi':             { title: 'DeFi & Account Abstraction',  description: 'Staking, lending, swaps, and ERC-4337 explained.' },
  'news-explained':   { title: 'News & Industry Analysis',    description: 'Context and analysis on crypto news and regulation.' },
} as const;

export type AcademyCategory = keyof typeof ACADEMY_CATEGORIES;

export const ACADEMY_CATEGORY_SLUGS: readonly AcademyCategory[] = Object.freeze(
  Object.keys(ACADEMY_CATEGORIES) as AcademyCategory[],
);

export function isAcademyCategory(value: unknown): value is AcademyCategory {
  return typeof value === 'string' && value in ACADEMY_CATEGORIES;
}
```

- [ ] **Step 2: Tests**

```ts
import { describe, it, expect } from 'vitest';
import { ACADEMY_CATEGORIES, ACADEMY_CATEGORY_SLUGS, isAcademyCategory } from './academy-categories';

describe('ACADEMY_CATEGORIES', () => {
  it('includes all 7 SSP categories', () => {
    expect(Object.keys(ACADEMY_CATEGORIES)).toEqual([
      'multisig','getting-started','security','how-to','coin-guides','defi','news-explained',
    ]);
  });
  it('every entry has title and description', () => {
    for (const [slug, meta] of Object.entries(ACADEMY_CATEGORIES)) {
      expect(meta.title, `${slug}.title`).toBeTruthy();
      expect(meta.description, `${slug}.description`).toBeTruthy();
    }
  });
});

describe('isAcademyCategory', () => {
  it('returns true for known slugs', () => {
    expect(isAcademyCategory('multisig')).toBe(true);
    expect(isAcademyCategory('defi')).toBe(true);
  });
  it('returns false for unknown', () => {
    expect(isAcademyCategory('nope')).toBe(false);
    expect(isAcademyCategory(42)).toBe(false);
    expect(isAcademyCategory(undefined)).toBe(false);
  });
});

describe('ACADEMY_CATEGORY_SLUGS', () => {
  it('matches the keys of ACADEMY_CATEGORIES', () => {
    expect([...ACADEMY_CATEGORY_SLUGS]).toEqual(Object.keys(ACADEMY_CATEGORIES));
  });
});
```

Run → 6 passing.

- [ ] **Step 3: Commit** — `feat(academy): add 7 SSP-flavored academy categories with tests`.

---

## Phase 12 — CMS client + seed-fallback (TDD)

### Task 12.1: Scaffold the /content tree

**Files:** create empty content directories with `.gitkeep`

- [ ] **Step 1: Make the tree**

```bash
mkdir -p content/newsroom content/authors
mkdir -p content/academy/multisig content/academy/getting-started content/academy/security \
         content/academy/how-to content/academy/coin-guides content/academy/defi \
         content/academy/news-explained
touch content/.gitkeep content/newsroom/.gitkeep content/authors/.gitkeep
for d in content/academy/*/; do touch "$d.gitkeep"; done
```

- [ ] **Step 2: Commit**

```bash
git add content/
git commit -m "chore(content): scaffold /content tree for seed-fallback articles"
```

### Task 12.2: Seed-loader (TDD)

**Files:** create `content/newsroom/_test-fixture.md`, `src/lib/cms/seed-loader.ts`, `src/lib/cms/seed-loader.test.ts`

- [ ] **Step 1: Test fixture article**

Create `content/newsroom/_test-fixture.md`:

```markdown
---
title: Test fixture article
description: Used by the cms.ts seed-loader test suite.
slug: test-fixture
date: '2025-01-15'
author: SSP Team
authorId: ssp-team
readTime: 3
tags: [fixture, test]
section: newsroom
image: /images/news/placeholder.jpg
imageAlt: SSP placeholder image
---

## Section heading

Body paragraph with a [link](https://sspwallet.io).
```

The leading `_` marks it test-only — the loader skips files starting with `_` in production. This file is publication-safe (clearly a test fixture, no embargoed info).

- [ ] **Step 2: Failing tests**

```ts
// src/lib/cms/seed-loader.test.ts
import { describe, it, expect } from 'vitest';
import { loadAllSeedPosts, loadSeedPostBySlug, isTestFixture } from './seed-loader';

describe('isTestFixture', () => {
  it('flags files prefixed with underscore', () => {
    expect(isTestFixture('_test-fixture.md')).toBe(true);
    expect(isTestFixture('real-article.md')).toBe(false);
  });
});

describe('loadAllSeedPosts', () => {
  it('returns posts from /content/newsroom and /content/academy/*', async () => {
    const posts = await loadAllSeedPosts({ includeFixtures: true });
    expect(posts.length).toBeGreaterThanOrEqual(1);
    const fixture = posts.find((p) => p.slug === 'test-fixture');
    expect(fixture).toBeDefined();
    expect(fixture?.section).toBe('newsroom');
    expect(fixture?.tags).toContain('fixture');
  });

  it('excludes test fixtures by default', async () => {
    const posts = await loadAllSeedPosts();
    expect(posts.find((p) => p.slug === 'test-fixture')).toBeUndefined();
  });

  it('returns sorted by date descending', async () => {
    const posts = await loadAllSeedPosts({ includeFixtures: true });
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(
        new Date(posts[i].date).getTime(),
      );
    }
  });
});

describe('loadSeedPostBySlug', () => {
  it('returns the matching post', async () => {
    const p = await loadSeedPostBySlug('test-fixture', { includeFixtures: true });
    expect(p?.slug).toBe('test-fixture');
  });
  it('returns undefined for unknown slugs', async () => {
    const p = await loadSeedPostBySlug('definitely-not-a-real-slug');
    expect(p).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run** → all fail.

- [ ] **Step 4: Implement `src/lib/cms/seed-loader.ts`**

```ts
import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { NewsroomPost } from '@/types/newsroom';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');

export function isTestFixture(filename: string): boolean {
  return path.basename(filename).startsWith('_');
}

interface SeedOptions {
  includeFixtures?: boolean;
}

async function readPostsFromDir(
  dir: string,
  section: 'newsroom' | 'academy',
  category?: string,
  opts: SeedOptions = {},
): Promise<NewsroomPost[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const posts: NewsroomPost[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    if (!opts.includeFixtures && isTestFixture(entry)) continue;
    const fullPath = path.join(dir, entry);
    const raw = await fs.readFile(fullPath, 'utf8');
    const { data, content } = matter(raw);
    posts.push({
      slug: (data.slug as string) ?? entry.replace(/^_/, '').replace(/\.md$/, ''),
      title: (data.title as string) ?? '',
      description: (data.description as string) ?? '',
      content,
      image: (data.image as string) ?? '/og-image.png',
      imageAlt: (data.imageAlt as string) ?? '',
      imageSquare: (data.imageSquare as string) ?? null,
      imageSquareAlt: (data.imageSquareAlt as string) ?? null,
      imageStory: (data.imageStory as string) ?? null,
      imageStoryAlt: (data.imageStoryAlt as string) ?? null,
      date: (data.date as string) ?? new Date().toISOString().slice(0, 10),
      modifiedDate: (data.modifiedDate as string | null) ?? null,
      author: (data.author as string) ?? 'SSP Team',
      authorId: (data.authorId as string | null) ?? null,
      readTime: typeof data.readTime === 'number' ? data.readTime : 5,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      section,
      category: category ?? ((data.category as NewsroomPost['category']) ?? null),
      difficulty: (data.difficulty as NewsroomPost['difficulty']) ?? null,
      seriesSlug: (data.seriesSlug as string | null) ?? null,
      seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : null,
      featured: !!data.featured,
      pinned: !!data.pinned,
      seoTitle: (data.seoTitle as string | null) ?? null,
      seoDescription: (data.seoDescription as string | null) ?? null,
      canonicalUrl: (data.canonicalUrl as string | null) ?? null,
      noindex: !!data.noindex,
      relatedSlugs: Array.isArray(data.relatedSlugs) ? (data.relatedSlugs as string[]) : [],
      slugHistory: Array.isArray(data.slugHistory) ? (data.slugHistory as string[]) : [],
    });
  }
  return posts;
}

async function readAcademyPosts(opts: SeedOptions = {}): Promise<NewsroomPost[]> {
  const academyDir = path.join(CONTENT_DIR, 'academy');
  let categories: string[];
  try {
    categories = await fs.readdir(academyDir);
  } catch {
    return [];
  }
  const all: NewsroomPost[] = [];
  for (const cat of categories) {
    const catDir = path.join(academyDir, cat);
    const stat = await fs.stat(catDir).catch(() => null);
    if (!stat?.isDirectory()) continue;
    const posts = await readPostsFromDir(catDir, 'academy', cat, opts);
    all.push(...posts);
  }
  return all;
}

export async function loadAllSeedPosts(opts: SeedOptions = {}): Promise<NewsroomPost[]> {
  const newsroomDir = path.join(CONTENT_DIR, 'newsroom');
  const [newsroom, academy] = await Promise.all([
    readPostsFromDir(newsroomDir, 'newsroom', undefined, opts),
    readAcademyPosts(opts),
  ]);
  const posts = [...newsroom, ...academy];
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return posts;
}

export async function loadSeedPostBySlug(slug: string, opts: SeedOptions = {}): Promise<NewsroomPost | undefined> {
  const all = await loadAllSeedPosts(opts);
  return all.find((p) => p.slug === slug || (p.slugHistory ?? []).includes(slug));
}
```

- [ ] **Step 5: Run tests** → all 6 passing.

- [ ] **Step 6: Commit**

```bash
git add content/newsroom/_test-fixture.md src/lib/cms/seed-loader.ts src/lib/cms/seed-loader.test.ts
git commit -m "feat(cms): seed-loader for /content markdown with TDD coverage"
```

### Task 12.3: HTTP CMS fetcher (TDD)

**Files:** create `src/lib/cms/cms-fetch.ts` and `src/lib/cms/cms-fetch.test.ts`

- [ ] **Step 1: Tests**

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cmsFetch, isCmsConfigured } from './cms-fetch';

const ORIG_ENV = { ...process.env };

beforeEach(() => {
  process.env.SSP_CMS_URL = 'https://cms.example.com';
  process.env.SSP_CMS_API_KEY = 'test-key';
  vi.restoreAllMocks();
});
afterEach(() => { process.env = { ...ORIG_ENV }; });

describe('isCmsConfigured', () => {
  it('true when both env vars set', () => { expect(isCmsConfigured()).toBe(true); });
  it('false when url missing', () => { delete process.env.SSP_CMS_URL; expect(isCmsConfigured()).toBe(false); });
  it('false when key missing', () => { delete process.env.SSP_CMS_API_KEY; expect(isCmsConfigured()).toBe(false); });
});

describe('cmsFetch', () => {
  it('sends x-api-key header', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    await cmsFetch('/api/v1/posts');
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/posts',
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
      }),
    );
  });

  it('returns parsed JSON on 200', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ posts: [{ slug: 'a' }] }), { status: 200 }),
    );
    const r = await cmsFetch<{ posts: Array<{ slug: string }> }>('/api/v1/posts');
    expect(r.posts[0].slug).toBe('a');
  });

  it('throws on non-2xx', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('nope', { status: 500 }));
    await expect(cmsFetch('/api/v1/posts')).rejects.toThrow(/500/);
  });

  it('throws when CMS not configured', async () => {
    delete process.env.SSP_CMS_URL;
    await expect(cmsFetch('/api/v1/posts')).rejects.toThrow(/not configured/i);
  });
});
```

- [ ] **Step 2: Implement `src/lib/cms/cms-fetch.ts`**

```ts
export function isCmsConfigured(): boolean {
  return !!process.env.SSP_CMS_URL && !!process.env.SSP_CMS_API_KEY;
}

export async function cmsFetch<T>(path: string, revalidate = 60): Promise<T> {
  if (!isCmsConfigured()) {
    throw new Error('SSP CMS not configured (SSP_CMS_URL or SSP_CMS_API_KEY missing)');
  }
  const url = `${process.env.SSP_CMS_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.SSP_CMS_API_KEY ?? '' },
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`CMS error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
```

- [ ] **Step 3: Run tests** → all passing.

- [ ] **Step 4: Commit** — `feat(cms): cmsFetch HTTP client with x-api-key auth`.

### Task 12.4: High-level CMS API + seed-fallback wiring

**Files:** create `src/lib/cms.ts`, `src/lib/cms.test.ts`, `src/lib/newsroom.ts` (re-export shim)

- [ ] **Step 1: Tests**

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAllPosts, getPostBySlug, getAcademyPosts, getCategories, getAllTags, extractHeadings } from './cms';

const ORIG_ENV = { ...process.env };

beforeEach(() => { vi.restoreAllMocks(); });
afterEach(() => { process.env = { ...ORIG_ENV }; });

describe('getAllPosts', () => {
  it('returns seed posts when CMS not configured', async () => {
    delete process.env.SSP_CMS_URL;
    delete process.env.SSP_CMS_API_KEY;
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('falls back to seed when CMS errors', async () => {
    process.env.SSP_CMS_URL = 'https://cms.example.com';
    process.env.SSP_CMS_API_KEY = 'k';
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('network'));
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });

  it('uses CMS when configured and reachable', async () => {
    process.env.SSP_CMS_URL = 'https://cms.example.com';
    process.env.SSP_CMS_API_KEY = 'k';
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ posts: [{ slug: 'cms-only', section: 'newsroom', title: 'CMS', description: '', content: '', image: '', imageAlt: '', date: '2025-01-01', author: 'SSP', readTime: 1, tags: [] }] }), { status: 200 }),
    );
    const posts = await getAllPosts();
    expect(posts[0].slug).toBe('cms-only');
  });
});

describe('getPostBySlug', () => {
  it('returns undefined for unknown slug (seed mode)', async () => {
    delete process.env.SSP_CMS_URL;
    expect(await getPostBySlug('not-a-slug')).toBeUndefined();
  });
});

describe('getCategories', () => {
  it('returns 7 SSP categories with counts', async () => {
    delete process.env.SSP_CMS_URL;
    const cats = await getCategories();
    expect(cats.length).toBe(7);
    expect(cats.map((c) => c.slug).sort()).toEqual([
      'coin-guides','defi','getting-started','how-to','multisig','news-explained','security',
    ]);
  });
});

describe('getAllTags', () => {
  it('aggregates unique tags from all posts', async () => {
    delete process.env.SSP_CMS_URL;
    const tags = await getAllTags();
    expect(Array.isArray(tags)).toBe(true);
  });
});

describe('getAcademyPosts', () => {
  it('returns only academy section', async () => {
    delete process.env.SSP_CMS_URL;
    const posts = await getAcademyPosts();
    expect(posts.every((p) => p.section === 'academy')).toBe(true);
  });
});

describe('extractHeadings', () => {
  it('extracts h2 headings', () => {
    const md = `# Title\n\n## First section\nText\n\n## Second section`;
    expect(extractHeadings(md)).toEqual([
      { id: 'first-section', text: 'First section' },
      { id: 'second-section', text: 'Second section' },
    ]);
  });
  it('strips markdown emphasis', () => {
    expect(extractHeadings('## Bold *italic* word')).toEqual([
      { id: 'bold-italic-word', text: 'Bold italic word' },
    ]);
  });
  it('handles special characters in slug', () => {
    expect(extractHeadings('## ERC-4337 & friends!')).toEqual([
      { id: 'erc-4337-friends', text: 'ERC-4337 & friends!' },
    ]);
  });
  it('returns empty for content with no h2', () => {
    expect(extractHeadings('# h1\n### h3')).toEqual([]);
  });
});
```

- [ ] **Step 2: Implement `src/lib/cms.ts`**

```ts
import type { NewsroomPost, CategoryWithCount, SeriesSummary, SeriesDetail, Author } from '@/types/newsroom';
import type { AcademyCategory } from '@/constants/academy-categories';
import { ACADEMY_CATEGORIES } from '@/constants/academy-categories';
import { LRUCache } from 'lru-cache';
import { cmsFetch, isCmsConfigured } from './cms/cms-fetch';
import { loadAllSeedPosts, loadSeedPostBySlug } from './cms/seed-loader';

const cache = new LRUCache<string, unknown>({ max: 256, ttl: 60_000 });

async function withFallback<T>(key: string, primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  if (!isCmsConfigured()) {
    const f = await fallback();
    cache.set(key, f);
    return f;
  }
  try {
    const p = await primary();
    cache.set(key, p);
    return p;
  } catch {
    const f = await fallback();
    cache.set(key, f);
    return f;
  }
}

function unwrapPosts(r: NewsroomPost[] | { posts: NewsroomPost[] }): NewsroomPost[] {
  return Array.isArray(r) ? r : r.posts;
}

// ---- Newsroom ----

export async function getAllPosts(): Promise<NewsroomPost[]> {
  return withFallback(
    'allPosts',
    async () => unwrapPosts(await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>('/api/v1/posts?section=newsroom&limit=100')),
    async () => (await loadAllSeedPosts()).filter((p) => p.section === 'newsroom'),
  );
}

export async function getPostBySlug(slug: string): Promise<NewsroomPost | undefined> {
  return withFallback(
    `post:${slug}`,
    async () => {
      try { return await cmsFetch<NewsroomPost>(`/api/v1/posts/${encodeURIComponent(slug)}`, 300); }
      catch { return undefined; }
    },
    async () => loadSeedPostBySlug(slug),
  );
}

export async function getAllTags(): Promise<string[]> {
  return withFallback(
    'tags',
    async () => (await cmsFetch<{ tag: string; count: number }[]>('/api/v1/tags')).map((t) => t.tag),
    async () => Array.from(new Set((await loadAllSeedPosts()).flatMap((p) => p.tags))).sort(),
  );
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((p) => p.slug);
}

// ---- Academy ----

export interface AcademyFilters {
  category?: AcademyCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  series?: string;
  featured?: boolean;
  limit?: number;
}

export async function getAcademyPosts(filters: AcademyFilters = {}): Promise<NewsroomPost[]> {
  const key = `academy:${JSON.stringify(filters)}`;
  return withFallback(
    key,
    async () => {
      const qs = new URLSearchParams({ section: 'academy' });
      if (filters.category) qs.set('category', filters.category);
      if (filters.difficulty) qs.set('difficulty', filters.difficulty);
      if (filters.series) qs.set('series', filters.series);
      if (filters.featured) qs.set('featured', 'true');
      if (filters.limit) qs.set('limit', String(filters.limit));
      return unwrapPosts(await cmsFetch<NewsroomPost[] | { posts: NewsroomPost[] }>(`/api/v1/posts?${qs}`));
    },
    async () => {
      let posts = (await loadAllSeedPosts()).filter((p) => p.section === 'academy');
      if (filters.category) posts = posts.filter((p) => p.category === filters.category);
      if (filters.difficulty) posts = posts.filter((p) => p.difficulty === filters.difficulty);
      if (filters.series) posts = posts.filter((p) => p.seriesSlug === filters.series);
      if (filters.featured) posts = posts.filter((p) => !!p.featured);
      if (filters.limit) posts = posts.slice(0, filters.limit);
      return posts;
    },
  );
}

export async function getAcademyPostBySlug(slug: string): Promise<NewsroomPost | undefined> {
  return getPostBySlug(slug);
}

export async function getAcademySlugs(): Promise<Array<{ category: string; slug: string }>> {
  const posts = await getAcademyPosts({ limit: 1000 });
  return posts.filter((p) => p.category).map((p) => ({ category: p.category as string, slug: p.slug }));
}

export async function getCategories(): Promise<CategoryWithCount[]> {
  return withFallback(
    'categories',
    async () => cmsFetch<CategoryWithCount[]>('/api/v1/categories'),
    async () => {
      const academyPosts = (await loadAllSeedPosts()).filter((p) => p.section === 'academy');
      return Object.entries(ACADEMY_CATEGORIES).map(([slug, meta]) => ({
        slug,
        title: meta.title,
        description: meta.description,
        postCount: academyPosts.filter((p) => p.category === slug).length,
      }));
    },
  );
}

export async function getAllSeries(): Promise<SeriesSummary[]> {
  return withFallback('series', async () => cmsFetch<SeriesSummary[]>('/api/v1/series'), async () => []);
}

export async function getSeriesBySlug(slug: string): Promise<SeriesDetail | undefined> {
  return withFallback(
    `series:${slug}`,
    async () => {
      try { return await cmsFetch<SeriesDetail>(`/api/v1/series/${encodeURIComponent(slug)}`, 300); }
      catch { return undefined; }
    },
    async () => undefined,
  );
}

export async function getRelatedPosts(post: NewsroomPost, limit = 3): Promise<NewsroomPost[]> {
  if (post.relatedSlugs && post.relatedSlugs.length > 0) {
    const found = await Promise.all(post.relatedSlugs.map((s) => getPostBySlug(s)));
    return found.filter((p): p is NewsroomPost => !!p).slice(0, limit);
  }
  if (post.section === 'academy' && post.category) {
    const siblings = await getAcademyPosts({ category: post.category as AcademyCategory, limit: limit + 1 });
    return siblings.filter((p) => p.slug !== post.slug).slice(0, limit);
  }
  const all = await getAllPosts();
  return all.filter((p) => p.slug !== post.slug).slice(0, limit);
}

export async function getAuthorBySlug(slugOrId: string): Promise<Author | null> {
  return withFallback(
    `author:${slugOrId}`,
    async () => {
      try { return await cmsFetch<Author>(`/api/v1/authors/${encodeURIComponent(slugOrId)}`, 300); }
      catch { return null; }
    },
    async () => {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const file = path.resolve(process.cwd(), 'content/authors', `${slugOrId}.json`);
        const raw = await fs.readFile(file, 'utf8');
        return JSON.parse(raw) as Author;
      } catch { return null; }
    },
  );
}

export async function getPostsByAuthor(authorId: string): Promise<NewsroomPost[]> {
  return (await getAllPosts()).filter((p) => p.authorId === authorId);
}

export function extractHeadings(content: string): { id: string; text: string }[] {
  const headingRegex = /^## (.+)$/gm;
  const headings: { id: string; text: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim().replace(/[*_`~]+/g, '');
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text });
  }
  return headings;
}
```

- [ ] **Step 3: Re-export shim**

```ts
// src/lib/newsroom.ts
// DEPRECATED: import from '@/lib/cms' directly. Kept for one release to avoid wide import churn.
export {
  getAllPosts, getPostBySlug, getAllTags, getAllSlugs, extractHeadings,
} from './cms';
```

- [ ] **Step 4: Run tests** → all passing.

- [ ] **Step 5: Commit** — `feat(cms): high-level CMS client with seed-fallback, LRU cache, full TDD`.

---

## Phase 13 — Academy SEO + glossary linker (TDD)

### Task 13.1: src/lib/seo-academy.ts

**Files:** create `src/lib/seo-academy.ts` and `src/lib/seo-academy.test.ts`

- [ ] **Step 1: Tests**

```ts
import { describe, it, expect } from 'vitest';
import { buildAcademyArticleJsonLd, buildAcademyBreadcrumbJsonLd } from './seo-academy';
import type { NewsroomPost } from '@/types/newsroom';

const samplePost: NewsroomPost = {
  slug: 'what-is-2-of-2-multisig',
  title: 'What is 2-of-2 multisig?',
  description: 'A primer on 2-of-2 multisignature.',
  content: '## Heading\n\nbody',
  image: '/images/multisig.jpg',
  imageAlt: 'Multisig diagram',
  date: '2025-01-01',
  author: 'SSP Team',
  authorId: 'ssp-team',
  readTime: 6,
  tags: ['multisig', 'security'],
  section: 'academy',
  category: 'multisig',
  difficulty: 'beginner',
};

describe('buildAcademyArticleJsonLd', () => {
  it('emits BlogPosting with article-section and learningResourceType', () => {
    const j = buildAcademyArticleJsonLd(samplePost, 'multisig', null) as Record<string, unknown>;
    expect(j['@type']).toBe('BlogPosting');
    expect(j.articleSection).toBe('Multisig Explained');
    expect(j.learningResourceType).toBe('Article');
    expect(j.educationalLevel).toBe('beginner');
    expect(j.keywords).toBe('multisig,security');
  });
});

describe('buildAcademyBreadcrumbJsonLd', () => {
  it('emits BreadcrumbList with positioned items', () => {
    const j = buildAcademyBreadcrumbJsonLd([
      { name: 'Home', url: '/' },
      { name: 'Academy', url: '/academy' },
      { name: 'Multisig' },
    ]) as { itemListElement: Array<{ position: number; name: string }> };
    expect(j.itemListElement[0].position).toBe(1);
    expect(j.itemListElement[2].name).toBe('Multisig');
  });
});
```

- [ ] **Step 2: Implement**

```ts
import type { NewsroomPost, Author } from '@/types/newsroom';
import { ACADEMY_CATEGORIES, type AcademyCategory } from '@/constants/academy-categories';
import { siteName, siteUrl, createBreadcrumbJsonLd } from './seo';

function abs(url: string): string {
  return url.startsWith('http') ? url : `${siteUrl}${url}`;
}

export function buildAcademyArticleJsonLd(
  post: NewsroomPost,
  category: AcademyCategory | string,
  author: Author | null,
): Record<string, unknown> {
  const cat = ACADEMY_CATEGORIES[category as AcademyCategory];
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/academy/${category}/${post.slug}`) },
    headline: post.title,
    description: post.description,
    image: abs(post.image),
    datePublished: post.date,
    dateModified: post.modifiedDate ?? post.date,
    author: author
      ? { '@type': 'Person', name: author.name, ...(author.websiteUrl ? { url: author.websiteUrl } : {}) }
      : { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/ssp-logo-black-512x512.png` },
    },
    articleSection: cat?.title ?? category,
    learningResourceType: 'Article',
    ...(post.difficulty ? { educationalLevel: post.difficulty } : {}),
    keywords: post.tags.join(','),
  };
}

export function buildAcademyBreadcrumbJsonLd(items: Array<{ name: string; url?: string }>): Record<string, unknown> {
  return createBreadcrumbJsonLd(items);
}
```

- [ ] **Step 3: Run tests** → passing. Commit: `feat(seo): academy JSON-LD builders with TDD`.

### Task 13.2: src/lib/academy-terms.ts (glossary)

**Files:** create `src/lib/academy-terms.ts`

- [ ] **Step 1: Write**

```ts
export interface GlossaryTerm {
  term: string;
  definition: string;
  href: string;
}

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  { term: 'multisig', definition: 'A wallet that requires multiple signatures to authorize a transaction.', href: '/academy/multisig/what-is-2-of-2-multisig' },
  { term: '2-of-2 multisig', definition: "Both signers must approve every transaction. SSP's default model.", href: '/academy/multisig/what-is-2-of-2-multisig' },
  { term: 'BIP48', definition: 'Bitcoin Improvement Proposal defining derivation paths for multisig HD wallets.', href: '/academy/multisig/what-is-2-of-2-multisig#bip48' },
  { term: 'ERC-4337', definition: 'Ethereum Account Abstraction standard. Lets smart contracts act as wallets.', href: '/academy/defi/what-is-account-abstraction-erc-4337' },
  { term: 'account abstraction', definition: 'Treating wallets as smart contracts so they can enforce custom rules.', href: '/academy/defi/what-is-account-abstraction-erc-4337' },
  { term: 'seed phrase', definition: '12 or 24 words that deterministically generate every key in a wallet.', href: '/academy/security/seed-phrase-best-practices' },
  { term: 'hardware wallet', definition: 'A dedicated device that stores keys offline and signs transactions in isolation.', href: '/academy/security/seed-phrase-best-practices#hardware-wallet' },
  { term: 'hot wallet', definition: 'A wallet whose keys are stored on an internet-connected device.', href: '/academy/security/seed-phrase-best-practices#hot-wallet' },
  { term: 'cold wallet', definition: 'A wallet whose keys never touch an internet-connected device.', href: '/academy/security/seed-phrase-best-practices#cold-wallet' },
  { term: 'self-custody', definition: 'Holding your own keys instead of trusting a third party with custody.', href: '/academy/security/why-self-custody-matters-now' },
  { term: 'gas', definition: 'The fee paid to validators to include a transaction in a block.', href: '/academy/getting-started/setting-up-your-first-ssp-wallet#gas' },
  { term: 'mempool', definition: 'The pool of unconfirmed transactions waiting to be included in a block.', href: '/academy/getting-started/setting-up-your-first-ssp-wallet#mempool' },
  { term: 'finality', definition: 'The point at which a transaction is irreversibly confirmed.', href: '/academy/getting-started/setting-up-your-first-ssp-wallet#finality' },
  { term: 'signer', definition: 'A device or party authorized to produce a signature for a multisig wallet.', href: '/academy/multisig/what-is-2-of-2-multisig#signer' },
  { term: 'threshold', definition: 'In M-of-N multisig, the number of signatures (M) required to authorize.', href: '/academy/multisig/what-is-2-of-2-multisig#threshold' },
  { term: 'BIP39', definition: 'The Bitcoin proposal defining the mnemonic seed phrase standard.', href: '/academy/security/seed-phrase-best-practices#bip39' },
  { term: 'BIP32', definition: 'Defines hierarchical-deterministic wallets — many keys from one seed.', href: '/academy/security/seed-phrase-best-practices#bip32' },
  { term: 'WalletConnect', definition: 'Open protocol that lets dApps connect to wallets via QR code or deep link.', href: '/academy/how-to/sending-bitcoin-with-ssp#walletconnect' },
  { term: 'private key', definition: 'The secret number that controls a crypto address.', href: '/academy/security/seed-phrase-best-practices#private-key' },
  { term: 'public key', definition: 'Derived from a private key and used to verify signatures.', href: '/academy/security/seed-phrase-best-practices#public-key' },
];

export function getTermMap(): Map<string, GlossaryTerm> {
  const map = new Map<string, GlossaryTerm>();
  for (const t of GLOSSARY_TERMS) map.set(t.term.toLowerCase(), t);
  return map;
}
```

- [ ] **Step 2: Commit** — `feat(academy): seed glossary terms (20 SSP-relevant)`.

### Task 13.3: src/lib/glossary-linker.ts (TDD)

**Files:** create `src/lib/glossary-linker.ts` and `src/lib/glossary-linker.test.ts`

- [ ] **Step 1: Tests**

```ts
import { describe, it, expect } from 'vitest';
import { autoLinkContent } from './glossary-linker';
import type { GlossaryTerm } from './academy-terms';

const TERMS: GlossaryTerm[] = [
  { term: 'multisig', definition: '', href: '/academy/multisig/x' },
  { term: 'mempool', definition: '', href: '/academy/getting-started/y#mempool' },
];
const map = new Map(TERMS.map((t) => [t.term.toLowerCase(), t]));

describe('autoLinkContent', () => {
  it('links the first occurrence of each term', () => {
    const out = autoLinkContent('Bitcoin uses a mempool. The mempool fills up.', 'some-other-slug', map);
    expect(out).toContain('[mempool](/academy/getting-started/y#mempool)');
    expect(out.match(/\[mempool\]/g)?.length).toBe(1);
  });

  it("skips self-references on the term's own article", () => {
    const out = autoLinkContent('A multisig wallet…', 'x', new Map([['multisig', { term: 'multisig', definition: '', href: '/academy/multisig/x' }]]));
    expect(out).not.toContain('[multisig]');
  });

  it('does not link inside fenced code blocks', () => {
    const md = '```\nmultisig\n```\n\nThe multisig.';
    const out = autoLinkContent(md, 'other', map);
    expect(out).toContain('```\nmultisig\n```');
    expect(out).toContain('[multisig](/academy/multisig/x)');
  });

  it('does not link inside inline code', () => {
    const md = '`multisig` is great. Use multisig.';
    const out = autoLinkContent(md, 'other', map);
    expect(out).toContain('`multisig`');
    expect(out).toContain('[multisig](/academy/multisig/x)');
  });

  it('does not link inside existing markdown links', () => {
    const md = '[multisig](https://elsewhere.com) is fine.';
    const out = autoLinkContent(md, 'other', map);
    expect(out).toContain('[multisig](https://elsewhere.com)');
    expect(out.match(/\[multisig\]/g)?.length).toBe(1);
  });

  it('matches case-insensitively', () => {
    const out = autoLinkContent('Multisig is great.', 'other', map);
    expect(out).toContain('[Multisig](/academy/multisig/x)');
  });
});
```

- [ ] **Step 2: Implement**

```ts
import type { GlossaryTerm } from './academy-terms';

export function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>,
): string {
  const placeholders: string[] = [];
  let masked = content.replace(/```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)/g, (m) => {
    placeholders.push(m);
    return ` PH${placeholders.length - 1} `;
  });

  const used = new Set<string>();
  for (const [key, term] of termMap.entries()) {
    if (used.has(key)) continue;
    if (term.href.endsWith(`/${selfSlug}`) || term.href.includes(`/${selfSlug}#`)) continue;
    const pattern = new RegExp(`\\b(${key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})\\b`, 'i');
    if (!pattern.test(masked)) continue;
    masked = masked.replace(pattern, (matchText) => `[${matchText}](${term.href})`);
    used.add(key);
  }

  return masked.replace(/ PH(\d+) /g, (_, i) => placeholders[Number(i)]);
}
```

- [ ] **Step 3: Run tests** → all 6 passing.

- [ ] **Step 4: Commit** — `feat(academy): glossary auto-linker with code-block and self-ref skip`.

---

## Phase 14 — Agent.md resolver + middleware integration (TDD)

### Task 14.1: src/lib/agent-md/resolve.ts (TDD)

**Files:** create `src/lib/agent-md/resolve.ts` and `src/lib/agent-md/resolve.test.ts`

- [ ] **Step 1: Tests**

```ts
import { describe, it, expect } from 'vitest';
import { resolveAgentMdPath, isDynamicArticleRoute } from './resolve';

describe('resolveAgentMdPath', () => {
  it('maps /en/features to its sibling agent.md', () => {
    expect(resolveAgentMdPath('/en/features')).toBe('src/app/[locale]/features/agent.md');
  });
  it('maps locale root /en to home agent.md', () => {
    expect(resolveAgentMdPath('/en')).toBe('src/app/[locale]/agent.md');
  });
  it('treats /es/guide as the same English agent.md (en-only for v1)', () => {
    expect(resolveAgentMdPath('/es/guide')).toBe('src/app/[locale]/guide/agent.md');
  });
  it('returns null for routes without static agent.md', () => {
    expect(resolveAgentMdPath('/api/contact')).toBeNull();
  });
});

describe('isDynamicArticleRoute', () => {
  it('detects newsroom article route', () => {
    expect(isDynamicArticleRoute('/en/newsroom/some-slug')).toEqual({ kind: 'newsroom', slug: 'some-slug' });
  });
  it('detects academy article route', () => {
    expect(isDynamicArticleRoute('/en/academy/security/some-slug')).toEqual({ kind: 'academy', category: 'security', slug: 'some-slug' });
  });
  it('detects series route', () => {
    expect(isDynamicArticleRoute('/en/academy/series/some-slug')).toEqual({ kind: 'series', slug: 'some-slug' });
  });
  it('detects author route', () => {
    expect(isDynamicArticleRoute('/en/author/ssp-team')).toEqual({ kind: 'author', slug: 'ssp-team' });
  });
  it('returns null for static routes', () => {
    expect(isDynamicArticleRoute('/en/features')).toBeNull();
  });
});
```

- [ ] **Step 2: Implement**

```ts
const STATIC_ROUTES: Record<string, string> = {
  '': 'src/app/[locale]/agent.md',
  'features': 'src/app/[locale]/features/agent.md',
  'guide': 'src/app/[locale]/guide/agent.md',
  'support': 'src/app/[locale]/support/agent.md',
  'contact': 'src/app/[locale]/contact/agent.md',
  'download': 'src/app/[locale]/download/agent.md',
  'enterprise': 'src/app/[locale]/enterprise/agent.md',
  'case-studies/flux-foundation': 'src/app/[locale]/case-studies/flux-foundation/agent.md',
  'privacy-policy': 'src/app/[locale]/privacy-policy/agent.md',
  'terms-of-service': 'src/app/[locale]/terms-of-service/agent.md',
  'cookie-policy': 'src/app/[locale]/cookie-policy/agent.md',
  'newsroom': 'src/app/[locale]/newsroom/agent.md',
  'academy': 'src/app/[locale]/academy/agent.md',
};

function stripLocale(pathname: string): string {
  const m = pathname.match(/^\/(?:en|es|zh)(\/.*)?$/);
  if (!m) return '';
  return (m[1] ?? '').replace(/^\//, '').replace(/\/$/, '');
}

export function resolveAgentMdPath(pathname: string): string | null {
  const route = stripLocale(pathname);
  return STATIC_ROUTES[route] ?? null;
}

export type DynamicMatch =
  | { kind: 'newsroom'; slug: string }
  | { kind: 'academy'; category: string; slug: string }
  | { kind: 'series'; slug: string }
  | { kind: 'author'; slug: string };

export function isDynamicArticleRoute(pathname: string): DynamicMatch | null {
  const route = stripLocale(pathname);
  let m: RegExpMatchArray | null;
  if ((m = route.match(/^newsroom\/([^/]+)$/))) return { kind: 'newsroom', slug: m[1] };
  if ((m = route.match(/^academy\/series\/([^/]+)$/))) return { kind: 'series', slug: m[1] };
  if ((m = route.match(/^academy\/([^/]+)\/([^/]+)$/))) return { kind: 'academy', category: m[1], slug: m[2] };
  if ((m = route.match(/^author\/([^/]+)$/))) return { kind: 'author', slug: m[1] };
  return null;
}
```

- [ ] **Step 3: Run tests** → 9 passing. Commit: `feat(agent-md): URL-to-file resolver with TDD`.

### Task 14.2: src/lib/agent-md/render.ts

**Files:** create `src/lib/agent-md/render.ts`

- [ ] **Step 1: Implement**

```ts
import type { NewsroomPost, Author } from '@/types/newsroom';
import { siteUrl } from '@/lib/seo';

export function renderArticleAsAgentMd(post: NewsroomPost): string {
  const path = post.section === 'academy' && post.category
    ? `/academy/${post.category}/${post.slug}`
    : `/newsroom/${post.slug}`;
  return `---
title: ${JSON.stringify(post.title)}
url: ${siteUrl}${path}
last_reviewed: ${post.modifiedDate ?? post.date}
section: ${post.section}
${post.category ? `category: ${post.category}\n` : ''}author: ${JSON.stringify(post.author)}
tags: ${JSON.stringify(post.tags)}
---

${post.description}

${post.content}

## Related

${(post.relatedSlugs ?? []).map((s) => `- /${post.section}/${s}`).join('\n') || '_(none)_'}
`;
}

export function renderAuthorAsAgentMd(author: Author): string {
  return `---
title: ${JSON.stringify(author.name)}
url: ${siteUrl}/author/${author.slug}
last_reviewed: ${new Date().toISOString().slice(0, 10)}
---

${author.bio ?? ''}

## Links

${[
  author.websiteUrl ? `- Website: ${author.websiteUrl}` : null,
  author.twitterUrl ? `- Twitter: ${author.twitterUrl}` : null,
  author.githubUrl ? `- GitHub: ${author.githubUrl}` : null,
  author.linkedinUrl ? `- LinkedIn: ${author.linkedinUrl}` : null,
].filter(Boolean).join('\n')}
`;
}
```

- [ ] **Step 2: Commit** — `feat(agent-md): renderer for dynamic article and author routes`.

### Task 14.3: Wire markdown serving into middleware

**Files:** modify `src/middleware.ts`

- [ ] **Step 1: Replace**

```ts
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import { resolveAgentMdPath, isDynamicArticleRoute } from '@/lib/agent-md/resolve';
import { getPostBySlug, getAuthorBySlug } from '@/lib/cms';
import { renderArticleAsAgentMd, renderAuthorAsAgentMd } from '@/lib/agent-md/render';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const accept = req.headers.get('accept') ?? '';
  const flag = process.env.AGENT_MD ?? '1';

  if (flag !== '0' && accept.includes('text/markdown')) {
    const pathname = req.nextUrl.pathname;
    const file = resolveAgentMdPath(pathname);
    if (file) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');
        const md = await fs.readFile(path.resolve(process.cwd(), file), 'utf8');
        return mdResponse(md, req);
      } catch { /* fall through */ }
    }
    const dyn = isDynamicArticleRoute(pathname);
    if (dyn) {
      try {
        if (dyn.kind === 'newsroom' || dyn.kind === 'academy') {
          const post = await getPostBySlug(dyn.slug);
          if (post) return mdResponse(renderArticleAsAgentMd(post), req);
        }
        if (dyn.kind === 'author') {
          const a = await getAuthorBySlug(dyn.slug);
          if (a) return mdResponse(renderAuthorAsAgentMd(a), req);
        }
      } catch { /* fall through */ }
    }
  }

  const response = intlMiddleware(req);
  response.headers.set('Vary', 'Accept');
  response.headers.set(
    'Link',
    `<${req.nextUrl.origin}${req.nextUrl.pathname}>; rel="canonical"; type="text/html"`,
  );
  return response;
}

function mdResponse(md: string, req: NextRequest): NextResponse {
  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      Link: `<${req.nextUrl.origin}${req.nextUrl.pathname}>; rel="canonical"`,
      Vary: 'Accept',
    },
  });
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

- [ ] **Step 2: Verify (after Phase 6/7 done)**

```bash
curl -H "Accept: text/markdown" http://localhost:3000/en/features
```
Expected: contents of `src/app/[locale]/features/agent.md`.

- [ ] **Step 3: Commit** — `feat(agent-md): serve sibling agent.md on Accept: text/markdown`.

---

## Phase 15 — Newsroom + shared components

### Task 15.1: components/header/page-header.tsx

**Files:** create `src/components/header/page-header.tsx`

- [ ] **Step 1: Write (SSP-tokenized, light + dark)**

```tsx
import type { ReactNode } from 'react';

interface PageHeaderProps { title: string; subTitle?: string; description: string; children?: ReactNode; }

export function PageHeader({ title, subTitle, description, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden rounded-b-[40px] bg-gradient-to-b from-white to-gray-50 pb-12 dark:from-dark-900 dark:to-dark-950 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24">
      <div className="container relative z-10 mx-auto px-4 pt-12 text-center md:px-6 md:pt-16 lg:px-8 lg:pt-24">
        <div className="mx-auto max-w-[800px] space-y-4 md:space-y-5 lg:space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl md:leading-tight lg:text-7xl lg:leading-[90px]">
            {title}
            {subTitle ? <><br className="hidden md:block" /><span className="md:hidden"> </span>{subTitle}</> : null}
          </h1>
          <p className="mx-auto text-base font-medium leading-relaxed text-gray-600 dark:text-gray-200 md:text-lg md:leading-loose lg:text-xl lg:leading-[33px]">
            {description}
          </p>
          {children ? <div className="mt-6 md:mt-8 lg:mt-10">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit** — `feat(newsroom): page-header component (SSP-tokenized)`.

### Task 15.2: components/newsroom/newsroom-card.tsx

**Files:** create `src/components/newsroom/newsroom-card.tsx`

- [ ] **Step 1: Write**

```tsx
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Clock } from 'lucide-react';
import type { NewsroomPost } from '@/types/newsroom';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface NewsroomCardProps { post: NewsroomPost; href?: string; }

export function NewsroomCard({ post, href }: NewsroomCardProps) {
  const link = href ?? (post.section === 'academy' && post.category
    ? `/academy/${post.category}/${post.slug}`
    : `/newsroom/${post.slug}`);
  const cardImage = post.imageSquare || post.image;
  const cardImageAlt = post.imageSquare ? (post.imageSquareAlt || post.imageAlt) : post.imageAlt;
  return (
    <Link href={link} className="group block">
      <article className="overflow-hidden rounded-card border border-gray-200 bg-white transition-transform duration-200 group-hover:scale-[1.02] dark:border-dark-700 dark:bg-dark-800">
        <div className="relative h-[250px] overflow-hidden md:h-[350px]">
          <Image src={cardImage} alt={cardImageAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 dark:to-dark-800/80" />
        </div>
        <div className="px-6 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8">
          <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-900 dark:text-white md:mb-4 md:text-[40px] md:leading-[50px]">{post.title}</h3>
          <p className="mb-4 line-clamp-2 text-base font-medium leading-relaxed text-gray-600 dark:text-gray-300 md:mb-6 md:text-2xl md:leading-[39.6px]">{post.description}</p>
          <div className="flex items-center justify-between">
            <time dateTime={post.date} className="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-base">
              {formatDate(post.date)}
            </time>
            <div className="flex items-center gap-2 rounded-pill bg-primary-500/15 px-4 py-2">
              <Clock className="h-4 w-4 text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-bold text-primary-700 dark:text-primary-300 md:text-base">{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
```

- [ ] **Step 2: Commit** — `feat(newsroom): newsroom-card component`.

### Task 15.3: components/newsroom/newsroom-listing.tsx

**Files:** create `src/components/newsroom/newsroom-listing.tsx`

- [ ] **Step 1: Write**

```tsx
'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { NewsroomPost } from '@/types/newsroom';
import { NewsroomCard } from '@/components/newsroom/newsroom-card';

const POSTS_PER_PAGE = 6;

export function NewsroomListing({ posts, tags }: { posts: NewsroomPost[]; tags: string[] }) {
  const t = useTranslations('Newsroom');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filteredPosts = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [posts, activeTag],
  );
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  function handleTagClick(tag: string | null) {
    setActiveTag(tag);
    setVisibleCount(POSTS_PER_PAGE);
  }

  return (
    <div>
      <div className="container-custom py-8 md:py-12">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleTagClick(null)}
            className={`rounded-pill px-5 py-2.5 text-sm font-bold md:text-base ${
              activeTag === null
                ? 'bg-primary-500 text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:border-primary-400 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-300'
            }`}
          >
            {t('filterAll')}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`rounded-pill px-5 py-2.5 text-sm font-bold capitalize md:text-base ${
                activeTag === tag
                  ? 'bg-primary-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:border-primary-400 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="container-custom pb-16 md:pb-24">
        {filteredPosts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {visiblePosts.map((p) => <NewsroomCard key={p.slug} post={p} />)}
            </div>
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisibleCount((v) => v + POSTS_PER_PAGE)}
                  className="btn btn-primary"
                >
                  {t('loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">{t('noArticles')}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit** — `feat(newsroom): newsroom-listing client component with tag filter`.

### Task 15.4: components/shared/breadcrumbs.tsx

**Files:** create `src/components/shared/breadcrumbs.tsx`

- [ ] **Step 1: Write**

```tsx
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem { label: string; href?: string; }

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-4 w-4 opacity-60" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-primary-600 dark:hover:text-primary-400">{item.label}</Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Commit** — `feat(shared): breadcrumbs component`.

### Task 15.5: components/shared/author-byline.tsx

**Files:** create `src/components/shared/author-byline.tsx`

- [ ] **Step 1: Write**

```tsx
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Twitter, Github, Linkedin, Globe } from 'lucide-react';
import type { Author } from '@/types/newsroom';

export function AuthorByline({ author }: { author: Author }) {
  return (
    <div className="mt-4 flex items-start gap-4 rounded-card border border-gray-200 bg-white p-4 dark:border-dark-700 dark:bg-dark-800">
      {author.avatar && (
        <Image src={author.avatar} alt={author.name} width={48} height={48} className="rounded-full" />
      )}
      <div className="flex-1">
        <Link href={`/author/${author.slug}`} className="font-semibold text-gray-900 hover:text-primary-600 dark:text-white dark:hover:text-primary-400">
          {author.name}
        </Link>
        {author.title && <p className="text-sm text-gray-500 dark:text-gray-400">{author.title}</p>}
      </div>
      <div className="flex items-center gap-3">
        {author.twitterUrl && <a href={author.twitterUrl} target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>}
        {author.githubUrl && <a href={author.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /></a>}
        {author.linkedinUrl && <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>}
        {author.websiteUrl && <a href={author.websiteUrl} target="_blank" rel="noopener noreferrer"><Globe className="h-4 w-4" /></a>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit** — `feat(shared): author-byline component`.

### Task 15.6: components/shared/at-a-glance.tsx

**Files:** create `src/components/shared/at-a-glance.tsx`

- [ ] **Step 1: Write**

```tsx
import { useTranslations } from 'next-intl';
import { Clock, BookOpen, Layers } from 'lucide-react';
import type { NewsroomPost } from '@/types/newsroom';

export function AtAGlance({ post }: { post: NewsroomPost }) {
  const t = useTranslations('Academy');
  return (
    <div className="flex flex-wrap gap-3 border-y border-gray-200 py-4 dark:border-dark-700">
      <span className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-3 py-1 text-sm dark:bg-dark-800">
        <Clock className="h-4 w-4" />
        {post.readTime} min read
      </span>
      {post.difficulty && (
        <span className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-3 py-1 text-sm dark:bg-dark-800">
          <BookOpen className="h-4 w-4" />
          {t(`difficulty.${post.difficulty}` as 'difficulty.beginner')}
        </span>
      )}
      {post.seriesSlug && post.seriesOrder && (
        <span className="inline-flex items-center gap-2 rounded-pill bg-gray-100 px-3 py-1 text-sm dark:bg-dark-800">
          <Layers className="h-4 w-4" />
          Part {post.seriesOrder}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit** — `feat(shared): at-a-glance pill row`.

### Task 15.7: components/shared/post-article.tsx

**Files:** create `src/components/shared/post-article.tsx`

This is the big one. It renders the full article: hero band, breadcrumb, title, meta, ToC, markdown body, share row, related posts.

- [ ] **Step 1: Write**

```tsx
'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { NewsroomPost } from '@/types/newsroom';
import { extractHeadings } from '@/lib/cms';
import { NewsroomCard } from '@/components/newsroom/newsroom-card';
import { Twitter, Facebook, Send, MessageSquare, Copy, Check } from 'lucide-react';

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

interface PostArticleProps {
  post: NewsroomPost;
  relatedPosts: NewsroomPost[];
  backHref?: string;
  backLabel?: string;
  breadcrumb?: ReactNode;
  content?: string;
}

export function PostArticle({ post, relatedPosts, backHref = '/newsroom', backLabel, breadcrumb, content }: PostArticleProps) {
  const t = useTranslations('Newsroom');
  const [linkCopied, setLinkCopied] = useState(false);

  const headings = extractHeadings(content ?? post.content);
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);

  function shareOn(platform: 'twitter' | 'facebook' | 'telegram' | 'reddit') {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  }

  function copyLink() {
    navigator.clipboard.writeText(articleUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-b-[40px] bg-gradient-to-b from-white to-gray-50 pb-12 dark:from-dark-900 dark:to-dark-950 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24">
        <div className="container-custom relative z-10 pt-24 md:pt-32 lg:pt-40">
          {breadcrumb ?? (
            <Link href={backHref} className="text-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              &lt; {backLabel ?? t('backToNewsroom')}
            </Link>
          )}
          <h1 className="mt-6 max-w-[900px] text-4xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-[60px] lg:leading-[1.2]">
            {post.title}
          </h1>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 md:text-base">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{t('minRead', { minutes: post.readTime })}</span>
              <span>·</span>
              <span>{t('byAuthor', { author: post.author })}</span>
            </div>
          </div>
        </div>
      </section>

      <article className="container-custom my-12 grid grid-cols-1 gap-12 md:my-16 lg:my-24 lg:grid-cols-[200px_1fr]">
        {headings.length > 0 && (
          <aside className="sticky top-24 hidden h-fit lg:block">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {t('tableOfContents')}
            </h2>
            <ul className="space-y-2 text-sm">
              {headings.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">{h.text}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <Image src={post.image} alt={post.imageAlt} width={1200} height={630} className="mb-8 rounded-card" />
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children);
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                return <h2 id={id}>{children}</h2>;
              },
              a: ({ href, children, ...props }) => {
                if (href?.startsWith('http')) return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
                return <Link href={href ?? '#'} {...props}>{children}</Link>;
              },
              img: ({ src, alt }) => (
                src ? <Image src={src} alt={alt ?? ''} width={1200} height={630} className="rounded-card" /> : null
              ),
            }}
          >
            {content ?? post.content}
          </ReactMarkdown>
        </div>
      </article>

      <section className="container-custom my-12">
        <h2 className="mb-4 text-lg font-semibold">{t('shareTitle')}</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => shareOn('twitter')} className="btn btn-secondary"><Twitter className="mr-2 h-4 w-4" />{t('shareTwitter')}</button>
          <button onClick={() => shareOn('facebook')} className="btn btn-secondary"><Facebook className="mr-2 h-4 w-4" />{t('shareFacebook')}</button>
          <button onClick={() => shareOn('telegram')} className="btn btn-secondary"><Send className="mr-2 h-4 w-4" />{t('shareTelegram')}</button>
          <button onClick={() => shareOn('reddit')} className="btn btn-secondary"><MessageSquare className="mr-2 h-4 w-4" />{t('shareReddit')}</button>
          <button onClick={copyLink} className="btn btn-secondary">
            {linkCopied ? <><Check className="mr-2 h-4 w-4" />{t('shareCopied')}</> : <><Copy className="mr-2 h-4 w-4" />{t('shareCopy')}</>}
          </button>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className="container-custom mb-16 md:mb-24">
          <h2 className="mb-6 text-2xl font-bold">{t('relatedArticles')}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {relatedPosts.map((p) => <NewsroomCard key={p.slug} post={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit** — `feat(shared): post-article component with markdown, ToC, share, related`.

### Task 15.8: Verify components render

- [ ] **Step 1: Run dev server** with the seed test fixture article visible.
- [ ] **Step 2:** Manually visit a temporary URL once Phase 16 lands. (Phase 15 has no routes yet — components are wired by Phase 16 routes.)

---

## Phase 16 — Newsroom routes

### Task 16.1: /newsroom listing route

**Files:** create `src/app/[locale]/newsroom/page.tsx`, `src/app/[locale]/newsroom/agent.md`

- [ ] **Step 1: Write `page.tsx`**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { setRequestLocale } from 'next-intl/server';
import { createMetadata, createCollectionPageJsonLd, createBreadcrumbJsonLd } from '@/lib/seo';
import { getAllPosts, getAllTags } from '@/lib/cms';
import { NewsroomListing } from '@/components/newsroom/newsroom-listing';
import { PageHeader } from '@/components/header/page-header';

export const metadata: Metadata = createMetadata({
  title: 'Newsroom — Latest News & Updates',
  description: 'Stay up to date with the latest news, product updates, and announcements from SSP.',
  path: '/newsroom',
});

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Newsroom', url: '/newsroom' },
]);

export default async function NewsroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);
  const collectionJsonLd = createCollectionPageJsonLd(
    posts.map((p) => ({ title: p.title, url: `/newsroom/${p.slug}`, date: p.date })),
  );
  return (
    <>
      <Script id="breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
      <Script id="collection-page-jsonld" type="application/ld+json">{JSON.stringify(collectionJsonLd)}</Script>
      <PageHeader
        title="Newsroom"
        description="Stay up to date with the latest news, product updates, and announcements from SSP."
      />
      <NewsroomListing posts={posts} tags={tags} />
    </>
  );
}
```

- [ ] **Step 2: Write `agent.md`** (under 2KB, frontmatter + key facts + related).

- [ ] **Step 3: Verify** — visit `/en/newsroom`. Empty state if no seed articles, otherwise listing.

- [ ] **Step 4: Commit** — `feat(newsroom): /newsroom listing page`.

### Task 16.2: /newsroom/[slug] article route

**Files:** create `src/app/[locale]/newsroom/[slug]/page.tsx`

- [ ] **Step 1: Write**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound, permanentRedirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createMetadata, createBlogPostingJsonLd, createBreadcrumbJsonLd, siteUrl } from '@/lib/seo';
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms';
import { PostArticle } from '@/components/shared/post-article';

interface PageProps { params: Promise<{ locale: string; slug: string }>; }

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/newsroom/${post.slug}`,
    ogImage: { url: post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`, width: 1200, height: 630, alt: post.imageAlt },
    type: 'article',
    articleMeta: {
      publishedTime: post.date,
      modifiedTime: post.modifiedDate ?? undefined,
      author: post.author,
      tags: post.tags,
    },
  });
}

export default async function NewsroomArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  if (post.section === 'academy' && post.category) {
    permanentRedirect(`/academy/${post.category}/${post.slug}`);
  }
  if (post.slug !== slug) {
    permanentRedirect(`/newsroom/${post.slug}`);
  }

  const relatedPosts = await getRelatedPosts(post);

  const blogPostingJsonLd = createBlogPostingJsonLd({
    title: post.title,
    description: post.description,
    url: `/newsroom/${post.slug}`,
    imageUrl: post.image,
    authorName: post.author,
    publishDate: post.date,
    modifiedDate: post.modifiedDate ?? undefined,
  });
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Newsroom', url: '/newsroom' },
    { name: post.title, url: `/newsroom/${post.slug}` },
  ]);

  return (
    <>
      <Script id="blog-posting-jsonld" type="application/ld+json">{JSON.stringify(blogPostingJsonLd)}</Script>
      <Script id="breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
      <PostArticle post={post} relatedPosts={relatedPosts} backHref="/newsroom" />
    </>
  );
}
```

- [ ] **Step 2: Verify** — visit `/en/newsroom/welcome-to-the-ssp-newsroom` once seed content is in (Phase 19). For now, with only the test fixture, visit `/en/newsroom/test-fixture` won't work because fixtures are hidden by default — that's correct.

- [ ] **Step 3: Commit** — `feat(newsroom): article route with redirects, JSON-LD, related posts`.

### Task 16.3: /newsroom/rss.xml

**Files:** create `src/app/[locale]/newsroom/rss.xml/route.ts`

- [ ] **Step 1: Write**

```ts
import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/cms';
import { siteUrl, siteName } from '@/lib/seo';

export async function GET(): Promise<NextResponse> {
  const posts = await getAllPosts();
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${siteUrl}/newsroom/${p.slug}</link>
      <guid>${siteUrl}/newsroom/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escape(p.description)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName} Newsroom</title>
    <link>${siteUrl}/newsroom</link>
    <description>Latest news, product updates, and announcements from SSP.</description>
    <language>en-US</language>
    <atom:link href="${siteUrl}/newsroom/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  });
}

function escape(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
```

- [ ] **Step 2: Verify** — visit `/en/newsroom/rss.xml` → well-formed RSS XML.

- [ ] **Step 3: Commit** — `feat(newsroom): RSS feed at /newsroom/rss.xml`.

---

## Phase 17 — Academy routes

### Task 17.1: /academy landing

**Files:** create `src/app/[locale]/academy/page.tsx`, `src/app/[locale]/academy/agent.md`

- [ ] **Step 1: Write `page.tsx`**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { createMetadata } from '@/lib/seo';
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy';
import { getCategories, getAllSeries, getAcademyPosts } from '@/lib/cms';
import { PageHeader } from '@/components/header/page-header';
import { NewsroomCard } from '@/components/newsroom/newsroom-card';

export const metadata: Metadata = createMetadata({
  title: 'SSP Academy — Learn Crypto Self-Custody',
  description: 'Guides, tutorials, and deep dives on SSP, multisig, security, DeFi, and more.',
  path: '/academy',
});

const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Academy' },
]);

export default async function AcademyLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [categories, allSeries, latest] = await Promise.all([
    getCategories().catch(() => []),
    getAllSeries().catch(() => []),
    getAcademyPosts({ limit: 12 }).catch(() => []),
  ]);
  const seriesList = allSeries.filter((s) => s.postCount > 0);

  return (
    <>
      <Script id="breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
      <PageHeader title="SSP Academy" description="Guides, tutorials, and deep dives to help you master self-custody with SSP." />

      <section className="container-custom py-12">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">Browse by topic</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.filter((c) => c.slug !== 'news-explained').map((c) => (
            <Link key={c.slug} href={`/academy/${c.slug}`} className="card hover:border-primary-400">
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{c.description}</p>
              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">{c.postCount} article{c.postCount === 1 ? '' : 's'}</p>
            </Link>
          ))}
        </div>
      </section>

      {seriesList.length > 0 && (
        <section className="container-custom py-12">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">Learning paths</h2>
            <Link href="/academy/series" className="text-sm text-primary-600 underline dark:text-primary-400">View all</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {seriesList.slice(0, 3).map((s) => (
              <Link key={s.slug} href={`/academy/series/${s.slug}`} className="block">
                <div className="mb-3 aspect-video rounded-card bg-cover bg-center" style={{ backgroundImage: `url(${s.heroImage})` }} aria-label={s.heroImageAlt} />
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.postCount} parts</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-custom py-12">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">Latest articles</h2>
        {latest.length === 0 ? (
          <p className="py-8 text-center text-gray-500 dark:text-gray-400">New articles coming soon — check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latest.map((p) => <NewsroomCard key={p.slug} post={p} href={p.category ? `/academy/${p.category}/${p.slug}` : `/newsroom/${p.slug}`} />)}
          </div>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 2: agent.md** (under 2KB).

- [ ] **Step 3: Verify** — visit `/en/academy`.

- [ ] **Step 4: Commit** — `feat(academy): /academy landing page`.

### Task 17.2: /academy/[category] hub + per-category hero copy

**Files:** create `src/app/[locale]/academy/[category]/page.tsx`, `src/app/[locale]/academy/[category]/_content/index.tsx`

- [ ] **Step 1: Write the per-category hero copy**

```tsx
// src/app/[locale]/academy/[category]/_content/index.tsx
import type { ReactNode } from 'react';
import type { AcademyCategory } from '@/constants/academy-categories';

interface CategoryHero {
  h1: string;
  lede: string;
  intro: ReactNode;
}

export const CATEGORY_HEROES: Record<AcademyCategory, CategoryHero> = {
  'multisig': {
    h1: 'Multisig Explained',
    lede: 'How 2-of-2 multisignature actually works in SSP — and why it matters.',
    intro: <p>Multisig wallets require multiple signatures to authorize a transaction. SSP enforces 2-of-2 on every signed action: the browser extension and the mobile SSP Key app must both approve. This page collects the deep-dives that explain how the model works, what attacks it stops, and where its limits sit.</p>,
  },
  'getting-started': {
    h1: 'Crypto Basics',
    lede: 'Foundational concepts every crypto user should know.',
    intro: <p>Brand-new to crypto, or returning after a long break? Start here. These guides cover wallets, addresses, transactions, gas, mempools, and finality — the vocabulary you need before you touch real funds.</p>,
  },
  'security': {
    h1: 'Security & Self-Custody',
    lede: 'Protect your crypto: seeds, phishing, hardware, threat models.',
    intro: <p>Self-custody is hard because attacks are creative. This collection walks through the threats that actually catch users: phishing pages, fake support DMs, malicious dApps, lost seeds, and how SSP\'s 2-of-2 model neutralises most of them.</p>,
  },
  'how-to': {
    h1: 'How-To Guides',
    lede: 'Step-by-step walkthroughs for common SSP tasks.',
    intro: <p>Practical, screenshot-driven walkthroughs for the things SSP users do every day: sending transactions across chains, connecting to dApps via WalletConnect, swapping tokens, and recovering from a lost device.</p>,
  },
  'coin-guides': {
    h1: 'Coin & Chain Guides',
    lede: 'Deep dives into individual coins and chains SSP supports.',
    intro: <p>Each coin or chain SSP supports has its own quirks — UTXO vs. account-based, native multisig vs. ERC-4337, fee dynamics, finality times. This collection covers them one at a time.</p>,
  },
  'defi': {
    h1: 'DeFi & Account Abstraction',
    lede: 'Staking, lending, swaps, and ERC-4337 explained.',
    intro: <p>SSP supports DeFi via ERC-4337 Account Abstraction on EVM chains. These articles explain what AA is, what dApps you can use safely from a multisig wallet, and how SSP keeps you in control while letting you participate in DeFi protocols.</p>,
  },
  'news-explained': {
    h1: 'News & Industry Analysis',
    lede: 'Context and analysis on crypto news and regulation.',
    intro: <p>Beyond the headlines: the regulatory shifts, exchange failures, protocol incidents, and standards updates that actually affect self-custody users — explained without hype.</p>,
  },
};
```

- [ ] **Step 2: Write `page.tsx`**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { createMetadata, siteDescription } from '@/lib/seo';
import { getAcademyPosts } from '@/lib/cms';
import { ACADEMY_CATEGORIES, ACADEMY_CATEGORY_SLUGS, isAcademyCategory } from '@/constants/academy-categories';
import { CATEGORY_HEROES } from './_content';
import { NewsroomCard } from '@/components/newsroom/newsroom-card';
import { PageHeader } from '@/components/header/page-header';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy';

export function generateStaticParams() {
  return ACADEMY_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!isAcademyCategory(category)) {
    return createMetadata({ title: 'Academy', description: siteDescription, path: '/academy' });
  }
  const meta = ACADEMY_CATEGORIES[category];
  const hero = CATEGORY_HEROES[category];
  const posts = await getAcademyPosts({ category, limit: 100 }).catch(() => []);
  return createMetadata({
    title: `${hero.h1} | SSP Academy`,
    description: meta.description,
    path: `/academy/${category}`,
    noindex: posts.length === 0,
  });
}

export default async function CategoryHubPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  if (!isAcademyCategory(category)) notFound();

  const hero = CATEGORY_HEROES[category];
  const posts = await getAcademyPosts({ category, limit: 100 }).catch(() => []);

  return (
    <>
      <Script id="academy-category-breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(buildAcademyBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Academy', url: '/academy' },
          { name: ACADEMY_CATEGORIES[category].title },
        ]))}
      </Script>
      <div className="container-custom pt-24 md:pt-32">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: 'Academy', href: '/academy' },
          { label: ACADEMY_CATEGORIES[category].title },
        ]} />
      </div>
      <PageHeader title={hero.h1} description={hero.lede} />
      <section className="container-custom max-w-4xl space-y-4 py-12 text-base leading-relaxed text-gray-600 dark:text-gray-300 md:py-16 md:text-lg">
        {hero.intro}
      </section>
      <section className="container-custom pb-16 md:pb-24">
        {posts.length === 0 ? (
          <div className="space-y-6 py-12 text-center">
            <p className="text-gray-600 dark:text-gray-300">New articles coming soon. In the meantime, explore related topics:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {ACADEMY_CATEGORY_SLUGS.filter((s) => s !== category && s !== 'news-explained').slice(0, 3).map((s) => (
                <Link key={s} href={`/academy/${s}`} className="text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  {ACADEMY_CATEGORIES[s].title}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <NewsroomCard key={p.slug} post={p} href={`/academy/${category}/${p.slug}`} />)}
          </div>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 3: Verify** — visit `/en/academy/multisig`, `/en/academy/security`, etc.

- [ ] **Step 4: Commit** — `feat(academy): per-category hub pages with hero copy`.

### Task 17.3: /academy/[category]/[slug] article

**Files:** create `src/app/[locale]/academy/[category]/[slug]/page.tsx`

- [ ] **Step 1: Write**

```tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound, redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAcademyPostBySlug, getAuthorBySlug, getRelatedPosts } from '@/lib/cms';
import { ACADEMY_CATEGORIES, isAcademyCategory } from '@/constants/academy-categories';
import { PostArticle } from '@/components/shared/post-article';
import { AuthorByline } from '@/components/shared/author-byline';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { createMetadata, siteUrl } from '@/lib/seo';
import { buildAcademyArticleJsonLd, buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy';
import { getTermMap } from '@/lib/academy-terms';
import { autoLinkContent } from '@/lib/glossary-linker';

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getAcademyPostBySlug(slug).catch(() => undefined);
  if (!post) return { title: 'Not found' };
  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/academy/${category}/${slug}`,
    noindex: post.noindex ?? false,
    canonical: post.canonicalUrl ?? undefined,
    ogImage: { url: post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`, width: 1200, height: 630, alt: post.imageAlt },
    type: 'article',
    articleMeta: {
      publishedTime: post.date,
      modifiedTime: post.modifiedDate ?? post.date,
      author: post.author,
      tags: post.tags,
    },
  });
}

export default async function AcademyArticlePage({ params }: { params: Promise<{ locale: string; category: string; slug: string }> }) {
  const { locale, category, slug } = await params;
  setRequestLocale(locale);
  if (!isAcademyCategory(category)) notFound();

  const post = await getAcademyPostBySlug(slug).catch(() => undefined);
  if (!post) notFound();

  if (post.slug !== slug || (post.category && post.category !== category)) {
    redirect(`/academy/${post.category ?? category}/${post.slug}`);
  }
  if (post.section !== 'academy') notFound();

  const related = await getRelatedPosts(post, 3).catch(() => []);
  const authorId = post.authorId;
  const author = authorId ? await getAuthorBySlug(authorId).catch(() => null) : null;

  const termMap = getTermMap();
  const linkedContent = autoLinkContent(post.content, post.slug, termMap);

  const blogPostingJsonLd = buildAcademyArticleJsonLd(post, category, author);
  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Academy', url: '/academy' },
    { name: ACADEMY_CATEGORIES[category].title, url: `/academy/${category}` },
    { name: post.title },
  ]);

  return (
    <>
      <Script id="academy-article-jsonld" type="application/ld+json">{JSON.stringify(blogPostingJsonLd)}</Script>
      <Script id="academy-breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
      <PostArticle
        post={post}
        relatedPosts={related}
        backHref={`/academy/${category}`}
        backLabel={ACADEMY_CATEGORIES[category].title}
        content={linkedContent}
        breadcrumb={
          <>
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: 'Academy', href: '/academy' },
              { label: ACADEMY_CATEGORIES[category].title, href: `/academy/${category}` },
              { label: post.title },
            ]} />
            {author && <AuthorByline author={author} />}
          </>
        }
      />
    </>
  );
}
```

- [ ] **Step 2: Verify** — once seeds land in Phase 19, visit `/en/academy/multisig/what-is-2-of-2-multisig`.

- [ ] **Step 3: Commit** — `feat(academy): article route with glossary auto-linking and full SEO`.

### Task 17.4: /academy/series and /academy/series/[slug]

**Files:** create `src/app/[locale]/academy/series/page.tsx` and `src/app/[locale]/academy/series/[slug]/page.tsx`

- [ ] **Step 1: Write `series/page.tsx`** — list all series (uses `getAllSeries()`). When seed-fallback returns `[]`, show empty state.
- [ ] **Step 2: Write `series/[slug]/page.tsx`** — `getSeriesBySlug(slug)`. If the CMS isn't live, the page shows `notFound()` (seed fallback returns `undefined`). Listed posts use `seriesOrder` for ordering. Each post card carries a "Part X of Y" badge.
- [ ] **Step 3: Commit** — `feat(academy): series index and detail routes`.

### Task 17.5: /academy/rss.xml

**Files:** create `src/app/[locale]/academy/rss.xml/route.ts`

Same shape as Task 16.3 but using `getAcademyPosts()` and `/academy/<category>/<slug>` URLs.

- [ ] Commit: `feat(academy): RSS feed at /academy/rss.xml`.

### Task 17.6: Extend src/app/sitemap.ts with academy + newsroom slugs

- [ ] **Step 1: Add dynamic entries**

In `src/app/sitemap.ts`, after the `STATIC_ROUTES` loop, fetch and append:
- `getAllPosts()` → `/newsroom/<slug>` per locale
- `getAcademySlugs()` → `/academy/<category>/<slug>` per locale
- `getAllSeries()` → `/academy/series/<slug>` per locale
- (Authors handled in Phase 18.)

Wrap each in `try { … } catch { /* CMS down — skip dynamic */ }`.

- [ ] **Step 2: Verify** — `/sitemap.xml` now includes article URLs.

- [ ] **Step 3: Commit** — `feat(seo): include newsroom + academy slugs in sitemap`.

---

## Phase 18 — Author route

### Task 18.1: /author/[slug]

**Files:** create `src/app/[locale]/author/[slug]/page.tsx`

- [ ] **Step 1: Write**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/cms';
import { createMetadata, createBreadcrumbJsonLd } from '@/lib/seo';
import { NewsroomCard } from '@/components/newsroom/newsroom-card';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: 'Author not found' };
  return createMetadata({
    title: `${author.name} — SSP Author`,
    description: author.bio ?? `Articles by ${author.name}`,
    path: `/author/${slug}`,
  });
}

export default async function AuthorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const author = await getAuthorBySlug(slug);
  if (!author) notFound();
  const posts = await getPostsByAuthor(slug);

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Authors' },
    { name: author.name },
  ]);

  return (
    <>
      <Script id="author-breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
      <div className="container-custom pt-24 md:pt-32">
        <Breadcrumbs items={[
          { label: 'Home', href: '/' },
          { label: author.name },
        ]} />
      </div>
      <section className="container-custom py-12">
        <div className="flex items-start gap-6">
          {author.avatar && <Image src={author.avatar} alt={author.name} width={96} height={96} className="rounded-full" />}
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">{author.name}</h1>
            {author.title && <p className="mt-1 text-gray-600 dark:text-gray-300">{author.title}</p>}
            {author.bio && <p className="mt-4 max-w-2xl text-gray-600 dark:text-gray-300">{author.bio}</p>}
          </div>
        </div>
      </section>
      <section className="container-custom pb-16 md:pb-24">
        <h2 className="mb-6 text-2xl font-bold">Posts by {author.name}</h2>
        {posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <NewsroomCard key={p.slug} post={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
```

- [ ] **Step 2: Extend sitemap with author URLs**

In `src/app/sitemap.ts`, list every author file in `content/authors/*.json` (or via `getAuthors()` once the CMS supports it). For seed mode, read directory listing.

- [ ] **Step 3: Commit** — `feat(author): /author/[slug] profile route`.

---

## Phase 19 — Seed content (USER REVIEW GATE)

This phase ships the 10 seed articles + the SSP Team author profile + glossary anchors.

**🛑 USER REVIEW GATE: Every seed article must be reviewed by the user before commit. Do NOT commit any seed file without explicit approval. The whole repo is public on GitHub — once a forward-looking claim, an embargoed roadmap item, or an unverified statistic is in the history, removal is messy.**

### Task 19.1: Seed author profile

**Files:** create `content/authors/ssp-team.json`, `public/images/authors/ssp-team.png`

- [ ] **Step 1: Write `content/authors/ssp-team.json`**

```json
{
  "slug": "ssp-team",
  "name": "SSP Team",
  "title": "SSP Wallet contributors",
  "bio": "We build SSP — the open-source 2-of-2 BIP48 multisignature wallet. Articles posted under this byline are written collaboratively by the SSP engineering, security, and design team.",
  "avatar": "/images/authors/ssp-team.png",
  "twitterUrl": "https://twitter.com/sspwallet_io",
  "linkedinUrl": null,
  "githubUrl": "https://github.com/RunOnFlux",
  "websiteUrl": "https://sspwallet.io"
}
```

- [ ] **Step 2: Provide author avatar**

Either reuse `/public/ssp-logo-black-512x512.png` (rename or copy as `/public/images/authors/ssp-team.png`), or commission a new 256×256 PNG. The avatar must be publication-safe.

- [ ] **Step 3: USER REVIEW**: Show the user the JSON content and asset path. Wait for explicit approval before commit.

- [ ] **Step 4: Commit** — `feat(content): add SSP Team author profile`.

### Task 19.2: Newsroom seed articles (3)

For each article:
1. Draft Markdown with frontmatter.
2. Show the user the rendered output (run dev server, visit the URL).
3. **User reviews and approves.**
4. Commit the file.

#### Article 19.2.1: `content/newsroom/welcome-to-the-ssp-newsroom.md`

Frontmatter shape:
```yaml
---
title: Welcome to the SSP Newsroom
description: A new home for SSP product updates, security announcements, and team news.
slug: welcome-to-the-ssp-newsroom
date: '2026-04-27'
author: SSP Team
authorId: ssp-team
readTime: 3
tags: [announcement, ssp]
section: newsroom
image: /images/news/welcome.jpg
imageAlt: SSP Wallet brand mark
---
```

Body: a short, factual welcome — what the newsroom is for, what kinds of posts to expect, where to subscribe (`/newsroom/rss.xml`), how to give feedback (`/contact`). 300-500 words. No forward-looking claims.

#### Article 19.2.2: `content/newsroom/why-2-of-2-multisig-matters.md`

400-600 words on the SSP threat model. Why a single device cannot sign. Existing facts only — links to docs, audit reports, the open-source repo. No unverifiable security claims.

#### Article 19.2.3: `content/newsroom/ssp-roadmap-2026.md`

**Caution: forward-looking. User must vet every roadmap item.** If the user prefers, swap this article for a different topic (e.g. `the-ssp-2-of-2-design-pattern.md` or `our-stance-on-self-custody.md`).

For each article in this task:
- [ ] Draft.
- [ ] User review.
- [ ] On approval: commit `feat(content): add newsroom article — <slug>`.

### Task 19.3: Academy seed articles (7, one per category)

For each:
1. Draft Markdown with frontmatter (including `section: academy`, `category: <slug>`).
2. User reviews.
3. On approval: commit.

| Slug | Category | Difficulty | Approx. length |
|------|----------|-----------|----------------|
| `what-is-2-of-2-multisig` | multisig | beginner | 800 words |
| `setting-up-your-first-ssp-wallet` | getting-started | beginner | 1000 words (screenshots optional) |
| `seed-phrase-best-practices` | security | beginner | 700 words |
| `sending-bitcoin-with-ssp` | how-to | intermediate | 800 words |
| `bitcoin-with-ssp-explained` | coin-guides | beginner | 700 words |
| `what-is-account-abstraction-erc-4337` | defi | intermediate | 900 words |
| `why-self-custody-matters-now` | news-explained | beginner | 600 words |

Each frontmatter MUST include the glossary anchor IDs the term-map references (e.g. `seed-phrase-best-practices` should have an `## Hardware wallet` H2 so `#hardware-wallet` resolves).

For each article:
- [ ] Draft.
- [ ] User review.
- [ ] On approval: commit `feat(content): add academy article — <category>/<slug>`.

### Task 19.4: Add per-route agent.md files for newsroom and academy landing

- [ ] `src/app/[locale]/newsroom/agent.md` — frontmatter + key facts + related (under 2KB).
- [ ] `src/app/[locale]/academy/agent.md` — same shape.
- [ ] Commit: `docs(agent-md): newsroom and academy landing agent.md files`.

### Task 19.5: Verify seed articles render end-to-end

- [ ] **Step 1: Run dev server**
- [ ] **Step 2: Visit each seed article URL**:
  - `/en/newsroom`
  - `/en/newsroom/welcome-to-the-ssp-newsroom`
  - `/en/newsroom/why-2-of-2-multisig-matters`
  - `/en/newsroom/ssp-roadmap-2026` (or replacement)
  - `/en/academy`
  - `/en/academy/multisig`
  - `/en/academy/multisig/what-is-2-of-2-multisig`
  - `/en/academy/getting-started/setting-up-your-first-ssp-wallet`
  - `/en/academy/security/seed-phrase-best-practices`
  - `/en/academy/how-to/sending-bitcoin-with-ssp`
  - `/en/academy/coin-guides/bitcoin-with-ssp-explained`
  - `/en/academy/defi/what-is-account-abstraction-erc-4337`
  - `/en/academy/news-explained/why-self-custody-matters-now`
  - `/en/author/ssp-team`
  - `/en/newsroom/rss.xml`
  - `/en/academy/rss.xml`
  - `/sitemap.xml`

For each:
- Renders correctly in light mode.
- Renders correctly in dark mode.
- ToC sidebar shows for academy articles with H2 headings.
- Glossary auto-linker turns terms into links.
- Share buttons open the right URLs.
- Related posts appear (if any siblings exist).
- Breadcrumbs work.
- JSON-LD validates ([Google Rich Results Test](https://search.google.com/test/rich-results) for at least one article).

If anything fails, fix the offending component or seed article. Do not commit a fix that crosses task boundaries — keep commits atomic.

---

## Phase 20 — Header / Footer / locale switcher

### Task 20.1: Locale switcher component

**Files:** create `src/components/header/locale-switcher.tsx`

- [ ] **Step 1: Write**

```tsx
'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { Globe } from 'lucide-react';

const LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function setLocale(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="dark:bg-dark-800 dark:hover:bg-dark-700 inline-flex items-center gap-2 rounded-lg bg-gray-100 p-2 hover:bg-gray-200" aria-label="Select language">
          <Globe className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          <span className="hidden text-sm font-medium md:inline">{LABELS[locale]}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content sideOffset={8} className="rounded-card border border-gray-200 bg-white p-2 shadow-md dark:border-dark-700 dark:bg-dark-800">
          {routing.locales.map((l) => (
            <DropdownMenu.Item
              key={l}
              onSelect={() => setLocale(l as Locale)}
              className={`cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-700 ${
                l === locale ? 'font-semibold text-primary-600 dark:text-primary-400' : ''
              }`}
            >
              {LABELS[l as Locale]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

- [ ] **Step 2: Commit** — `feat(header): add locale-switcher with Radix dropdown`.

### Task 20.2: Header — add Newsroom + Academy nav + More dropdown + locale switcher

**Files:** modify `src/components/header/header.tsx`

- [ ] **Step 1: Update navigation array**

```ts
const PRIMARY_NAV = [
  { name: 'home', href: '/' },
  { name: 'features', href: '/features' },
  { name: 'newsroom', href: '/newsroom' },
  { name: 'academy', href: '/academy' },
  { name: 'guide', href: '/guide' },
  { name: 'support', href: '/support' },
];

const MORE_NAV = [
  { name: 'enterprise', href: '/enterprise' },
  { name: 'contact', href: '/contact' },
];
```

- [ ] **Step 2: Add a Radix `navigation-menu` "More" dropdown** for `MORE_NAV` items at desktop widths.

```tsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
```

The mobile menu lists all nav items (PRIMARY + MORE) flat.

- [ ] **Step 3: Add `<LocaleSwitcher />` to the right-side actions block**, before the theme toggle.

- [ ] **Step 4: Verify** — visit `/en`. Newsroom + Academy now appear in nav. Locale switcher works (`/es/...` → English copy with ES marker). Mobile menu lists everything. Theme toggle still works.

- [ ] **Step 5: Commit** — `feat(header): add Newsroom + Academy nav, More dropdown, locale switcher`.

### Task 20.3: Footer — add Learn column

**Files:** modify `src/components/footer/footer.tsx`

- [ ] **Step 1: Add a new `learn` block** to the `footerNavigation` object:

```ts
learn: [
  { name: 'Newsroom', href: '/newsroom' },
  { name: 'Academy', href: '/academy' },
  { name: 'Multisig Explained', href: '/academy/multisig' },
  { name: 'Security', href: '/academy/security' },
  { name: 'Getting Started', href: '/academy/getting-started' },
  { name: 'RSS Feed', href: '/newsroom/rss.xml', external: true },
],
```

- [ ] **Step 2: Render the column** between `community` and `legal` so the footer reads: Logo+intro / Navigation / Product / Learn / Community / Legal. Adjust the parent grid from 6 columns to 6 columns (already wide enough; the new column replaces an empty slot).

- [ ] **Step 3: Verify** — footer shows the new column with all six links. RSS Feed opens in a new tab.

- [ ] **Step 4: Commit** — `feat(footer): add Learn column with Newsroom + Academy + RSS`.

---

## Phase 21 — Agent skills + check scripts

### Task 21.1: scripts/generate-chains-skill.ts

**Files:** create `scripts/generate-chains-skill.ts`

- [ ] **Step 1: Write**

```ts
#!/usr/bin/env tsx
import { promises as fs } from 'fs';
import path from 'path';
import { SUPPORTED_CHAINS } from '../src/constants/supported-chains';

const TARGET = path.resolve('src/app/api/agent-skills/skills/list-supported-chains/SKILL.md');

const HEADER = `---
name: list-supported-chains
description: Authoritative list of blockchains and assets supported by SSP Wallet, regenerated automatically from src/constants/supported-chains.ts on every build.
url: https://sspwallet.io/api/agent-skills/skills/list-supported-chains/SKILL.md
last_reviewed: ${new Date().toISOString().slice(0, 10)}
---
`;

async function main() {
  await fs.mkdir(path.dirname(TARGET), { recursive: true });
  const utxo = SUPPORTED_CHAINS.filter((c) => c.network === 'utxo');
  const evm = SUPPORTED_CHAINS.filter((c) => c.network === 'evm');
  const body = `
SSP Wallet supports ${SUPPORTED_CHAINS.length} blockchains as of ${new Date().toISOString().slice(0, 10)}.

## UTXO chains

${utxo.map((c) => `- **${c.name}** (\`${c.symbol}\`)`).join('\n')}

## EVM chains

${evm.map((c) => `- **${c.name}** (\`${c.symbol}\`)`).join('\n')}

## How to use

- See feature comparison: https://sspwallet.io/features
- Download SSP Wallet: https://sspwallet.io/download
`;
  await fs.writeFile(TARGET, HEADER + body, 'utf8');
  console.log(`Wrote ${TARGET}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run** — `npx tsx scripts/generate-chains-skill.ts`.

Expected: file appears at `src/app/api/agent-skills/skills/list-supported-chains/SKILL.md` with the chain list.

- [ ] **Step 3: Commit** — `feat(agent-skills): generator script for list-supported-chains SKILL.md`.

### Task 21.2: Static SKILL.md files

**Files:** create three SKILL.md files

- [ ] **Step 1: `src/app/api/agent-skills/skills/find-ssp-installer/SKILL.md`**

```markdown
---
name: find-ssp-installer
description: Guide an agent to the right SSP Wallet installer (Chrome Web Store, Firefox Add-ons, App Store, Google Play) for a user's platform.
url: https://sspwallet.io/api/agent-skills/skills/find-ssp-installer/SKILL.md
last_reviewed: 2026-04-27
---

SSP Wallet ships as both a browser extension (Chrome / Firefox / Brave) and a mobile companion app (iOS / Android, called "SSP Key"). The 2-of-2 model requires both.

## Installer locations

- **Chrome / Brave**: https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/ssp-wallet
- **iOS (SSP Key)**: see https://sspwallet.io/download
- **Android (SSP Key)**: see https://sspwallet.io/download

## What you can do

- Send the user directly to /download for OS detection and platform-correct buttons.
- For browser-only installs, the extension URLs above are stable.
- The mobile app is required for transaction signing — surface that to the user before they install only the browser extension.

## Related

- /features — feature comparison
- /guide — step-by-step setup
```

- [ ] **Step 2: `src/app/api/agent-skills/skills/compare-ssp-products/SKILL.md`**

```markdown
---
name: compare-ssp-products
description: Compare the three SSP products — Browser Extension, SSP Key (mobile), and SSP Enterprise — for a user evaluating which to use.
url: https://sspwallet.io/api/agent-skills/skills/compare-ssp-products/SKILL.md
last_reviewed: 2026-04-27
---

SSP ships three products:

## SSP Browser Extension

- One of the two required signers in the 2-of-2 model.
- Holds the first key share; co-signs every transaction with the mobile app.
- Available for Chrome, Firefox, Brave.
- Installer: see /download

## SSP Key (mobile)

- The second required signer.
- iOS + Android. Required for every transaction.
- Without the mobile app, the extension cannot sign.

## SSP Enterprise

- Multisig vault product for organisations.
- M-of-N (configurable), two-device per signer.
- Audit trail, role separation, treasury workflows.
- See /enterprise

## Related

- /features
- /case-studies/flux-foundation — production deployment example
```

- [ ] **Step 3: `src/app/api/agent-skills/skills/check-asset-support/SKILL.md`**

```markdown
---
name: check-asset-support
description: Check whether a specific blockchain or token is supported by SSP Wallet.
url: https://sspwallet.io/api/agent-skills/skills/check-asset-support/SKILL.md
last_reviewed: 2026-04-27
---

SSP supports a fixed list of base chains. ERC-20 tokens on supported EVM chains work via the standard token interface.

## Authoritative list

See the auto-generated companion skill `list-supported-chains` for the current set:
/api/agent-skills/skills/list-supported-chains/SKILL.md

## What you can do

- For chain-level support: check the list-supported-chains skill.
- For token-level support on EVM chains: standard ERC-20 contracts on Ethereum, Polygon, BNB Smart Chain, Avalanche, Base.
- For DeFi protocol compatibility: see /academy/defi/what-is-account-abstraction-erc-4337.

## Related

- /features
- /academy/coin-guides
```

- [ ] **Step 4: Commit** — `feat(agent-skills): add manual SKILL.md files (find-ssp-installer, compare-ssp-products, check-asset-support)`.

### Task 21.3: Route handler to serve SKILL.md content

**Files:** create `src/app/api/agent-skills/skills/[name]/route.ts`

- [ ] **Step 1: Write**

```ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!/^[a-z0-9-]+$/.test(name)) return new NextResponse('Not found', { status: 404 });
  try {
    const file = path.resolve(process.cwd(), 'src/app/api/agent-skills/skills', name, 'SKILL.md');
    const md = await fs.readFile(file, 'utf8');
    return new NextResponse(md, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
```

- [ ] **Step 2: Verify** — `curl http://localhost:3000/api/agent-skills/skills/find-ssp-installer` → returns the markdown body.

- [ ] **Step 3: Commit** — `feat(agent-skills): route handler serving SKILL.md per name`.

### Task 21.4: scripts/check-agent-md-staleness.ts

**Files:** create `scripts/check-agent-md-staleness.ts`

- [ ] **Step 1: Write**

```ts
#!/usr/bin/env tsx
// Fails build if any page.tsx in src/app/[locale]/** was modified in the
// most-recent commit without its sibling agent.md being touched in the same commit.
// Escape hatch: include "[agent-md-skip]" in the commit message.

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function main() {
  const lastMessage = execSync('git log -1 --pretty=%B').toString();
  if (lastMessage.includes('[agent-md-skip]')) {
    console.log('agent.md staleness check skipped via [agent-md-skip] marker');
    return;
  }

  const changed = execSync('git diff --name-only HEAD~1 HEAD || git diff --name-only --cached')
    .toString()
    .split('\n')
    .filter(Boolean);

  const offenders: string[] = [];
  for (const file of changed) {
    if (!file.match(/^src\/app\/\[locale\]\/.+\/page\.tsx$/)) continue;
    const dir = path.dirname(file);
    const agentMd = path.join(dir, 'agent.md');
    try {
      await fs.access(agentMd);
    } catch {
      continue; // no sibling = not required
    }
    if (!changed.includes(agentMd)) {
      offenders.push(`${file} was modified but its sibling ${agentMd} was not.`);
    }
  }

  if (offenders.length > 0) {
    console.error('agent.md staleness check FAILED:');
    for (const o of offenders) console.error(`  - ${o}`);
    console.error('\nFix: update the sibling agent.md in the same commit, OR add "[agent-md-skip]" to the commit message with a one-line reason.');
    process.exit(1);
  }
  console.log('agent.md staleness check passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 2: Run** — `npx tsx scripts/check-agent-md-staleness.ts`. Should pass on the current commit (no page.tsx modified without agent.md in this PR).

- [ ] **Step 3: Commit** — `feat(scripts): add agent.md staleness checker for prebuild`.

### Task 21.5: scripts/check-public-safe.ts

**Files:** create `scripts/check-public-safe.ts`

- [ ] **Step 1: Write**

```ts
#!/usr/bin/env tsx
// Refuses to build if /content, agent.md files, or env files contain likely-private data.

import { promises as fs } from 'fs';
import path from 'path';

const ROOT = process.cwd();

const PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\.internal\./i, reason: '"internal" hostname' },
  { pattern: /sk_live_[A-Za-z0-9]{16,}/, reason: 'looks like a live API key' },
  { pattern: /\bcms\.internal\./i, reason: 'internal CMS hostname' },
  { pattern: /AKIA[0-9A-Z]{16}/, reason: 'AWS access key id' },
  { pattern: /-----BEGIN (RSA|EC) PRIVATE KEY-----/, reason: 'private key blob' },
  { pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, reason: 'IP address literal (allowlist 0.0.0.0, 127.0.0.1)' },
];

const ALLOWED_IPS = new Set(['0.0.0.0', '127.0.0.1', '255.255.255.255']);

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function main() {
  const checkRoots = [
    path.join(ROOT, 'content'),
    path.join(ROOT, 'src/app'),
    path.join(ROOT, '.env.example'),
  ];
  const offenders: string[] = [];
  for (const root of checkRoots) {
    const stat = await fs.stat(root).catch(() => null);
    if (!stat) continue;
    const files = stat.isDirectory() ? await walk(root) : [root];
    for (const f of files) {
      if (!/\.(md|json|ts|tsx|env|env\.example)$/.test(f) && !f.endsWith('.env.example')) continue;
      const text = await fs.readFile(f, 'utf8').catch(() => '');
      for (const { pattern, reason } of PATTERNS) {
        const m = text.match(pattern);
        if (!m) continue;
        if (reason.includes('IP address') && ALLOWED_IPS.has(m[0])) continue;
        offenders.push(`${path.relative(ROOT, f)}: ${reason} (matched: ${m[0]})`);
      }
    }
  }
  if (offenders.length > 0) {
    console.error('check-public-safe FAILED:');
    for (const o of offenders) console.error(`  - ${o}`);
    process.exit(1);
  }
  console.log('check-public-safe passed.');
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run** — `npx tsx scripts/check-public-safe.ts`. Must pass.

- [ ] **Step 3: Commit** — `feat(scripts): add check-public-safe guard for committed content`.

### Task 21.6: Verify prebuild runs all three scripts

- [ ] **Step 1: Try `npm run build`**

If everything from Phases 11–21 is in place, `prebuild` runs:
1. `check-public-safe.ts` — passes.
2. `check-agent-md-staleness.ts` — passes.
3. `generate-chains-skill.ts` — regenerates the skill file.

Then `next build` succeeds.

If `next build` fails for unrelated reasons (page imports, type errors), fix in their respective phases — don't paper over here.

- [ ] **Step 2: Commit any regenerated SKILL.md changes**

```bash
git add src/app/api/agent-skills/skills/list-supported-chains/SKILL.md
git commit -m "chore(agent-skills): regenerate list-supported-chains via prebuild"
```

---

## Phase 22 — Documentation

### Task 22.1: README.md rewrite

**Files:** modify `README.md`

- [ ] **Step 1: Replace** the existing README with one that reflects:
  - Tech stack: Next.js 16 App Router, TypeScript 5, Tailwind v4, next-intl, Vitest.
  - Project structure: `src/app/[locale]`, `src/components/{header,footer,home,newsroom,shared,ui}`, `src/lib/{cms,seo,...}`, `content/{newsroom,academy,authors}`, `scripts/`.
  - Available scripts: dev, build, start, lint, test, type-check, check:public-safe, check:agent-md-staleness, agent-skills:generate.
  - Content authoring: link to `docs/content-authoring.md`.
  - CMS integration: link to `docs/cms-integration.md`.
  - i18n: en/es/zh, locale prefix always.
  - Agent surface: agent.md per route, agent-skills under `/api/agent-skills`.
  - Open-source rules: only publication-ready content; `prebuild` enforces.
  - Production status, supported chains, links, license.

- [ ] **Step 2: Commit** — `docs(readme): rewrite for app-router + newsroom + academy`.

### Task 22.2: New CLAUDE.md (SSP-flavored agent guidance)

**Files:** create `CLAUDE.md`

- [ ] **Step 1: Write** an SSP-adapted version of Zelcore's CLAUDE.md:
  - Agent-readiness surface (agent.md per route, agent-skills, robots policy).
  - Pattern shortlist: "If you edit `src/app/[locale]/<route>/page.tsx`, update sibling `agent.md` in the same commit."
  - Generated artifacts: `list-supported-chains/SKILL.md` regenerated from `src/constants/supported-chains.ts`.
  - What not to edit without thinking: `src/middleware.ts`, `src/app/robots.txt/route.ts`, `scripts/check-*`.
  - i18n note: English source of truth at `src/messages/en.json`; `es.json`/`zh.json` use TODO markers until translators land.

- [ ] **Step 2: Commit** — `docs(claude): add SSP-flavored CLAUDE.md for agent guidance`.

### Task 22.3: docs/content-authoring.md

**Files:** create `docs/content-authoring.md`

- [ ] **Step 1: Write** a full author guide:
  - Where articles live: `content/newsroom/*.md` and `content/academy/<category>/*.md`.
  - Frontmatter schema (every field, what it means, defaults).
  - Image conventions: hero (16:9), square (1:1), story (9:16); WebP/AVIF preferred; `imageAlt` mandatory.
  - Tag and category rules.
  - Glossary linking: term must exist in `src/lib/academy-terms.ts` to be auto-linked.
  - Publication-safe rule: only commit articles that are ready to be public.
  - Review checklist: title clear, description ≤ 160 chars, no embargoed claims, links resolve, JSON-LD passes Google Rich Results.
  - How to add a new author: drop a JSON file in `content/authors/`.

- [ ] **Step 2: Commit** — `docs(content): add content-authoring guide`.

### Task 22.4: docs/cms-integration.md

**Files:** create `docs/cms-integration.md`

- [ ] **Step 1: Write** the CMS-integration guide:
  - Env vars required: `SSP_CMS_URL`, `SSP_CMS_API_KEY`, optional `AGENT_MD`.
  - API contract: every endpoint with method, query params, response shape (link to `src/lib/cms.ts` for ground truth).
  - Authentication: `x-api-key` header.
  - Caching: `next: { revalidate: 60 }` for listings, `300` for single posts; LRU 60s.
  - Fallback behaviour: when env vars unset OR fetch errors, the site falls back to `/content/`.
  - Migration: how to migrate articles from `/content/` Markdown into the upcoming SSP dashboard CMS.
  - Endpoint summary mirroring Zelcore's `/api/v1/posts`, `/api/v1/categories`, `/api/v1/series`, `/api/v1/authors`, `/api/v1/tags`.

- [ ] **Step 2: Commit** — `docs(cms): add CMS-integration guide for the upcoming dashboard team`.

### Task 22.5: .env.example update

**Files:** modify `.env.example`

- [ ] **Step 1: Add the new env vars**

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Form endpoints (SSP Relay)
NEXT_PUBLIC_CONTACT_API=https://relay.ssp.runonflux.io/v1/contact
NEXT_PUBLIC_SUPPORT_API=https://relay.ssp.runonflux.io/v1/ticket

# SSP CMS (set when the dashboard CMS is live; until then, the site
# falls back to seed Markdown in /content)
# SSP_CMS_URL=
# SSP_CMS_API_KEY=

# Set AGENT_MD=0 to disable the Accept: text/markdown serving path.
# AGENT_MD=0
```

- [ ] **Step 2: Commit** — `docs(env): add SSP_CMS_URL, SSP_CMS_API_KEY, AGENT_MD placeholders`.

### Task 22.6: CONTRIBUTING.md update (if exists)

- [ ] **Step 1: Check for `CONTRIBUTING.md`**. If it exists, update with:
  - Branch naming.
  - Commit author rule (no Claude trailers).
  - "Sibling agent.md required" rule.
  - Public-safe content rule.
- [ ] **Step 2: Commit if changed.**

---

## Phase 23 — Final verification

### Task 23.1: Full test suite

- [ ] `npm run check-all` → exits 0.
  - `type-check`: passes
  - `lint`: passes
  - `format:check`: passes
  - `test`: all units pass

### Task 23.2: Production build

- [ ] `npm run build` → exits 0.
  - prebuild: `check-public-safe`, `check-agent-md-staleness`, `generate-chains-skill` all green.
  - next build: zero warnings.
  - Generated `.next/` includes static params for every locale × every static route + every newsroom slug + every academy `[category]/[slug]` + every series + every author.

### Task 23.3: Manual verification

- [ ] **Start production server**: `npm start`. Visit `http://localhost:3000`.

For each verification item below, ✅ if pass.

#### Static routes (every page in light + dark)

- [ ] /en (homepage, all sections render, animations work)
- [ ] /en/features
- [ ] /en/guide (video plays)
- [ ] /en/support (FAQ accordion expands; form renders)
- [ ] /en/contact (form renders)
- [ ] /en/download (all download buttons link correctly)
- [ ] /en/enterprise
- [ ] /en/case-studies/flux-foundation
- [ ] /en/privacy-policy
- [ ] /en/terms-of-service
- [ ] /en/cookie-policy
- [ ] /en/checkout_success
- [ ] /en/checkout_failure
- [ ] /en/some-route-that-does-not-exist (404)

#### Newsroom

- [ ] /en/newsroom (3 seed articles + tag filter + Load more)
- [ ] /en/newsroom/welcome-to-the-ssp-newsroom
- [ ] /en/newsroom/why-2-of-2-multisig-matters
- [ ] /en/newsroom/ssp-roadmap-2026 (or its replacement)
- [ ] /en/newsroom/rss.xml validates

#### Academy

- [ ] /en/academy (categories grid + latest articles section)
- [ ] /en/academy/multisig (1 article)
- [ ] /en/academy/getting-started (1 article)
- [ ] /en/academy/security (1 article)
- [ ] /en/academy/how-to (1 article)
- [ ] /en/academy/coin-guides (1 article)
- [ ] /en/academy/defi (1 article)
- [ ] /en/academy/news-explained (1 article)
- [ ] /en/academy/multisig/what-is-2-of-2-multisig (full article with ToC, share, related, glossary auto-link working)
- [ ] /en/academy/series (empty state OK if no seed series)
- [ ] /en/academy/rss.xml validates

#### Author

- [ ] /en/author/ssp-team (avatar + bio + posts)

#### Sitemap + robots

- [ ] /sitemap.xml lists all static routes × 3 locales + every newsroom slug + every academy article + author + series.
- [ ] /robots.txt matches the spec policy.

#### i18n

- [ ] /es/newsroom and /zh/newsroom render with TODO markers in surface copy. Article body is English (seed content is en-only). Locale switcher round-trips between locales.

#### API + agent surface

- [ ] POST /api/contact reaches the SSP relay.
- [ ] POST /api/support reaches the SSP relay.
- [ ] curl -H "Accept: text/markdown" http://localhost:3000/en/features → returns `agent.md`.
- [ ] curl -H "Accept: text/markdown" http://localhost:3000/en/newsroom/welcome-to-the-ssp-newsroom → returns synthesised markdown.
- [ ] curl http://localhost:3000/api/agent-skills/skills/find-ssp-installer → returns the SKILL.md body.

#### SEO

- [ ] At least one newsroom article URL passes Google Rich Results Test for BlogPosting + BreadcrumbList.
- [ ] At least one academy article URL passes Google Rich Results Test for BlogPosting + BreadcrumbList + learning-resource fields.
- [ ] Lighthouse SEO + Performance + Accessibility within ±2 points of prior production for / and /features.
- [ ] Lighthouse SEO ≥ 95 for /newsroom, /academy, /newsroom/<slug>, /academy/<category>/<slug>.

### Task 23.4: Final commit + push

- [ ] **Step 1: Final lint pass**

```bash
npm run pre-commit
```

- [ ] **Step 2: Push the branch**

```bash
git push -u origin feat/newsroom-academy-app-router-migration
```

- [ ] **Step 3: Open PR** to `master`. PR description must include:
  - Summary of work (migration + new sections).
  - Screenshot of /newsroom and /academy in light + dark.
  - Lighthouse comparison numbers (before/after for / and /features).
  - Migration notes for the dashboard CMS team (link to `docs/cms-integration.md`).
  - Test plan: bulleted checklist of every verification item from Task 23.3.

The PR title: `feat: newsroom + academy with full app-router migration`. No Claude trailer.

---

## Self-review notes (post-write)

- **Spec coverage:** every section of the spec maps to one or more phases above. Foundation migration → Phases 1–10. Content layer → Phase 12. SEO → Phases 5, 13. Agent surface → Phases 14, 21. i18n → Phase 2. Newsroom routes → Phase 16. Academy routes → Phase 17. Author → Phase 18. Header/Footer updates → Phase 20. Docs → Phase 22. Verification gates → Phase 23. Open-source commit hygiene → Phase 21 (`check-public-safe.ts`) + Task 19 user-review gate.
- **Placeholder scan:** no TBDs or "implement later" — every step has runnable code or a precise instruction. Two locations use "or its replacement" for the roadmap article (Task 19.2.3) — that's intentional, the user may swap titles.
- **Type consistency:** `NewsroomPost` shape used identically across `seed-loader.ts`, `cms.ts`, `cms-fetch.ts`, every component, every page. `AcademyCategory` is the keyof of `ACADEMY_CATEGORIES` everywhere. Function names match between phases (`getAllPosts`, `getPostBySlug`, `getCategories`, etc.).
- **Ambiguity check:** the few decisions deferred to plan time are explicitly marked (Tailwind v3 vs v4 → kept v4; Turbopack → use default Next 16 dev server unless the user requests turbopack; `react-intersection-observer` → audit at end of Phase 10, removed if unused).

---

**Plan ready.** Save path: `docs/superpowers/plans/2026-04-27-newsroom-academy-app-router-migration.md`.
