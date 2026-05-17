'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Chrome, Download, QrCode, Shield, Smartphone } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

const CHROME_STORE_LINK =
  'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd'
const FIREFOX_ADDON_LINK = 'https://addons.mozilla.org/en-US/firefox/addon/ssp-wallet'

const downloadOptions = [
  {
    id: 'chrome' as const,
    icon: Chrome,
    link: '/download#extension',
    available: true,
    primary: true,
  },
  {
    id: 'mobile' as const,
    icon: Smartphone,
    link: '/download#mobile',
    available: true,
    primary: true,
  },
] as const

const supportedBrowsers = [
  { name: 'Chrome', icon: '/chrome.svg', link: CHROME_STORE_LINK },
  { name: 'Brave', icon: '/brave.svg', link: CHROME_STORE_LINK },
  { name: 'Firefox', icon: '/firefox.svg', link: FIREFOX_ADDON_LINK },
] as const

export function DownloadContent() {
  const t = useTranslations('Download')
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  const [extensionLink, setExtensionLink] = useState(CHROME_STORE_LINK)

  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox')) {
      setExtensionLink(FIREFOX_ADDON_LINK)
    }
  }, [])

  return (
    <>
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
              {t('heroBadge')}
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>{t('heroTitle')}</h1>

            <p className='mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescription')}
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
            <h2 className='heading-2 mb-4'>{t('stepsTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('stepsSubtitle')}
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-2'>
            {downloadOptions.map((option, index) => {
              const Icon = option.icon
              const isExtension = option.id === 'chrome'
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
                            {t(`options.${option.id}.title`)}
                          </h3>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {t(`options.${option.id}.subtitle`)}
                          </p>
                        </div>
                      </div>
                      <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 rounded-full px-3 py-1 text-xs font-medium'>
                        {t('stepLabel', { index: index + 1 })}
                      </div>
                    </div>

                    <p className='mb-6 text-gray-600 dark:text-gray-400'>
                      {t(`options.${option.id}.description`)}
                    </p>

                    <div className='mb-6 space-y-2'>
                      {[0, 1, 2].map(featureIndex => (
                        <div
                          key={featureIndex}
                          className='flex items-center text-sm text-gray-600 dark:text-gray-400'
                        >
                          <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                          {t(`options.${option.id}.features.${featureIndex}`)}
                        </div>
                      ))}
                    </div>

                    {isExtension ? (
                      <a
                        href={extensionLink}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='bg-primary-600 hover:bg-primary-700 block w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors'
                      >
                        {t(`options.${option.id}.cta`)}
                      </a>
                    ) : (
                      <Link
                        href={option.link}
                        className='bg-primary-600 hover:bg-primary-700 block w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors'
                      >
                        {t(`options.${option.id}.cta`)}
                      </Link>
                    )}
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
            <h2 className='heading-2 mb-4'>{t('browsersTitle')}</h2>
            <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('browsersSubtitle')}
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
                  <a
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
                  </a>
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
                {t('mobileBadge')}
              </div>

              <h2 className='heading-2 mb-6'>{t('mobileTitle')}</h2>

              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                {t('mobileDescription')}
              </p>

              <div className='mb-8 space-y-6'>
                <div className='flex items-start'>
                  <QrCode className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                      {t('mobileEasySetupTitle')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t('mobileEasySetupDescription')}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Shield className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                      {t('mobileSecurityTitle')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t('mobileSecurityDescription')}
                    </p>
                  </div>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <a
                  href='https://play.google.com/store/apps/details?id=io.runonflux.sspkey'
                  target='_blank'
                  rel='noopener noreferrer'
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
                      {t('googlePlayLabel')}
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>Google Play</div>
                  </div>
                </a>

                <a
                  href='https://apps.apple.com/us/app/ssp-key/id6463717332'
                  target='_blank'
                  rel='noopener noreferrer'
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
                      {t('appStoreLabel')}
                    </div>
                    <div className='text-xs text-gray-600 dark:text-gray-400'>App Store</div>
                  </div>
                </a>
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
                  alt={t('mobileAppAlt')}
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
            <h2 className='heading-2 mb-4'>{t('howTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('howSubtitle')}
            </p>
          </motion.div>

          <div className='mx-auto max-w-4xl'>
            <div className='grid gap-8 md:grid-cols-3'>
              {[1, 2, 3].map((stepNum, idx) => (
                <motion.div
                  key={stepNum}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * (idx + 1) }}
                  viewport={{ once: true }}
                  className='text-center'
                >
                  <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl'>
                    <span className='text-2xl font-bold'>{stepNum}</span>
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                    {t(`howSteps.${stepNum}.title`)}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>
                    {t(`howSteps.${stepNum}.description`)}
                  </p>
                </motion.div>
              ))}
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
            <h2 className='mb-4 text-3xl font-bold text-white'>{t('ctaTitle')}</h2>
            <p className='text-primary-100 mx-auto mb-8 max-w-2xl text-xl'>{t('ctaSubtitle')}</p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/guide'
                className='text-primary-600 inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors hover:bg-gray-50'
              >
                {t('ctaSetupGuide')}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
              <Link
                href='/support'
                className='inline-flex items-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10'
              >
                {t('ctaSupport')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
