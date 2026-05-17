import type { GlossaryEntry } from '@/constants/glossary/types'

export function normalizeSlug(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function groupByFirstLetter(
  entries: readonly GlossaryEntry[]
): Record<string, GlossaryEntry[]> {
  const groups: Record<string, GlossaryEntry[]> = {}
  for (const entry of entries) {
    const first = entry.title.charAt(0)
    const letter = /^[0-9]/.test(first) ? '#' : first.toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(entry)
  }
  return groups
}

export function difficultyBadgeClass(level: 1 | 2 | 3): string {
  switch (level) {
    case 1:
      return 'inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300'
    case 2:
      return 'inline-block rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 3:
      return 'inline-block rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }
}
