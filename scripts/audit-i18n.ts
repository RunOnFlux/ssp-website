#!/usr/bin/env tsx
// Audits the codebase for hard-coded English literals that should be translated.
// Walks src/app/[locale], src/components, and root-level error pages, then reports
// likely literals grouped by file. The output is a worklist for i18n fix tasks.

import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

// Strings intentionally left untranslated -- brand names, social platform names,
// and brand surfaces that appear in JSON-LD constants.
const ALLOW = new Set<string>([
  'SSP',
  'Flux',
  'Newsroom',
  'Academy',
  'GitHub',
  'Discord',
  'Twitter',
  'YouTube',
  'Medium',
  'Reddit',
  'Telegram',
  'Facebook',
  'LinkedIn',
])

type Hit = {
  file: string
  line: number
  reason: 'JSX text' | 'prop literal'
  match: string
  source: string
}

const SKIP_DIRS = new Set(['node_modules', '.next', '.worktrees', '.git'])

function shouldSkipFile(name: string): boolean {
  if (name.endsWith('.test.tsx')) return true
  if (name.endsWith('.test.ts')) return true
  if (name.endsWith('.stories.tsx')) return true
  return false
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  for (const e of entries) {
    if (SKIP_DIRS.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...(await walk(p)))
    } else if (e.isFile()) {
      if (!/\.(tsx|ts)$/.test(e.name)) continue
      if (shouldSkipFile(e.name)) continue
      out.push(p)
    }
  }
  return out
}

async function fileExists(p: string): Promise<boolean> {
  try {
    const s = await fs.stat(p)
    return s.isFile()
  } catch {
    return false
  }
}

function scanFile(filePath: string, contents: string): Hit[] {
  const hits: Hit[] = []
  const lines = contents.split('\n')

  // Pattern 1: JSX text node, multi-word capitalized
  const reMultiWord = /(?:^|>)\s*([A-Z][a-zA-Z]{2,}[a-z](?:[ \-][A-Z]?[a-zA-Z]+)+)\s*</g
  // Pattern 2: JSX text node, single capitalized word >=5 chars
  const reSingleWord = /(?:^|>)\s*([A-Z][a-zA-Z]{4,})\s*</g
  // Pattern 3: Prop literals
  const reProp = /(title|description|aria-label|aria-description|placeholder|alt)=['"]([A-Z][^'"<>{}]{3,})['"]/g

  for (let i = 0; i < lines.length; i++) {
    const lineNo = i + 1
    const line = lines[i]
    const trimmed = line.trim()

    // Skip obvious comment lines (purely heuristic)
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue

    // Pattern 1
    reMultiWord.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = reMultiWord.exec(line)) !== null) {
      const captured = m[1].trim()
      if (ALLOW.has(captured)) continue
      hits.push({
        file: filePath,
        line: lineNo,
        reason: 'JSX text',
        match: captured,
        source: trimmed,
      })
    }

    // Pattern 2
    reSingleWord.lastIndex = 0
    while ((m = reSingleWord.exec(line)) !== null) {
      const captured = m[1].trim()
      if (ALLOW.has(captured)) continue
      // Skip duplicates already caught by multi-word pattern on same line
      if (hits.some(h => h.line === lineNo && h.match === captured)) continue
      hits.push({
        file: filePath,
        line: lineNo,
        reason: 'JSX text',
        match: captured,
        source: trimmed,
      })
    }

    // Pattern 3
    reProp.lastIndex = 0
    while ((m = reProp.exec(line)) !== null) {
      const captured = m[2].trim()
      if (ALLOW.has(captured)) continue
      hits.push({
        file: filePath,
        line: lineNo,
        reason: 'prop literal',
        match: `${m[1]}='${captured}'`,
        source: trimmed,
      })
    }
  }

  return hits
}

async function main(): Promise<void> {
  const roots = [
    path.join(ROOT, 'src/app/[locale]'),
    path.join(ROOT, 'src/components'),
  ]
  const optionalFiles = [
    path.join(ROOT, 'src/app/not-found.tsx'),
    path.join(ROOT, 'src/app/error.tsx'),
    path.join(ROOT, 'src/app/global-error.tsx'),
  ]

  const files: string[] = []
  for (const root of roots) {
    const exists = await fs.stat(root).catch(() => null)
    if (!exists) continue
    files.push(...(await walk(root)))
  }
  for (const f of optionalFiles) {
    if (await fileExists(f)) files.push(f)
  }

  const allHits: Hit[] = []
  for (const f of files) {
    const text = await fs.readFile(f, 'utf8').catch(() => '')
    if (!text) continue
    allHits.push(...scanFile(f, text))
  }

  // Group by file path (relative, sorted)
  const byFile = new Map<string, Hit[]>()
  for (const h of allHits) {
    const rel = path.relative(ROOT, h.file)
    if (!byFile.has(rel)) byFile.set(rel, [])
    byFile.get(rel)!.push(h)
  }
  const sortedFiles = [...byFile.keys()].sort()

  // Render markdown
  const out: string[] = []
  out.push('# i18n literal audit')
  out.push('')
  out.push('Generated: 2026-05-07')
  out.push(`Total hits: ${allHits.length} across ${sortedFiles.length} files`)
  out.push('')

  for (const f of sortedFiles) {
    const hits = byFile.get(f)!
    out.push(`## \`${f}\``)
    out.push('')
    for (const h of hits) {
      const src = h.source.replace(/`/g, '\\`')
      out.push(`- **L${h.line}** (${h.reason}): \`${src}\``)
    }
    out.push('')
  }

  process.stdout.write(out.join('\n'))
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
