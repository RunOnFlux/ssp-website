'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Lock, Play, Shield, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    icon: Shield,
    text: 'Multi-signature Security',
  },
  {
    icon: Zap,
    text: 'Lightning Fast',
  },
  {
    icon: Lock,
    text: 'Self-custody',
  },
]

export function Hero() {
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
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className='dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-gray-50 via-white to-gray-100'>
      {/* Background Elements */}
      <div className='absolute inset-0'>
        {/* Gradient Orbs */}
        <div className='animate-pulse-slow bg-primary-500/20 absolute top-1/4 left-1/4 h-96 w-96 rounded-full blur-3xl' />
        <div className='animation-delay-400 animate-pulse-slow absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl' />

        {/* Grid Pattern */}
        <div className='absolute inset-0 opacity-30 dark:opacity-10'>
          <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
            <defs>
              <pattern id='grid' width='50' height='50' patternUnits='userSpaceOnUse'>
                <path
                  d='M 50 0 L 0 0 0 50'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1'
                  className='text-gray-200 dark:text-gray-700'
                />
              </pattern>
            </defs>
            <rect width='100%' height='100%' fill='url(#grid)' />
          </svg>
        </div>
      </div>

      <div className='container-custom relative z-10'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className='grid items-center gap-12 lg:grid-cols-2'
        >
          {/* Left Content */}
          <div className='text-center lg:text-left'>
            <motion.div variants={itemVariants} className='mb-6'>
              <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
                <span className='bg-primary-500 mr-2 h-2 w-2 animate-pulse rounded-full'></span>
                Security Audited by Halborn
              </div>

              <h1 className='mb-6 text-5xl font-bold text-balance md:text-6xl lg:text-7xl'>
                <span className='gradient-text'>Secure</span>,{' '}
                <span className='gradient-text'>Simple</span>,{' '}
                <span className='gradient-text'>Powerful</span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className='mb-8 max-w-2xl text-xl text-balance text-gray-600 md:text-2xl dark:text-gray-300'
            >
              The next-generation crypto wallet with multi-signature security, seamless DApp
              integration, and support for multiple blockchains.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              variants={itemVariants}
              className='mb-8 flex flex-wrap justify-center gap-4 lg:justify-start'
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className='dark:border-dark-600 dark:bg-dark-800/60 flex items-center space-x-2 rounded-full border border-gray-200 bg-white/60 px-4 py-2 backdrop-blur-sm'
                  >
                    <Icon className='text-primary-600 dark:text-primary-400 h-4 w-4' />
                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {feature.text}
                    </span>
                  </div>
                )
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className='flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'
            >
              <Link href='/download' className='btn btn-primary group px-8 py-4 text-lg'>
                <Download className='mr-2 h-5 w-5 group-hover:animate-bounce' />
                Get Started Now
                <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </Link>

              <button className='btn btn-secondary group px-8 py-4 text-lg'>
                <Play className='mr-2 h-5 w-5' />
                Watch Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className='dark:border-dark-600 mt-12 grid grid-cols-3 gap-8 border-t border-gray-200 pt-8'
            >
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900 md:text-3xl dark:text-white'>
                  12+
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Supported Chains</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900 md:text-3xl dark:text-white'>
                  100K+
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Active Users</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900 md:text-3xl dark:text-white'>
                  99.9%
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>Uptime</div>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Visual */}
          <motion.div variants={itemVariants} className='relative flex items-center justify-center'>
            <motion.div variants={floatingVariants} animate='floating' className='relative'>
              {/* Main Animation/Logo */}
              <div className='relative mx-auto h-96 w-96'>
                <Image
                  src='/ssp animation 3_6 1.svg'
                  alt='SSP Wallet Animation'
                  fill
                  className='object-contain'
                  priority
                />

                {/* Glow Effect */}
                <div className='from-primary-500/20 absolute inset-0 -z-10 rounded-full bg-linear-to-r to-blue-500/20 blur-3xl' />
              </div>

              {/* Floating Elements */}
              <motion.div
                className='bg-primary-500 absolute -top-8 -right-8 flex h-16 w-16 items-center justify-center rounded-full shadow-lg'
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Shield className='h-8 w-8 text-white' />
              </motion.div>

              <motion.div
                className='absolute -bottom-4 -left-8 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg'
                animate={{
                  y: [5, -5, 5],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <Zap className='h-6 w-6 text-white' />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className='absolute bottom-8 left-1/2 -translate-x-1/2 transform'
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className='flex h-10 w-6 justify-center rounded-full border-2 border-gray-400 dark:border-gray-600'>
          <div className='mt-2 h-3 w-1 animate-pulse rounded-full bg-gray-400 dark:bg-gray-600'></div>
        </div>
      </motion.div>
    </section>
  )
}
