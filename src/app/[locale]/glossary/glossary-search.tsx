'use client'

import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  placeholder: string
  totalLabel: string
  matchesLabel?: (count: number) => string
}

export function GlossarySearch({
  placeholder,
  totalLabel,
  matchesLabel = c => c + ' matches',
}: Props) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    const q = query.trim().toLowerCase()
    let visible = 0
    const cards = document.querySelectorAll<HTMLElement>('[data-glossary-card]')
    for (const card of cards) {
      const title = (card.dataset.title ?? '').toLowerCase()
      const matches = q === '' || title.includes(q)
      card.style.display = matches ? '' : 'none'
      if (matches) visible++
    }
    const sections = document.querySelectorAll<HTMLElement>('[data-letter-section]')
    for (const section of sections) {
      const hasMatch = Array.from(
        section.querySelectorAll<HTMLElement>('[data-glossary-card]')
      ).some(c => c.style.display !== 'none')
      section.style.display = hasMatch ? '' : 'none'
    }
    setVisibleCount(visible)
  }, [query])

  return (
    <div className='mx-auto w-full max-w-2xl'>
      <div className='relative'>
        <Search
          className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400'
          aria-hidden
        />
        <input
          type='search'
          placeholder={placeholder}
          aria-label={placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          className='dark:bg-dark-900 dark:border-dark-700 w-full rounded-full border border-gray-200 bg-white py-3 pr-4 pl-12 text-base text-gray-900 placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500'
        />
      </div>
      <p className='mt-2 text-center text-sm text-gray-500 dark:text-gray-400'>
        {query ? matchesLabel(visibleCount) : totalLabel}
      </p>
    </div>
  )
}
