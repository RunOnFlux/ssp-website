import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Eye,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Mail,
  Send,
  Shield,
  ShieldCheck,
  Smartphone,
  Users,
  Vault,
  X,
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const features = [
  {
    title: 'M-of-N Multisig Vaults',
    description:
      'Configure any signing threshold for your team. 2-of-3, 3-of-5, or any combination that fits your governance model.',
    icon: Vault,
  },
  {
    title: 'Role-Based Access',
    description:
      'Owner, Admin, Member, and Viewer roles. Control who can propose, sign, or simply observe transactions.',
    icon: Users,
  },
  {
    title: 'Two-Device Signing',
    description:
      'Every signer uses both a browser extension and a mobile app. Two keys per person, M-of-N across your team.',
    icon: Smartphone,
  },
  {
    title: 'Multi-Chain Support',
    description:
      'Bitcoin, Ethereum, Litecoin, Dogecoin, Flux, Polygon, BSC, Base, Avalanche, and more. One platform for all chains.',
    icon: Globe,
  },
  {
    title: 'Transaction Proposals',
    description:
      'Propose transactions with full details. Team members review, approve, or reject. Broadcast only when threshold is met.',
    icon: ClipboardCheck,
  },
  {
    title: 'Complete Audit Trail',
    description:
      'Every action logged permanently. Member changes, vault operations, transaction approvals — full accountability.',
    icon: Eye,
  },
]

const securityLayers = [
  {
    layer: 'Device Security',
    description: 'OS-level security, biometric auth, secure enclaves on mobile',
    icon: Smartphone,
  },
  {
    layer: 'Dual-Device 2FA',
    description: 'Browser extension + mobile app required for every signature',
    icon: KeyRound,
  },
  {
    layer: 'On-Chain Multisig',
    description: 'Native Bitcoin multisig and EVM smart contract verification',
    icon: Shield,
  },
  {
    layer: 'Business Policies',
    description: 'Spending limits, approval workflows, and risk controls',
    icon: ClipboardCheck,
  },
  {
    layer: 'Audit & Compliance',
    description: 'Immutable logs, login tracking, and compliance reporting',
    icon: Eye,
  },
]

const useCases = [
  {
    title: 'Corporate Treasury',
    description: 'Multi-signature approval for company funds. CEO + CFO + Board = 2-of-3.',
    example: '3 executives, 2 required to sign',
  },
  {
    title: 'DAO Treasury',
    description: 'Decentralized decision-making with on-chain security for community funds.',
    example: '5 council members, 3 required',
  },
  {
    title: 'Investment Funds',
    description: 'Institutional-grade self-custody for fund managers and limited partners.',
    example: 'Fund manager + compliance + LP',
  },
  {
    title: 'Partnerships & JVs',
    description: 'Shared control between partners with clear accountability and audit trails.',
    example: 'Equal control, transparent ops',
  },
]

const comparisonData = [
  {
    feature: 'True Self-Custody',
    ssp: true,
    fireblocks: false,
    bitgo: 'partial',
    safe: true,
  },
  {
    feature: 'Multi-Chain',
    ssp: true,
    fireblocks: true,
    bitgo: true,
    safe: false,
  },
  {
    feature: 'On-Chain Multisig',
    ssp: true,
    fireblocks: false,
    bitgo: 'partial',
    safe: true,
  },
  {
    feature: 'Mobile Signing',
    ssp: true,
    fireblocks: 'partial',
    bitgo: 'partial',
    safe: false,
  },
  {
    feature: 'Open Source',
    ssp: true,
    fireblocks: false,
    bitgo: false,
    safe: true,
  },
  {
    feature: 'No Vendor Lock-in',
    ssp: true,
    fireblocks: false,
    bitgo: false,
    safe: true,
  },
  {
    feature: 'Affordable',
    ssp: true,
    fireblocks: false,
    bitgo: false,
    safe: true,
  },
]

