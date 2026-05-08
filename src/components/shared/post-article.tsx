'use client'

import { Check, Copy, Facebook, MessageSquare, Send, Twitter } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import { Link } from '@/i18n/navigation'
import { extractHeadings } from '@/lib/content-utils'
import type { NewsroomPost } from '@/types/newsroom'
import { TranslationPendingBanner } from './translation-pending-banner'

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface PostArticleProps {
  post: NewsroomPost
  relatedPosts: NewsroomPost[]
  backHref?: string
  backLabel?: string
  breadcrumb?: ReactNode
  content?: string
  showTranslationPendingBanner?: boolean
}

export function PostArticle({
  post,
  relatedPosts,
  backHref = '/newsroom',
  backLabel,
  breadcrumb,
  content,
  showTranslationPendingBanner,
}: PostArticleProps) {
  const t = useTranslations('Newsroom')
  const [linkCopied, setLinkCopied] = useState(false)

  const headings = extractHeadings(content ?? post.content)
  // Mirrors extractHeadings dedup so ToC anchors and rendered h2 ids stay in sync
  // even when an article has duplicate h2 texts.
  const seenIds = new Map<string, number>()
  function slugifyHeading(text: string): string {
    const base = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const count = seenIds.get(base) ?? 0
    seenIds.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
  const articleUrl = typeof window !== 'undefined' ? window.location.href : ''
  const encodedUrl = encodeURIComponent(articleUrl)
  const encodedTitle = encodeURIComponent(post.title)

  function shareOn(platform: 'twitter' | 'facebook' | 'telegram' | 'reddit') {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer')
  }

  function copyLink() {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(articleUrl).catch(() => {})
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <>
      <section className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden rounded-b-[40px] bg-linear-to-b from-white to-gray-50 pb-12 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24'>
        <div className='container-custom relative z-10 pt-24 md:pt-32 lg:pt-40'>
          {breadcrumb ?? (
            <Link
              href={backHref}
              className='text-lg text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            >
              &lt; {backLabel ?? t('backToNewsroom')}
            </Link>
          )}
          <h1 className='mt-6 max-w-[900px] text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-[60px] lg:leading-[1.2] dark:text-white'>
            {post.title}
          </h1>
          <div className='mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            <div className='flex items-center gap-3 text-sm text-gray-500 md:text-base dark:text-gray-400'>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>·</span>
              <span>{t('minRead', { minutes: post.readTime })}</span>
              <span>·</span>
              <span>{t('byAuthor', { author: post.author })}</span>
            </div>
          </div>
        </div>
      </section>

      <article
        lang={post.servedLocale}
        className='container-custom my-12 grid grid-cols-1 gap-12 md:my-16 lg:my-24 lg:grid-cols-[200px_1fr]'
      >
        {showTranslationPendingBanner && (
          <div className='lg:col-span-2'>
            <TranslationPendingBanner />
          </div>
        )}
        {headings.length > 0 && (
          <aside className='sticky top-24 hidden h-fit lg:block'>
            <h2 className='mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400'>
              {t('tableOfContents')}
            </h2>
            <ul className='space-y-2 text-sm'>
              {headings.map(h => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className='hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300'
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <div className='prose prose-lg dark:prose-invert max-w-none'>
          <Image
            src={post.image}
            alt={post.imageAlt}
            width={1200}
            height={630}
            className='rounded-card mb-8'
          />
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
              a: ({ href, children, ...props }) => {
                if (href?.startsWith('http')) {
                  return (
                    <a href={href} target='_blank' rel='noopener noreferrer' {...props}>
                      {children}
                    </a>
                  )
                }
                return (
                  <Link href={href ?? '#'} {...props}>
                    {children}
                  </Link>
                )
              },
              img: ({ src, alt }) =>
                src ? (
                  <Image
                    src={typeof src === 'string' ? src : ''}
                    alt={alt ?? ''}
                    width={1200}
                    height={630}
                    className='rounded-card'
                  />
                ) : null,
            }}
          >
            {content ?? post.content}
          </ReactMarkdown>
        </div>
      </article>

      <section className='container-custom my-12'>
        <h2 className='mb-4 text-lg font-semibold'>{t('shareTitle')}</h2>
        <div className='flex flex-wrap gap-3'>
          <button onClick={() => shareOn('twitter')} className='btn btn-secondary'>
            <Twitter className='mr-2 h-4 w-4' />
            {t('shareTwitter')}
          </button>
          <button onClick={() => shareOn('facebook')} className='btn btn-secondary'>
            <Facebook className='mr-2 h-4 w-4' />
            {t('shareFacebook')}
          </button>
          <button onClick={() => shareOn('telegram')} className='btn btn-secondary'>
            <Send className='mr-2 h-4 w-4' />
            {t('shareTelegram')}
          </button>
          <button onClick={() => shareOn('reddit')} className='btn btn-secondary'>
            <MessageSquare className='mr-2 h-4 w-4' />
            {t('shareReddit')}
          </button>
          <button onClick={copyLink} className='btn btn-secondary'>
            {linkCopied ? (
              <>
                <Check className='mr-2 h-4 w-4' />
                {t('shareCopied')}
              </>
            ) : (
              <>
                <Copy className='mr-2 h-4 w-4' />
                {t('shareCopy')}
              </>
            )}
          </button>
        </div>
      </section>

      {relatedPosts.length > 0 && (
        <section className='container-custom mb-16 md:mb-24'>
          <h2 className='mb-6 text-2xl font-bold'>{t('relatedArticles')}</h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {relatedPosts.map(p => (
              <NewsroomCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
