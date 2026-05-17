import { BookOpen, Clock, Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { NewsroomPost } from '@/types/newsroom'

export function AtAGlance({ post }: { post: NewsroomPost }) {
  const t = useTranslations('Academy')
  return (
    <div className='dark:border-dark-700 flex flex-wrap gap-3 border-y border-gray-200 py-4'>
      <span className='rounded-pill dark:bg-dark-800 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 text-sm'>
        <Clock className='h-4 w-4' />
        {post.readTime} min read
      </span>
      {post.difficulty && (
        <span className='rounded-pill dark:bg-dark-800 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 text-sm'>
          <BookOpen className='h-4 w-4' />
          {t(`difficulty.${post.difficulty}` as 'difficulty.beginner')}
        </span>
      )}
      {post.seriesSlug && post.seriesOrder && (
        <span className='rounded-pill dark:bg-dark-800 inline-flex items-center gap-2 bg-gray-100 px-3 py-1 text-sm'>
          <Layers className='h-4 w-4' />
          Part {post.seriesOrder}
        </span>
      )}
    </div>
  )
}
