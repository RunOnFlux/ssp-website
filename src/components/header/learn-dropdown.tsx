'use client'

import { BookA, BookOpen, Compass } from 'lucide-react'
import { useTranslations } from 'next-intl'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Link } from '@/i18n/navigation'

interface Props {
  isActive: boolean
}

export function LearnDropdown({ isActive }: Props) {
  const t = useTranslations('Header')

  const items = [
    {
      href: '/academy' as const,
      icon: BookOpen,
      label: t('academy'),
      desc: t('learnAcademyDescription'),
    },
    {
      href: '/academy/series' as const,
      icon: Compass,
      label: t('series'),
      desc: t('learnSeriesDescription'),
    },
    {
      href: '/glossary' as const,
      icon: BookA,
      label: t('learnGlossary'),
      desc: t('learnGlossaryDescription'),
    },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={isActive ? 'text-primary-600 dark:text-primary-400' : ''}
            data-active={isActive || undefined}
          >
            {t('learn')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='grid w-[360px] gap-2 p-3'>
              {items.map(item => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className='dark:hover:bg-dark-800 flex items-start gap-3 rounded-md p-3 transition-colors hover:bg-gray-50'
                    >
                      <item.icon className='mt-1 h-5 w-5 shrink-0' />
                      <div>
                        <div className='font-medium text-gray-900 dark:text-white'>
                          {item.label}
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>{item.desc}</p>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
