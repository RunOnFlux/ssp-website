import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GLOSSARY } from '@/constants/glossary'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { difficultyBadgeClass } from '@/lib/glossary-utils'
import { createMetadata } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  return GLOSSARY.map(entry => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const entry = GLOSSARY.find(e => e.slug === slug)
  if (!entry) return {}
  const t = await getTranslations({ locale, namespace: 'Glossary' })
  return createMetadata({
    title: t('termSeoTitle', { term: entry.title }),
    description: entry.excerpt.slice(0, 160),
    path: '/glossary/' + slug,
  })
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug, locale } = await params
  setRequestLocale(locale)
  const entry = GLOSSARY.find(e => e.slug === slug)
  if (!entry) notFound()

  const t = await getTranslations({ locale, namespace: 'Glossary' })

  return (
    <article className='container-custom my-12 md:my-16 lg:my-24'>
      <Link
        href='/glossary'
        className='text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
      >
        ← {t('backToGlossary')}
      </Link>

      <h1 className='mt-6 max-w-[900px] text-4xl leading-tight font-bold text-gray-900 md:text-5xl dark:text-white'>
        {entry.title}
      </h1>

      {entry.difficulty && (
        <div className='mt-4'>
          <span className={difficultyBadgeClass(entry.difficulty.level)}>
            {entry.difficulty.label}
          </span>
        </div>
      )}

      {locale !== 'en' && (
        <p className='mt-6 text-sm text-gray-500 dark:text-gray-500'>
          {t.rich('contentInEnglishBanner', {
            academyLink: chunks => (
              <Link href='/academy' className='underline'>
                {chunks}
              </Link>
            ),
          })}
        </p>
      )}

      <div className='prose prose-lg dark:prose-invert mt-8 max-w-none'>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.excerpt}</ReactMarkdown>
      </div>

      {/* Reserved slot for sub-project 2: "Appears in articles" — intentionally empty in v1 */}
    </article>
  )
}
