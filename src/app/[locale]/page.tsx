import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CTA } from '@/components/home/cta'
import { EnterpriseBand } from '@/components/home/enterprise-band'
import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { Security } from '@/components/home/security'
import { SupportedChains } from '@/components/home/supported-chains'
import { createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Home' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/',
  })
}

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
