const CMS_BASE = (process.env.SSP_CMS_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

/**
 * CMS posts store image fields as site-rooted paths like `/media/123-foo.png`.
 * Resolve those against the configured CMS host so the browser can fetch them.
 * Already-absolute URLs are returned unchanged.
 */
export function cmsMediaUrl(path: string | null | undefined): string {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${CMS_BASE}${path.startsWith('/') ? path : `/${path}`}`
}
