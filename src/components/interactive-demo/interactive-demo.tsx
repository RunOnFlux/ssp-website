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
import { useTranslations } from 'next-intl'
import { useState, type MouseEvent } from 'react'
import { useTheme } from '@/hooks/use-theme'
import { Link } from '@/i18n/navigation'

interface InteractiveDemoProps {
  isOpen: boolean
  onClose: () => void
}

interface Phase {
  id: 'wallet-setup' | 'key-setup' | 'device-sync' | 'transaction'
  titleKey: 'walletSetupTitle' | 'keySetupTitle' | 'deviceSyncTitle' | 'transactionTitle'
  subtitleKey:
    | 'walletSetupSubtitle'
    | 'keySetupSubtitle'
    | 'deviceSyncSubtitle'
    | 'transactionSubtitle'
  steps: number
}

// Replace a button's content via safe DOM methods, preserving the legacy
// "show feedback then revert" UX without the XSS risk of writing innerHTML.
function flashButtonContent(btn: HTMLButtonElement, buildFeedback: () => Node, durationMs = 1500) {
  const original: Node[] = Array.from(btn.childNodes).map(node => node.cloneNode(true))
  const originalClassName = btn.className
  while (btn.firstChild) btn.removeChild(btn.firstChild)
  btn.appendChild(buildFeedback())
  setTimeout(() => {
    while (btn.firstChild) btn.removeChild(btn.firstChild)
    for (const node of original) btn.appendChild(node)
    btn.className = originalClassName
  }, durationMs)
}

const AndroidIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox='0 0 24 24' fill='currentColor'>
    <path d='M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zM20.5 8c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z' />
  </svg>
)

const phases: Phase[] = [
  {
    id: 'wallet-setup',
    titleKey: 'walletSetupTitle',
    subtitleKey: 'walletSetupSubtitle',
    steps: 4,
  },
  {
    id: 'key-setup',
    titleKey: 'keySetupTitle',
    subtitleKey: 'keySetupSubtitle',
    steps: 4,
  },
  {
    id: 'device-sync',
    titleKey: 'deviceSyncTitle',
    subtitleKey: 'deviceSyncSubtitle',
    steps: 3,
  },
  {
    id: 'transaction',
    titleKey: 'transactionTitle',
    subtitleKey: 'transactionSubtitle',
    steps: 4,
  },
]

const walletSeedPhrase: string[] = Array(24).fill('abandon')
const keySeedPhrase: string[] = Array(24).fill('abandon')

