import { ChevronRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const t = useTranslations('Common')
  return (
    <nav aria-label={t('breadcrumbAriaLabel')} className='text-sm'>
      <ol className='flex flex-wrap items-center gap-1 text-gray-500 dark:text-gray-400'>
        {items.map((item, i) => (
          <li key={i} className='flex items-center gap-1'>
            {i > 0 && <ChevronRight className='h-4 w-4 opacity-60' />}
            {item.href ? (
              <Link href={item.href} className='hover:text-primary-600 dark:hover:text-primary-400'>
                {item.label}
              </Link>
            ) : (
              <span className='text-gray-900 dark:text-gray-200'>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
