'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle,
  Eye,
  KeyRound,
  Network,
  ShieldCheck,
  Vault,
  Wrench,
} from 'lucide-react'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

const beforeProblems = [
  {
    icon: Wrench,
    title: 'Scattered multisig setups',
    description:
      'Different multisig wallets across different chains, each with its own quirks, signers, and recovery procedures.',
  },
  {
    icon: KeyRound,
    title: 'Custom scripts to glue it together',
    description:
      'Internal tooling for transaction construction, signing coordination, and broadcast — maintained by hand.',
  },
  {
    icon: Eye,
    title: 'No unified audit trail',
    description:
      'Approvals lived in chat threads and shared docs. Reconstructing who signed what required digging.',
  },
  {
    icon: Network,
    title: 'No middle ground in the market',
    description:
      'Custodians and MPC vendors meant trusting a black box. Off-the-shelf multisig tools were Ethereum-only.',
  },
]

const sspBenefits = [
  {
    icon: Vault,
    title: 'M-of-N vaults across every chain we touch',
    description:
      'Bitcoin, Ethereum, Flux, and the EVM L2s — same platform, same mental model, same security guarantees.',
  },
  {
    icon: ShieldCheck,
    title: 'Two devices per signer, no exceptions',
    description:
      'Browser extension and mobile app required for every signature. A single compromised device cannot sign.',
  },
  {
    icon: Eye,
    title: 'Audit trail that holds up',
    description:
      'Every proposal, approval, and rejection logged with the signer and timestamp. Replaces the chat-thread reconstruction.',
  },
  {
    icon: CheckCircle,
    title: 'Self-custody, end to end',
    description:
      'No vendor key share. No MPC infrastructure to trust. If SSP went away tomorrow, our funds remain recoverable from signer seeds.',
  },
]

const factSheet = [
  { label: 'Organization', value: 'Flux Foundation' },
  { label: 'Industry', value: 'Decentralized infrastructure' },
  { label: 'Use case', value: 'Foundation treasury + Fusion bridge multisig' },
  { label: 'Chains', value: 'BTC, ETH, FLUX, EVM L2s' },
  { label: 'Vault model', value: 'M-of-N multisig, two-device per signer' },
  { label: 'Status', value: 'In production' },
]

