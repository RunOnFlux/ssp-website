'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  Ban,
  Building2,
  CheckCircle,
  ChevronRight,
  ClipboardCheck,
  Clock,
  DollarSign,
  Eye,
  Gauge,
  Globe,
  KeyRound,
  Layers,
  Lock,
  type LucideIcon,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Snowflake,
  UserCog,
  Users,
  Vault,
  X,
} from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { trackEvent } from '@/lib/gtag'

const DOCS_BASE = 'https://docs.sspwallet.io/enterprise'
const POLICIES_DOCS = `${DOCS_BASE}/policies`

interface FeatureDescriptor {
  icon: LucideIcon
  docsUrl?: string
}

const features: FeatureDescriptor[] = [
  { icon: Vault, docsUrl: `${DOCS_BASE}/creating-vaults` },
  { icon: Users, docsUrl: `${DOCS_BASE}/inviting-members` },
  { icon: Smartphone, docsUrl: `${DOCS_BASE}/getting-started` },
  { icon: Globe, docsUrl: `${DOCS_BASE}/creating-vaults` },
  { icon: ClipboardCheck, docsUrl: `${DOCS_BASE}/transactions` },
  { icon: Eye, docsUrl: `${DOCS_BASE}/transactions` },
]

const policyFeatures: FeatureDescriptor[] = [
  { icon: DollarSign, docsUrl: `${POLICIES_DOCS}#spending-limits` },
  { icon: Ban, docsUrl: `${POLICIES_DOCS}#address-whitelist` },
  { icon: Clock, docsUrl: `${POLICIES_DOCS}#time-lock-delays` },
  { icon: ShieldAlert, docsUrl: `${POLICIES_DOCS}#admin-approval` },
  { icon: UserCog, docsUrl: `${POLICIES_DOCS}#per-signer-spending-limits-vault-policies` },
  { icon: Gauge, docsUrl: `${POLICIES_DOCS}#velocity-tracking` },
  { icon: Snowflake, docsUrl: `${POLICIES_DOCS}#emergency-vault-freeze` },
  { icon: Layers, docsUrl: `${POLICIES_DOCS}#policy-hierarchy-in-practice` },
]

const securityLayerIcons: LucideIcon[] = [Smartphone, KeyRound, Shield, ClipboardCheck, Eye]

const useCaseDocsUrls = [
  `${DOCS_BASE}/use-cases/corporate-treasury`,
  `${DOCS_BASE}/use-cases/dao-treasury`,
  `${DOCS_BASE}/use-cases`,
  `${DOCS_BASE}/use-cases`,
]

const problemIcons: LucideIcon[] = [Lock, Layers, KeyRound]

type ComparisonCell = boolean | 'partial'

const comparisonData: Array<{
  ssp: ComparisonCell
  fireblocks: ComparisonCell
  bitgo: ComparisonCell
  safe: ComparisonCell
}> = [
  { ssp: true, fireblocks: false, bitgo: 'partial', safe: true },
  { ssp: true, fireblocks: true, bitgo: true, safe: false },
  { ssp: true, fireblocks: false, bitgo: 'partial', safe: true },
  { ssp: true, fireblocks: true, bitgo: 'partial', safe: false },
  { ssp: true, fireblocks: 'partial', bitgo: 'partial', safe: false },
  { ssp: true, fireblocks: false, bitgo: false, safe: true },
  { ssp: true, fireblocks: false, bitgo: false, safe: true },
  { ssp: true, fireblocks: false, bitgo: false, safe: true },
]

