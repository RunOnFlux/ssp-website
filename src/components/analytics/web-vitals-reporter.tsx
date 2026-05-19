'use client'

import { useEffect } from 'react'
import {
  onCLS,
  onINP,
  onLCP,
  type CLSMetricWithAttribution,
  type INPMetricWithAttribution,
  type LCPMetricWithAttribution,
} from 'web-vitals/attribution'
import { trackEvent } from '@/lib/gtag'

type WebVitalMetric = LCPMetricWithAttribution | INPMetricWithAttribution | CLSMetricWithAttribution

function getDebugTarget(metric: WebVitalMetric): string {
  const attr = metric.attribution as Record<string, unknown>
  switch (metric.name) {
    case 'LCP':
      return (
        (typeof attr['target'] === 'string' ? attr['target'] : (attr['element'] as string)) ?? ''
      )
    case 'INP':
      return typeof attr['interactionTarget'] === 'string' ? attr['interactionTarget'] : ''
    case 'CLS':
      return typeof attr['largestShiftTarget'] === 'string' ? attr['largestShiftTarget'] : ''
    default:
      return ''
  }
}

function sendToGa(metric: WebVitalMetric): void {
  const isCLS = metric.name === 'CLS'
  const value = Math.round(isCLS ? metric.delta * 1000 : metric.delta)
  trackEvent(metric.name, {
    value,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    debug_target: getDebugTarget(metric),
    non_interaction: true,
  })
}

export function WebVitalsReporter(): null {
  useEffect(() => {
    onLCP(sendToGa)
    onINP(sendToGa)
    onCLS(sendToGa)
  }, [])
  return null
}
