import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { AuthorByline } from '@/components/shared/author-byline'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PostArticle } from '@/components/shared/post-article'
import { ACADEMY_CATEGORIES, isAcademyCategory } from '@/constants/academy-categories'
import { getTermMap } from '@/lib/academy-terms'
import { getAcademyPostBySlug, getAcademySlugs, getAuthorBySlug, getRelatedPosts } from '@/lib/cms'
import { autoLinkContent } from '@/lib/glossary-linker'
import { createMetadata, siteUrl } from '@/lib/seo'
import { buildAcademyArticleJsonLd, buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

interface PageProps {
  params: Promise<{ locale: string; category: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAcademySlugs()
    return slugs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const post = await getAcademyPostBySlug(slug)
  if (!post) return {}
  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/academy/${category}/${post.slug}`,
    type: 'article',
    ogImage: {
      url: post.image.startsWith('http') ? post.image : `${siteUrl}${post.image}`,
      width: 1200,
      height: 630,
      alt: post.title,
    },
    articleMeta: {
      publishedTime: post.date,
      modifiedTime: post.modifiedDate ?? undefined,
      author: post.author,
      tags: post.tags,
    },
    ...(post.canonicalUrl ? { canonical: post.canonicalUrl } : {}),
    ...(post.noindex ? { noindex: true } : {}),
  })
}

export default async function AcademyArticlePage({ params }: PageProps) {
  const { locale, category, slug } = await params
  setRequestLocale(locale)

  if (!isAcademyCategory(category)) notFound()

  const post = await getAcademyPostBySlug(slug)
  if (!post) notFound()

  const [author, relatedPosts] = await Promise.all([
    post.authorId ? getAuthorBySlug(post.authorId) : Promise.resolve(null),
    getRelatedPosts(post),
  ])

  const termMap = getTermMap()
  const linkedContent = autoLinkContent(post.content, post.slug, termMap)

  const articleJsonLd = buildAcademyArticleJsonLd(post, category, author)
  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Academy', url: '/academy' },
    { name: ACADEMY_CATEGORIES[category].title, url: `/academy/${category}` },
    { name: post.title, url: `/academy/${category}/${post.slug}` },
  ])

  const breadcrumb = (
    <div className='mb-6'>
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Academy', href: '/academy' },
          { label: ACADEMY_CATEGORIES[category].title, href: `/academy/${category}` },
          { label: post.title },
        ]}
      />
      {author && (
        <div className='mt-4'>
          <AuthorByline author={author} />
        </div>
      )}
    </div>
  )

  return (
    <>
      <Script id='academy-article-jsonld' type='application/ld+json'>
        {JSON.stringify(articleJsonLd)}
      </Script>
      <Script id='academy-article-breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref={`/academy/${category}`}
        backLabel={`Back to ${ACADEMY_CATEGORIES[category].title}`}
        breadcrumb={breadcrumb}
        content={linkedContent}
      />
    </>
  )
}
