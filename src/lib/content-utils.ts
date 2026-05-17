/** Pure, Node-free utilities for processing article content. */

export function extractHeadings(content: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = []
  const seen = new Map<string, number>()
  let inFence = false
  for (const line of content.split('\n')) {
    if (/^```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const match = /^## (.+)$/.exec(line)
    if (!match) continue
    const text = match[1].trim().replace(/[*_`~]+/g, '')
    const baseId = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const count = seen.get(baseId) ?? 0
    const id = count === 0 ? baseId : `${baseId}-${count}`
    seen.set(baseId, count + 1)
    headings.push({ id, text })
  }
  return headings
}
