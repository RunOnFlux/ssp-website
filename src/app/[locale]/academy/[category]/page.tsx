import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { ACADEMY_CATEGORY_SLUGS, isAcademyCategory } from '@/constants/academy-categories'
import { Link } from '@/i18n/navigation'
import { getAcademyPosts } from '@/lib/cms'
import { createMetadata, siteDescription } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'
import { CATEGORY_HEROES } from './_content'

export function generateStaticParams() {
  return ACADEMY_CATEGORY_SLUGS.map(category => ({ category }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}): Promise<Metadata> {
  const { locale, category } = await params
  if (!isAcademyCategory(category)) {
    return createMetadata({
      title: 'Academy',
      description: siteDescription,
      path: '/academy',
    })
  }
  const t = await getTranslations({ locale, namespace: 'Academy.categories' })
  const hero = CATEGORY_HEROES[category]
  const posts = await getAcademyPosts({ category, limit: 100 }).catch(() => [])
  return createMetadata({
    title: `${hero.h1} | SSP Academy`,
    description: t(`${category}.description`),
    path: `/academy/${category}`,
    noindex: posts.length === 0,
  })
}

export default async function CategoryHubPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>
}) {
  const { locale, category } = await params
  setRequestLocale(locale)
  if (!isAcademyCategory(category)) notFound()

  const t = await getTranslations({ locale, namespace: 'Academy.categories' })
  const hero = CATEGORY_HEROES[category]
  const posts = await getAcademyPosts({ category, limit: 100 }).catch(() => [])
  const categoryTitle = t(`${category}.title`)

  return (
    <>
      <Script id='academy-category-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(
          buildAcademyBreadcrumbJsonLd([
            { name: 'Home', url: '/' },
            { name: 'Academy', url: '/academy' },
            { name: categoryTitle },
          ])
        )}
      </Script>
      <div className='container-custom pt-24 md:pt-32'>
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Academy', href: '/academy' },
            { label: categoryTitle },
          ]}
        />
      </div>
      <PageHeader title={hero.h1} description={hero.lede} />
      <section className='container-custom max-w-4xl space-y-4 py-12 text-base leading-relaxed text-gray-600 md:py-16 md:text-lg dark:text-gray-300'>
        {hero.intro}
      </section>
      <section className='container-custom pb-16 md:pb-24'>
        {posts.length === 0 ? (
          <div className='space-y-6 py-12 text-center'>
            <p className='text-gray-600 dark:text-gray-300'>
              New articles coming soon. In the meantime, explore related topics:
            </p>
            <div className='flex flex-wrap justify-center gap-4'>
              {ACADEMY_CATEGORY_SLUGS.filter(s => s !== category && s !== 'news-explained')
                .slice(0, 3)
                .map(s => (
                  <Link
                    key={s}
                    href={`/academy/${s}`}
                    className='text-gray-600 underline hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  >
                    {t(`${s}.title`)}
                  </Link>
                ))}
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map(p => (
              <NewsroomCard key={p.slug} post={p} href={`/academy/${category}/${p.slug}`} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
