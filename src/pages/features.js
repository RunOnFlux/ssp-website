import Head from 'next/head'
import { ComparisonSection } from '../components/features/ComparisonSection'
import { FeaturesHero } from '../components/features/FeaturesHero'
import { SecurityFeatures } from '../components/features/SecurityFeatures'
import { TechnicalFeatures } from '../components/features/TechnicalFeatures'

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sspwallet.io/' },
    { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://sspwallet.io/features' },
  ],
}

export default function Features() {
  return (
    <>
      <Head>
        <title>Features - SSP Wallet | Advanced Crypto Security & Multi-Chain Support</title>
        <meta
          name='description'
          content='True 2-of-2 multisig, WalletConnect v2, 15+ blockchains, fiat on/off-ramp, crypto swap, CSV export, and Account Abstraction. See all SSP Wallet features.'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Features - SSP Wallet | Advanced Crypto Security' />
        <meta
          property='og:description'
          content='Explore the powerful features that make SSP Wallet the most secure and versatile crypto wallet.'
        />
        <meta property='og:url' content='https://sspwallet.io/features' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
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

        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <FeaturesHero />
      <SecurityFeatures />
      <TechnicalFeatures />
      <ComparisonSection />
    </>
  )
}
