import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Script from 'next/script'
import { PageHeader } from '@/components/header/page-header'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { Link } from '@/i18n/navigation'
import { getAllSeries } from '@/lib/cms'
import { createMetadata } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

export const metadata: Metadata = createMetadata({
  title: 'Learning Paths | SSP Academy',
  description:
    'Structured multi-part series to guide you from beginner to advanced on crypto self-custody with SSP.',
  path: '/academy/series',
})

const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Academy', url: '/academy' },
  { name: 'Learning Paths' },
])

export default async function SeriesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const allSeries = await getAllSeries().catch(() => [])
  const seriesList = allSeries.filter(s => s.postCount > 0)

  return (
    <>
      <Script id='academy-series-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <div className='container-custom pt-24 md:pt-32'>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academy', href: '/academy' },
            { label: 'Learning Paths' },
          ]}
        />
      </div>
      <PageHeader
        title='Learning Paths'
        description='Structured multi-part series to guide you from beginner to advanced.'
      />
      <section className='container-custom py-12'>
        {seriesList.length === 0 ? (
          <div className='py-16 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              Learning paths are coming soon. In the meantime, browse articles by topic:
            </p>
            <Link
              href='/academy'
              className='mt-4 inline-block text-primary-600 dark:text-primary-400 underline'
            >
              Back to Academy
            </Link>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {seriesList.map(s => (
              <Link key={s.slug} href={`/academy/series/${s.slug}`} className='card group'>
                <div
                  className='rounded-card mb-4 aspect-video bg-cover bg-center'
                  style={{ backgroundImage: `url(${s.heroImage})` }}
                  aria-label={s.heroImageAlt}
                />
                <h2 className='font-semibold text-gray-900 dark:text-white'>{s.title}</h2>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{s.description}</p>
                <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
                  {s.postCount} part{s.postCount === 1 ? '' : 's'}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
