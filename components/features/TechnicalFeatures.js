'use client'

import { motion } from 'framer-motion'
import { Code, Globe, Smartphone, Zap } from 'lucide-react'

const techFeatures = [
  {
    icon: Globe,
    title: 'Multi-Chain Support',
    description:
      'Support for 13+ blockchains including Bitcoin, Ethereum, Polygon, BSC, Avalanche, Base, and more with unified experience.',
  },
  {
    icon: Code,
    title: 'Schnorr Multisig ERC-4337',
    description:
      'First wallet with native Schnorr multisignature Account Abstraction on Ethereum, removing EOA requirements.',
  },
  {
    icon: Smartphone,
    title: 'BIP48 Two-Device Security',
    description:
      'True 2-of-2 multisignature using BIP48 derivation with browser extension and mobile app authentication.',
  },
  {
    icon: Zap,
    title: 'Developer API & WalletConnect v2',
    description:
      'JavaScript API for dApp integration, WalletConnect v2 support, and EIP-712 message signing.',
  },
  {
    icon: Smartphone,
    title: 'Hardware Key Support',
    description:
      'Enhanced security with hardware key integration - coming soon for ultimate protection.',
  },
]

export function TechnicalFeatures() {
  return (
    <section className='section-padding dark:bg-dark-800 bg-gray-50'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            <span className='gradient-text'>Technical</span> Innovation
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            Built with cutting-edge technology for the future of decentralized finance.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-2 xl:grid-cols-3'>
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
                  <div className='from-primary-500 to-primary-600 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-linear-to-br'>
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
