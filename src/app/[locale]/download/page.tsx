import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { DownloadContent } from './download-content'

export const metadata: Metadata = createMetadata({
  title: 'Download - SSP Wallet | Get Your Secure Crypto Wallet',
  description:
    'Download SSP Wallet for your browser. Secure, simple, powerful crypto wallet with multi-signature security and mobile authentication.',
  path: '/download',
  ogImage: {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Download SSP Wallet - Secure Crypto Wallet',
  },
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Download', url: '/download' },
])

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

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
