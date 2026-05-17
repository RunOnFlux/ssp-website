# Content authoring guide

How to add a newsroom article, an academy article, or an author profile to the SSP website.

## Where articles live

| Type             | Path                                   |
| ---------------- | -------------------------------------- |
| Newsroom article | `content/newsroom/<slug>.md`           |
| Academy article  | `content/academy/<category>/<slug>.md` |
| Author profile   | `content/authors/<slug>.json`          |

The `<category>` segment for academy articles must be one of the seven fixed slugs below. The `<slug>` becomes the URL path segment for that article.

Test fixtures use a leading underscore (e.g. `_test-fixture.md`) and are excluded from production by default.

## Article frontmatter schema

All fields are read from the YAML frontmatter block at the top of the Markdown file. Fields marked **required** must be present; optional fields default as shown.

| Field            | Required | Type     | Default              | Notes                                                                                       |
| ---------------- | -------- | -------- | -------------------- | ------------------------------------------------------------------------------------------- |
| `slug`           | no       | string   | filename minus `.md` | Explicit slugs are preferred — they decouple the URL from the filename.                     |
| `title`          | yes      | string   | —                    | Keep under 60 characters so it does not truncate in search results.                         |
| `description`    | yes      | string   | —                    | Aim for 120–160 characters (Google-recommended meta description range).                     |
| `date`           | yes      | string   | today                | ISO 8601 date, e.g. `'2025-06-01'`. Used for sorting and `datePublished` JSON-LD.           |
| `modifiedDate`   | no       | string   | `null`               | ISO 8601 date. Used for `dateModified` JSON-LD.                                             |
| `author`         | yes      | string   | `'SSP Team'`         | Display name.                                                                               |
| `authorId`       | no       | string   | `null`               | Slug of the author record in `content/authors/`. Links to the author profile page.          |
| `readTime`       | no       | number   | `5`                  | Estimated read time in minutes.                                                             |
| `image`          | yes      | string   | `/og-image.png`      | Path to the 16:9 hero image. Used in `og:image` and the article hero.                       |
| `imageAlt`       | yes      | string   | `''`                 | Descriptive alt text for the hero image. Mandatory for accessibility.                       |
| `imageSquare`    | no       | string   | `null`               | Path to a 1:1 square image. Used in card grids. Falls back to `image`.                      |
| `imageSquareAlt` | no       | string   | `null`               | Alt text for the square image. Required if `imageSquare` is set.                            |
| `imageStory`     | no       | string   | `null`               | Path to a 9:16 story image. Used for social-story sharing.                                  |
| `imageStoryAlt`  | no       | string   | `null`               | Alt text for the story image. Required if `imageStory` is set.                              |
| `tags`           | no       | string[] | `[]`                 | Free-form tag strings. Drive the `/newsroom` filter UI and `keywords` JSON-LD.              |
| `section`        | no       | string   | inferred             | `'newsroom'` or `'academy'`. Inferred from the directory; omit unless overriding.           |
| `category`       | no       | string   | `null`               | Academy only. Must be a valid `AcademyCategory` slug (see below). Inferred from directory.  |
| `difficulty`     | no       | string   | `null`               | Academy only. `'beginner'`, `'intermediate'`, or `'advanced'`.                              |
| `seriesSlug`     | no       | string   | `null`               | Academy only. Links this article to a series record.                                        |
| `seriesOrder`    | no       | number   | `null`               | Position within the series (1-based).                                                       |
| `featured`       | no       | boolean  | `false`              | Surfaces the article in "featured" slots on listing pages.                                  |
| `pinned`         | no       | boolean  | `false`              | Pins the article to the top of listing pages.                                               |
| `seoTitle`       | no       | string   | `null`               | Overrides the `<title>` tag. Defaults to `title`.                                           |
| `seoDescription` | no       | string   | `null`               | Overrides the meta description. Defaults to `description`.                                  |
| `canonicalUrl`   | no       | string   | `null`               | Explicit canonical URL. Use only for syndicated content with a different source of truth.   |
| `noindex`        | no       | boolean  | `false`              | Adds `<meta name="robots" content="noindex">`. Use only for drafts or internal previews.    |
| `relatedSlugs`   | no       | string[] | `[]`                 | Explicit list of related article slugs. Falls back to same-category articles.               |
| `slugHistory`    | no       | string[] | `[]`                 | Previous slugs for this article. The article route emits `permanentRedirect` for old slugs. |

