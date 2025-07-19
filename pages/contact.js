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
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const contactMethods = [
  {
    title: 'Support Tickets',
    description: 'Get direct help with technical issues through our ticketing system',
    icon: Mail,
    contact: 'support.runonflux.io',
    responseTime: 'Within 24 hours',
    action: 'Create Ticket',
    href: 'https://support.runonflux.io',
    primary: true,
  },
  {
    title: 'Discord Community',
    description: 'Join our active community for real-time support and discussions',
    icon: MessageCircle,
    contact: 'discord.gg/runonflux',
    responseTime: 'Active community',
    action: 'Join Discord',
    href: 'https://discord.gg/runonflux',
    primary: true,
  },
  {
    title: 'GitHub Support',
    description: 'Report bugs, request features, or contribute to development',
    icon: Github,
    contact: 'GitHub Issues & Discussions',
    responseTime: 'Community driven',
    action: 'Visit GitHub',
    href: 'https://github.com/RunOnFlux/ssp-wallet',
    primary: true,
  },
]

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/RunOnFlux/ssp-wallet',
    icon: Github,
    description: 'Open source development & contributions',
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/runonflux',
    icon: MessageCircle,
    description: 'Community chat & real-time support',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/sspwallet_io',
    icon: Twitter,
    description: 'Latest updates, news & announcements',
  },
]

function ContactForm() {
  const [formData, setFormData] = useState({
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

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // Simulate form submission
    try {
      // In a real app, you'd send this to your backend
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSubmitted(true)
      setFormData({ name: '', email: '', company: '', subject: '', message: '', type: 'general' })
    } catch {
      setError('Failed to send message. Please try again.')
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
          Thank You!
        </h3>
        <p className='mb-4 text-green-700 dark:text-green-300'>
          Your message has been sent successfully. We'll get back to you soon.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className='text-green-600 hover:underline dark:text-green-400'
        >
          Send another message
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
            placeholder='your.email@example.com'
          />
        </div>
      </div>

      <div>
        <label
          htmlFor='company'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Company (Optional)
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
          htmlFor='type'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Inquiry Type *
        </label>
        <select
          id='type'
          name='type'
          required
          value={formData.type}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
        >
          <option value='general'>General Inquiry</option>
          <option value='support'>Technical Support</option>
          <option value='partnership'>Partnership</option>
          <option value='security'>Security Issue</option>
          <option value='media'>Media & Press</option>
          <option value='business'>Business Development</option>
        </select>
      </div>

      <div>
        <label
          htmlFor='subject'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Subject *
        </label>
        <input
          type='text'
          id='subject'
          name='subject'
          required
          value={formData.subject}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='Brief subject of your message'
        />
      </div>

      <div>
        <label
          htmlFor='message'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Message *
        </label>
        <textarea
          id='message'
          name='message'
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className='focus:ring-primary-500 dark:bg-dark-700 w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 dark:border-gray-600 dark:text-white'
          placeholder='Please provide details about your inquiry...'
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
            Sending Message...
          </>
        ) : (
          <>
            <Send className='mr-2 h-4 w-4' />
            Send Message
          </>
        )}
      </button>
    </form>
  )
}

export default function Contact() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <>
      <Head>
        <title>Contact - SSP Wallet | Get in Touch</title>
        <meta
          name='description'
          content='Contact SSP Wallet team. Get support, ask questions, or discuss partnerships. Join our Discord community or reach out directly.'
        />
        <meta
          name='keywords'
          content='contact SSP wallet, crypto wallet support, get in touch, customer service, technical support, discord community'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Contact SSP Wallet | Get in Touch' />
        <meta
          property='og:description'
          content='Get in touch with the SSP Wallet team for support, partnerships, or general inquiries.'
        />
        <meta property='og:url' content='https://sspwallet.io/contact' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />
        <meta property='og:image:alt' content='Contact SSP Wallet - Get in Touch' />

        {/* Twitter */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Contact SSP Wallet | Get in Touch' />
        <meta
          name='twitter:description'
          content='Get in touch with the SSP Wallet team for support, partnerships, or general inquiries.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />
        <meta name='twitter:image:alt' content='Contact SSP Wallet - Get in Touch' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/contact' />
      </Head>

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
              Contact Us
            </div>

            <h1 className='heading-1 mb-6 text-gray-900 dark:text-white'>Get in Touch</h1>

            <p className='mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Have questions about SSP Wallet? Need support or want to explore partnerships? Join
              our community or reach out directly—we're here to help.
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
            <h2 className='heading-2 mb-4'>Ways to Reach Us</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Choose the contact method that works best for your needs
            </p>
          </motion.div>

          <div className='grid gap-8 lg:grid-cols-3'>
            {contactMethods.map((method, index) => {
              const MethodIcon = method.icon
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
                        {method.title}
                      </h3>
                      <p className='mb-4 text-gray-600 dark:text-gray-400'>{method.description}</p>
                    </div>

                    <div className='mb-6 space-y-3 text-center'>
                      <div className='font-medium text-gray-900 dark:text-white'>
                        {method.contact}
                      </div>
                      <div className='flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
                        <Clock className='mr-2 h-4 w-4' />
                        {method.responseTime}
                      </div>
                    </div>

                    <Link
                      href={method.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className={`block w-full rounded-lg px-6 py-3 text-center font-medium transition-colors ${method.primary ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'dark:hover:bg-dark-700 border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300'}`}
                    >
                      {method.action}
                    </Link>
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
            <h2 className='heading-2 mb-4'>Need Help Right Away?</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Check out our self-service resources for immediate assistance
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
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>Support Center</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Comprehensive FAQ and troubleshooting guides
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
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>Setup Guide</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Step-by-step installation instructions
                </p>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link
                href='https://docs.sspwallet.io'
                target='_blank'
                rel='noopener noreferrer'
                className='dark:bg-dark-800 group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-700'
              >
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl'>
                  <BookOpen className='h-6 w-6' />
                </div>
                <h3 className='mb-2 font-semibold text-gray-900 dark:text-white'>Documentation</h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  Complete technical documentation
                </p>
              </Link>
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
              <h2 className='heading-2 mb-4'>Send Us a Message</h2>
              <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
                Fill out the form below and we'll get back to you as soon as possible
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
                  <strong>Tip:</strong> For faster technical support, consider using our{' '}
                  <Link
                    href='https://support.runonflux.io'
                    target='_blank'
                    className='underline hover:no-underline'
                  >
                    support ticket system
                  </Link>{' '}
                  or reaching out via{' '}
                  <Link href='mailto:support@sspwallet.io' className='underline hover:no-underline'>
                    support@sspwallet.io
                  </Link>
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
            <h2 className='heading-2 mb-4'>Follow Our Community</h2>
            <p className='mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Stay updated with the latest news, connect with other users, and get community support
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
                    <Link
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
                        {social.description}
                      </p>
                    </Link>
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
