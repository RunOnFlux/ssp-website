import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Chrome,
  Download,
  Lock,
  Play,
  Shield,
  Smartphone,
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'

const steps = [
  {
    phase: 'Part One',
    title: 'Installing SSP Wallet',
    icon: Chrome,
    color: 'blue',
    steps: [
      {
        step: 1,
        title: 'Visit Chrome Web Store',
        description: 'Open your Chromium browser and navigate to the SSP Wallet Extension page',
        action: 'Navigate to extension page',
        link: 'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
      },
      {
        step: 2,
        title: 'Install Extension',
        description:
          "Click 'Add to Chrome.' A pop-up window will appear asking if you want to add SSP Wallet. Click 'Add' to complete installation.",
        action: 'Add to browser',
      },
      {
        step: 3,
        title: 'Open Wallet',
        description:
          'Locate the SSP wallet logo in your browser and click on it. Follow the prompts to get started.',
        action: 'Launch wallet',
      },
      {
        step: 4,
        title: 'Create Password',
        description:
          'Create your password. Please carefully read the SSP Wallet Disclaimer and acknowledge your agreement.',
        action: 'Set password',
      },
      {
        step: 5,
        title: 'Create Wallet',
        description: "Click 'Create Wallet' to initialize your new wallet.",
        action: 'Initialize wallet',
      },
      {
        step: 6,
        title: 'Backup Seed Phrase',
        description:
          "Click 'Show Mnemonic Wallet Seed Phrase.' Store the seed phrase securely and confirm that you have backed it up.",
        action: 'Secure backup',
        important: true,
      },
      {
        step: 7,
        title: 'Finalize Setup',
        description:
          "Click 'Create Wallet' to finalize the process. Your browser wallet is now ready!",
        action: 'Complete setup',
      },
    ],
  },
  {
    phase: 'Part Two',
    title: 'Installing SSP Key Mobile App',
    icon: Smartphone,
    color: 'green',
    steps: [
      {
        step: 1,
        title: 'Download Mobile App',
        description: 'Download SSP Key on your mobile device and open the application.',
        action: 'Install mobile app',
        links: {
          android: 'https://play.google.com/store/apps/details?id=io.runonflux.sspkey',
          ios: 'https://apps.apple.com/us/app/ssp-key/id6463717332',
        },
      },
      {
        step: 2,
        title: 'Start Synchronization',
        description: "Click on 'Synchronize Key' to begin the setup process.",
        action: 'Begin sync',
      },
      {
        step: 3,
        title: 'Set Key Password',
        description: "Set an SSP Key password and confirm it. Then, click 'Setup Key.'",
        action: 'Create key password',
      },
      {
        step: 4,
        title: 'Backup Key Seed',
        description:
          "Click 'Show Mnemonic Key Seed Phrase.' Store the key seed phrase securely and confirm backup.",
        action: 'Secure key backup',
        important: true,
      },
      {
        step: 5,
        title: 'Complete Key Setup',
        description:
          "Click 'Setup Key.' SSP Key now serves as second authentication factor for your SSP Wallet.",
        action: 'Finalize key',
      },
      {
        step: 6,
        title: 'Scan QR Code',
        description:
          "Click 'Scan Code' to synchronize your SSP Key with SSP Wallet. Scan the QR code displayed on your browser.",
        action: 'Sync devices',
      },
      {
        step: 7,
        title: 'Approve Synchronization',
        description:
          "Click 'Approve Synchronization' and confirm with your Key password. You'll be notified of successful sync.",
        action: 'Complete sync',
      },
    ],
  },
]

const securityTips = [
  {
    icon: Lock,
    title: 'Secure Your Seed Phrases',
    description:
      'Store both wallet and key seed phrases in a secure, offline location. Never share them with anyone.',
  },
  {
    icon: Shield,
    title: 'Use Strong Passwords',
    description: 'Create unique, strong passwords for both your wallet and mobile key app.',
  },
  {
    icon: Smartphone,
    title: 'Keep Mobile Secure',
    description:
      'Ensure your mobile device has screen lock and consider using biometric authentication.',
  },
]

