# Glossary + Learn Nav Dropdown — Design Spec

**Date:** 2026-05-13
**Scope:** Sub-project 1 of two. Ship a public, navigable, searchable glossary at `/glossary` with 2,000+ entries, and restructure the desktop and mobile header so the existing "Academy" link becomes a "Learn ▾" dropdown that groups Academy, Series, and Glossary. Website-only change — no CMS or admin modifications.
**Repo:** `ssp-website`
**Related:** Sub-project 2 (glossary auto-linker + intro-article fix + authoring of `Setup guide` and `Multisig deep-dive` articles) opens its own brainstorm immediately after this ships. The Zelcore prior art lives at `zelcore-website/src/{constants/cmc-glossary.json, app/learn/glossary, components/learn/glossary.tsx}` and the matching auto-linker spec at `zelcore-dashboard/docs/superpowers/specs/2026-04-17-glossary-auto-linker-design.md`.

## Goal

Every SSP visitor has a single place to look up unfamiliar crypto and SSP-specific terminology, and a single, predictable header surface ("Learn ▾") that points them at all the educational content the site has. After this work ships:

- `/glossary` lists 2,000+ entries grouped A–Z, with client-side search and a letter-index jump bar.
- `/glossary/<slug>` is a focused per-term page suitable to deep-link from anywhere (and ready to be the destination of the auto-linker in sub-project 2).
- The desktop header trades the flat "Academy" link for a "Learn ▾" dropdown containing Academy, Series, and Glossary, built on the Radix `NavigationMenu` primitive already in the project's dependencies.
- The mobile menu has the same three items grouped under a "Learn" subsection heading.
- All 14 Wave 1 locales get translated chrome (page title, search placeholder, "Back to glossary", attribution footer, dropdown labels and descriptions). Glossary content itself stays English by design.

## Non-goals

- Glossary auto-linker — defers to sub-project 2. The destination URL shape (`/glossary/<slug>`) is locked in this spec so the linker has a stable target.
- Fixing the intro article's stub internal links — defers to sub-project 2.
- Authoring the missing "Setup guide" and "Multisig deep-dive" academy articles — defers to sub-project 2.
- CMS glossary entity / dashboard editing — JSON files in the website repo are the source of truth. If editorial workload ever justifies a CMS entity, that's a future migration with a `source: 'cms'` layer added to the merger.
- Full translation of glossary content (title + excerpt) — the chrome is translated, the content stays English. Matches the actual UX of Ledger Academy, Trezor Wiki, Binance Academy, and CMC itself, because crypto terminology is largely proper-noun jargon that doesn't translate cleanly. A future phase can revisit a curated 200–500-term translation if traffic warrants.
- Tooltip / popover on hover — terms are clickable links to their detail page, not inline tooltips. Inline tooltips become an option if/when the auto-linker ships.
- Translation of term titles in URLs — URLs are slug-only and shared across locales (`/[locale]/glossary/seed-phrase`, not `/es/glosario/frase-semilla`). Simpler routing; matches how Academy slugs already work.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Data sources | CMC (~1,270, copied from Zelcore) + SSP-curated (~100, hand-written) + web-sourced (~700+, one-shot script) | Reach 2,000+ entries; SSP-specific gaps that CMC doesn't cover; permissive-license web supplements |
| Translation scope | Chrome only; content English | 2,000 × 14 ≈ 28,000 translation calls is impractical and most crypto glossaries do this same thing |
| URL shape | `/glossary` index + `/glossary/<slug>` per-term page | One-segment depth matches `/academy/<cat>/<slug>` and `/newsroom/<slug>`; "Learn" is a nav grouping, not a URL prefix |
| Nav restructure | Minimal — Newsroom and Guide stay top-level; "Learn ▾" replaces "Academy" | Smallest delta to existing nav; doesn't disorient users who know where Newsroom/Guide live |
| Dropdown contents | Academy, Series, Glossary | Three educational surfaces that share the same audience |
| Per-term-page strategy | Real static pages (SSG via `generateStaticParams`) | Auto-linker (sub-project 2) needs a focused destination; ~28k pages is well within Next.js's capacity for this codebase |
| Merge precedence on slug collision | SSP-curated > CMC > web-sourced | SSP-authored definitions win in their own glossary; web-sourced only fills gaps |
| License posture | Wikipedia content attributed in a footer line per CC-BY-SA; CMC JSON shipped same way Zelcore already ships it | Consistent with how the same dataset is already deployed on a sibling property |

