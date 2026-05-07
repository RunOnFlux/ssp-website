import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/cms'
import { createBreadcrumbJsonLd, createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const [author, t] = await Promise.all([
    getAuthorBySlug(slug),
    getTranslations({ locale, namespace: 'Author' }),
  ])
  if (!author) return { title: t('notFoundTitle') }
  return createMetadata({
    title: t('metaTitle', { name: author.name }),
    description: author.bio ?? t('metaDescriptionFallback', { name: author.name }),
    path: `/author/${slug}`,
  })
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const [author, t, tCommon] = await Promise.all([
    getAuthorBySlug(slug),
    getTranslations({ locale, namespace: 'Author' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])
  if (!author) notFound()
  const posts = await getPostsByAuthor(slug)

  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: t('breadcrumbLabel') },
    { name: author.name },
  ])

  return (
    <>
      <Script id='author-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <div className='container-custom pt-24 md:pt-32'>
        <Breadcrumbs
          items={[{ label: tCommon('breadcrumbHome'), href: '/' }, { label: author.name }]}
        />
      </div>
      <section className='container-custom py-12'>
        <div className='flex items-start gap-6'>
          {author.avatar && (
            <Image
              src={author.avatar}
              alt={author.name}
              width={96}
              height={96}
              className='rounded-full'
            />
          )}
          <div>
            <h1 className='text-3xl font-bold md:text-4xl'>{author.name}</h1>
            {author.title && (
              <p className='mt-1 text-gray-600 dark:text-gray-300'>{author.title}</p>
            )}
            {author.bio && (
              <p className='mt-4 max-w-2xl text-gray-600 dark:text-gray-300'>{author.bio}</p>
            )}
          </div>
        </div>
      </section>
      <section className='container-custom pb-16 md:pb-24'>
        <h2 className='mb-6 text-2xl font-bold'>{t('postsBy', { name: author.name })}</h2>
        {posts.length === 0 ? (
          <p className='text-gray-600 dark:text-gray-300'>{t('noPosts')}</p>
        ) : (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map(p => (
              <NewsroomCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
