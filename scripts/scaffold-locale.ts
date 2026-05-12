#!/usr/bin/env tsx
/**
 * scaffold-locale.ts
 *
 * Copy src/messages/en.json to src/messages/<locale>.json with the same
 * key structure and the English values verbatim. The output is a starting
 * point: the caller must translate every string in place before
 * committing. ICU placeholders and markdown live inside the English
 * source and survive the copy untouched.
 *
 * Usage: npm run tsx scripts/scaffold-locale.ts <locale-code>
 * Example: npm run tsx scripts/scaffold-locale.ts pt-BR
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'

export function scaffoldFromEnglish(input: unknown): unknown {
  if (typeof input === 'string') return input
  if (Array.isArray(input)) return input.map(scaffoldFromEnglish)
  if (input !== null && typeof input === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(input)) {
      out[k] = scaffoldFromEnglish(v)
    }
    return out
  }
  return input
}

async function main(): Promise<void> {
  const locale = process.argv[2]
  if (!locale) {
    process.stderr.write('Usage: tsx scripts/scaffold-locale.ts <locale-code>\n')
    process.exit(2)
  }

  const repoRoot = process.cwd()
  const sourcePath = path.join(repoRoot, 'src/messages/en.json')
  const targetPath = path.join(repoRoot, 'src/messages', `${locale}.json`)

  const sourceRaw = await fs.readFile(sourcePath, 'utf8')
  const sourceJson = JSON.parse(sourceRaw) as unknown
  const scaffolded = scaffoldFromEnglish(sourceJson)
  const targetRaw = `${JSON.stringify(scaffolded, null, 2)}\n`
  await fs.writeFile(targetPath, targetRaw, 'utf8')

  process.stdout.write(`scaffolded ${targetPath}\n`)
}

// Only run main() when invoked directly, not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err: unknown) => {
    process.stderr.write(
      `scaffold-locale failed: ${err instanceof Error ? err.message : String(err)}\n`
    )
    process.exit(1)
  })
}
