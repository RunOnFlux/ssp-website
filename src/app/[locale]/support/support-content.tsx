'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Book,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Github,
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
  Shield,
  Smartphone,
  Star,
  Twitter,
  Users,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ComponentType, ReactNode, SVGProps } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'

type FaqCategoryKey = 'gettingStarted' | 'security' | 'technical'

type FaqRichKind = 'plain' | 'beforeLinkAfter' | 'codeLink'

interface FaqDescriptor {
  index: number
  kind: FaqRichKind
  /** Used for `beforeLinkAfter` to wire up the link href */
  href?: string
}

interface FaqCategoryDescriptor {
  key: FaqCategoryKey
  icon: ComponentType<SVGProps<SVGSVGElement>>
  faqs: FaqDescriptor[]
}

const faqCategoryDescriptors: FaqCategoryDescriptor[] = [
  {
    key: 'gettingStarted',
    icon: Book,
    faqs: [
      { index: 0, kind: 'plain' },
      { index: 1, kind: 'plain' },
      { index: 2, kind: 'plain' },
      { index: 3, kind: 'plain' },
      {
        index: 4,
        kind: 'beforeLinkAfter',
        href: 'https://docs.google.com/spreadsheets/d/1GUqGeV4hCwjKlxazY1vPY52owrEqXQ1UTchOKfkyS7c',
      },
      { index: 5, kind: 'plain' },
      { index: 6, kind: 'plain' },
      { index: 7, kind: 'plain' },
      { index: 8, kind: 'plain' },
      { index: 9, kind: 'plain' },
      { index: 10, kind: 'plain' },
      { index: 11, kind: 'plain' },
      { index: 12, kind: 'plain' },
      { index: 13, kind: 'plain' },
      { index: 14, kind: 'plain' },
    ],
  },
  {
    key: 'security',
    icon: Shield,
    faqs: [
      { index: 0, kind: 'plain' },
      { index: 1, kind: 'plain' },
      { index: 2, kind: 'plain' },
      { index: 3, kind: 'plain' },
      { index: 4, kind: 'plain' },
      { index: 5, kind: 'codeLink' },
      {
        index: 6,
        kind: 'beforeLinkAfter',
        href: 'https://keys.openpgp.org/search?q=security%40runonflux.io',
      },
      { index: 7, kind: 'plain' },
    ],
  },
  {
    key: 'technical',
    icon: Smartphone,
    faqs: [
      { index: 0, kind: 'plain' },
      { index: 1, kind: 'plain' },
      { index: 2, kind: 'plain' },
      { index: 3, kind: 'plain' },
      { index: 4, kind: 'plain' },
      { index: 5, kind: 'plain' },
      { index: 6, kind: 'plain' },
      { index: 7, kind: 'plain' },
      { index: 8, kind: 'plain' },
      { index: 9, kind: 'plain' },
      { index: 10, kind: 'plain' },
      { index: 11, kind: 'plain' },
      { index: 12, kind: 'plain' },
      { index: 13, kind: 'plain' },
      { index: 14, kind: 'plain' },
    ],
  },
]

interface SupportLinkDescriptor {
  key: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  url: string
  internal?: boolean
}

interface SupportChannelDescriptor {
  key: 'documentation' | 'community' | 'direct'
  icon: ComponentType<SVGProps<SVGSVGElement>>
  links: SupportLinkDescriptor[]
}

const supportChannels: SupportChannelDescriptor[] = [
  {
    key: 'documentation',
    icon: Book,
    links: [
      { key: 'completeDocs', icon: FileText, url: 'https://docs.sspwallet.io' },
      { key: 'setupGuide', icon: Book, url: '/guide', internal: true },
      { key: 'featureDocs', icon: Star, url: '/features', internal: true },
    ],
  },
  {
    key: 'community',
    icon: Users,
    links: [
      { key: 'github', icon: Github, url: 'https://github.com/RunOnFlux/ssp-wallet' },
      { key: 'discord', icon: MessageCircle, url: 'https://discord.gg/runonflux' },
      { key: 'twitter', icon: Twitter, url: 'https://twitter.com/sspwallet_io' },
    ],
  },
  {
    key: 'direct',
    icon: Mail,
    links: [
      { key: 'ticketSystem', icon: ExternalLink, url: 'https://support.runonflux.io' },
      { key: 'email', icon: Mail, url: 'mailto:support@sspwallet.io' },
    ],
  },
]

interface FaqAnswerProps {
  category: FaqCategoryKey
  descriptor: FaqDescriptor
}

