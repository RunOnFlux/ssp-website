import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomListing } from '@/components/newsroom/newsroom-listing'
import type { Locale } from '@/i18n/routing'
import { getAllPosts, getAllTags } from '@/lib/cms'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Newsroom' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/newsroom',
  })
}

export default async function NewsroomPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, tags, t, tCommon] = await Promise.all([
    getAllPosts(locale),
    getAllTags('newsroom'),
    getTranslations({ locale, namespace: 'Newsroom' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('title'), url: '/newsroom' },
  ])
  const collectionJsonLd = createCollectionPageJsonLd(
    posts.map(p => ({ title: p.title, url: `/newsroom/${p.slug}`, date: p.date }))
  )
  return (
    <>
      <Script id='breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <Script id='collection-page-jsonld' type='application/ld+json'>
        {JSON.stringify(collectionJsonLd)}
      </Script>
      <PageHeader title={t('title')} description={t('description')} />
      <NewsroomListing posts={posts} tags={tags} />
    </>
  )
}
