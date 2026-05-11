import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'zh', 'pt-BR', 'ru', 'tr', 'ja', 'de', 'fr', 'it', 'pl', 'ko', 'vi', 'id'],
  defaultLocale: 'en',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
