'use client'

import { motion } from 'framer-motion'
import { Award, ExternalLink, Eye, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Security Audited',
    description: 'Comprehensive security audits by Halborn for all critical components',
    highlight: 'Halborn Certified',
  },
  {
    icon: Lock,
    title: 'BIP48 Multisignature',
    description:
      'True 2-of-2 multisignature using BIP48 derivation with device fingerprinting and AES-GCM encryption',
    highlight: 'Cryptographically Secure',
  },
  {
    icon: Eye,
    title: 'Open Source',
    description: 'Transparent, verifiable code available for community review',
    highlight: 'Fully Transparent',
  },
  {
    icon: Award,
    title: 'Zero Data Storage',
    description:
      'PBKDF2-based encryption with device fingerprinting ensures no sensitive data is ever stored on servers',
    highlight: 'Self-Custody Only',
  },
]

const auditReports = [
  {
    title: 'SSP Wallet, Key & Relay Audit',
    date: 'March 2025',
    status: 'Completed',
    link: 'https://github.com/RunOnFlux/ssp-wallet/blob/master/SSP_Security_Audit_HALBORN_2025.pdf',
  },
  {
    title: 'Smart Contracts Audit',
    date: 'February 2025',
    status: 'Completed',
    link: 'https://github.com/RunOnFlux/ssp-wallet/blob/master/Account_Abstraction_Schnorr_MultiSig_SmartContracts_SecAudit_HALBORN_2025.pdf',
  },
  {
    title: 'SDK Security Audit',
    date: 'February 2025',
    status: 'Completed',
    link: 'https://github.com/RunOnFlux/ssp-wallet/blob/master/Account_Abstraction_Schnorr_MultiSig_SDK_SecAudit_HALBORN_2025.pdf',
  },
]

export function Security() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
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
                Security First Approach
              </div>

              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                <span className='gradient-text'>Bank-Grade Security</span> You Can Trust
              </h2>
              <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
                Our security is independently verified and audited by leading security firms. Your
                assets are protected by military-grade encryption and cutting-edge technology.
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
                  Independently <span className='gradient-text'>Security Audited</span>
                </h3>

                <p className='mb-8 leading-relaxed text-gray-600 dark:text-gray-300'>
                  All critical components of the SSP ecosystem have undergone rigorous security
                  audits by Halborn, a leading blockchain security firm. Our commitment to
                  transparency means all audit reports are publicly available.
                </p>

                {/* Trust Indicators */}
                <div className='mb-8 space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                      <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='font-medium'>Zero Critical Vulnerabilities Found</span>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                      <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='font-medium'>All Issues Resolved</span>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-500'>
                      <svg className='h-4 w-4 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span className='font-medium'>Continuous Security Monitoring</span>
                  </div>
                </div>

                {/* Halborn Badge */}
                <div className='inline-flex items-center rounded-lg bg-linear-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white shadow-lg'>
                  <Award className='mr-2 h-5 w-5' />
                  Audited by Halborn
                </div>
              </div>

              {/* Right Content - Audit Reports */}
              <div>
                <h4 className='mb-6 text-xl font-bold'>Recent Audit Reports</h4>

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
                          <span className='mr-1 text-sm font-medium'>View Report</span>
                          <ExternalLink className='h-4 w-4' />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Security Info */}
                <div className='border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20 mt-8 rounded-lg border p-4'>
                  <p className='text-primary-800 dark:text-primary-200 text-sm'>
                    <strong>Security Bug Bounty:</strong> We offer rewards for responsible
                    disclosure of security vulnerabilities. Help us keep SSP secure.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
