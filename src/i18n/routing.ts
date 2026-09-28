import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'zh', 'pt-BR', 'ru', 'tr', 'ja', 'de', 'fr', 'it', 'pl', 'ko', 'vi', 'id'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // next-intl would add an hreflang Link header built from the request origin,
  // which behind the proxy is the internal localhost. Pages declare hreflang in
  // their own metadata instead.
  alternateLinks: false,
})

export type Locale = (typeof routing.locales)[number]
