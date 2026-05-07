'use client'

import { motion } from 'framer-motion'
import { Lock, Shield, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FeaturesHero() {
  const t = useTranslations('Features.hero')
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
            {t('badge')}
          </div>

          <h1 className='mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
            <span className='gradient-text'>{t('titleHighlight')}</span> {t('titleSuffix')}
          </h1>

          <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-300'>
            {t('description')}
          </p>

          <div className='mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8'>
            <div className='flex items-center space-x-2'>
              <Shield className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>{t('securityFirst')}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Zap className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>{t('lightningFast')}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <Lock className='text-primary-600 h-6 w-6' />
              <span className='font-medium'>{t('selfCustody')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
