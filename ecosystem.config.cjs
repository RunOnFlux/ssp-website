/**
 * PM2 ecosystem file for ssp-website (Next.js).
 *
 * Mirrors the ssp-cms-backend pattern: PM2 spawns `npm start`, which
 * resolves to `next start` via package.json. Port is taken from the
 * environment (default 3001) so the same file works for any deploy slot.
 *
 * Production launch:
 *   git pull
 *   npm ci
 *   npm run build       # also runs the prebuild gate (i18n, agent-md, etc.)
 *   pm2 start ecosystem.config.cjs       # uses PORT from .env.local or shell, defaults to 3001
 *   pm2 save
 *
 * Overriding the port for a one-off:
 *   PORT=3010 pm2 start ecosystem.config.cjs
 *
 * Reload after a deploy (zero-downtime):
 *   npm run build && pm2 reload ssp-website
 *
 * Required env (set in `.env.local` at the repo root, gitignored):
 *   SSP_CMS_URL=https://cms.sspwallet.com
 *   SSP_CMS_API_KEY=<the key issued by the CMS for this deploy slot>
 *
 * Optional:
 *   PORT=3001                   # if absent, the env block default below applies
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
      name: 'ssp-website',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      exec_mode: 'fork',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT ?? '3001',
      },
      env_file: '.env.local',
      max_memory_restart: '1024M',
      autorestart: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
}
