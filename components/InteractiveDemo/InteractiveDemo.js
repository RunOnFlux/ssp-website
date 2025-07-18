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
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

// Android Icon Component (since Lucide doesn't have it)
const AndroidIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
  </svg>
)

const phases = [
  {
    id: 'wallet-setup',
    title: 'SSP Wallet Setup',
    subtitle: 'Create your browser wallet with secure seed phrase',
    steps: 4
  },
  {
    id: 'key-setup',
    title: 'SSP Key Setup', 
    subtitle: 'Set up mobile app with separate seed phrase',
    steps: 4
  },
  {
    id: 'device-sync',
    title: 'Device Synchronization',
    subtitle: 'Connect your browser and mobile securely',
    steps: 3
  },
  {
    id: 'transaction',
    title: 'Send Transaction',
    subtitle: 'Experience the dual-device security flow',
    steps: 5
  }
]

// Mock seed phrases for demo (24 words)
const walletSeedPhrase = Array(24).fill('abandon')

const keySeedPhrase = Array(24).fill('abandon')

export function InteractiveDemo({ isOpen, onClose }) {
  const { theme, setTheme } = useTheme()
  const [originalTheme, setOriginalTheme] = useState(null)
  
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
  const [mobileKeyPassword, setMobileKeyPassword] = useState('')

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
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-gray-200 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3">
                  <div className="flex space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-xs text-gray-600">Chrome Web Store</div>
                </div>
                <div className="p-6 pt-8 flex flex-col h-full">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <Chrome className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold text-blue-900 text-center">SSP Wallet</h3>
                    <p className="text-sm text-blue-700 text-center">by InFlux Technologies</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 text-center">Secure, Simple, Powerful crypto wallet with 2-of-2 multisig</p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd', '_blank')}
                    className="w-full bg-blue-600 text-white py-3 rounded text-sm font-medium mb-4 cursor-pointer"
                  >
                    Add to Chrome
                  </motion.button>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center justify-center space-x-2 flex-wrap">
                      <span>⭐ 4.8</span>
                      <span>1K+ users</span>
                      <span>🛡️ Audited</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Install SSP Wallet Extension</h3>
              <p className="text-gray-600">Download the browser extension from Chrome Web Store. Available for Chrome, Brave, and Firefox.</p>
            </div>
          </div>
        )

              case 1:
        return (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-gray-200 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3">
                  <Image src="/ssp-logo-black.svg" alt="SSP" width={16} height={16} className="mr-2" />
                  <div className="text-xs text-gray-600">SSP Wallet Setup</div>
                </div>
                <div className="p-6 pt-8 flex flex-col h-full">
                  <Image 
                    src="/ssp-logo-black.svg" 
                    alt="SSP Logo" 
                    width={48} 
                    height={48} 
                    className="mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-4 text-center">Create Your Wallet</h3>
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1 text-left">New Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter secure password"
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1 text-left">Confirm Password</label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="text-sm pt-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-2" />
                        I have read and agree to the Terms of Service
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Create Secure Password</h3>
              <p className="text-gray-600">This password encrypts your wallet locally. It never leaves your browser and protects your seed phrase.</p>
            </div>
          </div>
        )

              case 2:
        return (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-amber-300 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-amber-100 border-b border-amber-200 flex items-center px-3">
                  <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
                  <div className="text-xs text-amber-800">Backup Required</div>
                </div>
                <div className="p-4 pt-3 flex flex-col h-full overflow-hidden">
                  <h3 className="text-lg font-semibold mb-2 text-amber-800 text-center">Your Wallet Seed Phrase</h3>
                  <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                    <p className="text-xs text-red-800 font-medium text-center">⚠️ Write this down and store it safely!</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col min-h-0">
                    {!showSeed ? (
                      <div className="bg-gray-100 p-6 rounded text-center flex-1 flex flex-col justify-center max-h-48">
                        <p className="text-sm text-gray-600 mb-4">Click to reveal your 24-word seed phrase</p>
                        <button
                          onClick={() => setShowSeed(true)}
                          className="bg-amber-600 text-white px-4 py-2 rounded text-sm font-medium cursor-pointer"
                        >
                          <Eye className="h-4 w-4 inline mr-2" />
                          Show Seed Phrase
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full min-h-0">
                        <div className="grid grid-cols-4 gap-1 text-xs overflow-y-auto mb-3 max-h-36">
                          {walletSeedPhrase.map((word, index) => (
                            <div key={index} className="bg-gray-50 p-1 rounded border text-center min-h-[1.2rem] flex items-center justify-center text-xs">
                              <span className="text-gray-400 mr-1">{index + 1}.</span>
                              <span>{word}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(walletSeedPhrase.join(' '))
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML = '<svg class="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>Copied!'
                              setTimeout(() => btn.innerHTML = originalText, 1500)
                            }}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded text-sm cursor-pointer hover:bg-gray-300"
                          >
                            <Copy className="h-4 w-4 inline mr-1" />
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              setSeedConfirmed(true)
                              // Show brief feedback
                              const btn = event.target
                              const originalText = btn.innerHTML
                              btn.innerHTML = '✓ Confirmed!'
                              btn.className = 'flex-1 bg-green-700 text-white py-2 rounded text-sm font-medium cursor-pointer'
                              setTimeout(() => {
                                btn.innerHTML = originalText
                                btn.className = 'flex-1 bg-green-600 text-white py-2 rounded text-sm font-medium cursor-pointer hover:bg-green-700'
                              }, 1500)
                            }}
                            className="flex-1 bg-green-600 text-white py-2 rounded text-sm font-medium cursor-pointer hover:bg-green-700"
                          >
                            ✓ I've Written It Down
                          </button>
                        </div>
                        {seedConfirmed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-green-100 text-green-800 text-xs p-2 rounded text-center"
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
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Backup Your Seed Phrase</h3>
              <p className="text-gray-600">This 24-word phrase is your master key. Write it down and store it securely offline. This is seed phrase #1 of 2.</p>
            </div>
          </div>
        )

              case 3:
        return (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-96 w-[450px] rounded-lg border-2 border-green-300 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-green-100 border-b border-green-200 flex items-center px-3">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <div className="text-xs text-green-800">Wallet Created</div>
                </div>
                <div className="p-5 pt-6 flex flex-col h-full text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2 text-green-800">SSP Wallet Ready!</h3>
                  <p className="text-sm text-gray-600 mb-3">Your browser wallet is set up with:</p>
                  <div className="space-y-2 text-sm text-left mb-4">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>Secure password protection</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      <span>24-word seed phrase backed up</span>
                    </div>
                    <div className="flex items-center">
                      <ArrowRight className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                      <span className="text-blue-700">Ready for mobile app setup</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <span className="text-sm font-medium text-blue-800">Next Step</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="h-4 w-4 text-blue-600 ml-2" />
                        </motion.div>
                      </div>
                      <p className="text-sm text-blue-700">Set up SSP Key mobile app</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Wallet Setup Complete</h3>
              <p className="text-gray-600">Your browser wallet is ready! Now you need to set up the mobile app for the second signature.</p>
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
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 sm:space-x-6 mb-6 flex-wrap gap-4">
              {/* iOS App Store */}
              <div className="relative h-80 w-48 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg">
                <div className="absolute inset-2 rounded-xl bg-white overflow-hidden">
                  <div className="p-4 flex flex-col h-full">
                    <div className="text-center mb-3">
                      <Apple className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h3 className="font-semibold text-blue-900 text-sm">SSP Key</h3>
                      <p className="text-xs text-gray-600">Secure 2FA for SSP Wallet</p>
                    </div>
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span>⭐⭐⭐⭐⭐ 4.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Developer:</span>
                        <span className="text-right">Influx Technologies</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span>Finance</span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('https://apps.apple.com/app/ssp-key/id6443885565', '_blank')}
                      className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium mt-3 cursor-pointer"
                    >
                      Download for iOS
                    </motion.button>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Shield className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Security audited</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Fingerprint className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Touch ID / Face ID</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Android Play Store */}
              <div className="relative h-80 w-48 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-green-500 to-green-600 shadow-lg">
                <div className="absolute inset-2 rounded-xl bg-white overflow-hidden">
                  <div className="p-4 flex flex-col h-full">
                    <div className="text-center mb-3">
                      <AndroidIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h3 className="font-semibold text-green-900 text-sm">SSP Key</h3>
                      <p className="text-xs text-gray-600">2FA Multisig Security</p>
                    </div>
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span>⭐⭐⭐⭐⭐ 4.9</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Developer:</span>
                        <span className="text-right">Influx Technologies</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads:</span>
                        <span>1,000+</span>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open('https://play.google.com/store/apps/details?id=com.sspwallet.key', '_blank')}
                      className="w-full bg-green-600 text-white py-2 rounded text-sm font-medium mt-3 cursor-pointer"
                    >
                      Download for Android
                    </motion.button>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs text-gray-500 flex items-center">
                        <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Zero data storage</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <QrCode className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>QR code pairing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg px-4">
              <h3 className="text-xl font-semibold mb-3">Download SSP Key Mobile App</h3>
              <p className="text-gray-600">Install the mobile companion app from App Store or Google Play. This provides the second signature for your transactions.</p>
            </div>
          </div>
        )

              case 1:
        return (
          <div className="flex flex-col items-center">
            <div className="relative h-80 w-52 mx-auto mb-6 rounded-2xl border-2 border-gray-300 bg-black shadow-lg">
              <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                <div className="h-6 bg-gray-900 rounded-t-xl relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                </div>
                <div className="p-3 pt-2 flex flex-col h-full">
                  <div className="text-center mb-4">
                    <Image 
                      src="/ssp-logo-black.svg" 
                      alt="SSP Key" 
                      width={28} 
                      height={28} 
                      className="mx-auto mb-2"
                    />
                    <h4 className="font-semibold text-gray-900 text-sm">SSP Key Setup</h4>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1 text-left">App Password</label>
                      <input
                        type="password"
                        value={mobileKeyPassword}
                        onChange={(e) => setMobileKeyPassword(e.target.value)}
                        placeholder="Create password"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      />
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded p-2">
                      <label className="flex items-center text-xs">
                        <input 
                          type="checkbox" 
                          className="mr-1" 
                          checked={biometricsEnabled}
                          onChange={(e) => setBiometricsEnabled(e.target.checked)}
                        />
                        <Fingerprint className="h-3 w-3 mr-1" />
                        <span>Enable Biometrics</span>
                      </label>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-600 text-white py-2 rounded text-xs font-medium cursor-pointer"
                      disabled={!mobileKeyPassword}
                    >
                      Continue Setup
                    </motion.button>
                  </div>
                  
                  {biometricsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 bg-green-100 text-green-800 text-xs p-2 rounded"
                    >
                      ✓ Touch ID / Face ID Enabled
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Secure Your Mobile Key</h3>
              <p className="text-gray-600">Create a password for your mobile app and enable biometric authentication for enhanced security.</p>
            </div>
          </div>
        )

              case 2:
        return (
          <div className="flex flex-col items-center">
            <div className="relative h-96 w-64 mx-auto mb-6 rounded-2xl border-2 border-amber-300 bg-black shadow-lg">
              <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                <div className="h-6 bg-gray-900 rounded-t-xl relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                </div>
                <div className="p-3 pt-2 flex flex-col h-full overflow-hidden">
                  <div className="bg-amber-100 p-2 rounded mb-3">
                    <AlertCircle className="h-4 w-4 mx-auto mb-1 text-amber-600" />
                    <p className="text-sm font-semibold text-amber-800 text-center">Key Seed Phrase</p>
                  </div>
                  
                  <div className="flex-1 flex flex-col min-h-0">
                    {!showKeySeed ? (
                      <div className="text-center flex-1 flex flex-col justify-center">
                        <p className="text-sm text-gray-600 mb-3">Generate your separate mobile key seed phrase</p>
                        <button
                          onClick={() => setShowKeySeed(true)}
                          className="bg-amber-600 text-white px-3 py-2 rounded text-sm font-medium w-full cursor-pointer"
                        >
                          <Eye className="h-4 w-4 inline mr-2" />
                          Show Key Seed
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full min-h-0">
                        <div className="grid grid-cols-2 gap-1 text-xs overflow-y-auto mb-2 max-h-48">
                          {keySeedPhrase.map((word, index) => (
                            <div key={index} className="bg-gray-50 p-1 rounded text-xs text-center min-h-[1.25rem] flex items-center justify-center">
                              <span className="text-gray-400">{index + 1}.</span> {word}
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-1 mt-auto">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(keySeedPhrase.join(' '))
                            }}
                            className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-xs cursor-pointer"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => setKeySeedConfirmed(true)}
                            className="flex-1 bg-green-600 text-white py-1 rounded text-xs font-medium cursor-pointer"
                          >
                            ✓ Saved
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 bg-red-50 border border-red-200 rounded p-2">
                    <p className="text-xs text-red-800 text-center">⚠️ Store separately from your wallet seed!</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Backup Mobile Key Seed</h3>
              <p className="text-gray-600">This is a separate 24-word seed phrase for your mobile key. Both seeds are required for wallet recovery.</p>
            </div>
          </div>
        )

              case 3:
        return (
          <div className="flex flex-col items-center">
            <div className="relative h-80 w-52 mx-auto mb-6 rounded-2xl border-2 border-green-300 bg-black shadow-lg">
              <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                <div className="h-6 bg-gray-900 rounded-t-xl relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                </div>
                <div className="p-3 pt-2 flex flex-col h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                  </motion.div>
                  <h4 className="font-semibold text-green-800 mb-2 text-center text-sm">SSP Key Ready!</h4>
                  <div className="space-y-2 text-xs text-left flex-1">
                    <div className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                      <span>Password protection</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                      <span>Biometric security</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-3 w-3 text-green-600 mr-2 flex-shrink-0" />
                      <span>Key seed backed up</span>
                    </div>
                    <div className="flex items-center">
                      <Wifi className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                      <span>Ready to pair</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
                    <p className="text-xs text-blue-800 text-center">Next: Scan QR code to connect devices</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Mobile Key Setup Complete</h3>
              <p className="text-gray-600">Your mobile app is ready! Now let's connect it to your browser wallet for the 2-of-2 security.</p>
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
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-4 lg:space-x-8 mb-6 flex-wrap gap-4">
              {/* Browser Extension */}
              <div className="relative h-80 w-80 lg:h-96 lg:w-96 rounded-lg border-2 border-blue-300 bg-white shadow-lg">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="h-8 bg-blue-100 border-b border-blue-200 flex items-center px-3">
                    <Chrome className="h-4 w-4 mr-2 text-blue-600" />
                    <div className="text-xs text-blue-800">SSP Wallet - Sync Device</div>
                  </div>
                  <div className="p-4 lg:p-6 pt-6 lg:pt-8 flex flex-col items-center h-full">
                    <h4 className="font-semibold mb-4 lg:mb-6 text-lg">Connect Mobile Device</h4>
                    <div className="bg-white border-4 border-gray-300 p-4 lg:p-6 rounded-lg mb-4 lg:mb-6">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="grid grid-cols-5 gap-1"
                      >
                        {[...Array(25)].map((_, i) => (
                          <div key={i} className={`h-2 w-2 lg:h-3 lg:w-3 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'} rounded-sm`}></div>
                        ))}
                      </motion.div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mb-3 lg:mb-4">Scan this QR code with SSP Key app</p>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 lg:p-4 w-full">
                      <div className="text-sm text-gray-600 mb-1 lg:mb-2">Connection ID:</div>
                      <div className="text-sm font-mono bg-white p-1 lg:p-2 rounded break-all">ssp://sync/abc123...def789</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className="relative h-80 w-52 rounded-2xl border-2 border-green-300 bg-black shadow-lg">
                <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                  <div className="h-6 bg-gray-900 rounded-t-xl relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="p-3 pt-2 flex flex-col h-full">
                    <div className="text-center mb-3">
                      <QrCode className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <h4 className="text-sm font-semibold">Scan QR Code</h4>
                    </div>
                    
                    <div className="border-2 border-dashed border-green-300 rounded p-3 mb-3 flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="h-16 w-16 border-2 border-green-400 rounded mx-auto mb-2 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="text-xl"
                          >
                            📷
                          </motion.div>
                        </div>
                        <p className="text-xs text-gray-600">Position QR code in frame</p>
                      </div>
                    </div>
                    
                    <button className="w-full bg-green-600 text-white py-2 rounded text-xs font-medium">
                      Ready to Scan
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-lg px-4">
              <h3 className="text-xl font-semibold mb-3">Generate Pairing QR Code</h3>
              <p className="text-gray-600">Your browser wallet shows a QR code. Open SSP Key app and tap "Scan QR Code" to connect securely.</p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-8 mb-8">
              {/* Browser Extension */}
              <div className="relative h-80 w-80 rounded-lg border-2 border-blue-300 bg-white shadow-lg">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="h-8 bg-blue-100 border-b border-blue-200 flex items-center px-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Wifi className="h-4 w-4 mr-2 text-blue-600" />
                    </motion.div>
                    <div className="text-xs text-blue-800">Connecting...</div>
                  </div>
                  <div className="p-6 pt-8 flex flex-col items-center h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-16 w-16 border-4 border-blue-200 border-t-blue-600 rounded-full mb-4"
                    ></motion.div>
                    <h4 className="font-semibold mb-2">Pairing in Progress</h4>
                    <p className="text-sm text-gray-600 text-center mb-4">Establishing secure connection with mobile device...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <motion.div 
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2 }}
                      ></motion.div>
                    </div>
                    <div className="text-xs text-gray-500">Exchanging encryption keys...</div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className="relative h-80 w-52 rounded-2xl border-2 border-green-300 bg-black shadow-lg">
                <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                  <div className="h-6 bg-gray-900 rounded-t-xl relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="p-3 pt-2 flex flex-col h-full">
                    <div className="bg-green-100 p-2 rounded mb-2">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
                        </motion.div>
                        <p className="text-xs font-semibold text-green-800">QR Code Scanned!</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs flex-1">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">Browser Wallet:</div>
                        <div className="font-mono text-xs">Chrome Extension</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">Encryption:</div>
                        <div className="font-mono text-xs">AES-256-GCM</div>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDevicesPaired(true)}
                      className="w-full bg-green-600 text-white py-2 rounded text-xs font-medium mt-2"
                    >
                      Confirm Pairing
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Scanning QR Code</h3>
              <p className="text-gray-600">The mobile app reads the QR code and establishes an encrypted connection with your browser wallet.</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-8 mb-8">
              {/* Browser Extension */}
              <div className="relative h-80 w-80 rounded-lg border-2 border-green-300 bg-white shadow-lg">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="h-8 bg-green-100 border-b border-green-200 flex items-center px-3">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                    <div className="text-xs text-green-800">Device Connected</div>
                  </div>
                  <div className="p-6 pt-8 flex flex-col items-center h-full">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="h-10 w-10 text-green-600" />
                      </div>
                    </motion.div>
                    <h4 className="font-semibold mb-2 text-green-800">Successfully Paired!</h4>
                    <p className="text-sm text-gray-600 text-center mb-4">Your devices are now securely connected</p>
                    
                    <div className="w-full space-y-2 text-sm">
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span>🔐 Encryption:</span>
                        <span className="text-green-700 font-semibold">Active</span>
                      </div>
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span>📱 Mobile Device:</span>
                        <span className="text-green-700 font-semibold">Connected</span>
                      </div>
                      <div className="flex items-center justify-between bg-green-50 p-2 rounded">
                        <span>🔑 2-of-2 Multisig:</span>
                        <span className="text-green-700 font-semibold">Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className="relative h-80 w-52 rounded-2xl border-2 border-green-300 bg-black shadow-lg">
                <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                  <div className="h-6 bg-gray-900 rounded-t-xl relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="p-3 pt-2 flex flex-col h-full">
                    <div className="bg-green-100 p-2 rounded mb-3 text-center">
                      <Shield className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-xs font-semibold text-green-800">Secure Connection</p>
                    </div>
                    
                    <div className="space-y-2 text-xs flex-1">
                      <div className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-gray-600 mb-1">Ready for Transactions</div>
                        <div className="flex items-center justify-center">
                          <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                          <span className="text-green-700 font-semibold">Online</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2">
                      <p className="text-xs text-blue-800 text-center">Your wallet is now protected by true 2-of-2 multisig security!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Devices Successfully Paired</h3>
              <p className="text-gray-600">Perfect! Your browser and mobile are now connected with end-to-end encryption. You can now send secure transactions.</p>
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
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-96 w-[400px] rounded-lg border-2 border-gray-200 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3">
                  <Send className="h-4 w-4 mr-2 text-gray-600" />
                  <div className="text-xs text-gray-600">Send Transaction</div>
                </div>
                <div className="p-5 pt-6 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-4 text-center">Send Ethereum</h3>
                  <div className="space-y-4 flex-1">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1 text-left">Recipient Address</label>
                      <input
                        type="text"
                        value={transactionAddress}
                        onChange={(e) => setTransactionAddress(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1 text-left">Amount (ETH)</label>
                      <input
                        type="text"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-3 text-left">
                      <div className="text-sm text-gray-600 mb-1">Transaction Summary</div>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-semibold">{transactionAmount} ETH</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gas Fee:</span>
                          <span>~0.002 ETH ($6.00)</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                          <span className="font-semibold">Total:</span>
                          <span className="font-semibold">{(parseFloat(transactionAmount) + 0.002).toFixed(3)} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium mt-4 cursor-pointer"
                  >
                    Send Transaction
                  </motion.button>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Create Transaction</h3>
              <p className="text-gray-600">Fill in the recipient address and amount. The transaction will require approval from both your browser and mobile device.</p>
            </div>
          </div>
        )

              case 1:
        return (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-8 h-[450px] w-[450px] rounded-lg border-2 border-blue-300 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-blue-100 border-b border-blue-200 flex items-center px-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  </motion.div>
                  <div className="text-xs text-blue-800">Signature Required (1/2)</div>
                </div>
                <div className="p-6 pt-8 flex flex-col h-full">
                  <h3 className="text-lg font-semibold mb-6 text-blue-800 text-center">Confirm Transaction</h3>
                  <div className="space-y-4 text-left flex-1">
                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                      <div className="text-sm text-gray-600 mb-1">Sending To</div>
                      <div className="text-sm font-mono break-all">{transactionAddress}</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                      <div className="text-sm text-gray-600 mb-1">Amount</div>
                      <div className="text-xl font-semibold">{transactionAmount} ETH</div>
                      <div className="text-sm text-gray-500">≈ ${(parseFloat(transactionAmount) * 3000).toFixed(2)} USD</div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded p-4">
                      <div className="text-sm text-gray-600 mb-1">Gas Fee</div>
                      <div className="text-sm">0.002 ETH (~$6.00)</div>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded p-4">
                      <div className="flex items-center text-amber-800">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-semibold">Requires mobile confirmation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-6">
                    <button className="flex-1 bg-gray-300 text-gray-700 py-3 rounded text-sm font-medium">
                      Reject
                    </button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNotification(true)}
                      className="flex-1 bg-blue-600 text-white py-3 rounded text-sm font-medium"
                    >
                      Approve (1/2)
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Browser Approval</h3>
              <p className="text-gray-600">First signature complete. The transaction is now being sent to your mobile device for the second approval.</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col items-center">
            <div className="flex justify-center space-x-6 mb-8">
              {/* Browser Extension */}
              <div className="relative h-80 w-80 rounded-lg border-2 border-gray-300 bg-white shadow-lg">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <div className="h-8 bg-gray-100 border-b border-gray-200 flex items-center px-3">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                      <div className="text-xs text-gray-600">Waiting for mobile approval...</div>
                    </div>
                  </div>
                  <div className="p-6 pt-8 text-center flex flex-col h-full">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-16 w-16 border-4 border-gray-200 border-t-amber-500 rounded-full mx-auto mb-4"
                    ></motion.div>
                    <h4 className="font-semibold mb-2">Pending Mobile Approval</h4>
                    <p className="text-sm text-gray-600 mb-4">Signature 1/2 complete. Check your mobile device to approve the transaction.</p>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-4">
                      <div className="text-sm text-amber-800">
                        <div className="font-semibold">Transaction Details</div>
                        <div className="text-xs mt-1">
                          Send {transactionAmount} ETH<br/>
                          To: {transactionAddress.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center justify-center">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Notification sent to mobile device
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App with Notification */}
              <div className="relative h-80 w-48 rounded-2xl border-2 border-red-300 bg-black shadow-lg">
                {showNotification && (
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute -top-16 left-0 right-0 bg-red-500 text-white p-2 rounded-t-xl z-10"
                  >
                    <div className="flex items-center text-xs">
                      <Bell className="h-3 w-3 mr-1" />
                      Transaction Approval Required
                    </div>
                  </motion.div>
                )}
                <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                  <div className="h-6 bg-gray-900 rounded-t-xl relative">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="p-3 pt-2 flex flex-col h-full">
                    <div className="bg-red-100 p-2 rounded mb-3">
                      <div className="flex items-center text-red-800">
                        <Bell className="h-4 w-4 mr-2" />
                        <span className="text-xs font-semibold">Transaction Approval</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs flex-1">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">Amount</div>
                        <div className="font-semibold">{transactionAmount} ETH</div>
                        <div className="text-gray-500">${(parseFloat(transactionAmount) * 3000).toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">To Address</div>
                        <div className="font-mono text-xs">{transactionAddress.substring(0, 20)}...</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">Gas Fee</div>
                        <div className="font-semibold">0.002 ETH</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-gray-600">Status</div>
                        <div className="text-amber-600 font-semibold">Awaiting Approval (2/2)</div>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-green-600 text-white py-2 rounded text-xs font-medium"
                      >
                        {biometricsEnabled ? (
                          <div className="flex items-center justify-center">
                            <Fingerprint className="h-3 w-3 mr-1" />
                            Approve with Touch ID
                          </div>
                        ) : (
                          "Approve (2/2)"
                        )}
                      </motion.button>
                      <button className="w-full bg-gray-300 text-gray-700 py-2 rounded text-xs">
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Mobile Confirmation Required</h3>
              <p className="text-gray-600">A notification appeared on your mobile device. Review the transaction details and approve with {biometricsEnabled ? 'biometric authentication' : 'your password'}.</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col items-center">
            <div className="relative h-80 w-48 mx-auto mb-8 rounded-2xl border-2 border-green-300 bg-black shadow-lg">
              <div className="absolute inset-1 rounded-xl bg-white overflow-hidden">
                <div className="h-6 bg-gray-900 rounded-t-xl relative">
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 h-1 w-8 bg-gray-600 rounded-full"></div>
                </div>
                <div className="p-3 pt-2 flex flex-col h-full">
                  <div className="bg-green-100 p-2 rounded mb-3 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    >
                      <CheckCircle className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    </motion.div>
                    <p className="text-xs font-semibold text-green-800">Transaction Approved!</p>
                  </div>
                  
                  <div className="space-y-2 text-xs flex-1">
                    <div className="bg-gray-50 p-2 rounded text-center">
                      <div className="text-gray-600 mb-1">Broadcasting to Network</div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="h-6 w-6 border-2 border-blue-200 border-t-blue-600 rounded-full mx-auto"
                      ></motion.div>
                    </div>
                    
                    <div className="bg-gray-50 p-2 rounded">
                      <div className="text-gray-600">Signatures</div>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs">Browser (1/2)</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs">Mobile (2/2)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTransactionSent(true)}
                    className="w-full bg-blue-600 text-white py-2 rounded text-xs font-medium mt-3"
                  >
                    Broadcast Transaction
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-lg">
              <h3 className="text-xl font-semibold mb-3">Both Devices Approved</h3>
              <p className="text-gray-600">Perfect! Both signatures collected. The transaction is now ready to be broadcast to the Ethereum network.</p>
            </div>
          </div>
        )

              case 4:
        return (
          <div className="flex flex-col items-center">
            <div className="relative mx-auto mb-6 h-80 w-[420px] rounded-lg border-2 border-green-300 bg-white shadow-lg">
              <div className="absolute inset-0 overflow-hidden rounded-lg">
                <div className="h-8 bg-green-100 border-b border-green-200 flex items-center px-3">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <div className="text-xs text-green-800">Transaction Broadcast</div>
                </div>
                <div className="p-5 pt-6 text-center flex flex-col h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="mb-4"
                  >
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 text-green-800">Transaction Successful!</h3>
                  <p className="text-sm text-gray-600 mb-4">Your transaction has been broadcast to the Ethereum network and is being confirmed.</p>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded p-4 text-left mb-4 flex-1">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Sent:</span>
                        <span className="font-semibold">{transactionAmount} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Gas Fee:</span>
                        <span>0.002 ETH</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                        <span className="text-gray-600">Transaction Hash:</span>
                        <span className="font-mono text-xs break-all ml-4">0xabc123...def789</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium cursor-pointer"
                    >
                      View on Etherscan
                    </motion.button>
                    <button className="w-full bg-gray-200 text-gray-700 py-2 rounded text-sm font-medium">
                      Send Another Transaction
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center max-w-2xl px-4">
              <h3 className="text-xl font-semibold mb-3">🎉 Transaction Complete!</h3>
              <p className="text-gray-600 mb-4">Your funds have been securely transferred using true 2-of-2 multisignature technology. Both devices were required to authorize and sign this transaction.</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Why This Is Ultra-Secure</h4>
                <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>2 separate devices required</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>2 separate seed phrases</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>True multisignature (BIP48)</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
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

  const isLastStep = currentPhase === phases.length - 1 && currentStep === phases[currentPhase].steps - 1

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4'
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className='relative max-h-[95vh] max-w-7xl w-full bg-white rounded-xl shadow-2xl overflow-hidden mx-4'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Complete SSP Wallet Experience</h2>
              <p className="text-primary-100 mt-1">Full setup and transaction flow with true 2-of-2 multisig security</p>
            </div>
            <button
              onClick={handleClose}
              className='h-10 w-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors'
              aria-label='Close demo'
            >
              <X className='h-6 w-6' />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between">
              {phases.map((phase, index) => (
                <div key={phase.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                    index <= currentPhase ? 'bg-white text-primary-600' : 'bg-white/20 text-white/60'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="ml-2">
                    <div className={`text-sm font-medium ${
                      index <= currentPhase ? 'text-white' : 'text-white/60'
                    }`}>
                      {phase.title}
                    </div>
                    <div className={`text-xs ${
                      index <= currentPhase ? 'text-primary-100' : 'text-white/40'
                    }`}>
                      {phase.subtitle}
                    </div>
                  </div>
                  {index < phases.length - 1 && (
                    <ArrowRight className={`h-4 w-4 mx-4 ${
                      index < currentPhase ? 'text-white' : 'text-white/40'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Step Progress */}
            <div className="flex space-x-1">
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
        <div className="p-4 sm:p-6 lg:p-8 h-[600px] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentPhase}-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="bg-gray-50 px-8 py-4 flex items-center justify-between">
          <button
            onClick={goPrevious}
            disabled={currentPhase === 0 && currentStep === 0}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {phases[currentPhase].title} - Step {currentStep + 1} of {phases[currentPhase].steps}
            </span>
            
            {isLastStep ? (
              <div className="flex space-x-2">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Restart Demo
                </button>
                <Link href="/download">
                  <button
                    onClick={handleClose}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Download SSP Wallet
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={goNext}
                className="flex items-center bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}