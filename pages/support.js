import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Book,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Github,
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
  Shield,
  Smartphone,
  Star,
  Twitter,
  Users,
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const faqCategories = [
  {
    title: 'Getting Started',
    icon: Book,
    faqs: [
      {
        question: 'What is SSP Wallet?',
        answer:
          'SSP Wallet is a true 2-of-2 multisignature system consisting of two components: SSP Wallet (browser extension) and SSP Key (mobile 2FA app). Both devices are required to authorize transactions, providing unmatched security for your crypto assets across 15+ blockchains.',
      },
      {
        question: 'How do I install SSP Wallet?',
        answer:
          'You can install SSP Wallet as a Chrome extension from the Chrome Web Store. Visit our download page and follow our comprehensive setup guide for step-by-step instructions.',
      },
      {
        question: 'Is SSP Wallet free to use?',
        answer:
          "Yes, SSP Wallet is completely free to download and use. We don't charge any fees for the wallet itself, though you'll still pay network transaction fees when making blockchain transactions.",
      },
      {
        question: 'What cryptocurrencies does SSP Wallet support?',
        answer:
          'SSP Wallet supports 15+ blockchains including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Zcash (ZEC), Ravencoin (RVN), Dogecoin (DOGE), Bitcoin Cash (BCH), Flux (FLUX), Polygon (MATIC), BSC, Avalanche (AVAX), and Base. For EVM-compatible chains, we support all ERC-20 tokens and you can import your own custom token lists. Solana support is coming soon.',
      },
      {
        question: 'Where can I find the complete list of supported assets?',
        answer: (
          <>
            For a comprehensive and up-to-date list of all natively supported chains and tokens,
            please refer to our official{' '}
            <a
              href='https://docs.google.com/spreadsheets/d/1GUqGeV4hCwjKlxazY1vPY52owrEqXQ1UTchOKfkyS7c'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              SSP Asset Spreadsheet
            </a>
            . This spreadsheet is regularly updated with new additions and contains detailed
            information about each supported asset.
          </>
        ),
      },
      {
        question: 'Can I use SSP Wallet with dApps and DeFi?',
        answer:
          'Yes! SSP Wallet features full WalletConnect v2 (Reown) integration, allowing you to connect to thousands of decentralized applications across all supported EVM chains. You can use DeFi protocols, NFT marketplaces, and other dApps while maintaining the security of the 2-of-2 multisignature system.',
      },
      {
        question: 'What are FluxNodes and how can I use them?',
        answer:
          'FluxNodes are nodes in the Flux network that help secure and maintain the blockchain. With SSP Wallet, you can easily set up and manage Fluxnodes, monitor their performance, and claim rewards directly through the wallet interface. Fluxnodes require a collateral amount of FLUX tokens and provide passive income through network rewards.',
      },
      {
        question: 'Does SSP Wallet support fiat onboarding and offboarding?',
        answer:
          'Yes! SSP Wallet supports fiat onboarding and offboarding through integrated partners. You can buy cryptocurrencies directly with your credit card, bank transfer, or other payment methods, and sell your crypto back to fiat currency. This feature is available in supported regions and requires KYC verification.',
      },
      {
        question: 'Can I swap cryptocurrencies within SSP Wallet?',
        answer:
          'Yes, SSP Wallet includes built-in crypto swap functionality. You can easily exchange one cryptocurrency for another across supported blockchains through our integrated swap partners. The swap feature provides competitive rates and executes swaps securely while maintaining your private keys.',
      },
      {
        question: 'Can I export my transaction history?',
        answer:
          'Yes! SSP Wallet supports CSV export of your transaction history. You can export detailed transaction records for accounting, tax purposes, or personal record-keeping. The CSV export includes transaction dates, amounts, addresses, fees, and other relevant details for each supported blockchain.',
      },
      {
        question: 'How can I request a new coin to be added?',
        answer:
          'We encourage users to reach out to our support team or contribute directly on our GitHub repository to request new cryptocurrency support. We evaluate each request based on community demand, technical feasibility, and security considerations.',
      },
      {
        question: 'Is there a mobile wallet available?',
        answer:
          'Good news! We are actively working on expanding SSP Wallet to mobile platforms. Currently, SSP Wallet consists of a browser extension (SSP Wallet) and a mobile 2FA app (SSP Key). A full mobile wallet experience is in development.',
      },
      {
        question: 'Can I use SSP Wallet on multiple devices?',
        answer:
          "Yes, you can use SSP Wallet on multiple devices. To set up on a new device, you'll need to restore your wallet and key using the corresponding seed phrases. Each device requires proper setup and synchronization.",
      },
      {
        question: 'Is there a transaction limit with SSP Wallet?',
        answer:
          "SSP Wallet doesn't impose transaction limits. However, you're subject to the blockchain network limits and your available balance. Some networks may have minimum transaction amounts or maximum transaction sizes based on their protocols.",
      },
      {
        question: 'Can I use SSP Wallet offline?',
        answer:
          'SSP Wallet requires an internet connection for most operations including transaction broadcasting, balance updates, and synchronization between devices. While you can view some cached information offline, you cannot send transactions without connectivity.',
      },
    ],
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    faqs: [
      {
        question: 'How secure is SSP Wallet?',
        answer:
          "SSP Wallet uses multi-signature technology with mobile-integrated authentication, providing two-key protection. We use cutting-edge encryption and don't store any of your data - everything is stored locally and controlled by you.",
      },
      {
        question: 'What is SSP Key and why do I need it?',
        answer:
          'SSP Key is a mobile app that holds the second private key required for the 2-of-2 multisignature system. Every transaction must be signed by both your browser extension AND your mobile device. This ensures your funds remain secure even if one device is compromised. SSP Key is available for iOS 15.1+ and Android 7+.',
      },
      {
        question: 'Can I recover my wallet if I lose my device?',
        answer:
          'Yes, you can recover your wallet using your seed phrase. Both your wallet and key have separate seed phrases that should be stored securely offline. Never share your seed phrases with anyone.',
      },
      {
        question: 'Does SSP Wallet collect my personal data?',
        answer:
          'No, SSP Wallet is committed to not storing any data information. Your private keys, transaction history, and personal data remain entirely under your control and are stored locally on your devices.',
      },
      {
        question: 'What are deterministic builds and why do they matter?',
        answer:
          'Deterministic builds ensure that identical source code produces identical binary outputs. SSP Wallet uses Docker-based deterministic builds that enable anyone to independently verify that the distributed extension matches exactly what was built from the published source code. This eliminates potential supply chain attacks and provides cryptographic proof of build integrity.',
      },
      {
        question: 'How can I verify the deterministic build of SSP Wallet?',
        answer: (
          <>
            To verify SSP Wallet builds: 1) Download the release files (Chrome/Firefox zips,
            SHA256SUMS, SHA256SUMS.asc) from{' '}
            <a
              href='https://github.com/RunOnFlux/ssp-wallet/releases'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              GitHub releases
            </a>
            . 2) Import our public key from{' '}
            <a
              href='https://keys.openpgp.org/search?q=security%40runonflux.io'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              OpenPGP keyserver
            </a>
            . 3) Verify GPG signature:{' '}
            <code className='rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'>
              gpg --verify SHA256SUMS.asc SHA256SUMS
            </code>
            . 4) Verify hashes:{' '}
            <code className='rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'>
              sha256sum -c SHA256SUMS
            </code>
            . 5) Optionally reproduce the build:{' '}
            <code className='rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'>
              git checkout [version] && npm run build:deterministic
            </code>
            .
          </>
        ),
      },
      {
        question: 'Who signs the SSP Wallet releases?',
        answer: (
          <>
            All SSP Wallet releases are cryptographically signed by security@runonflux.io using GPG
            signatures. Our public key is available on{' '}
            <a
              href='https://keys.openpgp.org/search?q=security%40runonflux.io'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
            >
              OpenPGP keyserver
            </a>{' '}
            for verification. The deterministic build process includes Docker-based isolated
            environments and comprehensive checksums (SHA256SUMS) that are also GPG-signed to ensure
            authenticity and integrity.
          </>
        ),
      },
      {
        question: 'Can I use multiple SSP Keys with one SSP Wallet?',
        answer:
          'No, each SSP Wallet can only be paired with one SSP Key. The 2-of-2 multisignature system requires device-specific synchronization for public nonces and chain data. Using multiple SSP Keys would cause synchronization conflicts.',
      },
    ],
  },
  {
    title: 'Technical Support',
    icon: Smartphone,
    faqs: [
      {
        question: 'Which browsers are supported?',
        answer:
          'SSP Wallet supports Google Chrome, Brave, Firefox, and other Chromium-based browsers. You can download the Chrome Web Store version for Chromium browsers or the Firefox version directly from our GitHub releases.',
      },
      {
        question: "I'm having trouble syncing my mobile key",
        answer:
          "Make sure both devices are connected to the internet, the QR code is clearly visible, and you're using the latest versions of both the browser extension and mobile app. Try restarting both applications if sync fails.",
      },
      {
        question: 'My transaction is stuck or pending',
        answer:
          'Blockchain transactions can sometimes take time depending on network congestion. Check the transaction status on a blockchain explorer. If using Ethereum, you may need to increase gas fees for faster confirmation.',
      },
      {
        question: 'How do I update SSP Wallet?',
        answer:
          "Browser extensions typically update automatically. You can manually check for updates in your browser's extension management page. For the mobile app, check your device's app store for updates.",
      },
      {
        question: 'What is SSP Relay and how does it work?',
        answer:
          'SSP Relay is an open-source relay service that acts as a bridge between your SSP Wallet and SSP Key. It provides market information, fee data, enables transaction synchronization, and delivers push notifications. The relay enhances the user experience while maintaining security.',
      },
      {
        question: 'Does SSP Wallet support Replace-By-Fee (RBF)?',
        answer:
          'Yes, SSP Wallet fully supports Replace-By-Fee (RBF) functionality. You can modify transaction fees and even change recipients after broadcasting a transaction, giving you flexibility in managing your transactions on the blockchain.',
      },
      {
        question: 'What fees does SSP Wallet charge?',
        answer:
          "SSP Wallet has zero fees - we don't charge anything for using the wallet. You only pay the standard blockchain network fees that go directly to miners/validators for processing your transactions. The wallet includes automatic fee selection to optimize your transaction costs.",
      },
      {
        question: 'Why do some transactions fail to construct?',
        answer:
          'Some transactions may fail due to blockchain size restrictions and UTXO complexity. When you have many small inputs, the transaction size can exceed network limits. In such cases, you may need to consolidate your UTXOs or break the transaction into smaller parts.',
      },
      {
        question: 'Do I need to restore my wallet when changing devices?',
        answer:
          'Yes, due to device-specific encryption, you must restore both your wallet and key when changing devices or making significant system changes. Keep your seed phrases secure and accessible for this process.',
      },
      {
        question: 'What happens if I lose my SSP Key device?',
        answer:
          "If you lose your SSP Key device, you can restore it on a new device using your SSP Key seed phrase. Install the SSP Key app on your new device and use the seed phrase to recover access. You'll need to re-sync with your SSP Wallet browser extension after restoration.",
      },
      {
        question: 'Can I backup my wallet to cloud storage?',
        answer:
          "SSP Wallet doesn't support automatic cloud backups for security reasons. Your seed phrases should be stored offline in a secure location. Never store seed phrases in cloud storage, email, or any digital format that could be compromised.",
      },
      {
        question: "What's the difference between SSP Wallet seed phrase and SSP Key seed phrase?",
        answer:
          'SSP Wallet and SSP Key each have separate seed phrases. The wallet seed phrase controls the browser extension component, while the key seed phrase controls the mobile 2FA component. Both are required for full wallet recovery and should be stored separately and securely.',
      },
      {
        question: 'How do I migrate to a new computer?',
        answer:
          'To move SSP Wallet to a new computer: 1) Install the SSP Wallet extension on the new device, 2) Use your wallet seed phrase to restore the browser extension, 3) Re-sync with your existing SSP Key mobile app. Your transaction history and settings will need to be reconfigured.',
      },
      {
        question: 'I\'m getting "Synchronisation with SSP wallet needed" error on mobile',
        answer:
          'This error typically occurs when changing phones or when a blockchain is not yet synchronized with your SSP Key. To resolve: 1) Open SSP Wallet, 2) Switch to the blockchain you want to re-synchronize, 3) Click the burger menu (top right corner), 4) Select "SSP Wallet Details", 5) Confirm access with your password, 6) In the first row, find "Chain Sync with SSP Key" and click the eye icon to show the QR code, 7) Scan the QR code with your SSP Key and approve the chain synchronization.',
      },
      {
        question:
          'I\'m getting "SSP Key Public nonces do not match or SSP Key Public nonces are missing" error',
        answer:
          'This error occurs when public nonces used to construct transactions are not synchronized between your SSP Wallet and SSP Key. To resolve: 1) Open the burger menu (top right corner), 2) Navigate to Settings, 3) Find the "Public Nonces" section and click "Sync Public Nonces", 4) Scan the QR code shown with your SSP Key, 5) Approve the request on your mobile device. Your public nonces are now synchronized and you can begin transacting.',
      },
    ],
  },
]

