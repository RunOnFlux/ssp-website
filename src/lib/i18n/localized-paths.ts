'use client'

import { useSyncExternalStore } from 'react'
import type { Locale } from '@/i18n/routing'

export type LocalizedPaths = Partial<Record<Locale, string>>

let currentPaths: LocalizedPaths = {}
const listeners = new Set<() => void>()

function emit() {
  for (const listener of listeners) listener()
}

export function setLocalizedPaths(paths: LocalizedPaths) {
  currentPaths = paths
  emit()
}

export function clearLocalizedPaths() {
  if (Object.keys(currentPaths).length === 0) return
  currentPaths = {}
  emit()
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getSnapshot() {
  return currentPaths
}

function getServerSnapshot(): LocalizedPaths {
  return {}
}

export function useLocalizedPaths(): LocalizedPaths {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
