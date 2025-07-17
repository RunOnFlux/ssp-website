'use client'

import { motion } from 'framer-motion'
import { Award, Eye, Lock, Shield } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: 'Multi-Signature Protection',
    description:
      'Advanced BIP48-Multi-Sig design with mobile-integrated 2FA system provides dual-signature protection.',
  },
  {
    icon: Lock,
    title: 'Zero Data Storage',
    description:
      'Strict no-storing policy eliminates risk of data breaches. Your information never leaves your device.',
  },
  {
    icon: Eye,
    title: 'Open Source & Audited',
    description:
      'Transparent, verifiable code audited by Halborn security experts for maximum trust.',
  },
  {
    icon: Award,
    title: 'Military-Grade Encryption',
    description:
      'State-of-the-art encryption technology protects your assets with bank-level security.',
  },
]

export function SecurityFeatures() {
  return (
    <section className='section-padding bg-white dark:bg-dark-900'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <spsan className='gradient-text'>Security</spsan> Features
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            Your crypto security is our top priority. Every feature is designed with security-first
            principles.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='card card-hover'
              >
                <div className='flex items-start space-x-4'>
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500'>
                    <Icon className='h-6 w-6 text-white' />
                  </div>
                  <div>
                    <h3 className='mb-3 text-xl font-bold'>{feature.title}</h3>
                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {feature.description}
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
