#!/usr/bin/env tsx
/**
 * check-translations.ts
 *
 * Audit src/messages/<locale>.json files for translation quality issues:
 *  - Residual __TODO_TRANSLATE__ markers
 *  - ICU placeholder drift vs en.json
 *  - Key-structure drift vs en.json
 *  - Locked-term translation (from docs/i18n/glossary.md section 1)
 *
 * Exits 0 if clean; non-zero with a per-locale report otherwise.
 * Run as part of prebuild, or directly: `npx tsx scripts/check-translations.ts`
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { routing } from '../src/i18n/routing'

const REPO_ROOT = process.cwd()
const MARKER = '__TODO_TRANSLATE__'

// Matches simple placeholders like {name}, {count}
const SIMPLE_PLACEHOLDER_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\}/g
// Matches ICU complex expressions: {varName, plural/select/selectordinal, ...}
const ICU_COMPLEX_RE = /\{([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*(?:plural|select|selectordinal)\s*,/g
// Matches rich-text open/close tags like <link>, </link>
const RICH_TEXT_OPEN_RE = /<[a-zA-Z][a-zA-Z0-9-]*>/g
const RICH_TEXT_CLOSE_RE = /<\/[a-zA-Z][a-zA-Z0-9-]*>/g

type LeafEntry = { path: string; value: string }

export function findPlaceholderResiduals(tree: unknown, prefix = ''): string[] {
  if (typeof tree === 'string') {
    return tree.includes(MARKER) ? [prefix] : []
  }
  if (Array.isArray(tree)) {
    return tree.flatMap((v, i) => findPlaceholderResiduals(v, `${prefix}[${i}]`))
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.entries(tree).flatMap(([k, v]) =>
      findPlaceholderResiduals(v, prefix ? `${prefix}.${k}` : k)
    )
  }
  return []
}

export function diffIcuPlaceholders(
  source: string,
  target: string
): { missing: string[]; extra: string[] } {
  const extract = (s: string): string[] => {
    const tokens: string[] = []
    // Extract complex ICU (plural/select) — normalise to just {varName}
    for (const m of s.matchAll(ICU_COMPLEX_RE)) tokens.push(`{${m[1]}}`)
    // Strip complex ICU blocks so their inner {…} don't get double-counted
    const stripped = s.replace(
      /\{[a-zA-Z_][a-zA-Z0-9_]*\s*,\s*(?:plural|select|selectordinal)\s*,.*$/gs,
      ''
    )
    // Simple placeholders
    for (const m of stripped.matchAll(SIMPLE_PLACEHOLDER_RE)) tokens.push(m[0])
    // Rich-text tags
    for (const m of s.matchAll(RICH_TEXT_OPEN_RE)) tokens.push(m[0])
    for (const m of s.matchAll(RICH_TEXT_CLOSE_RE)) tokens.push(m[0])
    return tokens.sort()
  }
  const src = extract(source)
  const tgt = extract(target)
  const srcCount = new Map<string, number>()
  for (const p of src) srcCount.set(p, (srcCount.get(p) ?? 0) + 1)
  const tgtCount = new Map<string, number>()
  for (const p of tgt) tgtCount.set(p, (tgtCount.get(p) ?? 0) + 1)
  const missing: string[] = []
  const extra: string[] = []
  for (const [p, n] of srcCount) {
    const t = tgtCount.get(p) ?? 0
    for (let i = 0; i < n - t; i++) missing.push(p)
  }
  for (const [p, n] of tgtCount) {
    const s = srcCount.get(p) ?? 0
    for (let i = 0; i < n - s; i++) extra.push(p)
  }
  return { missing, extra }
}

function collectLeafPaths(tree: unknown, prefix = ''): Set<string> {
  if (tree === null || typeof tree !== 'object') return new Set([prefix])
  if (Array.isArray(tree)) {
    const out = new Set<string>()
    tree.forEach((v, i) => collectLeafPaths(v, `${prefix}[${i}]`).forEach(p => out.add(p)))
    return out
  }
  const out = new Set<string>()
  for (const [k, v] of Object.entries(tree)) {
    collectLeafPaths(v, prefix ? `${prefix}.${k}` : k).forEach(p => out.add(p))
  }
  return out
}

export function diffLeafPaths(
  source: unknown,
  target: unknown
): { missing: string[]; extra: string[] } {
  const src = collectLeafPaths(source)
  const tgt = collectLeafPaths(target)
  return {
    missing: [...src].filter(p => !tgt.has(p)).sort(),
    extra: [...tgt].filter(p => !src.has(p)).sort(),
  }
}

function collectLeafEntries(tree: unknown, prefix = ''): LeafEntry[] {
  if (typeof tree === 'string') return [{ path: prefix, value: tree }]
  if (Array.isArray(tree)) {
    return tree.flatMap((v, i) => collectLeafEntries(v, `${prefix}[${i}]`))
  }
  if (tree !== null && typeof tree === 'object') {
    return Object.entries(tree).flatMap(([k, v]) =>
      collectLeafEntries(v, prefix ? `${prefix}.${k}` : k)
    )
  }
  return []
}

export function findLockedTermTranslations(
  source: unknown,
  target: unknown,
  lockedTerms: readonly string[]
): { path: string; term: string }[] {
  const srcEntries = new Map(collectLeafEntries(source).map(e => [e.path, e.value]))
  const tgtEntries = new Map(collectLeafEntries(target).map(e => [e.path, e.value]))
  const issues: { path: string; term: string }[] = []
  for (const [p, srcVal] of srcEntries) {
    const tgtVal = tgtEntries.get(p)
    if (typeof tgtVal !== 'string') continue
    for (const term of lockedTerms) {
      if (srcVal.includes(term) && !tgtVal.includes(term)) {
        issues.push({ path: p, term })
      }
    }
  }
  return issues
}

async function parseGlossaryLockedTerms(glossaryPath: string): Promise<string[]> {
  const raw = await fs.readFile(glossaryPath, 'utf8')
  const startIdx = raw.indexOf('## 1.')
  if (startIdx < 0) return []
  const after = raw.slice(startIdx)
  const endIdx = after.indexOf('\n## 2.')
  const section = endIdx > 0 ? after.slice(0, endIdx) : after
  const terms: string[] = []
  for (const line of section.split('\n')) {
    const m = line.match(/^-\s+([^,()\n]+)/)
    if (!m) continue
    const term = m[1].trim()
    if (term.includes('<') || term.includes('>')) continue
    if (term.length > 0) terms.push(term)
  }
  return terms
}

async function main(): Promise<void> {
  const messagesDir = path.join(REPO_ROOT, 'src/messages')
  const glossaryPath = path.join(REPO_ROOT, 'docs/i18n/glossary.md')
  const enRaw = await fs.readFile(path.join(messagesDir, 'en.json'), 'utf8')
  const en = JSON.parse(enRaw) as unknown
  const lockedTerms = await parseGlossaryLockedTerms(glossaryPath)

  const otherLocales = routing.locales.filter(l => l !== 'en')
  const failures: { locale: string; reason: string; detail: string }[] = []

  for (const locale of otherLocales) {
    const localePath = path.join(messagesDir, `${locale}.json`)
    let localeJson: unknown
    try {
      localeJson = JSON.parse(await fs.readFile(localePath, 'utf8'))
    } catch (err) {
      failures.push({
        locale,
        reason: 'missing-or-invalid',
        detail: err instanceof Error ? err.message : String(err),
      })
      continue
    }

    const residuals = findPlaceholderResiduals(localeJson)
    if (residuals.length > 0) {
      failures.push({
        locale,
        reason: 'placeholder-residuals',
        detail: `${residuals.length} keys still contain __TODO_TRANSLATE__: ${residuals.slice(0, 5).join(', ')}${residuals.length > 5 ? '…' : ''}`,
      })
    }

    const pathDiff = diffLeafPaths(en, localeJson)
    if (pathDiff.missing.length > 0 || pathDiff.extra.length > 0) {
      failures.push({
        locale,
        reason: 'key-structure-drift',
        detail: `missing in target: ${pathDiff.missing.slice(0, 5).join(', ') || '(none)'}; extra: ${pathDiff.extra.slice(0, 5).join(', ') || '(none)'}`,
      })
    }

    const srcEntries = collectLeafEntries(en)
    const tgtMap = new Map(collectLeafEntries(localeJson).map(e => [e.path, e.value]))
    const icuDriftPaths: string[] = []
    for (const e of srcEntries) {
      const tgtVal = tgtMap.get(e.path)
      if (typeof tgtVal !== 'string') continue
      const d = diffIcuPlaceholders(e.value, tgtVal)
      if (d.missing.length > 0 || d.extra.length > 0) icuDriftPaths.push(e.path)
    }
    if (icuDriftPaths.length > 0) {
      failures.push({
        locale,
        reason: 'icu-drift',
        detail: `${icuDriftPaths.length} keys have placeholder drift: ${icuDriftPaths.slice(0, 5).join(', ')}${icuDriftPaths.length > 5 ? '…' : ''}`,
      })
    }

    const lockedIssues = findLockedTermTranslations(en, localeJson, lockedTerms)
    if (lockedIssues.length > 0) {
      const summary = lockedIssues
        .slice(0, 5)
        .map(i => `${i.path}=${i.term}`)
        .join(', ')
      failures.push({
        locale,
        reason: 'locked-term-translated',
        detail: `${lockedIssues.length} locked-term occurrences missing in target: ${summary}${lockedIssues.length > 5 ? '…' : ''}`,
      })
    }
  }

  if (failures.length === 0) {
    process.stdout.write(`check-translations: ${otherLocales.length} locale(s) clean\n`)
    process.exit(0)
  }
  process.stderr.write(`check-translations: ${failures.length} issue(s)\n\n`)
  for (const f of failures) {
    process.stderr.write(`  [${f.locale}] ${f.reason}: ${f.detail}\n`)
  }
  process.exit(1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => {
    process.stderr.write(
      `check-translations failed: ${err instanceof Error ? err.message : String(err)}\n`
    )
    process.exit(1)
  })
}
