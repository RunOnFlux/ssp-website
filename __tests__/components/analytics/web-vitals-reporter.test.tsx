import { render } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const onLCPMock = vi.fn()
const onINPMock = vi.fn()
const onCLSMock = vi.fn()

vi.mock('web-vitals/attribution', () => ({
  onLCP: onLCPMock,
  onINP: onINPMock,
  onCLS: onCLSMock,
}))

describe('WebVitalsReporter', () => {
  beforeEach(() => {
    onLCPMock.mockReset()
    onINPMock.mockReset()
    onCLSMock.mockReset()
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true })
  })

  it('registers callbacks for LCP, INP, CLS', async () => {
    const { WebVitalsReporter } =
      await import('../../../src/components/analytics/web-vitals-reporter')
    render(<WebVitalsReporter />)
    expect(onLCPMock).toHaveBeenCalledTimes(1)
    expect(onINPMock).toHaveBeenCalledTimes(1)
    expect(onCLSMock).toHaveBeenCalledTimes(1)
  })

  it('callback forwards metric to gtag when consent is granted', async () => {
    const gtag = vi.fn()
    ;(window as unknown as { gtag: typeof gtag }).gtag = gtag
    ;(window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => true

    const { WebVitalsReporter } =
      await import('../../../src/components/analytics/web-vitals-reporter')
    render(<WebVitalsReporter />)
    const cb = onLCPMock.mock.calls[0][0]
    cb({
      name: 'LCP',
      value: 2300,
      delta: 100,
      id: 'v3-1',
      rating: 'needs-improvement',
      attribution: { element: '#hero img' },
    })
    expect(gtag).toHaveBeenCalled()
    const [event, name, params] = gtag.mock.calls[0]
    expect(event).toBe('event')
    expect(name).toBe('LCP')
    expect(params.metric_id).toBe('v3-1')
    expect(params.metric_rating).toBe('needs-improvement')
    expect(params.debug_target).toBe('#hero img')
  })
})