## Architecture

Three top-level pieces. All in the website repo. No CMS or admin work.

### Files

**New:**

```
src/constants/glossary/cmc.json                       # ~1,270 entries — copied verbatim from zelcore
src/constants/glossary/ssp-curated.json               # ~100 entries — hand-authored in this PR
src/constants/glossary/web-sourced.json               # ~700+ entries — generated by build script, committed
src/constants/glossary/index.ts                       # getGlossary() merge + dedup
src/constants/glossary/types.ts                       # GlossaryEntry shape

src/lib/glossary-utils.ts                             # groupByFirstLetter, normalizeSlug, difficultyBadgeClass

src/app/[locale]/glossary/page.tsx                    # index page (server component)
src/app/[locale]/glossary/glossary-search.tsx         # client island — search input
src/app/[locale]/glossary/letter-index.tsx            # client island — A–Z jump bar
src/app/[locale]/glossary/glossary-entry-card.tsx     # server component — single card
src/app/[locale]/glossary/[slug]/page.tsx             # per-term detail page (server component)

src/components/ui/navigation-menu.tsx                 # shadcn-style wrapper around @radix-ui/react-navigation-menu (~80 loc)
src/components/header/learn-dropdown.tsx              # desktop Radix dropdown
src/components/header/learn-mobile-section.tsx        # mobile grouped section

scripts/build-glossary-web-sourced.ts                 # one-shot tool, not in prebuild
```

**Modified:**

```
src/components/header/header.tsx                      # primaryNav now supports kind: 'link' | 'group'
src/messages/<locale>.json × 14                       # add Header.learn*, Glossary.* keys
```

### Data flow

```
Build time (next build):
  ssp-curated.json ──┐
  cmc.json ──────────├──► constants/glossary/index.ts.getGlossary() ──► sorted, deduped GlossaryEntry[]
  web-sourced.json ──┘                                                  │
                                                                        ├──► page.tsx renders all 2,000+ cards grouped by letter
                                                                        └──► [slug]/page.tsx — generateStaticParams emits 2,000+ slugs × 14 locales

Runtime (in browser):
  /[locale]/glossary
    ├──► static HTML — all cards rendered server-side
    ├──► glossary-search.tsx (client) — DOM-direct filter on keystroke
    └──► letter-index.tsx (client) — scrollIntoView on letter click

  /[locale]/glossary/<slug>
    └──► static HTML, no client JS required to read content
```

## Data layer

### Entry shape

```typescript
// src/constants/glossary/types.ts

export interface GlossaryEntry {
  title: string;
  slug: string;
  excerpt: string;
  difficulty?: {
    level: 1 | 2 | 3;
    label: string;                            // "Beginner" | "Moderate" | "Advanced"
    slug: string;                             // "beginner" | "intermediate" | "advanced"
    language: string;                         // always "en" — content is English
  };
  source: 'ssp-curated' | 'cmc' | 'web';     // tagged at merge time, never stored in source files
}
```

### Source files

| File | Origin | ~Size | Maintenance |
|---|---|---|---|
| `cmc.json` | Copied verbatim from `zelcore-website/src/constants/cmc-glossary.json` | ~1,270 entries, ~480 KB | Frozen — re-sync only by re-copying the file |
| `ssp-curated.json` | Hand-authored in this PR | ~100 entries, ~30 KB | Edited by hand; source of truth for SSP-specific terms |
| `web-sourced.json` | Generated by `scripts/build-glossary-web-sourced.ts`, committed | ~700+ entries, ~250 KB | Regenerated only when sources change |

### Web-sourcing script

`scripts/build-glossary-web-sourced.ts` runs **once at implementation time**, not in `prebuild` or CI. Output is committed.

Sources (in order of preference):

1. **Wikipedia: "Glossary of cryptocurrency terms"** — CC-BY-SA, parse the `<dl>`/`<dt>`/`<dd>` definition list from the article HTML.
2. **Wikipedia: "Glossary of blockchain"** if it exists as a separate article — same pattern.
3. **Wikipedia category pages** — "Cryptocurrencies" category gives one article per coin/protocol; take the first-paragraph summary as the excerpt for terms not already covered.
4. **GitHub public-domain glossary datasets** (`crypto-glossary` repos with MIT/Apache/CC0 licenses) — filter by license before merging.

