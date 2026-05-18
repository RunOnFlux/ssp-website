import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

describe('track wrappers', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'window', { value: {}, configurable: true, writable: true });
    const gtag = vi.fn();
    (window as unknown as { gtag: typeof gtag }).gtag = gtag;
    (window as unknown as { hasAnalyticsConsent: () => boolean }).hasAnalyticsConsent = () => true;
  });

  it('TrackCtaButton emits cta_click on click', async () => {
    const { TrackCtaButton } = await import('../../../src/components/analytics/track');
    const handler = vi.fn();
    const { getByRole } = render(
      <TrackCtaButton ctaId="enterprise_contact" onClick={handler}>Talk to us</TrackCtaButton>,
    );
    fireEvent.click(getByRole('button'));
    expect(handler).toHaveBeenCalled();
    const calls = (window.gtag as unknown as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0]).toEqual(['event', 'cta_click', { cta_id: 'enterprise_contact' }]);
  });

  it('TrackOutboundLink emits outbound_click with target host', async () => {
    const { TrackOutboundLink } = await import('../../../src/components/analytics/track');
    const { getByRole } = render(
      <TrackOutboundLink href="https://example.com/foo">Example</TrackOutboundLink>,
    );
    fireEvent.click(getByRole('link'));
    const calls = (window.gtag as unknown as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0]).toEqual([
      'event',
      'outbound_click',
      { target_host: 'example.com', target_url: 'https://example.com/foo' },
    ]);
  });

  it('TrackVideoPlay emits video_play on play event', async () => {
    const { TrackVideoPlay } = await import('../../../src/components/analytics/track');
    const { container } = render(
      <TrackVideoPlay videoId="hero-loop" placement="home">
        <video data-testid="v" />
      </TrackVideoPlay>,
    );
    const video = container.querySelector('video')!;
    fireEvent.play(video);
    const calls = (window.gtag as unknown as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls[0]).toEqual([
      'event', 'video_play', { video_id: 'hero-loop', placement: 'home' },
    ]);
  });
});
