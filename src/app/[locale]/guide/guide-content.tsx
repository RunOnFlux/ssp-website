'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Chrome,
  Download,
  Lock,
  type LucideIcon,
  Play,
  Shield,
  Smartphone,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

interface GuideStepShape {
  index: number
  important?: boolean
  link?: string
  links?: { android: string; ios: string }
}

interface GuidePhaseShape {
  phaseIndex: 0 | 1
  icon: LucideIcon
  color: 'blue' | 'green'
  steps: GuideStepShape[]
}

const phases: GuidePhaseShape[] = [
  {
    phaseIndex: 0,
    icon: Chrome,
    color: 'blue',
    steps: [
      { index: 0, link: '/download' },
      { index: 1 },
      { index: 2 },
      { index: 3 },
      { index: 4 },
      { index: 5, important: true },
      { index: 6 },
    ],
  },
  {
    phaseIndex: 1,
    icon: Smartphone,
    color: 'green',
    steps: [
      {
        index: 0,
        links: {
          android: 'https://play.google.com/store/apps/details?id=io.runonflux.sspkey',
          ios: 'https://apps.apple.com/us/app/ssp-key/id6463717332',
        },
      },
      { index: 1 },
      { index: 2 },
      { index: 3, important: true },
      { index: 4 },
      { index: 5 },
      { index: 6 },
    ],
  },
]

const securityTipIcons: LucideIcon[] = [Lock, Shield, Smartphone]

interface StepCardProps {
  step: GuideStepShape
  phaseIndex: 0 | 1
  phaseColor: 'blue' | 'green'
  index: number
}

