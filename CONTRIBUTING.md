# Contributing to ssp-website

Thank you for your interest in contributing. This document covers the conventions you need to know before opening a pull request. For deeper guidance on the architecture, generated files, and agent surface, see [CLAUDE.md](CLAUDE.md).

## Branch naming

Use the pattern `feat/<short-description>`, `fix/<short-description>`, or `docs/<short-description>`. Keep it lowercase with hyphens.

## Commit style

- Use conventional commits: `feat(scope): subject`, `fix(scope): subject`, `docs(scope): subject`, etc.
- Keep the subject under 72 characters.
- GPG-sign every commit. Never pass `--no-gpg-sign` or otherwise bypass signing.
- Do not include AI attribution trailers (no "Co-authored-by: Claude" lines). Plain commits only.

## Sibling agent.md is required

Every `src/app/[locale]/<route>/page.tsx` must have a sibling `agent.md` in the same directory. If you add or materially change a `page.tsx`, update its `agent.md` in the same commit. The `prebuild` step (`scripts/check-agent-md-staleness.ts`) will block the build otherwise.

If you genuinely need to skip the check (e.g. a refactor with no content change), include `[agent-md-skip]` in the commit message with a one-line reason.

## Public-safe content rule

This repository is public on GitHub. Never commit:

- Internal hostnames or URLs (`*.internal.*`)
- API keys, AWS keys, or private key blobs
- Embargoed roadmap items or unreleased product names

`scripts/check-public-safe.ts` runs on every `npm run build` and will fail the build if it finds these patterns. Run `npm run check:public-safe` before pushing.

## Quality checks

Run these before opening a PR:

```bash
npm run check-all   # type-check + lint + format:check + test
npm run build       # runs prebuild guards (public-safe + agent.md staleness + chain SKILL.md)
```

All 83 tests must pass and the build must succeed.

## i18n

Add new user-facing strings to `src/messages/en.json` first, then translate them into every other locale file under `src/messages/` in the same PR. Preserve any ICU placeholders verbatim and keep locked terms from `docs/i18n/glossary.md` (brand names, chains, protocols) in English. Do not commit `__TODO_TRANSLATE__` placeholders.

## Pull requests

Open PRs against the `master` branch. Include a short description of what changed and why. Link any related issues.
