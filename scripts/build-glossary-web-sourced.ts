#!/usr/bin/env tsx
/**
 * One-shot data-fetching script for the glossary's web-sourced layer.
 *
 * Walks a curated set of Wikipedia crypto-related categories via the
 * MediaWiki Action API, fetches each member article's summary via the
 * REST API, and writes the deduplicated set to
 * src/constants/glossary/web-sourced.json.
 *
 * Wikipedia content is CC-BY-SA 3.0; attribution lives in the glossary
 * page footer (see Glossary.attribution translation key).
 *
 * Run manually when refreshing the dataset:
 *   npx tsx scripts/build-glossary-web-sourced.ts
 *
 * Network responses are cached to .glossary-cache/ (gitignored) so re-runs
 * are deterministic and offline-friendly.
 */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import type { GlossaryEntrySource } from '../src/constants/glossary/types'
import { normalizeSlug } from '../src/lib/glossary-utils'

const CACHE_DIR = '.glossary-cache'
const OUTPUT_PATH = 'src/constants/glossary/web-sourced.json'
const USER_AGENT = 'ssp-glossary-build/1.0 (https://sspwallet.io; contact@sspwallet.io)'
const FETCH_DELAY_MS = 200

const CATEGORIES = [
  'Cryptocurrencies',
  'Blockchains',
  'Cryptography',
  'Bitcoin',
  'Ethereum',
  'Decentralized_finance',
  'Cryptocurrency_companies',
  'Smart_contracts',
  'Cryptographic_protocols',
  'Cryptographic_hash_functions',
  'Public-key_cryptography',
  'Cryptocurrency_wallets',
  'Stablecoins',
  'Non-fungible_tokens',
  'Cryptocurrency_exchanges',
  'Initial_coin_offerings',
  'Decentralized_autonomous_organizations',
  'Digital_currencies',
  'Cryptographic_primitives',
  'Cryptocurrency_mining',
]

interface WikiCategoryMember {
  ns: number
  title: string
}

interface WikiSummary {
  type?: string
  title?: string
  extract?: string
  description?: string
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

function safeFileName(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 200)
}

async function fetchCached(url: string, cacheKey: string): Promise<string | null> {
  const cachePath = path.join(CACHE_DIR, safeFileName(cacheKey))
  try {
    return await fs.readFile(cachePath, 'utf-8')
  } catch {
    // Not cached; fetch fresh
  }
  await sleep(FETCH_DELAY_MS)
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (res.status === 404) {
    console.warn('  404: ' + url)
    return null
  }
  if (!res.ok) {
    console.warn('  HTTP ' + res.status + ': ' + url)
    return null
  }
  const text = await res.text()
  await fs.mkdir(CACHE_DIR, { recursive: true })
  await fs.writeFile(cachePath, text)
  return text
}

async function fetchCategoryMembers(category: string): Promise<string[]> {
  const titles: string[] = []
  let cmcontinue: string | undefined = undefined
  let pageNum = 0
  do {
    pageNum++
    const params = new URLSearchParams({
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Category:' + category,
      cmlimit: '500',
      cmtype: 'page',
      format: 'json',
    })
    if (cmcontinue) params.set('cmcontinue', cmcontinue)
    const url = 'https://en.wikipedia.org/w/api.php?' + params.toString()
    const cacheKey = 'catmembers__' + category + '__p' + pageNum
    const body = await fetchCached(url, cacheKey)
    if (!body) return titles
    let data: {
      query?: { categorymembers?: WikiCategoryMember[] }
      continue?: { cmcontinue?: string }
    }
    try {
      data = JSON.parse(body)
    } catch {
      console.warn('  parse error on ' + category + ' page ' + pageNum)
      return titles
    }
    const members = data.query?.categorymembers ?? []
    for (const m of members) {
      if (m.ns === 0) titles.push(m.title)
    }
    cmcontinue = data.continue?.cmcontinue
  } while (cmcontinue)
  return titles
}

async function fetchPageSummary(title: string): Promise<GlossaryEntrySource | null> {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'))
  const url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encoded
  const body = await fetchCached(url, 'summary__' + title)
  if (!body) return null
  let summary: WikiSummary
  try {
    summary = JSON.parse(body)
  } catch {
    return null
  }
  if (summary.type === 'disambiguation') return null
  const cleanTitle = (summary.title ?? title).trim()
  const extract = (summary.extract ?? '').trim()
  if (!extract || extract.length < 40) return null
  // Filter out list / category meta articles
  if (/^(List of|Index of|Outline of|Comparison of|Timeline of)/i.test(cleanTitle)) return null
  if (cleanTitle.length > 80) return null
  return {
    title: cleanTitle,
    slug: normalizeSlug(cleanTitle),
    excerpt: extract,
  }
}

async function loadExistingSlugs(): Promise<Set<string>> {
  const cmcPath = 'src/constants/glossary/cmc.json'
  const sspPath = 'src/constants/glossary/ssp-curated.json'
  const slugs = new Set<string>()
  for (const p of [cmcPath, sspPath]) {
    const raw = await fs.readFile(p, 'utf-8')
    for (const entry of JSON.parse(raw) as GlossaryEntrySource[]) {
      slugs.add(normalizeSlug(entry.slug))
    }
  }
  return slugs
}

async function main() {
  const existing = await loadExistingSlugs()
  console.log('existing slugs (cmc + ssp): ' + existing.size)

  // Phase 1: collect category members
  const allTitles = new Set<string>()
  for (const category of CATEGORIES) {
    const titles = await fetchCategoryMembers(category)
    console.log('  ' + category + ': ' + titles.length + ' members')
    for (const t of titles) allTitles.add(t)
  }
  console.log('unique titles across categories: ' + allTitles.size)

  // Phase 2: fetch summaries
  const entries: GlossaryEntrySource[] = []
  let fetched = 0
  let kept = 0
  for (const title of allTitles) {
    fetched++
    const entry = await fetchPageSummary(title)
    if (entry && !existing.has(normalizeSlug(entry.slug))) {
      entries.push(entry)
      kept++
    }
    if (fetched % 50 === 0) {
      console.log('  progress: ' + fetched + '/' + allTitles.size + ' fetched, ' + kept + ' kept')
    }
  }
  console.log('total summaries fetched: ' + fetched)
  console.log('novel entries (gap-filtered): ' + entries.length)

  // Phase 3: dedupe within new entries (in case two titles normalize to the same slug)
  const seen = new Set<string>()
  const deduped: GlossaryEntrySource[] = []
  for (const e of entries) {
    const key = normalizeSlug(e.slug)
    if (seen.has(key)) continue
    seen.add(key)
    deduped.push(e)
  }
  console.log('after internal dedupe: ' + deduped.length)

  // Phase 4: sort + write
  deduped.sort((a, b) => a.title.localeCompare(b.title, 'en'))
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(deduped, null, 2) + '\n')
  console.log('wrote ' + deduped.length + ' entries to ' + OUTPUT_PATH)

  const totalAfterMerge = existing.size + deduped.length
  console.log('projected total after merge: ' + totalAfterMerge)
  if (totalAfterMerge < 2000) {
    console.warn(
      'WARNING: total is ' +
        totalAfterMerge +
        ', below 2000 target. Controller will expand SSP-curated to make up the gap.'
    )
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
