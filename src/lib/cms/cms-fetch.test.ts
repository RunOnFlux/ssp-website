import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { cmsFetch, isCmsConfigured } from './cms-fetch'

const ORIG_ENV = { ...process.env }

beforeEach(() => {
  process.env.SSP_CMS_URL = 'https://cms.example.com'
  process.env.SSP_CMS_API_KEY = 'test-key'
  vi.restoreAllMocks()
})

afterEach(() => {
  process.env = { ...ORIG_ENV }
})

describe('isCmsConfigured', () => {
  it('true when both env vars set', () => {
    expect(isCmsConfigured()).toBe(true)
  })

  it('false when url missing', () => {
    delete process.env.SSP_CMS_URL
    expect(isCmsConfigured()).toBe(false)
  })

  it('false when key missing', () => {
    delete process.env.SSP_CMS_API_KEY
    expect(isCmsConfigured()).toBe(false)
  })
})

describe('cmsFetch', () => {
  it('sends x-api-key header', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await cmsFetch('/api/v1/posts')
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/posts',
      expect.objectContaining({
        headers: expect.objectContaining({ 'x-api-key': 'test-key' }),
      })
    )
  })

  it('returns parsed JSON on 200', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ posts: [{ slug: 'a' }] }), { status: 200 })
    )
    const r = await cmsFetch<{ posts: Array<{ slug: string }> }>('/api/v1/posts')
    expect(r.posts[0].slug).toBe('a')
  })

  it('throws on non-2xx', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(new Response('nope', { status: 500 }))
    await expect(cmsFetch('/api/v1/posts')).rejects.toThrow(/500/)
  })

  it('throws when CMS not configured', async () => {
    delete process.env.SSP_CMS_URL
    await expect(cmsFetch('/api/v1/posts')).rejects.toThrow(/not configured/i)
  })

  it('appends ?locale= when options.locale set', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await cmsFetch('/api/v1/posts', { locale: 'es' })
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/posts?locale=es',
      expect.anything()
    )
  })

  it('appends locale with & when path already has query string', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await cmsFetch('/api/v1/posts?section=newsroom', { locale: 'zh' })
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/posts?section=newsroom&locale=zh',
      expect.anything()
    )
  })

  it('omits locale param when options.locale not set', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await cmsFetch('/api/v1/posts', {})
    expect(fetchSpy).toHaveBeenCalledWith('https://cms.example.com/api/v1/posts', expect.anything())
  })

  it('backward-compat: numeric second arg sets revalidate', async () => {
    const fetchSpy = vi
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    await cmsFetch('/api/v1/posts', 300)
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://cms.example.com/api/v1/posts',
      expect.objectContaining({ next: { revalidate: 300 } })
    )
  })
})
