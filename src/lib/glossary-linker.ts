import type { GlossaryTerm } from './academy-terms'

const SKIP_PATTERN = /```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\[[^\]]+\]\[[^\]]*\]/g

function maskedToken(index: number): string {
  return `\x01PH${index}\x01`
}

export function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>
): string {
  const placeholders: string[] = []
  let masked = content.replace(SKIP_PATTERN, m => {
    placeholders.push(m)
    return maskedToken(placeholders.length - 1)
  })

  // Iterate longer terms first so a longer match (e.g. "2-of-2 multisig") wins
  // over a substring (e.g. "multisig") when both apply to the same span.
  const sortedKeys = [...termMap.keys()].sort((a, b) => b.length - a.length)

  for (const key of sortedKeys) {
    const term = termMap.get(key)
    if (!term) continue
    if (term.href.endsWith(`/${selfSlug}`) || term.href.includes(`/${selfSlug}#`)) continue
    const escaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const pattern = new RegExp(`\\b(${escaped})\\b`, 'i')
    if (!pattern.test(masked)) continue
    masked = masked.replace(pattern, matchText => {
      placeholders.push(`[${matchText}](${term.href})`)
      return maskedToken(placeholders.length - 1)
    })
  }

  // eslint-disable-next-line no-control-regex -- intentional sentinel chars that cannot appear in normal Markdown
  return masked.replace(/\x01PH(\d+)\x01/g, (_, i) => placeholders[Number(i)])
}
