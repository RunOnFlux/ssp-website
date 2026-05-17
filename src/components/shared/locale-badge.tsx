'use client'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/routing'

export function LocaleBadge({ locale }: { locale: Locale }) {
  const t = useTranslations('Common.localeBadge')
  return (
    <span
      className='inline-flex items-center rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
      aria-label={`Language: ${t(locale)}`}
    >
      {t(locale)}
    </span>
  )
}
