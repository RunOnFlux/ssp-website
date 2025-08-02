import Head from 'next/head'
import { ComparisonSection } from '../components/features/ComparisonSection'
import { FeaturesHero } from '../components/features/FeaturesHero'
import { SecurityFeatures } from '../components/features/SecurityFeatures'
import { TechnicalFeatures } from '../components/features/TechnicalFeatures'

export default function Features() {
  return (
    <>
      <Head>
        <title>Features - SSP Wallet | Advanced Crypto Security & Multi-Chain Support</title>
        <meta
          name='description'
          content="Discover SSP Wallet's advanced features: true 2-of-2 multisignature security, WalletConnect v2 support, 15+ blockchain support, fiat on-ramp/off-ramp, cryptocurrency swapping, CSV export, and Account Abstraction."
        />
        <meta
          name='keywords'
          content='crypto wallet features, multi-signature security, blockchain support, Account Abstraction, ERC-4337, crypto security'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Features - SSP Wallet | Advanced Crypto Security' />
        <meta
          property='og:description'
          content='Explore the powerful features that make SSP Wallet the most secure and versatile crypto wallet.'
        />
        <meta property='og:url' content='https://sspwallet.io/features' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='745' />
        <meta property='og:image:height' content='280' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:alt' content='SSP Wallet Features - Advanced Crypto Security' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Features - SSP Wallet | Advanced Crypto Security' />
        <meta
          name='twitter:description'
          content='Explore the powerful features that make SSP Wallet the most secure and versatile crypto wallet.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />
        <meta name='twitter:image:alt' content='SSP Wallet Features - Advanced Crypto Security' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/features' />
      </Head>

      <FeaturesHero />
      <SecurityFeatures />
      <TechnicalFeatures />
      <ComparisonSection />
    </>
  )
}
