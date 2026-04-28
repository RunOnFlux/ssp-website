import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Script from 'next/script'
import { setRequestLocale } from 'next-intl/server'
import { PostArticle } from '@/components/shared/post-article'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms'
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, siteUrl } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllSlugs()
    return slugs.map(slug => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/newsroom/${post.slug}`,
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

export default async function NewsroomArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  if (post.section === 'academy' && post.category) {
    permanentRedirect(`/academy/${post.category}/${post.slug}`)
  }
  if (post.slug !== slug) {
    permanentRedirect(`/newsroom/${post.slug}`)
  }

  const relatedPosts = await getRelatedPosts(post)

  const blogPostingJsonLd = createBlogPostingJsonLd({
    title: post.title,
    description: post.description,
    url: `/newsroom/${post.slug}`,
    imageUrl: post.image,
    authorName: post.author,
    publishDate: post.date,
    modifiedDate: post.modifiedDate ?? undefined,
  })
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Newsroom', url: '/newsroom' },
    { name: post.title, url: `/newsroom/${post.slug}` },
  ])

  return (
    <>
      <Script id='blog-posting-jsonld' type='application/ld+json'>
        {JSON.stringify(blogPostingJsonLd)}
      </Script>
      <Script id='breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <PostArticle post={post} relatedPosts={relatedPosts} backHref='/newsroom' />
    </>
  )
}
