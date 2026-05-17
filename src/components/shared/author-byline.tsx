import { Github, Globe, Linkedin, Twitter } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Author } from '@/types/newsroom'

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('')
}

export function AuthorByline({ author }: { author: Author }) {
  const t = useTranslations('Common')
  const initials = getInitials(author.name)

  return (
    <div className='group rounded-card dark:border-dark-700 dark:from-dark-800 dark:to-dark-800/60 mt-4 flex items-center gap-4 border border-gray-200 bg-linear-to-br from-white to-gray-50 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={56}
          height={56}
          className='ring-primary-500/20 h-14 w-14 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
        />
      ) : (
        <div
          aria-hidden='true'
          className='from-primary-500 to-primary-700 ring-primary-500/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-lg font-semibold text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
        >
          {initials}
        </div>
      )}
      <div className='min-w-0 flex-1'>
        <Link
          href={`/author/${author.slug}`}
          className='hover:text-primary-600 dark:hover:text-primary-400 block truncate text-base font-semibold text-gray-900 transition-colors dark:text-white'
        >
          {author.name}
        </Link>
        {author.title && (
          <p className='truncate text-sm text-gray-500 dark:text-gray-400'>{author.title}</p>
        )}
      </div>
      {(author.twitterUrl || author.githubUrl || author.linkedinUrl || author.websiteUrl) && (
        <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
          {author.twitterUrl && (
            <a
              href={author.twitterUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Twitter'
              className='hover:text-primary-600 dark:hover:text-primary-400 rounded p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <Twitter className='h-4 w-4' />
            </a>
          )}
          {author.githubUrl && (
            <a
              href={author.githubUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='GitHub'
              className='hover:text-primary-600 dark:hover:text-primary-400 rounded p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <Github className='h-4 w-4' />
            </a>
          )}
          {author.linkedinUrl && (
            <a
              href={author.linkedinUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label='LinkedIn'
              className='hover:text-primary-600 dark:hover:text-primary-400 rounded p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
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
              className='hover:text-primary-600 dark:hover:text-primary-400 rounded p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <Globe className='h-4 w-4' />
            </a>
          )}
        </div>
      )}
    </div>
  )
}
