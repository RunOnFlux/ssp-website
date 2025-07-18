'use client'

import { motion } from 'framer-motion'
import { Code, Globe, Shield, Smartphone, Zap } from 'lucide-react'

const techFeatures = [
  {
    icon: Globe,
    title: 'Multi-Chain Support (15+)',
    description:
      'Native support for Bitcoin, Ethereum, Polygon, BSC, Avalanche, Base, Arbitrum, Optimism, and more with unified portfolio management.',
  },
  {
    icon: Zap,
    title: 'Built-in Crypto Trading',
    description:
      'Seamless crypto swapping via integrated DEX aggregators, plus fiat on-ramp/off-ramp for buying and selling crypto with payment cards.',
  },
  {
    icon: Code,
    title: 'Account Abstraction (ERC-4337)',
    description:
      'First wallet with native Schnorr multisignature Account Abstraction on Ethereum, enabling gasless transactions and smart contract wallets.',
  },
  {
    icon: Smartphone,
    title: 'True 2-of-2 Multisig Security',
    description:
      'Revolutionary BIP48 dual-device security with browser extension and mobile app. Both devices required for every transaction - ultimate protection.',
  },
  {
    icon: Shield,
    title: 'Security Audited & Open Source',
    description:
      'Fully transparent, verifiable code professionally audited by Halborn security experts. Open source with enterprise-grade security standards.',
  },
  {
    icon: Code,
    title: 'Advanced dApp Integration',
    description:
      'WalletConnect v2 support, EIP-712 message signing, and comprehensive browser integration for seamless dApp connectivity.',
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
