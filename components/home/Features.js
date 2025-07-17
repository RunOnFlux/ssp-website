'use client'

import { motion } from 'framer-motion'
import { Globe, Lock, Shield, Smartphone, Users, Zap } from 'lucide-react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

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
      'Support for 15+ blockchains including Bitcoin, Ethereum, Polygon, BSC, Avalanche, Base, and many more with unified experience.',
    image: '/browsers.svg',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: Smartphone,
    title: 'Account Abstraction',
    description:
      'First wallet with native Schnorr multisignature Account Abstraction (ERC-4337) on Ethereum, enabling smart contract wallets without EOAs.',
    image: '/iphone.svg',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Lock,
    title: 'Zero Data Storage',
    description:
      'No sensitive data ever stored on servers. Keys, seeds, and transactions remain exclusively on your devices with AES-GCM encryption.',
    image: '/icons.svg',
    color: 'from-indigo-500 to-blue-500',
  },
]

export function Features() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

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

            {/* Video/Animation Section */}
            <div className='relative'>
              <div className='dark:from-dark-800 dark:to-dark-700 aspect-video overflow-hidden rounded-xl bg-linear-to-br from-gray-100 to-gray-200'>
                {/* Placeholder for video */}
                <div className='flex h-full w-full items-center justify-center'>
                  <div className='text-center'>
                    <div className='bg-primary-500 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full'>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className='h-10 w-10 text-white' />
                      </motion.div>
                    </div>
                    <p className='font-medium text-gray-600 dark:text-gray-300'>
                      Interactive Demo Coming Soon
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
    </section>
  )
}
