import type { ReactNode } from 'react'
import type { AcademyCategory } from '@/constants/academy-categories'

interface CategoryHero {
  h1: string
  lede: string
  intro: ReactNode
}

export const CATEGORY_HEROES: Record<AcademyCategory, CategoryHero> = {
  multisig: {
    h1: 'Multisig Explained',
    lede: 'How 2-of-2 multisignature actually works in SSP — and why it matters.',
    intro: (
      <p>
        Multisig wallets require multiple signatures to authorize a transaction. SSP enforces 2-of-2
        on every signed action: the browser extension and the mobile SSP Key app must both approve.
        This page collects the deep-dives that explain how the model works, what attacks it stops,
        and where its limits sit.
      </p>
    ),
  },
  'getting-started': {
    h1: 'Crypto Basics',
    lede: 'Foundational concepts every crypto user should know.',
    intro: (
      <p>
        Brand-new to crypto, or returning after a long break? Start here. These guides cover
        wallets, addresses, transactions, gas, mempools, and finality — the vocabulary you need
        before you touch real funds.
      </p>
    ),
  },
  security: {
    h1: 'Security & Self-Custody',
    lede: 'Protect your crypto: seeds, phishing, hardware, threat models.',
    intro: (
      <p>
        Self-custody is hard because attacks are creative. This collection walks through the threats
        that actually catch users: phishing pages, fake support DMs, malicious dApps, lost seeds,
        and how SSP's 2-of-2 model neutralises most of them.
      </p>
    ),
  },
  'how-to': {
    h1: 'How-To Guides',
    lede: 'Step-by-step walkthroughs for common SSP tasks.',
    intro: (
      <p>
        Practical, screenshot-driven walkthroughs for the things SSP users do every day: sending
        transactions across chains, connecting to dApps via WalletConnect, swapping tokens, and
        recovering from a lost device.
      </p>
    ),
  },
  'coin-guides': {
    h1: 'Coin & Chain Guides',
    lede: 'Deep dives into individual coins and chains SSP supports.',
    intro: (
      <p>
        Each coin or chain SSP supports has its own quirks — UTXO vs. account-based, native multisig
        vs. ERC-4337, fee dynamics, finality times. This collection covers them one at a time.
      </p>
    ),
  },
  defi: {
    h1: 'DeFi & Account Abstraction',
    lede: 'Staking, lending, swaps, and ERC-4337 explained.',
    intro: (
      <p>
        SSP supports DeFi via ERC-4337 Account Abstraction on EVM chains. These articles explain
        what AA is, what dApps you can use safely from a multisig wallet, and how SSP keeps you in
        control while letting you participate in DeFi protocols.
      </p>
    ),
  },
  'news-explained': {
    h1: 'News & Industry Analysis',
    lede: 'Context and analysis on crypto news and regulation.',
    intro: (
      <p>
        Beyond the headlines: the regulatory shifts, exchange failures, protocol incidents, and
        standards updates that actually affect self-custody users — explained without hype.
      </p>
    ),
  },
}
