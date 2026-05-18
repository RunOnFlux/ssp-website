// Google Analytics configuration

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

interface GtagEvent {
  action: string
  category: string
  label: string
  value?: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GtagEvent): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Initialize Google Analytics
export const initGA = (): void => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.dataLayer = window.dataLayer || []
    window.gtag = function (...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_TRACKING_ID, {
      page_path: window.location.pathname,
    })
  }
}

// Check if GA is loaded
export const isGALoaded = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

function consentGranted(): boolean {
  if (typeof window === 'undefined') return false
  const fn = (window as unknown as { hasAnalyticsConsent?: () => boolean }).hasAnalyticsConsent
  return typeof fn === 'function' ? fn() : false
}

export interface TrackEventParams {
  [key: string]: string | number | boolean | undefined
}

export const trackEvent = (name: string, params: TrackEventParams = {}): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (!consentGranted()) return
  window.gtag('event', name, params)
}

export interface ContentContext {
  section: 'academy' | 'newsroom' | 'academy_category'
  slug?: string
  category?: string
  locale: string
}

export const setContentContext = (ctx: ContentContext): void => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (!consentGranted()) return
  window.gtag('set', {
    content_group: ctx.section === 'academy_category' ? 'academy' : ctx.section,
    post_section: ctx.section,
    post_slug: ctx.slug ?? '',
    post_locale: ctx.locale,
    ...(ctx.category ? { post_category: ctx.category } : {}),
  })
}
