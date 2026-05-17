import { routing } from '@/i18n/routing'

const LOCALE_PREFIX = new RegExp(`^\\/(?:${routing.locales.join('|')})(\\/.*)?$`)

const STATIC_ROUTES: Record<string, string> = {
  '': 'src/app/[locale]/agent.md',
  features: 'src/app/[locale]/features/agent.md',
  guide: 'src/app/[locale]/guide/agent.md',
  support: 'src/app/[locale]/support/agent.md',
  contact: 'src/app/[locale]/contact/agent.md',
  download: 'src/app/[locale]/download/agent.md',
  enterprise: 'src/app/[locale]/enterprise/agent.md',
  'case-studies/flux-foundation': 'src/app/[locale]/case-studies/flux-foundation/agent.md',
  'privacy-policy': 'src/app/[locale]/privacy-policy/agent.md',
  'terms-of-service': 'src/app/[locale]/terms-of-service/agent.md',
  'cookie-policy': 'src/app/[locale]/cookie-policy/agent.md',
  newsroom: 'src/app/[locale]/newsroom/agent.md',
  academy: 'src/app/[locale]/academy/agent.md',
}

function stripLocale(pathname: string): string | null {
  const m = pathname.match(LOCALE_PREFIX)
  if (!m) return null
  return (m[1] ?? '').replace(/^\//, '').replace(/\/$/, '')
}

export function resolveAgentMdPath(pathname: string): string | null {
  const route = stripLocale(pathname)
  if (route === null) return null
  return STATIC_ROUTES[route] ?? null
}

export type DynamicMatch =
  | { kind: 'newsroom'; slug: string }
  | { kind: 'academy'; category: string; slug: string }
  | { kind: 'series'; slug: string }
  | { kind: 'author'; slug: string }

export function isDynamicArticleRoute(pathname: string): DynamicMatch | null {
  const route = stripLocale(pathname)
  if (route === null) return null
  let m: RegExpMatchArray | null
  if ((m = route.match(/^newsroom\/([^/]+)$/))) return { kind: 'newsroom', slug: m[1] }
  if ((m = route.match(/^academy\/series\/([^/]+)$/))) return { kind: 'series', slug: m[1] }
  if ((m = route.match(/^academy\/([^/]+)\/([^/]+)$/)))
    return { kind: 'academy', category: m[1], slug: m[2] }
  if ((m = route.match(/^author\/([^/]+)$/))) return { kind: 'author', slug: m[1] }
  return null
}