function FaqAnswer({ category, descriptor }: FaqAnswerProps) {
  const t = useTranslations(`Support.faqCategories.${category}.items.${descriptor.index}`)

  const linkClass =
    'text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
  const codeClass = 'rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'

  let body: ReactNode
  if (descriptor.kind === 'plain') {
    body = t('answer')
  } else if (descriptor.kind === 'beforeLinkAfter') {
    body = (
      <>
        {t('answerBefore')}
        <a href={descriptor.href} target='_blank' rel='noopener noreferrer' className={linkClass}>
          {t('answerLink')}
        </a>
        {t('answerAfter')}
      </>
    )
  } else {
    // codeLink
    body = (
      <>
        {t('answerIntro')}
        <a
          href='https://github.com/RunOnFlux/ssp-wallet/releases'
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          {t('answerLink1')}
        </a>
        {t('answerMiddle1')}
        <a
          href='https://keys.openpgp.org/search?q=security%40runonflux.io'
          target='_blank'
          rel='noopener noreferrer'
          className={linkClass}
        >
          {t('answerLink2')}
        </a>
        {t('answerMiddle2')}
        <code className={codeClass}>{t('answerCode1')}</code>
        {t('answerMiddle3')}
        <code className={codeClass}>{t('answerCode2')}</code>
        {t('answerMiddle4')}
        <code className={codeClass}>{t('answerCode3')}</code>
        {t('answerOutro')}
      </>
    )
  }

  return <p className='leading-relaxed text-gray-600 dark:text-gray-400'>{body}</p>
}

interface FaqQuestionProps {
  category: FaqCategoryKey
  descriptor: FaqDescriptor
  categoryIndex: number
  index: number
}

function FAQItem({ category, descriptor, categoryIndex, index }: FaqQuestionProps) {
  const t = useTranslations(`Support.faqCategories.${category}.items.${descriptor.index}`)
  const [isOpen, setIsOpen] = useState(false)
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.3, delay: (categoryIndex * 2 + index) * 0.05 }}
      className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='dark:hover:bg-dark-700 flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50'
        aria-expanded={isOpen}
        aria-controls={`faq-content-${categoryIndex}-${index}`}
        id={`faq-button-${categoryIndex}-${index}`}
      >
        <span className='pr-4 font-semibold text-gray-900 dark:text-white'>{t('question')}</span>
        {isOpen ? (
          <ChevronUp className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        ) : (
          <ChevronDown className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        )}
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`px-6 ${isOpen ? 'pb-6' : ''} overflow-hidden`}
        id={`faq-content-${categoryIndex}-${index}`}
        role='region'
        aria-labelledby={`faq-button-${categoryIndex}-${index}`}
        style={!isOpen ? { height: 0, paddingBottom: 0 } : {}}
      >
        <FaqAnswer category={category} descriptor={descriptor} />
      </motion.div>
    </motion.div>
  )
}

interface FormData {
  email: string
  type: string
  subject: string
  description: string
}

