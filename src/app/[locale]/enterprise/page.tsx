import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { EnterpriseContent } from './enterprise-content'

export const metadata: Metadata = createMetadata({
  title: 'SSP Enterprise | Self-Custody Multisig for Business',
  description:
    'Self-custody M-of-N multisig vaults for business treasuries. Policy engine, spending limits, two-device signing, role-based access. No custodians, no MPC.',
  path: '/enterprise',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Enterprise', url: '/enterprise' },
])

export default async function EnterprisePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <Script
        id='enterprise-breadcrumb-jsonld'
        type='application/ld+json'
        strategy='afterInteractive'
      >
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <EnterpriseContent />
    </>
  )
}
