'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Apple,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Chrome,
  Copy,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  QrCode,
  Send,
  Shield,
  Smartphone,
  Wifi,
  X,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

// Android Icon Component (since Lucide doesn't have it)
const AndroidIcon = ({ className }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z' />
  </svg>
)

const phases = [
  {
    id: 'wallet-setup',
    title: 'SSP Wallet Setup',
    subtitle: 'Create your browser wallet with secure seed phrase',
    steps: 4,
  },
  {
    id: 'key-setup',
    title: 'SSP Key Setup',
    subtitle: 'Set up mobile app with separate seed phrase',
    steps: 4,
  },
  {
    id: 'device-sync',
    title: 'Device Synchronization',
    subtitle: 'Connect your browser and mobile securely',
    steps: 3,
  },
  {
    id: 'transaction',
    title: 'Send Transaction',
    subtitle: 'Experience the dual-device security flow',
    steps: 4,
  },
]

// Mock seed phrases for demo (24 words)
const walletSeedPhrase = Array(24).fill('abandon')

const keySeedPhrase = Array(24).fill('abandon')

export function InteractiveDemo({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme()
  const [originalTheme, setOriginalTheme] = useState(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [showSeed, setShowSeed] = useState(false)
  const [seedConfirmed, setSeedConfirmed] = useState(false)
  const [showKeySeed, setShowKeySeed] = useState(false)
  const [keySeedConfirmed, setKeySeedConfirmed] = useState(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [devicesPaired, setDevicesPaired] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState('0.5')
  const [transactionAddress, setTransactionAddress] = useState('0x742d35Cc632C4532C3...aBF5')
  const [showNotification, setShowNotification] = useState(false)
  const [transactionSent, setTransactionSent] = useState(false)
  const [mobileKeyPassword, setMobileKeyPassword] = useState('SecurePass123')

  // Theme management for demo
  useEffect(() => {
    if (isOpen && originalTheme === null) {
      // Store the original theme only when first opening the demo
      setOriginalTheme(theme)
      // If user is in dark mode, temporarily switch to light
      if (theme === 'dark') {
        setTheme('light')
      }
    }
  }, [isOpen, theme, setTheme, originalTheme])

  // Cleanup effect to restore theme on unmount
  useEffect(() => {
    return () => {
      if (originalTheme !== null) {
        setTheme(originalTheme)
      }
    }
  }, [originalTheme, setTheme])

  // Enhanced close handler to restore theme
  const handleClose = () => {
    if (originalTheme !== null) {
      setTheme(originalTheme)
      setOriginalTheme(null)
    }
    onClose()
  }

  const goNext = () => {
    const currentPhaseData = phases[currentPhase]
    if (currentStep < currentPhaseData.steps - 1) {
      setCurrentStep(currentStep + 1)
    } else if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1)
      setCurrentStep(0)
    }
  }

  const goPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1)
      setCurrentStep(phases[currentPhase - 1].steps - 1)
    }
  }

  const reset = () => {
    setCurrentPhase(0)
    setCurrentStep(0)
    setShowSeed(false)
    setSeedConfirmed(false)
    setShowKeySeed(false)
    setKeySeedConfirmed(false)
    setBiometricsEnabled(false)
    setDevicesPaired(false)
    setShowNotification(false)
    setTransactionSent(false)
    setPassword('')
    setMobileKeyPassword('')
  }

  const renderWalletSetupStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-gray-200 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3'>
                  <div className='flex space-x-2'>
                    <div className='h-3 w-3 rounded-full bg-red-400'></div>
                    <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                    <div className='h-3 w-3 rounded-full bg-green-400'></div>
                  </div>
                  <div className='ml-4 text-xs text-gray-600'>Chrome Web Store</div>
                </div>
                <div className='flex h-full flex-col p-6 pt-8'>
                  <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                    <Chrome className='mx-auto mb-3 h-10 w-10 text-blue-600' />
                    <h3 className='text-center font-semibold text-blue-900'>SSP Wallet</h3>
                    <p className='text-center text-sm text-blue-700'>by InFlux Technologies</p>
                  </div>
                  <p className='mb-4 text-center text-sm text-gray-600'>
                    Secure, Simple, Powerful crypto wallet with 2-of-2 multisig
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      window.open(
                        'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
                        '_blank'
                      )
                    }
                    className='mb-4 w-full cursor-pointer rounded bg-blue-600 py-3 text-sm font-medium text-white'
                  >
                    Add to Chrome
                  </motion.button>
                  <div className='text-xs text-gray-500'>
                    <div className='flex flex-wrap items-center justify-center space-x-2'>
                      <span>⭐ 4.8</span>
                      <span>1K+ users</span>
                      <span>🛡️ Audited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Install SSP Wallet Extension</h3>
              <p className='text-gray-600'>
                Download the browser extension from Chrome Web Store. Available for Chrome, Brave,
                and Firefox.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-gray-200 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3'>
                  <Image
                    src='/ssp-logo-black.svg'
                    alt='SSP'
                    width={16}
                    height={16}
                    className='mr-2'
                  />
                  <div className='text-xs text-gray-600'>SSP Wallet Setup</div>
                </div>
                <div className='flex h-full flex-col p-6 pt-8'>
                  <Image
                    src='/ssp-logo-black.svg'
                    alt='SSP Logo'
                    width={48}
                    height={48}
                    className='mx-auto mb-4'
                  />
                  <h3 className='mb-4 text-center text-lg font-semibold'>Create Your Wallet</h3>
                  <div className='flex-1 space-y-4'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600'>
                        New Password
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder='Enter secure password'
                          className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute top-2 right-2 text-gray-400'
                        >
                          {showPassword ? (
                            <EyeOff className='h-4 w-4' />
                          ) : (
                            <Eye className='h-4 w-4' />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600'>
                        Confirm Password
                      </label>
                      <input
                        type='password'
                        placeholder='Confirm password'
                        className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
                      />
                    </div>
                    <div className='pt-2 text-sm'>
                      <label className='flex items-center'>
                        <input type='checkbox' className='mr-2' />I have read and agree to the Terms
                        of Service
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Create Secure Password</h3>
              <p className='text-gray-600'>
                This password encrypts your wallet locally. It never leaves your browser and
                protects your seed phrase.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-amber-300 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-amber-200 bg-amber-100 px-3'>
                  <AlertCircle className='mr-2 h-4 w-4 text-amber-600' />
                  <div className='text-xs text-amber-800'>Backup Required</div>
                </div>
                <div className='flex h-full flex-col overflow-hidden p-4 pt-3'>
                  <h3 className='mb-2 text-center text-lg font-semibold text-amber-800'>
                    Your Wallet Seed Phrase
                  </h3>
                  <div className='mb-3 rounded border border-red-200 bg-red-50 p-2'>
                    <p className='text-center text-xs font-medium text-red-800'>
                      ⚠️ Write this down and store it safely!
                    </p>
                  </div>

                  <div className='flex min-h-0 flex-1 flex-col'>
                    {!showSeed ? (
                      <div className='flex max-h-48 flex-1 flex-col justify-center rounded bg-gray-100 p-6 text-center'>
                        <p className='mb-4 text-sm text-gray-600'>
                          Click to reveal your 24-word seed phrase
                        </p>
                        <button
                          onClick={() => setShowSeed(true)}
                          className='cursor-pointer rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white'
                        >
                          <Eye className='mr-2 inline h-4 w-4' />
                          Show Seed Phrase
                        </button>
                      </div>
                    ) : (
                      <div className='flex h-full min-h-0 flex-col'>
                        <div className='mb-3 grid max-h-36 grid-cols-4 gap-1 overflow-y-auto text-xs'>
                          {walletSeedPhrase.map((word, index) => (
                            <div
                              key={index}
                              className='flex min-h-[1.2rem] items-center justify-center rounded border bg-gray-50 p-1 text-center text-xs'
                            >
                              <span className='mr-1 text-gray-400'>{index + 1}.</span>
                              <span>{word}</span>
                            </div>
                          ))}
                        </div>
                        <div className='mt-2 flex space-x-2'>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(walletSeedPhrase.join(' '))
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML =
                                '<svg class="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copied!'
                              setTimeout(() => (btn.innerHTML = originalText), 1500)
                            }}
                            className='flex-1 cursor-pointer rounded bg-gray-200 py-2 text-sm text-gray-700 hover:bg-gray-300'
                          >
                            <Copy className='mr-1 inline h-4 w-4' />
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              setSeedConfirmed(true)
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML = '✓ Confirmed!'
                              btn.className =
                                'flex-1 bg-green-700 text-white py-2 rounded text-sm font-medium cursor-pointer'
                              setTimeout(() => {
                                btn.innerHTML = originalText
                                btn.className =
                                  'flex-1 bg-green-600 text-white py-2 rounded text-sm font-medium cursor-pointer hover:bg-green-700'
                              }, 1500)
                            }}
                            className='flex-1 cursor-pointer rounded bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700'
                          >
                            ✓ I've Written It Down
                          </button>
                        </div>
                        {seedConfirmed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-2 rounded bg-green-100 p-2 text-center text-xs text-green-800'
                          >
                            ✓ Seed phrase confirmed and ready to proceed
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Backup Your Seed Phrase</h3>
              <p className='text-gray-600'>
                This 24-word phrase is your master key. Write it down and store it securely offline.
                This is seed phrase #1 of 2.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-green-300 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                  <div className='text-xs text-green-800'>Wallet Created</div>
                </div>
                <div className='flex h-full flex-col p-5 pt-6 text-center'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
                      <Check className='h-8 w-8 text-green-600' />
                    </div>
                  </motion.div>
                  <h3 className='mb-2 text-lg font-semibold text-green-800'>SSP Wallet Ready!</h3>
                  <p className='mb-3 text-sm text-gray-600'>Your browser wallet is set up with:</p>
                  <div className='mb-4 space-y-2 text-left text-sm'>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600' />
                      <span>Secure password protection</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600' />
                      <span>24-word seed phrase backed up</span>
                    </div>
                    <div className='flex items-center'>
                      <ArrowRight className='mr-2 h-4 w-4 flex-shrink-0 text-blue-600' />
                      <span className='text-blue-700'>Ready for mobile app setup</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-4'>
                    <div className='text-center'>
                      <div className='mb-1 flex items-center justify-center'>
                        <span className='text-sm font-medium text-blue-800'>Next Step</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className='ml-2 h-4 w-4 text-blue-600' />
                        </motion.div>
                      </div>
                      <p className='text-sm text-blue-700'>Set up SSP Key mobile app</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Wallet Setup Complete</h3>
              <p className='text-gray-600'>
                Your browser wallet is ready! Now you need to set up the mobile app for the second
                signature.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderKeySetupStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex flex-wrap justify-center gap-4 space-x-4 sm:space-x-6'>
              {/* iOS App Store */}
              <div className='relative h-[26rem] w-64 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg'>
                <div className='absolute inset-2 overflow-hidden rounded-xl bg-white'>
                  <div className='flex h-full flex-col p-4'>
                    <div className='mb-3 text-center'>
                      <Apple className='mx-auto mb-2 h-8 w-8 text-blue-600' />
                      <h3 className='text-sm font-semibold text-blue-900'>SSP Key</h3>
                      <p className='text-xs text-gray-600'>2FA Multisig Security</p>
                    </div>
                    <div className='flex-1 space-y-3 text-xs'>
                      <div className='flex justify-between'>
                        <span>Rating:</span>
                        <span>⭐⭐⭐⭐⭐ 5.0</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Developer:</span>
                        <span className='font-medium text-gray-800'>Influx Technologies</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Downloads:</span>
                        <span>1,000+</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Size:</span>
                        <span>35 MB</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Requires:</span>
                        <span>iOS 15.1+</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        window.open('https://apps.apple.com/us/app/ssp-key/id6463717332', '_blank')
                      }
                      className='mt-3 w-full cursor-pointer rounded bg-blue-600 py-2 text-sm font-medium text-white'
                    >
                      Download for iOS
                    </motion.button>
                    <div className='mt-3 space-y-1'>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Shield className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Security audited</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Fingerprint className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Touch ID / Face ID</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <QrCode className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>QR code pairing</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Eye className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Zero data storage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Android Play Store */}
              <div className='relative h-[26rem] w-64 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-green-500 to-green-600 shadow-lg'>
                <div className='absolute inset-2 overflow-hidden rounded-xl bg-white'>
                  <div className='flex h-full flex-col p-4'>
                    <div className='mb-3 text-center'>
                      <AndroidIcon className='mx-auto mb-2 h-8 w-8 text-green-600' />
                      <h3 className='text-sm font-semibold text-green-900'>SSP Key</h3>
                      <p className='text-xs text-gray-600'>2FA Multisig Security</p>
                    </div>
                    <div className='flex-1 space-y-3 text-xs'>
                      <div className='flex justify-between'>
                        <span>Rating:</span>
                        <span>⭐⭐⭐⭐⭐ 5.0</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Developer:</span>
                        <span className='font-medium text-gray-800'>Influx Technologies</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Downloads:</span>
                        <span>1,000+</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Size:</span>
                        <span>46 MB</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Requires:</span>
                        <span>Android 7.0+</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        window.open(
                          'https://play.google.com/store/apps/details?id=io.runonflux.sspkey',
                          '_blank'
                        )
                      }
                      className='mt-3 w-full cursor-pointer rounded bg-green-600 py-2 text-sm font-medium text-white'
                    >
                      Download for Android
                    </motion.button>
                    <div className='mt-3 space-y-1'>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Shield className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Security audited</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Fingerprint className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Biometric unlock</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <QrCode className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>QR code pairing</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Eye className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>Zero data storage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Download SSP Key Mobile App</h3>
              <p className='text-gray-600'>
                Install the mobile companion app from App Store or Google Play. This provides the
                second signature for your transactions.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-gray-300 bg-black shadow-lg'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <div className='mb-4 text-center'>
                    <Image
                      src='/ssp-logo-black.svg'
                      alt='SSP Key'
                      width={30}
                      height={30}
                      className='mx-auto mb-2'
                    />
                    <h4 className='text-sm font-semibold text-gray-900'>SSP Key Setup</h4>
                  </div>

                  <div className='max-h-48 flex-1 space-y-3'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600'>
                        App Password
                      </label>
                      <input
                        type='password'
                        value={mobileKeyPassword}
                        onChange={e => setMobileKeyPassword(e.target.value)}
                        placeholder='Create password'
                        className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
                      />
                    </div>

                    <div className='rounded border border-blue-200 bg-blue-50 p-2'>
                      <label className='flex items-center text-sm'>
                        <input
                          type='checkbox'
                          className='mr-2'
                          checked={biometricsEnabled}
                          onChange={e => setBiometricsEnabled(e.target.checked)}
                        />
                        <Fingerprint className='mr-2 h-4 w-4' />
                        <span>Enable Biometrics</span>
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goNext}
                      className='w-full cursor-pointer rounded bg-blue-600 py-2 text-sm font-medium text-white'
                    >
                      Continue Setup
                    </motion.button>
                  </div>

                  {biometricsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-2 rounded bg-green-100 p-2 text-sm text-green-800'
                    >
                      ✓ Touch ID / Face ID Enabled
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Secure Your Mobile Key</h3>
              <p className='text-gray-600'>
                Create a password for your mobile app and enable biometric authentication for
                enhanced security.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-amber-300 bg-black shadow-lg'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col overflow-hidden p-3 pt-2'>
                  <div className='mb-3 rounded bg-amber-100 p-2'>
                    <AlertCircle className='mx-auto mb-1 h-4 w-4 text-amber-600' />
                    <p className='text-center text-sm font-semibold text-amber-800'>
                      Key Seed Phrase
                    </p>
                  </div>

                  <div className='flex max-h-44 min-h-0 flex-1 flex-col'>
                    {!showKeySeed ? (
                      <div className='flex flex-1 flex-col justify-center text-center'>
                        <p className='mb-3 text-sm text-gray-600'>
                          Generate your separate mobile key seed phrase
                        </p>
                        <button
                          onClick={() => setShowKeySeed(true)}
                          className='w-full cursor-pointer rounded bg-amber-600 px-3 py-2 text-sm font-medium text-white'
                        >
                          <Eye className='mr-2 inline h-4 w-4' />
                          Show Key Seed
                        </button>
                      </div>
                    ) : (
                      <div className='flex flex-col'>
                        {/* Fixed height seed phrase grid */}
                        <div className='grid h-32 grid-cols-2 gap-1 overflow-y-auto text-xs'>
                          {keySeedPhrase.map((word, index) => (
                            <div
                              key={index}
                              className='flex min-h-[1.2rem] items-center justify-center rounded bg-gray-50 p-1 text-center text-xs'
                            >
                              <span className='text-gray-400'>{index + 1}.</span>
                              <span className='ml-1'>{word}</span>
                            </div>
                          ))}
                        </div>
                        {/* Fixed height button area */}
                        <div className='mt-1 flex h-8 space-x-1'>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(keySeedPhrase.join(' '))
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML = '✓ Copied!'
                              setTimeout(() => (btn.innerHTML = originalText), 1500)
                            }}
                            className='flex-1 cursor-pointer rounded bg-gray-200 py-1 text-xs text-gray-700 hover:bg-gray-300'
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              setKeySeedConfirmed(true)
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML = '✓ Confirmed!'
                              btn.className =
                                'flex-1 bg-green-700 text-white py-1 rounded text-xs font-medium cursor-pointer'
                              setTimeout(() => {
                                btn.innerHTML = originalText
                                btn.className =
                                  'flex-1 bg-green-600 text-white py-1 rounded text-xs font-medium cursor-pointer hover:bg-green-700'
                              }, 1500)
                            }}
                            className='flex-1 cursor-pointer rounded bg-green-600 py-1 text-xs font-medium text-white hover:bg-green-700'
                          >
                            ✓ Saved
                          </button>
                        </div>
                        {/* Fixed height container for confirmation message */}
                        <div className='mt-1 flex h-6 items-center justify-center'>
                          {keySeedConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className='rounded bg-green-100 px-2 py-1 text-center text-xs text-green-800'
                            >
                              ✓ Key seed confirmed
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='mt-6 rounded border border-red-200 bg-red-50 p-2'>
                    <p className='text-center text-xs text-red-800'>
                      ⚠️ Store separately from wallet seed!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Backup Mobile Key Seed</h3>
              <p className='text-gray-600'>
                This is a separate 24-word seed phrase for your mobile key. Both seeds are required
                for full SSP recovery.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100'>
                      <Check className='h-7 w-7 text-green-600' />
                    </div>
                  </motion.div>
                  <h4 className='mb-3 text-center text-base font-semibold text-green-800'>
                    SSP Key Ready!
                  </h4>
                  <div className='max-h-32 flex-1 space-y-2 text-left text-sm'>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600' />
                      <span>Password protection</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600' />
                      <span>Biometric security</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600' />
                      <span>Key seed backed up</span>
                    </div>
                    <div className='flex items-center'>
                      <Wifi className='mr-2 h-4 w-4 flex-shrink-0 text-blue-600' />
                      <span>Ready to pair</span>
                    </div>
                  </div>
                  <div className='mt-3 rounded border border-blue-200 bg-blue-50 p-3'>
                    <p className='text-center text-sm text-blue-800'>
                      Next: Scan QR code to connect devices
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Mobile Key Setup Complete</h3>
              <p className='text-gray-600'>
                Your mobile app is ready! Now let's connect it to your browser wallet for the 2-of-2
                security.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderDeviceSyncStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex flex-wrap justify-center gap-4 space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[420px] w-96 rounded-lg border-2 border-blue-300 bg-white shadow-lg'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-blue-200 bg-blue-100 px-3'>
                    <Chrome className='mr-2 h-4 w-4 text-blue-600' />
                    <div className='text-xs text-blue-800'>SSP Wallet - Sync Device</div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-4'>
                    <h4 className='mb-4 text-base font-semibold'>Connect Mobile Device</h4>

                    {/* QR Code with SSP Logo */}
                    <div className='relative mb-4 rounded-lg border-2 border-gray-300 bg-white p-4'>
                      <div className='relative h-32 w-32 rounded border border-gray-200 bg-white'>
                        {/* Enhanced QR Code Pattern */}
                        <div
                          className='absolute inset-0 grid grid-cols-21 p-1'
                          style={{ gap: '0.5px' }}
                        >
                          {[...Array(441)].map((_, i) => {
                            const row = Math.floor(i / 21)
                            const col = i % 21

                            // Create authentic QR code pattern
                            let isBlack = false

                            // Corner finder patterns (7x7 squares in corners)
                            if (
                              (row <= 6 && col <= 6) || // Top-left
                              (row <= 6 && col >= 14) || // Top-right
                              (row >= 14 && col <= 6)
                            ) {
                              // Bottom-left
                              // Outer border
                              if (
                                row === 0 ||
                                row === 6 ||
                                col === 0 ||
                                col === 6 ||
                                (row >= 14 && (row === 14 || row === 20)) ||
                                (col >= 14 && (col === 14 || col === 20))
                              ) {
                                isBlack = true
                              }
                              // Inner 3x3 center
                              if (
                                (row >= 2 && row <= 4 && col >= 2 && col <= 4) ||
                                (row >= 2 && row <= 4 && col >= 16 && col <= 18) ||
                                (row >= 16 && row <= 18 && col >= 2 && col <= 4)
                              ) {
                                isBlack = true
                              }
                            }

                            // Timing patterns (alternating dots on row 6 and col 6)
                            else if (row === 6 && col >= 8 && col <= 12) {
                              isBlack = col % 2 === 0
                            } else if (col === 6 && row >= 8 && row <= 12) {
                              isBlack = row % 2 === 0
                            }

                            // Alignment pattern (small square in bottom-right area)
                            else if (row >= 16 && row <= 18 && col >= 16 && col <= 18) {
                              if (
                                row === 16 ||
                                row === 18 ||
                                col === 16 ||
                                col === 18 ||
                                (row === 17 && col === 17)
                              ) {
                                isBlack = true
                              }
                            }

                            // Format information areas (around finder patterns)
                            else if (
                              (row === 8 && (col <= 5 || col >= 15)) ||
                              (col === 8 && (row <= 5 || row >= 15))
                            ) {
                              // Semi-random pattern for format info
                              isBlack = (row + col) % 3 === 0
                            }

                            // Data modules (the rest)
                            else {
                              // Create realistic data pattern
                              const seed = row * 21 + col
                              isBlack =
                                (seed % 3 === 0 ||
                                  seed % 7 === 1 ||
                                  seed % 11 === 3 ||
                                  (row + col) % 5 === 2 ||
                                  (row % 4 === 1 && col % 3 === 0)) &&
                                !((row + col) % 13 === 0)
                            }

                            return (
                              <div
                                key={i}
                                className={`${isBlack ? 'bg-black' : 'bg-white'} aspect-square`}
                              ></div>
                            )
                          })}
                        </div>

                        {/* SSP Logo in center */}
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='rounded border border-gray-300 bg-white p-1'>
                            <Image src='/ssp-logo-black.svg' alt='SSP' width={16} height={16} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className='mb-4 text-center text-sm text-gray-600'>
                      Scan this QR code with SSP Key app
                    </p>

                    <div className='mb-3 w-full rounded border border-gray-200 bg-gray-50 p-3'>
                      <div className='mb-1 text-xs text-gray-600'>Connection ID:</div>
                      <div className='rounded bg-white p-2 font-mono text-xs break-all'>
                        eth:xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8Nq...
                      </div>
                    </div>

                    <div className='text-center'>
                      <button
                        onClick={() => window.open('https://sspwallet.io', '_blank')}
                        className='text-xs text-blue-600 hover:underline'
                      >
                        Learn more at sspwallet.io
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[420px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col p-3 pt-2'>
                    <div className='mb-3 text-center'>
                      <QrCode className='mx-auto mb-2 h-8 w-8 text-green-600' />
                      <h4 className='text-sm font-semibold'>Scan QR Code</h4>
                    </div>

                    <div className='flex max-h-48 flex-1 items-center justify-center rounded border-2 border-dashed border-green-300 p-3'>
                      <div className='text-center'>
                        <div className='mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded border-2 border-green-400'>
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className='text-lg'
                          >
                            📷
                          </motion.div>
                        </div>
                        <p className='text-xs text-gray-600'>Position QR code in frame</p>
                      </div>
                    </div>

                    <button className='mt-2 w-full rounded bg-green-600 py-2 text-sm font-medium text-white'>
                      Ready to Scan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Generate Pairing QR Code</h3>
              <p className='text-gray-600'>
                Your browser wallet shows a QR code with SSP logo. Open SSP Key app and scan to
                connect securely.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[450px] w-96 rounded-lg border-2 border-blue-300 bg-white shadow-lg'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-blue-200 bg-blue-100 px-3'>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Wifi className='mr-2 h-4 w-4 text-blue-600' />
                    </motion.div>
                    <div className='text-xs text-blue-800'>Synchronising...</div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-6'>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className='mb-6 h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600'
                    ></motion.div>
                    <h4 className='mb-3 text-lg font-semibold'>Pairing in Progress</h4>
                    <p className='mb-6 text-center text-sm text-gray-600'>
                      Establishing secure connection with mobile device...
                    </p>
                    <div className='mb-4 h-3 w-full rounded-full bg-gray-200'>
                      <motion.div
                        className='h-3 rounded-full bg-blue-600'
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'easeInOut' }}
                      ></motion.div>
                    </div>
                    <div className='mb-4 text-sm text-gray-500'>
                      Exchanging encryption keys and public keys...
                    </div>

                    <div className='mb-2 w-full rounded border border-blue-200 bg-blue-50 p-3'>
                      <div className='text-center text-xs text-blue-800'>
                        <div className='mb-1 font-semibold'>Connection Details</div>
                        <div>Establishing secure SSP relay connection...</div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: devicesPaired ? 1 : 0, scale: devicesPaired ? 1 : 0.8 }}
                      transition={{ duration: 0.5, delay: 3.5 }}
                      className='rounded bg-green-100 p-2 text-center'
                    >
                      <CheckCircle className='mx-auto mb-1 h-5 w-5 text-green-600' />
                      <p className='text-xs font-semibold text-green-800'>
                        Synchronisation Complete!
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[450px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col justify-start p-2 pt-5 pb-10'>
                    <div className='mb-1.5 rounded bg-green-100 p-1.5'>
                      <div className='text-center'>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <CheckCircle className='mx-auto mb-0.5 h-4 w-4 text-green-600' />
                        </motion.div>
                        <p className='text-xs font-semibold text-green-800'>QR Code Scanned!</p>
                      </div>
                    </div>

                    <div className='mb-1.5 flex-1 space-y-1 text-xs'>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Browser Wallet:</div>
                        <div className='font-mono text-xs'>Chrome Extension</div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Connection ID:</div>
                        <div className='font-mono text-xs break-all'>eth:xpub661My...</div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Encryption:</div>
                        <div className='font-mono text-xs'>AES-256-GCM</div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDevicesPaired(true)
                        setTimeout(() => goNext(), 1000)
                      }}
                      className='w-full rounded bg-green-600 py-1.5 text-sm font-medium text-white'
                    >
                      Confirm Pairing
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Scanning QR Code</h3>
              <p className='text-gray-600'>
                The mobile app reads the QR code and establishes an encrypted connection with your
                browser wallet.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[450px] w-96 rounded-lg border-2 border-green-300 bg-white shadow-lg'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                    <div className='text-xs text-green-800'>Device Connected</div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-6'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
                        <Check className='h-10 w-10 text-green-600' />
                      </div>
                    </motion.div>
                    <h4 className='mb-2 text-lg font-semibold text-green-800'>
                      Successfully Paired!
                    </h4>
                    <p className='mb-4 text-center text-sm text-gray-600'>
                      Your devices are now securely connected
                    </p>

                    <div className='mb-4 w-full space-y-3 text-sm'>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3'>
                        <span>🔐 Encryption:</span>
                        <span className='font-semibold text-green-700'>Active</span>
                      </div>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3'>
                        <span>📱 Mobile Device:</span>
                        <span className='font-semibold text-green-700'>Connected</span>
                      </div>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3'>
                        <span>🔑 2-of-2 Multisig:</span>
                        <span className='font-semibold text-green-700'>Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[450px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='pg-5 flex h-full flex-col justify-start p-2 pt-5 pb-10'>
                    <div className='mb-1.5 rounded bg-green-100 p-1.5 text-center'>
                      <Shield className='mx-auto mb-0.5 h-4 w-4 text-green-600' />
                      <p className='text-xs font-semibold text-green-800'>Secure Connection</p>
                    </div>

                    <div className='mb-1.5 flex-1 space-y-1 text-xs'>
                      <div className='rounded bg-gray-50 p-1 text-center'>
                        <div className='mb-0.5 text-gray-600'>Ready for Transactions</div>
                        <div className='flex items-center justify-center'>
                          <div className='mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
                          <span className='text-xs font-semibold text-green-700'>Online</span>
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Connection Type:</div>
                        <div className='text-xs font-semibold'>SSP Relay Secured</div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Multisig Status:</div>
                        <div className='text-xs font-semibold text-green-700'>2-of-2 Active</div>
                      </div>
                    </div>

                    <div className='rounded border border-blue-200 bg-blue-50 p-1'>
                      <p className='text-center text-xs text-blue-800'>
                        Wallet protected by true 2-of-2 multisig!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Devices Successfully Paired</h3>
              <p className='text-gray-600'>
                Perfect! Your browser and mobile are now connected with end-to-end encryption. You
                can now send secure transactions.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderTransactionStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-4 h-[420px] w-[380px] rounded-lg border-2 border-gray-200 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3'>
                  <Send className='mr-2 h-4 w-4 text-gray-600' />
                  <div className='text-xs text-gray-600'>Send Transaction</div>
                </div>
                <div className='flex flex-col p-3 pt-5'>
                  <h3 className='mb-2 text-center text-base font-semibold'>Send Ethereum</h3>
                  <div className='flex-1 space-y-5'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600'>
                        Recipient Address
                      </label>
                      <input
                        type='text'
                        value={transactionAddress}
                        onChange={e => setTransactionAddress(e.target.value)}
                        className='w-full rounded border border-gray-300 px-2 py-1 font-mono text-sm'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600'>
                        Amount (ETH)
                      </label>
                      <input
                        type='text'
                        value={transactionAmount}
                        onChange={e => setTransactionAmount(e.target.value)}
                        className='w-full rounded border border-gray-300 px-2 py-1 text-sm'
                      />
                    </div>
                    <div className='rounded border border-gray-200 bg-gray-50 p-2 text-left'>
                      <div className='mb-1 text-sm text-gray-600'>Transaction Summary</div>
                      <div className='space-y-1 text-sm'>
                        <div className='flex justify-between'>
                          <span>Amount:</span>
                          <span className='font-semibold'>{transactionAmount} ETH</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Gas Fee:</span>
                          <span>~0.002 ETH ($6.00)</span>
                        </div>
                        <div className='mt-1 flex justify-between border-t border-gray-300 pt-1'>
                          <span className='font-semibold'>Total:</span>
                          <span className='font-semibold'>
                            {(parseFloat(transactionAmount) + 0.002).toFixed(3)} ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goNext}
                    className='mt-5 w-full cursor-pointer rounded bg-blue-600 py-2 text-sm font-medium text-white'
                  >
                    Send Transaction
                  </motion.button>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Create Transaction</h3>
              <p className='text-gray-600'>
                Fill in the recipient address and amount. The transaction will require further
                approval from your mobile device.
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-8 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[420px] w-80 rounded-lg border-2 border-gray-300 bg-white shadow-lg'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3'>
                    <div className='flex items-center'>
                      <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-500'></div>
                      <div className='text-xs text-gray-600'>Waiting for mobile approval...</div>
                    </div>
                  </div>
                  <div className='flex h-full flex-col p-4 pt-4 text-center'>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className='mx-auto mb-3 h-12 w-12 rounded-full border-4 border-gray-200 border-t-amber-500'
                    ></motion.div>
                    <h4 className='mb-2 font-semibold'>Pending Mobile Approval</h4>
                    <p className='mb-3 text-sm text-gray-600'>
                      Signature 1/2 complete. Check your mobile device to approve the transaction.
                    </p>

                    <div className='mb-2 rounded border border-amber-200 bg-amber-50 p-2'>
                      <div className='text-sm text-amber-800'>
                        <div className='font-semibold'>Transaction Details</div>
                        <div className='mt-1 text-xs'>
                          Send {transactionAmount} ETH
                          <br />
                          To: {transactionAddress.substring(0, 20)}...
                        </div>
                      </div>
                    </div>

                    <div className='text-xs text-gray-500'>
                      <div className='flex items-center justify-center'>
                        <Smartphone className='mr-1 h-3 w-3' />
                        Notification sent to mobile device
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App with Notification */}
              <div className='relative h-[420px] w-72 rounded-2xl border-2 border-red-300 bg-black shadow-lg'>
                {showNotification && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className='absolute -top-16 right-0 left-0 z-10 rounded-t-xl bg-red-500 p-2 text-white'
                  >
                    <div className='flex items-center text-xs'>
                      <Bell className='mr-1 h-3 w-3' />
                      Transaction Approval Required
                    </div>
                  </motion.div>
                )}
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col p-3 pt-2'>
                    <div className='mb-2 rounded bg-red-100 p-1'>
                      <div className='flex items-center text-red-800'>
                        <Bell className='mr-2 h-5 w-5' />
                        <span className='text-sm font-semibold'>Transaction Approval</span>
                      </div>
                    </div>

                    <div className='space-y-1 text-sm'>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Amount</div>
                        <div className='font-semibold'>{transactionAmount} ETH</div>
                        <div className='text-gray-500'>
                          ${(parseFloat(transactionAmount) * 3000).toFixed(2)}
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>To Address</div>
                        <div className='font-mono text-sm'>
                          {transactionAddress.substring(0, 18)}...
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Gas Fee</div>
                        <div className='font-semibold'>0.002 ETH</div>
                      </div>
                      <div className='rounded bg-gray-50 p-1'>
                        <div className='text-gray-600'>Status</div>
                        <div className='font-semibold text-amber-600'>Awaiting Approval (2/2)</div>
                      </div>
                    </div>

                    <div className='mt-10 space-y-1'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='w-full rounded bg-green-600 py-1 text-sm font-medium text-white'
                      >
                        {biometricsEnabled ? (
                          <div className='flex items-center justify-center'>
                            <Fingerprint className='mr-2 h-4 w-4' />
                            Approve with Touch ID
                          </div>
                        ) : (
                          'Approve (2/2)'
                        )}
                      </motion.button>
                      <button className='w-full rounded bg-gray-300 py-1 text-sm text-gray-700'>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Mobile Confirmation Required</h3>
              <p className='text-gray-600'>
                A notification appeared on your mobile device. Review the transaction details and
                approve with {biometricsEnabled ? 'biometric authentication' : 'your password'}.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-8 h-[450px] w-72 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <div className='mb-3 rounded bg-green-100 p-2 text-center'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.5 }}
                    >
                      <CheckCircle className='mx-auto mb-2 h-8 w-8 text-green-600' />
                    </motion.div>
                    <p className='text-sm font-semibold text-green-800'>Transaction Broadcasted!</p>
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='mb-3 rounded bg-gray-50 p-2'>
                      <div className='mb-1 text-gray-600'>Signatures Collected</div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Check className='mr-2 h-4 w-4 text-green-600' />
                          <span className='text-sm'>Browser Wallet (1/2)</span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='mr-2 h-4 w-4 text-green-600' />
                          <span className='text-sm'>Mobile Key (2/2)</span>
                        </div>
                      </div>
                    </div>

                    <div className='mb-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-center'>
                      <div className='mb-1 font-semibold text-yellow-700'>Network Status</div>
                      <div className='text-sm text-yellow-800'>Confirming on Ethereum network</div>
                      <div className='mt-1 text-xs text-yellow-600'>Usually takes 1-3 minutes</div>
                    </div>

                    <div className='rounded bg-gray-50 p-2'>
                      <div className='mb-1 text-xs text-gray-600'>Transaction Hash</div>
                      <div className='mb-2 font-mono text-xs text-gray-800'>0xabc123...def789</div>
                      <button
                        onClick={() =>
                          window.open('https://etherscan.io/tx/0xabc123def789', '_blank')
                        }
                        className='w-full rounded bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700'
                      >
                        View on Etherscan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold'>Transaction Submitted</h3>
              <p className='text-gray-600'>
                Perfect! Both signatures collected and transaction broadcast to Ethereum. The
                network is now mining and confirming your secure 2-of-2 multisig transaction.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-80 w-[420px] rounded-lg border-2 border-green-300 bg-white shadow-lg'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-600' />
                  <div className='text-xs text-green-800'>Transaction Confirmed</div>
                </div>
                <div className='flex h-full flex-col p-3 pt-2 text-center'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className='mb-2'
                  >
                    <div className='mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                      <Check className='h-5 w-5 text-green-600' />
                    </div>
                  </motion.div>
                  <h3 className='mb-2 text-base font-semibold text-green-800'>
                    Transaction Successful!
                  </h3>
                  <p className='mb-2 text-xs text-gray-600'>Confirmed on Ethereum network.</p>

                  <div className='mb-2 rounded border border-gray-200 bg-gray-50 p-2 text-left'>
                    <div className='space-y-1 text-xs'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Amount:</span>
                        <span className='font-semibold'>{transactionAmount} ETH</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600'>Gas Fee:</span>
                        <span>0.002 ETH</span>
                      </div>
                      <div className='flex justify-between border-t border-gray-300 pt-1'>
                        <span className='text-gray-600'>Hash:</span>
                        <span className='font-mono text-xs'>0xabc123...def789</span>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        window.open('https://etherscan.io/tx/0xabc123def789', '_blank')
                      }
                      className='w-full cursor-pointer rounded bg-blue-600 py-1.5 text-xs font-medium text-white'
                    >
                      View on Etherscan
                    </motion.button>
                    <button className='w-full rounded bg-gray-200 py-1.5 text-xs font-medium text-gray-700'>
                      Send Another Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-2xl px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold'>🎉 Transaction Complete!</h3>
              <p className='mb-4 text-gray-600'>
                Your funds have been securely transferred using true 2-of-2 multisignature
                technology. Both devices were required to authorize and sign this transaction.
              </p>

              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
                <h4 className='mb-3 font-semibold text-blue-900'>Why This Is Ultra-Secure</h4>
                <div className='grid grid-cols-2 gap-3 text-sm text-blue-800'>
                  <div className='flex items-center'>
                    <Shield className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>2 separate devices required</span>
                  </div>
                  <div className='flex items-center'>
                    <Lock className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>2 separate seed phrases</span>
                  </div>
                  <div className='flex items-center'>
                    <Zap className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>True multisignature (BIP48)</span>
                  </div>
                  <div className='flex items-center'>
                    <Eye className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>Zero server storage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const renderCurrentStep = () => {
    switch (phases[currentPhase].id) {
      case 'wallet-setup':
        return renderWalletSetupStep()
      case 'key-setup':
        return renderKeySetupStep()
      case 'device-sync':
        return renderDeviceSyncStep()
      case 'transaction':
        return renderTransactionStep()
      default:
        return null
    }
  }

  const isLastStep =
    currentPhase === phases.length - 1 && currentStep === phases[currentPhase].steps - 1

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md'
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className='relative mx-4 max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='from-primary-600 bg-gradient-to-r to-blue-600 p-6 text-white'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>Complete SSP Wallet Experience</h2>
              <p className='text-primary-100 mt-1'>
                Full setup and transaction flow with true 2-of-2 multisig security
              </p>
            </div>
            <button
              onClick={handleClose}
              className='flex h-10 w-10 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30'
              aria-label='Close demo'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          {/* Progress */}
          <div className='mt-6 space-y-3'>
            <div className='flex items-center justify-between'>
              {phases.map((phase, index) => (
                <div key={phase.id} className='flex items-center'>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      index <= currentPhase
                        ? 'text-primary-600 bg-white'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className='ml-2'>
                    <div
                      className={`text-sm font-medium ${
                        index <= currentPhase ? 'text-white' : 'text-white/60'
                      }`}
                    >
                      {phase.title}
                    </div>
                    <div
                      className={`text-xs ${
                        index <= currentPhase ? 'text-primary-100' : 'text-white/40'
                      }`}
                    >
                      {phase.subtitle}
                    </div>
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight
                      className={`mx-4 h-4 w-4 ${
                        index < currentPhase ? 'text-white' : 'text-white/40'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Progress */}
            <div className='flex space-x-1'>
              {[...Array(phases[currentPhase].steps)].map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= currentStep ? 'bg-white' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex h-[600px] items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8'>
          <AnimatePresence mode='wait'>
            <motion.div
              key={`${currentPhase}-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className='flex h-full w-full items-center justify-center'
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className='flex items-center justify-between bg-gray-50 px-8 py-4'>
          <button
            onClick={goPrevious}
            disabled={currentPhase === 0 && currentStep === 0}
            className='flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            Previous
          </button>

          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-500'>
              {phases[currentPhase].title} - Step {currentStep + 1} of {phases[currentPhase].steps}
            </span>

            {isLastStep ? (
              <div className='flex space-x-2'>
                <button onClick={reset} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
                  Restart Demo
                </button>
                <Link href='/download'>
                  <button
                    onClick={handleClose}
                    className='bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 text-white transition-colors'
                  >
                    Download SSP Wallet
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={goNext}
                className='bg-primary-600 hover:bg-primary-700 flex items-center rounded-lg px-6 py-2 text-white transition-colors'
              >
                Next
                <ChevronRight className='ml-1 h-4 w-4' />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
