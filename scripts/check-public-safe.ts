#!/usr/bin/env tsx
// Refuses to build if /content, agent.md files, or env files contain likely-private data.

import { promises as fs } from 'fs'
import path from 'path'

const ROOT = process.cwd()

const PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\.internal\./i, reason: '"internal" hostname' },
  { pattern: /sk_live_[A-Za-z0-9]{16,}/, reason: 'looks like a live API key' },
  { pattern: /\bcms\.internal\./i, reason: 'internal CMS hostname' },
  { pattern: /AKIA[0-9A-Z]{16}/, reason: 'AWS access key id' },
  { pattern: /-----BEGIN (RSA|EC) PRIVATE KEY-----/, reason: 'private key blob' },
  {
    pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    reason: 'IP address literal (allowlist 0.0.0.0, 127.0.0.1)',
  },
]

const ALLOWED_IPS = new Set(['0.0.0.0', '127.0.0.1', '255.255.255.255'])

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(p)))
    else out.push(p)
  }
  return out
}

async function main() {
  const checkRoots = [
    path.join(ROOT, 'content'),
    path.join(ROOT, 'src/app'),
    path.join(ROOT, '.env.example'),
  ]
  const offenders: string[] = []
  for (const root of checkRoots) {
    const stat = await fs.stat(root).catch(() => null)
    if (!stat) continue
    const files = stat.isDirectory() ? await walk(root) : [root]
    for (const f of files) {
      if (!/\.(md|json|ts|tsx|env|env\.example)$/.test(f) && !f.endsWith('.env.example')) continue
      const text = await fs.readFile(f, 'utf8').catch(() => '')
      for (const { pattern, reason } of PATTERNS) {
        const m = text.match(pattern)
        if (!m) continue
        if (reason.includes('IP address') && ALLOWED_IPS.has(m[0])) continue
        offenders.push(`${path.relative(ROOT, f)}: ${reason} (matched: ${m[0]})`)
      }
    }
  }
  if (offenders.length > 0) {
    // eslint-disable-next-line no-console
    console.error('check-public-safe FAILED:')
    for (const o of offenders)
      // eslint-disable-next-line no-console
      console.error(`  - ${o}`)
    process.exit(1)
  }
  // eslint-disable-next-line no-console
  console.log('check-public-safe passed.')
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
