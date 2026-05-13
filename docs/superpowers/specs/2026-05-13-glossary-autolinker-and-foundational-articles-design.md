# Glossary Auto-Linker Retarget + Foundational Academy Articles — Design

**Status:** Approved, ready for plan.
**Branch:** `feat/newsroom-academy-app-router-migration` (continuing from `896d702`).
**Predecessor:** [`2026-05-13-glossary-and-learn-nav-design.md`](./2026-05-13-glossary-and-learn-nav-design.md) (sub-project 1 — glossary infra + Learn nav, shipped).

## Why this sub-project exists

The user's original complaint was *"the links in the article are not properly linked"* on the prod CMS at `localhost:3007`. Investigation showed that the broken-link problem is not a single stub in a single article — it is a structural gap between three pieces of work that were partially landed:

1. **An auto-linker** (`src/lib/glossary-linker.ts`, April work, 9 tests passing) is wired into every academy article page. It is configured against a hand-curated list of 20 academy-aligned terms in `src/lib/academy-terms.ts`. The hrefs in that list point to **6 unique deep-article URLs** (`/academy/multisig/what-is-2-of-2-multisig`, `/academy/security/seed-phrase-best-practices`, etc.).
2. **None of those 6 articles exist.** `content/academy/<category>/` are all empty (only `.gitkeep` markers). The CMS may have a few unrelated posts but does not host the articles the auto-linker generates links for. Every auto-link is therefore a 404.
3. **The new 2,157-term glossary** (sub-project 1, shipped to `/glossary/<slug>`) is not consulted by the auto-linker at all. The two pieces of glossary infrastructure are unaware of each other.

The user-visible result: a reader of any current or future academy article sees inline links that go nowhere, and the new glossary is reachable only via the `/glossary` index. The footer's `Academy → Multisig` and `Academy → Getting Started` links resolve to category-hub pages that render an empty list of cards.

This sub-project closes that gap with three deliverables: a two-tier auto-linker that combines the curated 20 with a fallback to the glossary; the 8 foundational academy articles that the curated tier wants to link to (plus 2 to seed otherwise-empty category hubs); and a one-shot script that fixes the two specific stub anchors in the existing intro article body.

## Decisions locked in brainstorming

1. **Authoring scope = 8 academy articles.** The 6 articles referenced by `academy-terms.ts` plus 1 seed article in each of the two otherwise-empty categories (`coin-guides`, `news-explained`). Every category-hub page therefore has at least one card after this lands.
2. **Auto-linker = two-tier with a per-article cap.** Curated 20 entries still win; the 2,157-term glossary serves as a fallback layer. Per-article cap of **8** links total to prevent link-soup.
3. **Auto-linker surfaces = academy + newsroom.** Glossary detail pages stay plain (a definition does not auto-link other definitions in its excerpt). The wiring point becomes a shared server helper.
4. **Delivery = full CMS path with 14-locale translation.** The `generate-article` skill drafts English, translates to all 14 Wave 1 locales (`en, es, zh, pt-BR, ru, tr, ja, de, fr, it, pl, ko, vi, id`), generates an SSP-brand cover, and POSTs to the admin API. Each article gets the same multilingual story the rest of the site has.
5. **Intro stub fix = surgical, not a sweep.** The single intro article that has bare `/academy/getting-started` and `/academy/multisig` anchors is rewritten to point at the specific deep articles those anchors were obviously meant for. Bigger sweeps of the post corpus are out of scope.

## Architecture in two paragraphs

The auto-linker stays a pure function over markdown. What changes is the **map composition step**, which moves out of `glossary-linker.ts` into a new server-only helper `auto-link-post-content.ts`. The helper builds two `Map<string, GlossaryTerm>` instances at module load: the curated map from `academy-terms.ts`, and a fallback map derived from the 2,157-entry `GLOSSARY` constant with stop-words and very-short terms filtered out. The helper passes both maps plus a numeric cap to `autoLinkContent`. The linker iterates longest-first across the union (curated entries consumed before fallback entries within each length bucket), tracks a per-call counter, and short-circuits when the counter hits 8. Self-reference skip (already in the linker) covers both academy article self-links and the new glossary self-link case.

