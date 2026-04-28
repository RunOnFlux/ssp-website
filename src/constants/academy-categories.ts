export const ACADEMY_CATEGORIES = {
  multisig: {
    title: 'Multisig Explained',
    description: 'How 2-of-2 multisignature actually works in SSP — and why it matters.',
  },
  'getting-started': {
    title: 'Crypto Basics',
    description: 'Foundational concepts every crypto user should know.',
  },
  security: {
    title: 'Security & Self-Custody',
    description: 'Protect your crypto: seeds, phishing, hardware, threat models.',
  },
  'how-to': {
    title: 'How-To Guides',
    description: 'Step-by-step walkthroughs for common SSP tasks.',
  },
  'coin-guides': {
    title: 'Coin & Chain Guides',
    description: 'Deep dives into individual coins and chains SSP supports.',
  },
  defi: {
    title: 'DeFi & Account Abstraction',
    description: 'Staking, lending, swaps, and ERC-4337 explained.',
  },
  'news-explained': {
    title: 'News & Industry Analysis',
    description: 'Context and analysis on crypto news and regulation.',
  },
} as const

export type AcademyCategory = keyof typeof ACADEMY_CATEGORIES

export const ACADEMY_CATEGORY_SLUGS: readonly AcademyCategory[] = Object.freeze(
  Object.keys(ACADEMY_CATEGORIES) as AcademyCategory[]
)

export function isAcademyCategory(value: unknown): value is AcademyCategory {
  return typeof value === 'string' && value in ACADEMY_CATEGORIES
}
