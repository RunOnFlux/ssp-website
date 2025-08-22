import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Chrome, Download, QrCode, Shield, Smartphone } from 'lucide-react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const downloadOptions = [
  {
    id: 'chrome',
    icon: Chrome,
    title: 'SSP Wallet',
    subtitle: 'Browser Extension',
    description: 'Install on Chrome, Brave, Firefox and other Chromium-based browsers',
    features: ['Multi-signature security', 'WalletConnect v2 support', 'Cross-chain compatibility'],
    link: 'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
    available: true,
    primary: true,
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'SSP Key',
    subtitle: 'Mobile 2FA App',
    description:
      'Required companion app for iOS and Android devices providing secure authentication',
    features: ['2FA authentication', 'QR code sync', 'Secure key storage'],
    link: '/download#mobile',
    available: true,
    primary: true,
  },
]

const supportedBrowsers = [
  {
    name: 'Chrome',
    icon: '/chrome.svg',
    link: 'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
  },
  {
    name: 'Brave',
    icon: '/brave.svg',
    link: 'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
  },
  {
    name: 'Firefox',
    icon: '/firefox.svg',
    link: 'https://addons.mozilla.org/en-US/firefox/addon/ssp-wallet',
  },
]

export default function DownloadPage() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

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
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:alt' content='Download SSP Wallet - Secure Crypto Wallet' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Download SSP Wallet | Secure Crypto Wallet' />
        <meta
          name='twitter:description'
          content='Get started with SSP Wallet. Download our secure browser extension with multi-signature technology.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />
        <meta name='twitter:image:alt' content='Download SSP Wallet - Secure Crypto Wallet' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/download' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              <Download className='mr-2 h-4 w-4' />
              Download SSP Wallet
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>
              Get Started with SSP Wallet
            </h1>

            <p className='mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Download both components for complete security: the browser extension for wallet
              management and the mobile app for transaction authentication.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Download Options */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>Two-Step Setup Process</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Both components are required for the secure 2-of-2 multisignature system
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-2'>
            {downloadOptions.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='group'
                >
                  <div className='dark:bg-dark-800 h-full rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg dark:border-gray-700'>
                    <div className='mb-6 flex items-start justify-between'>
                      <div className='flex items-center'>
                        <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-4 flex h-12 w-12 items-center justify-center rounded-xl'>
                          <Icon className='h-6 w-6' />
                        </div>
                        <div>
                          <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                            {option.title}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {option.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 rounded-full px-3 py-1 text-xs font-medium'>
                        Step {index + 1}
                      </div>
                    </div>

                    <p className='mb-6 text-gray-600 dark:text-gray-400'>{option.description}</p>

                    <div className='mb-6 space-y-2'>
                      {option.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className='flex items-center text-sm text-gray-600 dark:text-gray-400'
                        >
                          <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link
                      href={option.link}
                      target={option.id === 'chrome' ? '_blank' : '_self'}
                      className='bg-primary-600 hover:bg-primary-700 block w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors'
                    >
                      {option.id === 'chrome' ? 'Download Extension' : 'View Mobile Apps'}
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Supported Browsers */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <h2 className='heading-2 mb-4'>Supported Browsers</h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              SSP Wallet works seamlessly across all major browsers
            </p>

            <div className='flex items-center justify-center space-x-12'>
              {supportedBrowsers.map((browser, index) => (
                <motion.div
                  key={browser.name}
                  className='text-center'
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={browser.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group block'
                  >
                    <div className='dark:bg-dark-800 mx-auto mb-3 h-16 w-16 rounded-xl border border-gray-200 bg-white p-3 transition-all duration-300 group-hover:border-blue-300 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:group-hover:border-blue-600'>
                      <Image
                        src={browser.icon}
                        alt={browser.name}
                        width={40}
                        height={40}
                        className='h-full w-full object-contain'
                      />
                    </div>
                    <p className='text-sm font-medium text-gray-700 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400'>
                      {browser.name}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section id='mobile' className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <div className='items-center gap-12 lg:grid lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <div className='mb-6 inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300'>
                <Smartphone className='mr-2 h-4 w-4' />
                SSP Key Mobile App
              </div>

              <h2 className='heading-2 mb-6'>Complete Your Security Setup</h2>

              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                SSP Key provides the second signature required for all transactions. Install it on
                your mobile device to complete the 2-of-2 multisignature security.
              </p>

              <div className='mb-8 space-y-6'>
                <div className='flex items-start'>
                  <QrCode className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>Easy Setup</h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Scan a QR code to sync your mobile device with your browser wallet instantly
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Shield className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                      Maximum Security
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Your funds remain secure even if one device is compromised
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <Link
                  href='https://play.google.com/store/apps/details?id=io.runonflux.sspkey'
                  target='_blank'
                  className='dark:bg-dark-800 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700'
                >
                  <div className='mr-3 h-8 w-8'>
                    <Image
                      src='/playstore.svg'
                      alt='Google Play'
                      width={32}
                      height={32}
                      className='h-full w-full object-contain'
                    />
                  </div>
                  <div className='text-left'>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                      Get it on
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>Google Play</div>
                  </div>
                </Link>

                <Link
                  href='https://apps.apple.com/us/app/ssp-key/id6463717332'
                  target='_blank'
                  className='dark:bg-dark-800 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:border-gray-700'
                >
                  <div className='mr-3 h-8 w-8'>
                    <Image
                      src='/appstore.svg'
                      alt='App Store'
                      width={32}
                      height={32}
                      className='h-full w-full object-contain'
                    />
                  </div>
                  <div className='text-left'>
                    <div className='text-sm font-medium text-gray-900 dark:text-white'>
                      Download on the
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>App Store</div>
                  </div>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mt-12 text-center lg:mt-0'
            >
              <div className='relative mx-auto max-w-xs'>
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

      {/* How It Works */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>How It Works</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Understanding the 2-of-2 multisignature security model
            </p>
          </motion.div>

          <div className='mx-auto max-w-4xl'>
            <div className='grid gap-8 md:grid-cols-3'>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className='text-center'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <span className='text-2xl font-bold'>1</span>
                </div>
                <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                  Install Extension
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  Add SSP Wallet to your browser and create your wallet with a secure seed phrase
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className='text-center'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <span className='text-2xl font-bold'>2</span>
                </div>
                <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                  Setup Mobile App
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  Install SSP Key on your phone and sync it with your browser wallet via QR code
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                viewport={{ once: true }}
                className='text-center'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <span className='text-2xl font-bold'>3</span>
                </div>
                <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                  Secure Transactions
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  Every transaction requires approval from both your browser and mobile device
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section-padding bg-primary-600 dark:bg-primary-800'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-4 text-3xl font-bold text-white'>Ready to Get Started?</h2>
            <p className='text-primary-100 mx-auto mb-8 max-w-2xl text-xl'>
              Follow our step-by-step guide to set up your secure crypto wallet
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/guide'
                className='text-primary-600 inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors hover:bg-gray-50'
              >
                View Setup Guide
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
              <Link
                href='/support'
                className='inline-flex items-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10'
              >
                Get Support
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