The 8 articles ship through the existing `generate-article` skill, one commit per article. The skill is already wired to the admin API's `translations` payload contract, generates covers via `scripts/generate-cover.py`, and handles all 14 locales. The intro-article fix is a small one-shot TypeScript script that fetches the intro post, rewrites the two stub anchors across all 14 translations, and PUTs the result back. The script is idempotent (skips anchors already at the deep URL) so it can be re-run safely, and is kept under `scripts/` for traceability without re-execution on every deploy.

## Tech stack (no new deps)

- TypeScript 5.9, Next.js 16, next-intl 4.9, React 19 — unchanged.
- `react-markdown` 10 + `remark-gfm` — already in use for both academy and newsroom rendering.
- Vitest 4 + happy-dom — for new linker tests.
- The `generate-article` skill (`/Users/vasilismagkoutis/repos/ssp-cms-backend/.claude/skills/generate-article/`) and `scripts/generate-cover.py` — already in place.

No new packages.

## File structure

**`ssp-website` (branch `feat/newsroom-academy-app-router-migration`):**

| File | Action | Responsibility |
|---|---|---|
| `src/lib/glossary-linker.ts` | modify | Accept `(content, selfSlug, termMap, options?)` where `options` is `{ maxLinks?: number, fallbackTermMap?: Map<...> }`. Iteration is longest-first across the union of both maps; curated entries are consumed before fallback entries when they are the same length. Per-call counter enforces `maxLinks`. |
| `src/lib/glossary-linker.test.ts` | modify | Existing 9 tests retained. Add 6 new tests: curated wins over fallback, fallback links terms not in curated, cap enforcement, cap counts both tiers together, stop-words never linked, glossary self-reference skipped. |
| `src/lib/build-fallback-term-map.ts` | create | Pure function `buildFallbackTermMap(curated: Iterable<GlossaryTerm>): Map<string, GlossaryTerm>`. Reads `GLOSSARY` from `@/constants/glossary`, drops terms shorter than 3 chars, drops terms whose lowercased label is already in `curated`, drops terms in the stop-word set. Returns a `Map` keyed by lowercase term label. Memoized via module-scope cache. |
| `src/lib/build-fallback-term-map.test.ts` | create | Tests: stop-words filtered, < 3-char terms filtered, curated dedup applied, all remaining entries have `/glossary/<slug>` hrefs. |
| `src/lib/auto-link-post-content.ts` | create | Server-only entry point `autoLinkPostContent(content: string, selfSlug: string): string`. Composes curated map + fallback map, calls `autoLinkContent` with `maxLinks: 8`. Only seam called from page-level code. |
| `src/lib/auto-link-post-content.test.ts` | create | Integration test: feeds a realistic ~800-word body containing 4 curated terms + 6 fallback-only terms + 2 stop-words; asserts exactly 8 links, curated linked before fallback, stop-words untouched. |
| `src/components/shared/post-article.tsx` | modify | No call-site change here — the component remains a passive renderer. Verify that the `a` component already handles non-HTTP hrefs as next-intl `Link` (it does, see line 152). |
| `src/app/[locale]/academy/[category]/[slug]/page.tsx` | modify | Replace `autoLinkContent(post.content, post.slug, termMap)` at line 99 with `autoLinkPostContent(post.content, post.slug)`. Drop the now-unused `getTermMap`/`autoLinkContent` imports. |
| `src/app/[locale]/newsroom/[slug]/page.tsx` | modify | Apply `autoLinkPostContent(post.content, post.slug)` before passing to `PostArticle`. New surface. |
| `scripts/fix-intro-stubs.ts` | create | One-shot Node script. Env: `SSP_CMS_URL`, `SSP_CMS_INTERNAL_API_KEY`. Identifies the intro post by scanning published posts for the two bare anchors, prompts operator for confirmation, rewrites all 14 translations, PUTs back. Idempotent. |

**`ssp-cms-backend`:**

No source changes. Receives 8 POSTs and 1 PUT via admin API during execution.

## Two-tier linker behavior (precise)

**Map composition (server-side, memoized):**

