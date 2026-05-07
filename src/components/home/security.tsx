'use client'

import { motion, type Variants } from 'framer-motion'
import { Award, ExternalLink, Eye, type LucideIcon, Lock, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

const securityFeatureIcons: LucideIcon[] = [Shield, Lock, Eye, Award]

const auditReportLinks = [
  'https://github.com/RunOnFlux/ssp-wallet/blob/master/SSP_Security_Audit_HALBORN_2025.pdf',
  'https://github.com/RunOnFlux/ssp-wallet/blob/master/Account_Abstraction_Schnorr_MultiSig_SmartContracts_SecAudit_HALBORN_2025.pdf',
  'https://github.com/RunOnFlux/ssp-wallet/blob/master/Account_Abstraction_Schnorr_MultiSig_SDK_SecAudit_HALBORN_2025.pdf',
]

export function Security() {
  const t = useTranslations('Home.security')
  const securityFeatures = securityFeatureIcons.map((icon, index) => ({
    icon,
    title: t(`items.${index}.title`),
    description: t(`items.${index}.description`),
    highlight: t(`items.${index}.highlight`),
  }))
  const auditReports = auditReportLinks.map((link, index) => ({
    title: t(`reports.${index}.title`),
    date: t(`reports.${index}.date`),
    status: t(`reports.${index}.status`),
    link,
  }))
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className='section-padding dark:bg-dark-800 bg-gray-50'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Section Header */}
          <div className='mb-16 text-center'>
            <motion.div variants={itemVariants}>
              <div className='mb-6 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-800 dark:bg-red-900/30 dark:text-red-200'>
                <Shield className='mr-2 h-4 w-4' />
                {t('badge')}
              </div>

              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                <span className='gradient-text'>{t('titleHighlight')}</span> {t('titleSuffix')}
              </h2>
              <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
                {t('description')}
              </p>
            </motion.div>
          </div>

          {/* Security Features Grid */}
          <div className='mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div key={index} variants={itemVariants} className='group text-center'>
                  {/* Icon Container */}
                  <div className='relative mb-6'>
                    <div className='dark:bg-dark-700 mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl'>
                      <Icon className='text-primary-600 dark:text-primary-400 h-10 w-10' />
                    </div>

                    {/* Floating badge */}
                    <div className='absolute -top-2 -right-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white'>
                      {feature.highlight}
                    </div>
                  </div>

                  <h3 className='group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3 text-lg font-bold transition-colors duration-200'>
                    {feature.title}
                  </h3>

                  <p className='text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Audit Reports Section */}
          <motion.div
            variants={itemVariants}
            className='dark:bg-dark-900 rounded-2xl bg-white p-8 shadow-lg'
          >
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <div>
                <h3 className='mb-6 text-3xl font-bold'>
                  {t('auditTitlePart1')}{' '}
                  <span className='gradient-text'>{t('auditTitleHighlight')}</span>
                </h3>

                <p className='mb-8 leading-relaxed text-gray-600 dark:text-gray-300'>
                  {t('auditDescription')}
                </p>

                {/* Trust Indicators */}
                <div className='mb-8 space-y-4'>
                  {[0, 1, 2].map(index => (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                        <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <span className='font-medium'>{t(`indicators.${index}`)}</span>
                    </div>
                  ))}
                </div>

                {/* Halborn Badge */}
                <a
                  href='https://www.halborn.com/audits/influx-technologies'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105'
                >
                  <Award className='mr-2 h-5 w-5' />
                  {t('auditedByHalborn')}
                </a>
              </div>

              {/* Right Content - Audit Reports */}
              <div>
                <h4 className='mb-6 text-xl font-bold'>{t('recentReportsTitle')}</h4>

                <div className='space-y-4'>
                  {auditReports.map((report, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className='dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg bg-gray-50 p-4 transition-colors duration-200 hover:bg-gray-100'
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex-1'>
                          <h5 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                            {report.title}
                          </h5>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {report.date} • {report.status}
                          </p>
                        </div>

                        <Link
                          href={report.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center transition-colors duration-200'
                        >
                          <span className='mr-1 text-sm font-medium'>{t('viewReport')}</span>
                          <ExternalLink className='h-4 w-4' />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Security Info */}
                <div className='border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20 mt-8 rounded-lg border p-4'>
                  <p className='text-primary-800 dark:text-primary-200 text-sm'>
                    <strong>{t('bugBountyPrefix')}</strong> {t('bugBountyText')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LavaMoat Runtime Security Section */}
          <motion.div
            variants={itemVariants}
            className='dark:bg-dark-900 mt-16 rounded-2xl bg-white p-8 shadow-lg'
          >
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <div>
                <h3 className='mb-6 text-3xl font-bold'>
                  <span className='gradient-text'>{t('lavaMoatTitleHighlight')}</span>{' '}
                  {t('lavaMoatTitleSuffix')}
                </h3>

                <p className='mb-8 leading-relaxed text-gray-600 dark:text-gray-300'>
                  {t('lavaMoatDescription')}
                </p>

                {/* Trust Indicators */}
                <div className='mb-8 space-y-4'>
                  {[0, 1, 2].map(index => (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-purple-500'>
                        <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <span className='font-medium'>{t(`lavaIndicators.${index}`)}</span>
                    </div>
                  ))}
                </div>

                {/* Learn More Button */}
                <a
                  href='https://github.com/LavaMoat/LavaMoat'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center rounded-lg bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105'
                >
                  <Shield className='mr-2 h-5 w-5' />
                  {t('learnLavaMoat')}
                </a>
              </div>

              {/* Right Content - Security Features */}
              <div>
                <h4 className='mb-6 text-xl font-bold'>{t('protectionLayersTitle')}</h4>

                <div className='space-y-4'>
                  {[0, 1, 2, 3].map(index => (
                    <div
                      key={index}
                      className='dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg bg-gray-50 p-4 transition-colors duration-200'
                    >
                      <div className='flex items-start space-x-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white'>
                          {index + 1}
                        </div>
                        <div>
                          <h5 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                            {t(`layers.${index}.title`)}
                          </h5>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {t(`layers.${index}.description`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Deterministic Builds Section */}
          <motion.div
            variants={itemVariants}
            className='dark:bg-dark-900 mt-16 rounded-2xl bg-white p-8 shadow-lg'
          >
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <div>
                <h3 className='mb-6 text-3xl font-bold'>
                  <span className='gradient-text'>{t('deterministicTitleHighlight')}</span>{' '}
                  {t('deterministicTitleSuffix')}
                </h3>

                <p className='mb-8 leading-relaxed text-gray-600 dark:text-gray-300'>
                  {t('deterministicDescription')}
                </p>

                {/* Trust Indicators */}
                <div className='mb-8 space-y-4'>
                  {[0, 1, 2].map(index => (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500'>
                        <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <span className='font-medium'>{t(`detIndicators.${index}`)}</span>
                    </div>
                  ))}
                </div>

                {/* Verification Button */}
                <Link
                  href='/support#security--privacy'
                  className='inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg transition-transform hover:scale-105'
                >
                  <Shield className='mr-2 h-5 w-5' />
                  {t('learnVerify')}
                </Link>
              </div>

              {/* Right Content - Verification Steps */}
              <div>
                <h4 className='mb-6 text-xl font-bold'>{t('verificationProcessTitle')}</h4>

                <div className='space-y-4'>
                  {[0, 1, 2, 3].map(index => (
                    <div
                      key={index}
                      className='dark:bg-dark-800 dark:hover:bg-dark-700 rounded-lg bg-gray-50 p-4 transition-colors duration-200'
                    >
                      <div className='flex items-start space-x-3'>
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                            index === 3 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                        >
                          {index === 3 ? '✓' : index + 1}
                        </div>
                        <div>
                          <h5 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                            {t(`verifySteps.${index}.title`)}
                          </h5>
                          <p className='text-sm text-gray-600 dark:text-gray-400'>
                            {t(`verifySteps.${index}.description`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
