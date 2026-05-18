'use client'

import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Clock,
  Github,
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
  Twitter,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from '@/i18n/navigation'
import { trackEvent } from '@/lib/gtag'

interface ContactMethod {
  key: 'supportTickets' | 'discord' | 'github'
  contact: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  href: string
  primary: boolean
}

const contactMethods: ContactMethod[] = [
  {
    key: 'supportTickets',
    icon: Mail,
    contact: 'support.runonflux.io',
    href: 'https://support.runonflux.io',
    primary: true,
  },
  {
    key: 'discord',
    icon: MessageCircle,
    contact: 'discord.gg/runonflux',
    href: 'https://discord.gg/runonflux',
    primary: true,
  },
  {
    key: 'github',
    icon: Github,
    contact: '',
    href: 'https://github.com/RunOnFlux/ssp-wallet',
    primary: true,
  },
]

interface SocialLink {
  key: 'github' | 'discord' | 'twitter'
  name: string
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

const socialLinks: SocialLink[] = [
  {
    key: 'github',
    name: 'GitHub',
    href: 'https://github.com/RunOnFlux/ssp-wallet',
    icon: Github,
  },
  {
    key: 'discord',
    name: 'Discord',
    href: 'https://discord.gg/runonflux',
    icon: MessageCircle,
  },
  {
    key: 'twitter',
    name: 'Twitter',
    href: 'https://twitter.com/sspwallet_io',
    icon: Twitter,
  },
]

interface FormData {
  name: string
  email: string
  company: string
  subject: string
  message: string
  type: string
}

function ContactForm() {
  const t = useTranslations('Contact.form')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general',
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
          message: `Subject: ${formData.subject}\n\nCompany: ${formData.company || 'Not specified'}\n\nType: ${formData.type}\n\nMessage:\n${formData.message}`,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('errorGeneric'))
      }

      setIsSubmitted(true)
      trackEvent('form_submit', { form_id: 'contact' })
      setFormData({ name: '', email: '', company: '', subject: '', message: '', type: 'general' })
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
          <option value='general'>{t('typeOptions.general')}</option>
          <option value='support'>{t('typeOptions.support')}</option>
          <option value='partnership'>{t('typeOptions.partnership')}</option>
          <option value='security'>{t('typeOptions.security')}</option>
          <option value='media'>{t('typeOptions.media')}</option>
          <option value='business'>{t('typeOptions.business')}</option>
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
          htmlFor='message'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          {t('messageLabel')}
        </label>
        <textarea
          id='message'
          name='message'
          required
          rows={6}
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

export function ContactContent() {
  const t = useTranslations('Contact')
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
              <MessageCircle className='mr-2 h-4 w-4' />
              {t('heroBadge')}
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>{t('heroTitle')}</h1>

            <p className='mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              {t('heroDescription')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('methodsTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('methodsSubtitle')}
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-3'>
            {contactMethods.map((method, index) => {
              const MethodIcon = method.icon
              const contactValue =
                method.key === 'github' ? t(`methods.${method.key}.contact`) : method.contact
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`group ${method.primary ? 'lg:col-span-1' : ''}`}
                >
                  <div
                    className={`dark:bg-dark-800 h-full rounded-2xl border bg-white p-8 transition-all duration-300 hover:shadow-lg ${method.primary ? 'border-blue-200 hover:border-blue-300 dark:border-blue-800 dark:hover:border-blue-600' : 'border-gray-200 dark:border-gray-700'}`}
                  >
                    <div className='mb-6 text-center'>
                      <div
                        className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${method.primary ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'}`}
                      >
                        <MethodIcon className='h-8 w-8' />
                      </div>
                      <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                        {t(`methods.${method.key}.title`)}
                      </h3>
                      <p className='mb-4 text-gray-600 dark:text-gray-400'>
                        {t(`methods.${method.key}.description`)}
                      </p>
                    </div>

                    <div className='mb-6 space-y-3 text-center'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {contactValue}
                      </div>
                      <div className='flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
                        <Clock className='mr-2 h-4 w-4' />
                        {t(`methods.${method.key}.responseTime`)}
                      </div>
                    </div>

                    <a
                      href={method.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`block w-full rounded-lg px-6 py-3 text-center font-medium transition-colors ${method.primary ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'dark:hover:bg-dark-700 border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}
                    >
                      {t(`methods.${method.key}.action`)}
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Support Resources */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>{t('resourcesTitle')}</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('resourcesSubtitle')}
            </p>
          </motion.div>

          <div className='grid gap-6 md:grid-cols-3'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                href='/support'
                className='dark:bg-dark-800 group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-700'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                  <HelpCircle className='h-6 w-6' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                  {t('resources.supportCenter.title')}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {t('resources.supportCenter.description')}
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link
                href='/guide'
                className='dark:bg-dark-800 group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-700'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                  <CheckCircle className='h-6 w-6' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                  {t('resources.setupGuide.title')}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {t('resources.setupGuide.description')}
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <a
                href='https://docs.sspwallet.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-700'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                  <BookOpen className='h-6 w-6' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                  {t('resources.documentation.title')}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {t('resources.documentation.description')}
                </p>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className='mb-12 text-center'
            >
              <h2 className='heading-2 mb-4'>{t('formTitle')}</h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
                {t('formSubtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
              className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 lg:p-12 dark:border-gray-700'
            >
              <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20'>
                <p className='text-sm text-blue-800 dark:text-blue-200'>
                  <strong>{t('formTipPrefix')}</strong> {t('formTipBefore')}{' '}
                  <a
                    href='https://support.runonflux.io'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='underline hover:no-underline'
                  >
                    {t('formTipLinkSupport')}
                  </a>{' '}
                  {t('formTipBetween')}{' '}
                  <a href='mailto:support@sspwallet.io' className='underline hover:no-underline'>
                    support@sspwallet.io
                  </a>
                </p>
              </div>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <h2 className='heading-2 mb-4'>{t('communityTitle')}</h2>
            <p className='mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              {t('communitySubtitle')}
            </p>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 md:gap-8'>
              {socialLinks.map((social, index) => {
                const SocialIcon = social.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='group dark:bg-dark-800 flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg dark:border-gray-700'
                    >
                      <div className='bg-primary-100 group-hover:bg-primary-200 dark:bg-primary-900/30 dark:group-hover:bg-primary-800/50 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors'>
                        <SocialIcon className='text-primary-600 dark:text-primary-400 h-8 w-8' />
                      </div>
                      <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>
                        {social.name}
                      </h3>
                      <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
                        {t(`social.${social.key}`)}
                      </p>
                    </a>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