function ContactForm() {
  const t = useTranslations('Support.form')
  const [formData, setFormData] = useState<FormData>({
    email: '',
    type: 'Question',
    subject: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('https://relay.ssp.runonflux.io/v1/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-challenge': 'ssp',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'))
      }

      setIsSubmitted(true)
      setFormData({ email: '', type: 'Question', subject: '', description: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : t('errorFallback'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

      <div>
        <label
          htmlFor='type'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('typeLabel')}
        </label>
        <select
          id='type'
          name='type'
          required
          value={formData.type}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
        >
          <option value='Question'>{t('typeOptions.Question')}</option>
          <option value='Incident'>{t('typeOptions.Incident')}</option>
          <option value='Problem'>{t('typeOptions.Problem')}</option>
          <option value='Feature Request'>{t('typeOptions.Feature Request')}</option>
          <option value='Incident'>{t('typeOptions.Bug Report')}</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='subject'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('subjectLabel')}
        </label>
        <input
          type='text'
          id='subject'
          name='subject'
          required
          value={formData.subject}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder={t('subjectPlaceholder')}
        />
      </div>

      <div>
        <label
          htmlFor='description'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('descriptionLabel')}
        </label>
        <textarea
          id='description'
          name='description'
          required
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder={t('descriptionPlaceholder')}
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

const CATEGORY_DOM_IDS: Record<FaqCategoryKey, string> = {
  gettingStarted: 'getting-started',
  security: 'security--privacy',
  technical: 'technical-support',
}

export function SupportContent() {
  const t = useTranslations('Support')
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <>
      {/* Hero Section */}
      <section className='section-padding dark:bg-dark-900 relative overflow-hidden bg-white'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              <HelpCircle className='mr-2 h-4 w-4' />
              {t('heroBadge')}
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>{t('heroTitle')}</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescription')}
            </p>

            <div className='mx-auto grid max-w-4xl gap-4 sm:gap-6 md:grid-cols-3'>
              <a
                href='https://docs.sspwallet.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-blue-600'
              >
                <Book className='mr-3 h-6 w-6 flex-shrink-0 text-blue-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    {t('quickLinks.docsTitle')}
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                    {t('quickLinks.docsSubtitle')}
                  </p>
                </div>
              </a>

              <a
                href='https://discord.gg/runonflux'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-green-600'
              >
                <Users className='mr-3 h-6 w-6 flex-shrink-0 text-green-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    {t('quickLinks.communityTitle')}
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                    {t('quickLinks.communitySubtitle')}
                  </p>
                </div>
              </a>

              <a
                href='https://support.runonflux.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md sm:p-6 dark:border-gray-700 dark:hover:border-purple-600'
              >
                <MessageCircle className='mr-3 h-6 w-6 flex-shrink-0 text-purple-500 sm:h-8 sm:w-8' />
                <div className='min-w-0 flex-1 text-left'>
                  <h3 className='text-sm font-semibold text-gray-900 sm:text-base dark:text-white'>
                    {t('quickLinks.supportTitle')}
                  </h3>
                  <p className='text-xs text-gray-600 sm:text-sm dark:text-gray-400'>
                    {t('quickLinks.supportSubtitle')}
                  </p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('channelsTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('channelsSubtitle')}
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-3'>
            {supportChannels.map((channel, index) => {
              const ChannelIcon = channel.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-gray-700'
                >
                  <div className='mb-6 text-center'>
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl'>
                      <ChannelIcon className='h-8 w-8' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {t(`channels.${channel.key}.title`)}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t(`channels.${channel.key}.description`)}
                    </p>
                  </div>

                  <div className='space-y-3'>
                    {channel.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon
                      const isInternal = link.internal === true
                      const className =
                        'group dark:hover:bg-dark-700 flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600'
                      const inner = (
                        <>
                          {LinkIcon && (
                            <LinkIcon className='group-hover:text-primary-600 dark:group-hover:text-primary-400 mr-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
                          )}
                          <span className='group-hover:text-primary-600 dark:group-hover:text-primary-400 text-gray-700 dark:text-gray-300'>
                            {t(`channels.${channel.key}.links.${link.key}`)}
                          </span>
                        </>
                      )

                      return isInternal ? (
                        <Link key={linkIndex} href={link.url} className={className}>
                          {inner}
                        </Link>
                      ) : (
                        <a
                          key={linkIndex}
                          href={link.url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className={className}
                        >
                          {inner}
                        </a>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('faqTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('faqSubtitle')}
            </p>
          </motion.div>

          <div className='space-y-12'>
            {faqCategoryDescriptors.map((category, categoryIndex) => {
              const CategoryIcon = category.icon
              return (
                <div
                  key={category.key}
                  id={CATEGORY_DOM_IDS[category.key]}
                  style={{ scrollMarginTop: '100px' }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className='mb-8 flex items-center'
                  >
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mr-4 flex h-10 w-10 items-center justify-center rounded-lg'>
                      <CategoryIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {t(`faqCategories.${category.key}.title`)}
                    </h3>
                  </motion.div>

                  <div className='space-y-4'>
                    {category.faqs.map((faq, faqIndex) => (
                      <FAQItem
                        key={faqIndex}
                        category={category.key}
                        descriptor={faq}
                        categoryIndex={categoryIndex}
                        index={faqIndex}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='items-start lg:grid lg:grid-cols-2 lg:gap-16'>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-6'>{t('stillNeedHelpTitle')}</h2>

              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                {t('stillNeedHelpDescription')}
              </p>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <Mail className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      {t('emailSupportTitle')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      {t('emailSupportDescription')}
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Github className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      {t('openSourceTitle')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>{t('openSourceDescription')}</p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Users className='text-primary-600 dark:text-primary-400 mt-1 mr-4 h-6 w-6 flex-shrink-0' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      {t('communityTitle')}
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>{t('communityDescription')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mt-12 lg:mt-0'
            >
              <div className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700'>
                <h3 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                  {t('contactSupportTitle')}
                </h3>
                <ContactForm />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
