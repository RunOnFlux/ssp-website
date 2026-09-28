import type { Metadata } from 'next'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ArticleArchive } from '@/components/academy/article-archive'
import { PageHeader } from '@/components/header/page-header'
import { isAcademyCategory } from '@/constants/academy-categories'
import type { Locale } from '@/i18n/routing'
import { getAcademyPosts, getCategories } from '@/lib/cms'
import { createMetadata, localeAlternates } from '@/lib/seo'
import { buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Academy' })
  return createMetadata({
    title: t('allArticlesMetaTitle'),
    description: t('allArticlesMetaDescription'),
    path: '/academy/articles',
    locale,
    alternates: { languages: localeAlternates('/academy/articles') },
  })
}

export default async function AcademyAllArticlesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const [posts, categories, t, tCategories, tCommon] = await Promise.all([
    getAcademyPosts({}, locale).catch(() => []),
    getCategories().catch(() => []),
    getTranslations({ locale, namespace: 'Academy' }),
    getTranslations({ locale, namespace: 'Categories' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  // Newest first. `date` is YYYY-MM-DD, so a lexical compare is chronological
  // and avoids constructing a Date per comparison.
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  const categoryOptions = categories
    .filter(c => c.slug !== 'news-explained' && c.postCount > 0)
    .map(c => ({
      slug: c.slug,
      title: isAcademyCategory(c.slug) ? tCategories(`${c.slug}.title`) : c.slug,
    }))

  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('title'), url: '/academy' },
    { name: t('allArticles') },
  ])

  return (
    <>
      <Script id='academy-all-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <PageHeader title={t('allArticles')} description={t('allArticlesDescription')} />
      <section className='container-custom py-12'>
        <ArticleArchive posts={sorted} categories={categoryOptions} />
      </section>
    </>
  )
}
