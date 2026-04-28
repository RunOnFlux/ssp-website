import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { renderArticleAsAgentMd, renderAuthorAsAgentMd } from '@/lib/agent-md/render'
import { isDynamicArticleRoute, resolveAgentMdPath } from '@/lib/agent-md/resolve'
import { getAuthorBySlug, getPostBySlug } from '@/lib/cms'

export const runtime = 'nodejs'

const intlMiddleware = createMiddleware(routing)

function mdResponse(md: string, req: NextRequest): NextResponse {
  return new NextResponse(md, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      Link: `<${req.nextUrl.origin}${req.nextUrl.pathname}>; rel="canonical"`,
      Vary: 'Accept',
    },
  })
}

export default async function middleware(req: NextRequest) {
  const accept = req.headers.get('accept') ?? ''
  const flag = process.env.AGENT_MD ?? '1'

  if (flag !== '0' && accept.includes('text/markdown')) {
    const pathname = req.nextUrl.pathname
    const file = resolveAgentMdPath(pathname)
    if (file) {
      try {
        const fs = await import('fs/promises')
        const path = await import('path')
        const md = await fs.readFile(path.resolve(process.cwd(), file), 'utf8')
        return mdResponse(md, req)
      } catch {
        // expected ENOENT for routes without a sibling agent.md; fall through
      }
    }
    const dyn = isDynamicArticleRoute(pathname)
    if (dyn) {
      try {
        if (dyn.kind === 'newsroom') {
          const post = await getPostBySlug(dyn.slug)
          if (post && post.section === 'newsroom') {
            return mdResponse(renderArticleAsAgentMd(post), req)
          }
        }
        if (dyn.kind === 'academy') {
          const post = await getPostBySlug(dyn.slug)
          if (post && post.section === 'academy' && post.category === dyn.category) {
            return mdResponse(renderArticleAsAgentMd(post), req)
          }
        }
        if (dyn.kind === 'author') {
          const a = await getAuthorBySlug(dyn.slug)
          if (a) return mdResponse(renderAuthorAsAgentMd(a), req)
        }
        // 'series' falls through to HTML — series rendering deferred to Phase 17/19
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('[agent-md] dynamic render failed, falling through', err)
      }
    }
  }

  const response = intlMiddleware(req)
  response.headers.set('Vary', 'Accept')
  response.headers.set(
    'Link',
    `<${req.nextUrl.origin}${req.nextUrl.pathname}>; rel="canonical"; type="text/html"`
  )
  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
