'use client'

import Image from 'next/image'
import { useTheme } from '../hooks/useTheme'

export function Logo({ width = 120, height = 45, className = '', alt = 'SSP Wallet', ...props }) {
  const { theme } = useTheme()

  // Use light logo with dark text on light backgrounds, dark logo with light text on dark backgrounds
  const logoSrc = theme === 'dark' ? '/logo.svg' : '/logo-light-mode.svg'

  return (
    <Image src={logoSrc} alt={alt} width={width} height={height} className={className} {...props} />
  )
}