Explicitly **not** scraped: Investopedia, Binance Academy, Coinbase Learn, CoinGecko — copyrighted definitions plus bot protection.

Script behavior:

1. Fetch each source via `WebFetch`. Cache raw HTML/JSON to `.glossary-cache/` (gitignored) so re-runs don't re-hit the network.
2. Parse each source into `GlossaryEntry` shape.
3. Deduplicate within new entries.
4. Filter: drop anything whose normalized slug already exists in `cmc.json` or `ssp-curated.json` — web-sourced only fills gaps.
5. Sort alphabetically by title.
6. Write `web-sourced.json`.

If the script can't pull enough entries from the named sources to clear 2,000 total entries when merged with CMC and SSP-curated, the implementer expands SSP-curated by the shortfall rather than scraping a copyrighted source. The 2,000 target is firm; the route to it is flexible.

### Slug normalization

Pure function in `src/lib/glossary-utils.ts`:

```typescript
export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')  // strip combining marks (diacritics)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

CMC's existing slugs already conform — `normalizeSlug("0x Protocol") === "0x-protocol"`, matching `cmc.json` verbatim. SSP-curated and web-sourced entries have their slugs regenerated from their titles at merge time to enforce consistency.

### Merge — `getGlossary()`

Single pure function in `src/constants/glossary/index.ts`. Synchronous, evaluated at module load:

```typescript
import { normalizeSlug } from '@/lib/glossary-utils';
import cmc from './cmc.json';
import sspCurated from './ssp-curated.json';
import webSourced from './web-sourced.json';
import type { GlossaryEntry } from './types';

export function getGlossary(): readonly GlossaryEntry[] {
  const map = new Map<string, GlossaryEntry>();

  // Lowest precedence first — later sets override earlier
  for (const entry of webSourced) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'web' });
  }
  for (const entry of cmc) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'cmc' });
  }
  for (const entry of sspCurated) {
    map.set(normalizeSlug(entry.slug), { ...entry, source: 'ssp-curated' });
  }

  return Object.freeze(
    Array.from(map.values()).sort((a, b) => a.title.localeCompare(b.title, 'en'))
  );
}

export const GLOSSARY = getGlossary();
```

Precedence — highest wins on slug collision: **SSP-curated > CMC > web**. Reasoning: SSP authors know their domain best; CMC is professionally edited; web-sourced is variable quality and only fills gaps.

`GLOSSARY` is computed once at module-init, frozen, and re-used. With 2,000+ entries this is a few ms at cold start and free thereafter. Server components import it directly.

### SSP-curated content

About 100 entries authored in this PR, covering five clusters:

| Cluster | Examples |
|---|---|
| SSP-specific | SSP Wallet, SSP Key, SSP Relay, Pairing, Co-signing, 2-of-2 multisig |
| Multisig fundamentals | Multisig, M-of-N, Threshold signature, MuSig2, FROST, Schnorr signature |
| Bitcoin-specific | PSBT, Sighash, OP_CHECKMULTISIG, P2SH, P2WSH, Taproot, UTXO, BIP-39, BIP-32, BIP-44 |
| Ethereum-specific | EOA, ERC-4337, Account Abstraction, Bundler, Paymaster, User Operation, EIP-712 |
| Security | Phishing, Dusting attack, Sweep, Replay attack, Side-channel, Address poisoning |
| Wallet operations | Hardware wallet, Hot wallet, Cold storage, Air-gapped, Seed phrase, Passphrase |

Each entry is ~2–4 sentences in the same plain-English style as CMC's excerpts. The implementation plan enumerates the full ~100-entry list.

## Page layer

### `/glossary` index page

Server component. Renders all entries grouped by letter, with two client islands and one footer.

Layout:

- Hero: H1 "Glossary", description sentence, search input.
- Letter-index row: `# A B C D E F …` jump buttons.
- One section per letter, with a sticky `#letter-X` anchor: large letter heading + grid of cards (1 column on mobile, 2 on md, 3 on lg).
- Banner under H1 only when `locale !== 'en'`: "Glossary content is shown in English. For localized articles, see the Academy."
- Footer attribution line: "Some entries adapted from Wikipedia's Glossary of cryptocurrency terms (CC BY-SA 3.0)."

