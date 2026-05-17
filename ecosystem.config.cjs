/**
 * PM2 ecosystem file for ssp-website (Next.js).
 *
 * Mirrors the ssp-cms-backend pattern: PM2 spawns `npm start`, which
 * resolves to `next start` via package.json.
 *
 * Production launch:
 *   git pull
 *   npm ci
 *   npm run build       # also runs the prebuild gate (i18n, agent-md, etc.)
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * Reload after a deploy (zero-downtime):
 *   npm run build && pm2 reload ssp-website
 *
 * Running two instances on the same host (e.g. prod + dev/staging on
 * different ports) — set PM2_APP_NAME so PM2 treats them as distinct apps:
 *   PM2_APP_NAME=ssp-website-dev pm2 start ecosystem.config.cjs
 *
 * Env precedence (highest wins):
 *   1. Shell env at `pm2 start` time      (e.g. `PORT=3010 pm2 start ...`)
 *   2. `.env.local` loaded by env_file    (the normal place to set things)
 *   3. Next.js defaults                   (PORT=3000 if nothing else set it)
 *
 * Required env (set in `.env.local` at the repo root, gitignored):
 *   SSP_CMS_URL=https://cms.sspwallet.com
 *   SSP_CMS_API_KEY=<the key issued by the CMS for this deploy slot>
 *
 * Optional:
 *   PORT=3005                   # picks the listen port; Next defaults to 3000
 *   NEXT_PUBLIC_GA_ID=G-XXXXX   # only set if this slot should track GA
 *   AGENT_MD=0                  # disables the Accept: text/markdown content path
 *
 * Note on SSP_CMS_URL: it is read by next.config.ts during `npm run build`
 * to compile the next/image remote-host whitelist. If the build runs without
 * SSP_CMS_URL set, CMS-hosted images will fail with `hostname not configured`
 * at runtime even if PM2 injects it later. Set it before building.
 */
module.exports = {
  apps: [
    {
      name: process.env.PM2_APP_NAME ?? 'ssp-website',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      // Only set values here that should NEVER be overridable by .env.local.
      // PM2's `env` block always overrides `env_file`, so anything listed here
      // will silently clobber the user's .env.local. PORT belongs in .env.local
      // so it can be tuned per deploy slot without touching this file.
      env: {
        NODE_ENV: 'production',
      },
      env_file: '.env.local',
      max_memory_restart: '1024M',
      autorestart: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
