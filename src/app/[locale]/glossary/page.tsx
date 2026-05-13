import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { GLOSSARY } from '@/constants/glossary'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { groupByFirstLetter } from '@/lib/glossary-utils'
import { createMetadata } from '@/lib/seo'
import { GlossaryEntryCard } from './glossary-entry-card'
import { GlossarySearch } from './glossary-search'
import { LetterIndex } from './letter-index'

interface PageProps {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Glossary' })
  return createMetadata({
    title: t('seoTitle'),
    description: t('seoDescription'),
    path: '/glossary',
  })
}

export default async function GlossaryPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Glossary' })

  const groups = groupByFirstLetter(GLOSSARY)
  const letters = Object.keys(groups).sort((a, b) => {
    if (a === '#') return -1
    if (b === '#') return 1
    return a.localeCompare(b)
  })

  return (
    <>
      <section className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden bg-linear-to-b from-white to-gray-50 pb-12 md:pb-16 lg:pb-24'>
        <div className='container-custom relative z-10 pt-24 md:pt-32 lg:pt-40'>
          <h1 className='max-w-[900px] text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-[60px] lg:leading-[1.2] dark:text-white'>
            {t('title')}
          </h1>
          <p className='mt-6 max-w-[800px] text-lg text-gray-600 md:text-xl dark:text-gray-400'>
            {t('description')}
          </p>
          {locale !== 'en' && (
            <p className='mt-4 text-sm text-gray-500 dark:text-gray-500'>
              {t.rich('contentInEnglishBanner', {
                academyLink: chunks => (
                  <Link href='/academy' className='underline'>
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          )}
          <div className='mt-8'>
            <GlossarySearch
              placeholder={t('searchPlaceholder')}
              totalLabel={t('total', { count: GLOSSARY.length })}
              matchesLabel={c => t('matches', { count: c })}
            />
          </div>
        </div>
      </section>

      <LetterIndex letters={letters} />

      <section className='container-custom py-12'>
        {letters.map(letter => (
          <div
            key={letter}
            id={'letter-' + letter}
            data-letter-section
            data-letter={letter}
            className='mb-12 scroll-mt-24'
          >
            <h2 className='mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-white'>
              {letter}
            </h2>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {groups[letter].map(entry => (
                <GlossaryEntryCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <footer className='container-custom border-t border-gray-200 pt-8 pb-12 text-sm text-gray-500 dark:border-white/10 dark:text-gray-500'>
        {t('attribution')}
      </footer>
    </>
  )
}
