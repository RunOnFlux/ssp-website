# Design — SSP Newsroom + Academy with Full App-Router Migration

| | |
| --- | --- |
| **Date** | 2026-04-27 |
| **Author** | Stultus Mundi |
| **Status** | Approved (brainstorming complete, ready for plan) |
| **Target branch** | `feat/newsroom-academy-app-router-migration` → `master` |
| **PR shape** | One large PR (~80-100 commits, ~200 files) |

---

## 1. Goal

Integrate a `Newsroom` (news, product updates, announcements) and `Academy` (learning content
organised into categories and series) into the SSP wallet website, mirroring the structure
and best-practices already proven in the Zelcore website at `/Users/vasilismagkoutis/repos/zelcore-website/`.

The SSP dashboard CMS that will eventually feed this content does not yet exist (it is the
team's next task). This PR therefore ships:

- The full set of routes, components, types, and SEO infrastructure.
- A CMS client (`src/lib/cms.ts`) that targets the same API contract as the Zelcore CMS, so
  the upcoming SSP dashboard CMS team has a known interface to implement.
- A seed-fallback loader that reads publication-ready Markdown from `/content/` when the CMS
  is not configured or unreachable, so the site renders correctly from day one and stays up
  if the CMS later has an outage.

It also performs a foundation migration of the entire existing site from the Pages Router
(plain JavaScript) to the App Router (TypeScript) with `next-intl` i18n infrastructure,
because the new sections require app-router primitives (`Metadata` API, `generateMetadata`,
route handlers for RSS, dynamic sitemaps) and the user wants codebase consistency.

## 2. Non-goals

These are explicitly out of scope for this PR. They are listed here so future readers do
not assume gaps are oversights.

- Building the SSP dashboard CMS itself. That is the next task; this PR builds against its
  contract.
- Real translations of UI copy or article content into Spanish (`es`) or Chinese (`zh`).
  This PR ships the i18n infrastructure with English copy in all three locales; translators
  fill in `messages/es.json` and `messages/zh.json` in a follow-up.
- Migrating the existing Medium archive at `https://medium.com/@ssp_wallet` into the new
  newsroom. That is a content project, not an infra one.
- Article search bar, comments, reactions, newsletter signup. None exist on the current
  site; they remain absent.

## 3. Open-source commit hygiene (the critical rule)

The repository is public on GitHub at `RunOnFlux/ssp-website` under AGPL-3.0. Every commit
must be safe to publish. The spec encodes this:

| Allowed in commits | Forbidden in commits |
|--------------------|----------------------|
| Code, types, components, route handlers | Real CMS API keys, real CMS hostnames |
| Seed articles in `/content` (publication-ready, written by SSP team) | Draft articles, embargoed content, internal briefs |
| Public author profiles | Private contact info, internal Slack handles |
| Public agent.md and agent-skills | Anything pointing to internal infrastructure |
| Test fixtures with synthetic content | Test fixtures derived from private CMS exports |

A guard script `scripts/check-public-safe.ts` runs in `prebuild` and scans `/content`,
sibling `agent.md` files, and committed env files for likely-private patterns (real API
keys, internal hostnames, `.internal.` strings, IP literals). It fails the build with a
clear diff if it finds anything.

Commit-author rule (locked): every commit on this branch is authored by `Stultus Mundi`.
**No `Co-Authored-By: Claude` trailer; no Claude Code mentions in commit bodies.** This is
a sticky preference for this repository.

## 4. Architecture

### 4.1 Project layout (after migration)

```
ssp-website/
├── src/
│   ├── app/                          # app router (replaces /pages)
│   │   ├── layout.tsx                # locale-less HTML shell
│   │   ├── globals.css
│   │   ├── [locale]/                 # all routes nest under /[locale]
│   │   │   ├── layout.tsx            # theme + i18n + chrome
│   │   │   ├── page.tsx              # home
│   │   │   ├── features/page.tsx
│   │   │   ├── guide/page.tsx
│   │   │   ├── support/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── download/page.tsx
│   │   │   ├── enterprise/page.tsx
│   │   │   ├── case-studies/flux-foundation/page.tsx
│   │   │   ├── privacy-policy/page.tsx
│   │   │   ├── terms-of-service/page.tsx
│   │   │   ├── cookie-policy/page.tsx
│   │   │   ├── checkout_success/page.tsx
│   │   │   ├── checkout_failure/page.tsx
│   │   │   ├── newsroom/             # NEW
│   │   │   │   ├── page.tsx          # listing + tag filter
│   │   │   │   ├── agent.md
│   │   │   │   ├── [slug]/page.tsx   # article
│   │   │   │   └── rss.xml/route.ts
│   │   │   ├── academy/              # NEW
│   │   │   │   ├── page.tsx          # categories + series + latest
│   │   │   │   ├── agent.md
│   │   │   │   ├── rss.xml/route.ts
│   │   │   │   ├── [category]/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── _content/index.tsx     # per-category hero copy
│   │   │   │   │   └── [slug]/page.tsx
│   │   │   │   └── series/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [slug]/page.tsx
│   │   │   ├── author/[slug]/page.tsx          # NEW
│   │   ├── not-found.tsx                       # replaces 404.js
│   │   ├── api/
│   │   │   ├── contact/route.ts                # migrated
│   │   │   ├── support/route.ts                # migrated
│   │   │   └── agent-skills/                   # NEW
│   │   │       └── skills/
│   │   │           ├── find-ssp-installer/SKILL.md
│   │   │           ├── compare-ssp-products/SKILL.md
│   │   │           ├── check-asset-support/SKILL.md
│   │   │           └── list-supported-chains/SKILL.md     # generated
│   │   ├── robots.txt/route.ts                 # replaces public/robots.txt
│   │   └── sitemap.ts                          # replaces next-sitemap
│   ├── components/
│   │   ├── header/{header,page-header,locale-switcher}.tsx
│   │   ├── footer/footer.tsx
│   │   ├── home/*.tsx                          # migrated
│   │   ├── features/*.tsx                      # migrated
│   │   ├── interactive-demo/*.tsx              # migrated
│   │   ├── newsroom/{newsroom-card,newsroom-listing}.tsx
│   │   ├── shared/{post-article,breadcrumbs,author-byline,related-academy,at-a-glance}.tsx
│   │   ├── ui/                                 # Radix primitives in SSP tokens
│   │   ├── theme-provider.tsx
│   │   └── cookie-consent.tsx
│   ├── constants/
│   │   ├── academy-categories.ts
│   │   └── supported-chains.ts                 # extracted from Footer + homepage
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── gtag.ts
│   │   ├── seo.ts
│   │   ├── seo-academy.ts
│   │   ├── cms.ts                              # CMS client + seed-fallback
│   │   ├── newsroom.ts                         # re-export shim of cms.ts
│   │   ├── academy-terms.ts                    # glossary terms
│   │   ├── glossary-linker.ts
│   │   └── agent-md/{resolve,render}.ts
│   ├── types/newsroom.ts
│   ├── i18n/{routing,request,navigation}.ts
│   ├── messages/{en,es,zh}.json
│   ├── hooks/use-theme.ts
│   └── middleware.ts                           # next-intl + Accept: text/markdown
├── content/                                    # in-repo seed articles (public-safe)
│   ├── newsroom/*.md
│   ├── academy/<category>/*.md
│   └── authors/ssp-team.json
├── scripts/
│   ├── check-agent-md-staleness.ts
│   ├── check-public-safe.ts
│   └── generate-chains-skill.ts
├── docs/
│   ├── content-authoring.md
│   ├── cms-integration.md
│   └── superpowers/specs/
├── public/
├── tsconfig.json                               # NEW
├── next.config.ts                              # upgraded from .js
└── package.json                                # +TS, react-markdown, remark-gfm,
                                                #  next-intl, Radix, gray-matter,
                                                #  rehype-pretty-code, lru-cache,
                                                #  class-variance-authority,
                                                #  tailwind-merge, tailwindcss-animate,
                                                #  vitest, tsx
```

### 4.2 Routes shipped by this PR

```
/                                     migrated
/features                             migrated
/guide                                migrated
/support                              migrated
/contact                              migrated
/download                             migrated
/enterprise                           migrated
/case-studies/flux-foundation         migrated
/privacy-policy                       migrated
/terms-of-service                     migrated
/cookie-policy                        migrated
/checkout_success                     migrated
/checkout_failure                     migrated
/<not-found>                          migrated
/newsroom                             new   listing + tag filter + load-more
/newsroom/[slug]                      new   article
/newsroom/rss.xml                     new   RSS 2.0 feed
/academy                              new   landing: categories + series + latest
/academy/[category]                   new   per-category hub
/academy/[category]/[slug]            new   academy article
/academy/series                       new   series index
/academy/series/[slug]                new   series detail
/academy/rss.xml                      new   RSS 2.0 feed
/author/[slug]                        new   author profile + posts
/api/contact                          migrated route handler
/api/support                          migrated route handler
/api/agent-skills/skills/<name>       new   serves SKILL.md content
/sitemap.xml                          new   dynamic, replaces next-sitemap
/robots.txt                           moved to route handler
```

All routes nest under `/[locale]` with `localePrefix: 'always'`. Locales: `en` (default),
`es`, `zh`.

### 4.3 Foundation migration

#### Tooling and deps

Adds (in one commit): `typescript`, `@types/node`, `@types/react`, `@types/react-dom`,
`next-intl@^3`, `@radix-ui/react-{dialog,dropdown-menu,navigation-menu,tabs,accordion,slot,toast}`,
`class-variance-authority`, `tailwind-merge`, `tailwindcss-animate`, `react-markdown`,
`remark-gfm`, `rehype-pretty-code`, `gray-matter`, `lru-cache`, `vitest`, `@vitest/ui`,
`tsx`. Drops: `next-sitemap`, `react-intersection-observer` (audit at the end — keep only
if still used after migration).

Converts `next.config.js` → `next.config.ts` wrapped with the `next-intl` plugin.

Adds `prebuild` script:
```
"prebuild": "tsx scripts/check-public-safe.ts && tsx scripts/check-agent-md-staleness.ts && tsx scripts/generate-chains-skill.ts"
```

#### Layout

`pages/_app.js` + `pages/_document.js` collapse into:

- `src/app/layout.tsx` — locale-less shell that just renders `<html lang>` and the body.
- `src/app/[locale]/layout.tsx` — wraps in `NextIntlClientProvider`, `ThemeProvider`,
  `Header`, `Footer`, `CookieConsent`. Embeds the `SoftwareApplication` JSON-LD, GA
  loader, and the `kapa.ai` widget script that currently lives in `_document.js`.

`src/middleware.ts` does two jobs:

1. `next-intl` locale negotiation/rewrite.
2. Intercept `Accept: text/markdown` and serve sibling `agent.md` instead of HTML. Gated
   by env var `AGENT_MD` (default ON; `AGENT_MD=0` disables).

#### Page-by-page migration

Each `pages/<route>.js` moves to `src/app/[locale]/<route>/page.tsx` in its own commit.
Components used by that page move from `components/` to `src/components/<group>/` and are
ported to TypeScript at the same time. Each migrated page ships a sibling `agent.md`.

API routes:
- `pages/api/contact.js` → `src/app/api/contact/route.ts` (NextResponse handler).
- `pages/api/support.js` → `src/app/api/support/route.ts` (NextResponse handler).

Both preserve the existing relay behavior (POST to
`https://relay.ssp.runonflux.io/v1/contact` and `/v1/ticket` with the same body shape).

#### Theme continuity

Existing SSP CSS tokens (the `dark-*`, `primary-*` classes used today) are preserved.
Tailwind v4 `@theme` block in `src/app/globals.css` defines them centrally so light/dark
keeps working. `tailwindcss-animate` is added for Radix.

#### Sitemap and robots

- `src/app/sitemap.ts` enumerates static pages, every newsroom slug, every academy
  `[category]/[slug]`, every series, every author, across every locale. Per-path priority
  and changefreq match the current `next-sitemap.config.js`.
- `src/app/robots.txt/route.ts` serves the current SSP policy (open to AI crawlers — same
  as the existing `public/robots.txt`).
- `next-sitemap` and `public/robots.txt` are deleted.

### 4.4 Content layer

#### Type model

`src/types/newsroom.ts` mirrors the Zelcore `NewsroomPost` shape exactly so the SSP
dashboard CMS team has a known target. Single shape covers both newsroom and academy via
the `section` discriminator. Includes: `slug, title, description, content (markdown),
image, imageAlt, imageSquare, imageStory, date, modifiedDate, author, authorId, readTime,
tags, section, category, difficulty, seriesSlug, seriesOrder, featured, pinned, seoTitle,
seoDescription, canonicalUrl, noindex, relatedSlugs, slugHistory`.

Plus: `Author`, `SeriesSummary`, `SeriesDetail`, `CategoryWithCount`.

#### CMS client

`src/lib/cms.ts` exports the same function surface as Zelcore so the SSP dashboard CMS
implementer has a known client to satisfy:

```
getAllPosts(), getPostBySlug(slug), getAllSlugs(), getAllTags()
getAcademyPosts(filters), getAcademyPostBySlug(slug), getAcademySlugs()
getCategories(), getAllSeries(), getSeriesBySlug(slug)
getRelatedPosts(post, limit)
getAuthorBySlug(slug), getPostsByAuthor(authorId)
```

Endpoints (auth via `x-api-key` header):

```
GET /api/v1/posts?section=…&category=…&series=…&featured=…&limit=…
GET /api/v1/posts/:slug
GET /api/v1/categories
GET /api/v1/series
GET /api/v1/series/:slug
GET /api/v1/authors/:slug
GET /api/v1/tags
```

Env (added to `.env.example`, never committed with values):
```
SSP_CMS_URL=https://cms.sspwallet.io      # placeholder; final URL set by dashboard team
SSP_CMS_API_KEY=
NEXT_PUBLIC_AGENT_MD=1
```

#### Seed-fallback loader

```ts
async function load<T>(seedPath: string, fetcher: () => Promise<T>): Promise<T> {
  if (!process.env.SSP_CMS_URL || !process.env.SSP_CMS_API_KEY) {
    return loadFromSeed<T>(seedPath);
  }
  try {
    return await fetcher();
  } catch {
    return loadFromSeed<T>(seedPath);
  }
}
```

`loadFromSeed` parses Markdown frontmatter (`gray-matter`) from `/content/newsroom/*.md`
and `/content/academy/<category>/*.md`, returns typed `NewsroomPost[]`. LRU cache (256
entries, 60s TTL) sits in front of both code paths.

When the CMS launches, the operator sets `SSP_CMS_URL` + `SSP_CMS_API_KEY` and content
flips from seed to CMS with no code change. Seeds remain as a hard fallback for outages.

Caching: CMS responses use `next: { revalidate: 60 }` for listings, `300` for individual
posts. RSS responses use `Cache-Control: s-maxage=3600, stale-while-revalidate=60`.

#### Seed content shipped in this PR

All seed articles must be publication-ready. Drafted by the assistant, **reviewed by the
user before commit**:

```
content/
├── authors/ssp-team.json
├── newsroom/
│   ├── welcome-to-the-ssp-newsroom.md
│   ├── why-2-of-2-multisig-matters.md
│   └── ssp-roadmap-2026.md
└── academy/
    ├── multisig/what-is-2-of-2-multisig.md
    ├── getting-started/setting-up-your-first-ssp-wallet.md
    ├── security/seed-phrase-best-practices.md
    ├── how-to/sending-bitcoin-with-ssp.md
    ├── coin-guides/bitcoin-with-ssp-explained.md
    ├── defi/what-is-account-abstraction-erc-4337.md
    └── news-explained/why-self-custody-matters-now.md
```

Three newsroom posts plus one article per academy category, so every category page has at
least one article and the `noindex` empty-hub guard does not trigger.

#### Categories (SSP-flavored)

`src/constants/academy-categories.ts`:

```
multisig          Multisig Explained
getting-started   Crypto Basics
security          Security & Self-Custody
how-to            How-To Guides
coin-guides       Coin & Chain Guides
defi              DeFi & Account Abstraction
news-explained    News & Industry Analysis
```

#### Authors

Single seed author `ssp-team` with name "SSP Team", bio, avatar
(`public/images/authors/ssp-team.png`), Twitter `@sspwallet_io`, GitHub `RunOnFlux`,
website `https://sspwallet.io`. Renders at `/author/ssp-team` with all posts they wrote.

#### Glossary terms

`src/lib/academy-terms.ts` ships 15-20 terms relevant to SSP: multisig, BIP48, ERC-4337,
account abstraction, seed phrase, hardware wallet, hot wallet, cold wallet, self-custody,
gas, mempool, finality, signer, threshold, etc. Each term has name, definition, and
anchor URL (e.g. `/academy/security/seed-phrase-best-practices#seed-phrase`).

`src/lib/glossary-linker.ts` auto-links the first occurrence of each term per article,
skipping code blocks and self-references.

### 4.5 Newsroom + Academy components

#### Re-skinning rule

Every Zelcore color literal (`#080D20`, `#121930`, `#1B63EF`, `#3786FA`, `#CDD5E0`,
`#7C93AD`, `#232D51`) is replaced with SSP design tokens defined once in
`src/app/globals.css`. Mapping:

```
#080D20  → bg-dark-950          (deepest dark surface)
#121930  → bg-dark-800/card     (card surface)
#232D51  → border-dark-700      (card border)
#1B63EF  → bg-primary-600       (active accent — but per SSP brand, primary is amber)
#3786FA  → text-primary-500     (link/badge accent)
#CDD5E0  → text-gray-300        (body text on dark)
#7C93AD  → text-gray-400        (muted)
```

All newsroom/academy components must work in both light and dark mode (Zelcore is
dark-only; SSP supports both).

#### Components built

| Component | Type | Notes |
|-----------|------|-------|
| `header/page-header.tsx` | Server | Hero band on listing pages. Tokenized; replaces Zelcore's `lines-header.svg` background with a Tailwind gradient. |
| `newsroom/newsroom-card.tsx` | Server | Article card. `next/image fill` + responsive sizes. Read-time badge in primary accent. |
| `newsroom/newsroom-listing.tsx` | Client (`'use client'`) | Tag filter + Load-more pagination (6 per page). |
| `shared/post-article.tsx` | Server shell + client island | Markdown body via `react-markdown` + `remark-gfm`. ToC sidebar from H2 extraction. Share row (Twitter/Facebook/Telegram/Reddit/Copy) is the client island. |
| `shared/breadcrumbs.tsx` | Server | Tokenized breadcrumb trail. |
| `shared/author-byline.tsx` | Server | Avatar + name + title + bio + social icons; links to `/author/<slug>`. |
| `shared/related-academy.tsx` | Server | 3-card "Related articles" grid. |
| `shared/at-a-glance.tsx` | Server | "Read time / Difficulty / Series" pill row at the top of academy articles. New for SSP. |
| `ui/*` | Mixed | Radix primitives wired with SSP tokens via `class-variance-authority`. Used in this PR: `dropdown-menu` (locale switcher, mobile nav menu), `navigation-menu` (desktop "More" overflow), `slot` (utility for CVA component composition), `accordion` (existing `/support` FAQ migration). `dialog`, `tabs`, `toast` are installed for follow-up PRs but unused at v1. |

#### Markdown rendering

`react-markdown` configured with:
- `remark-gfm` (tables, strikethrough, task lists).
- Custom renderers: `h2/h3` get id anchors (slugified); `img` → `next/image`; external `a`
  → `target=_blank rel=noopener`; internal `a` → `next/link`; inline + block code via
  `rehype-pretty-code` with SSP-tokenized syntax highlighting.
- Raw HTML in markdown is sanitized (`react-markdown` default).

#### Header and Footer updates

Header navigation expands from 6 to 8 items:

```
Home | Enterprise | Features | Newsroom | Academy | Guide | Support | Contact
```

At mid widths, `Enterprise` and `Contact` collapse into a "More" Radix `navigation-menu`
dropdown to keep the bar readable. Mobile nav already handles overflow.

Footer adds a new column **Learn**:
```
Newsroom
Academy
Multisig Explained        → /academy/multisig
Security                  → /academy/security
Getting Started           → /academy/getting-started
RSS Feed                  → /newsroom/rss.xml
```

Locale switcher (`components/header/locale-switcher.tsx`) — Radix `dropdown-menu`,
locale-aware via next-intl helpers.

### 4.6 SEO

#### Library

`src/lib/seo.ts` exports a single canonical `createMetadata({ title, description, path,
ogImage?, type?, articleMeta?, noindex?, canonical? })` returning Next.js `Metadata`. Pulls
defaults (`siteUrl`, `siteName`, default OG image, Twitter handle) from a single config
block.

JSON-LD builders:
- `createBlogPostingJsonLd(post)`
- `buildAcademyArticleJsonLd(post, category, author)` — adds `learningResourceType`,
  `educationalLevel`, `articleSection`.
- `createBreadcrumbJsonLd(items)` / `buildAcademyBreadcrumbJsonLd(items)`
- `createCollectionPageJsonLd(items)` for listings
- `createSoftwareApplicationJsonLd()` — the existing SSP `SoftwareApplication` JSON-LD
  from `_document.js`, now centralised. Renders in the root layout.

#### What each route emits

| Route | JSON-LD |
|-------|---------|
| `/` and other static pages | SoftwareApplication (root layout) |
| `/newsroom` | BreadcrumbList + CollectionPage |
| `/newsroom/[slug]` | BlogPosting + BreadcrumbList |
| `/academy` | BreadcrumbList |
| `/academy/[category]` | BreadcrumbList |
| `/academy/[category]/[slug]` | BlogPosting (academy variant) + BreadcrumbList |
| `/academy/series/[slug]` | BreadcrumbList |
| `/author/[slug]` | BreadcrumbList |

#### slugHistory and redirects

When a post's `slug` changes upstream, the CMS returns the canonical post under the new
slug while listing the old slug in `slugHistory`. The article route handlers detect this
and emit `permanentRedirect` (301).

When a post migrates from newsroom to academy, `/newsroom/<slug>` 301s to
`/academy/<category>/<slug>`.

#### Empty-hub noindex

`/academy/<category>` pages where `posts.length === 0` set `noindex: true` so Google does
not rank empty hubs.

### 4.7 Agent surface

#### `agent.md` system

Every page route ships a sibling `agent.md` (frontmatter + key facts + what-you-can-do +
related pages, max 2KB).

`src/middleware.ts` intercepts `Accept: text/markdown` and serves the sibling `agent.md`
instead of HTML. Gated by env var `AGENT_MD` (default ON).

Static `agent.md` files committed in this PR:
- One per existing static route (home, features, guide, support, contact, download,
  enterprise, case study, privacy/terms/cookie).
- One for `/newsroom`, `/academy`.

Dynamic synthesis for `/newsroom/[slug]`, `/academy/[category]/[slug]`,
`/academy/series/[slug]`, `/author/[slug]` — `src/lib/agent-md/resolve.ts` pulls the post
or author via `cms.ts` and synthesises markdown (frontmatter + body + related links). LRU
cached.

`scripts/check-agent-md-staleness.ts` runs in `prebuild`. Fails if a `page.tsx` is touched
without its sibling `agent.md` being updated in the same commit. Escape hatch:
`[agent-md-skip]` in commit message + one-line reason.

#### Agent Skills

`src/app/api/agent-skills/skills/`:

Manual:
- `find-ssp-installer/SKILL.md` — guides agents to the right download.
- `compare-ssp-products/SKILL.md` — Browser Extension + SSP Key + Enterprise.
- `check-asset-support/SKILL.md` — supported chains/assets.

Generated:
- `list-supported-chains/SKILL.md` — regenerated by
  `scripts/generate-chains-skill.ts` from `src/constants/supported-chains.ts` (single
  source of truth, refactored out of the existing `Footer.js` chain array and the
  homepage `SupportedChains` component).

#### RSS

Two route handlers: `/newsroom/rss.xml/route.ts`, `/academy/rss.xml/route.ts`. Both read
from `cms.ts` and render RSS 2.0 XML with `Content-Type: application/rss+xml; charset=utf-8`
and `Cache-Control: s-maxage=3600`.

### 4.8 i18n (next-intl)

- Locales: `en` (default), `es`, `zh`. URL pattern `/<locale>/...` with `localePrefix:
  'always'` for SEO clarity.
- `src/i18n/routing.ts` — locale list + default.
- `src/i18n/request.ts` — next-intl loader hook.
- `src/i18n/navigation.ts` — re-exports locale-aware `Link`, `useRouter`, `redirect`.
- `src/messages/en.json` is the source of truth. `es.json` and `zh.json` are seeded with
  English copy and TODO markers. Real translations come in a follow-up PR.
- For launch, `es` and `zh` URLs render English copy with accurate `<html lang>`. The
  routes work; only the copy is not yet localised.
- All seed articles are English-only. The CMS contract supports `locale` filtering but
  v1 ignores it.

## 5. Sequencing

The branch lands on `feat/newsroom-academy-app-router-migration` (off `master`) in this
order, so every commit builds clean and the test suite stays green:

1. Tooling and deps (tsconfig, install all new deps, convert `next.config.js` →
   `next.config.ts`, add scripts).
2. Locale shell and middleware: empty `src/app/[locale]/layout.tsx`, `src/middleware.ts`,
   `src/i18n/*`, `src/messages/{en,es,zh}.json` with placeholder copy.
3. Theme tokens: port `globals.css` into `src/app/globals.css` with Tailwind v4 `@theme`
   block.
4. Foundation components migrated to TS one-by-one: theme-provider, cookie-consent,
   header, footer, logo, hooks/use-theme.
5. Root layout wired with theme + i18n + GA + kapa.ai + cookie consent + JSON-LD.
6. Migrate existing pages one at a time (each with its sibling `agent.md`): home,
   features, guide, support, contact, download, enterprise, case study, legal, checkout,
   not-found.
7. Migrate API routes: `/api/contact`, `/api/support`.
8. Sitemap + robots: `app/sitemap.ts`, `app/robots.txt/route.ts`. Remove `next-sitemap`
   dep, `public/robots.txt`, `next-sitemap.config.js`.
9. Delete `pages/` and `components/`. Codebase is now fully app-router.
10. **Foundation acceptance gate** — full Lighthouse run + visual diff against
    production. Block any newsroom/academy work until this passes.
11. Content layer: types, constants, lib (seo, seo-academy, cms, glossary-linker,
    academy-terms, agent-md). Unit tests for each.
12. Newsroom routes + components: page-header, newsroom-card, newsroom-listing,
    post-article, breadcrumbs, author-byline, related-academy, at-a-glance. Routes
    `/newsroom`, `/newsroom/[slug]`, `/newsroom/rss.xml`. Sibling `agent.md`.
13. Academy routes: `/academy`, `/academy/[category]` (+ `_content/index.tsx` per-category
    hero copy), `/academy/[category]/[slug]`, `/academy/series`, `/academy/series/[slug]`,
    `/academy/rss.xml`. Sibling `agent.md` where static.
14. Author route: `/author/[slug]`.
15. Seed content: 3 newsroom + 7 academy articles + `ssp-team.json` + author avatar +
    glossary terms. Drafted, **reviewed by user before commit**.
16. Header + Footer updates: nav items, Learn footer column, locale switcher.
17. Agent skills: manual SKILL.md files + generator script. Wire `prebuild`.
18. Docs: `README.md` rewrite, new `CLAUDE.md`, `docs/content-authoring.md`,
    `docs/cms-integration.md`, `.env.example`.
19. Final pass: visual review of every newsroom/academy page in light + dark, mobile +
    desktop. Run `npm run check-all`, `tsc --noEmit`, `npm run test`, `npm run build`.

## 6. Verification gates

Before claiming "done":

- `npm run build` succeeds with no warnings.
- `npx tsc --noEmit` passes.
- `npm run lint` passes.
- `npm run test` passes — unit tests for `cms.ts` seed-fallback (CMS unset, CMS errors,
  CMS partial response), `glossary-linker.ts` (first-occurrence rule, code-block skip,
  self-reference skip), `seo.ts` `createMetadata` (canonical URL, OG absolute URL, noindex
  flag), `extractHeadings` (H2 detection, slug, special chars), `agent-md/resolve.ts`
  (URL → file path, dynamic synthesis, LRU hit).
- `npm run check:agent-md-staleness` passes.
- `npm run check:public-safe` passes.
- All 12 currently-shipping pages render visually identical to production.
- Newsroom listing and every seed article render in light + dark mode.
- Academy landing, every category hub, every seed academy article render in light + dark
  mode.
- Series landing and at least one series detail page render.
- `/author/ssp-team` page renders with the seed author's posts.
- Both RSS feeds validate against an RSS validator.
- `sitemap.xml` lists every newsroom slug, every academy `[category]/[slug]`, every
  series, every author, across every locale.
- `curl -H "Accept: text/markdown" http://localhost:3000/newsroom/<slug>` returns the
  synthesised markdown for the dynamic case.
- Lighthouse SEO ≥ 95 on `/newsroom`, `/academy`, `/newsroom/<slug>`,
  `/academy/<category>/<slug>` in dev.
- POST to `/api/contact` and `/api/support` still hit the SSP relay (smoke test against
  staging — no real tickets created).
- Locale switcher round-trips correctly between `en`/`es`/`zh`.
- Glossary auto-linking turns at least one occurrence per article.

### TDD coverage

Per superpowers TDD discipline, these get red-then-green tests:
- `cms.ts` seed-fallback behaviour (3 cases above).
- `glossary-linker.ts` (3 cases above).
- `seo.ts` `createMetadata` (3 cases above).
- `extractHeadings` (4 cases above).
- `agent-md/resolve.ts` (3 cases above).

Pages, components, and visual styling are verified manually plus Lighthouse — UI
correctness cannot be unit-tested in isolation.

## 7. Rollback

- The branch is preserved on origin; revert is one PR.
- The seed-fallback in `cms.ts` keeps the site rendering content even if the eventual
  CMS dashboard launches with bugs.
- `AGENT_MD=0` env var disables the markdown serving path without redeploy.

## 8. Documentation updates

This PR updates or creates:

- `README.md` — full rewrite reflecting new structure (`src/`, app router, TS), new
  scripts (`prebuild`, `test`, `check:agent-md-staleness`, `check:public-safe`,
  `agent-skills:generate`), content authoring quickstart, CMS integration link.
- `CLAUDE.md` — new, SSP-flavored agent guidance file (mirrors Zelcore's
  `CLAUDE.md` shape: agent surface, paired-artifact rules, pattern shortlist, what-not-to-edit-without-thinking).
- `docs/content-authoring.md` — how to add a new article to `/content` (frontmatter
  schema, image conventions, tag/category rules, review checklist).
- `docs/cms-integration.md` — how to point the site at the SSP dashboard CMS (env vars,
  expected API shape, error handling, fallback behaviour).
- `.env.example` — adds `SSP_CMS_URL`, `SSP_CMS_API_KEY`, `NEXT_PUBLIC_AGENT_MD`.
- `.github/` — keep existing CI; update if `prebuild` fails on missing TS deps.

## 9. PR shape

- Single PR to `master` from `feat/newsroom-academy-app-router-migration`.
- ~80-100 atomic commits; ~200 files changed (mix of move + new + delete).
- Commit author: `Stultus Mundi`. No `Co-Authored-By` trailer.
- Each commit builds clean and passes type-check on its own.

## 10. Open questions for plan phase

These are deferred from brainstorming to the implementation plan, where they can be
answered concretely:

- Exact npm version pins for the new dependencies (Radix major versions, next-intl major
  version compatible with Next.js 16).
- Whether to enable Turbopack (`next dev --turbopack` like Zelcore uses) or stay on
  Webpack.
- Whether `react-intersection-observer` survives the migration audit (currently used in
  homepage components).
- Final naming for the four "More" overflow items in the desktop header on mid widths.
