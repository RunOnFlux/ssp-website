import type { GlossaryTerm } from './academy-terms'

export function autoLinkContent(
  content: string,
  selfSlug: string,
  termMap: Map<string, GlossaryTerm>
): string {
  const placeholders: string[] = []
  let masked = content.replace(/```[\s\S]*?```|`[^`\n]+`|\[[^\]]+\]\([^)]+\)/g, m => {
    placeholders.push(m)
    return ` PH${placeholders.length - 1} `
  })

  const used = new Set<string>()
  for (const [key, term] of termMap.entries()) {
    if (used.has(key)) continue
    if (term.href.endsWith(`/${selfSlug}`) || term.href.includes(`/${selfSlug}#`)) continue
    const escaped = key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const pattern = new RegExp(`\\b(${escaped})\\b`, 'i')
    if (!pattern.test(masked)) continue
    masked = masked.replace(pattern, matchText => `[${matchText}](${term.href})`)
    used.add(key)
  }

  return masked.replace(/ PH(\d+) /g, (_, i) => placeholders[Number(i)])
}
