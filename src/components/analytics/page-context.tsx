'use client'

import { useEffect } from 'react'
import { setContentContext, type ContentContext } from '@/lib/gtag'

export function PageContext({ section, slug, locale, category }: ContentContext): null {
  useEffect(() => {
    setContentContext({ section, slug, locale, category })
  }, [section, slug, locale, category])
  return null
}