function ComparisonValue({ value }) {
  if (value === true) {
    return <CheckCircle className='mx-auto h-5 w-5 text-green-500' />
  }
  if (value === false) {
    return <X className='mx-auto h-5 w-5 text-red-400' />
  }
  return (
    <span className='text-sm font-medium text-yellow-500 dark:text-yellow-400'>Partial</span>
  )
}

const supportedChains = [
  'Bitcoin',
  'Ethereum',
  'Litecoin',
  'Dogecoin',
  'Bitcoin Cash',
  'Ravencoin',
  'Zcash',
  'Flux',
  'Polygon',
  'BSC',
  'Avalanche',
  'Base',
]

function EarlyAccessForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    teamSize: '',
    useCase: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('https://relay.ssp.runonflux.io/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-challenge': 'ssp',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `[SSP ENTERPRISE - EARLY ACCESS REQUEST]\n\nCompany: ${formData.company || 'Not specified'}\nTeam Size: ${formData.teamSize || 'Not specified'}\nUse Case: ${formData.useCase || 'Not specified'}\n\nMessage:\n${formData.message || 'No additional message'}`,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send request')
      }

      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        company: '',
        teamSize: '',
        useCase: '',
        message: '',
      })
    } catch (err) {
      setError(err.message || 'Failed to send request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/20'
      >
        <CheckCircle className='mx-auto mb-4 h-16 w-16 text-green-500' />
        <h3 className='mb-2 text-xl font-semibold text-green-900 dark:text-green-100'>
          Request Received!
        </h3>
        <p className='mb-4 text-green-700 dark:text-green-300'>
          Thank you for your interest in SSP Enterprise. We'll be in touch soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className='text-green-600 hover:underline dark:text-green-400'
        >
          Submit another request
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label
            htmlFor='name'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Full Name *
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder='Your full name'
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Email Address *
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder='your.email@company.com'
          />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label
            htmlFor='company'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Company / Organization
          </label>
          <input
            type='text'
            id='company'
            name='company'
            value={formData.company}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder='Your company name'
          />
        </div>

        <div>
          <label
            htmlFor='teamSize'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Team Size
          </label>
          <select
            id='teamSize'
            name='teamSize'
            value={formData.teamSize}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          >
            <option value=''>Select team size</option>
            <option value='2-5'>2-5 signers</option>
            <option value='6-10'>6-10 signers</option>
            <option value='11-25'>11-25 signers</option>
            <option value='25+'>25+ signers</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor='useCase'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Primary Use Case
        </label>
        <select
          id='useCase'
          name='useCase'
          value={formData.useCase}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
        >
          <option value=''>Select use case</option>
          <option value='corporate-treasury'>Corporate Treasury</option>
          <option value='dao-treasury'>DAO Treasury</option>
          <option value='investment-fund'>Investment Fund</option>
          <option value='partnership'>Partnership / Joint Venture</option>
          <option value='otc-desk'>OTC Desk</option>
          <option value='mining-operation'>Mining Operation</option>
          <option value='exchange'>Exchange</option>
          <option value='other'>Other</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='message'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Tell Us About Your Needs
        </label>
        <textarea
          id='message'
          name='message'
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='What challenges are you facing with crypto custody? What features matter most to your team?'
        />
      </div>

      {error && (
        <div className='flex items-center rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300'>
          <AlertTriangle className='mr-2 h-5 w-5 flex-shrink-0' />
          <span className='text-sm'>{error}</span>
        </div>
      )}

      <button
        type='submit'
        disabled={isSubmitting}
        className='bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 inline-flex w-full items-center justify-center rounded-lg px-6 py-3 font-medium text-white transition-colors'
      >
        {isSubmitting ? (
          <>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
            Sending Request...
          </>
        ) : (
          <>
            <Send className='mr-2 h-4 w-4' />
            Request Early Access
          </>
        )}
      </button>
    </form>
  )
}

