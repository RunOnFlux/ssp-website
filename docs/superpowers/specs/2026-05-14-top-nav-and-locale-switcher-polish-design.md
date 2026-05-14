# Top-nav and locale-switcher polish — design

**Status:** approved (pre-implementation)
**Date:** 2026-05-14
**Branch:** `feat/newsroom-academy-app-router-migration`
**Scope:** Three small UI polish items on the public website's top bar.

## Motivation

The Academy hub shipped and a reviewer flagged three rough edges in the top navigation:

1. The "Learn" trigger renders a chevron that no other top-bar item carries, which reads as visual noise.
2. "Newsroom" sits as a top-level entry alongside "Learn", but it belongs in the same conceptual bucket as Academy / Series / Glossary.
3. The locale switcher shows a globe **and** the locale label ("English"), and the reviewer asked us to use the globe alone, auto-detect on first visit, and remember the user's choice.

This spec lands all three changes on the existing `feat/newsroom-academy-app-router-migration` branch.

## Decisions (locked)

- **Learn affordance:** plain text, no chevron. Hover state + active-route orange colour already telegraph it's interactive. The dropdown opens on hover / click / keyboard exactly as before.
- **Newsroom placement:** top of the Learn dropdown, ordered Newsroom → Academy → Series → Glossary. Mobile section mirrors the same order.
- **Persistence mechanism:** `NEXT_LOCALE` cookie, which next-intl already manages. We do **not** add `localStorage` — cookies are SSR-friendly and the middleware reads them on every request, so there is no flash of the wrong locale on first paint.

## Architecture

### Component touch list

| File | Change |
|---|---|
| `src/components/ui/navigation-menu.tsx` | Add `hideIndicator?: boolean` prop to `NavigationMenuTrigger`. When set, the `<ChevronDown>` is not rendered. Existing callers (none today besides `LearnDropdown`) remain unaffected. |
| `src/components/header/learn-dropdown.tsx` | Insert `{ href: '/newsroom', icon: Newspaper, label: t('newsroom'), desc: t('learnNewsroomDescription') }` as the first item. Pass `hideIndicator` to the trigger. |
| `src/components/header/learn-mobile-section.tsx` | Insert `'/newsroom'` as the first item in the same order. Update the `href` union type to include `/newsroom`. |
| `src/components/header/header.tsx` | Remove the standalone `{ kind: 'link', name: t('newsroom'), href: '/newsroom' }` from `primaryNav`. Extend `isLearnActive` to include `pathname === '/newsroom' \|\| pathname.startsWith('/newsroom/')`. |
| `src/components/header/locale-switcher.tsx` | Delete the `<span>{LABELS[locale]}</span>` next to the Globe icon. Remove the now-redundant `gap-2` from the trigger button (the icon stands alone). Add a brief code comment naming `NEXT_LOCALE` as the persistence mechanism so future-us does not re-implement it client-side. |
| `src/messages/{en,es,zh,pt-BR,ru,tr,ja,de,fr,it,pl,ko,vi,id}.json` | Add `Header.learnNewsroomDescription` key with a one-sentence localized description. English: `"Latest announcements and product updates"`. |

### What is NOT changing

- The `/newsroom` route itself — still rendered at `src/app/[locale]/newsroom/page.tsx`. We are only moving its top-bar entry point.
- The footer's "Learn" section — out of scope; if footer needs a similar rearrangement it can come later as its own task.
- `routing.ts` / `middleware.ts` locale-detection logic — already correctly wired by next-intl defaults.
- `LocaleSwitcher`'s dropdown content — the 14 language labels still appear when the menu opens.

### Persistence flow (already wired, verified by this spec)

1. **First visit** to any path: next-intl middleware inspects `Accept-Language`, picks the closest match from `routing.locales`, redirects to that locale's prefix (e.g. `/fr/academy`).
2. **Locale pick** in the switcher: `router.replace(path, { locale: next })` triggers next-intl to write `NEXT_LOCALE=<locale>` as a cookie (1 year by default).
3. **Subsequent visits**: middleware reads `NEXT_LOCALE` first, falls back to `Accept-Language` only when the cookie is absent.
4. **Explicit URL locale**: a path like `/fr/...` always wins for that request; the cookie is updated on the next switcher interaction.

We are not changing this flow — we are documenting it and adding test coverage so a future regression is visible.

## Testing

### Updated tests

- `src/components/header/learn-dropdown.test.tsx` — extend the existing render test to assert:
  - Newsroom is the first link in the dropdown.
  - Newsroom's `href` resolves to `/newsroom`.
  - `isLearnActive` highlighting reaches the dropdown trigger when the pathname starts with `/newsroom`.

### New tests

- `src/components/header/locale-switcher.test.tsx` — render the switcher, assert:
  - The trigger contains the Globe icon.
  - The trigger contains no text node (no language label visible at the trigger level).
  - Opening the menu still surfaces the 14 language options.
- `src/middleware.test.ts` (new or extended) — verify:
  - A request with `Cookie: NEXT_LOCALE=pl` and `Accept-Language: fr` redirects to `/pl/...`.
  - A request with no cookie and `Accept-Language: fr-FR,fr;q=0.9` redirects to `/fr/...`.
  - A request to `/de/academy` with a `NEXT_LOCALE=es` cookie renders `/de/academy` (URL wins).

### Manual smoke

`yarn dev`, then in a private window:
1. Hard-refresh `/` — confirm dropdown chevron is gone, Newsroom appears inside the Learn dropdown as the first item.
2. Click `/newsroom` from inside the dropdown — confirm orange-active state on the Learn trigger.
3. Switch language to Polish — hard-refresh the same path — confirm we land on `/pl/...` and stay there across additional refreshes.
4. Clear cookies, set browser language to Spanish, visit `/` — confirm we land on `/es/...`.

## Out-of-scope follow-ups

- Footer "Learn" section parity (Newsroom under Learn there too).
- A "What's new" badge on the Newsroom dropdown item — nice idea, deferred.
- Persisting theme preference alongside locale — already handled separately in `use-theme`.

## Risks

- **Translation freshness.** 14 new locale strings will start as machine-translated drafts. The risk is low because the string is short and not user-action-bound, but we should flag it for a future copy review.
- **Test flakiness on Radix menus.** The dropdown test relies on `NavigationMenu` opening on interaction; we use `user.hover()` consistently with the existing test pattern to avoid flake.

## Commit shape

Four atomic commits on `feat/newsroom-academy-app-router-migration` (no AI co-author, per `CLAUDE.md`):

1. `feat(ui): add hideIndicator prop to NavigationMenuTrigger`
2. `feat(header): move Newsroom under Learn dropdown, drop chevron`
3. `feat(header): trim locale-switcher trigger to globe-only`
4. `test(header,middleware): cover Newsroom-under-Learn and globe-only switcher`

`yarn check-all` passes after each.
