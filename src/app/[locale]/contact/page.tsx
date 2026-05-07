import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { ContactContent } from './contact-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Contact' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/contact',
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Contact' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/contact' },
  ])

  return (
    <>
      <Script id='contact-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <ContactContent />
    </>
  )
}