function StepCard({ step, phaseColor, index }) {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative rounded-xl border-2 p-6 transition-all duration-300 ${
        step.important
          ? 'border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20'
          : 'dark:bg-dark-800 border-gray-200 bg-white dark:border-gray-700'
      } hover:shadow-lg`}
    >
      {step.important && (
        <div className='absolute -top-2 -right-2'>
          <div className='inline-flex items-center rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white'>
            <AlertTriangle className='mr-1 h-3 w-3' />
            Important
          </div>
        </div>
      )}

      <div className='flex items-start'>
        <div
          className={`mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${phaseColor === 'blue' ? 'bg-blue-500' : 'bg-green-500'} `}
        >
          {step.step}
        </div>

        <div className='flex-1'>
          <h4 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>{step.title}</h4>
          <p className='mb-4 text-gray-600 dark:text-gray-400'>{step.description}</p>

          <div className='flex items-center space-x-4'>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                phaseColor === 'blue'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              } `}
            >
              {step.action}
            </span>

            {step.link && (
              <Link
                href={step.link}
                target='_blank'
                className='text-primary-600 dark:text-primary-400 text-sm hover:underline'
              >
                Open Link →
              </Link>
            )}

            {step.links && (
              <div className='flex space-x-2'>
                <Link
                  href={step.links.android}
                  target='_blank'
                  className='text-sm text-green-600 hover:underline dark:text-green-400'
                >
                  Android
                </Link>
                <span className='text-gray-400'>|</span>
                <Link
                  href={step.links.ios}
                  target='_blank'
                  className='text-sm text-blue-600 hover:underline dark:text-blue-400'
                >
                  iOS
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Guide() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <>
      <Head>
        <title>Setup Guide - SSP Wallet | Complete Installation Instructions</title>
        <meta
          name='description'
          content='Step-by-step guide to install and set up SSP Wallet and SSP Key. Complete setup instructions for secure crypto wallet with multi-signature protection.'
        />
        <meta
          name='keywords'
          content='SSP wallet setup, installation guide, crypto wallet tutorial, multi-signature setup, SSP Key installation'
        />

        {/* Open Graph */}
        <meta
          property='og:title'
          content='SSP Wallet Setup Guide | Complete Installation Instructions'
        />
        <meta
          property='og:description'
          content='Learn how to install and set up SSP Wallet with our comprehensive step-by-step guide.'
        />
        <meta property='og:url' content='https://sspwallet.io/guide' />

        {/* Additional SEO */}
        <link rel='canonical' href='https://sspwallet.io/guide' />
      </Head>

      {/* Hero Section */}
      <section className='section-padding dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50'>
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
              <Shield className='mr-2 h-4 w-4' />
              Complete Setup Guide
            </div>

            <h1 className='heading-1 mb-6'>How to Install SSP Wallet & SSP Key</h1>

            <p className='mx-auto mb-8 max-w-3xl text-xl text-gray-600 dark:text-gray-400'>
              Follow our comprehensive guide to set up both SSP Wallet and SSP Key for maximum
              security with dual-signature protection.
            </p>

            <div className='mx-auto grid max-w-2xl gap-6 md:grid-cols-2'>
              <div className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700'>
                <Chrome className='mr-3 h-8 w-8 flex-shrink-0 text-blue-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Browser Extension</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Install wallet in browser
                  </p>
                </div>
              </div>

              <div className='dark:bg-dark-800 flex items-center rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700'>
                <Smartphone className='mr-3 h-8 w-8 flex-shrink-0 text-green-500' />
                <div className='text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white'>Mobile Key</h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Add mobile authentication
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Guide Section */}
      <section className='section-padding'>
        <div className='container-custom'>
          <div className='items-start lg:grid lg:grid-cols-3 lg:gap-12'>
            <motion.div
              className='mb-12 lg:col-span-2 lg:mb-0'
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className='relative aspect-video overflow-hidden rounded-2xl bg-gray-900'>
                <video controls className='h-full w-full object-cover'>
                  <source
                    src='/Video Guide_ How to Install SSP Wallet and SSP Key.mp4'
                    type='video/mp4'
                  />
                  <track kind='captions' srcLang='en' label='English' />
                  Your browser does not support the video tag.
                </video>

                <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
                    <Play className='ml-1 h-8 w-8 text-white' />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className='dark:bg-dark-800 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700'>
                <div className='mb-6 flex items-center'>
                  <Play className='text-primary-600 dark:text-primary-400 mr-3 h-8 w-8' />
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                      Video Setup Guide
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>Complete walkthrough</p>
                  </div>
                </div>

                <p className='mb-6 text-gray-600 dark:text-gray-400'>
                  Watch our comprehensive video tutorial that showcases how to set up both SSP
                  Wallet and SSP Key with detailed step-by-step instructions.
                </p>

                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    Browser extension installation
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    Mobile app setup and sync
                  </div>
                  <div className='flex items-center text-sm text-gray-600 dark:text-gray-400'>
                    <CheckCircle className='mr-2 h-4 w-4 flex-shrink-0 text-green-500' />
                    Security best practices
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide */}
      <section className='section-padding dark:bg-dark-900 bg-gray-50'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-16 text-center'
          >
            <h2 className='heading-2 mb-4'>Step-by-Step Instructions</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Follow these detailed instructions to set up your secure crypto wallet
            </p>
          </motion.div>

          <div className='space-y-16'>
            {steps.map((phase, phaseIndex) => {
              const PhaseIcon = phase.icon
              return (
                <div key={phase.phase} className='relative'>
                  {/* Phase Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className='mb-8 flex items-center'
                  >
                    <div
                      className={`mr-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                        phase.color === 'blue'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      } `}
                    >
                      <PhaseIcon className='h-6 w-6' />
                    </div>
                    <div>
                      <div
                        className={`text-sm font-semibold tracking-wider uppercase ${phase.color === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'} `}
                      >
                        {phase.phase}
                      </div>
                      <h3 className='text-2xl font-bold text-gray-900 dark:text-white'>
                        {phase.title}
                      </h3>
                    </div>
                  </motion.div>

                  {/* Steps */}
                  <div className='grid gap-6'>
                    {phase.steps.map((step, stepIndex) => (
                      <StepCard
                        key={`${phaseIndex}-${stepIndex}`}
                        step={step}
                        phaseColor={phase.color}
                        index={stepIndex}
                      />
                    ))}
                  </div>

                  {/* Divider */}
                  {phaseIndex < steps.length - 1 && (
                    <div className='mt-16 flex items-center justify-center'>
                      <div className='h-px flex-1 bg-gray-300 dark:bg-gray-600'></div>
                      <div className='dark:bg-dark-800 mx-4 rounded-full border-2 border-gray-300 bg-white p-3 dark:border-gray-600'>
                        <ArrowRight className='h-5 w-5 text-gray-500 dark:text-gray-400' />
                      </div>
                      <div className='h-px flex-1 bg-gray-300 dark:bg-gray-600'></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className='section-padding'>
        <div className='container-custom'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='mb-12 text-center'
          >
            <h2 className='heading-2 mb-4'>Security Best Practices</h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400'>
              Follow these important security tips to keep your wallet safe
            </p>
          </motion.div>

          <div className='grid gap-8 md:grid-cols-3'>
            {securityTips.map((tip, index) => {
              const TipIcon = tip.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className='rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-900/20'
                >
                  <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'>
                    <TipIcon className='h-6 w-6' />
                  </div>
                  <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                    {tip.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400'>{tip.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Message */}
      <section className='section-padding bg-green-600 dark:bg-green-800'>
        <div className='container-custom text-center'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <CheckCircle className='mx-auto mb-6 h-16 w-16 text-white' />
            <h2 className='mb-4 text-3xl font-bold text-white'>Congratulations!</h2>
            <p className='mx-auto mb-8 max-w-2xl text-xl text-green-100'>
              By following these steps, you have successfully installed and set up both SSP Wallet
              and SSP Key, ensuring a secure and seamless user experience.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link
                href='/download'
                className='inline-flex items-center rounded-lg bg-white px-8 py-4 font-semibold text-green-600 transition-colors hover:bg-gray-50'
              >
                <Download className='mr-2 h-5 w-5' />
                Download Now
              </Link>
              <Link
                href='/support'
                className='inline-flex items-center rounded-lg border-2 border-white px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10'
              >
                Get Support
                <ArrowRight className='ml-2 h-5 w-5' />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
