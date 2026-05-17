'use client'

import { motion } from 'framer-motion'
import { Code, Globe, type LucideIcon, Shield, Smartphone, Zap } from 'lucide-react'
import { useTranslations } from 'next-intl'

const techIcons: LucideIcon[] = [Globe, Zap, Code, Smartphone, Shield, Code]

export function TechnicalFeatures() {
  const t = useTranslations('Features.technical')
  return (
    <section className='section-padding dark:bg-dark-800 bg-gray-50'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <span className='gradient-text'>{t('titleHighlight')}</span> {t('titleSuffix')}
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            {t('description')}
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
          {techIcons.map((Icon, index) => {
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='card card-hover'
              >
                <div className='text-center'>
                  <div className='from-primary-500 to-primary-600 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br'>
                    <Icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='mb-4 text-xl font-bold'>{t(`items.${index}.title`)}</h3>
                  <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                    {t(`items.${index}.description`)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
