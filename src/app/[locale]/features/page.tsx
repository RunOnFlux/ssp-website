import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ComparisonSection } from '@/components/features/comparison-section'
import { FeaturesHero } from '@/components/features/features-hero'
import { SecurityFeatures } from '@/components/features/security-features'
import { TechnicalFeatures } from '@/components/features/technical-features'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Features' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/features',
  })
}

export default async function FeaturesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Features' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/features' },
  ])

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
