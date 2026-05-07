export const ACADEMY_CATEGORY_SLUGS = [
  'multisig',
  'getting-started',
  'security',
  'how-to',
  'coin-guides',
  'defi',
  'news-explained',
] as const

export type AcademyCategory = (typeof ACADEMY_CATEGORY_SLUGS)[number]

export function isAcademyCategory(value: unknown): value is AcademyCategory {
  return typeof value === 'string' && (ACADEMY_CATEGORY_SLUGS as readonly string[]).includes(value)
}