```ts
const STOP_WORDS = new Set([
  'address', 'block', 'chain', 'coin', 'fee', 'fork', 'hash', 'key',
  'network', 'node', 'token', 'wallet', /* + ~20 more */
])

const curatedMap = new Map(
  GLOSSARY_TERMS.map(t => [t.term.toLowerCase(), t])
)

const fallbackMap = buildFallbackTermMap(curatedMap.keys())
// returns Map populated from GLOSSARY (2,157) minus:
//   - terms whose label length < 3
//   - terms whose lowercased label is in curatedMap
//   - terms whose lowercased label is in STOP_WORDS
// entries have href = `/glossary/${entry.slug}`
```

**Signature.** The linker keeps its existing positional args and gains an options object:

```ts
function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>,
  options?: { maxLinks?: number; fallbackTermMap?: Map<string, GlossaryTerm> }
): string
```

`termMap` is the curated tier. `options.fallbackTermMap` is the glossary tier. `options.maxLinks` defaults to `Infinity` (preserves the current behavior for any caller that does not opt in) and is set to `8` by the new server helper.

**Iteration:**

```
inputs: content, selfSlug, termMap, fallbackTermMap, maxLinks

1. Mask code blocks, inline code, existing links, reference links.
2. Build a single iteration list: union of termMap and fallbackTermMap keys,
   each tagged with its source tier ('curated' | 'fallback').
   Sort by:
     - length desc (longest first)
     - tier asc ('curated' before 'fallback' at the same length)
3. For each key in the sorted list:
     skip if href is self-referential (existing rule).
     if linkCount >= maxLinks: break.
     attempt case-insensitive word-boundary match; if hit:
       replace first occurrence with [match](href), increment linkCount.
4. Unmask placeholders.
```

