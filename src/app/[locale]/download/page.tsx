import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { DownloadContent } from './download-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Download' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/download',
    ogImage: {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: t('ogAlt'),
    },
  })
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Download' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/download' },
  ])

  return (
    <>
      <Script
        id='download-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
      >
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <DownloadContent />
    </>
  )
}
