import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { GuideContent } from './guide-content'

export const metadata: Metadata = createMetadata({
  title: 'Setup Guide - SSP Wallet | Complete Installation Instructions',
  description:
    'Step-by-step guide to install and set up SSP Wallet and SSP Key. Complete setup instructions for secure crypto wallet with multi-signature protection.',
  path: '/guide',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Setup Guide', url: '/guide' },
])

const videoJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: 'How to Install SSP Wallet and SSP Key',
  description:
    'Complete video walkthrough: install the SSP Wallet browser extension and sync the SSP Key mobile app for 2-of-2 multisignature security.',
  thumbnailUrl: 'https://sspwallet.io/ssp-setup-guide-poster.jpg',
  contentUrl: 'https://sspwallet.io/ssp-setup-guide.mp4',
  uploadDate: '2023-12-01',
  duration: 'PT3M36S',
  publisher: {
    '@type': 'Organization',
    name: 'SSP Wallet',
    logo: {
      '@type': 'ImageObject',
      url: 'https://sspwallet.io/ssp-logo-black-512x512.png',
      width: 512,
      height: 512,
    },
  },
}

const guideSteps = [
  {
    phase: 'Part One',
    title: 'Installing SSP Wallet',
    steps: [
      {
        step: 1,
        title: 'Visit Extension Store',
        description:
          'Open your browser and navigate to the SSP Wallet Extension page for your browser (Chrome, Firefox, Brave)',
      },
      {
        step: 2,
        title: 'Install Extension',
        description:
          "Click 'Add to Chrome/Firefox' or 'Install' button. A pop-up window will appear asking if you want to add SSP Wallet. Click 'Add' or 'Install' to complete installation.",
      },
      {
        step: 3,
        title: 'Open Wallet',
        description:
          'Locate the SSP wallet logo in your browser and click on it. Follow the prompts to get started.',
      },
      {
        step: 4,
        title: 'Create Password',
        description:
          'Create your password. Please carefully read the SSP Wallet Disclaimer and acknowledge your agreement.',
      },
      {
        step: 5,
        title: 'Create Wallet',
        description: "Click 'Create Wallet' to initialize your new wallet.",
      },
      {
        step: 6,
        title: 'Backup Seed Phrase',
        description:
          "Click 'Show Mnemonic Wallet Seed Phrase.' Store the seed phrase securely and confirm that you have backed it up.",
      },
      {
        step: 7,
        title: 'Finalize Setup',
        description:
          "Click 'Create Wallet' to finalize the process. Your browser wallet is now ready!",
      },
    ],
  },
  {
    phase: 'Part Two',
    title: 'Installing SSP Key Mobile App',
    steps: [
      {
        step: 1,
        title: 'Download Mobile App',
        description: 'Download SSP Key on your mobile device and open the application.',
      },
      {
        step: 2,
        title: 'Start Synchronization',
        description: "Click on 'Synchronize Key' to begin the setup process.",
      },
      {
        step: 3,
        title: 'Set Key Password',
        description: "Set an SSP Key password and confirm it. Then, click 'Setup Key.'",
      },
      {
        step: 4,
        title: 'Backup Key Seed',
        description:
          "Click 'Show Mnemonic Key Seed Phrase.' Store the key seed phrase securely and confirm backup.",
      },
      {
        step: 5,
        title: 'Complete Key Setup',
        description:
          "Click 'Setup Key.' SSP Key now serves as second authentication factor for your SSP Wallet.",
      },
      {
        step: 6,
        title: 'Scan QR Code',
        description:
          "Click 'Scan Code' to synchronize your SSP Key with SSP Wallet. Scan the QR code displayed on your browser.",
      },
      {
        step: 7,
        title: 'Approve Synchronization',
        description:
          "Click 'Approve Synchronization' and confirm with your Key password. You'll be notified of successful sync.",
      },
    ],
  },
]

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Install SSP Wallet & SSP Key',
  description:
    'Complete installation guide for the SSP Wallet browser extension and the SSP Key mobile companion app required for 2-of-2 multisignature security.',
  totalTime: 'PT15M',
  supply: [
    { '@type': 'HowToSupply', name: 'Desktop browser (Chrome, Brave, or Firefox)' },
    { '@type': 'HowToSupply', name: 'Mobile device (iOS 15.1+ or Android 7+)' },
  ],
  step: guideSteps.flatMap((phase, phaseIndex) =>
    phase.steps.map((s, stepIndex) => ({
      '@type': 'HowToStep',
      position: phaseIndex * 100 + stepIndex + 1,
      name: `${phase.title}: ${s.title}`,
      text: s.description,
      url: `https://sspwallet.io/guide#${phase.phase.toLowerCase().replace(/\s+/g, '-')}-step-${s.step}`,
    }))
  ),
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script id='guide-howto-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(howToJsonLd)}
      </Script>
      <Script id='guide-video-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(videoJsonLd)}
      </Script>
      <Script id='guide-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <GuideContent />
    </>
  )
}
