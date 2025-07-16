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
          content="Discover SSP Wallet's advanced features: multi-signature security, 12+ blockchain support, Account Abstraction, and cutting-edge encryption technology."
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
