import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Script from 'next/script'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { PostArticle } from '@/components/shared/post-article'
import { routing, type Locale } from '@/i18n/routing'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms'
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, siteUrl } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  try {
    const slugs = await getAllSlugs(locale)
    return slugs.map(slug => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}

  const languages: Record<string, string> = {}
  for (const otherLocale of routing.locales) {
    if (otherLocale === locale) continue
    const other = await getPostBySlug(slug, otherLocale).catch(() => null)
    if (other && other.servedLocale === otherLocale) {
      languages[otherLocale] = `${siteUrl}/${otherLocale}/newsroom/${other.slug}`
    }
  }
  languages[locale] = `${siteUrl}/${locale}/newsroom/${post.slug}`

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
    alternates: { languages },
    ...(post.canonicalUrl ? { canonical: post.canonicalUrl } : {}),
    ...(post.noindex ? { noindex: true } : {}),
  })
}

export default async function NewsroomArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const post = await getPostBySlug(slug, locale)
  if (!post) notFound()

  if (post.section === 'academy' && post.category) {
    permanentRedirect(`/${locale}/academy/${post.category}/${post.slug}`)
  }
  if (post.slug !== slug) {
    permanentRedirect(`/${locale}/newsroom/${post.slug}`)
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
  const [tCommon, tNewsroom] = await Promise.all([
    getTranslations({ locale, namespace: 'Common' }),
    getTranslations({ locale, namespace: 'Newsroom' }),
  ])
  const breadcrumbJsonLd = createBreadcrumbJsonLd([
    { name: tCommon('breadcrumbHome'), url: '/' },
    { name: tNewsroom('title'), url: '/newsroom' },
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
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref='/newsroom'
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
    </>
  )
}
