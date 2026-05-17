// i18n literal audit library.
// Walks configured roots and optional individual files, reporting hard-coded
// English literals (JSX text and prop literals) that look like user-visible
// copy. The CLI in `scripts/audit-i18n.ts` is a thin wrapper around `audit()`,
// and the guard test at `__tests__/i18n/no-hardcoded-strings.test.ts` calls
// `audit()` directly with an exemption set for legal-text bodies.

import { promises as fs } from 'node:fs'
import path from 'node:path'

// Strings intentionally left untranslated -- brand names, social platform
// names, and brand surfaces that appear in JSON-LD constants. The CLI and the
// guard test both share this default set.
export const DEFAULT_ALLOW_STRINGS: ReadonlySet<string> = new Set<string>([
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
  // App-store and OS brand names -- proper nouns, never translated.
  'Google Play',
  'App Store',
  'iOS',
  'Android',
  // Brand company name appearing as legal entity attribution in policy pages
  // ("InFlux Technologies Limited"). The audit catches the "InFlux Technologies"
  // multi-word slice; the trailing "Limited" is part of the legal name and never
  // localized.
  'InFlux Technologies',
  'InFlux Technologies Limited',
])

const SKIP_DIRS = new Set(['node_modules', '.next', '.worktrees', '.git'])

export type Hit = {
  file: string
  line: number
  reason: 'JSX text' | 'prop literal'
  match: string
  source: string
}

export interface AuditConfig {
  /** Absolute paths of directories to walk recursively. */
  roots: string[]
  /** Absolute paths of optional individual files to scan if they exist. */
  optionalFiles?: string[]
  /** Strings that are intentionally never translated (proper nouns, brand names). */
  allowStrings?: ReadonlySet<string>
  /**
   * File-relative paths (relative to projectRoot, POSIX separators) that are
   * entirely exempt. Used for legal-text bodies in privacy/terms/cookie
   * policies.
   */
  exemptFiles?: ReadonlySet<string>
  /** Project root for computing relative paths. */
  projectRoot: string
}

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

function toPosixRelative(projectRoot: string, absolutePath: string): string {
  const rel = path.relative(projectRoot, absolutePath)
  return path.sep === '/' ? rel : rel.replaceAll(path.sep, '/')
}

function scanFile(filePath: string, contents: string, allow: ReadonlySet<string>): Hit[] {
  const hits: Hit[] = []
  const lines = contents.split('\n')

  // Pattern 1: JSX text node, multi-word capitalized
  const reMultiWord = /(?:^|>)\s*([A-Z][a-zA-Z]{2,}[a-z](?:[ -][A-Z]?[a-zA-Z]+)+)\s*</g
  // Pattern 2: JSX text node, single capitalized word >=5 chars
  const reSingleWord = /(?:^|>)\s*([A-Z][a-zA-Z]{4,})\s*</g
  // Pattern 3: Prop literals
  const reProp =
    /(title|description|aria-label|aria-description|placeholder|alt)=['"]([A-Z][^'"<>{}]{3,})['"]/g

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
      if (allow.has(captured)) continue
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
      if (allow.has(captured)) continue
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
      if (allow.has(captured)) continue
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

export async function audit(config: AuditConfig): Promise<Hit[]> {
  const allow = config.allowStrings ?? DEFAULT_ALLOW_STRINGS
  const exempt = config.exemptFiles ?? new Set<string>()

  const files: string[] = []
  for (const root of config.roots) {
    const exists = await fs.stat(root).catch(() => null)
    if (!exists) continue
    files.push(...(await walk(root)))
  }
  for (const f of config.optionalFiles ?? []) {
    if (await fileExists(f)) files.push(f)
  }

  const allHits: Hit[] = []
  for (const f of files) {
    const rel = toPosixRelative(config.projectRoot, f)
    if (exempt.has(rel)) continue
    const text = await fs.readFile(f, 'utf8').catch(() => '')
    if (!text) continue
    allHits.push(...scanFile(f, text, allow))
  }

  return allHits
}

export function formatHits(hits: Hit[], projectRoot?: string): string {
  // Group by file path (relative if projectRoot is supplied, sorted)
  const byFile = new Map<string, Hit[]>()
  for (const h of hits) {
    const key = projectRoot ? toPosixRelative(projectRoot, h.file) : h.file
    if (!byFile.has(key)) byFile.set(key, [])
    byFile.get(key)!.push(h)
  }
  const sortedFiles = [...byFile.keys()].sort()

  const out: string[] = []
  out.push('# i18n literal audit')
  out.push('')
  out.push(`Total hits: ${hits.length} across ${sortedFiles.length} files`)
  out.push('')

  for (const f of sortedFiles) {
    const fileHits = byFile.get(f)!
    out.push(`## \`${f}\``)
    out.push('')
    for (const h of fileHits) {
      const src = h.source.replace(/`/g, '\\`')
      out.push(`- **L${h.line}** (${h.reason}): \`${src}\``)
    }
    out.push('')
  }

  return out.join('\n')
}
