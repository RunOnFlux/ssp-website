'use client'

import { useTranslations } from 'next-intl'

interface Props {
  letters: string[]
}

export function LetterIndex({ letters }: Props) {
  const t = useTranslations('Glossary')

  const handleClick = (letter: string) => {
    const el = document.getElementById('letter-' + letter)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav
      aria-label={t('letterIndexAriaLabel')}
      className='dark:bg-dark-900/40 sticky top-16 z-10 flex flex-wrap justify-center gap-1 bg-white/80 px-4 py-3 backdrop-blur md:top-20'
    >
      {letters.map(letter => (
        <button
          key={letter}
          type='button'
          onClick={() => handleClick(letter)}
          className='hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 flex h-8 min-w-[2rem] items-center justify-center rounded text-sm font-semibold text-gray-700 transition-colors dark:text-gray-300'
        >
          {letter}
        </button>
      ))}
    </nav>
  )
}
