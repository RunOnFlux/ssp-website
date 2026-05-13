import { getTermMap } from './academy-terms'
import { buildFallbackTermMap } from './build-fallback-term-map'
import { autoLinkContent } from './glossary-linker'

export const MAX_LINKS_PER_POST = 8

let cachedCurated: ReturnType<typeof getTermMap> | null = null
let cachedFallback: ReturnType<typeof buildFallbackTermMap> | null = null

function getCuratedMap(): ReturnType<typeof getTermMap> {
  if (!cachedCurated) cachedCurated = getTermMap()
  return cachedCurated
}

function getFallbackMap(): ReturnType<typeof buildFallbackTermMap> {
  if (!cachedFallback) {
    const curated = getCuratedMap()
    cachedFallback = buildFallbackTermMap(new Set(curated.keys()))
  }
  return cachedFallback
}

/**
 * Auto-links a post body using both the curated academy term map and the
 * 2,157-entry glossary as a fallback. Caps total inline links at
 * `MAX_LINKS_PER_POST` to avoid link-soup prose.
 *
 * Server-only — runs during SSR / generateStaticParams. The composed maps are
 * memoized at module scope; rebuilding them on every request would re-walk the
 * full glossary unnecessarily.
 */
export function autoLinkPostContent(content: string, selfSlug: string): string {
  return autoLinkContent(content, selfSlug, getCuratedMap(), {
    maxLinks: MAX_LINKS_PER_POST,
    fallbackTermMap: getFallbackMap(),
  })
}
