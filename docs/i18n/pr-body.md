## Summary

Phase A of a two-phase translation initiative. Closes the gap between next-intl URL routing (which already worked) and rendered text content (which was hardcoded English).

- **English fallback** in `src/i18n/request.ts` — missing keys in `es`/`zh` resolve to English silently instead of producing next-intl placeholder errors.
- **Site-wide audit + fix** — every user-visible literal in `src/app/[locale]/**` and `src/components/**` now resolves through `next-intl`.
- **`ACADEMY_CATEGORIES` titles** moved to `Academy.categories.<slug>` messages (constant slimmed to slugs + type guard).
- **Static `metadata` exports** converted to `generateMetadata({ params })` for locale-aware SEO tags.
- **192 placeholder strings** (`__TODO_TRANSLATE__ ...`) in `es.json` / `zh.json` replaced with real Spanish + Simplified Chinese translations.
- **Locale-coverage test** ensures `es.json` / `zh.json` mirror every key in `en.json`.
- **Guard test** prevents regressions: any new hardcoded literal in pages or components fails CI.

CMS-served fields (post `title` / `description` / `content` / `imageAlt` / `seoTitle`) are intentionally NOT translated here — that is Phase B (cross-repo, requires CMS schema change).

## Stats

- Commits: 34
- Files changed: 62
- Insertions: +9300 / Deletions: -3463
- Tests: 95 passing (was 83 at branch creation)

## Test plan

- [x] `npm run check-all` clean
- [x] `npm run build` clean
- [x] Locale-coverage test (`__tests__/i18n/locale-coverage.test.ts`) green — `es.json` and `zh.json` cover every `en.json` key
- [x] Guard test (`__tests__/i18n/no-hardcoded-strings.test.ts`) green — zero hardcoded literals outside legal-text exempt files
- [ ] Manual smoke (run after merge): `/en`, `/es`, `/zh` for home, newsroom, academy landing, academy slug, features, not-found

## Out of scope

- CMS-served article content (post `title`, `description`, `content`, `imageAlt`, SEO fields) — Phase B (cross-repo, CMS schema change required)
- Legal-text bodies (privacy / terms / cookie policies) — UI shells translated; legal text deferred for per-locale legal review
- User-defined post tags
- Author display names
- Kapa.ai chat widget disclaimer (third-party, requires per-locale Script-level injection)
- New locales beyond en/es/zh
