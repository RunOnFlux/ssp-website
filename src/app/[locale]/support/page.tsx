import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { SupportContent } from './support-content'

export const metadata: Metadata = createMetadata({
  title: 'Support - SSP Wallet | Get Help & Technical Support',
  description:
    'Get comprehensive support for SSP Wallet. Find answers to FAQs, access documentation, connect with community, or contact our expert support team.',
  path: '/support',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Support', url: '/support' },
])

// Plain-text FAQ entries used purely for FAQPage JSON-LD. The user-facing
// rich answers live in support-content.tsx; these mirror their text content
// so search engines can index a clean Question/Answer pair.
const faqEntries: Array<{ question: string; answerText: string }> = [
  {
    question: 'What is SSP Wallet?',
    answerText:
      'SSP Wallet is a true 2-of-2 multisignature system consisting of two components: SSP Wallet (browser extension) and SSP Key (mobile 2FA app). Both devices are required to authorize transactions, providing unmatched security for your crypto assets across 15+ blockchains.',
  },
  {
    question: 'How do I install SSP Wallet?',
    answerText:
      'You can install SSP Wallet as a Chrome extension from the Chrome Web Store. Visit our download page and follow our comprehensive setup guide for step-by-step instructions.',
  },
  {
    question: 'Is SSP Wallet free to use?',
    answerText:
      "Yes, SSP Wallet is completely free to download and use. We don't charge any fees for the wallet itself, though you'll still pay network transaction fees when making blockchain transactions.",
  },
  {
    question: 'What cryptocurrencies does SSP Wallet support?',
    answerText:
      'SSP Wallet supports 15+ blockchains including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Zcash (ZEC), Ravencoin (RVN), Dogecoin (DOGE), Bitcoin Cash (BCH), Flux (FLUX), Polygon (MATIC), BSC, Avalanche (AVAX), and Base. For EVM-compatible chains, we support all ERC-20 tokens and you can import your own custom token lists. Solana support is coming soon.',
  },
  {
    question: 'Where can I find the complete list of supported assets?',
    answerText:
      'For a comprehensive and up-to-date list of all natively supported chains and tokens, please refer to our official SSP Asset Spreadsheet at https://docs.google.com/spreadsheets/d/1GUqGeV4hCwjKlxazY1vPY52owrEqXQ1UTchOKfkyS7c. This spreadsheet is regularly updated with new additions and contains detailed information about each supported asset.',
  },
  {
    question: 'Can I use SSP Wallet with dApps and DeFi?',
    answerText:
      'Yes! SSP Wallet features full WalletConnect v2 (Reown) integration, allowing you to connect to thousands of decentralized applications across all supported EVM chains. You can use DeFi protocols, NFT marketplaces, and other dApps while maintaining the security of the 2-of-2 multisignature system.',
  },
  {
    question: 'What are FluxNodes and how can I use them?',
    answerText:
      'FluxNodes are nodes in the Flux network that help secure and maintain the blockchain. With SSP Wallet, you can easily set up and manage Fluxnodes, monitor their performance, and claim rewards directly through the wallet interface. Fluxnodes require a collateral amount of FLUX tokens and provide passive income through network rewards.',
  },
  {
    question: 'Does SSP Wallet support fiat onboarding and offboarding?',
    answerText:
      'Yes! SSP Wallet supports fiat onboarding and offboarding through integrated partners. You can buy cryptocurrencies directly with your credit card, bank transfer, or other payment methods, and sell your crypto back to fiat currency. This feature is available in supported regions and requires KYC verification.',
  },
  {
    question: 'Can I swap cryptocurrencies within SSP Wallet?',
    answerText:
      'Yes, SSP Wallet includes built-in crypto swap functionality. You can easily exchange one cryptocurrency for another across supported blockchains through our integrated swap partners. The swap feature provides competitive rates and executes swaps securely while maintaining your private keys.',
  },
  {
    question: 'Can I export my transaction history?',
    answerText:
      'Yes! SSP Wallet supports CSV export of your transaction history. You can export detailed transaction records for accounting, tax purposes, or personal record-keeping. The CSV export includes transaction dates, amounts, addresses, fees, and other relevant details for each supported blockchain.',
  },
  {
    question: 'How can I request a new coin to be added?',
    answerText:
      'We encourage users to reach out to our support team or contribute directly on our GitHub repository to request new cryptocurrency support. We evaluate each request based on community demand, technical feasibility, and security considerations.',
  },
  {
    question: 'Is there a mobile wallet available?',
    answerText:
      'Good news! We are actively working on expanding SSP Wallet to mobile platforms. Currently, SSP Wallet consists of a browser extension (SSP Wallet) and a mobile 2FA app (SSP Key). A full mobile wallet experience is in development.',
  },
  {
    question: 'Can I use SSP Wallet on multiple devices?',
    answerText:
      "Yes, you can use SSP Wallet on multiple devices. To set up on a new device, you'll need to restore your wallet and key using the corresponding seed phrases. Each device requires proper setup and synchronization.",
  },
  {
    question: 'Is there a transaction limit with SSP Wallet?',
    answerText:
      "SSP Wallet doesn't impose transaction limits. However, you're subject to the blockchain network limits and your available balance. Some networks may have minimum transaction amounts or maximum transaction sizes based on their protocols.",
  },
  {
    question: 'Can I use SSP Wallet offline?',
    answerText:
      'SSP Wallet requires an internet connection for most operations including transaction broadcasting, balance updates, and synchronization between devices. While you can view some cached information offline, you cannot send transactions without connectivity.',
  },
  {
    question: 'How secure is SSP Wallet?',
    answerText:
      "SSP Wallet uses multi-signature technology with mobile-integrated authentication, providing two-key protection. We use cutting-edge encryption and don't store any of your data - everything is stored locally and controlled by you.",
  },
  {
    question: 'What is SSP Key and why do I need it?',
    answerText:
      'SSP Key is a mobile app that holds the second private key required for the 2-of-2 multisignature system. Every transaction must be signed by both your browser extension AND your mobile device. This ensures your funds remain secure even if one device is compromised. SSP Key is available for iOS 15.1+ and Android 7+.',
  },
  {
    question: 'Can I recover my wallet if I lose my device?',
    answerText:
      'Yes, you can recover your wallet using your seed phrase. Both your wallet and key have separate seed phrases that should be stored securely offline. Never share your seed phrases with anyone.',
  },
  {
    question: 'Does SSP Wallet collect my personal data?',
    answerText:
      'No, SSP Wallet is committed to not storing any data information. Your private keys, transaction history, and personal data remain entirely under your control and are stored locally on your devices.',
  },
  {
    question: 'What are deterministic builds and why do they matter?',
    answerText:
      'Deterministic builds ensure that identical source code produces identical binary outputs. SSP Wallet uses Docker-based deterministic builds that enable anyone to independently verify that the distributed extension matches exactly what was built from the published source code. This eliminates potential supply chain attacks and provides cryptographic proof of build integrity.',
  },
  {
    question: 'How can I verify the deterministic build of SSP Wallet?',
    answerText:
      'To verify SSP Wallet builds: 1) Download the release files (Chrome/Firefox zips, SHA256SUMS, SHA256SUMS.asc) from https://github.com/RunOnFlux/ssp-wallet/releases. 2) Import our public key from https://keys.openpgp.org/search?q=security%40runonflux.io. 3) Verify GPG signature: gpg --verify SHA256SUMS.asc SHA256SUMS. 4) Verify hashes: sha256sum -c SHA256SUMS. 5) Optionally reproduce the build: git checkout [version] && npm run build:deterministic.',
  },
  {
    question: 'Who signs the SSP Wallet releases?',
    answerText:
      'All SSP Wallet releases are cryptographically signed by security@runonflux.io using GPG signatures. Our public key is available on the OpenPGP keyserver at https://keys.openpgp.org/search?q=security%40runonflux.io for verification. The deterministic build process includes Docker-based isolated environments and comprehensive checksums (SHA256SUMS) that are also GPG-signed to ensure authenticity and integrity.',
  },
  {
    question: 'Can I use multiple SSP Keys with one SSP Wallet?',
    answerText:
      'No, each SSP Wallet can only be paired with one SSP Key. The 2-of-2 multisignature system requires device-specific synchronization for public nonces and chain data. Using multiple SSP Keys would cause synchronization conflicts.',
  },
  {
    question: 'Which browsers are supported?',
    answerText:
      'SSP Wallet supports Google Chrome, Brave, Firefox, and other Chromium-based browsers. You can download the Chrome Web Store version for Chromium browsers or the Firefox version directly from our GitHub releases.',
  },
  {
    question: "I'm having trouble syncing my mobile key",
    answerText:
      "Make sure both devices are connected to the internet, the QR code is clearly visible, and you're using the latest versions of both the browser extension and mobile app. Try restarting both applications if sync fails.",
  },
  {
    question: 'My transaction is stuck or pending',
    answerText:
      'Blockchain transactions can sometimes take time depending on network congestion. Check the transaction status on a blockchain explorer. If using Ethereum, you may need to increase gas fees for faster confirmation.',
  },
  {
    question: 'How do I update SSP Wallet?',
    answerText:
      "Browser extensions typically update automatically. You can manually check for updates in your browser's extension management page. For the mobile app, check your device's app store for updates.",
  },
  {
    question: 'What is SSP Relay and how does it work?',
    answerText:
      'SSP Relay is an open-source relay service that acts as a bridge between your SSP Wallet and SSP Key. It provides market information, fee data, enables transaction synchronization, and delivers push notifications. The relay enhances the user experience while maintaining security.',
  },
  {
    question: 'Does SSP Wallet support Replace-By-Fee (RBF)?',
    answerText:
      'Yes, SSP Wallet fully supports Replace-By-Fee (RBF) functionality. You can modify transaction fees and even change recipients after broadcasting a transaction, giving you flexibility in managing your transactions on the blockchain.',
  },
  {
    question: 'What fees does SSP Wallet charge?',
    answerText:
      "SSP Wallet has zero fees - we don't charge anything for using the wallet. You only pay the standard blockchain network fees that go directly to miners/validators for processing your transactions. The wallet includes automatic fee selection to optimize your transaction costs.",
  },
  {
    question: 'Why do some transactions fail to construct?',
    answerText:
      'Some transactions may fail due to blockchain size restrictions and UTXO complexity. When you have many small inputs, the transaction size can exceed network limits. In such cases, you may need to consolidate your UTXOs or break the transaction into smaller parts.',
  },
  {
    question: 'Do I need to restore my wallet when changing devices?',
    answerText:
      'Yes, due to device-specific encryption, you must restore both your wallet and key when changing devices or making significant system changes. Keep your seed phrases secure and accessible for this process.',
  },
  {
    question: 'What happens if I lose my SSP Key device?',
    answerText:
      "If you lose your SSP Key device, you can restore it on a new device using your SSP Key seed phrase. Install the SSP Key app on your new device and use the seed phrase to recover access. You'll need to re-sync with your SSP Wallet browser extension after restoration.",
  },
  {
    question: 'Can I backup my wallet to cloud storage?',
    answerText:
      "SSP Wallet doesn't support automatic cloud backups for security reasons. Your seed phrases should be stored offline in a secure location. Never store seed phrases in cloud storage, email, or any digital format that could be compromised.",
  },
  {
    question: "What's the difference between SSP Wallet seed phrase and SSP Key seed phrase?",
    answerText:
      'SSP Wallet and SSP Key each have separate seed phrases. The wallet seed phrase controls the browser extension component, while the key seed phrase controls the mobile 2FA component. Both are required for full wallet recovery and should be stored separately and securely.',
  },
  {
    question: 'How do I migrate to a new computer?',
    answerText:
      'To move SSP Wallet to a new computer: 1) Install the SSP Wallet extension on the new device, 2) Use your wallet seed phrase to restore the browser extension, 3) Re-sync with your existing SSP Key mobile app. Your transaction history and settings will need to be reconfigured.',
  },
  {
    question: 'I\'m getting "Synchronisation with SSP wallet needed" error on mobile',
    answerText:
      'This error typically occurs when changing phones or when a blockchain is not yet synchronized with your SSP Key. To resolve: 1) Open SSP Wallet, 2) Switch to the blockchain you want to re-synchronize, 3) Click the burger menu (top right corner), 4) Select "SSP Wallet Details", 5) Confirm access with your password, 6) In the first row, find "Chain Sync with SSP Key" and click the eye icon to show the QR code, 7) Scan the QR code with your SSP Key and approve the chain synchronization.',
  },
  {
    question:
      'I\'m getting "SSP Key Public nonces do not match or SSP Key Public nonces are missing" error',
    answerText:
      'This error occurs when public nonces used to construct transactions are not synchronized between your SSP Wallet and SSP Key. To resolve: 1) Open the burger menu (top right corner), 2) Navigate to Settings, 3) Find the "Public Nonces" section and click "Sync Public Nonces", 4) Scan the QR code shown with your SSP Key, 5) Approve the request on your mobile device. Your public nonces are now synchronized and you can begin transacting.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqEntries.map(entry => ({
    '@type': 'Question',
    name: entry.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: entry.answerText,
    },
  })),
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script id='support-faq-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(faqJsonLd)}
      </Script>
      <Script id='support-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <SupportContent />
    </>
  )
}
