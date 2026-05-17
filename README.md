# SSP Wallet — Website

[![CI](https://github.com/RunOnFlux/ssp-website/actions/workflows/ci.yml/badge.svg)](https://github.com/RunOnFlux/ssp-website/actions/workflows/ci.yml)

Marketing site, newsroom, and academy for [SSP Wallet](https://sspwallet.io) — the open-source
2-of-2 BIP48 multisignature wallet for Bitcoin, Ethereum, and 10+ other blockchains.

## Tech stack

| Layer             | Library                                                             |
| ----------------- | ------------------------------------------------------------------- |
| Framework         | Next.js 16 (App Router) + React 19 + TypeScript 5                   |
| Styling           | Tailwind v4 with `@theme` tokens and `@tailwindcss/typography`      |
| i18n              | next-intl v4 (en / es / zh, `localePrefix: 'always'`)               |
| Tests             | Vitest 4 + happy-dom                                                |
| UI primitives     | Radix UI (accordion, dialog, dropdown-menu, navigation-menu, toast) |
| Article rendering | react-markdown + remark-gfm + rehype-pretty-code                    |
| CMS layer         | gray-matter (seed Markdown) + lru-cache, optional remote CMS        |
| Animations        | framer-motion                                                       |

## Project layout

```
ssp-website/
├── src/
│   ├── app/
│   │   ├── [locale]/          # All page routes (see Routes below)
│   │   ├── api/               # contact, support, agent-skills handlers
│   │   ├── robots.txt/        # robots.txt route handler
│   │   └── sitemap.ts         # dynamic sitemap
│   ├── components/
│   │   ├── header/            # site header + locale switcher
│   │   ├── footer/            # site footer
│   │   ├── home/              # homepage sections
│   │   ├── newsroom/          # newsroom + academy UI
│   │   └── shared/            # cards, prose, breadcrumbs, etc.
│   ├── lib/
│   │   ├── cms.ts             # public CMS API (LRU-cached, seed fallback)
│   │   ├── cms/               # cms-fetch + seed-loader internals
│   │   ├── agent-md/          # agent.md render + resolve helpers
│   │   ├── glossary-linker.ts # auto-link academy terms
│   │   └── seo.ts             # JSON-LD + meta helpers
│   ├── constants/
│   │   ├── supported-chains.ts
│   │   └── academy-categories.ts
│   ├── types/newsroom.ts      # NewsroomPost, Author, SeriesDetail, …
│   ├── messages/              # en.json (source), es.json, zh.json
│   └── middleware.ts          # locale routing + Accept: text/markdown
├── content/
│   ├── newsroom/              # seed Markdown articles
│   ├── academy/<category>/    # seed Markdown articles by category
│   └── authors/               # author profile JSON files
├── scripts/
│   ├── check-public-safe.ts   # prebuild: blocks leaked keys / hostnames
│   ├── check-agent-md-staleness.ts  # prebuild: blocks stale agent.md
│   └── generate-chains-skill.ts     # prebuild: regenerates SKILL.md
└── docs/
    ├── content-authoring.md
    └── cms-integration.md
```

## Available scripts

| Script                     | What it does                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `dev`                      | `next dev`                                                                                        |
| `build`                    | runs the prebuild guards then `next build`                                                        |
| `start`                    | `next start`                                                                                      |
| `lint`                     | `eslint .`                                                                                        |
| `test`                     | `vitest run`                                                                                      |
| `type-check`               | `tsc --noEmit`                                                                                    |
| `format` / `format:check`  | Prettier write / check                                                                            |
| `check:public-safe`        | refuses to continue if `/content`, `/src/app`, or `.env.example` contain internal-looking strings |
| `check:agent-md-staleness` | refuses to continue if a `page.tsx` changed without its sibling `agent.md`                        |
| `agent-skills:generate`    | regenerates `list-supported-chains/SKILL.md` from `src/constants/supported-chains.ts`             |
| `check-all`                | type-check + lint + format:check + test                                                           |

## Getting started

```bash
git clone https://github.com/RunOnFlux/ssp-website.git
cd ssp-website
npm install
npm run dev       # http://localhost:3000
```

Copy `.env.example` to `.env.local` and fill in the variables you need. Everything works without a CMS configured — the site falls back to the seed Markdown in `/content/`.

## Content authoring

See [`docs/content-authoring.md`](docs/content-authoring.md). The short version: drop a Markdown file with the right frontmatter under `content/newsroom/` or `content/academy/<category>/`.

## CMS integration

Set `SSP_CMS_URL` and `SSP_CMS_API_KEY` to connect a remote CMS. Without them the site reads from `/content/`. See [`docs/cms-integration.md`](docs/cms-integration.md).

## Routes

| Section   | Routes                                                                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marketing | `/`, `/features`, `/enterprise`, `/case-studies/flux-foundation`, `/guide`, `/support`, `/contact`, `/download`, `/privacy-policy`, `/terms-of-service`, `/cookie-policy`, `/checkout_success`, `/checkout_failure` |
| Newsroom  | `/newsroom`, `/newsroom/[slug]`, `/newsroom/rss.xml`                                                                                                                                                                |
| Academy   | `/academy`, `/academy/[category]`, `/academy/[category]/[slug]`, `/academy/series`, `/academy/series/[slug]`, `/academy/rss.xml`                                                                                    |
| Author    | `/author/[slug]`                                                                                                                                                                                                    |
| API       | `POST /api/contact`, `POST /api/support`, `GET /api/agent-skills/skills/[name]`                                                                                                                                     |
| SEO       | `/sitemap.xml`, `/robots.txt`                                                                                                                                                                                       |

All routes live under `src/app/[locale]/` and are served at `/en/`, `/es/`, and `/zh/` prefixes.

## i18n

Locales: `en`, `es`, `zh`. English (`src/messages/en.json`) is the source of truth. Other locales contain `__TODO_TRANSLATE__` placeholders until translators land. Import `Link`, `useRouter`, and `usePathname` from `@/i18n/navigation` — not from `next/link` or `next/navigation` directly.

## Agent surface

Every static route has a sibling `agent.md` file served when the request carries `Accept: text/markdown`. Dynamic routes (newsroom articles, academy articles, author profiles) synthesise Markdown from the same data the HTML page uses. `/api/agent-skills/skills/[name]` serves machine-readable SKILL.md cards.

## Supported chains

12 chains as of this commit. The authoritative list is generated from `src/constants/supported-chains.ts` into `src/app/api/agent-skills/skills/list-supported-chains/SKILL.md` on every build.

## Open-source rules

This repository is public. The `prebuild` step refuses to build if `/content` or `src/app/**/agent.md` contain internal hostnames, leaked keys, IP addresses (outside the allowlist), or other patterns flagged by `scripts/check-public-safe.ts`. Never commit sensitive data.

## Production status

The site is live at [sspwallet.io](https://sspwallet.io). All marketing, newsroom, academy, and author routes are functional. Contact and support forms integrate with the SSP relay service. Forms work independently of the CMS configuration.

## License

Licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://www.gnu.org/licenses/agpl-3.0.en.html) — see the [LICENSE](LICENSE) file for details. Any modifications to this software, including those deployed as a web service, must be made available under the same license.

---

Built with ❤️ by the [RunOnFlux](https://github.com/RunOnFlux) team
