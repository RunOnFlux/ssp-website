import type { GlossaryEntry } from '@/constants/glossary/types'
import { Link } from '@/i18n/navigation'
import { difficultyBadgeClass } from '@/lib/glossary-utils'

interface Props {
  entry: GlossaryEntry
}

export function GlossaryEntryCard({ entry }: Props) {
  return (
    <Link
      href={'/glossary/' + entry.slug}
      data-glossary-card
      data-title={entry.title}
      id={entry.slug}
      className='dark:bg-dark-900 dark:hover:bg-dark-800 block scroll-mt-24 rounded-2xl bg-gray-50 p-6 transition-colors hover:bg-gray-100'
    >
      <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{entry.title}</h3>
      <p className='mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-400'>{entry.excerpt}</p>
      {entry.difficulty && (
        <span className={'mt-3 ' + difficultyBadgeClass(entry.difficulty.level)}>
          {entry.difficulty.label}
        </span>
      )}
    </Link>
  )
}
