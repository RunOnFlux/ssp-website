'use client'

import { useEffect } from 'react'
import { setContentContext, type ContentContext } from '@/lib/gtag'

export function PageContext(props: ContentContext): null {
  useEffect(() => {
    setContentContext(props)
  }, [props.section, props.slug, props.locale, props.category])
  return null
}
