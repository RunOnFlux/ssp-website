import { Github, Globe, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Author } from '@/types/newsroom'

export function AuthorByline({ author }: { author: Author }) {
  const t = useTranslations('Common')
  return (
    <div className='rounded-card dark:border-dark-700 dark:bg-dark-800 mt-4 flex items-start gap-4 border border-gray-200 bg-white p-4'>
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className='rounded-full'
        />
      )}
      <div className='flex-1'>
        <Link
          href={`/author/${author.slug}`}
          className='hover:text-primary-600 dark:hover:text-primary-400 font-semibold text-gray-900 dark:text-white'
        >
          {author.name}
        </Link>
        {author.title && <p className='text-sm text-gray-500 dark:text-gray-400'>{author.title}</p>}
      </div>
      <div className='flex items-center gap-3'>
        {author.twitterUrl && (
          <a
            href={author.twitterUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='Twitter'
          >
            <Twitter className='h-4 w-4' />
          </a>
        )}
        {author.githubUrl && (
          <a href={author.githubUrl} target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
            <Github className='h-4 w-4' />
          </a>
        )}
        {author.linkedinUrl && (
          <a
            href={author.linkedinUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label='LinkedIn'
          >
            <Linkedin className='h-4 w-4' />
          </a>
        )}
        {author.websiteUrl && (
          <a
            href={author.websiteUrl}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={t('websiteAriaLabel')}
          >
            <Globe className='h-4 w-4' />
          </a>
        )}
      </div>
    </div>
  )
}