const supportChannels = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and docs',
    icon: Book,
    links: [
      {
        name: 'Complete Documentation',
        url: 'https://docs.sspwallet.io',
        internal: false,
        icon: FileText,
      },
      { name: 'Setup Guide', url: '/guide', internal: true, icon: Book },
      { name: 'Feature Documentation', url: '/features', internal: true, icon: Star },
    ],
  },
  {
    title: 'Community Support',
    description: 'Get help from our community',
    icon: Users,
    links: [
      { name: 'GitHub Discussions', url: 'https://github.com/RunOnFlux/ssp-wallet', icon: Github },
      { name: 'Discord Community', url: 'https://discord.gg/runonflux', icon: MessageCircle },
      { name: 'Twitter Support', url: 'https://twitter.com/sspwallet_io', icon: Twitter },
    ],
  },
  {
    title: 'Direct Support',
    description: 'Get personalized technical assistance',
    icon: Mail,
    links: [
      {
        name: 'Support Ticketing System',
        url: 'https://support.runonflux.io',
        internal: false,
        icon: ExternalLink,
      },
      { name: 'Email Support', url: 'mailto:support@sspwallet.io', icon: Mail },
    ],
  },
]

function FAQItem({ faq, index, categoryIndex }) {
  const [isOpen, setIsOpen] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.3, delay: (categoryIndex * 2 + index) * 0.05 }}
      className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='dark:hover:bg-dark-700 flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50'
        aria-expanded={isOpen}
        aria-controls={`faq-content-${categoryIndex}-${index}`}
        id={`faq-button-${categoryIndex}-${index}`}
      >
        <span className='pr-4 font-semibold text-gray-900 dark:text-white'>{faq.question}</span>
        {isOpen ? (
          <ChevronUp className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        ) : (
          <ChevronDown className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        )}
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`px-6 ${isOpen ? 'pb-6' : ''} overflow-hidden`}
        id={`faq-content-${categoryIndex}-${index}`}
        role='region'
        aria-labelledby={`faq-button-${categoryIndex}-${index}`}
        style={!isOpen ? { height: 0, paddingBottom: 0 } : {}}
      >
        <p className='leading-relaxed text-gray-600 dark:text-gray-400'>{faq.answer}</p>
      </motion.div>
    </motion.div>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    type: 'Question',
    subject: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('https://relay.ssp.runonflux.io/v1/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-challenge': 'ssp',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit ticket')
      }

      setIsSubmitted(true)
      setFormData({ email: '', type: 'Question', subject: '', description: '' })
    } catch (error) {
      setError(error.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20'
      >
        <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-500' />
        <h3 className='mb-2 text-xl font-semibold text-green-900 dark:text-green-100'>
          Message Sent Successfully!
        </h3>
        <p className='mb-4 text-green-700 dark:text-green-300'>
          Thank you for contacting us. We'll get back to you as soon as possible.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className='text-green-600 hover:underline dark:text-green-400'
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div>
        <label
          htmlFor='email'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Email Address *
        </label>
        <input
          type='email'
          id='email'
          name='email'
          required
          value={formData.email}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='your.email@example.com'
        />
      </div>

      <div>
        <label
          htmlFor='type'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Issue Type *
        </label>
        <select
          id='type'
          name='type'
          required
          value={formData.type}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
        >
          <option value='Question'>General Question</option>
          <option value='Incident'>Technical Issue</option>
          <option value='Problem'>Help Needed</option>
          <option value='Feature Request'>Feature Request</option>
          <option value='Incident'>Bug Report</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='subject'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Subject *
        </label>
        <input
          type='text'
          id='subject'
          name='subject'
          required
          value={formData.subject}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='Brief description of your issue'
        />
      </div>

      <div>
        <label
          htmlFor='description'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Description *
        </label>
        <textarea
          id='description'
          name='description'
          required
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='Please provide detailed information about your issue...'
        />
      </div>

      {error && (
        <div className='flex items-center rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300'>
          <AlertTriangle className='mr-2 h-5 w-5 flex-shrink-0' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors'
      >
        {isSubmitting ? (
          <>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
            Sending...
          </>
        ) : (
          <>
            <Send className='mr-2 h-4 w-4' />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

export default function Support() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <>
      <Head>
        <title>Support - SSP Wallet | Get Help & Technical Support</title>
        <meta
          name='description'
          content='Get comprehensive support for SSP Wallet. Find answers to FAQs, access documentation, connect with community, or contact our expert support team.'
        />
        <meta
          name='keywords'
          content='SSP wallet support, crypto wallet help, technical support, FAQ, troubleshooting, customer service, documentation, community support'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />

        {/* Open Graph */}
        <meta property='og:title' content='SSP Wallet Support | Get Help & Technical Support' />
        <meta
          property='og:description'
          content='Find answers to your questions and get technical support for SSP Wallet.'
        />
        <meta property='og:url' content='https://sspwallet.io/support' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:alt' content='SSP Wallet Support - Get Help & Technical Support' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='SSP Wallet Support | Get Help & Technical Support' />
        <meta
          name='twitter:description'
          content='Find answers to your questions and get technical support for SSP Wallet.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />
        <meta
          name='twitter:image:alt'
          content='SSP Wallet Support - Get Help & Technical Support'
        />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/support' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              <HelpCircle className='mr-2 h-4 w-4' />
              Support Center
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>How can we help you?</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Find answers to common questions, access our documentation, or get in touch with our
              support team.
            </p>

            <div className='mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-3'>
              <Link
                href='https://docs.sspwallet.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-blue-600'
              >
                <Book className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    Docs
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>Guides</p>
                </div>
              </Link>

              <Link
                href='https://discord.gg/runonflux'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-green-600'
              >
                <Users className='mr-3 h-6 w-6 flex-shrink-0 text-green-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    Community
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>Chat</p>
                </div>
              </Link>

              <Link
                href='https://support.runonflux.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-purple-600'
              >
                <MessageCircle className='mr-3 h-6 w-6 flex-shrink-0 text-purple-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    Support
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>Help</p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>Get Support</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Choose the best way to get help based on your needs
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-3'>
            {supportChannels.map((channel, index) => {
              const ChannelIcon = channel.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-gray-700'
                >
                  <div className='mb-6 text-center'>
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl'>
                      <ChannelIcon className='h-8 w-8' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {channel.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>{channel.description}</p>
                  </div>

                  <div className='space-y-3'>
                    {channel.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon
                      return (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          target={link.internal ? '_self' : '_blank'}
                          className='group dark:hover:bg-dark-700 flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600'
                        >
                          {LinkIcon && (
                            <LinkIcon className='group-hover:text-primary-600 dark:group-hover:text-primary-400 mr-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                          )}
                          <span className='group-hover:text-primary-600 dark:group-hover:text-primary-400 text-gray-700 dark:text-gray-300'>
                            {link.name}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-4'>Frequently Asked Questions</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Find quick answers to the most common questions about SSP Wallet
            </p>
          </motion.div>

          <div className='space-y-12'>
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon
              return (
                <div
                  key={categoryIndex}
                  id={category.title
                    .toLowerCase()
                    .replace(/\s+&\s+/g, '--')
                    .replace(/\s+/g, '-')}
                  style={{ scrollMarginTop: '100px' }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className='mb-8 flex items-center'
                  >
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-4 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <CategoryIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {category.title}
                    </h3>
                  </motion.div>

                  <div className='space-y-4'>
                    {category.faqs.map((faq, faqIndex) => (
                      <FAQItem
                        key={faqIndex}
                        faq={faq}
                        index={faqIndex}
                        categoryIndex={categoryIndex}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='items-start lg:grid lg:grid-cols-2 lg:gap-16'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-6'>Still need help?</h2>

              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Can't find what you're looking for? Send us a message and our support team will get
                back to you as soon as possible.
              </p>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <Mail className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Email Support
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Github className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Open Source
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Report bugs or contribute on GitHub
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Users className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>Community</h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Connect with other users and get peer support
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mt-12 lg:mt-0'
            >
              <div className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700'>
                <h3 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                  Contact Support
                </h3>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