function ComparisonValue({ value }: { value: ComparisonCell }) {
  const t = useTranslations('Enterprise.comparison.values')
  if (value === true) {
    return <CheckCircle className='mx-auto h-5 w-5 text-green-500' />
  }
  if (value === false) {
    return <X className='mx-auto h-5 w-5 text-red-400' />
  }
  return (
    <span className='text-sm font-medium text-yellow-500 dark:text-yellow-400'>{t('partial')}</span>
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

interface ContactFormState {
  name: string
  email: string
  company: string
  teamSize: string
  useCase: string
  message: string
}

function ContactForm() {
  const t = useTranslations('Enterprise.form')
  const [formData, setFormData] = useState<ContactFormState>({
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
          message: `[SSP ENTERPRISE - CONTACT REQUEST]\n\nCompany: ${formData.company || 'Not specified'}\nTeam Size: ${formData.teamSize || 'Not specified'}\nUse Case: ${formData.useCase || 'Not specified'}\n\nMessage:\n${formData.message || 'No additional message'}`,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'))
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
      const message = err instanceof Error ? err.message : t('errorFallback')
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
          {t('successTitle')}
        </h3>
        <p className='mb-4 text-green-700 dark:text-green-300'>{t('successDescription')}</p>
        <button
          type='button'
          onClick={() => setIsSubmitted(false)}
          className='text-green-600 hover:underline dark:text-green-400'
        >
          {t('successAgain')}
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
            {t('fullNameLabel')}
          </label>
          <input
            type='text'
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder={t('fullNamePlaceholder')}
          />
        </div>

        <div>
          <label
            htmlFor='email'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {t('emailLabel')}
          </label>
          <input
            type='email'
            id='email'
            name='email'
            required
            value={formData.email}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder={t('emailPlaceholder')}
          />
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <div>
          <label
            htmlFor='company'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {t('companyLabel')}
          </label>
          <input
            type='text'
            id='company'
            name='company'
            value={formData.company}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
            placeholder={t('companyPlaceholder')}
          />
        </div>

        <div>
          <label
            htmlFor='teamSize'
            className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            {t('teamSizeLabel')}
          </label>
          <select
            id='teamSize'
            name='teamSize'
            value={formData.teamSize}
            onChange={handleChange}
            className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          >
            <option value=''>{t('teamSizePlaceholder')}</option>
            <option value='2-5'>{t('teamSizeOptions.2-5')}</option>
            <option value='6-10'>{t('teamSizeOptions.6-10')}</option>
            <option value='11-25'>{t('teamSizeOptions.11-25')}</option>
            <option value='25+'>{t('teamSizeOptions.25+')}</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor='useCase'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('useCaseLabel')}
        </label>
        <select
          id='useCase'
          name='useCase'
          value={formData.useCase}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
        >
          <option value=''>{t('useCasePlaceholder')}</option>
          <option value='corporate-treasury'>{t('useCaseOptions.corporate-treasury')}</option>
          <option value='dao-treasury'>{t('useCaseOptions.dao-treasury')}</option>
          <option value='investment-fund'>{t('useCaseOptions.investment-fund')}</option>
          <option value='partnership'>{t('useCaseOptions.partnership')}</option>
          <option value='otc-desk'>{t('useCaseOptions.otc-desk')}</option>
          <option value='mining-operation'>{t('useCaseOptions.mining-operation')}</option>
          <option value='exchange'>{t('useCaseOptions.exchange')}</option>
          <option value='other'>{t('useCaseOptions.other')}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='message'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('messageLabel')}
        </label>
        <textarea
          id='message'
          name='message'
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder={t('messagePlaceholder')}
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
            {t('submitting')}
          </>
        ) : (
          <>
            <Send className='mr-2 h-4 w-4' />
            {t('submit')}
          </>
        )}
      </button>
    </form>
  )
}

