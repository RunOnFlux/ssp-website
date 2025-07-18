import { motion } from 'framer-motion'
import { ArrowRight, Chrome, Download, Globe, QrCode, Shield, Smartphone } from 'lucide-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const downloadOptions = [
  {
    id: 'chrome',
    icon: Chrome,
    title: 'Chrome/Brave Extension',
    subtitle: 'Available Now',
    description:
      'Install SSP Wallet in Chrome, Brave, and other Chromium-based browsers for seamless Web3 integration.',
    link: 'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
    available: true,
    primary: true,
  },
  {
    id: 'firefox',
    icon: Globe,
    title: 'Firefox Extension',
    subtitle: 'Available Now',
    description: 'Download the Firefox build directly from our GitHub releases page.',
    link: 'https://github.com/RunOnFlux/ssp-wallet/releases/latest',
    available: true,
    primary: false,
  },
]

const supportedBrowsers = [
  { name: 'Chrome', icon: '/chrome.svg' },
  { name: 'Brave', icon: '/brave.svg' },
  { name: 'Firefox', icon: '/firefox.svg' },
]

export default function DownloadPage() {
  return (
    <>
      <Head>
        <title>Download - SSP Wallet | Get Your Secure Crypto Wallet</title>
        <meta
          name='description'
          content='Download SSP Wallet for your browser. Secure, simple, powerful crypto wallet with multi-signature security and mobile authentication.'
        />
        <meta
          name='keywords'
          content='download SSP wallet, chrome extension, crypto wallet download, browser wallet, multi-signature wallet'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Download SSP Wallet | Secure Crypto Wallet' />
        <meta
          property='og:description'
          content='Get started with SSP Wallet. Download our secure browser extension with multi-signature technology.'
        />
        <meta property='og:url' content='https://sspwallet.io/download' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/download' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding to-secondary-50 from-primary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden bg-linear-to-br via-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
              <Download className='mr-2 h-4 w-4' />
              Start with SSP Wallet, Continue with SSP Key
            </div>

            <h1 className='heading-1 mb-6'>Download SSP Wallet</h1>

            <p className='mx-auto mb-8 max-w-2xl text-xl text-gray-600 dark:text-gray-400'>
              SSP consists of two components: <strong>SSP Wallet</strong> (browser extension) and{' '}
              <strong>SSP Key</strong> (mobile 2FA app). Both are required for the secure 2-of-2
              multisignature system.
            </p>

            <div className='mx-auto mb-8 max-w-3xl rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20'>
              <h3 className='mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100'>
                📱 Two-Step Setup Process:
              </h3>
              <div className='grid gap-4 text-sm text-blue-800 md:grid-cols-2 dark:text-blue-200'>
                <div className='flex items-start space-x-2'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white'>
                    1
                  </span>
                  <div>
                    <strong>Install SSP Wallet</strong>
                    <br />
                                                Browser extension for Chrome, Brave, and Firefox
                  </div>
                </div>
                <div className='flex items-start space-x-2'>
                  <span className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white'>
                    2
                  </span>
                  <div>
                    <strong>Install SSP Key</strong>
                    <br />
                    Mobile app for iOS/Android to provide 2nd factor authentication
                  </div>
                </div>
              </div>
            </div>

            <div className='inline-flex items-center rounded-lg bg-amber-100 px-6 py-3 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'>
              <Shield className='mr-2 h-5 w-5' />
              <span className='text-sm'>
                See our{' '}
                <Link href='/guide' className='underline hover:no-underline'>
                  setup guide
                </Link>{' '}
                for proper installation
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Download Options */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='grid gap-8 lg:grid-cols-3'>
            {downloadOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className={`group relative ${option.primary ? 'lg:col-span-2' : ''}`}
                >
                  <div
                    className={`h-full rounded-2xl border-2 p-8 transition-all duration-300 ${
                      option.available
                        ? 'border-primary-200 hover:border-primary-300 dark:border-primary-800 dark:bg-dark-800 dark:hover:border-primary-700 bg-white hover:shadow-lg'
                        : 'dark:bg-dark-700 border-gray-200 bg-gray-50 dark:border-gray-700'
                    } ${option.primary ? 'border-primary-300 from-primary-50 dark:border-primary-600 dark:from-primary-900/20 dark:to-dark-800 bg-linear-to-br to-white' : ''} `}
                  >
                    <div className='mb-6 flex items-start justify-between'>
                      <div>
                        <div
                          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                            option.available
                              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-400'
                          } `}
                        >
                          <Icon className='h-6 w-6' />
                        </div>

                        <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                          {option.title}
                        </h3>

                        <p
                          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                            option.available
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          } `}
                        >
                          {option.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className='mb-6 text-gray-600 dark:text-gray-400'>{option.description}</p>

                    {option.available ? (
                      <Link
                        href={option.link}
                        target='_blank'
                        className='bg-primary-600 hover:bg-primary-700 inline-flex items-center rounded-lg px-6 py-3 font-medium text-white transition-colors'
                      >
                        <Download className='mr-2 h-4 w-4' />
                        Download Now
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    ) : (
                      <div className='inline-flex cursor-not-allowed items-center rounded-lg bg-gray-300 px-6 py-3 font-medium text-gray-500 dark:bg-gray-600 dark:text-gray-400'>
                        Coming Soon
                      </div>
                    )}

                    {/* Extension Preview for Chrome option */}
                    {option.primary && option.available && (
                      <div className='dark:bg-dark-700 mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-600'>
                        <div className='text-center'>
                          <div className='bg-primary-100 dark:bg-primary-900/30 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full'>
                            <Image
                              src='/Icon Logo Black.svg'
                              alt='SSP Wallet'
                              width={32}
                              height={32}
                              style={{ width: 'auto', height: 'auto' }}
                            />
                          </div>
                          <h4 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                            Welcome to SSP Wallet
                          </h4>
                          <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                            Dual signature wallet for the decentralized world.
                            <br />
                            Secure. Simple. Powerful.
                          </p>
                          <div className='space-y-2'>
                            <div className='text-primary-600 dark:text-primary-400 text-sm font-medium'>
                              Get Started!
                            </div>
                            <div className='text-sm text-gray-500 dark:text-gray-400'>
                              Restore with Seed
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Supported Browsers */}
      <section className='section-padding dark:bg-dark-800 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <h2 className='heading-2 mb-8'>Supported Browsers</h2>

            <div className='flex items-center justify-center space-x-12'>
              {supportedBrowsers.map(browser => (
                <div key={browser.name} className='group text-center'>
                  <div className='dark:bg-dark-700 mx-auto mb-3 h-16 w-16 rounded-xl bg-white p-3 shadow-sm transition-shadow group-hover:shadow-md'>
                    <Image
                      src={browser.icon}
                      alt={browser.name}
                      width={40}
                      height={40}
                      className='h-full w-full object-contain'
                    />
                  </div>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                    {browser.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='items-center lg:grid lg:grid-cols-2 lg:gap-16'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-6'>SSP Key Mobile App</h2>

              <p className='mb-6 text-lg text-gray-600 dark:text-gray-400'>
                Complete your security setup with SSP Key - the mobile companion app that provides
                second-factor authentication for your SSP Wallet.
              </p>

              <div className='mb-8 space-y-4'>
                <div className='flex items-start'>
                  <QrCode className='text-primary-600 dark:text-primary-400 mt-1 mr-3 h-5 w-5 flex-shrink-0' />
                  <div>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>QR Code Sync</h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Easily sync your mobile device with your browser wallet
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Shield className='text-primary-600 dark:text-primary-400 mt-1 mr-3 h-5 w-5 flex-shrink-0' />
                  <div>
                    <h4 className='font-semibold text-gray-900 dark:text-white'>
                      Enhanced Security
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Multi-signature protection with mobile authentication
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='https://play.google.com/store/apps/details?id=io.runonflux.sspkey'
                  target='_blank'
                  className='bg-primary-600 hover:bg-primary-700 inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors'
                >
                  <Smartphone className='mr-2 h-5 w-5' />
                  Download for Android
                </Link>

                <Link
                  href='https://apps.apple.com/us/app/ssp-key/id6463717332'
                  target='_blank'
                  className='dark:hover:bg-dark-700 inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'
                >
                  <Smartphone className='mr-2 h-5 w-5' />
                  Download for iOS
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='mt-12 lg:mt-0'
            >
              <div className='relative mx-auto max-w-sm'>
                <Image
                  src='/android-screenshot-maker-of-a-samsung-galaxy-s9-plus-in-portrait-position-1319 (1) 2.svg'
                  alt='SSP Key Mobile App'
                  width={300}
                  height={600}
                  className='h-auto w-full'
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-padding bg-primary-600 dark:bg-primary-800'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-4 text-3xl font-bold text-white'>Ready to Get Started?</h2>
            <p className='text-primary-100 mx-auto mb-8 max-w-2xl text-xl'>
              Join thousands of users who trust SSP Wallet for their crypto security
            </p>
            <Link
              href='/guide'
              className='text-primary-600 inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors hover:bg-gray-50'
            >
              View Setup Guide
              <ArrowRight className='ml-2 h-5 w-5' />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
