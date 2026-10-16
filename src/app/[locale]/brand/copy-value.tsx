'use client'

import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CopyValueProps {
  label: string
  value: string
  copyLabel: string
  copiedLabel: string
  className?: string
}

/** A label/value row that copies the value to the clipboard on click. */
export function CopyValue({
  label,
  value,
  copyLabel,
  copiedLabel,
  className = '',
}: CopyValueProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard blocked (insecure context or denied permission): the value stays visible to copy by hand.
    }
  }

  return (
    <button
      type='button'
      onClick={handleCopy}
      aria-label={copyLabel}
      className={`group dark:hover:bg-dark-700 flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-gray-100 ${className}`}
    >
      <span className='w-12 shrink-0 text-xs font-medium text-gray-500 uppercase dark:text-gray-400'>
        {label}
      </span>
      <span className='min-w-0 flex-1 truncate font-mono text-gray-900 dark:text-gray-100'>
        {value}
      </span>
      <span className='flex shrink-0 items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'>
        {copied ? (
          <>
            <Check className='h-3.5 w-3.5 text-green-600 dark:text-green-400' />
            <span className='text-green-600 dark:text-green-400'>{copiedLabel}</span>
          </>
        ) : (
          <Copy className='h-3.5 w-3.5' />
        )}
      </span>
      <span className='sr-only' aria-live='polite'>
        {copied ? copiedLabel : ''}
      </span>
    </button>
  )
}