export function InteractiveDemo({ isOpen, onClose }: InteractiveDemoProps) {
  const t = useTranslations('InteractiveDemo')
  const { isDark } = useTheme()
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [showSeed, setShowSeed] = useState<boolean>(false)
  const [seedConfirmed, setSeedConfirmed] = useState<boolean>(false)
  const [showKeySeed, setShowKeySeed] = useState<boolean>(false)
  const [keySeedConfirmed, setKeySeedConfirmed] = useState<boolean>(false)
  const [biometricsEnabled, setBiometricsEnabled] = useState<boolean>(false)
  const [devicesPaired, setDevicesPaired] = useState<boolean>(false)
  const [transactionAmount, setTransactionAmount] = useState<string>('0.5')
  const [transactionAddress, setTransactionAddress] = useState<string>(
    '0x742d35Cc632C4532C3...aBF5'
  )
  const [showNotification] = useState<boolean>(false)
  const [mobileKeyPassword, setMobileKeyPassword] = useState<string>('SecurePass123')

  const handleClose = () => {
    onClose()
  }

  const goNext = () => {
    const currentPhaseData = phases[currentPhase]
    if (!currentPhaseData) return
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
      const previousPhase = phases[currentPhase - 1]
      setCurrentPhase(currentPhase - 1)
      setCurrentStep(previousPhase ? previousPhase.steps - 1 : 0)
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
    setPassword('')
    setMobileKeyPassword('')
  }

  const handleCopyWalletSeed = (e: MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(walletSeedPhrase.join(' '))
    flashButtonContent(e.currentTarget, () => {
      const wrapper = document.createElement('span')
      const svgNS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(svgNS, 'svg')
      svg.setAttribute('class', 'h-4 w-4 inline mr-1')
      svg.setAttribute('fill', 'currentColor')
      svg.setAttribute('viewBox', '0 0 20 20')
      const path = document.createElementNS(svgNS, 'path')
      path.setAttribute('fill-rule', 'evenodd')
      path.setAttribute(
        'd',
        'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
      )
      path.setAttribute('clip-rule', 'evenodd')
      svg.appendChild(path)
      wrapper.appendChild(svg)
      wrapper.appendChild(document.createTextNode(t('feedbackCopied')))
      return wrapper
    })
  }

  const handleConfirmWalletSeed = (e: MouseEvent<HTMLButtonElement>) => {
    setSeedConfirmed(true)
    const btn = e.currentTarget
    const original: Node[] = Array.from(btn.childNodes).map(node => node.cloneNode(true))
    const originalClassName = btn.className
    while (btn.firstChild) btn.removeChild(btn.firstChild)
    btn.appendChild(document.createTextNode(t('feedbackConfirmedCheck')))
    btn.className = 'flex-1 bg-green-700 text-white py-2 rounded text-sm font-medium cursor-pointer'
    setTimeout(() => {
      while (btn.firstChild) btn.removeChild(btn.firstChild)
      for (const node of original) btn.appendChild(node)
      btn.className = originalClassName
    }, 1500)
  }

  const handleCopyKeySeed = (e: MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(keySeedPhrase.join(' '))
    flashButtonContent(e.currentTarget, () => document.createTextNode(t('feedbackCopiedCheck')))
  }

  const handleConfirmKeySeed = (e: MouseEvent<HTMLButtonElement>) => {
    setKeySeedConfirmed(true)
    const btn = e.currentTarget
    const original: Node[] = Array.from(btn.childNodes).map(node => node.cloneNode(true))
    const originalClassName = btn.className
    while (btn.firstChild) btn.removeChild(btn.firstChild)
    btn.appendChild(document.createTextNode(t('feedbackConfirmedCheck')))
    btn.className = 'flex-1 bg-green-700 text-white py-1 rounded text-xs font-medium cursor-pointer'
    setTimeout(() => {
      while (btn.firstChild) btn.removeChild(btn.firstChild)
      for (const node of original) btn.appendChild(node)
      btn.className = originalClassName
    }, 1500)
  }

  const renderWalletSetupStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-full max-w-md rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3 dark:border-gray-700 dark:bg-gray-700'>
                  <div className='flex space-x-2'>
                    <div className='h-3 w-3 rounded-full bg-red-400'></div>
                    <div className='h-3 w-3 rounded-full bg-yellow-400'></div>
                    <div className='h-3 w-3 rounded-full bg-green-400'></div>
                  </div>
                  <div className='ml-4 text-xs text-gray-600 dark:text-gray-300'>
                    {t('chromeWebStore')}
                  </div>
                </div>
                <div className='flex h-full flex-col p-6 pt-8'>
                  <div className='mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/50'>
                    <Chrome className='mx-auto mb-3 h-10 w-10 text-blue-600 dark:text-blue-400' />
                    <h3 className='text-center font-semibold text-blue-900 dark:text-blue-100'>
                      {t('sspWalletName')}
                    </h3>
                    <p className='text-center text-sm text-blue-700 dark:text-blue-300'>
                      {t('byInfluxTech')}
                    </p>
                  </div>
                  <p className='mb-4 text-center text-sm text-gray-600 dark:text-gray-300'>
                    {t('walletStoreTagline')}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('/download', '_blank')}
                    className='mb-4 w-full cursor-pointer rounded bg-blue-600 py-3 text-sm font-medium text-white'
                  >
                    {t('getToBrowser')}
                  </motion.button>
                  <div className='text-xs text-gray-500'>
                    <div className='flex flex-wrap items-center justify-center space-x-2'>
                      <span>{t('walletRating')}</span>
                      <span>{t('walletUserCount')}</span>
                      <span>{t('walletAudited')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('installExtensionTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('installExtensionDescription')}</p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-full max-w-md rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3 dark:border-gray-700 dark:bg-gray-700'>
                  <Image
                    src={isDark ? '/ssp-logo-white.svg' : '/ssp-logo-black.svg'}
                    alt='SSP'
                    width={16}
                    height={16}
                    className='mr-2'
                  />
                  <div className='text-xs text-gray-600 dark:text-gray-300'>
                    {t('sspWalletSetup')}
                  </div>
                </div>
                <div className='flex h-full flex-col p-6 pt-8'>
                  <Image
                    src={isDark ? '/ssp-logo-white.svg' : '/ssp-logo-black.svg'}
                    alt={t('sspLogoAlt')}
                    width={48}
                    height={48}
                    className='mx-auto mb-4'
                  />
                  <h3 className='mb-4 text-center text-lg font-semibold dark:text-white'>
                    {t('createYourWallet')}
                  </h3>
                  <div className='flex-1 space-y-4'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600 dark:text-gray-300'>
                        {t('newPasswordLabel')}
                      </label>
                      <div className='relative'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          placeholder={t('enterSecurePasswordPlaceholder')}
                          className='w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className='absolute top-2 right-2 cursor-pointer text-gray-400 dark:text-gray-300'
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
                      <label className='mb-1 block text-left text-sm text-gray-600 dark:text-gray-300'>
                        {t('confirmPasswordLabel')}
                      </label>
                      <input
                        type='password'
                        placeholder={t('confirmPasswordPlaceholder')}
                        className='w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                      />
                    </div>
                    <div className='pt-2 text-sm'>
                      <label className='flex items-center text-gray-700 dark:text-gray-300'>
                        <input type='checkbox' className='mr-2' />
                        {t('agreeToTerms')}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('createSecurePasswordTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('createSecurePasswordDescription')}
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-full max-w-md rounded-lg border-2 border-amber-300 bg-white shadow-lg dark:border-amber-600 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-amber-200 bg-amber-100 px-3 dark:border-amber-700 dark:bg-amber-900/50'>
                  <AlertCircle className='mr-2 h-4 w-4 text-amber-600 dark:text-amber-400' />
                  <div className='text-xs text-amber-800 dark:text-amber-200'>
                    {t('backupRequired')}
                  </div>
                </div>
                <div className='flex h-full flex-col overflow-hidden p-4 pt-3'>
                  <h3 className='mb-2 text-center text-lg font-semibold text-amber-800 dark:text-amber-200'>
                    {t('walletSeedPhraseHeading')}
                  </h3>
                  <div className='mb-3 rounded border border-red-200 bg-red-50 p-2 dark:border-red-700 dark:bg-red-900/50'>
                    <p className='text-center text-xs font-medium text-red-800 dark:text-red-200'>
                      {t('writeDownWarning')}
                    </p>
                  </div>

                  <div className='flex min-h-0 flex-1 flex-col'>
                    {!showSeed ? (
                      <div className='flex max-h-48 flex-1 flex-col justify-center rounded bg-gray-100 p-6 text-center dark:bg-gray-700'>
                        <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>
                          {t('clickToRevealSeed')}
                        </p>
                        <button
                          onClick={() => setShowSeed(true)}
                          className='cursor-pointer rounded bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600'
                        >
                          <Eye className='mr-2 inline h-4 w-4' />
                          {t('showSeedPhrase')}
                        </button>
                      </div>
                    ) : (
                      <div className='flex h-full min-h-0 flex-col'>
                        <div className='mb-3 grid max-h-36 grid-cols-4 gap-1 overflow-y-auto text-xs'>
                          {walletSeedPhrase.map((word, index) => (
                            <div
                              key={index}
                              className='flex min-h-[1.2rem] items-center justify-center rounded border bg-gray-50 p-1 text-center text-xs dark:border-gray-600 dark:bg-gray-600 dark:text-gray-200'
                            >
                              <span className='mr-1 text-gray-400 dark:text-gray-300'>
                                {index + 1}.
                              </span>
                              <span>{word}</span>
                            </div>
                          ))}
                        </div>
                        <div className='mt-2 flex space-x-2'>
                          <button
                            onClick={handleCopyWalletSeed}
                            className='flex-1 cursor-pointer rounded bg-gray-200 py-2 text-sm text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                          >
                            <Copy className='mr-1 inline h-4 w-4' />
                            {t('copy')}
                          </button>
                          <button
                            onClick={handleConfirmWalletSeed}
                            className='flex-1 cursor-pointer rounded bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                          >
                            {t('writtenItDown')}
                          </button>
                        </div>
                        {seedConfirmed && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='mt-2 rounded bg-green-100 p-2 text-center text-xs text-green-800 dark:bg-green-900/50 dark:text-green-200'
                          >
                            {t('seedConfirmedToast')}
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>{t('backupSeedTitle')}</h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('backupSeedDescription')}</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-full max-w-md rounded-lg border-2 border-green-300 bg-white shadow-lg dark:border-green-600 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3 dark:border-green-700 dark:bg-green-900/50'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-600 dark:text-green-400' />
                  <div className='text-xs text-green-800 dark:text-green-200'>
                    {t('walletCreated')}
                  </div>
                </div>
                <div className='flex h-full flex-col p-5 pt-6 text-center'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                  >
                    <div className='mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                      <Check className='h-8 w-8 text-green-600 dark:text-green-400' />
                    </div>
                  </motion.div>
                  <h3 className='mb-2 text-lg font-semibold text-green-800 dark:text-green-200'>
                    {t('sspWalletReady')}
                  </h3>
                  <p className='mb-3 text-sm text-gray-600 dark:text-gray-300'>
                    {t('walletSetUpWith')}
                  </p>
                  <div className='mb-4 space-y-2 text-left text-sm'>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                      <span className='dark:text-gray-300'>{t('securePasswordProtection')}</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                      <span className='dark:text-gray-300'>{t('twentyFourWordSeedBackedUp')}</span>
                    </div>
                    <div className='flex items-center'>
                      <ArrowRight className='mr-2 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400' />
                      <span className='text-blue-700 dark:text-blue-300'>
                        {t('readyForMobileSetup')}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/50'>
                    <div className='text-center'>
                      <div className='mb-1 flex items-center justify-center'>
                        <span className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                          {t('nextStep')}
                        </span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className='ml-2 h-4 w-4 text-blue-600 dark:text-blue-400' />
                        </motion.div>
                      </div>
                      <p className='text-sm text-blue-700 dark:text-blue-300'>
                        {t('setUpKeyMobile')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('walletSetupCompleteTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('walletSetupCompleteDescription')}
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
              <div className='relative h-[26rem] w-64 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-blue-500 to-blue-600 shadow-lg dark:border-gray-600'>
                <div className='absolute inset-2 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='flex h-full flex-col p-4'>
                    <div className='mb-3 text-center'>
                      <Apple className='mx-auto mb-2 h-8 w-8 text-blue-600' />
                      <h3 className='text-sm font-semibold text-blue-900 dark:text-blue-300'>
                        {t('sspKeyName')}
                      </h3>
                      <p className='text-xs text-gray-600 dark:text-gray-300'>
                        {t('twoFaMultisigSecurity')}
                      </p>
                    </div>
                    <div className='flex-1 space-y-3 text-xs'>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('ratingLabel')}</span>
                        <span className='dark:text-gray-300'>{t('ratingValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('developerLabel')}</span>
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                          {t('developerValue')}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('downloadsLabel')}</span>
                        <span className='dark:text-gray-300'>{t('downloadsValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('sizeLabel')}</span>
                        <span className='dark:text-gray-300'>{t('iosSizeValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('requiresLabel')}</span>
                        <span className='dark:text-gray-300'>{t('iosRequiresValue')}</span>
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
                      {t('downloadForIos')}
                    </motion.button>
                    <div className='mt-3 space-y-1'>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Shield className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('securityAudited')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Fingerprint className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('touchFaceId')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <QrCode className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('qrCodePairing')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Eye className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('zeroDataStorage')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Android Play Store */}
              <div className='relative h-[26rem] w-64 rounded-2xl border-2 border-gray-300 bg-gradient-to-b from-green-500 to-green-600 shadow-lg dark:border-gray-600'>
                <div className='absolute inset-2 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='flex h-full flex-col p-4'>
                    <div className='mb-3 text-center'>
                      <AndroidIcon className='mx-auto mb-2 h-8 w-8 text-green-600' />
                      <h3 className='text-sm font-semibold text-green-900 dark:text-green-300'>
                        {t('sspKeyName')}
                      </h3>
                      <p className='text-xs text-gray-600 dark:text-gray-300'>
                        {t('twoFaMultisigSecurity')}
                      </p>
                    </div>
                    <div className='flex-1 space-y-3 text-xs'>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('ratingLabel')}</span>
                        <span className='dark:text-gray-300'>{t('ratingValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('developerLabel')}</span>
                        <span className='font-medium text-gray-800 dark:text-gray-200'>
                          {t('developerValue')}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('downloadsLabel')}</span>
                        <span className='dark:text-gray-300'>{t('downloadsValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('sizeLabel')}</span>
                        <span className='dark:text-gray-300'>{t('androidSizeValue')}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='dark:text-gray-300'>{t('requiresLabel')}</span>
                        <span className='dark:text-gray-300'>{t('androidRequiresValue')}</span>
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
                      {t('downloadForAndroid')}
                    </motion.button>
                    <div className='mt-3 space-y-1'>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Shield className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('securityAudited')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Fingerprint className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('biometricUnlock')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <QrCode className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('qrCodePairing')}</span>
                      </div>
                      <div className='flex items-center text-xs text-gray-500'>
                        <Eye className='mr-1 h-3 w-3 flex-shrink-0' />
                        <span>{t('zeroDataStorage')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('downloadKeyMobileTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('downloadKeyMobileDescription')}
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-gray-300 bg-black shadow-lg dark:border-gray-600'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <div className='mb-4 text-center'>
                    <Image
                      src={isDark ? '/ssp-logo-white.svg' : '/ssp-logo-black.svg'}
                      alt={t('sspKeyAlt')}
                      width={30}
                      height={30}
                      className='mx-auto mb-2'
                    />
                    <h4 className='text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('sspKeySetup')}
                    </h4>
                  </div>

                  <div className='max-h-48 flex-1 space-y-3'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600 dark:text-gray-300'>
                        {t('appPasswordLabel')}
                      </label>
                      <input
                        type='password'
                        value={mobileKeyPassword}
                        onChange={e => setMobileKeyPassword(e.target.value)}
                        placeholder={t('createPasswordPlaceholder')}
                        className='w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400'
                      />
                    </div>

                    <div className='rounded border border-blue-200 bg-blue-50 p-2 dark:border-blue-700 dark:bg-blue-900/50'>
                      <label className='flex items-center text-sm dark:text-gray-300'>
                        <input
                          type='checkbox'
                          className='mr-2'
                          checked={biometricsEnabled}
                          onChange={e => setBiometricsEnabled(e.target.checked)}
                        />
                        <Fingerprint className='mr-2 h-4 w-4 dark:text-gray-300' />
                        <span>{t('enableBiometrics')}</span>
                      </label>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goNext}
                      className='w-full cursor-pointer rounded bg-blue-600 py-2 text-sm font-medium text-white'
                    >
                      {t('continueSetup')}
                    </motion.button>
                  </div>

                  {biometricsEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className='mt-2 rounded bg-green-100 p-2 text-sm text-green-800 dark:bg-green-900/50 dark:text-green-200'
                    >
                      {t('touchFaceIdEnabled')}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('secureMobileKeyTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('secureMobileKeyDescription')}</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-amber-300 bg-black shadow-lg dark:border-amber-600'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col overflow-hidden p-3 pt-2'>
                  <div className='mb-3 rounded bg-amber-100 p-2 dark:bg-amber-900/50'>
                    <AlertCircle className='mx-auto mb-1 h-4 w-4 text-amber-600 dark:text-amber-400' />
                    <p className='text-center text-sm font-semibold text-amber-800 dark:text-amber-200'>
                      {t('keySeedPhrase')}
                    </p>
                  </div>

                  <div className='flex max-h-44 min-h-0 flex-1 flex-col'>
                    {!showKeySeed ? (
                      <div className='flex flex-1 flex-col justify-center text-center'>
                        <p className='mb-3 text-sm text-gray-600 dark:text-gray-300'>
                          {t('generateKeySeed')}
                        </p>
                        <button
                          onClick={() => setShowKeySeed(true)}
                          className='w-full cursor-pointer rounded bg-amber-600 px-3 py-2 text-sm font-medium text-white hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600'
                        >
                          <Eye className='mr-2 inline h-4 w-4' />
                          {t('showKeySeed')}
                        </button>
                      </div>
                    ) : (
                      <div className='flex flex-col'>
                        {/* Fixed height seed phrase grid */}
                        <div className='grid h-32 grid-cols-2 gap-1 overflow-y-auto text-xs'>
                          {keySeedPhrase.map((word, index) => (
                            <div
                              key={index}
                              className='flex min-h-[1.2rem] items-center justify-center rounded bg-gray-50 p-1 text-center text-xs dark:bg-gray-600 dark:text-gray-200'
                            >
                              <span className='text-gray-400 dark:text-gray-300'>{index + 1}.</span>
                              <span className='ml-1'>{word}</span>
                            </div>
                          ))}
                        </div>
                        {/* Fixed height button area */}
                        <div className='mt-1 flex h-8 space-x-1'>
                          <button
                            onClick={handleCopyKeySeed}
                            className='flex-1 cursor-pointer rounded bg-gray-200 py-1 text-xs text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500'
                          >
                            {t('copy')}
                          </button>
                          <button
                            onClick={handleConfirmKeySeed}
                            className='flex-1 cursor-pointer rounded bg-green-600 py-1 text-xs font-medium text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'
                          >
                            {t('saved')}
                          </button>
                        </div>
                        {/* Fixed height container for confirmation message */}
                        <div className='mt-1 flex h-6 items-center justify-center'>
                          {keySeedConfirmed && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className='rounded bg-green-100 px-2 py-1 text-center text-xs text-green-800 dark:bg-green-900/50 dark:text-green-200'
                            >
                              {t('keySeedConfirmedToast')}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='mt-6 rounded border border-red-200 bg-red-50 p-2 dark:border-red-700 dark:bg-red-900/50'>
                    <p className='text-center text-xs text-red-800 dark:text-red-200'>
                      {t('storeSeparatelyWarning')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('backupKeySeedTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('backupKeySeedDescription')}</p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-96 w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg dark:border-green-600'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                  >
                    <div className='mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                      <Check className='h-7 w-7 text-green-600 dark:text-green-400' />
                    </div>
                  </motion.div>
                  <h4 className='mb-3 text-center text-base font-semibold text-green-800 dark:text-green-200'>
                    {t('sspKeyReady')}
                  </h4>
                  <div className='max-h-32 flex-1 space-y-2 text-left text-sm'>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                      <span className='dark:text-gray-300'>{t('passwordProtection')}</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                      <span className='dark:text-gray-300'>{t('biometricSecurity')}</span>
                    </div>
                    <div className='flex items-center'>
                      <Check className='mr-2 h-4 w-4 flex-shrink-0 text-green-600 dark:text-green-400' />
                      <span className='dark:text-gray-300'>{t('keySeedBackedUp')}</span>
                    </div>
                    <div className='flex items-center'>
                      <Wifi className='mr-2 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400' />
                      <span className='dark:text-gray-300'>{t('readyToPair')}</span>
                    </div>
                  </div>
                  <div className='mt-3 rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/50'>
                    <p className='text-center text-sm text-blue-800 dark:text-blue-200'>
                      {t('nextScanQrToConnect')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('mobileKeyCompleteTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('mobileKeyCompleteDescription')}
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
              <div className='relative h-[420px] w-96 rounded-lg border-2 border-blue-300 bg-white shadow-lg dark:border-blue-600 dark:bg-gray-800'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-blue-200 bg-blue-100 px-3 dark:border-blue-700 dark:bg-blue-900/50'>
                    <Chrome className='mr-2 h-4 w-4 text-blue-600 dark:text-blue-400' />
                    <div className='text-xs text-blue-800 dark:text-blue-200'>
                      {t('sspWalletSyncDevice')}
                    </div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-4'>
                    <h4 className='mb-4 text-base font-semibold dark:text-white'>
                      {t('connectMobileDevice')}
                    </h4>

                    {/* QR Code with SSP Logo */}
                    <div className='relative mb-4 rounded-lg border-2 border-gray-300 bg-white p-4 dark:border-gray-600 dark:bg-gray-700'>
                      <div className='relative h-32 w-32 rounded border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-600'>
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
                          <div className='rounded border border-gray-300 bg-white p-1 dark:border-gray-500 dark:bg-gray-500'>
                            <Image
                              src={isDark ? '/ssp-logo-white.svg' : '/ssp-logo-black.svg'}
                              alt='SSP'
                              width={16}
                              height={16}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className='mb-4 text-center text-sm text-gray-600 dark:text-gray-300'>
                      {t('scanQrWithKeyApp')}
                    </p>

                    <div className='mb-3 w-full rounded border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-700'>
                      <div className='mb-1 text-xs text-gray-600 dark:text-gray-300'>
                        {t('connectionIdLabel')}
                      </div>
                      <div className='rounded bg-white p-2 font-mono text-xs break-all dark:bg-gray-600 dark:text-gray-200'>
                        eth:xpub661MyMwAqRbcFtXgS5sYJABqqG9YLmC4Q1Rdap9gSE8Nq...
                      </div>
                    </div>

                    <div className='text-center'>
                      <button
                        onClick={() => window.open('https://sspwallet.io', '_blank')}
                        className='cursor-pointer text-xs text-blue-600 hover:underline'
                      >
                        {t('learnMoreLink')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[420px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg dark:border-green-600'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col p-3 pt-2'>
                    <div className='mb-3 text-center'>
                      <QrCode className='mx-auto mb-2 h-8 w-8 text-green-600' />
                      <h4 className='text-sm font-semibold dark:text-white'>{t('scanQrCode')}</h4>
                    </div>

                    <div className='flex max-h-48 flex-1 items-center justify-center rounded border-2 border-dashed border-green-300 p-3 dark:border-green-500'>
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
                        <p className='text-xs text-gray-600 dark:text-gray-300'>
                          {t('positionQrInFrame')}
                        </p>
                      </div>
                    </div>

                    <button className='mt-2 w-full cursor-pointer rounded bg-green-600 py-2 text-sm font-medium text-white'>
                      {t('readyToScan')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('generatePairingQrTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('generatePairingQrDescription')}
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[450px] w-96 rounded-lg border-2 border-blue-300 bg-white shadow-lg dark:border-blue-600 dark:bg-gray-800'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-blue-200 bg-blue-100 px-3 dark:border-blue-700 dark:bg-blue-900/50'>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Wifi className='mr-2 h-4 w-4 text-blue-600 dark:text-blue-400' />
                    </motion.div>
                    <div className='text-xs text-blue-800 dark:text-blue-200'>
                      {t('synchronising')}
                    </div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-6'>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className='mb-6 h-16 w-16 rounded-full border-4 border-blue-200 border-t-blue-600'
                    ></motion.div>
                    <h4 className='mb-3 text-lg font-semibold dark:text-white'>
                      {t('pairingInProgress')}
                    </h4>
                    <p className='mb-6 text-center text-sm text-gray-600 dark:text-gray-300'>
                      {t('establishingSecureConnection')}
                    </p>
                    <div className='mb-4 h-3 w-full rounded-full bg-gray-200 dark:bg-gray-600'>
                      <motion.div
                        className='h-3 rounded-full bg-blue-600'
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'easeInOut' }}
                      ></motion.div>
                    </div>
                    <div className='mb-4 text-sm text-gray-500 dark:text-gray-400'>
                      {t('exchangingKeys')}
                    </div>

                    <div className='mb-2 w-full rounded border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/50'>
                      <div className='text-center text-xs text-blue-800 dark:text-blue-200'>
                        <div className='mb-1 font-semibold'>{t('connectionDetailsHeading')}</div>
                        <div>{t('establishingSspRelay')}</div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: devicesPaired ? 1 : 0, scale: devicesPaired ? 1 : 0.8 }}
                      transition={{ duration: 0.3, delay: 2 }}
                      className='rounded bg-green-100 p-2 text-center dark:bg-green-900/50'
                    >
                      <CheckCircle className='mx-auto mb-1 h-5 w-5 text-green-600' />
                      <p className='text-xs font-semibold text-green-800 dark:text-green-200'>
                        {t('synchronisationComplete')}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[450px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg dark:border-green-600'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col justify-start p-2 pt-5 pb-10'>
                    <div className='mb-1.5 rounded bg-green-100 p-1.5 dark:bg-green-900/50'>
                      <div className='text-center'>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <CheckCircle className='mx-auto mb-0.5 h-4 w-4 text-green-600' />
                        </motion.div>
                        <p className='text-xs font-semibold text-green-800 dark:text-green-200'>
                          {t('qrCodeScanned')}
                        </p>
                      </div>
                    </div>

                    <div className='mb-1.5 flex-1 space-y-1 text-xs'>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('browserWalletLabel')}
                        </div>
                        <div className='font-mono text-xs dark:text-gray-200'>
                          {t('chromeExtensionValue')}
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('connectionIdLabel')}
                        </div>
                        <div className='font-mono text-xs break-all dark:text-gray-200'>
                          eth:xpub661My...
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('encryptionLabel')}
                        </div>
                        <div className='font-mono text-xs dark:text-gray-200'>AES-256-GCM</div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setDevicesPaired(true)
                        setTimeout(() => goNext(), 1000)
                      }}
                      className='w-full cursor-pointer rounded bg-green-600 py-1.5 text-sm font-medium text-white'
                    >
                      {t('confirmPairing')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('scanningQrCodeTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('scanningQrCodeDescription')}</p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-6 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[450px] w-96 rounded-lg border-2 border-green-300 bg-white shadow-lg dark:border-green-600 dark:bg-gray-800'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3 dark:border-green-700 dark:bg-green-900/50'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-600 dark:text-green-400' />
                    <div className='text-xs text-green-800 dark:text-green-200'>
                      {t('deviceConnected')}
                    </div>
                  </div>
                  <div className='flex h-full flex-col items-center p-5 pt-6'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.3 }}
                    >
                      <div className='mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                        <Check className='h-10 w-10 text-green-600 dark:text-green-400' />
                      </div>
                    </motion.div>
                    <h4 className='mb-2 text-lg font-semibold text-green-800 dark:text-green-200'>
                      {t('successfullyPaired')}
                    </h4>
                    <p className='mb-4 text-center text-sm text-gray-600 dark:text-gray-300'>
                      {t('devicesSecurelyConnected')}
                    </p>

                    <div className='mb-4 w-full space-y-3 text-sm'>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/50'>
                        <span className='dark:text-gray-300'>{t('encryptionRow')}</span>
                        <span className='font-semibold text-green-700 dark:text-green-300'>
                          {t('active')}
                        </span>
                      </div>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/50'>
                        <span className='dark:text-gray-300'>{t('mobileDeviceRow')}</span>
                        <span className='font-semibold text-green-700 dark:text-green-300'>
                          {t('connected')}
                        </span>
                      </div>
                      <div className='flex items-center justify-between rounded border border-green-200 bg-green-50 p-3 dark:border-green-700 dark:bg-green-900/50'>
                        <span className='dark:text-gray-300'>{t('twoOfTwoMultisigRow')}</span>
                        <span className='font-semibold text-green-700 dark:text-green-300'>
                          {t('ready')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile App */}
              <div className='relative h-[450px] w-64 rounded-2xl border-2 border-green-300 bg-black shadow-lg dark:border-green-600'>
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='pg-5 flex h-full flex-col justify-start p-2 pt-5 pb-10'>
                    <div className='mb-1.5 rounded bg-green-100 p-1.5 text-center dark:bg-green-900/50'>
                      <Shield className='mx-auto mb-0.5 h-4 w-4 text-green-600' />
                      <p className='text-xs font-semibold text-green-800 dark:text-green-200'>
                        {t('secureConnection')}
                      </p>
                    </div>

                    <div className='mb-1.5 flex-1 space-y-1 text-xs'>
                      <div className='rounded bg-gray-50 p-1 text-center dark:bg-gray-700'>
                        <div className='mb-0.5 text-gray-600 dark:text-gray-300'>
                          {t('readyForTransactions')}
                        </div>
                        <div className='flex items-center justify-center'>
                          <div className='mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
                          <span className='text-xs font-semibold text-green-700 dark:text-green-300'>
                            {t('online')}
                          </span>
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('connectionTypeLabel')}
                        </div>
                        <div className='text-xs font-semibold dark:text-gray-200'>
                          {t('sspRelaySecured')}
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('multisigStatusLabel')}
                        </div>
                        <div className='text-xs font-semibold text-green-700 dark:text-green-300'>
                          {t('twoOfTwoActive')}
                        </div>
                      </div>
                    </div>

                    <div className='rounded border border-blue-200 bg-blue-50 p-1 dark:border-blue-700 dark:bg-blue-900/50'>
                      <p className='text-center text-xs text-blue-800 dark:text-blue-200'>
                        {t('walletProtectedByMultisig')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('devicesPairedTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>{t('devicesPairedDescription')}</p>
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
            <div className='relative mx-auto mb-4 h-[420px] w-full max-w-sm rounded-lg border-2 border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3 dark:border-gray-600 dark:bg-gray-700'>
                  <Send className='mr-2 h-4 w-4 text-gray-600 dark:text-gray-300' />
                  <div className='text-xs text-gray-600 dark:text-gray-300'>
                    {t('sendTransaction')}
                  </div>
                </div>
                <div className='flex flex-col p-3 pt-5'>
                  <h3 className='mb-2 text-center text-base font-semibold dark:text-white'>
                    {t('sendEthereum')}
                  </h3>
                  <div className='flex-1 space-y-5'>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600 dark:text-gray-300'>
                        {t('recipientAddressLabel')}
                      </label>
                      <input
                        type='text'
                        value={transactionAddress}
                        onChange={e => setTransactionAddress(e.target.value)}
                        className='w-full rounded border border-gray-300 px-2 py-1 font-mono text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                    <div>
                      <label className='mb-1 block text-left text-sm text-gray-600 dark:text-gray-300'>
                        {t('amountEthLabel')}
                      </label>
                      <input
                        type='text'
                        value={transactionAmount}
                        onChange={e => setTransactionAmount(e.target.value)}
                        className='w-full rounded border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      />
                    </div>
                    <div className='rounded border border-gray-200 bg-gray-50 p-2 text-left dark:border-gray-600 dark:bg-gray-700'>
                      <div className='mb-1 text-sm text-gray-600 dark:text-gray-300'>
                        {t('transactionSummary')}
                      </div>
                      <div className='space-y-1 text-sm'>
                        <div className='flex justify-between'>
                          <span className='dark:text-gray-300'>{t('amountLabel')}</span>
                          <span className='font-semibold dark:text-white'>
                            {transactionAmount} ETH
                          </span>
                        </div>
                        <div className='flex justify-between'>
                          <span className='dark:text-gray-300'>{t('gasFeeLabel')}</span>
                          <span className='dark:text-gray-300'>~0.002 ETH ($6.00)</span>
                        </div>
                        <div className='mt-1 flex justify-between border-t border-gray-300 pt-1 dark:border-gray-600'>
                          <span className='font-semibold dark:text-white'>{t('totalLabel')}</span>
                          <span className='font-semibold dark:text-white'>
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
                    {t('sendTransactionButton')}
                  </motion.button>
                </div>
              </div>
            </div>
            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('createTransactionTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('createTransactionDescription')}
              </p>
            </div>
          </div>
        )

      case 1:
        return (
          <div className='flex flex-col items-center'>
            <div className='mb-8 flex justify-center space-x-6'>
              {/* Browser Extension */}
              <div className='relative h-[420px] w-80 rounded-lg border-2 border-gray-300 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'>
                <div className='absolute inset-0 overflow-hidden rounded-lg'>
                  <div className='flex h-8 items-center border-b border-gray-200 bg-gray-100 px-3 dark:border-gray-600 dark:bg-gray-700'>
                    <div className='flex items-center'>
                      <div className='mr-2 h-2 w-2 animate-pulse rounded-full bg-amber-500'></div>
                      <div className='text-xs text-gray-600 dark:text-gray-300'>
                        {t('waitingForMobileApproval')}
                      </div>
                    </div>
                  </div>
                  <div className='flex h-full flex-col p-4 pt-4 text-center'>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className='mx-auto mb-3 h-12 w-12 rounded-full border-4 border-gray-200 border-t-amber-500'
                    ></motion.div>
                    <h4 className='mb-2 font-semibold dark:text-white'>
                      {t('pendingMobileApproval')}
                    </h4>
                    <p className='mb-3 text-sm text-gray-600 dark:text-gray-300'>
                      {t('signatureOneCompleteCheckMobile')}
                    </p>

                    <div className='mb-2 rounded border border-amber-200 bg-amber-50 p-2 dark:border-amber-700 dark:bg-amber-900/50'>
                      <div className='text-sm text-amber-800 dark:text-amber-200'>
                        <div className='font-semibold'>{t('transactionDetails')}</div>
                        <div className='mt-1 text-xs'>
                          {t('sendAmount', { amount: transactionAmount })}
                          <br />
                          {t('toAddress', {
                            address: `${transactionAddress.substring(0, 20)}...`,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      <div className='flex items-center justify-center'>
                        <Smartphone className='mr-1 h-3 w-3' />
                        {t('notificationSentToMobile')}
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
                      {t('transactionApprovalRequired')}
                    </div>
                  </motion.div>
                )}
                <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                  <div className='relative h-6 rounded-t-xl bg-gray-900'>
                    <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                  </div>
                  <div className='flex h-full flex-col p-3 pt-2'>
                    <div className='mb-2 rounded bg-red-100 p-1 dark:bg-red-900/50'>
                      <div className='flex items-center text-red-800 dark:text-red-200'>
                        <Bell className='mr-2 h-5 w-5' />
                        <span className='text-sm font-semibold'>{t('transactionApproval')}</span>
                      </div>
                    </div>

                    <div className='space-y-1 text-sm'>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>{t('amount')}</div>
                        <div className='font-semibold dark:text-white'>{transactionAmount} ETH</div>
                        <div className='text-gray-500 dark:text-gray-400'>
                          ${(parseFloat(transactionAmount) * 3000).toFixed(2)}
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>
                          {t('toAddressLabel')}
                        </div>
                        <div className='font-mono text-sm dark:text-white'>
                          {transactionAddress.substring(0, 18)}...
                        </div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>{t('gasFee')}</div>
                        <div className='font-semibold dark:text-white'>0.002 ETH</div>
                      </div>
                      <div className='rounded bg-gray-50 p-1 dark:bg-gray-700'>
                        <div className='text-gray-600 dark:text-gray-300'>{t('status')}</div>
                        <div className='font-semibold text-amber-600 dark:text-amber-400'>
                          {t('awaitingApproval')}
                        </div>
                      </div>
                    </div>

                    <div className='mt-10 space-y-1'>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goNext}
                        className='w-full cursor-pointer rounded bg-green-600 py-1 text-sm font-medium text-white'
                      >
                        {biometricsEnabled ? (
                          <div className='flex items-center justify-center'>
                            <Fingerprint className='mr-2 h-4 w-4' />
                            {t('approveWithTouchId')}
                          </div>
                        ) : (
                          t('approveTwoOfTwo')
                        )}
                      </motion.button>
                      <button className='w-full cursor-pointer rounded bg-gray-300 py-1 text-sm text-gray-700 dark:bg-gray-600 dark:text-gray-300'>
                        {t('reject')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('mobileConfirmationTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {biometricsEnabled
                  ? t('mobileConfirmationDescriptionBiometric')
                  : t('mobileConfirmationDescriptionPassword')}
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-8 h-[450px] w-72 rounded-2xl border-2 border-green-300 bg-black shadow-lg'>
              <div className='absolute inset-1 overflow-hidden rounded-xl bg-white dark:bg-gray-800'>
                <div className='relative h-6 rounded-t-xl bg-gray-900'>
                  <div className='absolute top-1 left-1/2 h-1 w-8 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
                </div>
                <div className='flex h-full flex-col p-4 pt-3'>
                  <div className='mb-3 rounded bg-green-100 p-2 text-center dark:bg-green-900/50'>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', duration: 0.3 }}
                    >
                      <CheckCircle className='mx-auto mb-2 h-8 w-8 text-green-600' />
                    </motion.div>
                    <p className='text-sm font-semibold text-green-800 dark:text-green-200'>
                      {t('transactionBroadcasted')}
                    </p>
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='mb-3 rounded bg-gray-50 p-2 dark:bg-gray-700'>
                      <div className='mb-1 text-gray-600 dark:text-gray-300'>
                        {t('signaturesCollected')}
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center'>
                          <Check className='mr-2 h-4 w-4 text-green-600' />
                          <span className='text-sm dark:text-gray-300'>
                            {t('browserWalletOneOfTwo')}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Check className='mr-2 h-4 w-4 text-green-600' />
                          <span className='text-sm dark:text-gray-300'>
                            {t('mobileKeyTwoOfTwo')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className='mb-3 rounded border border-yellow-200 bg-yellow-50 p-2 text-center dark:border-yellow-700 dark:bg-yellow-900/50'>
                      <div className='mb-1 font-semibold text-yellow-700 dark:text-yellow-300'>
                        {t('networkStatus')}
                      </div>
                      <div className='text-sm text-yellow-800 dark:text-yellow-200'>
                        {t('confirmingOnEthereum')}
                      </div>
                      <div className='mt-1 text-xs text-yellow-600 dark:text-yellow-400'>
                        {t('usuallyTakesMinutes')}
                      </div>
                    </div>

                    <div className='rounded bg-gray-50 p-2 dark:bg-gray-700'>
                      <div className='mb-1 text-xs text-gray-600 dark:text-gray-300'>
                        {t('transactionHash')}
                      </div>
                      <div className='mb-2 font-mono text-xs text-gray-800 dark:text-gray-200'>
                        0xabc123...def789
                      </div>
                      <button
                        onClick={() =>
                          window.open('https://etherscan.io/tx/0xabc123def789', '_blank')
                        }
                        className='w-full cursor-pointer rounded bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700'
                      >
                        {t('viewOnEtherscan')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-lg text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('transactionSubmittedTitle')}
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                {t('transactionSubmittedDescription')}
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className='flex flex-col items-center'>
            <div className='relative mx-auto mb-6 h-80 w-full max-w-md rounded-lg border-2 border-green-300 bg-white shadow-lg dark:border-green-600 dark:bg-gray-800'>
              <div className='absolute inset-0 overflow-hidden rounded-lg'>
                <div className='flex h-8 items-center border-b border-green-200 bg-green-100 px-3 dark:border-green-700 dark:bg-green-900/50'>
                  <CheckCircle className='mr-2 h-4 w-4 text-green-600 dark:text-green-400' />
                  <div className='text-xs text-green-800 dark:text-green-200'>
                    {t('transactionConfirmed')}
                  </div>
                </div>
                <div className='flex h-full flex-col p-3 pt-2 text-center'>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                    className='mb-2'
                  >
                    <div className='mx-auto mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50'>
                      <Check className='h-5 w-5 text-green-600 dark:text-green-400' />
                    </div>
                  </motion.div>
                  <h3 className='mb-2 text-base font-semibold text-green-800 dark:text-green-200'>
                    {t('transactionSuccessful')}
                  </h3>
                  <p className='mb-2 text-xs text-gray-600 dark:text-gray-300'>
                    {t('confirmedOnEthereum')}
                  </p>

                  <div className='mb-2 rounded border border-gray-200 bg-gray-50 p-2 text-left dark:border-gray-600 dark:bg-gray-700'>
                    <div className='space-y-1 text-xs'>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-300'>{t('amountLabel')}</span>
                        <span className='font-semibold dark:text-white'>
                          {transactionAmount} ETH
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-600 dark:text-gray-300'>{t('gasFeeLabel')}</span>
                        <span className='dark:text-gray-300'>0.002 ETH</span>
                      </div>
                      <div className='flex justify-between border-t border-gray-300 pt-1 dark:border-gray-600'>
                        <span className='text-gray-600 dark:text-gray-300'>{t('hashLabel')}</span>
                        <span className='font-mono text-xs dark:text-gray-300'>
                          0xabc123...def789
                        </span>
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
                      {t('viewOnEtherscan')}
                    </motion.button>
                    <button className='w-full cursor-pointer rounded bg-gray-200 py-1.5 text-xs font-medium text-gray-700 dark:bg-gray-600 dark:text-gray-300'>
                      {t('sendAnotherTransaction')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className='max-w-2xl px-4 text-center'>
              <h3 className='mb-3 text-xl font-semibold dark:text-white'>
                {t('transactionCompleteCelebration')}
              </h3>
              <p className='mb-4 text-gray-600 dark:text-gray-300'>
                {t('fundsTransferredSummary')}
              </p>

              <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/50'>
                <h4 className='mb-3 font-semibold text-blue-900 dark:text-blue-200'>
                  {t('whyUltraSecure')}
                </h4>
                <div className='grid grid-cols-2 gap-3 text-sm text-blue-800 dark:text-blue-200'>
                  <div className='flex items-center'>
                    <Shield className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>{t('twoSeparateDevices')}</span>
                  </div>
                  <div className='flex items-center'>
                    <Lock className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>{t('twoSeparateSeeds')}</span>
                  </div>
                  <div className='flex items-center'>
                    <Zap className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>{t('trueMultisigBip48')}</span>
                  </div>
                  <div className='flex items-center'>
                    <Eye className='mr-2 h-4 w-4 flex-shrink-0' />
                    <span>{t('zeroServerStorage')}</span>
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
    const phase = phases[currentPhase]
    if (!phase) return null
    switch (phase.id) {
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

  const currentPhaseData = phases[currentPhase]
  const isLastStep =
    currentPhaseData != null &&
    currentPhase === phases.length - 1 &&
    currentStep === currentPhaseData.steps - 1

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
        className='relative mx-4 max-h-[95vh] w-full max-w-7xl overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900'
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className='from-primary-600 dark:from-primary-700 bg-gradient-to-r to-blue-600 p-6 text-white dark:to-blue-700'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold'>{t('modalTitle')}</h2>
              <p className='text-primary-100 mt-1'>{t('modalSubtitle')}</p>
            </div>
            <button
              onClick={handleClose}
              className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30'
              aria-label={t('closeDemo')}
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
                      {t(phase.titleKey)}
                    </div>
                    <div
                      className={`text-xs ${
                        index <= currentPhase ? 'text-primary-100' : 'text-white/40'
                      }`}
                    >
                      {t(phase.subtitleKey)}
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
              {[...Array(currentPhaseData?.steps ?? 0)].map((_, index) => (
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
        <div className='flex items-center justify-between bg-gray-50 px-8 py-4 dark:bg-gray-800'>
          <button
            onClick={goPrevious}
            disabled={currentPhase === 0 && currentStep === 0}
            className='flex cursor-pointer items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-300 dark:hover:text-gray-100'
          >
            <ChevronLeft className='mr-1 h-4 w-4' />
            {t('previous')}
          </button>

          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {currentPhaseData
                ? t('stepCounter', {
                    phase: t(currentPhaseData.titleKey),
                    current: currentStep + 1,
                    total: currentPhaseData.steps,
                  })
                : ''}
            </span>

            {isLastStep ? (
              <div className='flex space-x-2'>
                <button
                  onClick={reset}
                  className='cursor-pointer px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100'
                >
                  {t('restartDemo')}
                </button>
                <Link href='/download'>
                  <button
                    onClick={handleClose}
                    className='bg-primary-600 hover:bg-primary-700 cursor-pointer rounded-lg px-6 py-2 text-white transition-colors'
                  >
                    {t('downloadSspWallet')}
                  </button>
                </Link>
              </div>
            ) : (
              <button
                onClick={goNext}
                className='bg-primary-600 hover:bg-primary-700 flex cursor-pointer items-center rounded-lg px-6 py-2 text-white transition-colors'
              >
                {t('next')}
                <ChevronRight className='ml-1 h-4 w-4' />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
