import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import Script from 'next/script'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { LocalizedPathsRegistrar } from '@/components/i18n/localized-paths-registrar'
import { AuthorByline } from '@/components/shared/author-byline'
import { Breadcrumbs } from '@/components/shared/breadcrumbs'
import { PostArticle } from '@/components/shared/post-article'
import { isAcademyCategory } from '@/constants/academy-categories'
import { routing, type Locale } from '@/i18n/routing'
import type { LocalizedPaths } from '@/lib/i18n/localized-paths'
import { getTermMap } from '@/lib/academy-terms'
import { getAcademyPostBySlug, getAcademySlugs, getAuthorBySlug, getRelatedPosts } from '@/lib/cms'
import { cmsMediaUrl } from '@/lib/cms-media'
import { autoLinkContent } from '@/lib/glossary-linker'
import { createMetadata, siteUrl } from '@/lib/seo'
import { buildAcademyArticleJsonLd, buildAcademyBreadcrumbJsonLd } from '@/lib/seo-academy'

interface PageProps {
  params: Promise<{ locale: Locale; category: string; slug: string }>
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  try {
    const slugs = await getAcademySlugs(locale)
    return slugs
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, category, slug } = await params
  const post = await getAcademyPostBySlug(slug, locale)
  if (!post) return {}

  const languages: Record<string, string> = {}
  for (const otherLocale of routing.locales) {
    if (otherLocale === locale) continue
    const other = await getAcademyPostBySlug(slug, otherLocale).catch(() => null)
    if (other && other.servedLocale === otherLocale && other.category) {
      languages[otherLocale] = `${siteUrl}/${otherLocale}/academy/${other.category}/${other.slug}`
    }
  }
  languages[locale] = `${siteUrl}/${locale}/academy/${category}/${post.slug}`

  return createMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.description,
    path: `/academy/${category}/${post.slug}`,
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

export default async function AcademyArticlePage({ params }: PageProps) {
  const { locale, category, slug } = await params
  setRequestLocale(locale)

  if (!isAcademyCategory(category)) notFound()

  const post = await getAcademyPostBySlug(slug, locale)
  if (!post) notFound()

  if (post.section === 'newsroom') {
    permanentRedirect(`/${locale}/newsroom/${post.slug}`)
  }
  if (post.category && post.category !== category) {
    permanentRedirect(`/${locale}/academy/${post.category}/${post.slug}`)
  }
  if (post.slug !== slug) {
    permanentRedirect(`/${locale}/academy/${category}/${post.slug}`)
  }

  const [author, relatedPosts, tCategories, tAcademy, tCommon] = await Promise.all([
    post.authorId ? getAuthorBySlug(post.authorId) : Promise.resolve(null),
    getRelatedPosts(post),
    getTranslations({ locale, namespace: 'Categories' }),
    getTranslations({ locale, namespace: 'Academy' }),
    getTranslations({ locale, namespace: 'Common' }),
  ])

  const termMap = getTermMap()
  const linkedContent = autoLinkContent(post.content, post.slug, termMap)

  const localizedPaths: LocalizedPaths = {}
  for (const [loc, alt] of Object.entries(post.alternates ?? {})) {
    if (alt?.slug) {
      localizedPaths[loc as Locale] = `/academy/${category}/${alt.slug}`
    }
  }

  const categoryTitle = tCategories(`${category}.title`)
  const homeLabel = tCommon('breadcrumbHome')
  const academyTitle = tAcademy('title')
  const articleJsonLd = buildAcademyArticleJsonLd(post, category, author, categoryTitle)
  const breadcrumbJsonLd = buildAcademyBreadcrumbJsonLd([
    { name: homeLabel, url: '/' },
    { name: academyTitle, url: '/academy' },
    { name: categoryTitle, url: `/academy/${category}` },
    { name: post.title, url: `/academy/${category}/${post.slug}` },
  ])

  const breadcrumb = (
    <div className='mb-6'>
      <Breadcrumbs
        items={[
          { label: homeLabel, href: '/' },
          { label: academyTitle, href: '/academy' },
          { label: categoryTitle, href: `/academy/${category}` },
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
      <LocalizedPathsRegistrar paths={localizedPaths} />
      <PostArticle
        post={post}
        relatedPosts={relatedPosts}
        backHref={`/academy/${category}`}
        backLabel={tAcademy('backToCategory', { category: categoryTitle })}
        breadcrumb={breadcrumb}
        content={linkedContent}
        showTranslationPendingBanner={post.servedLocale !== post.locale}
      />
    </>
  )
}
