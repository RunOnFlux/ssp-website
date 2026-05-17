import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Script from 'next/script'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { LocalizedPathsRegistrar } from '@/components/i18n/localized-paths-registrar'
import { PostArticle } from '@/components/shared/post-article'
import { routing, type Locale } from '@/i18n/routing'
import { autoLinkPostContent } from '@/lib/auto-link-post-content'
import { getAllSlugs, getPostBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
import type { LocalizedPaths } from '@/lib/i18n/localized-paths'
import { createBlogPostingJsonLd, createBreadcrumbJsonLd, createMetadata, siteUrl } from '@/lib/seo'

interface PageProps {
  params: Promise<{ locale: Locale; slug: string }>
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
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
      url: cmsMediaUrl(post.image),
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
  const linkedContent = autoLinkPostContent(post.content, post.slug)

  const blogPostingJsonLd = createBlogPostingJsonLd({
    title: post.title,
    description: post.description,
    url: `/newsroom/${post.slug}`,
    imageUrl: cmsMediaUrl(post.image),
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

  const localizedPaths: LocalizedPaths = {}
  for (const [loc, alt] of Object.entries(post.alternates ?? {})) {
    if (alt?.slug) {
      localizedPaths[loc as Locale] = `/newsroom/${alt.slug}`
    }
  }

  return (
    <>
      <Script id='blog-posting-jsonld' type='application/ld+json'>
        {JSON.stringify(blogPostingJsonLd)}
      </Script>
      <Script id='breadcrumb-jsonld' type='application/ld+json'>
        {JSON.stringify(breadcrumbJsonLd)}
      </Script>
      <LocalizedPathsRegistrar paths={localizedPaths} />
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref='/newsroom'
        content={linkedContent}
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
    </>
  )
}