Card markup:

```tsx
<Link
  href={{ pathname: '/glossary/[slug]', params: { slug: entry.slug } }}
  data-glossary-card
  data-title={entry.title}
  id={entry.slug}
  className="rounded-card p-6 bg-card hover:bg-card/80 transition-colors block scroll-mt-24"
>
  <h3 className="text-lg font-semibold">{entry.title}</h3>
  <p className="mt-2 text-muted-foreground line-clamp-3">{entry.excerpt}</p>
  {entry.difficulty && <DifficultyBadge level={entry.difficulty.level} label={entry.difficulty.label} />}
</Link>
```

The `id={entry.slug}` lets `/glossary#seed-phrase` work as an in-page anchor (harmless dead code in this sub-project; useful if the auto-linker is ever configured to in-page-anchor instead of per-term-page).

### Client islands

**`glossary-search.tsx`** — single input. On change, queries the DOM directly:

```tsx
'use client';
import { useEffect, useState } from 'react';

export function GlossarySearch({ placeholder, totalLabel }: { placeholder: string; totalLabel: string }) {
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    let visible = 0;
    for (const card of document.querySelectorAll<HTMLElement>('[data-glossary-card]')) {
      const title = (card.dataset.title ?? '').toLowerCase();
      const matches = q === '' || title.includes(q);
      card.style.display = matches ? '' : 'none';
      if (matches) visible++;
    }
    for (const section of document.querySelectorAll<HTMLElement>('[data-letter-section]')) {
      const hasMatch = section.querySelector('[data-glossary-card]:not([style*="display: none"])');
      section.style.display = hasMatch ? '' : 'none';
    }
    setVisibleCount(visible);
  }, [query]);

  return (
    <div>
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-label={placeholder}
      />
      <p>{query ? `${visibleCount} matches` : totalLabel}</p>
    </div>
  );
}
```

Direct DOM manipulation (instead of React-state-driven re-render of 2,000+ cards) is deliberate. Re-rendering 2,000 cards on every keystroke is the kind of thing that locks up mobile Safari. Hiding via `style.display` is one DOM op per card and keeps the React tree static. Trade-off: search state is not URL-shareable. Acceptable for v1.

**`letter-index.tsx`** — A/B/C/…/# row of buttons. Each calls `document.getElementById('letter-X')?.scrollIntoView({ behavior: 'smooth' })`. Pure client component, no state, no React tree manipulation.

**`glossary-entry-card.tsx`** — server component, renders one card. Imports `Link` from `@/i18n/navigation` so locale prefixing happens automatically.

### `/glossary/[slug]` detail page

Server component. Static-generated for every slug × every locale.

```tsx
// src/app/[locale]/glossary/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { GLOSSARY } from '@/constants/glossary';
import { Link } from '@/i18n/navigation';
import { createMetadata } from '@/lib/seo';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';

interface PageProps { params: Promise<{ locale: Locale; slug: string }> }

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return GLOSSARY.map(entry => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const entry = GLOSSARY.find(e => e.slug === slug);
  if (!entry) return {};
  const t = await getTranslations({ locale, namespace: 'Glossary' });
  return createMetadata({
    title: t('termSeoTitle', { term: entry.title }),
    description: entry.excerpt.slice(0, 160),
    path: `/glossary/${slug}`,
  });
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const entry = GLOSSARY.find(e => e.slug === slug);
  if (!entry) notFound();

  const t = await getTranslations({ locale, namespace: 'Glossary' });

  return (
    <article className="container-custom my-12">
      <Link href="/glossary" className="text-sm text-muted-foreground">← {t('backToGlossary')}</Link>
      <h1 className="mt-6 text-4xl font-bold">{entry.title}</h1>
      {entry.difficulty && <DifficultyBadge level={entry.difficulty.level} label={entry.difficulty.label} />}
      <div className="prose prose-lg dark:prose-invert mt-8">
        <ReactMarkdown>{entry.excerpt}</ReactMarkdown>
      </div>
      {/* Reserved slot for sub-project 2: "Appears in articles" — intentionally empty in v1 */}
    </article>
  );
}
```

The `notFound()` path triggers the standard Next.js 404 for `/glossary/<unknown-slug>`.

