'use client'

import Image, { type ImageProps } from 'next/image'
import type { CSSProperties } from 'react'
import { useTheme } from '@/hooks/use-theme'

type LogoProps = Omit<ImageProps, 'src' | 'alt' | 'width' | 'height'> & {
  width?: number
  height?: number
  className?: string
  alt?: string
  style?: CSSProperties
}

export function Logo({
  width = 120,
  height = 45,
  className = '',
  alt = 'SSP Wallet',
  style,
  ...props
}: LogoProps) {
  const { theme, mounted } = useTheme()

  // Prevent hydration mismatch by using a default logo until mounted
  const logoSrc = mounted ? (theme === 'dark' ? '/logo.svg' : '/logo-light-mode.svg') : '/logo.svg' // Default logo during SSR/hydration

  // Merge styles to ensure Next.js doesn't warn about aspect ratio
  const mergedStyle: CSSProperties = {
    width: 'auto',
    height: 'auto',
    ...style,
  }

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={mergedStyle}
      priority
      {...props}
    />
  )
}
