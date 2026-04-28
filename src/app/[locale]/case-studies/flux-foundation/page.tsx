import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { createMetadata } from '@/lib/seo'
import { FluxFoundationContent } from './flux-foundation-content'

export const metadata: Metadata = createMetadata({
  title: 'Case Study: Flux Foundation — Self-Custody Treasury with SSP Enterprise',
  description:
    'How the Flux Foundation moved from scattered multisig and custom scripts to SSP Enterprise — securing the Fusion bridge and Foundation treasury with M-of-N vaults across every chain they use.',
  path: '/case-studies/flux-foundation',
})

export default async function FluxFoundationCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  return <FluxFoundationContent />
}
