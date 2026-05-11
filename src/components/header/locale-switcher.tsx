'use client'

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Globe } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { type Locale, routing } from '@/i18n/routing'
import { useLocalizedPaths } from '@/lib/i18n/localized-paths'

const LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
  'pt-BR': 'Português (Brasil)',
  ru: 'Русский',
  tr: 'Türkçe',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  pl: 'Polski',
  ko: '한국어',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
}

export function LocaleSwitcher() {
  const t = useTranslations('Header')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const localizedPaths = useLocalizedPaths()

  function setLocale(next: Locale) {
    const targetPath = localizedPaths[next]
    if (targetPath) {
      router.replace(targetPath, { locale: next })
    } else {
      router.replace(pathname, { locale: next })
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className='dark:bg-dark-800 dark:hover:bg-dark-700 inline-flex items-center gap-2 rounded-lg bg-gray-100 p-2 hover:bg-gray-200'
          aria-label={t('selectLanguage')}
        >
          <Globe className='h-5 w-5 text-gray-700 dark:text-gray-300' />
          <span className='hidden text-sm font-medium md:inline'>{LABELS[locale]}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className='rounded-card dark:border-dark-700 dark:bg-dark-800 z-50 border border-gray-200 bg-white p-2 shadow-md'
        >
          {routing.locales.map(l => (
            <DropdownMenu.Item
              key={l}
              onSelect={() => setLocale(l as Locale)}
              className={`dark:hover:bg-dark-700 cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100 ${
                l === locale ? 'text-primary-600 dark:text-primary-400 font-semibold' : ''
              }`}
            >
              {LABELS[l as Locale]}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
