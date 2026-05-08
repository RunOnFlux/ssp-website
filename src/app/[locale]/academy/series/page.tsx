import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { LocaleBadge } from '@/components/shared/locale-badge'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getAllSeries } from '@/lib/cms'
import { createMetadata } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const tAcademy = await getTranslations({ locale, namespace: 'Academy' })
  return createMetadata({
    title: `${tAcademy('learningPaths')} | ${tAcademy('title')}`,
    description: tAcademy('seriesMetaDescription'),
    path: '/academy/series',
  })
}

export default async function SeriesIndexPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [allSeries, tAcademy, tCommon] = await Promise.all([
    getAllSeries(locale).catch(() => []),
    getTranslations({ locale, namespace: 'Academy' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const seriesList = allSeries.filter(s => s.postCount > 0)
  const homeLabel = tCommon('breadcrumbHome')
  const academyTitle = tAcademy('title')
  const learningPathsTitle = tAcademy('learningPaths')

  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: homeLabel, url: '/' },
    { name: academyTitle, url: '/academy' },
    { name: learningPathsTitle },
  ])

  return (
    <>
      <Script id='academy-series-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <div className='container-custom pt-24 md:pt-32'>
        <Breadcrumbs
          items={[
            { label: homeLabel, href: '/' },
            { label: academyTitle, href: '/academy' },
            { label: learningPathsTitle },
          ]}
        />
      </div>
      <PageHeader title={learningPathsTitle} description={tAcademy('seriesIndexDescription')} />
      <section className='container-custom py-12'>
        {seriesList.length === 0 ? (
          <div className='py-16 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>{tAcademy('seriesEmpty')}</p>
            <Link
              href='/academy'
              className='text-primary-600 dark:text-primary-400 mt-4 inline-block underline'
            >
              {tAcademy('backToAcademy')}
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {seriesList.map(s => (
              <div key={s.slug} className='relative'>
                <Link href={`/academy/series/${s.slug}`} className='card group'>
                  <div
                    className='rounded-card mb-4 aspect-video bg-cover bg-center'
                    style={{ backgroundImage: `url(${s.heroImage})` }}
                    aria-label={s.heroImageAlt}
                  />
                  <h2 className='font-semibold text-gray-900 dark:text-white'>{s.title}</h2>
                  <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{s.description}</p>
                  <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
                    {tAcademy('partsCount', { count: s.postCount })}
                  </p>
                </Link>
                {s.servedLocale !== s.locale && (
                  <div className='absolute top-3 right-3'>
                    <LocaleBadge locale={s.servedLocale} />
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
