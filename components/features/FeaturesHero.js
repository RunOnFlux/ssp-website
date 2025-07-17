'use client'

import { motion } from 'framer-motion'
import { Lock, Shield, Zap } from 'lucide-react'

export function FeaturesHero() {
  return (
    <section className='section-padding dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 bg-linear-to-br from-gray-50 via-white to-gray-100'>
      <div className='container-custom'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='text-center'
        >
          <div className='bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
            <Shield className='mr-2 h-4 w-4' />
            Advanced Features
          </div>

          <h1 className='mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
            <span className='gradient-text'>Powerful Features</span> for Modern Crypto
          </h1>

          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-300'>
            Discover the cutting-edge technology and security features that make SSP Wallet the most
            advanced crypto wallet available.
          </p>

          <div className='mt-12 flex items-center justify-center space-x-8'>
            <div className='flex items-center space-x-2'>
              <Shield className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>Security First</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Zap className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>Lightning Fast</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Lock className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>Self-Custody</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
