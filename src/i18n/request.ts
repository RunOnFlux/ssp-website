import { getRequestConfig } from 'next-intl/server'
import { deepMerge } from './deep-merge'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as never)) {
    locale = routing.defaultLocale
  }
  const localeMessages = (await import(`../messages/${locale}.json`)).default as Record<
    string,
    unknown
  >
  if (locale === routing.defaultLocale) {
    return { locale, messages: localeMessages }
  }
  const englishMessages = (await import('../messages/en.json')).default as Record<string, unknown>
  return {
    locale,
    messages: deepMerge(englishMessages, localeMessages),
  }
})
