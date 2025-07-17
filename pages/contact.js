import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Github,
  Globe,
  Mail,
  MessageCircle,
  Send,
  Twitter,
  Users,
  Youtube,
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const contactMethods = [
  {
    title: 'Email Support',
    description: 'Get help with technical issues or general questions',
    icon: Mail,
    contact: 'support@sspwallet.io',
    responseTime: 'Within 24 hours',
    action: 'Send Email',
    href: 'mailto:support@sspwallet.io',
  },
  {
    title: 'Community Support',
    description: 'Connect with other users and get peer help',
    icon: Users,
    contact: 'GitHub Discussions',
    responseTime: 'Community driven',
    action: 'Join Discussion',
    href: 'https://github.com/RunOnFlux',
  },
  {
    title: 'Social Media',
    description: 'Follow us for updates and quick support',
    icon: Twitter,
    contact: '@sspwallet_io',
    responseTime: 'During business hours',
    action: 'Follow Us',
    href: 'https://twitter.com/sspwallet_io',
  },
]

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/RunOnFlux',
    icon: Github,
    description: 'Open source development',
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/sspwallet_io',
    icon: Twitter,
    description: 'Latest updates & news',
  },
  {
    name: 'YouTube',
    href: '#',
    icon: Youtube,
    description: 'Video tutorials & guides',
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
    } catch (err) {
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
          content="Contact SSP Wallet team. Get support, ask questions, or discuss partnerships. We're here to help with your crypto wallet needs."
        />
        <meta
          name='keywords'
          content='contact SSP wallet, crypto wallet support, get in touch, customer service, technical support'
        />

        {/* Open Graph */}
        <meta property='og:title' content='Contact SSP Wallet | Get in Touch' />
        <meta
          property='og:description'
          content='Get in touch with the SSP Wallet team for support, partnerships, or general inquiries.'
        />
        <meta property='og:url' content='https://sspwallet.io/contact' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/contact' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden bg-linear-to-br from-purple-50 via-white to-blue-50'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='mb-6 inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'>
              <MessageCircle className='mr-2 h-4 w-4' />
              Contact Us
            </div>

            <h1 className='heading-1 mb-6'>Get in Touch</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Have questions about SSP Wallet? Need support or want to explore partnerships? We'd
              love to hear from you.
            </p>

            <div className='mx-auto grid max-w-3xl gap-6 md:grid-cols-3'>
              <div className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700'>
                <Mail className='mr-3 h-8 w-8 flex-shrink-0 text-purple-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Email</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Quick responses</p>
                </div>
              </div>

              <div className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700'>
                <Users className='mr-3 h-8 w-8 flex-shrink-0 text-blue-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Community</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Peer support</p>
                </div>
              </div>

              <div className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700'>
                <Globe className='mr-3 h-8 w-8 flex-shrink-0 text-green-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Global</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Available worldwide</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>Ways to Reach Us</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Choose the contact method that works best for you
            </p>
          </motion.div>

          <div className='mb-16 grid gap-8 lg:grid-cols-3'>
            {contactMethods.map((method, index) => {
              const MethodIcon = method.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-gray-700'
                >
                  <div className='mb-6 text-center'>
                    <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl'>
                      <MethodIcon className='h-8 w-8' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {method.title}
                    </h3>
                    <p className='mb-4 text-gray-600 dark:text-gray-400'>{method.description}</p>
                  </div>

                  <div className='mb-6 space-y-3'>
                    <div className='flex items-center justify-center'>
                      <span className='font-medium text-gray-900 dark:text-white'>
                        {method.contact}
                      </span>
                    </div>
                    <div className='flex items-center justify-center text-sm text-gray-500 dark:text-gray-400'>
                      <Clock className='mr-2 h-4 w-4' />
                      {method.responseTime}
                    </div>
                  </div>

                  <Link
                    href={method.href}
                    target='_blank'
                    className='bg-primary-600 hover:bg-primary-700 block w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors'
                  >
                    {method.action}
                  </Link>
                </motion.div>
              )
            })}
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
              transition={{ duration: 0.8 }}
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
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 lg:p-12 dark:border-gray-700'
            >
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
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='text-center'
          >
            <h2 className='heading-2 mb-4'>Follow Our Community</h2>
            <p className='mx-auto mb-12 max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Stay updated with the latest news, updates, and connect with other SSP Wallet users
            </p>

            <div className='flex items-center justify-center space-x-8'>
              {socialLinks.map((social, index) => {
                const SocialIcon = social.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={social.href}
                      target='_blank'
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

      {/* CTA Section */}
      <section className='section-padding bg-primary-600 dark:bg-primary-800'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className='mb-4 text-3xl font-bold text-white'>Need Help Right Away?</h2>
            <p className='text-primary-100 mx-auto mb-8 max-w-2xl text-xl'>
              Check out our support center for immediate assistance and frequently asked questions
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/support'
                className='text-primary-600 inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold transition-colors hover:bg-gray-50'
              >
                Visit Support Center
              </Link>
              <Link
                href='/guide'
                className='inline-flex items-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10'
              >
                View Setup Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
