'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Eye,
  KeyRound,
  Network,
  ShieldCheck,
  Vault,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

const beforeProblemIcons = [Wrench, KeyRound, Eye, Network]
const sspBenefitIcons = [Vault, ShieldCheck, Eye, CheckCircle]
const fusionBridgeItemKeys = ['0', '1', '2', '3'] as const

export function FluxFoundationContent() {
  const t = useTranslations('CaseStudies.fluxFoundation')
  const tCommon = useTranslations('Common')
  const tCaseStudies = useTranslations('CaseStudies')
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })

  const factSheet = [
    { label: t('factSheet.organizationLabel'), value: t('factSheet.organizationValue') },
    { label: t('factSheet.industryLabel'), value: t('factSheet.industryValue') },
    { label: t('factSheet.useCaseLabel'), value: t('factSheet.useCaseValue') },
    { label: t('factSheet.chainsLabel'), value: t('factSheet.chainsValue') },
    { label: t('factSheet.vaultModelLabel'), value: t('factSheet.vaultModelValue') },
    { label: t('factSheet.statusLabel'), value: t('factSheet.statusValue') },
  ]

  return (
    <>
      {/* Hero */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='pointer-events-none absolute inset-0'>
          <div className='bg-primary-400/20 absolute top-20 -left-32 h-96 w-96 rounded-full blur-3xl'></div>
          <div className='absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl'></div>
        </div>

        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl'
          >
            <div className='mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400'>
              <Link
                href='/'
                className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
              >
                {tCommon('breadcrumbHome')}
              </Link>
              <span>/</span>
              <span>{tCaseStudies('breadcrumbLabel')}</span>
              <span>/</span>
              <span className='text-gray-900 dark:text-white'>{t('breadcrumbLabel')}</span>
            </div>

            <div className='mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center'>
              <div className='dark:bg-dark-800 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-700'>
                <Image
                  src='/flux-symbol.svg'
                  alt={t('logoAlt')}
                  width={56}
                  height={56}
                  className='h-14 w-14'
                />
              </div>
              <div>
                <p className='text-primary-600 dark:text-primary-400 mb-1 text-sm font-semibold tracking-wider uppercase'>
                  {t('eyebrow')}
                </p>
                <h1 className='heading-1 text-gray-900 dark:text-white'>
                  {t('titlePart1')} <span className='gradient-text'>{t('titlePart2')}</span>
                </h1>
              </div>
            </div>

            <p className='mb-10 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-400'>
              {t('subtitle')}
            </p>

            <div className='border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-900/10 rounded-r-xl border-l-4 p-6 md:p-8'>
              <p className='mb-4 text-lg leading-relaxed text-gray-800 italic md:text-xl dark:text-gray-200'>
                &ldquo;{t('heroQuote')}&rdquo;
              </p>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                {t('heroQuoteAttribution')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fact sheet */}
      <section className='dark:bg-dark-800 border-y border-gray-200 bg-gray-50 py-12 dark:border-gray-700'>
        <div className='container-custom'>
          <div className='mx-auto max-w-5xl'>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
              {factSheet.map(item => (
                <div key={item.label}>
                  <p className='mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
                    {item.label}
                  </p>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Before */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>{t('before.title')}</h2>
              <p className='text-lg text-gray-600 dark:text-gray-400'>{t('before.intro')}</p>
            </motion.div>

            <div className='grid gap-6 md:grid-cols-2'>
              {beforeProblemIcons.map((Icon, index) => {
                const itemKey = String(index) as '0' | '1' | '2' | '3'
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
                  >
                    <div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                      {t(`before.items.${itemKey}.title`)}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {t(`before.items.${itemKey}.description`)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Decision */}
      <section className='section-padding dark:bg-dark-800 bg-gray-50'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-10 text-center'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>
                {t('decision.title')}
              </h2>
              <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('decision.intro')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className='mb-10 grid gap-6 md:grid-cols-3'
            >
              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  {t('decision.bucket1Eyebrow')}
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  {t('decision.bucket1Title')}
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  {t('decision.bucket1Description')}
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  {t('decision.bucket1Verdict')}
                </p>
              </div>

              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  {t('decision.bucket2Eyebrow')}
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  {t('decision.bucket2Title')}
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  {t('decision.bucket2Description')}
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  {t('decision.bucket2Verdict')}
                </p>
              </div>

              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  {t('decision.bucket3Eyebrow')}
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  {t('decision.bucket3Title')}
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  {t('decision.bucket3Description')}
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  {t('decision.bucket3Verdict')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className='mx-auto max-w-3xl text-center'
            >
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
                {t('decision.conclusion')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What changed */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>
                {t('whatChanged.title')}
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400'>{t('whatChanged.intro')}</p>
            </motion.div>

            <div className='grid gap-6 md:grid-cols-2'>
              {sspBenefitIcons.map((Icon, index) => {
                const itemKey = String(index) as '0' | '1' | '2' | '3'
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
                  >
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                      {t(`whatChanged.items.${itemKey}.title`)}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>
                      {t(`whatChanged.items.${itemKey}.description`)}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Fusion bridge specifically */}
      <section className='section-padding dark:bg-dark-800 bg-gray-50'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>
                {t('fusionBridge.title')}
              </h2>
              <p className='mb-6 text-lg text-gray-600 dark:text-gray-400'>
                {t('fusionBridge.intro')}
              </p>

              <div className='dark:bg-dark-900 mb-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-700'>
                <ul className='space-y-4'>
                  {fusionBridgeItemKeys.map(itemKey => (
                    <li key={itemKey} className='flex items-start gap-3'>
                      <CheckCircle className='text-primary-600 dark:text-primary-400 mt-0.5 h-5 w-5 flex-shrink-0' />
                      <div>
                        <p className='font-semibold text-gray-900 dark:text-white'>
                          {t(`fusionBridge.items.${itemKey}.title`)}
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {t(`fusionBridge.items.${itemKey}.description`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-900/10 rounded-r-xl border-l-4 p-6 md:p-8'>
                <p className='mb-4 text-lg leading-relaxed text-gray-800 italic md:text-xl dark:text-gray-200'>
                  &ldquo;{t('fusionBridge.quote')}&rdquo;
                </p>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  {t('fusionBridge.quoteAttribution')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <ShieldCheck className='text-primary-600 dark:text-primary-400 mx-auto mb-6 h-16 w-16' />
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>{t('cta.title')}</h2>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                {t('cta.description')}
              </p>
              <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link href='/enterprise' className='btn btn-primary group'>
                  {t('cta.exploreEnterprise')}
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
                <Link
                  href='https://enterprise.sspwallet.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-secondary'
                >
                  {t('cta.launchEnterpriseApp')}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