export default function Enterprise() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <>
      <Head>
        <title>SSP Enterprise | Self-Custody Multisig for Business</title>
        <meta
          name='description'
          content='SSP Enterprise: self-custody M-of-N multisig vaults for businesses. Manage your organization&#x27;s crypto with role-based access, two-device signing, and complete audit trails. No custodians. No MPC. Your keys, your rules.'
        />
        <meta
          name='keywords'
          content='enterprise crypto custody, business multisig wallet, self-custody enterprise, M-of-N multisig, crypto treasury management, DAO treasury, corporate crypto, multisig vault'
        />

        {/* Open Graph */}
        <meta
          property='og:title'
          content='SSP Enterprise | Self-Custody Multisig for Business'
        />
        <meta
          property='og:description'
          content='M-of-N multisig vaults for businesses. Two-device signing, role-based access, complete audit trails. No custodians. Your keys, your rules.'
        />
        <meta property='og:url' content='https://sspwallet.io/enterprise' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta
          property='og:image:alt'
          content='SSP Enterprise - Self-Custody Multisig for Business'
        />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta
          name='twitter:title'
          content='SSP Enterprise | Self-Custody Multisig for Business'
        />
        <meta
          name='twitter:description'
          content='M-of-N multisig vaults for businesses. Two-device signing, role-based access, complete audit trails. No custodians.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />
        <meta
          name='twitter:image:alt'
          content='SSP Enterprise - Self-Custody Multisig for Business'
        />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/enterprise' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>

        {/* Animated gradient orbs */}
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
            className='mx-auto max-w-4xl text-center'
          >
            <div className='bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 mb-6 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium'>
              <Building2 className='mr-2 h-4 w-4' />
              SSP Enterprise
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>
              Self-Custody
              <br />
              <span className='gradient-text'>for Business</span>
            </h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              M-of-N multisig vaults for your organization. Every signer uses two devices —
              browser extension and mobile app. No custodians. No MPC. No single point of failure.
            </p>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link href='#early-access' className='btn btn-primary'>
                Request Early Access
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
              <Link href='#how-it-works' className='btn btn-secondary'>
                How It Works
                <ChevronRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>The Problem</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Businesses holding crypto today face impossible trade-offs
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                title: 'Custodial Solutions',
                problem: 'Trust a third party with your keys',
                risks: [
                  'Counterparty risk (FTX, Celsius)',
                  'Account freezes without warning',
                  'Vendor lock-in and high fees',
                ],
                icon: Lock,
              },
              {
                title: 'MPC Providers',
                problem: 'Key shards on vendor servers',
                risks: [
                  'Vendor shuts down, you scramble',
                  'Cannot verify their infrastructure',
                  'Still a trust dependency',
                ],
                icon: Layers,
              },
              {
                title: 'Single Hardware Wallet',
                problem: 'One person, one device',
                risks: [
                  'Key person risk',
                  'No team governance',
                  'Lost device = lost funds',
                ],
                icon: KeyRound,
              },
            ].map((item, index) => {
              const ProblemIcon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-800 rounded-2xl border border-red-200/50 bg-white p-8 dark:border-red-900/30'
                >
                  <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'>
                    <ProblemIcon className='h-6 w-6' />
                  </div>
                  <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                    {item.title}
                  </h3>
                  <p className='mb-4 font-medium text-red-600 dark:text-red-400'>{item.problem}</p>
                  <ul className='space-y-2'>
                    {item.risks.map((risk, i) => (
                      <li
                        key={i}
                        className='flex items-start text-sm text-gray-600 dark:text-gray-400'
                      >
                        <X className='mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-red-400' />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='how-it-works' className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>How It Works</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              True self-custody at enterprise scale — no compromises
            </p>
          </motion.div>

          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {[
                {
                  step: '1',
                  title: 'Create Your Organization',
                  description:
                    'Set up your organization using your SSP Identity — a cryptographic proof derived from your devices, not just an email.',
                },
                {
                  step: '2',
                  title: 'Invite Your Team',
                  description:
                    'Add team members by their SSP Identity. Assign roles: Owner, Admin, Member, or Viewer. Every member needs SSP Wallet + SSP Key.',
                },
                {
                  step: '3',
                  title: 'Create Multisig Vaults',
                  description:
                    'Configure M-of-N vaults for different purposes — operations, treasury, payroll. Choose which signers are required.',
                },
                {
                  step: '4',
                  title: 'Sign Together',
                  description:
                    'Propose transactions through the web app. Each required signer approves with both their browser extension and mobile app. Broadcast when threshold is met.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='flex gap-4'
                >
                  <div className='bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'>
                    {item.step}
                  </div>
                  <div>
                    <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>
                      {item.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-700'
            >
              <div className='mb-6 text-center'>
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  Signing Architecture
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Every signature requires two devices per signer
                </p>
              </div>

              <div className='space-y-6'>
                {/* Signer visualization */}
                {['Signer A', 'Signer B', 'Signer C'].map((signer, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${i < 2 ? 'bg-primary-600' : 'bg-gray-400 dark:bg-gray-600'}`}
                    >
                      {signer.split(' ')[1]}
                    </div>
                    <div className='flex flex-1 items-center gap-2'>
                      <div
                        className={`flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium ${i < 2 ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300' : 'border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                      >
                        SSP Wallet
                      </div>
                      <span className='text-xs text-gray-400'>+</span>
                      <div
                        className={`flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium ${i < 2 ? 'bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-300' : 'border-gray-200 bg-gray-100 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
                      >
                        SSP Key
                      </div>
                    </div>
                    <div className='w-16 text-right'>
                      {i < 2 ? (
                        <span className='text-xs font-medium text-green-600 dark:text-green-400'>
                          Signed
                        </span>
                      ) : (
                        <span className='text-xs text-gray-400'>Waiting</span>
                      )}
                    </div>
                  </div>
                ))}

                <div className='dark:border-dark-600 border-t border-gray-200 pt-4 text-center'>
                  <span className='bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full px-3 py-1 text-sm font-medium'>
                    2 of 3 threshold met — ready to broadcast
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>Enterprise Features</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Everything your organization needs for secure crypto management
            </p>
          </motion.div>

          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
            className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'
          >
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <div className='dark:bg-dark-800 h-full rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg dark:border-gray-700'>
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                      <FeatureIcon className='h-6 w-6' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>5-Layer Security</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Defense in depth — every layer must be compromised for a breach
            </p>
          </motion.div>

          <div className='mx-auto max-w-3xl space-y-4'>
            {securityLayers.map((layer, index) => {
              const LayerIcon = layer.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-800 flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700'
                >
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'>
                    <LayerIcon className='h-5 w-5' />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900 dark:text-white'>
                      Layer {index + 1}: {layer.layer}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{layer.description}</p>
                  </div>
                  <ShieldCheck className='h-5 w-5 flex-shrink-0 text-green-500' />
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mt-8 max-w-3xl text-center'
          >
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              SSP Wallet is open source and{' '}
              <a
                href='https://www.halborn.com/audits/influx-technologies'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-600 dark:text-primary-400 underline'
              >
                audited by Halborn
              </a>
              . Verify the code yourself.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>How We Compare</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              SSP Enterprise vs. the alternatives
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto max-w-4xl overflow-x-auto'
          >
            <table className='w-full min-w-[600px]'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='px-4 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Feature
                  </th>
                  <th className='bg-primary-50 dark:bg-primary-900/20 px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                    SSP Enterprise
                  </th>
                  <th className='px-4 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400'>
                    Fireblocks
                  </th>
                  <th className='px-4 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400'>
                    BitGo
                  </th>
                  <th className='px-4 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400'>
                    Safe
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {comparisonData.map((row, index) => (
                  <tr key={index}>
                    <td className='px-4 py-3 text-sm font-medium text-gray-900 dark:text-white'>
                      {row.feature}
                    </td>
                    <td className='bg-primary-50/50 dark:bg-primary-900/10 px-4 py-3 text-center'>
                      <ComparisonValue value={row.ssp} />
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <ComparisonValue value={row.fireblocks} />
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <ComparisonValue value={row.bitgo} />
                    </td>
                    <td className='px-4 py-3 text-center'>
                      <ComparisonValue value={row.safe} />
                    </td>
                  </tr>
                ))}
                <tr className='border-t-2 border-gray-300 dark:border-gray-600'>
                  <td className='px-4 py-3 text-sm font-bold text-gray-900 dark:text-white'>
                    Annual Cost
                  </td>
                  <td className='bg-primary-50/50 dark:bg-primary-900/10 px-4 py-3 text-center text-sm font-bold text-green-600 dark:text-green-400'>
                    Free*
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    $100K+
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    $50K+
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    Gas fees
                  </td>
                </tr>
              </tbody>
            </table>
            <p className='mt-3 text-center text-xs text-gray-400 dark:text-gray-500'>
              * Open-source wallet is free. Enterprise platform pricing scales with your
              organization.{' '}
              <Link
                href='#early-access'
                className='text-primary-500 dark:text-primary-400 underline'
              >
                Get in touch
              </Link>{' '}
              for tailored plans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>Built For</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>
              Any organization that holds crypto and needs team-based signing
            </p>
          </motion.div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                viewport={{ once: true }}
                className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
              >
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  {useCase.title}
                </h3>
                <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
                  {useCase.description}
                </p>
                <div className='bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 rounded-lg px-3 py-2 text-xs font-medium'>
                  {useCase.example}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>Multi-Chain Native</h2>
            <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
              One platform for all your chains — UTXO and EVM
            </p>

            <div className='flex flex-wrap justify-center gap-3'>
              {supportedChains.map((chain, index) => (
                <motion.span
                  key={chain}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-700 dark:border-dark-600 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300'
                >
                  {chain}
                </motion.span>
              ))}
            </div>

            <p className='mt-4 text-sm text-gray-400 dark:text-gray-500'>
              More chains added regularly. All ERC-20 tokens supported on EVM chains.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Early Access Form */}
      <section id='early-access' className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-3xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12 text-center'
            >
              <h2 className='heading-2 mb-4'>Request Early Access</h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
                Be among the first organizations to use SSP Enterprise. Early adopters help shape the
                product and get priority onboarding.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 lg:p-12 dark:border-gray-700'
            >
              <div className='border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20 mb-6 rounded-lg border p-4'>
                <p className='text-primary-800 dark:text-primary-200 text-sm'>
                  <strong>Prefer direct contact?</strong> Reach out to{' '}
                  <a
                    href='mailto:tadeas@sspwallet.com'
                    className='underline hover:no-underline'
                  >
                    tadeas@sspwallet.com
                  </a>{' '}
                  or DM{' '}
                  <a
                    href='https://twitter.com/TadeasKmenta'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline hover:no-underline'
                  >
                    @TadeasKmenta
                  </a>{' '}
                  on X.
                </p>
              </div>
              <EarlyAccessForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto max-w-3xl text-center'
          >
            <ShieldCheck className='text-primary-600 dark:text-primary-400 mx-auto mb-6 h-16 w-16' />
            <h2 className='heading-2 mb-4'>Your Keys. Your Rules.</h2>
            <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
              SSP Enterprise gives your organization the security of self-custody with the governance
              of enterprise software. No custodians. No middlemen. No compromises.
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link href='#early-access' className='btn btn-primary'>
                <Mail className='mr-2 h-4 w-4' />
                Request Early Access
              </Link>
              <Link href='/download' className='btn btn-secondary'>
                Download SSP Wallet
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
