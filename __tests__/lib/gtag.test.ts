import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('lib/gtag', () => {
  beforeEach(() => {
    vi.resetModules()
    delete (globalThis as { window?: unknown }).window
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true })
  })

  it('trackEvent no-ops when gtag is undefined', async () => {
    const { trackEvent } = await import('../../src/lib/gtag')
    expect(() => trackEvent('foo', { bar: 1 })).not.toThrow()
  })

  it('trackEvent no-ops when consent helper returns false', async () => {
    const gtag = vi.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    ;(window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => false
    const { trackEvent } = await import('../../src/lib/gtag')
    trackEvent('foo', { bar: 1 })
    expect(gtag).not.toHaveBeenCalled()
  })

  it('trackEvent calls gtag when consent is granted', async () => {
    const gtag = vi.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    ;(window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => true
    const { trackEvent } = await import('../../src/lib/gtag')
    trackEvent('download_click', { platform: 'ios' })
    expect(gtag).toHaveBeenCalledWith('event', 'download_click', { platform: 'ios' })
  })

  it('setContentContext calls gtag set with content params', async () => {
    const gtag = vi.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    ;(window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => true
    const { setContentContext } = await import('../../src/lib/gtag')
    setContentContext({ section: 'academy', slug: 'intro', locale: 'en' })
    expect(gtag).toHaveBeenCalledWith('set', {
      content_group: 'academy',
      post_section: 'academy',
      post_slug: 'intro',
      post_locale: 'en',
    })
  })
})