### Minimal newsroom example

```markdown
---
title: SSP Wallet adds Base network support
description: SSP Wallet now supports transactions on the Base L2 network, joining the existing EVM chains.
slug: ssp-adds-base-network-support
date: '2025-06-01'
author: SSP Team
authorId: ssp-team
readTime: 3
image: /images/news/base-support.webp
imageAlt: Base network logo next to SSP Wallet logo
tags: [base, evm, new-feature]
section: newsroom
---

Article body in Markdown here.
```

### Minimal academy example

```markdown
---
title: What is 2-of-2 multisig?
description: A clear explanation of how two-key multisig works and why it is stronger than single-sig wallets.
slug: what-is-2-of-2-multisig
date: '2025-05-01'
author: SSP Team
readTime: 6
image: /images/academy/multisig-explainer.webp
imageAlt: Diagram showing two keys required to sign a transaction
tags: [multisig, beginner, bitcoin]
section: academy
category: multisig
difficulty: beginner
---

Article body in Markdown here.
```

## Academy categories

The seven categories are fixed. Use the slug exactly as listed:

| Slug              | Title                      |
| ----------------- | -------------------------- |
| `multisig`        | Multisig Explained         |
| `getting-started` | Crypto Basics              |
| `security`        | Security & Self-Custody    |
| `how-to`          | How-To Guides              |
| `coin-guides`     | Coin & Chain Guides        |
| `defi`            | DeFi & Account Abstraction |
| `news-explained`  | News & Industry Analysis   |

The authoritative definitions live in `src/constants/academy-categories.ts`.

## Image conventions

- **Hero (required):** 16:9 aspect ratio, at least 1200 px wide. Used in `og:image` and the article hero banner.
- **Square (optional):** 1:1, at least 600 px. Used in card grids. Falls back to the hero when absent.
- **Story (optional):** 9:16. Used for social-story sharing surfaces.
- **Format:** WebP or AVIF preferred for new uploads. JPG and PNG are accepted.
- **Alt text is mandatory** for every image field you set — `imageAlt`, `imageSquareAlt`, `imageStoryAlt`. Write a genuine description, not a generic placeholder like "article image".

## Glossary auto-linking

Academy articles get glossary terms auto-linked. The full term list lives in `src/lib/academy-terms.ts`. To add a term, edit that file.

The linker follows these rules:

- Skips fenced code blocks, inline code, and existing Markdown links — so it never double-links.
- Skips self-references (an article about multisig will not auto-link "multisig" to itself).
- Links the longest matching term first, so "2-of-2 multisig" wins over "multisig" when both apply.
- Links only the first occurrence of each term per article.

## Author profile schema

Create `content/authors/<slug>.json` with this shape (all fields except `slug` and `name` are optional):

```json
{
  "slug": "satoshi-nakamoto",
  "name": "Satoshi Nakamoto",
  "title": "Bitcoin Inventor",
  "bio": "Author of the Bitcoin whitepaper and the original Bitcoin software.",
  "avatar": "/images/authors/satoshi.webp",
  "twitterUrl": null,
  "linkedinUrl": null,
  "githubUrl": null,
  "websiteUrl": null
}
```

The `slug` must match the filename (minus `.json`) and the `authorId` field on any article that links to this profile.

## Publication-safe rule

Every file in `/content` is published as-is — the repository is public on GitHub. Do not commit:

- Internal hostnames or URLs (anything matching `*.internal.*`)
- API keys, AWS keys, or private key blobs
- Embargoed roadmap items or unreleased product names
- Unverified statistics or forward-looking claims that are not sourced

`scripts/check-public-safe.ts` runs on every `npm run build` and blocks the build if it finds these patterns. Run `npm run check:public-safe` locally before pushing.

## Review checklist before merging an article

- [ ] Title is clear and under 60 characters
- [ ] Description is 120–160 characters
- [ ] No embargoed claims, no unverified statistics
- [ ] All external links resolve
- [ ] If the article body references a glossary anchor (e.g. `#bip48`), the target article must contain a matching `## BIP48` heading
- [ ] At least one `##` heading exists so the table-of-contents sidebar renders
- [ ] `imageAlt` is descriptive, not generic
- [ ] `check-public-safe` passes locally (`npm run check:public-safe`)
