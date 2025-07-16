'use client'

import { motion } from 'framer-motion'
import { Globe, Smartphone, Code, Zap } from 'lucide-react'

const techFeatures = [
  {
    icon: Globe,
    title: 'Multi-Chain Support',
    description:
      'Support for 12+ blockchains including Bitcoin, Ethereum, and more with unified experience.',
  },
  {
    icon: Code,
    title: 'Account Abstraction',
    description:
      'First wallet to introduce true multi-signature accounts to Ethereum with ERC-4337.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Integration',
    description:
      'Seamless mobile app integration for secure authentication and transaction approval.',
  },
  {
    icon: Zap,
    title: 'DApp Integration',
    description: 'Compatible with major DApp platforms for complete Web3 ecosystem access.',
  },
]

export function TechnicalFeatures() {
  return (
    <section className='section-padding bg-gray-50 dark:bg-dark-800'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <span className='gradient-text'>Technical</span> Innovation
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            Built with cutting-edge technology for the future of decentralized finance.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2'>
          {techFeatures.map((feature, index) => {
            const Icon = feature.icon

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='card card-hover'
              >
                <div className='text-center'>
                  <div className='mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600'>
                    <Icon className='h-8 w-8 text-white' />
                  </div>
                  <h3 className='mb-4 text-xl font-bold'>{feature.title}</h3>
                  <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                    {feature.description}
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