### Locale handling

URL is `/[locale]/glossary/<slug>`. Slug is shared across locales. Chrome (page title, search placeholder, "Back to glossary", attribution) is translated; term content is English regardless of locale.

When `locale !== 'en'`, both the index page and the detail page render a one-line banner under the H1:

> *Glossary content is shown in English. For localized articles, see the [Academy](/[locale]/academy).*

Translation key: `Glossary.contentInEnglishBanner`. The Academy link inside it uses the locale-aware `<Link>` so it routes to `/es/academy` etc.

## Header restructure

### Desktop dropdown

When the user hovers (or keyboard-focuses) "Learn ▾":

```
Learn ▾
┌─────────────────────────────────────────────┐
│  📚  Academy                                │
│      Long-form articles organized by        │
│      category                               │
│                                             │
│  🧭  Series                                 │
│      Guided multi-part learning paths       │
│                                             │
│  📖  Glossary                               │
│      Crypto and SSP terms, 2,000+ entries   │
└─────────────────────────────────────────────┘
```

Single column, ~360 px wide. Icons from `lucide-react` (`BookOpen`, `Compass`, `BookA`).

**One adjacent file added in this PR:** `src/components/ui/navigation-menu.tsx` — the shadcn-style wrapper around `@radix-ui/react-navigation-menu`. SSP doesn't currently have a `components/ui/` directory or any shadcn primitives, so this introduces the pattern. The wrapper is the standard ~80-loc shadcn template (Trigger, Content, List, Item, Link, Viewport, Indicator) — copy verbatim from the shadcn registry. No customization beyond Tailwind class tokens that match the SSP theme.

```tsx
// src/components/header/learn-dropdown.tsx
'use client';
import { BookOpen, BookA, Compass } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function LearnDropdown({ isActive }: { isActive: boolean }) {
  const t = useTranslations('Header');
  const items = [
    { href: '/academy', icon: BookOpen, label: t('academy'), desc: t('learnAcademyDescription') },
    { href: '/academy/series', icon: Compass, label: t('series'), desc: t('learnSeriesDescription') },
    { href: '/glossary', icon: BookA, label: t('learnGlossary'), desc: t('learnGlossaryDescription') },
  ];

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={isActive ? 'text-primary-600 dark:text-primary-400' : ''}>
            {t('learn')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[360px] gap-2 p-3">
              {items.map(item => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link href={item.href} className="flex items-start gap-3 rounded-md p-3 hover:bg-accent transition-colors">
                      <item.icon className="mt-1 h-5 w-5 shrink-0" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

`isActive` is `true` when `pathname.startsWith('/academy')` || `pathname.startsWith('/glossary')`. Drives the underline indicator on the trigger.

Radix `NavigationMenu` handles all the accessibility plumbing: keyboard nav (Tab / Esc / arrow keys), `aria-expanded`, focus management, click-outside-to-close.

### Mobile section

The mobile menu is a vertical stack. The Learn group renders as a labelled subsection — no accordion (three items isn't worth the friction):

```
Home
Enterprise
Features
Newsroom
── Learn ──
  Academy
  Series
  Glossary
Guide
Support
Contact
```

Pure markup, no JS state.

### `header.tsx` change

The `primaryNav` array becomes a discriminated union:

```typescript
type NavItem =
  | { kind: 'link'; name: string; href: string }
  | { kind: 'group'; name: string; key: 'learn' };

