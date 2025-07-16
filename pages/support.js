import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Book,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Github,
  HelpCircle,
  Mail,
  MessageCircle,
  Send,
  Shield,
  Smartphone,
  Twitter,
  Users,
  Youtube,
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useInView } from 'react-intersection-observer'

const faqCategories = [
  {
    title: 'Getting Started',
    icon: Book,
    faqs: [
      {
        question: 'What is SSP Wallet?',
        answer:
          'SSP Wallet is a groundbreaking, self-custody, multi-signature browser wallet for multiple blockchains. It emphasizes Security, Simplicity, and Powerful features with cutting-edge encryption and mobile-integrated authentication.',
      },
      {
        question: 'How do I install SSP Wallet?',
        answer:
          'You can install SSP Wallet as a Chrome extension from the Chrome Web Store. Visit our download page and follow our comprehensive setup guide for step-by-step instructions.',
      },
      {
        question: 'Is SSP Wallet free to use?',
        answer:
          "Yes, SSP Wallet is completely free to download and use. We don't charge any fees for the wallet itself, though you'll still pay network transaction fees when making blockchain transactions.",
      },
      {
        question: 'What cryptocurrencies does SSP Wallet support?',
        answer:
          'SSP Wallet supports 12+ blockchains including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), Zcash (ZEC), Ravencoin (RVN), Dogecoin (DOGE), Bitcoin Cash (BCH), and Flux (FLUX).',
      },
    ],
  },
  {
    title: 'Security & Privacy',
    icon: Shield,
    faqs: [
      {
        question: 'How secure is SSP Wallet?',
        answer:
          "SSP Wallet uses multi-signature technology with mobile-integrated authentication, providing two-key protection. We use cutting-edge encryption and don't store any of your data - everything is stored locally and controlled by you.",
      },
      {
        question: 'What is the SSP Key mobile app?',
        answer:
          'SSP Key is the mobile companion app that provides second-factor authentication for your SSP Wallet. It creates a secure connection between your mobile device and browser wallet for enhanced security.',
      },
      {
        question: 'Can I recover my wallet if I lose my device?',
        answer:
          'Yes, you can recover your wallet using your seed phrase. Both your wallet and key have separate seed phrases that should be stored securely offline. Never share your seed phrases with anyone.',
      },
      {
        question: 'Does SSP Wallet collect my personal data?',
        answer:
          'No, SSP Wallet is committed to not storing any data information. Your private keys, transaction history, and personal data remain entirely under your control and are stored locally on your devices.',
      },
    ],
  },
  {
    title: 'Technical Support',
    icon: Smartphone,
    faqs: [
      {
        question: 'Which browsers are supported?',
        answer:
          "SSP Wallet works with all Chromium-based browsers including Google Chrome, Brave, Microsoft Edge, and Opera. We're working on Firefox support for future releases.",
      },
      {
        question: "I'm having trouble syncing my mobile key",
        answer:
          "Make sure both devices are connected to the internet, the QR code is clearly visible, and you're using the latest versions of both the browser extension and mobile app. Try restarting both applications if sync fails.",
      },
      {
        question: 'My transaction is stuck or pending',
        answer:
          'Blockchain transactions can sometimes take time depending on network congestion. Check the transaction status on a blockchain explorer. If using Ethereum, you may need to increase gas fees for faster confirmation.',
      },
      {
        question: 'How do I update SSP Wallet?',
        answer:
          "Browser extensions typically update automatically. You can manually check for updates in your browser's extension management page. For the mobile app, check your device's app store for updates.",
      },
    ],
  },
]

const supportChannels = [
  {
    title: 'Community Support',
    description: 'Get help from our community',
    icon: Users,
    links: [
      { name: 'GitHub Discussions', url: 'https://github.com/RunOnFlux', icon: Github },
      { name: 'Twitter Support', url: 'https://twitter.com/sspwallet_io', icon: Twitter },
    ],
  },
  {
    title: 'Documentation',
    description: 'Comprehensive guides and docs',
    icon: Book,
    links: [
      { name: 'Complete Documentation', url: 'https://docs.sspwallet.io', internal: false },
      { name: 'Setup Guide', url: '/guide', internal: true },
      { name: 'Feature Documentation', url: '/features', internal: true },
    ],
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step tutorials',
    icon: Youtube,
    links: [
      { name: 'Installation Guide', url: '#', icon: Youtube },
      { name: 'Security Best Practices', url: '#', icon: Youtube },
    ],
  },
]

