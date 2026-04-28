export interface GlossaryTerm {
  term: string
  definition: string
  href: string
}

export const GLOSSARY_TERMS: readonly GlossaryTerm[] = [
  {
    term: 'multisig',
    definition: 'A wallet that requires multiple signatures to authorize a transaction.',
    href: '/academy/multisig/what-is-2-of-2-multisig',
  },
  {
    term: '2-of-2 multisig',
    definition: "Both signers must approve every transaction. SSP's default model.",
    href: '/academy/multisig/what-is-2-of-2-multisig',
  },
  {
    term: 'BIP48',
    definition: 'Bitcoin Improvement Proposal defining derivation paths for multisig HD wallets.',
    href: '/academy/multisig/what-is-2-of-2-multisig#bip48',
  },
  {
    term: 'ERC-4337',
    definition: 'Ethereum Account Abstraction standard. Lets smart contracts act as wallets.',
    href: '/academy/defi/what-is-account-abstraction-erc-4337',
  },
  {
    term: 'account abstraction',
    definition: 'Treating wallets as smart contracts so they can enforce custom rules.',
    href: '/academy/defi/what-is-account-abstraction-erc-4337',
  },
  {
    term: 'seed phrase',
    definition: '12 or 24 words that deterministically generate every key in a wallet.',
    href: '/academy/security/seed-phrase-best-practices',
  },
  {
    term: 'hardware wallet',
    definition: 'A dedicated device that stores keys offline and signs transactions in isolation.',
    href: '/academy/security/seed-phrase-best-practices#hardware-wallet',
  },
  {
    term: 'hot wallet',
    definition: 'A wallet whose keys are stored on an internet-connected device.',
    href: '/academy/security/seed-phrase-best-practices#hot-wallet',
  },
  {
    term: 'cold wallet',
    definition: 'A wallet whose keys never touch an internet-connected device.',
    href: '/academy/security/seed-phrase-best-practices#cold-wallet',
  },
  {
    term: 'self-custody',
    definition: 'Holding your own keys instead of trusting a third party with custody.',
    href: '/academy/security/why-self-custody-matters-now',
  },
  {
    term: 'gas',
    definition: 'The fee paid to validators to include a transaction in a block.',
    href: '/academy/getting-started/setting-up-your-first-ssp-wallet#gas',
  },
  {
    term: 'mempool',
    definition: 'The pool of unconfirmed transactions waiting to be included in a block.',
    href: '/academy/getting-started/setting-up-your-first-ssp-wallet#mempool',
  },
  {
    term: 'finality',
    definition: 'The point at which a transaction is irreversibly confirmed.',
    href: '/academy/getting-started/setting-up-your-first-ssp-wallet#finality',
  },
  {
    term: 'signer',
    definition: 'A device or party authorized to produce a signature for a multisig wallet.',
    href: '/academy/multisig/what-is-2-of-2-multisig#signer',
  },
  {
    term: 'threshold',
    definition: 'In M-of-N multisig, the number of signatures (M) required to authorize.',
    href: '/academy/multisig/what-is-2-of-2-multisig#threshold',
  },
  {
    term: 'BIP39',
    definition: 'The Bitcoin proposal defining the mnemonic seed phrase standard.',
    href: '/academy/security/seed-phrase-best-practices#bip39',
  },
  {
    term: 'BIP32',
    definition: 'Defines hierarchical-deterministic wallets — many keys from one seed.',
    href: '/academy/security/seed-phrase-best-practices#bip32',
  },
  {
    term: 'WalletConnect',
    definition: 'Open protocol that lets dApps connect to wallets via QR code or deep link.',
    href: '/academy/how-to/sending-bitcoin-with-ssp#walletconnect',
  },
  {
    term: 'private key',
    definition: 'The secret number that controls a crypto address.',
    href: '/academy/security/seed-phrase-best-practices#private-key',
  },
  {
    term: 'public key',
    definition: 'Derived from a private key and used to verify signatures.',
    href: '/academy/security/seed-phrase-best-practices#public-key',
  },
]

export function getTermMap(): Map<string, GlossaryTerm> {
  const map = new Map<string, GlossaryTerm>()
  for (const t of GLOSSARY_TERMS) map.set(t.term.toLowerCase(), t)
  return map
}
