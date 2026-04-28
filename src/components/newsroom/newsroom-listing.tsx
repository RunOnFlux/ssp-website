'use client'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { NewsroomCard } from '@/components/newsroom/newsroom-card'
import type { NewsroomPost } from '@/types/newsroom'

const POSTS_PER_PAGE = 6

export function NewsroomListing({ posts, tags }: { posts: NewsroomPost[]; tags: string[] }) {
  const t = useTranslations('Newsroom')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE)

  const filteredPosts = useMemo(
    () => (activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  )
  const visiblePosts = filteredPosts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredPosts.length

  function handleTagClick(tag: string | null) {
    setActiveTag(tag)
    setVisibleCount(POSTS_PER_PAGE)
  }

  return (
    <div>
      <div className='container-custom py-8 md:py-12'>
        <div className='flex flex-wrap gap-3'>
          <button
            onClick={() => handleTagClick(null)}
            className={`rounded-pill px-5 py-2.5 text-sm font-bold md:text-base ${
              activeTag === null
                ? 'bg-primary-500 text-white'
                : 'hover:border-primary-400 dark:border-dark-700 dark:bg-dark-800 border border-gray-300 bg-white text-gray-700 dark:text-gray-300'
            }`}
          >
            {t('filterAll')}
          </button>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`rounded-pill px-5 py-2.5 text-sm font-bold capitalize md:text-base ${
                activeTag === tag
                  ? 'bg-primary-500 text-white'
                  : 'hover:border-primary-400 dark:border-dark-700 dark:bg-dark-800 border border-gray-300 bg-white text-gray-700 dark:text-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className='container-custom pb-16 md:pb-24'>
        {filteredPosts.length > 0 ? (
          <>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8'>
              {visiblePosts.map(p => (
                <NewsroomCard key={p.slug} post={p} />
              ))}
            </div>
            {hasMore && (
              <div className='mt-10 flex justify-center'>
                <button
                  onClick={() => setVisibleCount(v => v + POSTS_PER_PAGE)}
                  className='btn btn-primary'
                >
                  {t('loadMore')}
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='text-center text-gray-600 dark:text-gray-300'>{t('noArticles')}</p>
        )}
      </div>
    </div>
  )
}