function FAQItem({ faq, index, categoryIndex }) {
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
      transition={{ duration: 0.6, delay: (categoryIndex * 4 + index) * 0.1 }}
      className='overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700'
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-dark-700'
      >
        <span className='pr-4 font-semibold text-gray-900 dark:text-white'>{faq.question}</span>
        {isOpen ? (
          <ChevronUp className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        ) : (
          <ChevronDown className='h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400' />
        )}
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='px-6 pb-6'
        >
          <p className='leading-relaxed text-gray-600 dark:text-gray-400'>{faq.answer}</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function ContactForm() {
  const [formData, setFormData] = useState({
    email: '',
    type: 'general',
    subject: '',
    description: '',
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
      setFormData({ email: '', type: 'general', subject: '', description: '' })
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
          Message Sent Successfully!
        </h3>
        <p className='mb-4 text-green-700 dark:text-green-300'>
          Thank you for contacting us. We'll get back to you as soon as possible.
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
          className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-700 dark:text-white'
          placeholder='your.email@example.com'
        />
      </div>

      <div>
        <label
          htmlFor='type'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Issue Type *
        </label>
        <select
          id='type'
          name='type'
          required
          value={formData.type}
          onChange={handleChange}
          className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-700 dark:text-white'
        >
          <option value='general'>General Question</option>
          <option value='technical'>Technical Issue</option>
          <option value='security'>Security Concern</option>
          <option value='feature'>Feature Request</option>
          <option value='bug'>Bug Report</option>
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
          className='w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-700 dark:text-white'
          placeholder='Brief description of your issue'
        />
      </div>

      <div>
        <label
          htmlFor='description'
          className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'
        >
          Description *
        </label>
        <textarea
          id='description'
          name='description'
          required
          rows={6}
          value={formData.description}
          onChange={handleChange}
          className='w-full resize-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-dark-700 dark:text-white'
          placeholder='Please provide detailed information about your issue...'
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
        className='inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700 disabled:bg-primary-400'
      >
        {isSubmitting ? (
          <>
            <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></div>
            Sending...
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

export default function Support() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <>
      <Head>
        <title>Support - SSP Wallet | Get Help & Technical Support</title>
        <meta
          name='description'
          content='Get help with SSP Wallet. Find answers to common questions, access our support resources, or contact our team for technical assistance.'
        />
        <meta
          name='keywords'
          content='SSP wallet support, crypto wallet help, technical support, FAQ, troubleshooting, customer service'
        />

        {/* Open Graph */}
        <meta property='og:title' content='SSP Wallet Support | Get Help & Technical Support' />
        <meta
          property='og:description'
          content='Find answers to your questions and get technical support for SSP Wallet.'
        />
        <meta property='og:url' content='https://sspwallet.io/support' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/support' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900'>
        <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
        <div className='container-custom relative'>
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className='mx-auto max-w-4xl text-center'
          >
            <div className='mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'>
              <HelpCircle className='mr-2 h-4 w-4' />
              Support Center
            </div>

            <h1 className='heading-1 mb-6'>How can we help you?</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Find answers to common questions, access our documentation, or get in touch with our
              support team.
            </p>

            <div className='mx-auto grid max-w-3xl gap-6 md:grid-cols-3'>
              <div className='flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-800'>
                <Book className='mr-3 h-8 w-8 flex-shrink-0 text-blue-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Documentation</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Guides & tutorials</p>
                </div>
              </div>

              <div className='flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-800'>
                <Users className='mr-3 h-8 w-8 flex-shrink-0 text-green-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Community</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>User discussions</p>
                </div>
              </div>

              <div className='flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark-800'>
                <MessageCircle className='mr-3 h-8 w-8 flex-shrink-0 text-purple-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Direct Support</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Contact our team</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Channels */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>Get Support</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Choose the best way to get help based on your needs
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
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className='rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-dark-800'
                >
                  <div className='mb-6 text-center'>
                    <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'>
                      <ChannelIcon className='h-8 w-8' />
                    </div>
                    <h3 className='mb-2 text-xl font-bold text-gray-900 dark:text-white'>
                      {channel.title}
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>{channel.description}</p>
                  </div>

                  <div className='space-y-3'>
                    {channel.links.map((link, linkIndex) => {
                      const LinkIcon = link.icon
                      return (
                        <Link
                          key={linkIndex}
                          href={link.url}
                          target={link.internal ? '_self' : '_blank'}
                          className='group flex items-center rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-dark-700'
                        >
                          {LinkIcon && (
                            <LinkIcon className='mr-3 h-5 w-5 text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400' />
                          )}
                          <span className='text-gray-700 group-hover:text-primary-600 dark:text-gray-300 dark:group-hover:text-primary-400'>
                            {link.name}
                          </span>
                        </Link>
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
      <section className='section-padding bg-gray-50 dark:bg-dark-900'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-4'>Frequently Asked Questions</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Find quick answers to the most common questions about SSP Wallet
            </p>
          </motion.div>

          <div className='space-y-12'>
            {faqCategories.map((category, categoryIndex) => {
              const CategoryIcon = category.icon
              return (
                <div key={categoryIndex}>
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='mb-8 flex items-center'
                  >
                    <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'>
                      <CategoryIcon className='h-5 w-5' />
                    </div>
                    <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                      {category.title}
                    </h3>
                  </motion.div>

                  <div className='space-y-4'>
                    {category.faqs.map((faq, faqIndex) => (
                      <FAQItem
                        key={faqIndex}
                        faq={faq}
                        index={faqIndex}
                        categoryIndex={categoryIndex}
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
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='heading-2 mb-6'>Still need help?</h2>

              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Can't find what you're looking for? Send us a message and our support team will get
                back to you as soon as possible.
              </p>

              <div className='space-y-6'>
                <div className='flex items-start'>
                  <Mail className='mr-4 mt-1 h-6 w-6 flex-shrink-0 text-primary-600 dark:text-primary-400' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Email Support
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      We typically respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Github className='mr-4 mt-1 h-6 w-6 flex-shrink-0 text-primary-600 dark:text-primary-400' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>
                      Open Source
                    </h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Report bugs or contribute on GitHub
                    </p>
                  </div>
                </div>

                <div className='flex items-start'>
                  <Users className='mr-4 mt-1 h-6 w-6 flex-shrink-0 text-primary-600 dark:text-primary-400' />
                  <div>
                    <h4 className='mb-1 font-semibold text-gray-900 dark:text-white'>Community</h4>
                    <p className='text-gray-600 dark:text-gray-400'>
                      Connect with other users and get peer support
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className='mt-12 lg:mt-0'
            >
              <div className='rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-dark-800'>
                <h3 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                  Contact Support
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
