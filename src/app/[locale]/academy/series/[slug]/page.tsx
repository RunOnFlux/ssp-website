import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { Link } from '@/i18n/navigation'
import { getSeriesBySlug } from '@/lib/cms'
import { createMetadata, siteDescription } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const series = await getSeriesBySlug(slug).catch(() => undefined)
  if (!series) {
    return createMetadata({
      title: 'Learning Path | SSP Academy',
      description: siteDescription,
      path: '/academy/series',
    })
  }
  return createMetadata({
    title: `${series.seoTitle ?? series.title} | SSP Academy`,
    description: series.seoDescription ?? series.description,
    path: `/academy/series/${series.slug}`,
  })
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const series = await getSeriesBySlug(slug).catch(() => undefined)
  if (!series) notFound()

  const orderedPosts = [...series.posts].sort(
    (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
  )

  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Academy', url: '/academy' },
    { name: 'Learning Paths', url: '/academy/series' },
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
            { label: 'Home', href: '/' },
            { label: 'Academy', href: '/academy' },
            { label: 'Learning Paths', href: '/academy/series' },
            { label: series.title },
          ]}
        />
      </div>

      <section className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden rounded-b-[40px] bg-linear-to-b from-white to-gray-50 pb-12 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24'>
        <div className='container-custom pt-12 text-center md:pt-16 lg:pt-24'>
          <div className='mx-auto max-w-[800px] space-y-4'>
            <h1 className='text-3xl font-bold leading-tight text-gray-900 md:text-5xl dark:text-white'>
              {series.title}
            </h1>
            <p className='text-base font-medium leading-relaxed text-gray-600 md:text-lg dark:text-gray-200'>
              {series.description}
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {orderedPosts.length} part{orderedPosts.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
      </section>

      <section className='container-custom py-12 md:py-16'>
        {orderedPosts.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              Parts are coming soon.{' '}
              <Link
                href='/academy/series'
                className='text-primary-600 dark:text-primary-400 underline'
              >
                View all learning paths
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
