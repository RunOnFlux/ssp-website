import type { GlossaryTerm } from './academy-terms'

const SKIP_PATTERN = /```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\[[^\]]+\]\[[^\]]*\]/g

function maskedToken(index: number): string {
  return `\x01PH${index}\x01`
}

export interface AutoLinkOptions {
  /** Maximum number of links to inject across both maps. Defaults to Infinity. */
  maxLinks?: number
  /** Lower-priority term map consulted after `termMap`. Same shape and semantics. */
  fallbackTermMap?: Map<string, GlossaryTerm>
}

interface TieredKey {
  key: string
  tier: 0 | 1
}

export function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>,
  options: AutoLinkOptions = {}
): string {
  const { maxLinks = Infinity, fallbackTermMap } = options
  const placeholders: string[] = []
  let masked = content.replace(SKIP_PATTERN, m => {
    placeholders.push(m)
    return maskedToken(placeholders.length - 1)
  })

  // Build a tiered iteration list: primary keys are processed entirely first
  // (length desc within the tier), then fallback keys (insertion order, no
  // length sort — the caller's builder is responsible for that ordering) not
  // already present in the primary map. The cap counts both tiers together,
  // so reserving primary capacity ahead of fallback guarantees the curated
  // tier wins whenever its terms appear in the content.
  const primaryKeys: TieredKey[] = [...termMap.keys()]
    .sort((a, b) => b.length - a.length)
    .map(key => ({ key, tier: 0 as const }))
  const fallbackKeys: TieredKey[] = []
  if (fallbackTermMap) {
    for (const key of fallbackTermMap.keys()) {
      // Defense-in-depth: the upstream builder should already exclude keys
      // present in `termMap`, but the explicit skip here keeps the curated
      // tier authoritative even if the builder is wrong.
      if (!termMap.has(key)) fallbackKeys.push({ key, tier: 1 })
    }
  }
  const keys: TieredKey[] = [...primaryKeys, ...fallbackKeys]

  let linkCount = 0
  for (const { key, tier } of keys) {
    if (linkCount >= maxLinks) break
    const term = tier === 0 ? termMap.get(key) : fallbackTermMap?.get(key)
    if (!term) continue
    if (term.href.endsWith(`/${selfSlug}`) || term.href.includes(`/${selfSlug}#`)) continue
    const escaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const pattern = new RegExp(`\\b(${escaped})\\b`, 'i')
    if (!pattern.test(masked)) continue
    masked = masked.replace(pattern, matchText => {
      placeholders.push(`[${matchText}](${term.href})`)
      return maskedToken(placeholders.length - 1)
    })
    linkCount++
  }

  // eslint-disable-next-line no-control-regex -- intentional sentinel chars that cannot appear in normal Markdown
  return masked.replace(/\x01PH(\d+)\x01/g, (_, i) => placeholders[Number(i)])
}
