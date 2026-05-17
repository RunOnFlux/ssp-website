'use client'

import { useEffect } from 'react'
import {
  clearLocalizedPaths,
  setLocalizedPaths,
  type LocalizedPaths,
} from '@/lib/i18n/localized-paths'

export function LocalizedPathsRegistrar({ paths }: { paths: LocalizedPaths }) {
  useEffect(() => {
    setLocalizedPaths(paths)
    return () => clearLocalizedPaths()
  }, [paths])

  return null
}
