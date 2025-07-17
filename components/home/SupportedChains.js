'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const supportedChains = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: '/browsers.svg', // We'll use placeholder for now
    color: 'from-orange-400 to-orange-600',
    description: 'The original cryptocurrency',
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    logo: '/browsers.svg',
    color: 'from-blue-400 to-blue-600',
    description: 'Smart contract platform',
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    logo: '/browsers.svg',
    color: 'from-gray-400 to-gray-600',
    description: 'Digital silver',
  },
  {
    name: 'Zcash',
    symbol: 'ZEC',
    logo: '/browsers.svg',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Privacy-focused',
  },
  {
    name: 'Ravencoin',
    symbol: 'RVN',
    logo: '/browsers.svg',
    color: 'from-blue-400 to-indigo-600',
    description: 'Asset transfer blockchain',
  },
  {
    name: 'Dogecoin',
    symbol: 'DOGE',
    logo: '/browsers.svg',
    color: 'from-yellow-400 to-orange-500',
    description: 'The people&apos;s crypto',
  },
  {
    name: 'Bitcoin Cash',
    symbol: 'BCH',
    logo: '/browsers.svg',
    color: 'from-green-400 to-green-600',
    description: 'Peer-to-peer electronic cash',
  },
  {
    name: 'Flux',
    symbol: 'FLUX',
    logo: '/browsers.svg',
    color: 'from-purple-400 to-purple-600',
    description: 'Decentralized computing',
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    logo: '/browsers.svg',
    color: 'from-purple-500 to-indigo-600',
    description: 'Ethereum scaling',
  },
  {
    name: 'Binance Smart Chain',
    symbol: 'BSC',
    logo: '/browsers.svg',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Fast, low-cost transactions',
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    logo: '/browsers.svg',
    color: 'from-red-400 to-red-600',
    description: 'High-performance blockchain',
  },
  {
    name: 'Base',
    symbol: 'BASE',
    logo: '/browsers.svg',
    color: 'from-blue-500 to-blue-700',
    description: 'Coinbase L2 solution',
  },
]

export function SupportedChains() {
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

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
          <motion.div variants={headerVariants} className='mb-16 text-center'>
            <div className='mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'>
              <Plus className='mr-2 h-4 w-4' />
              Multi-Chain Support
            </div>

            <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
              <span className='gradient-text'>12+ Blockchains</span> in One Wallet
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
              Manage all your crypto assets from Bitcoin to Ethereum and beyond. SSP Wallet provides
              unified access to multiple blockchain networks.
            </p>
          </motion.div>

          {/* Chains Grid */}
          <div className='mb-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
            {supportedChains.map((chain, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='card card-hover group relative overflow-hidden text-center'
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${chain.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                />

                {/* Content */}
                <div className='relative z-10 p-4'>
                  {/* Chain Logo */}
                  <div className='relative mx-auto mb-3 h-12 w-12'>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${chain.color} rounded-full opacity-20 blur-sm`}
                    />
                    <div className='dark:bg-dark-700 relative flex h-full w-full items-center justify-center rounded-full bg-white shadow-lg'>
                      <span
                        className={`bg-gradient-to-br text-lg font-bold ${chain.color} bg-clip-text text-transparent`}
                      >
                        {chain.symbol}
                      </span>
                    </div>
                  </div>

                  {/* Chain Info */}
                  <h3 className='group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-1 text-sm font-bold transition-colors duration-200'>
                    {chain.name}
                  </h3>

                  <p className='mb-2 text-xs text-gray-500 dark:text-gray-400'>{chain.symbol}</p>

                  <p className='text-xs text-gray-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-gray-300'>
                    {chain.description}
                  </p>
                </div>

                {/* Hover Border Effect */}
                <div
                  className={`group-hover:border-gradient-to-br absolute inset-0 border-2 border-transparent group-hover:${chain.color} rounded-xl opacity-0 transition-colors duration-300 group-hover:opacity-50`}
                />
              </motion.div>
            ))}
          </div>

          {/* Additional Info Section */}
          <motion.div
            variants={headerVariants}
            className='dark:bg-dark-800 rounded-2xl bg-gray-50 p-8'
          >
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              {/* Left Content */}
              <div>
                <h3 className='mb-6 text-3xl font-bold'>
                  More Chains <span className='gradient-text'>Coming Soon</span>
                </h3>

                <p className='mb-6 leading-relaxed text-gray-600 dark:text-gray-300'>
                  We&apos;re constantly adding support for new blockchain networks based on
                  community demand and technological advancement. Your feedback helps us prioritize
                  which chains to add next.
                </p>

                <div className='mb-8 space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary-500 h-2 w-2 rounded-full'></div>
                    <span className='text-sm'>Native Segwit & P2SH Support</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary-500 h-2 w-2 rounded-full'></div>
                    <span className='text-sm'>Account Abstraction (ERC-4337)</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary-500 h-2 w-2 rounded-full'></div>
                    <span className='text-sm'>Cross-chain Asset Management</span>
                  </div>
                </div>

                <Link
                  href='https://docs.google.com/spreadsheets/d/1GUqGeV4hCwjKlxazY1vPY52owrEqXQ1UTchOKfkyS7c'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center font-medium transition-colors duration-200'
                >
                  View Full Asset List
                  <ExternalLink className='ml-2 h-4 w-4' />
                </Link>
              </div>

              {/* Right Content - Visual */}
              <div className='relative'>
                <div className='grid grid-cols-3 gap-4'>
                  {supportedChains.slice(0, 9).map((chain, index) => (
                    <motion.div
                      key={index}
                      className='dark:bg-dark-700 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg'
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: 'easeInOut',
                      }}
                    >
                      <span
                        className={`bg-gradient-to-br text-sm font-bold ${chain.color} bg-clip-text text-transparent`}
                      >
                        {chain.symbol}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Background Glow */}
                <div className='from-primary-500/20 absolute inset-0 -z-10 rounded-full bg-gradient-to-r to-blue-500/20 blur-3xl' />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
