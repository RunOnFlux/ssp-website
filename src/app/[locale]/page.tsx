import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { CTA } from '@/components/home/cta'
import { EnterpriseBand } from '@/components/home/enterprise-band'
import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { Security } from '@/components/home/security'
import { SupportedChains } from '@/components/home/supported-chains'
import { createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'SSP Wallet — Secure, Simple, Powerful Crypto Wallet',
  description:
    'True 2-of-2 multisig crypto wallet. Browser extension + mobile required for every transaction. Supports Bitcoin, Ethereum, and 15+ blockchains.',
  path: '/',
})

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <Hero />
      <Features />
      <Security />
      <EnterpriseBand />
      <SupportedChains />
      <CTA />
    </>
  )
}
