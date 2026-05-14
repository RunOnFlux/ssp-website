'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { LearnDropdown } from '@/components/header/learn-dropdown'
import { LearnMobileSection } from '@/components/header/learn-mobile-section'
import { LocaleSwitcher } from '@/components/header/locale-switcher'
import { Logo } from '@/components/logo'
import { useTheme } from '@/hooks/use-theme'
import { Link, usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

type LinkItem = { kind: 'link'; name: string; href: string }
type GroupItem = { kind: 'group'; key: 'learn'; name: string }
type NavItem = LinkItem | GroupItem

export function Header() {
  const t = useTranslations('Header')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, toggleTheme, mounted } = useTheme()
  const pathname = usePathname()

  const primaryNav: NavItem[] = [
    { kind: 'link', name: t('home'), href: '/' },
    { kind: 'link', name: t('enterprise'), href: '/enterprise' },
    { kind: 'link', name: t('features'), href: '/features' },
    { kind: 'group', key: 'learn', name: t('learn') },
    { kind: 'link', name: t('guide'), href: '/guide' },
    { kind: 'link', name: t('support'), href: '/support' },
    { kind: 'link', name: t('contact'), href: '/contact' },
  ]

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  const isLearnActive =
    pathname === '/academy' ||
    pathname.startsWith('/academy/') ||
    pathname === '/glossary' ||
    pathname.startsWith('/glossary/') ||
    pathname === '/newsroom' ||
    pathname.startsWith('/newsroom/')

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'dark:bg-dark-900/80 border-b border-gray-200/20 bg-white/80 backdrop-blur-md dark:border-white/10'
          : 'bg-transparent'
      )}
    >
      <nav className='container-custom'>
        <div className='flex h-16 items-center justify-between md:h-20'>
          <Link href='/' className='flex items-center space-x-2'>
            <Logo width={120} height={40} className='h-8 md:h-10' />
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-6 lg:flex'>
            {primaryNav.map(item => {
              if (item.kind === 'group') {
                return <LearnDropdown key='learn' isActive={isLearnActive} />
              }
              const active = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'hover:text-primary-600 dark:hover:text-primary-400 relative text-sm font-medium transition-colors duration-200',
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  )}
                >
                  {item.name}
                  {active && (
                    <motion.div
                      className='bg-primary-600 dark:bg-primary-400 absolute right-0 -bottom-1 left-0 h-0.5'
                      layoutId='activeTab'
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.15 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className='flex items-center space-x-3'>
            {mounted && <LocaleSwitcher />}
            {mounted && (
              <button
                onClick={toggleTheme}
                className='dark:bg-dark-800 dark:hover:bg-dark-700 cursor-pointer rounded-lg bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200'
                aria-label={t('toggleTheme')}
              >
                {theme === 'dark' ? (
                  <Sun className='h-5 w-5 text-gray-700 dark:text-gray-300' />
                ) : (
                  <Moon className='h-5 w-5 text-gray-700 dark:text-gray-300' />
                )}
              </button>
            )}
            <Link href='/download' className='btn btn-primary hidden md:inline-flex'>
              <Download className='mr-2 h-4 w-4' />
              {t('download')}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg bg-gray-100 p-2 transition-colors duration-200 hover:bg-gray-200 lg:hidden'
              aria-label={t('toggleMenu')}
            >
              {isMenuOpen ? (
                <X className='h-6 w-6 text-gray-700 dark:text-gray-300' />
              ) : (
                <Menu className='h-6 w-6 text-gray-700 dark:text-gray-300' />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.1 }}
              className='overflow-hidden lg:hidden'
            >
              <div className='dark:bg-dark-900/95 mt-2 space-y-1 rounded-lg border border-gray-200/20 bg-white/95 py-2 backdrop-blur-md dark:border-white/10'>
                {primaryNav.map((item, index) => {
                  if (item.kind === 'group') {
                    return (
                      <motion.div
                        key='learn'
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <LearnMobileSection pathname={pathname} onItemClick={closeMenu} />
                      </motion.div>
                    )
                  }
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={cn(
                          'block px-4 py-2 text-base font-medium transition-colors duration-200',
                          pathname === item.href
                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'hover:text-primary-600 dark:hover:bg-dark-800 dark:hover:text-primary-400 text-gray-700 hover:bg-gray-50 dark:text-gray-300'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: primaryNav.length * 0.03 }}
                  className='px-4 pt-2'
                >
                  <Link href='/download' onClick={closeMenu} className='btn btn-primary w-full'>
                    <Download className='mr-2 h-4 w-4' />
                    {t('download')}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
