# CLAUDE.md — Agent guidance for the SSP website

If you are an AI agent (Claude, Cursor, Copilot, etc.) editing this repository, read this file first.

## Architecture in two paragraphs

This is a Next.js 16 App Router site with three sections: marketing pages (home, features, enterprise, etc.), newsroom (`/newsroom`), and academy (`/academy`). All routes live under `src/app/[locale]/`. Components are split between section-specific directories (`src/components/{header,footer,home,newsroom,shared}/`) and shared UI. Data flows through `src/lib/cms.ts`, which prefers a remote CMS when `SSP_CMS_URL` and `SSP_CMS_API_KEY` are set, but falls back silently to the seeded Markdown in `/content/` when they are not.

Every public route has a sibling `agent.md` file that is served when a request arrives with `Accept: text/markdown`. This is the agent-readable mirror of every page. Dynamic routes (newsroom articles, academy articles, author profiles) synthesise their `agent.md` body on the fly from the same `NewsroomPost` / `Author` data the HTML page uses. The middleware at `src/middleware.ts` handles both locale routing and the `Accept: text/markdown` content-negotiation path.

## Patterns to follow

**Sibling agent.md is required.** If you edit `src/app/[locale]/<route>/page.tsx`, you almost always need to update `src/app/[locale]/<route>/agent.md` in the same commit. The `prebuild` step (`scripts/check-agent-md-staleness.ts`) blocks the build otherwise. Escape hatch: include `[agent-md-skip]` in the commit message with a one-line reason.

**Public-safe content only.** No internal hostnames, no live API keys, no embargoed roadmap items. `scripts/check-public-safe.ts` enforces this. The repo is public on GitHub.

**Locale-aware navigation.** Always import `Link` from `@/i18n/navigation`, never from `next/link`. Same for `useRouter` and `usePathname`. Direct use of the Next.js primitives bypasses locale prefix handling.

**i18n keys.** All user-facing strings flow through `useTranslations('Namespace')`. Add new keys to `src/messages/en.json` first; replicate to `es.json` and `zh.json` with `__TODO_TRANSLATE__` markers, preserving any ICU placeholders.

**CMS abstraction.** Use functions from `@/lib/cms.ts` — never call `cmsFetch` or the seed loader directly. The wrapper provides LRU caching (256 entries, 60 s TTL) and seed-fallback.

## Generated artifacts

`src/app/api/agent-skills/skills/list-supported-chains/SKILL.md` is auto-generated from `src/constants/supported-chains.ts` by `scripts/generate-chains-skill.ts` on every build. Do not edit it by hand — your changes will be overwritten on the next `npm run build`.

## Files to handle with care

- `src/middleware.ts` — handles locale routing AND `Accept: text/markdown` content negotiation. Carries `export const runtime = 'nodejs'` because it reads files at request time.
- `src/app/robots.txt/route.ts` — agent-traffic policy for the whole site.
- `scripts/check-*.ts` — guard rails for the build. If they fail, fix the source; do not comment them out or bypass them.
- `package.json` `prebuild` field — orchestrates the checks; runs before every `next build`.

## Commit conventions

- GPG-signed commits. Never pass `--no-gpg-sign`.
- Author: `Stultus Mundi <bmg.stultusmundi@gmail.com>`.
- No AI attribution trailers in commit messages. Plain `feat(scope): subject` style.
- Keep commits atomic per task. If a single change spans multiple concerns, one commit with multiple paths is fine.

## i18n source of truth

`src/messages/en.json` is the canonical English copy. `es.json` and `zh.json` contain `__TODO_TRANSLATE__` markers until human translators replace them. Do not machine-translate.

## When in doubt

- Read the migration plan at `docs/superpowers/plans/2026-04-27-newsroom-academy-app-router-migration.md`.
- Read the spec at `docs/superpowers/specs/2026-04-27-newsroom-academy-app-router-migration-design.md`.
- Run `npm run check-all` before opening a PR.
