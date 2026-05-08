import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { TranslationPendingBanner } from '@/components/shared/translation-pending-banner'
import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { getSeriesBySlug } from '@/lib/cms'
import { createMetadata, siteDescription } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const tAcademy = await getTranslations({ locale, namespace: 'Academy' })
  const series = await getSeriesBySlug(slug, locale).catch(() => undefined)
  if (!series) {
    return createMetadata({
      title: `${tAcademy('learningPaths')} | ${tAcademy('title')}`,
      description: siteDescription,
      path: '/academy/series',
    })
  }
  return createMetadata({
    title: `${series.seoTitle ?? series.title} | ${tAcademy('title')}`,
    description: series.seoDescription ?? series.description,
    path: `/academy/series/${series.slug}`,
  })
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [series, tAcademy, tCommon] = await Promise.all([
    getSeriesBySlug(slug, locale).catch(() => undefined),
    getTranslations({ locale, namespace: 'Academy' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  if (!series) notFound()

  const orderedPosts = [...series.posts].sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
  const homeLabel = tCommon('breadcrumbHome')
  const academyTitle = tAcademy('title')
  const learningPathsTitle = tAcademy('learningPaths')

  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: homeLabel, url: '/' },
    { name: academyTitle, url: '/academy' },
    { name: learningPathsTitle, url: '/academy/series' },
    { name: series.title },
  ])

  return (
    <>
      <Script id='academy-series-detail-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <div className='container-custom pt-24 md:pt-32'>
        <Breadcrumbs
          items={[
            { label: homeLabel, href: '/' },
            { label: academyTitle, href: '/academy' },
            { label: learningPathsTitle, href: '/academy/series' },
            { label: series.title },
          ]}
        />
      </div>

      {series.servedLocale !== series.locale && (
        <div className='container-custom mt-4'>
          <TranslationPendingBanner />
        </div>
      )}

      <section
        lang={series.servedLocale}
        className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden rounded-b-[40px] bg-linear-to-b from-white to-gray-50 pb-12 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24'
      >
        <div className='container-custom pt-12 text-center md:pt-16 lg:pt-24'>
          <div className='mx-auto max-w-[800px] space-y-4'>
            <h1 className='text-3xl leading-tight font-bold text-gray-900 md:text-5xl dark:text-white'>
              {series.title}
            </h1>
            <p className='text-base leading-relaxed font-medium text-gray-600 md:text-lg dark:text-gray-200'>
              {series.description}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {tAcademy('partsCount', { count: orderedPosts.length })}
            </p>
          </div>
        </div>
      </section>

      <section className='container-custom py-12 md:py-16'>
        {orderedPosts.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              {tAcademy('seriesPartsEmpty')}{' '}
              <Link
                href='/academy/series'
                className='text-primary-600 dark:text-primary-400 underline'
              >
                {tAcademy('viewAllLearningPaths')}
              </Link>
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {orderedPosts.map(p => (
              <NewsroomCard
                key={p.slug}
                post={p}
                href={
                  p.category
                    ? `/academy/${p.category}/${p.slug}`
                    : `/academy/series/${series.slug}/${p.slug}`
                }
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