export function FluxFoundationContent() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })

  return (
    <>
      {/* Hero */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='pointer-events-none absolute inset-0'>
          <div className='bg-primary-400/20 absolute top-20 -left-32 h-96 w-96 rounded-full blur-3xl'></div>
          <div className='absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl'></div>
        </div>

        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl'
          >
            <div className='mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400'>
              <Link
                href='/'
                className='hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
              >
                Home
              </Link>
              <span>/</span>
              <span>Case Studies</span>
              <span>/</span>
              <span className='text-gray-900 dark:text-white'>Flux Foundation</span>
            </div>

            <div className='mb-8 flex flex-col items-start gap-6 sm:flex-row sm:items-center'>
              <div className='dark:bg-dark-800 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-700'>
                <Image
                  src='/flux-symbol.svg'
                  alt='Flux Foundation'
                  width={56}
                  height={56}
                  className='h-14 w-14'
                />
              </div>
              <div>
                <p className='text-primary-600 dark:text-primary-400 mb-1 text-sm font-semibold tracking-wider uppercase'>
                  Case Study
                </p>
                <h1 className='heading-1 text-gray-900 dark:text-white'>
                  Flux Foundation × <span className='gradient-text'>SSP Enterprise</span>
                </h1>
              </div>
            </div>

            <p className='mb-10 max-w-3xl text-xl text-gray-600 md:text-2xl dark:text-gray-400'>
              How the Flux Foundation moved from scattered multisig and custom scripts to a single
              self-custody platform — securing the Fusion bridge and Foundation treasury without
              giving up keys to anyone.
            </p>

            <div className='border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-900/10 rounded-r-xl border-l-4 p-6 md:p-8'>
              <p className='mb-4 text-lg leading-relaxed text-gray-800 italic md:text-xl dark:text-gray-200'>
                &ldquo;We needed full control of our funds, transparency for the community, and no
                black box MPC sitting between us and our own treasury. SSP Enterprise was the first
                platform we found that matches all three — across every chain we actually
                use.&rdquo;
              </p>
              <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                — Tadeas Kmenta, Flux Foundation
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fact sheet */}
      <section className='dark:bg-dark-800 border-y border-gray-200 bg-gray-50 py-12 dark:border-gray-700'>
        <div className='container-custom'>
          <div className='mx-auto max-w-5xl'>
            <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6'>
              {factSheet.map(item => (
                <div key={item.label}>
                  <p className='mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400'>
                    {item.label}
                  </p>
                  <p className='text-sm font-medium text-gray-900 dark:text-white'>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Before */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>
                Before: scattered multisig and custom scripts
              </h2>
              <p className='text-lg text-gray-600 dark:text-gray-400'>
                The Flux Foundation had been managing multi-party signing for years. The problem
                wasn&apos;t a lack of multisig — it was that nothing tied it together across chains,
                and the commercial alternatives all required a tradeoff the team wasn&apos;t willing
                to make.
              </p>
            </motion.div>

            <div className='grid gap-6 md:grid-cols-2'>
              {beforeProblems.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
                  >
                    <div className='mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                      {item.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Decision */}
      <section className='section-padding dark:bg-dark-800 bg-gray-50'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-10 text-center'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>The decision</h2>
              <p className='mx-auto max-w-2xl text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
                The team evaluated the alternatives and grouped them into three buckets. Every
                bucket had a dealbreaker.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
              className='mb-10 grid gap-6 md:grid-cols-3'
            >
              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  Bucket 1
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  MPC custodians
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Fireblocks, BitGo, and similar. Vendor holds part of every key.
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  Not true self-custody.
                </p>
              </div>

              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  Bucket 2
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  Single-chain multisig
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Safe and the like. Ethereum-only, no native UTXO support.
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  We hold Bitcoin and Flux too.
                </p>
              </div>

              <div className='dark:bg-dark-900 rounded-2xl border border-red-200/60 bg-white p-6 dark:border-red-900/40'>
                <p className='mb-2 text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400'>
                  Bucket 3
                </p>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  Bare-bones multisig
                </h3>
                <p className='mb-3 text-sm text-gray-600 dark:text-gray-400'>
                  Wallets without policy engine, analytics, or proper audit trail.
                </p>
                <p className='text-sm font-medium text-red-600 dark:text-red-400'>
                  We&apos;d be back to building tooling ourselves.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className='mx-auto max-w-3xl text-center'
            >
              <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
                SSP Enterprise was the only platform that addressed all three at once: native
                multi-chain (UTXO and EVM), true self-custody with no vendor key share, and a
                built-in policy engine, analytics, and audit trail.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What changed */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12'
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>What changed</h2>
              <p className='text-lg text-gray-600 dark:text-gray-400'>
                One platform, every chain the Foundation interacts with, one consistent signing
                model. The custom scripts are retired. The chat-thread audit trail is replaced by
                attributable on-platform records. Treasury and bridge multisig live side by side
                under the same governance.
              </p>
            </motion.div>

            <div className='grid gap-6 md:grid-cols-2'>
              {sspBenefits.map((item, index) => {
                const Icon = item.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
                  >
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl'>
                      <Icon className='h-5 w-5' />
                    </div>
                    <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                      {item.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{item.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Fusion bridge specifically */}
      <section className='section-padding dark:bg-dark-800 bg-gray-50'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>The Fusion bridge</h2>
              <p className='mb-6 text-lg text-gray-600 dark:text-gray-400'>
                The Fusion bridge is one of the most security-sensitive surfaces the Foundation
                operates — it coordinates value transfer between Flux and other chains, and a single
                signing failure could be catastrophic. It&apos;s also the workload where SSP
                Enterprise&apos;s model pays off most clearly.
              </p>

              <div className='dark:bg-dark-900 mb-6 rounded-2xl border border-gray-200 bg-white p-6 md:p-8 dark:border-gray-700'>
                <ul className='space-y-4'>
                  <li className='flex items-start gap-3'>
                    <CheckCircle className='text-primary-600 dark:text-primary-400 mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        On-chain multisig
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Native multisig on every chain the bridge touches — no smart-contract
                        custodian, no relayer that can stall or front-run.
                      </p>
                    </div>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle className='text-primary-600 dark:text-primary-400 mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        Two-device signing per signer
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Compromising one signer&apos;s laptop or phone is not enough to push a
                        bridge transaction. Both devices, every time.
                      </p>
                    </div>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle className='text-primary-600 dark:text-primary-400 mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        Per-signer policy controls
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Limits and whitelists configured at the org and vault level, enforced before
                        any signature is collected.
                      </p>
                    </div>
                  </li>
                  <li className='flex items-start gap-3'>
                    <CheckCircle className='text-primary-600 dark:text-primary-400 mt-0.5 h-5 w-5 flex-shrink-0' />
                    <div>
                      <p className='font-semibold text-gray-900 dark:text-white'>
                        Auditable end to end
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Every approval and rejection attributed and timestamped. Community
                        accountability without giving up self-custody.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className='border-primary-500 bg-primary-50/50 dark:border-primary-400 dark:bg-primary-900/10 rounded-r-xl border-l-4 p-6 md:p-8'>
                <p className='mb-4 text-lg leading-relaxed text-gray-800 italic md:text-xl dark:text-gray-200'>
                  &ldquo;The Fusion bridge runs on infrastructure we control end to end now. Same
                  security guarantees we have for our own treasury, applied to one of the
                  highest-stakes workflows we operate.&rdquo;
                </p>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  — Tadeas Kmenta, Flux Foundation
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-3xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <ShieldCheck className='text-primary-600 dark:text-primary-400 mx-auto mb-6 h-16 w-16' />
              <h2 className='heading-2 mb-4 text-gray-900 dark:text-white'>
                Same model. Available for your team.
              </h2>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                The platform the Flux Foundation runs the Fusion bridge on is the same platform
                available to any team that wants self-custody multisig without compromise. Free tier
                to start. Custom plans on request.
              </p>
              <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link href='/enterprise' className='btn btn-primary group'>
                  Explore SSP Enterprise
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
                <Link
                  href='https://enterprise.sspwallet.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-secondary'
                >
                  Launch Enterprise App
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
