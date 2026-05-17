import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createMetadata } from '@/lib/seo'
import { FluxFoundationContent } from './flux-foundation-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CaseStudies.fluxFoundation' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/case-studies/flux-foundation',
  })
}

export default async function FluxFoundationCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <FluxFoundationContent />
}
