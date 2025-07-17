import { ExternalLink, Github, Twitter, Youtube } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Logo } from './Logo'

const footerNavigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Guide', href: '/guide' },
    { name: 'Support', href: '/support' },
    { name: 'Contact', href: '/contact' },
  ],
  product: [
    { name: 'Download', href: '/download' },
    { name: 'Mobile SSP Key', href: '/download#mobile', external: false },
    {
      name: 'Security Audits',
      href: 'https://www.halborn.com/audits/influx-technologies',
      external: true,
    },
    { name: 'Documentation', href: 'https://docs.sspwallet.io', external: true },
  ],
  community: [
    { name: 'GitHub', href: 'https://github.com/RunOnFlux', external: true },
    { name: 'Twitter', href: 'https://twitter.com/sspwallet_io', external: true },
    { name: 'Medium', href: 'https://medium.com/@ssp_wallet', external: true },
    { name: 'YouTube', href: 'https://www.youtube.com/@ZelLabs', external: true },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ],
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/RunOnFlux',
    icon: Github,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/sspwallet_io',
    icon: Twitter,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@ZelLabs',
    icon: Youtube,
  },
]

export function Footer() {
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
              Secure, Simple, Powerful. SSP is a groundbreaking, open-source, self-custody, BIP48
              multi-signature browser wallet for multiple blockchains with Account Abstraction.
            </p>

            {/* Supported Chains */}
            <div className='mb-6'>
              <h4 className='mb-3 text-sm font-semibold text-gray-900 dark:text-white'>
                Supported Chains
              </h4>
              <div className='flex flex-wrap gap-2'>
                {[
                  'BTC',
                  'ETH',
                  'LTC',
                  'ZEC',
                  'RVN',
                  'DOGE',
                  'BCH',
                  'FLUX',
                  'MATIC',
                  'BSC',
                  'AVAX',
                  'BASE',
                ].map(chain => (
                  <span
                    key={chain}
                    className='dark:bg-dark-700 rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300'
                  >
                    {chain}
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
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>Navigation</h3>
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
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>Product</h3>
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
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>Community</h3>
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
                  Help Translate
                  <ExternalLink className='ml-1 h-3 w-3' />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className='mb-4 text-sm font-semibold text-gray-900 dark:text-white'>Legal</h3>
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
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='dark:border-dark-600 mt-12 border-t border-gray-200 pt-8'>
          <div className='flex flex-col items-center justify-between sm:flex-row'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              © {new Date().getFullYear()} SSP Wallet. All rights reserved.
            </p>
            <div className='mt-4 flex items-center space-x-4 sm:mt-0'>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                Built with ❤️ for Web3
              </span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>•</span>
              <a
                href='https://runonflux.com'
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              >
                <span>Powered by Flux</span>
                <Image
                  src='/flux-logo.svg'
                  alt='Flux'
                  width={80}
                  height={24}
                  className='h-5 w-auto'
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
