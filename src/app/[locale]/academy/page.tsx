import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { LocaleBadge } from '@/components/shared/locale-badge'
import { isAcademyCategory } from '@/constants/academy-categories'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getAcademyPosts, getAllSeries, getCategories } from '@/lib/cms'
import { createMetadata } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Academy' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/academy',
  })
}

export default async function AcademyLandingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [categories, allSeries, latest, t, tCategories, tCommon] = await Promise.all([
    getCategories().catch(() => []),
    getAllSeries(locale).catch(() => []),
    getAcademyPosts({ limit: 12 }, locale).catch(() => []),
    getTranslations({ locale, namespace: 'Academy' }),
    getTranslations({ locale, namespace: 'Categories' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const seriesList = allSeries.filter(s => s.postCount > 0)
  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('title') },
  ])

  return (
    <>
      <Script id='academy-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <PageHeader title={t('title')} description={t('description')} />

      <section className='container-custom py-12'>
        <h2 className='mb-6 text-2xl font-bold md:text-3xl'>{t('browseByTopic')}</h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {categories
            .filter(c => c.slug !== 'news-explained')
            .map(c => {
              const title = isAcademyCategory(c.slug) ? tCategories(`${c.slug}.title`) : c.title
              const description = isAcademyCategory(c.slug)
                ? tCategories(`${c.slug}.description`)
                : c.description
              return (
                <Link
                  key={c.slug}
                  href={`/academy/${c.slug}`}
                  className='card hover:border-primary-400'
                >
                  <h3 className='text-lg font-semibold'>{title}</h3>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{description}</p>
                  <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
                    {t('articleCount', { count: c.postCount })}
                  </p>
                </Link>
              )
            })}
        </div>
      </section>

      {seriesList.length > 0 && (
        <section className='container-custom py-12'>
          <div className='mb-6 flex items-baseline justify-between'>
            <h2 className='text-2xl font-bold md:text-3xl'>{t('learningPaths')}</h2>
            <Link
              href='/academy/series'
              className='text-primary-600 dark:text-primary-400 text-sm underline'
            >
              {t('viewAllSeries')}
            </Link>
          </div>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {seriesList.map(s => (
              <Link key={s.slug} href={`/academy/series/${s.slug}`} className='card'>
                <div
                  className='rounded-card mb-3 aspect-video bg-cover bg-center'
                  style={{ backgroundImage: `url(${s.heroImage})` }}
                  aria-label={s.heroImageAlt}
                />
                <h3 className='font-semibold'>{s.title}</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {t('partsCount', { count: s.postCount })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className='container-custom py-12'>
        <h2 className='mb-6 text-2xl font-bold md:text-3xl'>{t('latestArticles')}</h2>
        {latest.length === 0 ? (
          <p className='py-8 text-center text-gray-500 dark:text-gray-400'>{t('comingSoon')}</p>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {latest.map(p => (
              <div key={p.slug} className='relative'>
                <NewsroomCard
                  post={p}
                  href={p.category ? `/academy/${p.category}/${p.slug}` : `/newsroom/${p.slug}`}
                />
                {p.servedLocale !== p.locale && (
                  <div className='absolute top-3 right-3'>
                    <LocaleBadge locale={p.servedLocale} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
