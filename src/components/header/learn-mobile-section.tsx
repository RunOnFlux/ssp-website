'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface Props {
  pathname: string
  onItemClick: () => void
}

type MobileHref = '/newsroom' | '/academy' | '/academy/series' | '/glossary'

export function LearnMobileSection({ pathname, onItemClick }: Props) {
  const t = useTranslations('Header')

  const items: Array<{ href: MobileHref; label: string }> = [
    { href: '/newsroom', label: t('newsroom') },
    { href: '/academy', label: t('academy') },
    { href: '/academy/series', label: t('series') },
    { href: '/glossary', label: t('learnGlossary') },
  ]

  return (
    <div className='py-2'>
      <div className='px-4 pt-2 pb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
        {t('learn')}
      </div>
      {items.map(item => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className={cn(
            'block px-6 py-2 text-base font-medium transition-colors duration-200',
            pathname === item.href || pathname.startsWith(item.href + '/')
              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
              : 'hover:text-primary-600 dark:hover:bg-dark-800 dark:hover:text-primary-400 text-gray-700 hover:bg-gray-50 dark:text-gray-300'
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
