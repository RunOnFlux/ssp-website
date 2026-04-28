import { Clock } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { NewsroomPost } from '@/types/newsroom'

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

interface NewsroomCardProps {
  post: NewsroomPost
  href?: string
}

export function NewsroomCard({ post, href }: NewsroomCardProps) {
  const link =
    href ??
    (post.section === 'academy' && post.category
      ? `/academy/${post.category}/${post.slug}`
      : `/newsroom/${post.slug}`)
  const cardImage = post.imageSquare || post.image
  const cardImageAlt = post.imageSquare ? post.imageSquareAlt || post.imageAlt : post.imageAlt
  return (
    <Link href={link} className='group block'>
      <article className='rounded-card dark:border-dark-700 dark:bg-dark-800 overflow-hidden border border-gray-200 bg-white transition-transform duration-200 group-hover:scale-[1.02]'>
        <div className='relative h-[250px] overflow-hidden md:h-[350px]'>
          <Image
            src={cardImage}
            alt={cardImageAlt ?? ''}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 50vw'
          />
          <div className='dark:to-dark-800/80 absolute inset-0 bg-linear-to-b from-transparent to-white/80' />
        </div>
        <div className='px-6 pt-4 pb-6 md:px-8 md:pt-6 md:pb-8'>
          <h3 className='mb-3 text-2xl leading-tight font-bold text-gray-900 md:mb-4 md:text-[40px] md:leading-[50px] dark:text-white'>
            {post.title}
          </h3>
          <p className='mb-4 line-clamp-2 text-base leading-relaxed font-medium text-gray-600 md:mb-6 md:text-2xl md:leading-[39.6px] dark:text-gray-300'>
            {post.description}
          </p>
          <div className='flex items-center justify-between'>
            <time
              dateTime={post.date}
              className='text-sm font-medium text-gray-500 md:text-base dark:text-gray-400'
            >
              {formatDate(post.date)}
            </time>
            <div className='rounded-pill bg-primary-500/15 flex items-center gap-2 px-4 py-2'>
              <Clock className='text-primary-600 dark:text-primary-400 h-4 w-4' />
              <span className='text-primary-700 dark:text-primary-300 text-sm font-bold md:text-base'>
                {post.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
