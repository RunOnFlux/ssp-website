// @vitest-environment node
// Cookie headers are Fetch-spec "forbidden" in happy-dom's Request, so the
// NEXT_LOCALE cookie would never be parsed.  The node environment has no such
// restriction and matches the Node.js edge-function runtime where the
// middleware actually runs.
import { NextRequest } from 'next/server'
import { describe, it, expect, vi } from 'vitest'

// The middleware imports @/lib/cms; we mock it so the test stays hermetic even
// though the agent-md branch never fires for the html-accept requests below.
vi.mock('@/lib/cms', () => ({
  getAuthorBySlug: vi.fn(),
  getPostBySlug: vi.fn(),
}))

import middleware from './middleware'

function makeReq(path: string, headers: Record<string, string> = {}): NextRequest {
  return new NextRequest(new URL(path, 'http://localhost'), {
    headers: { accept: 'text/html', ...headers },
  })
}

describe('middleware locale persistence', () => {
  it('redirects bare paths to the Accept-Language locale when no NEXT_LOCALE cookie is set', async () => {
    const req = makeReq('/', { 'accept-language': 'fr-FR,fr;q=0.9' })
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.headers.get('location')).toMatch(/\/fr(\/|$)/)
  })

  it('prefers NEXT_LOCALE cookie over Accept-Language', async () => {
    const req = makeReq('/', {
      'accept-language': 'fr-FR,fr;q=0.9',
      cookie: 'NEXT_LOCALE=pl',
    })
    const res = await middleware(req)
    expect(res).toBeDefined()
    expect(res!.headers.get('location')).toMatch(/\/pl(\/|$)/)
  })

  it('keeps the URL locale when it is explicit, regardless of the cookie', async () => {
    const req = makeReq('/de/academy', {
      cookie: 'NEXT_LOCALE=es',
    })
    const res = await middleware(req)
    // The explicit /de/ prefix is honored; either we get no redirect or a 200
    // pass-through. Either way the location header (if any) must not be /es/.
    const loc = res?.headers.get('location') ?? ''
    expect(loc).not.toMatch(/\/es(\/|$)/)
  })
})