The "curated before fallback at the same length" tie-breaker is a small but real behavior change: today there is only one map, so no tie-break is needed. The new behavior guarantees that when a term exists in both maps (it shouldn't, because of the dedup filter, but defense in depth) the curated href wins.

**Cap rationale.** 8 is the largest count that still feels editorial rather than encyclopedic. An average 1,200-word academy article produces roughly 1 link per 150 words, which matches the linking density of well-edited explainer content (e.g. Investopedia). The cap is per-article, not per-paragraph, so a long article distributes links naturally.

**Stop-word list.** Targets words that *are* legitimate glossary entries but appear so often in prose that auto-linking them produces noise. Initial list (subject to tuning): `address`, `block`, `chain`, `coin`, `fee`, `fork`, `hash`, `key`, `network`, `node`, `token`, `wallet`, `transaction`, `signature`, `protocol`, `consensus`, `mining`, `staking`, `validator`, `account`, `balance`, `peer`, `client`, `server`, `script`, `index`. Curated terms like `gas`, `mempool`, `finality`, `signer`, `threshold` stay linkable because they reach deep article anchors that materially help the reader.

## The 8 academy articles

| # | Category | Slug | Title | Words | Notes / anchors |
|---|---|---|---|---|---|
| 1 | `multisig` | `what-is-2-of-2-multisig` | What is 2-of-2 multisig? | 1,400 | Foundational SSP differentiator. Required anchors: `#bip48`, `#signer`, `#threshold`, `#2-of-2`. |
| 2 | `security` | `seed-phrase-best-practices` | Seed phrase best practices | 1,400 | Required anchors: `#bip39`, `#bip32`, `#hot-wallet`, `#cold-wallet`, `#hardware-wallet`, `#private-key`, `#public-key`. |
| 3 | `getting-started` | `setting-up-your-first-ssp-wallet` | Setting up your first SSP wallet | 1,200 | Walkthrough format. Required anchors: `#gas`, `#mempool`, `#finality`. |
| 4 | `security` | `why-self-custody-matters-now` | Why self-custody matters now | 1,000 | Threat-modelled. No required anchors. |
| 5 | `defi` | `what-is-account-abstraction-erc-4337` | What is account abstraction (ERC-4337)? | 1,300 | Non-engineer explainer. SSP's posture on AA. |
| 6 | `how-to` | `sending-bitcoin-with-ssp` | Sending Bitcoin with SSP | 1,000 | Step-by-step. Required anchor: `#walletconnect`. |
| 7 | `coin-guides` | `bitcoin-in-ssp` | Bitcoin in SSP | 1,000 | Seeds the category. Per-asset deep dive. |
| 8 | `news-explained` | `what-is-on-chain-analytics` | What is on-chain analytics? | 1,000 | Seeds the category. Evergreen primer. |

**Anchor drafting checklist.** For each article in the table that lists "Required anchors", the drafting prompt to `generate-article` must include the explicit constraint: *"the rendered body must contain `id="<anchor>"` somewhere — either via an H3 heading that slugifies to the anchor, or via an inline `<span id="<anchor>">…</span>`."* The existing `ReactMarkdown` config slugifies H2 ids already (line 148 of `post-article.tsx`); H3 anchors require explicit `id` attributes via raw HTML. `remark-gfm` allows raw HTML in markdown bodies, so `<span id="bip48"></span>` inline is the simplest way to satisfy the constraint.

**Author / cover details.**

- Author for all 8: `SSP Editorial Team`. Confirm record exists at the start of execution via `GET /api/v1/admin/authors`; create once if absent.
- Cover style: SSP-brand category pill, topic title, category-relevant icon. Generated automatically by the `generate-article` skill calling `scripts/generate-cover.py` with the category and title.

## Intro-article stub fix

**Script location.** `scripts/fix-intro-stubs.ts` in `ssp-website`. TypeScript, runs via `tsx`. Reads `SSP_CMS_URL` and `SSP_CMS_INTERNAL_API_KEY` from `.env.local`.

**Behavior.**

1. `GET ${SSP_CMS_URL}/api/v1/admin/posts?status=published&limit=500`.
2. For each post, scan all translation bodies for the two bare anchors `/academy/getting-started` and `/academy/multisig` (anchored as `](/academy/getting-started)` or `](/academy/multisig)` to avoid matching deeper paths).
3. Print a summary: which post id, which translations contain hits. Prompt operator: `proceed? [y/N]`.
4. On `y`: for each affected translation body, replace
   - `](/academy/getting-started)` → `](/academy/getting-started/setting-up-your-first-ssp-wallet)`
   - `](/academy/multisig)` → `](/academy/multisig/what-is-2-of-2-multisig)`
5. `PUT ${SSP_CMS_URL}/api/v1/admin/posts/:id` with the rewritten `translations` payload.
6. Print the count of bodies modified per post.

**Idempotency.** Anchors already at a deeper URL (containing `/academy/getting-started/...` or `/academy/multisig/...`) match `]/academy/getting-started/` not `]/academy/getting-started)`, so a second run finds zero hits. The script is safe to re-execute.

**Sequencing.** Runs **last** in the plan, after all 8 articles have been POSTed and verified, so the deep-link targets actually exist when the rewrite goes live.

## Data flow (rendering path, after this lands)

```
[locale]/academy/[cat]/[slug]/page.tsx
  ↓ fetches post via @/lib/cms.getPostBySlug
  ↓ post.content is raw markdown from the CMS
  ↓ autoLinkPostContent(post.content, post.slug) [server-only]
       ↓ composes curatedMap (20) + fallbackMap (2,157 minus filters)
       ↓ calls autoLinkContent(content, selfSlug, curatedMap, fallbackMap, { maxLinks: 8 })
       ↓ returns markdown with up to 8 inline links
  ↓ passes linked markdown to <PostArticle content={linked} />
       ↓ react-markdown renders, components.a routes non-HTTP hrefs through next-intl Link

[locale]/newsroom/[slug]/page.tsx
  ↓ same flow; new wiring point.
```

No client-side work. No hydration mismatch risk. The linked markdown is part of the SSR HTML payload.

## Error handling

- **Auto-linker:** pure function over string; cannot throw. Tests cover the malicious-input case (control-char placeholder collision is already handled via the existing `\x01PH<n>\x01` sentinel).
- **`generate-article` skill:** existing skill handles cover-generation failures, translation failures, and admin-API failures (it surfaces each as a clear operator message and halts).
- **`fix-intro-stubs.ts`:** if no posts contain the bare anchors, print a friendly "nothing to do" message and exit 0. If the API returns 401, fail loudly with a clear "check `SSP_CMS_INTERNAL_API_KEY`" message. If `PUT` returns non-2xx for any post, abort and leave previous posts updated (no rollback — the operator can re-run after fixing the failed post, idempotency keeps earlier ones safe).

## Testing strategy

**Unit tests (vitest):**

- All 9 existing tests in `glossary-linker.test.ts` continue to pass after the signature change. New tests added:
  - `curated wins over fallback for the same term`
  - `fallback links a term not in curated`
  - `respects the cap (maxLinks)`
  - `cap counts curated and fallback together`
  - `stop-words are never linked`
  - `glossary self-reference is skipped`
- `build-fallback-term-map.test.ts`: stop-words filtered, < 3-char filtered, curated dedup, all entries have `/glossary/<slug>` hrefs.
- `auto-link-post-content.test.ts`: integration over a realistic ~800-word body asserting exact link count and ordering.

**Static checks:**

- `yarn type-check` — no new errors.
- `yarn lint` — no new warnings.
- `yarn format:check` — clean.
- `yarn build` — full production build succeeds. Implicitly verifies that the 8 new academy articles' static params still emit and that the auto-linker doesn't break SSG.

**Manual smoke (per article, run as part of the per-article commit):**

- `curl -sS http://localhost:3005/en/academy/<cat>/<slug> | grep '<h1'` → 200, h1 contains the title.
- One non-Latin locale per article: `curl -sS http://localhost:3005/ja/academy/<cat>/<slug> | grep '<h1'` or `zh`.
- Auto-linker sanity (run on article 1 only): fetch the rendered HTML, grep for `href="/glossary/` and `href="/academy/`, confirm at least one of each appears, total `<a` count for internal links ≤ 8.

**Manual smoke (intro stub fix):**

- Before the script: `curl http://localhost:3005/en/<intro-post-path>` → assert the page renders, capture two `href` values pointing at `/academy/getting-started` and `/academy/multisig`.
- After the script: re-fetch, assert the same two hrefs are now `/academy/getting-started/setting-up-your-first-ssp-wallet` and `/academy/multisig/what-is-2-of-2-multisig`.

## Sequencing & commits

One commit per item:

1. `refactor(glossary-linker): accept maxLinks and fallback term map`
2. `feat(glossary-linker): add buildFallbackTermMap helper`
3. `feat(glossary-linker): add auto-link-post-content server helper`
4. `refactor(academy): use auto-link-post-content helper`
5. `feat(newsroom): apply glossary auto-linker to newsroom articles`
6–13. `feat(academy): publish <slug>` — one per article in the table above (8 commits)
14. `chore(scripts): add fix-intro-stubs script`
15. `chore(cms): re-point intro article academy stubs to deep articles`

15 commits onto `feat/newsroom-academy-app-router-migration`. No new branch, no new PR. Consistent with sub-project 1's "same branches" precedent.

## What success looks like

- Every academy article on `localhost:3007` (and prod) renders with 1–8 inline auto-links to either deep academy anchors or `/glossary/<slug>`. None 404.
- Every newsroom article renders with the same treatment.
- Every academy category-hub page lists at least one article card.
- The footer's `Academy → Multisig` and `Academy → Getting Started` links land on populated category hubs.
- The pre-existing intro article's two stub anchors deep-link to the specific articles they were obviously meant to reference.
- `yarn check-all` green. `yarn build` produces ~30,212 + 8×14 = ~30,324 static pages.
- The user can click an inline link in any academy article and reach either a long-form explainer or a glossary excerpt — no broken paths.

## Out of scope (deferred)

- Auto-linking on glossary detail pages (definitions linking other definitions in their excerpts).
- A broader sweep of CMS posts looking for other category-hub stub anchors.
- A dashboard view that surfaces which posts have un-rewritten stubs.
- Expanding the curated 20 entries with more SSP-specific concepts (relay payload, PSBT coordination, signing quorum) — currently noted as conservative inferences in sub-project 1 work; expanding requires SSP product input.
- Adding cross-locale per-locale curated maps (today the curated 20 are language-agnostic English labels; the linker case-insensitively matches English terms in any locale's body. Per-locale curated lists would be the natural next step once translation quality is observed in the wild).
