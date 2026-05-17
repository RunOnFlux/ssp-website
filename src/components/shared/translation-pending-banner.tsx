'use client'
import { useTranslations } from 'next-intl'

export function TranslationPendingBanner() {
  const t = useTranslations('Common')
  return (
    <div
      role='status'
      className='mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
    >
      {t('translationPendingBanner')}
    </div>
  )
}
