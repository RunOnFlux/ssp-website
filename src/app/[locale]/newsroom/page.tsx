import type { Metadata } from 'next'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { PageHeader } from '@/components/header/page-header'
import { NewsroomListing } from '@/components/newsroom/newsroom-listing'
import { getAllPosts, getAllTags } from '@/lib/cms'
import { createBreadcrumbJsonLd, createCollectionPageJsonLd, createMetadata } from '@/lib/seo'

export const metadata: Metadata = createMetadata({
  title: 'Newsroom — Latest News & Updates',
  description: 'Stay up to date with the latest news, product updates, and announcements from SSP.',
  path: '/newsroom',
})

const breadcrumbJsonLd = createBreadcrumbJsonLd([
  { name: 'Home', url: '/' },
  { name: 'Newsroom', url: '/newsroom' },
])

export default async function NewsroomPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()])
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
      <PageHeader
        title='Newsroom'
        description='Stay up to date with the latest news, product updates, and announcements from SSP.'
      />
      <NewsroomListing posts={posts} tags={tags} />
    </>
  )
}
