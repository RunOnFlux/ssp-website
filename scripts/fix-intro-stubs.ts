#!/usr/bin/env tsx
/**
 * One-shot script: re-point bare category-hub anchors in published CMS posts
 * to the specific deep articles they were obviously meant to reference.
 *
 * Idempotent — anchors that already point at a deeper path are skipped.
 *
 * Env required:
 *   SSP_CMS_URL                 (defaults to http://localhost:3007)
 *   SSP_CMS_INTERNAL_API_KEY    (required)
 *   SSP_CMS_USER_EMAIL          (defaults to info@bbsolutions.services)
 *
 * Usage:
 *   npx tsx scripts/fix-intro-stubs.ts
 */
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

const BASE_URL = process.env.SSP_CMS_URL ?? 'http://localhost:3007'
const KEY = process.env.SSP_CMS_INTERNAL_API_KEY
const USER_EMAIL = process.env.SSP_CMS_USER_EMAIL ?? 'info@bbsolutions.services'

if (!KEY) {
  console.error('Missing SSP_CMS_INTERNAL_API_KEY')
  process.exit(1)
}

const STUB_RULES: Array<{ from: string; to: string }> = [
  {
    from: '](/academy/getting-started)',
    to: '](/academy/getting-started/setting-up-your-first-ssp-wallet)',
  },
  {
    from: '](/academy/multisig)',
    to: '](/academy/multisig/what-is-2-of-2-multisig)',
  },
]

interface Translation {
  locale?: string
  body?: string
  content?: string
  [key: string]: unknown
}

interface AdminPost {
  _id: string
  slug: string
  translations: Record<string, Translation> | Translation[]
  [key: string]: unknown
}

function adminHeaders(): Record<string, string> {
  return {
    'x-api-key': KEY as string,
    'x-user-role': 'admin',
    'x-user-email': USER_EMAIL,
    'content-type': 'application/json',
  }
}

async function fetchAllPosts(): Promise<AdminPost[]> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/posts?status=published&limit=500`, {
    headers: adminHeaders(),
  })
  if (!res.ok) {
    throw new Error(`GET posts failed: ${res.status} ${await res.text()}`)
  }
  const data = (await res.json()) as { posts?: AdminPost[] } | AdminPost[]
  return Array.isArray(data) ? data : (data.posts ?? [])
}

interface RewriteResult {
  body: string
  modifications: number
}

function rewriteBody(body: string): RewriteResult {
  let next = body
  let modifications = 0
  for (const rule of STUB_RULES) {
    const before = next
    next = next.split(rule.from).join(rule.to)
    if (next !== before) {
      modifications += before.split(rule.from).length - 1
    }
  }
  return { body: next, modifications }
}

// Normalize translations into an iterable of [locale, body-or-content] tuples,
// because some CMS responses key translations by object and others by array.
function translationEntries(post: AdminPost): Array<[string, Translation, 'body' | 'content']> {
  const entries: Array<[string, Translation, 'body' | 'content']> = []
  if (Array.isArray(post.translations)) {
    for (const t of post.translations) {
      const locale = t.locale ?? 'unknown'
      const field: 'body' | 'content' = typeof t.body === 'string' ? 'body' : 'content'
      entries.push([locale, t, field])
    }
  } else {
    for (const [locale, t] of Object.entries(post.translations)) {
      const field: 'body' | 'content' = typeof t.body === 'string' ? 'body' : 'content'
      entries.push([locale, t, field])
    }
  }
  return entries
}

function summarisePost(post: AdminPost): { hits: number; perLocale: Array<[string, number]> } {
  let hits = 0
  const perLocale: Array<[string, number]> = []
  for (const [locale, t, field] of translationEntries(post)) {
    const body = typeof t[field] === 'string' ? (t[field] as string) : ''
    if (!body) continue
    const r = rewriteBody(body)
    if (r.modifications > 0) {
      hits += r.modifications
      perLocale.push([locale, r.modifications])
    }
  }
  return { hits, perLocale }
}

function applyRewriteInPlace(post: AdminPost): AdminPost {
  const entries = translationEntries(post)
  if (Array.isArray(post.translations)) {
    const next: Translation[] = post.translations.map((t, i) => {
      const [, , field] = entries[i]
      const body = typeof t[field] === 'string' ? (t[field] as string) : ''
      const r = rewriteBody(body)
      if (r.modifications === 0) return t
      return { ...t, [field]: r.body }
    })
    return { ...post, translations: next }
  }
  const next: Record<string, Translation> = {}
  for (const [locale, t] of Object.entries(post.translations)) {
    const field: 'body' | 'content' = typeof t.body === 'string' ? 'body' : 'content'
    const body = typeof t[field] === 'string' ? (t[field] as string) : ''
    const r = rewriteBody(body)
    next[locale] = r.modifications === 0 ? t : { ...t, [field]: r.body }
  }
  return { ...post, translations: next }
}

async function putPost(post: AdminPost): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/admin/posts/${post._id}`, {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify(post),
  })
  if (!res.ok) {
    throw new Error(`PUT post ${post._id} failed: ${res.status} ${await res.text()}`)
  }
}

async function main() {
  console.log(`Scanning ${BASE_URL}/api/v1/admin/posts for stub anchors…`)
  const posts = await fetchAllPosts()
  const affected: Array<{
    post: AdminPost
    hits: number
    perLocale: Array<[string, number]>
  }> = []
  for (const post of posts) {
    const { hits, perLocale } = summarisePost(post)
    if (hits > 0) affected.push({ post, hits, perLocale })
  }
  if (affected.length === 0) {
    console.log('No posts contain bare /academy/getting-started or /academy/multisig anchors.')
    console.log('Nothing to do.')
    return
  }
  console.log(`\nFound ${affected.length} post(s) with stub anchors:\n`)
  for (const a of affected) {
    console.log(`  - ${a.post.slug} (${a.post._id}): ${a.hits} total`)
    for (const [loc, n] of a.perLocale) console.log(`      ${loc}: ${n}`)
  }
  const rl = createInterface({ input: stdin, output: stdout })
  const answer = (await rl.question('\nProceed? [y/N] ')).trim().toLowerCase()
  rl.close()
  if (answer !== 'y' && answer !== 'yes') {
    console.log('Aborted.')
    return
  }
  for (const { post } of affected) {
    const updated = applyRewriteInPlace(post)
    await putPost(updated)
    console.log(`  ✓ updated ${post.slug}`)
  }
  console.log('\nDone.')
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