function StepCard({ step, phaseIndex, phaseColor, index }: StepCardProps) {
  const t = useTranslations('Guide')
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`dark:bg-dark-800 relative rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg dark:border-gray-700 ${
        step.important ? 'ring-2 ring-blue-500/20' : ''
      }`}
    >
      {step.important && (
        <div className='absolute -top-2 -right-2'>
          <div className='inline-flex items-center rounded-full bg-blue-500 px-2 py-1 text-xs font-medium text-white'>
            <AlertTriangle className='mr-1 h-3 w-3' />
            {t('important')}
          </div>
        </div>
      )}

      <div className='flex items-start'>
        <div
          className={`mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${phaseColor === 'blue' ? 'bg-blue-500' : 'bg-green-500'} `}
        >
          {step.index + 1}
        </div>

        <div className='flex-1'>
          <h4 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
            {t(`phases.${phaseIndex}.steps.${step.index}.title`)}
          </h4>
          <p className='mb-4 text-gray-600 dark:text-gray-400'>
            {t(`phases.${phaseIndex}.steps.${step.index}.description`)}
          </p>

          <div className='flex items-center space-x-4'>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                phaseColor === 'blue'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              } `}
            >
              {t(`phases.${phaseIndex}.steps.${step.index}.action`)}
            </span>

            {step.link && (
              <Link
                href={step.link}
                target='_blank'
                className='text-primary-600 dark:text-primary-400 text-sm hover:underline'
              >
                {t('openLink')}
              </Link>
            )}

            {step.links && (
              <div className='flex space-x-2'>
                <a
                  href={step.links.android}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-green-600 hover:underline dark:text-green-400'
                >
                  {t('androidLabel')}
                </a>
                <span className='text-gray-400'>|</span>
                <a
                  href={step.links.ios}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-blue-600 hover:underline dark:text-blue-400'
                >
                  {t('iosLabel')}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function GuideContent() {
  const t = useTranslations('Guide')
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

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
              <Shield className='mr-2 h-4 w-4' />
              {t('heroBadge')}
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>{t('heroTitle')}</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescriptionPart1')} <strong>{t('heroDescriptionStrong')}</strong>
              {t('heroDescriptionPart2')}
            </p>

            <div className='mx-auto grid max-w-3xl gap-4 sm:gap-6 md:grid-cols-2'>
              <Link
                href='/download'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-blue-600'
              >
                <Chrome className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    {t('browserExtensionTitle')}
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                    {t('browserExtensionSubtitle')}
                  </p>
                </div>
              </Link>

              <Link
                href='/download#mobile'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-green-600'
              >
                <Smartphone className='mr-3 h-6 w-6 flex-shrink-0 text-green-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    {t('mobileKeyTitle')}
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                    {t('mobileKeySubtitle')}
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Guide Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='items-start lg:grid lg:grid-cols-3 lg:gap-12'>
            <motion.div
              className='mb-12 lg:col-span-2 lg:mb-0'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <div className='relative aspect-video overflow-hidden rounded-2xl bg-gray-900'>
                <video
                  controls
                  preload='metadata'
                  width='1280'
                  height='720'
                  className='h-full w-full object-cover'
                  poster='/ssp-setup-guide-poster.jpg'
                >
                  <source src='/ssp-setup-guide.webm' type='video/webm' />
                  <source src='/ssp-setup-guide.mp4' type='video/mp4' />
                  <track kind='captions' srcLang='en' label='English' />
                  {t('videoUnsupported')}
                </video>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <div className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700'>
                <div className='mb-6 flex items-center'>
                  <Play className='text-primary-600 dark:text-primary-400 mr-3 h-8 w-8' />
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                      {t('videoTitle')}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>{t('videoSubtitle')}</p>
                  </div>
                </div>

                <p className='mb-6 text-gray-600 dark:text-gray-400'>{t('videoDescription')}</p>

                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    {t('videoBullet1')}
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    {t('videoBullet2')}
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    {t('videoBullet3')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('stepsTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('stepsSubtitle')}
            </p>
          </motion.div>

          <div className='space-y-16'>
            {phases.map((phase, phaseIdx) => {
              const PhaseIcon = phase.icon
              return (
                <div key={phase.phaseIndex} className='relative'>
                  {/* Phase Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className='mb-8 flex items-center'
                  >
                    <div
                      className={`mr-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                        phase.color === 'blue'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      } `}
                    >
                      <PhaseIcon className='h-6 w-6' />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold tracking-wider uppercase ${phase.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'} `}
                      >
                        {t(`phases.${phase.phaseIndex}.phase`)}
                      </div>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {t(`phases.${phase.phaseIndex}.title`)}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Steps */}
                  <div className='grid gap-6'>
                    {phase.steps.map((step, stepIndex) => (
                      <StepCard
                        key={`${phase.phaseIndex}-${stepIndex}`}
                        step={step}
                        phaseIndex={phase.phaseIndex}
                        phaseColor={phase.color}
                        index={stepIndex}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  {phaseIdx < phases.length - 1 && (
                    <div className='mt-16 flex items-center justify-center'>
                      <div className='h-px flex-1 bg-gray-300 dark:bg-gray-600'></div>
                      <div className='dark:bg-dark-800 mx-4 rounded-full border-2 border-gray-300 bg-white p-3 dark:border-gray-600'>
                        <ArrowRight className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                      </div>
                      <div className='h-px flex-1 bg-gray-300 dark:bg-gray-600'></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('tipsTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('tipsSubtitle')}
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {securityTipIcons.map((TipIcon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 text-center transition-shadow hover:shadow-lg dark:border-gray-700'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl'>
                  <TipIcon className='h-8 w-8' />
                </div>
                <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                  {t(`tips.${index}.title`)}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>{t(`tips.${index}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Message */}
      <section className='section-padding bg-green-600 dark:bg-green-800'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <CheckCircle className='mx-auto mb-6 h-16 w-16 text-white' />
            <h2 className='mb-4 text-3xl font-bold text-white'>{t('successTitle')}</h2>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-green-100'>
              {t('successDescription')}
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/download'
                className='inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-colors hover:bg-gray-50'
              >
                <Download className='mr-2 h-5 w-5' />
                {t('successDownload')}
              </Link>
              <Link
                href='/support'
                className='inline-flex items-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10'
              >
                {t('successSupport')}
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
