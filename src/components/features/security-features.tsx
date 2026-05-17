'use client'

import { motion } from 'framer-motion'
import { Award, Eye, Lock, type LucideIcon, Shield } from 'lucide-react'
import { useTranslations } from 'next-intl'

const securityIcons: LucideIcon[] = [Shield, Award, Lock, Eye]

export function SecurityFeatures() {
  const t = useTranslations('Features.security')
  return (
    <section className='section-padding dark:bg-dark-900 bg-white'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <span className='gradient-text'>{t('titleHighlight')}</span> {t('titleSuffix')}
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            {t('description')}
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          {securityIcons.map((Icon, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='card card-hover'
              >
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-500 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg'>
                    <Icon className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='mb-3 text-xl font-bold'>{t(`items.${index}.title`)}</h3>
                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {t(`items.${index}.description`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
