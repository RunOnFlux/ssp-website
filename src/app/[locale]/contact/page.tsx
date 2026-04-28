import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { ContactContent } from './contact-content'

export const metadata: Metadata = createMetadata({
  title: 'Contact - SSP Wallet | Get in Touch',
  description:
    'Contact SSP Wallet team. Get support, ask questions, or discuss partnerships. Join our Discord community or reach out directly.',
  path: '/contact',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Contact', url: '/contact' },
])

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script id='contact-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <ContactContent />
    </>
  )
}
