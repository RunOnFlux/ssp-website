import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'
import { SupportContent } from './support-content'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Support' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/support',
  })
}

// FAQ entries are stored as messages in three categories. Most have a single
// `answer` field; a few have multi-part rich-text fields with embedded links
// and code snippets, which we flatten to plain text for FAQPage JSON-LD.
type FaqRichKind = 'plain' | 'beforeLinkAfter' | 'codeLink'
const FAQ_INDEX: Array<{
  category: 'gettingStarted' | 'security' | 'technical'
  index: number
  kind: FaqRichKind
}> = [
  // Getting Started: 15 items, item 4 has a link.
  ...Array.from({ length: 15 }, (_, i) => ({
    category: 'gettingStarted' as const,
    index: i,
    kind: (i === 4 ? 'beforeLinkAfter' : 'plain') as FaqRichKind,
  })),
  // Security: 8 items, item 5 has codeLink, item 6 has beforeLinkAfter.
  ...Array.from({ length: 8 }, (_, i) => {
    let kind: FaqRichKind = 'plain'
    if (i === 5) kind = 'codeLink'
    else if (i === 6) kind = 'beforeLinkAfter'
    return { category: 'security' as const, index: i, kind }
  }),
  // Technical: 15 items, all plain.
  ...Array.from({ length: 15 }, (_, i) => ({
    category: 'technical' as const,
    index: i,
    kind: 'plain' as FaqRichKind,
  })),
]

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: 'Support' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel'), url: '/support' },
  ])

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_INDEX.map(({ category, index, kind }) => {
      const base = `faqCategories.${category}.items.${index}`
      let answerText = ''
      if (kind === 'plain') {
        answerText = t(`${base}.answer`)
      } else if (kind === 'beforeLinkAfter') {
        answerText = `${t(`${base}.answerBefore`)}${t(`${base}.answerLink`)}${t(`${base}.answerAfter`)}`
      } else {
        answerText = [
          t(`${base}.answerIntro`),
          t(`${base}.answerLink1`),
          t(`${base}.answerMiddle1`),
          t(`${base}.answerLink2`),
          t(`${base}.answerMiddle2`),
          t(`${base}.answerCode1`),
          t(`${base}.answerMiddle3`),
          t(`${base}.answerCode2`),
          t(`${base}.answerMiddle4`),
          t(`${base}.answerCode3`),
          t(`${base}.answerOutro`),
        ].join('')
      }
      return {
        '@type': 'Question',
        name: t(`${base}.question`),
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
        },
      }
    }),
  }

  return (
    <>
      <Script id='support-faq-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(faqJsonLd)}
      </Script>
      <Script id='support-breadcrumb-jsonld' type='application/ld+json' strategy='afterInteractive'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <SupportContent />
    </>
  )
}