const primaryNav: NavItem[] = [
  { kind: 'link', name: t('home'), href: '/' },
  { kind: 'link', name: t('enterprise'), href: '/enterprise' },
  { kind: 'link', name: t('features'), href: '/features' },
  { kind: 'link', name: t('newsroom'), href: '/newsroom' },
  { kind: 'group', name: t('learn'), key: 'learn' },
  { kind: 'link', name: t('guide'), href: '/guide' },
  { kind: 'link', name: t('support'), href: '/support' },
  { kind: 'link', name: t('contact'), href: '/contact' },
];
```

Desktop render-loop branches on `item.kind`: `<Link>` for `'link'`, `<LearnDropdown isActive={…}>` for `'group'`. Mobile loop renders `<LearnMobileSection>` for `'group'`.

The active-tab underline animation (`motion.div` with `layoutId='activeTab'`) keeps working for flat links. The dropdown trigger uses a static underline class when `isActive`, because the framer-motion `layoutId` would conflict with Radix's popover open/close animation.

### Translation keys to add

Per locale, in `src/messages/<locale>.json` under `Header`:

```json
{
  "Header": {
    "learn": "Learn",
    "series": "Series",
    "learnGlossary": "Glossary",
    "learnAcademyDescription": "Long-form articles organized by category",
    "learnSeriesDescription": "Guided multi-part learning paths",
    "learnGlossaryDescription": "Crypto and SSP terms, 2,000+ entries"
  }
}
```

Plus a new top-level `Glossary` namespace:

```json
{
  "Glossary": {
    "title": "Glossary",
    "description": "Crypto, blockchain, and SSP terms explained.",
    "searchPlaceholder": "Search 2,000+ terms…",
    "total": "{count} terms",
    "backToGlossary": "Back to glossary",
    "termSeoTitle": "{term} — SSP Glossary",
    "attribution": "Some entries adapted from Wikipedia's Glossary of cryptocurrency terms (CC BY-SA 3.0).",
    "contentInEnglishBanner": "Glossary content is shown in English. For localized articles, see the {academyLink}.",
    "academyLinkLabel": "Academy"
  }
}
```

Locale fill follows the same Python-script pattern used for the `localeBadge` expansion: a single dictionary of per-locale translations, `json.load`, deep merge under the appropriate namespace, `json.dump` back. All 14 files updated atomically.

### What stays unchanged in the header

- Logo, locale switcher, theme toggle, download button.
- Mobile hamburger animation.
- Fixed-position-on-scroll behavior.
- Active-tab indicator on flat links.

## Performance

Expected build output additions:

- ~28,014 static pages (14 locales × (1 index + ~2,000 detail))
- ~760 KB JSON total in the server bundle (CMC ~480 KB + SSP-curated ~30 KB + web-sourced ~250 KB)
- ~5 KB gzipped extra client JS for the two search/letter-index islands

Runtime targets for the index page:

| Metric | Target | Approach |
|---|---|---|
| First Contentful Paint | < 2 s on mid-tier mobile | Server-rendered, no client JS for content paint |
| Time to Interactive | < 4 s | Two small client islands only |
| Search keystroke latency | < 50 ms | Direct DOM manipulation, no React re-render |
| Bundle delta | < 5 KB JS gzipped | Two small client components |

If FCP regresses on mobile when measured, the fallback is to render only the active letter section and lazy-render other letters on `IntersectionObserver` — a one-file change scoped to `page.tsx`/`glossary-entry-card.tsx`. Not in v1 unless measured.

If `yarn build` runs more than +60 s after this change, the secondary fallback is `revalidate: 86400` on detail pages instead of full SSG. Don't apply preemptively; measure first.

## Testing

### Vitest unit tests

| Test file | Scope |
|---|---|
| `src/constants/glossary/index.test.ts` | `getGlossary()` returns frozen array; SSP-curated wins over CMC on slug collision; CMC wins over web; total count > 2,000; no duplicate slugs in output |
| `src/lib/glossary-utils.test.ts` | `groupByFirstLetter` groups numerics under `#`; `normalizeSlug` strips diacritics and special chars; `difficultyBadgeClass` returns expected classes per level |
| `src/app/[locale]/glossary/glossary-search.test.tsx` | Empty query shows all cards; typing filters by case-insensitive substring; clearing input restores all (happy-dom) |
| `src/components/header/learn-dropdown.test.tsx` | Renders three items with correct hrefs; active state computed from `pathname` prop |

### Manual verification checklist

After `yarn dev` against the website worktree:

1. `/en/glossary` loads, shows 2,000+ entries grouped A–Z + #
2. Search "seed" filters to ~5 matches in real time, no React re-render visible in DevTools
3. Click a card → lands on `/en/glossary/<slug>` detail page
4. "← Back to glossary" link returns to index
5. Letter-index buttons jump to anchored sections
6. `/es/glossary` shows Spanish chrome, English content, and the "content in English" banner under H1
7. Hover "Learn ▾" in desktop header → dropdown shows Academy / Series / Glossary
8. Keyboard nav: Tab to Learn trigger, Enter to open, arrow keys, Esc to close
9. Mobile (≤ 1024px): hamburger menu shows "Learn" subsection heading with three items
10. Active-tab styling: visit `/glossary`, confirm "Learn" trigger renders in primary color
11. Visit `/academy/security/<some-slug>`, confirm "Learn" trigger renders active (active-from-descendant)
12. Visit `/newsroom`, confirm "Learn" trigger renders inactive

