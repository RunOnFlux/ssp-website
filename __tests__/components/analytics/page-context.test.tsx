import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('PageContext', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true })
  })

  it('calls setContentContext with passed props', async () => {
    const gtag = vi.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    ;(window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => true
    const { PageContext } = await import('../../../src/components/analytics/page-context')
    render(<PageContext section='academy' slug='intro' locale='en' />)
    expect(gtag).toHaveBeenCalledWith(
      'set',
      expect.objectContaining({
        content_group: 'academy',
        post_section: 'academy',
        post_slug: 'intro',
        post_locale: 'en',
      })
    )
  })

  it('renders null (no visible output)', async () => {
    const { PageContext } = await import('../../../src/components/analytics/page-context')
    const { container } = render(<PageContext section='newsroom' slug='x' locale='en' />)
    expect(container.firstChild).toBeNull()
  })
})
