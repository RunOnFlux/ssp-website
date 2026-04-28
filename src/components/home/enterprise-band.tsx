'use client'

import { motion, type Variants } from 'framer-motion'
import { ArrowRight, Building2, ClipboardCheck, ShieldCheck, Vault } from 'lucide-react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

const enterpriseHighlights = [
  {
    icon: Vault,
    title: 'M-of-N Multisig Vaults',
    description: 'Configure any signing threshold — 2-of-3, 3-of-5, whatever fits your governance.',
  },
  {
    icon: ClipboardCheck,
    title: 'Transaction Policy Engine',
    description: 'Spending limits, address whitelists, time-locks, admin approvals — 14+ controls.',
  },
  {
    icon: ShieldCheck,
    title: 'No Custodian. No MPC.',
    description:
      'Self-custody at enterprise scale. Two-device signing per signer, on-chain verified.',
  },
]

export function EnterpriseBand() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  }

  return (
    <section className='section-padding from-primary-50/40 dark:from-dark-800 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden bg-linear-to-br via-white to-blue-50/40'>
      {/* Subtle grid pattern */}
      <div className='absolute inset-0 opacity-[0.07] dark:opacity-10'>
        <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
          <defs>
            <pattern id='enterpriseGrid' width='48' height='48' patternUnits='userSpaceOnUse'>
              <path
                d='M 48 0 L 0 0 0 48'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                className='text-gray-400 dark:text-gray-500'
              />
            </pattern>
          </defs>
          <rect width='100%' height='100%' fill='url(#enterpriseGrid)' />
        </svg>
      </div>

      {/* Ambient glow */}
      <div className='bg-primary-500/10 pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl' />

      <div className='container-custom relative z-10'>
        <motion.div
          ref={ref}
          initial='hidden'
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className='mx-auto mb-12 max-w-3xl text-center'>
            <div className='border-primary-300/60 bg-primary-100/80 text-primary-800 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300 mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium backdrop-blur-sm'>
              <Building2 className='mr-2 h-4 w-4' />
              For Teams &amp; Businesses
            </div>

            <h2 className='mb-6 text-4xl font-bold text-balance text-gray-900 md:text-5xl dark:text-white'>
              Running treasury for a team?
              <br />
              <span className='gradient-text'>Meet SSP Enterprise.</span>
            </h2>

            <p className='mx-auto max-w-2xl text-lg text-gray-600 md:text-xl dark:text-gray-300'>
              Your team holds the keys. Your team signs. SSP Enterprise handles the coordination —
              proposals, policies, and the audit trail your CFO will actually want.
            </p>
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={containerVariants}
            className='mx-auto mb-12 grid max-w-5xl gap-6 md:grid-cols-3'
          >
            {enterpriseHighlights.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className='hover:border-primary-400/60 dark:hover:border-primary-500/40 dark:bg-dark-800/60 rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-colors duration-300 dark:border-white/10'
                >
                  <div className='bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl'>
                    <Icon className='h-5 w-5' />
                  </div>
                  <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                    {item.title}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>{item.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Social proof — Flux Foundation case study */}
          <motion.div variants={itemVariants} className='mx-auto mb-10 max-w-3xl'>
            <Link
              href='/case-studies/flux-foundation'
              className='hover:border-primary-400/60 dark:hover:border-primary-500/40 dark:bg-dark-800/60 group block rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm transition-colors duration-300 md:p-8 dark:border-white/10'
            >
              <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
                <div className='dark:bg-dark-700/60 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2'>
                  <Image
                    src='/flux-symbol.svg'
                    alt='Flux Foundation'
                    width={48}
                    height={48}
                    className='h-12 w-12'
                  />
                </div>
                <div className='flex-1 text-center sm:text-left'>
                  <p className='text-primary-700 dark:text-primary-300 mb-1 text-xs font-semibold tracking-wider uppercase'>
                    Flux Foundation
                  </p>
                  <p className='mb-3 text-base text-gray-700 md:text-lg dark:text-gray-200'>
                    Uses SSP Enterprise to secure the{' '}
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      Fusion bridge
                    </span>{' '}
                    and manage Foundation treasury with multi-party signing.
                  </p>
                  <span className='text-primary-600 group-hover:text-primary-700 dark:text-primary-400 inline-flex items-center text-sm font-medium'>
                    Read the case study
                    <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className='flex flex-col items-center justify-center gap-4 sm:flex-row'
          >
            <Link href='/enterprise' className='btn btn-primary group'>
              Explore SSP Enterprise
              <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
            </Link>
            <Link
              href='https://enterprise.sspwallet.com'
              target='_blank'
              rel='noopener noreferrer'
              className='dark:bg-dark-800/60 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white/80 px-6 py-3 text-sm font-medium text-gray-800 transition-colors duration-200 hover:bg-gray-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10'
            >
              Launch Enterprise App
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