### Verification gates (CI / pre-merge)

| Gate | Command | Catches |
|---|---|---|
| Translation completeness | `yarn check:translations` | Missing keys in any of 14 locales |
| Type-check | `yarn type-check` | Type errors, data-shape mismatches |
| Lint | `yarn lint` | Style violations, unused imports |
| Build | `yarn build` | SSG of 14 × 2,000+ glossary pages succeeds |
| Tests | `yarn test` | Vitest suite above |

## Failure handling

| Condition | Behavior | Recovery |
|---|---|---|
| `getGlossary()` produces duplicate slugs | Vitest unit test fails. Build blocks. | Fix `ssp-curated.json` / `web-sourced.json` or the merger |
| `web-sourced.json` malformed (parse error) | Module import throws at build time. Build blocks. | Regenerate via `build-glossary-web-sourced.ts` |
| Slug collision with reserved word (`about`, `terms`) | Won't happen — those aren't crypto terms and we control SSP-curated content | N/A — don't curate reserved slugs |
| Mobile FCP regression on `/glossary` | Detected in manual-check step 1 | Apply lazy-letter-section fallback from Performance section |
| One of 14 locales missing keys | `check:translations` fails in `prebuild` | Re-run the Python fill script |
| Wikipedia source returns 404 at script time | `WebFetch` returns error; script logs and skips that source | Replace source URL or accept lower count and expand SSP-curated to compensate |
| Auto-linker (future) collides with existing internal links | Out of scope — solved in sub-project 2 | N/A here |

## Release plan

Single PR against the active website branch `feat/newsroom-academy-app-router-migration`. One bundled merge containing:

1. Data files: `cmc.json`, `ssp-curated.json`, `web-sourced.json`, `index.ts`, `types.ts`
2. Library: `src/lib/glossary-utils.ts`
3. Pages: `/glossary` index + `/glossary/[slug]` detail + client islands + card component
4. Header: `learn-dropdown.tsx`, `learn-mobile-section.tsx`, restructured `header.tsx`
5. Locale messages × 14 (new `Header.learn*` and `Glossary.*` keys)
6. Tests + build verification
7. The one-shot `build-glossary-web-sourced.ts` script (committed for reproducibility)
8. `.gitignore` entry for `.glossary-cache/`

Once merged and deployed to the dev box, sub-project 2 (auto-linker + intro-article fix + missing-article authoring) opens its brainstorm. The glossary URLs locked here (`/glossary/<slug>`) become the auto-linker's destinations.

## Out of scope (sub-project 2)

- `autoLinkContent` markdown processor and `<PostArticle>` integration
- Term-map builder pulling from Academy posts and the glossary
- Fix to the intro article's `/academy/getting-started` and `/academy/multisig` stub links
- Authoring "Setup guide" and "Multisig deep-dive" academy articles
- Populating the "Appears in articles" slot on glossary detail pages

## Open decisions resolved

- **Data sources:** CMC verbatim + SSP-curated (~100) + web-sourced (~700+ from CC-BY-SA Wikipedia). Target 2,000+ entries combined.
- **Translation scope:** chrome only. Content English in all locales. A future curated-200 translation pass remains an option without rework.
- **URL structure:** `/glossary` index + `/glossary/<slug>` per-term pages. One-segment depth, consistent with Academy and Newsroom URL shapes.
- **Nav restructure:** Newsroom and Guide stay top-level. Learn ▾ replaces Academy with Academy/Series/Glossary inside.
- **Dropdown primitive:** Radix `NavigationMenu` (already a dep). Single-column, three items, icons from `lucide-react`.
- **Merge precedence:** SSP-curated > CMC > web on slug collision.
- **Per-term detail pages:** real SSG pages, not redirects. Auto-linker's destination locked.
- **Search:** client-side DOM-direct filtering, no debounce. Static React tree, dynamic visibility.
- **License:** Wikipedia content attributed in footer per CC-BY-SA. CMC JSON shipped the same way Zelcore already ships it.
