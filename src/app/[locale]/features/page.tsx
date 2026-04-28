import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { ComparisonSection } from '@/components/features/comparison-section'
import { FeaturesHero } from '@/components/features/features-hero'
import { SecurityFeatures } from '@/components/features/security-features'
import { TechnicalFeatures } from '@/components/features/technical-features'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Features - SSP Wallet | Advanced Crypto Security & Multi-Chain Support',
  description:
    'True 2-of-2 multisig, WalletConnect v2, 15+ blockchains, fiat on/off-ramp, crypto swap, CSV export, and Account Abstraction. See all SSP Wallet features.',
  path: '/features',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Features', url: '/features' },
])

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script
        id='features-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
      >
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <FeaturesHero />
      <SecurityFeatures />
      <TechnicalFeatures />
      <ComparisonSection />
    </>
  )
}
