import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Link } from '@/i18n/navigation'
import { getAcademyPosts, getAllSeries, getCategories } from '@/lib/cms'
import { createMetadata } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

export const metadata: Metadata = createMetadata({
  title: 'SSP Academy — Learn Crypto Self-Custody',
  description: 'Guides, tutorials, and deep dives on SSP, multisig, security, DeFi, and more.',
  path: '/academy',
})

const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Academy' },
])

export default async function AcademyLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const [categories, allSeries, latest] = await Promise.all([
    getCategories().catch(() => []),
    getAllSeries().catch(() => []),
    getAcademyPosts({ limit: 12 }).catch(() => []),
  ])
  const seriesList = allSeries.filter(s => s.postCount > 0)

  return (
    <>
      <Script id='academy-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <PageHeader
        title='SSP Academy'
        description='Guides, tutorials, and deep dives to help you master self-custody with SSP.'
      />

      <section className='container-custom py-12'>
        <h2 className='mb-6 text-2xl font-bold md:text-3xl'>Browse by topic</h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {categories
            .filter(c => c.slug !== 'news-explained')
            .map(c => (
              <Link
                key={c.slug}
                href={`/academy/${c.slug}`}
                className='card hover:border-primary-400'
              >
                <h3 className='text-lg font-semibold'>{c.title}</h3>
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>{c.description}</p>
                <p className='mt-3 text-xs text-gray-500 dark:text-gray-400'>
                  {c.postCount} article{c.postCount === 1 ? '' : 's'}
                </p>
              </Link>
            ))}
        </div>
      </section>

      {seriesList.length > 0 && (
        <section className='container-custom py-12'>
          <div className='mb-6 flex items-baseline justify-between'>
            <h2 className='text-2xl font-bold md:text-3xl'>Learning paths</h2>
            <Link
              href='/academy/series'
              className='text-primary-600 dark:text-primary-400 text-sm underline'
            >
              View all
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
                <p className='text-sm text-gray-500 dark:text-gray-400'>{s.postCount} parts</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className='container-custom py-12'>
        <h2 className='mb-6 text-2xl font-bold md:text-3xl'>Latest articles</h2>
        {latest.length === 0 ? (
          <p className='py-8 text-center text-gray-500 dark:text-gray-400'>
            New articles coming soon — check back shortly.
          </p>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {latest.map(p => (
              <NewsroomCard
                key={p.slug}
                post={p}
                href={p.category ? `/academy/${p.category}/${p.slug}` : `/newsroom/${p.slug}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
