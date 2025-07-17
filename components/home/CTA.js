'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Chrome, Download, Key, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { Logo } from '../Logo'

const downloadOptions = [
  {
    icon: Chrome,
    title: 'SSP Wallet - Browser Extension',
    description: 'Available now - Chrome, Brave, Firefox',
    link: '/download',
    primary: true,
  },
  {
    icon: Smartphone,
    title: 'SSP Key - Mobile 2FA App',
    description: 'Required for transactions approving and more',
    link: '/download#mobile',
    primary: true,
  },
  {
    icon: Key,
    title: 'Hardware Keys - Enterprise',
    description: 'For businesses requiring multisignature security',
    link: '/contact',
    primary: true,
    comingSoon: true,
  },
]

export function CTA() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className='section-padding from-primary-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden bg-linear-to-br via-white to-blue-50'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        {/* Gradient Orbs */}
        <div className='bg-primary-500/10 absolute top-1/4 right-1/4 h-96 w-96 rounded-full blur-3xl' />
        <div className='absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl' />

        {/* Grid Pattern */}
        <div className='absolute inset-0 opacity-20'>
          <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='ctaGrid' width='60' height='60' patternUnits='userSpaceOnUse'>
                <path
                  d='M 60 0 L 0 0 0 60'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1'
                  className='text-gray-300 dark:text-gray-700'
                />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#ctaGrid)' />
          </svg>
        </div>
      </div>

      <div className='container-custom relative z-10'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Main CTA Content */}
          <div className='mb-16 text-center'>
            <motion.div variants={itemVariants}>
              <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
                <Download className='mr-2 h-4 w-4' />
                Ready to Get Started?
              </div>

              <h2 className='mb-6 text-4xl font-bold text-balance md:text-5xl lg:text-6xl'>
                Join the <span className='gradient-text'>Future of Crypto</span>
              </h2>

              <p className='mx-auto mb-8 max-w-3xl text-xl text-balance text-gray-600 md:text-2xl dark:text-gray-300'>
                Download SSP Wallet today and experience the next generation of cryptocurrency
                management with unmatched security and simplicity.
              </p>
            </motion.div>

            {/* Primary CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className='mb-12 flex flex-col justify-center gap-4 sm:flex-row'
            >
              <Link
                href='/download'
                className='btn btn-primary group px-10 py-5 text-xl shadow-2xl'
              >
                <Download className='mr-3 h-6 w-6 group-hover:animate-bounce' />
                Download Now
                <ArrowRight className='ml-3 h-5 w-5 transition-transform group-hover:translate-x-1' />
              </Link>

              <Link href='/features' className='btn btn-secondary px-10 py-5 text-xl'>
                Learn More
              </Link>
            </motion.div>

            {/* Download Options */}
            <motion.div
              variants={itemVariants}
              className='mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-3'
            >
              {downloadOptions.map((option, index) => {
                const Icon = option.icon

                const CardContent = (
                  <div
                    className={`card group text-center transition-all duration-300 ${
                      option.primary
                        ? 'ring-primary-500 scale-105 shadow-lg ring-2'
                        : option.comingSoon
                          ? 'border-dashed opacity-60'
                          : 'opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                        option.primary
                          ? 'bg-primary-500 text-white'
                          : option.comingSoon
                            ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                            : 'dark:bg-dark-700 bg-gray-100 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <Icon className='h-8 w-8' />
                    </div>

                    <h3 className='mb-2 text-lg font-bold'>{option.title}</h3>
                    <p
                      className={`text-sm ${
                        option.primary
                          ? 'text-primary-600 dark:text-primary-400 font-medium'
                          : option.comingSoon
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {option.description}
                    </p>

                    {option.primary && !option.comingSoon && (
                      <div className='mt-3'>
                        <span className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 inline-block rounded-full px-3 py-1 text-xs font-medium'>
                          Available Now
                        </span>
                      </div>
                    )}

                    {option.comingSoon && (
                      <div className='mt-3'>
                        <span className='inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'>
                          Coming Soon
                        </span>
                      </div>
                    )}
                  </div>
                )

                return option.comingSoon ? (
                  <div key={index}>{CardContent}</div>
                ) : (
                  <Link key={index} href={option.link}>
                    {CardContent}
                  </Link>
                )
              })}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={itemVariants}
              className='dark:border-dark-600/50 dark:bg-dark-800/60 rounded-2xl border border-gray-200/50 bg-white/60 p-8 backdrop-blur-sm'
            >
              <div className='grid items-center gap-8 md:grid-cols-3'>
                <div className='text-center'>
                  <div className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>1000+</div>
                  <p className='text-gray-600 dark:text-gray-400'>Active Users</p>
                </div>

                <div className='text-center'>
                  <div className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>$50M+</div>
                  <p className='text-gray-600 dark:text-gray-400'>Assets Secured</p>
                </div>

                <div className='text-center'>
                  <div className='mb-2 text-3xl font-bold text-gray-900 dark:text-white'>15+</div>
                  <p className='text-gray-600 dark:text-gray-400'>Blockchains Supported</p>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className='dark:border-dark-600 mt-8 flex items-center justify-center space-x-8 border-t border-gray-200 pt-8'>
                <div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
                  <div className='h-3 w-3 rounded-full bg-green-500'></div>
                  <span className='text-sm font-medium'>Security Audited</span>
                </div>

                <div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
                  <div className='h-3 w-3 rounded-full bg-blue-500'></div>
                  <span className='text-sm font-medium'>Open Source</span>
                </div>

                <div className='flex items-center space-x-2 text-gray-600 dark:text-gray-400'>
                  <div className='h-3 w-3 rounded-full bg-purple-500'></div>
                  <span className='text-sm font-medium'>Community Driven</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Visual */}
          <motion.div variants={itemVariants} className='text-center'>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className='mx-auto mb-8 flex h-32 w-32 items-center justify-center'
            >
              <Logo width={128} height={128} className='object-contain' />
            </motion.div>

            {/* Glow Effect */}
            <div className='from-primary-500/30 absolute inset-0 -z-10 rounded-full bg-linear-to-r to-blue-500/30 blur-2xl' />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
