import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { GuideContent } from './guide-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Guide' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/guide',
  })
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Guide' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/guide' },
  ])

  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('videoJsonLdName'),
    description: t('videoJsonLdDescription'),
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

  // Build steps localized for HowTo JSON-LD using messages.
  const phaseIndices = [0, 1] as const
  const stepCounts = [7, 7] as const
  const howToSteps: Array<{
    '@type': 'HowToStep'
    position: number
    name: string
    text: string
    url: string
  }> = []
  phaseIndices.forEach((phaseIndex, p) => {
    const phaseSlugBase = phaseIndex === 0 ? 'part-one' : 'part-two'
    const phaseTitle = t(`phases.${phaseIndex}.title`)
    for (let i = 0; i < stepCounts[p]; i++) {
      const stepNum = i + 1
      const stepTitle = t(`phases.${phaseIndex}.steps.${i}.title`)
      const stepText = t(`phases.${phaseIndex}.steps.${i}.description`)
      howToSteps.push({
        '@type': 'HowToStep',
        position: phaseIndex * 100 + i + 1,
        name: `${phaseTitle}: ${stepTitle}`,
        text: stepText,
        url: `https://sspwallet.io/guide#${phaseSlugBase}-step-${stepNum}`,
      })
    }
  })

  const howToJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: t('howToJsonLdName'),
    description: t('howToJsonLdDescription'),
    totalTime: 'PT15M',
    supply: [
      { '@type': 'HowToSupply', name: t('howToSupplyDesktop') },
      { '@type': 'HowToSupply', name: t('howToSupplyMobile') },
    ],
    step: howToSteps,
  }

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