export function EnterpriseContent() {
  const t = useTranslations('Enterprise')
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
              {t('heroBadge')}
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>
              {t('heroTitlePart1')}
              <br />
              <span className='gradient-text'>{t('heroTitlePart2')}</span>
            </h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescription')}
            </p>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                href='https://enterprise.sspwallet.com'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => trackEvent('cta_click', { cta_id: 'enterprise_launch_app' })}
                className='btn btn-primary'
              >
                {t('heroLaunchApp')}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
              <Link href='#how-it-works' className='btn btn-secondary'>
                {t('heroHowItWorks')}
                <ChevronRight className='ml-2 h-4 w-4' />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flux Foundation banner */}
      <section className='dark:bg-dark-800 border-y border-gray-200 bg-gray-50 py-10 dark:border-gray-700'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto max-w-4xl'
          >
            <Link
              href='/case-studies/flux-foundation'
              className='hover:border-primary-400/60 dark:hover:border-primary-500/40 group flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-colors duration-300 sm:flex-row sm:items-center sm:gap-6 dark:border-gray-700 dark:bg-gray-900/40'
            >
              <div className='dark:bg-dark-700/60 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2'>
                <Image
                  src='/flux-symbol.svg'
                  alt={t('fluxBanner.imageAlt')}
                  width={40}
                  height={40}
                  className='h-10 w-10'
                />
              </div>
              <div className='flex-1 text-center sm:text-left'>
                <p className='text-primary-600 dark:text-primary-400 mb-0.5 text-xs font-semibold tracking-wider uppercase'>
                  {t('fluxBanner.eyebrow')}
                </p>
                <p className='text-sm text-gray-700 md:text-base dark:text-gray-300'>
                  {t('fluxBanner.description')}
                </p>
              </div>
              <span className='text-primary-600 group-hover:text-primary-700 dark:text-primary-400 inline-flex items-center text-sm font-medium whitespace-nowrap'>
                {t('fluxBanner.cta')}
                <ArrowRight className='ml-1 h-4 w-4 transition-transform group-hover:translate-x-1' />
              </span>
            </Link>
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
            <h2 className='heading-2 mb-4'>{t('problem.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('problem.subtitle')}</p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {problemIcons.map((ProblemIcon, index) => (
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
                  {t(`problem.items.${index}.title`)}
                </h3>
                <p className='mb-4 font-medium text-red-600 dark:text-red-400'>
                  {t(`problem.items.${index}.problem`)}
                </p>
                <ul className='space-y-2'>
                  {[0, 1, 2].map(riskIdx => (
                    <li
                      key={riskIdx}
                      className='flex items-start text-sm text-gray-600 dark:text-gray-400'
                    >
                      <X className='mt-0.5 mr-2 h-4 w-4 flex-shrink-0 text-red-400' />
                      {t(`problem.items.${index}.risks.${riskIdx}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
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
            <h2 className='heading-2 mb-4'>{t('howItWorks.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('howItWorks.subtitle')}</p>
          </motion.div>

          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='space-y-8'
            >
              {[0, 1, 2, 3].map(stepIdx => (
                <motion.div
                  key={stepIdx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: stepIdx * 0.1 }}
                  viewport={{ once: true }}
                  className='flex gap-4'
                >
                  <div className='bg-primary-600 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white'>
                    {stepIdx + 1}
                  </div>
                  <div>
                    <h3 className='mb-1 text-lg font-bold text-gray-900 dark:text-white'>
                      {t(`howItWorks.steps.${stepIdx}.title`)}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t(`howItWorks.steps.${stepIdx}.description`)}
                    </p>
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
                  {t('howItWorks.diagramTitle')}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {t('howItWorks.diagramSubtitle')}
                </p>
              </div>

              <div className='space-y-6'>
                {/* Signer visualization */}
                {['A', 'B', 'C'].map((label, i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${i < 2 ? 'bg-primary-600' : 'bg-gray-400 dark:bg-gray-600'}`}
                    >
                      {label}
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
                          {t('howItWorks.signedLabel')}
                        </span>
                      ) : (
                        <span className='text-xs text-gray-400'>
                          {t('howItWorks.waitingLabel')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                <div className='dark:border-dark-600 border-t border-gray-200 pt-4 text-center'>
                  <span className='bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded-full px-3 py-1 text-sm font-medium'>
                    {t('howItWorks.thresholdLabel')}
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
            <h2 className='heading-2 mb-4'>{t('features.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('features.subtitle')}</p>
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
                  <div className='dark:bg-dark-800 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 hover:shadow-lg dark:border-gray-700'>
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                      <FeatureIcon className='h-6 w-6' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {t(`features.items.${index}.title`)}
                    </h3>
                    <p className='flex-1 text-gray-600 dark:text-gray-400'>
                      {t(`features.items.${index}.description`)}
                    </p>
                    {feature.docsUrl && (
                      <a
                        href={feature.docsUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-4 inline-flex items-center text-sm font-medium'
                      >
                        {t('features.readGuide')}
                        <ArrowRight className='ml-1 h-3.5 w-3.5' />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Policy Engine Section */}
      <section className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-6 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>{t('policy.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('policy.subtitle')}</p>
          </motion.div>

          {/* 3-tier cascade visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-2xl'
          >
            <div className='flex items-center justify-center gap-3 text-sm font-medium sm:gap-4'>
              <div className='dark:bg-dark-800 rounded-xl border border-gray-200 px-4 py-3 text-center sm:px-6 dark:border-gray-700'>
                <Building2 className='text-primary-500 mx-auto mb-1 h-5 w-5' />
                <span className='text-gray-900 dark:text-white'>
                  {t('policy.tiers.organization')}
                </span>
                <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                  {t('policy.tiers.organizationSub')}
                </p>
              </div>
              <ChevronRight className='h-5 w-5 flex-shrink-0 text-gray-400' />
              <div className='dark:bg-dark-800 rounded-xl border border-gray-200 px-4 py-3 text-center sm:px-6 dark:border-gray-700'>
                <Vault className='text-primary-500 mx-auto mb-1 h-5 w-5' />
                <span className='text-gray-900 dark:text-white'>{t('policy.tiers.vault')}</span>
                <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                  {t('policy.tiers.vaultSub')}
                </p>
              </div>
              <ChevronRight className='h-5 w-5 flex-shrink-0 text-gray-400' />
              <div className='dark:bg-dark-800 rounded-xl border border-gray-200 px-4 py-3 text-center sm:px-6 dark:border-gray-700'>
                <UserCog className='text-primary-500 mx-auto mb-1 h-5 w-5' />
                <span className='text-gray-900 dark:text-white'>{t('policy.tiers.signer')}</span>
                <p className='mt-0.5 text-xs text-gray-500 dark:text-gray-400'>
                  {t('policy.tiers.signerSub')}
                </p>
              </div>
            </div>
            <p className='mt-3 text-center text-xs text-gray-400 dark:text-gray-500'>
              {t('policy.tierFooter')}
            </p>
          </motion.div>

          {/* Policy features grid */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={containerVariants}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'
          >
            {policyFeatures.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <motion.div key={index} variants={itemVariants}>
                  <a
                    href={feature.docsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='dark:bg-dark-800 hover:border-primary-300 dark:hover:border-primary-600 group flex h-full flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700'
                  >
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg'>
                      <FeatureIcon className='h-5 w-5' />
                    </div>
                    <h3 className='mb-1.5 text-lg font-bold text-gray-900 dark:text-white'>
                      {t(`policy.items.${index}.title`)}
                    </h3>
                    <p className='flex-1 text-sm text-gray-600 dark:text-gray-400'>
                      {t(`policy.items.${index}.description`)}
                    </p>
                    <span className='text-primary-600 group-hover:text-primary-700 dark:text-primary-400 mt-3 inline-flex items-center text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100'>
                      {t('policy.readMore')}
                      <ArrowRight className='ml-1 h-3 w-3' />
                    </span>
                  </a>
                </motion.div>
              )
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            viewport={{ once: true }}
            className='mx-auto mt-10 max-w-2xl text-center'
          >
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold text-gray-900 dark:text-white'>
                {t('policy.footerStrong')}
              </span>{' '}
              {t('policy.footerSuffix')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mb-16 max-w-3xl text-center'
          >
            <h2 className='heading-2 mb-4'>{t('security.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('security.subtitle')}</p>
          </motion.div>

          <div className='mx-auto max-w-3xl space-y-4'>
            {securityLayerIcons.map((LayerIcon, index) => (
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
                    {t('security.layerLabel', {
                      n: index + 1,
                      name: t(`security.layers.${index}.name`),
                    })}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {t(`security.layers.${index}.description`)}
                  </p>
                </div>
                <ShieldCheck className='h-5 w-5 flex-shrink-0 text-green-500' />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            viewport={{ once: true }}
            className='mx-auto mt-8 max-w-3xl text-center'
          >
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {t('security.footerBefore')}
              <a
                href='https://www.halborn.com/audits/influx-technologies'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary-600 dark:text-primary-400 underline'
              >
                {t('security.footerLink')}
              </a>
              {t('security.footerAfter')}
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
            <h2 className='heading-2 mb-4'>{t('comparison.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('comparison.subtitle')}</p>
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
                    {t('comparison.columns.feature')}
                  </th>
                  <th className='bg-primary-50 dark:bg-primary-900/20 px-4 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                    {t('comparison.columns.ssp')}
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
                      {t(`comparison.rows.${index}`)}
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
                    {t('comparison.annualCostLabel')}
                  </td>
                  <td className='bg-primary-50/50 dark:bg-primary-900/10 px-4 py-3 text-center text-sm font-bold text-green-600 dark:text-green-400'>
                    {t('comparison.annualCostSsp')}
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    {t('comparison.annualCostFireblocks')}
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    {t('comparison.annualCostBitgo')}
                  </td>
                  <td className='px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400'>
                    {t('comparison.annualCostSafe')}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className='mt-3 text-center text-xs text-gray-400 dark:text-gray-500'>
              {t('comparison.footnoteBefore')}
              <Link
                href='#get-started'
                className='text-primary-500 dark:text-primary-400 underline'
              >
                {t('comparison.footnoteLink')}
              </Link>
              {t('comparison.footnoteAfter')}
            </p>

            <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6'>
              <span className='text-sm text-gray-600 dark:text-gray-400'>
                {t('comparison.migrationLabel')}
              </span>
              <div className='flex flex-wrap items-center justify-center gap-3'>
                <a
                  href={`${DOCS_BASE}/migration/from-fireblocks`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center text-sm font-medium'
                >
                  {t('comparison.migrationFireblocks')}
                  <ArrowRight className='ml-1 h-3.5 w-3.5' />
                </a>
                <span className='text-gray-300 dark:text-gray-700'>·</span>
                <a
                  href={`${DOCS_BASE}/migration/from-safe`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center text-sm font-medium'
                >
                  {t('comparison.migrationSafe')}
                  <ArrowRight className='ml-1 h-3.5 w-3.5' />
                </a>
                <span className='text-gray-300 dark:text-gray-700'>·</span>
                <a
                  href={`${DOCS_BASE}/migration/from-bitgo`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center text-sm font-medium'
                >
                  {t('comparison.migrationBitgo')}
                  <ArrowRight className='ml-1 h-3.5 w-3.5' />
                </a>
              </div>
            </div>
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
            <h2 className='heading-2 mb-4'>{t('useCases.title')}</h2>
            <p className='text-lg text-gray-600 dark:text-gray-400'>{t('useCases.subtitle')}</p>
          </motion.div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {useCaseDocsUrls.map((docsUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                viewport={{ once: true }}
                className='dark:bg-dark-800 flex flex-col rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700'
              >
                <h3 className='mb-2 text-lg font-bold text-gray-900 dark:text-white'>
                  {t(`useCases.items.${index}.title`)}
                </h3>
                <p className='mb-4 flex-1 text-sm text-gray-600 dark:text-gray-400'>
                  {t(`useCases.items.${index}.description`)}
                </p>
                <div className='bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 mb-3 rounded-lg px-3 py-2 text-xs font-medium'>
                  {t(`useCases.items.${index}.example`)}
                </div>
                {docsUrl && (
                  <a
                    href={docsUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center text-xs font-medium'
                  >
                    {t('useCases.readPlaybook')}
                    <ArrowRight className='ml-1 h-3 w-3' />
                  </a>
                )}
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
            <h2 className='heading-2 mb-4'>{t('chains.title')}</h2>
            <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>{t('chains.subtitle')}</p>

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

            <p className='mt-4 text-sm text-gray-400 dark:text-gray-500'>{t('chains.footer')}</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id='get-started' className='section-padding dark:bg-dark-900 bg-white'>
        <div className='container-custom'>
          <div className='mx-auto max-w-3xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12 text-center'
            >
              <h2 className='heading-2 mb-4'>{t('contact.title')}</h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
                {t('contact.subtitle')}
              </p>
              <div className='mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row'>
                <Link
                  href='https://enterprise.sspwallet.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() =>
                    trackEvent('cta_click', { cta_id: 'enterprise_launch_app_contact' })
                  }
                  className='btn btn-primary'
                >
                  {t('contact.launchApp')}
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Link>
                <a
                  href='https://calendar.app.google/NZd7n1d6Hjmd7XFD6'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='btn btn-secondary'
                >
                  {t('contact.scheduleCall')}
                </a>
              </div>
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
                  <strong>{t('contact.directContactStrong')}</strong>
                  {t('contact.directContactBefore')}
                  <a href='mailto:tadeas@sspwallet.com' className='underline hover:no-underline'>
                    tadeas@sspwallet.com
                  </a>
                  {t('contact.directContactBetween')}
                  <a
                    href='https://twitter.com/TadeasKmenta'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline hover:no-underline'
                  >
                    @TadeasKmenta
                  </a>
                  {t('contact.directContactAfter')}
                </p>
              </div>
              <ContactForm />
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
            <h2 className='heading-2 mb-4'>{t('finalCta.title')}</h2>
            <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
              {t('finalCta.description')}
            </p>
            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Link
                href='https://enterprise.sspwallet.com'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() => trackEvent('cta_click', { cta_id: 'enterprise_launch_app_footer' })}
                className='btn btn-primary'
              >
                {t('finalCta.launchApp')}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
              <Link href='/download' className='btn btn-secondary'>
                {t('finalCta.downloadWallet')}
              </Link>
              <Link href='/features' className='btn btn-secondary'>
                {t('finalCta.exploreFeatures')}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
