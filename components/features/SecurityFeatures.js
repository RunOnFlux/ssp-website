'use client'

import { motion } from 'framer-motion'
import { Award, Eye, Lock, Shield } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: 'True 2-of-2 Multisig Protection',
    description:
      'Revolutionary BIP48 multisignature requiring both browser and mobile device signatures. No single point of failure - impossible to compromise with just one device.',
  },
  {
    icon: Award,
    title: 'Halborn Security Audit',
    description:
      'Professionally audited by Halborn, the leading blockchain security firm trusted by major protocols. Comprehensive penetration testing and code review completed.',
  },
  {
    icon: Lock,
    title: 'Zero Data Storage Policy',
    description:
      'Strict no-server-storage policy eliminates centralized attack vectors. Your private keys, transactions, and personal data never leave your devices.',
  },
  {
    icon: Eye,
    title: 'Fully Open Source & Transparent',
    description:
      'Complete codebase transparency allows security researchers and developers to verify our claims. No hidden backdoors or proprietary black boxes.',
  },
]

export function SecurityFeatures() {
  return (
    <section className='section-padding dark:bg-dark-900 bg-white'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <span className='gradient-text'>Security</span> Features
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
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className='card card-hover'
              >
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-500 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg'>
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
