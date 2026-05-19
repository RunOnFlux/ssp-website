'use client'

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
} from 'react'
import { trackEvent } from '@/lib/gtag'

export interface TrackCtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ctaId: string
  extra?: Record<string, string | number>
  children: ReactNode
}

export function TrackCtaButton({ ctaId, extra, onClick, children, ...rest }: TrackCtaButtonProps) {
  return (
    <button
      {...rest}
      onClick={e => {
        trackEvent('cta_click', { cta_id: ctaId, ...extra })
        onClick?.(e)
      }}
    >
      {children}
    </button>
  )
}

export interface TrackOutboundLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: ReactNode
}

export function TrackOutboundLink({ href, onClick, children, ...rest }: TrackOutboundLinkProps) {
  return (
    <a
      {...rest}
      href={href}
      onClick={e => {
        try {
          const u = new URL(href)
          trackEvent('outbound_click', { target_host: u.host, target_url: href })
        } catch {
          trackEvent('outbound_click', { target_host: '', target_url: href })
        }
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}

export interface TrackVideoPlayProps {
  videoId: string
  placement: string
  children: ReactNode
}

export function TrackVideoPlay({ videoId, placement, children }: TrackVideoPlayProps) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const handler = (): void => {
      trackEvent('video_play', { video_id: videoId, placement })
    }
    const videos = root.querySelectorAll('video')
    videos.forEach(v => v.addEventListener('play', handler, { once: true }))
    return () => videos.forEach(v => v.removeEventListener('play', handler))
  }, [videoId, placement])
  return <div ref={ref}>{children}</div>
}

export interface TrackScrollDepthProps {
  contentRef: React.RefObject<HTMLElement | null>
}

const THRESHOLDS = [25, 50, 75, 100]

export function TrackScrollDepth({ contentRef }: TrackScrollDepthProps) {
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const fired = new Set<number>()
    const onScroll = (): void => {
      const rect = el.getBoundingClientRect()
      const total = rect.height
      const viewed = Math.min(window.innerHeight - rect.top, total)
      const pct = Math.max(0, Math.min(100, (viewed / total) * 100))
      for (const t of THRESHOLDS) {
        if (pct >= t && !fired.has(t)) {
          fired.add(t)
          trackEvent('scroll_depth', { percent: t })
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [contentRef])
  return null
}

// Re-export trackEvent for ad-hoc use in instrumentation sites.
export { trackEvent } from '@/lib/gtag'
