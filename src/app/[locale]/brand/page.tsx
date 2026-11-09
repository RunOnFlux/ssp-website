import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata, localeAlternates } from '@/lib/seo'
import { BrandContent } from './brand-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Brand' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/brand',
    locale,
    alternates: { languages: localeAlternates('/brand') },
    ogImage: {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: t('ogAlt'),
    },
  })
}

export default async function BrandPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Brand' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/brand' },
  ])

  return (
    <>
      <Script id='brand-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <BrandContent locale={locale} />
    </>
  )
}
