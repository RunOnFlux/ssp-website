import type { Locale } from '@/i18n/routing'

export interface CmsFetchOptions {
  revalidate?: number
  locale?: Locale
}

export function isCmsConfigured(): boolean {
  return !!process.env.SSP_CMS_URL && !!process.env.SSP_CMS_API_KEY
}

export async function cmsFetch<T>(
  path: string,
  optsOrRevalidate: CmsFetchOptions | number = 60
): Promise<T> {
  if (!isCmsConfigured()) {
    throw new Error('SSP CMS not configured (SSP_CMS_URL or SSP_CMS_API_KEY missing)')
  }
  const opts: CmsFetchOptions =
    typeof optsOrRevalidate === 'number' ? { revalidate: optsOrRevalidate } : optsOrRevalidate
  const revalidate = opts.revalidate ?? 60

  let urlPath = path
  if (opts.locale) {
    const sep = urlPath.includes('?') ? '&' : '?'
    urlPath = `${urlPath}${sep}locale=${opts.locale}`
  }
  const url = `${process.env.SSP_CMS_URL}${urlPath}`
  const res = await fetch(url, {
    headers: { 'x-api-key': process.env.SSP_CMS_API_KEY ?? '' },
    next: { revalidate },
  } as RequestInit & { next: { revalidate: number } })
  if (!res.ok) {
    throw new Error(`CMS error: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
