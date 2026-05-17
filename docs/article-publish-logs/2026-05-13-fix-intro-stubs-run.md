# Execution log — fix-intro-stubs

- **Date:** 2026-05-13
- **Script:** `scripts/fix-intro-stubs.ts`
- **CMS URL:** http://localhost:3007
- **Post modified:**
  - id `6a02ea97fe4d3e137fdaa7b3` (intro post — slug: meet-ssp-wallet-self-custody-with-2-of-2-multisig)
  - 28 anchor rewrites total across 14 locales (2 per locale)
- **Rules applied:**
  - `](/academy/getting-started)` → `](/academy/getting-started/setting-up-your-first-ssp-wallet)`
  - `](/academy/multisig)` → `](/academy/multisig/what-is-2-of-2-multisig)`
- **Idempotency:** re-running the script reported `Nothing to do.`
- **Smoke test:**
  - Admin API: 0 bare anchors, 28 deep anchors confirmed
  - Public API: `GET /api/v1/posts/meet-ssp-wallet-self-custody-with-2-of-2-multisig?locale=en` → 200
- **8 deep targets verified live before run:** all 200
