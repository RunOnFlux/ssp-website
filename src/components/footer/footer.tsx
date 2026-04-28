'use client'

import { ExternalLink, Github, MessageCircle, Twitter } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Logo } from '@/components/logo'
import { SUPPORTED_CHAINS } from '@/constants/supported-chains'
import { Link } from '@/i18n/navigation'

export function Footer() {
  const t = useTranslations('Footer')

  const footerNavigation = {
    main: [
      { name: t('links.home'), href: '/' },
      { name: t('links.features'), href: '/features' },
      { name: t('links.guide'), href: '/guide' },
      { name: t('links.support'), href: '/support' },
      { name: t('links.contact'), href: '/contact' },
      { name: t('links.enterprise'), href: '/enterprise' },
    ],
    product: [
      { name: t('links.download'), href: '/download', external: false },
      { name: t('links.mobileSspKey'), href: '/download#mobile', external: false },
      { name: t('links.sspEnterprise'), href: '/enterprise', external: false },
      {
        name: t('links.securityAudits'),
        href: 'https://www.halborn.com/audits/influx-technologies',
        external: true,
      },
      { name: t('links.documentation'), href: 'https://docs.sspwallet.io', external: true },
    ],
    community: [
      { name: t('links.github'), href: 'https://github.com/RunOnFlux/ssp-wallet', external: true },
      { name: t('links.discord'), href: 'https://discord.gg/runonflux', external: true },
      { name: t('links.twitter'), href: 'https://twitter.com/sspwallet_io', external: true },
      { name: t('links.medium'), href: 'https://medium.com/@ssp_wallet', external: true },
      { name: t('links.youtube'), href: 'https://www.youtube.com/@ZelLabs', external: true },
    ],
    legal: [
      { name: t('links.privacyPolicy'), href: '/privacy-policy' },
      { name: t('links.termsOfService'), href: '/terms-of-service' },
      { name: t('links.cookiePolicy'), href: '/cookie-policy' },
    ],
  }

  const socialLinks = [
    {
      name: t('links.github'),
      href: 'https://github.com/RunOnFlux',
      icon: Github,
    },
    {
      name: t('links.discord'),
      href: 'https://discord.gg/runonflux',
      icon: MessageCircle,
    },
    {
      name: t('links.twitter'),
      href: 'https://twitter.com/sspwallet_io',
      icon: Twitter,
    },
  ]

  return (
    <footer className='dark:border-dark-600 dark:bg-dark-800 border-t border-gray-200 bg-gray-50'>
      <div className='container-custom section-padding'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-12'>
          {/* Logo and Description */}
          <div className='lg:col-span-2'>
            <Link href='/' className='mb-4 flex items-center space-x-2'>
              <Logo width={120} height={40} className='h-8' />
            </Link>
            <p className='mb-6 max-w-sm text-gray-600 dark:text-gray-400'>
              {t('brandDescription')}
            </p>

            {/* Supported Chains */}
            <div className='mb-6'>
              <h4 className='mb-3 text-sm font-semibold text-gray-900 dark:text-white'>
                {t('supportedChains')}
              </h4>
              <div className='flex flex-wrap gap-2'>
                {SUPPORTED_CHAINS.map(chain => (
                  <span
                    key={chain.symbol}
                    className='dark:bg-dark-700 rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300'
                  >
                    {chain.symbol}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className='flex space-x-4'>
              {socialLinks.map(item => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='dark:bg-dark-700 dark:hover:bg-dark-600 rounded-lg bg-gray-200 p-2 transition-colors duration-200 hover:bg-gray-300'
                    aria-label={item.name}
                  >
                    <Icon className='h-5 w-5 text-gray-600 dark:text-gray-400' />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>
              {t('navigation')}
            </h3>
            <ul className='space-y-3'>
              {footerNavigation.main.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>
              {t('product')}
            </h3>
            <ul className='space-y-3'>
              {footerNavigation.product.map(item => (
                <li key={item.name}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    >
                      {item.name}
                      <ExternalLink className='ml-1 h-3 w-3' />
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className='text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>
              {t('community')}
            </h3>
            <ul className='space-y-3'>
              {footerNavigation.community.map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  >
                    {item.name}
                    <ExternalLink className='ml-1 h-3 w-3' />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href='https://translate.sspwallet.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                  {t('links.helpTranslate')}
                  <ExternalLink className='ml-1 h-3 w-3' />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>
              {t('legal')}
            </h3>
            <ul className='space-y-3'>
              {footerNavigation.legal.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className='text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && window.openCookieSettings) {
                      window.openCookieSettings()
                    }
                  }}
                  className='cursor-pointer text-gray-600 transition-colors duration-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                >
                  {t('cookieSettings')}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='dark:border-dark-600 mt-12 border-t border-gray-200 pt-8'>
          <div className='flex flex-col items-center justify-between sm:flex-row'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              © {new Date().getFullYear()} SSP Wallet. {t('rights')}
            </p>
            <div className='mt-4 flex items-center space-x-4 sm:mt-0'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>{t('builtForWeb3')}</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>•</span>
              <a
                href='https://runonflux.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              >
                <span>{t('poweredByFlux')}</span>
                <Image
                  src='/flux-symbol.svg'
                  alt={t('fluxAlt')}
                  width={24}
                  height={24}
                  className='h-5 w-5'
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
