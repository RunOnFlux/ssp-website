'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  Chrome,
  Globe,
  Lock,
  Play,
  QrCode,
  Shield,
  Smartphone,
  Users,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { InteractiveDemo } from '../InteractiveDemo/InteractiveDemo'

const features = [
  {
    icon: Shield,
    title: 'Secure 2-of-2 Multisignature',
    description:
      'Advanced BIP48 derivation with true two-factor authentication requiring both browser extension and mobile device signatures for every transaction. Maximum security through dual-device protection.',
    image: '/security.svg',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Simple Yet Advanced',
    description:
      'Complex multi-asset multisignature technology made simple. Advanced BIP48 security and Account Abstraction delivered through an intuitive interface anyone can use.',
    image: '/simplicity.svg',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'Powerful dApp Interaction',
    description:
      'Connect to thousands of dApps with WalletConnect v2 (Reown) support, EIP-712 message signing, and real-time communication across all EVM chains and DeFi protocols.',
    image: '/powerful.svg',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    title: 'Multi-Chain Support',
    description:
      'Support for 15+ blockchains including Bitcoin, Ethereum, Polygon, BSC, Avalanche, Base, and more. First wallet with native Schnorr multisignature Account Abstraction (ERC-4337) on Ethereum, enabling smart contract wallets without EOAs.',
    image: '/browsers.svg',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Lock,
    title: 'Zero Data Storage',
    description:
      'Complete self-custody with zero server-side data storage. Private keys, seeds, and transactions remain exclusively on your devices using military-grade AES-GCM encryption and device fingerprinting for maximum security and privacy.',
    image: '/icons.svg',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: ArrowRight,
    title: 'Buy, Sell & Swap',
    description:
      'Buy cryptocurrencies directly with credit cards or bank transfers, sell crypto back to fiat currency, and swap between different cryptocurrencies seamlessly within the wallet. Powered by an aggregated engine of multiple providers for the best rates and options.',
    image: '/card1-img.svg',
    color: 'from-emerald-500 to-teal-500',
  },
]

export function Features() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })
  const [isDemoOpen, setIsDemoOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section className='section-padding dark:bg-dark-900 bg-white'>
      <div className='container-custom'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Section Header */}
          <div className='mb-16 text-center'>
            <motion.div variants={cardVariants}>
              <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
                Why Choose <span className='gradient-text'>SSP Wallet</span>?
              </h2>
              <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
                Experience the perfect blend of security, simplicity, and power in one comprehensive
                crypto wallet solution.
              </p>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            {features.map((feature, index) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className='card card-hover group relative overflow-hidden'
                >
                  {/* Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                  />

                  {/* Content */}
                  <div className='relative z-10'>
                    {/* Icon */}
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br ${feature.color} mb-4`}
                    >
                      <Icon className='h-6 w-6 text-white' />
                    </div>

                    {/* Text Content */}
                    <h3 className='group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-3 text-xl font-bold transition-colors duration-200'>
                      {feature.title}
                    </h3>

                    <p className='leading-relaxed text-gray-600 dark:text-gray-300'>
                      {feature.description}
                    </p>

                    {/* Feature Image/Icon */}
                    <div className='mt-6 flex justify-center opacity-60 transition-opacity duration-300 group-hover:opacity-100'>
                      <div className='relative h-16 w-16'>
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          className='object-contain'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className='group-hover:border-primary-200 dark:group-hover:border-primary-800 absolute inset-0 rounded-xl border-2 border-transparent transition-colors duration-300' />
                </motion.div>
              )
            })}
          </div>

          {/* Feature Highlight Section */}
          <motion.div
            variants={cardVariants}
            className='mt-20 grid items-center gap-12 lg:grid-cols-2'
          >
            <div>
              <h3 className='mb-6 text-3xl font-bold md:text-4xl'>
                Built for the <span className='gradient-text'>Future of Finance</span>
              </h3>
              <div className='space-y-6'>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-500 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
                    <span className='text-sm font-bold text-white'>1</span>
                  </div>
                  <div>
                    <h4 className='mb-2 text-lg font-semibold'>Advanced Security</h4>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Military-grade encryption and multi-signature technology protect your assets
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-500 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
                    <span className='text-sm font-bold text-white'>2</span>
                  </div>
                  <div>
                    <h4 className='mb-2 text-lg font-semibold'>Seamless Experience</h4>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Intuitive interface makes crypto accessible to everyone
                    </p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-500 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full'>
                    <span className='text-sm font-bold text-white'>3</span>
                  </div>
                  <div>
                    <h4 className='mb-2 text-lg font-semibold'>Open Source</h4>
                    <p className='text-gray-600 dark:text-gray-300'>
                      Transparent, audited code that you can trust and verify
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Demo Section */}
            <div className='relative hidden md:block'>
              <div className='dark:from-dark-800 dark:to-dark-700 aspect-video overflow-hidden rounded-xl border-2 border-gray-200 bg-linear-to-br from-gray-100 to-gray-200 dark:border-gray-600'>
                {/* Interactive Demo Preview */}
                <div className='flex h-full w-full items-center justify-center p-8'>
                  <div className='text-center'>
                    {/* Demo Preview Icons */}
                    <div className='mb-6 flex items-center justify-center space-x-6'>
                      <div className='rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-600 dark:bg-gray-700'>
                        <Chrome className='h-8 w-8 text-blue-600' />
                      </div>

                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className='flex items-center'
                      >
                        <div className='h-0.5 w-8 bg-gradient-to-r from-blue-500 to-purple-500'></div>
                        <QrCode className='mx-2 h-6 w-6 text-purple-600' />
                        <div className='h-0.5 w-8 bg-gradient-to-r from-purple-500 to-blue-500'></div>
                      </motion.div>

                      <div className='rounded-lg border border-gray-300 bg-white p-3 shadow-sm dark:border-gray-600 dark:bg-gray-700'>
                        <Smartphone className='h-8 w-8 text-green-600' />
                      </div>
                    </div>

                    <h4 className='mb-3 text-xl font-semibold text-gray-900 dark:text-white'>
                      Try SSP Wallet Interactive Demo
                    </h4>
                    <p className='mb-6 text-gray-600 dark:text-gray-300'>
                      Experience the complete setup and transaction flow
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsDemoOpen(true)}
                      className='btn btn-primary group cursor-pointer px-6 py-3'
                    >
                      <Play className='mr-2 h-4 w-4' />
                      Launch Interactive Demo
                      <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                    </motion.button>

                    <p className='mt-3 text-sm text-gray-500 dark:text-gray-400'>
                      No installation required • 3-minute experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className='bg-primary-200 dark:bg-primary-800 absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-60 blur-xl' />
              <div className='absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-blue-200 opacity-40 blur-xl dark:bg-blue-800' />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Interactive Demo Modal */}
      <InteractiveDemo isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </section>
  )
}
