/* eslint-disable no-console */
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent')
    const analyticsConsent = localStorage.getItem('analytics-consent')

    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 CookieConsent component loaded')
      console.log('📋 Stored consent:', consent)
      console.log('📊 Analytics consent flag:', analyticsConsent)
    }

    if (!consent) {
      if (process.env.NODE_ENV === 'development') {
        console.log('👋 No consent found - showing banner')
      }
      setShowBanner(true)
    } else {
      // Load existing preferences
      try {
        const savedPreferences = JSON.parse(consent)
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Loaded saved preferences:', savedPreferences)
        }
        setPreferences(savedPreferences)

        // Initialize Google Analytics if analytics consent was given
        if (savedPreferences.analytics && analyticsConsent === 'granted') {
          if (process.env.NODE_ENV === 'development') {
            console.log('📈 Initializing GA based on saved consent')
          }
          // Load GA script for returning users with consent
          initializeGoogleAnalytics()
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('🚫 Not initializing GA - consent not granted')
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error parsing consent:', error)
        }
        // If parsing fails, show banner again
        setShowBanner(true)
      }
    }
  }, [])

  // Add/remove body class when banner visibility changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (showBanner) {
        document.body.classList.add('cookie-banner-visible')
      } else {
        document.body.classList.remove('cookie-banner-visible')
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('cookie-banner-visible')
      }
    }
  }, [showBanner])

  const initializeGoogleAnalytics = () => {
    // Load Google Analytics script only after consent
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

      // Create and append GA script
      const script1 = document.createElement('script')
      script1.async = true
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
      document.head.appendChild(script1)

      // Initialize gtag
      const script2 = document.createElement('script')
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_TRACKING_ID}', {
          page_path: window.location.pathname,
        });
      `
      document.head.appendChild(script2)

      // Track the consent event after gtag is loaded
      setTimeout(() => {
        if (window.gtag) {
          window.gtag('event', 'consent_granted', {
            event_category: 'engagement',
            event_label: 'analytics',
          })
        }
      }, 100)
    }
  }

  const disableGoogleAnalytics = () => {
    // Disable Google Analytics if it's loaded
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      })

      // Track the consent denial event (optional since user declined)
      window.gtag('event', 'consent_denied', {
        event_category: 'engagement',
        event_label: 'analytics',
      })
    }
    // Note: If GA script isn't loaded yet, there's nothing to disable
  }

  const savePreferences = newPreferences => {
    const consentData = {
      ...newPreferences,
      necessary: true, // Always true
      timestamp: new Date().toISOString(),
      version: '1.0',
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('💾 Saving cookie preferences:', consentData)
    }

    // Always store the consent choice (to remember user's decision)
    localStorage.setItem('cookie-consent', JSON.stringify(consentData))
    setPreferences(consentData)

    // Handle Google Analytics based on consent
    if (newPreferences.analytics) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ User ACCEPTED analytics - enabling tracking')
      }
      initializeGoogleAnalytics()
      // Set a flag that analytics is allowed (for future GA implementation)
      localStorage.setItem('analytics-consent', 'granted')
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ User DECLINED analytics - disabling tracking and clearing cookies')
      }
      disableGoogleAnalytics()
      // Remove any analytics consent and clear analytics data
      localStorage.removeItem('analytics-consent')
      // Clear any existing Google Analytics cookies if they exist
      clearAnalyticsCookies()
    }

    setShowBanner(false)
  }

  const clearAnalyticsCookies = () => {
    if (typeof document === 'undefined') return

    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Clearing analytics cookies...')
    }

    // Clear Google Analytics cookies when user declines
    const analyticsCookies = ['_ga', '_gid', '_gat']
    const currentCookies = document.cookie.split('; ').filter(cookie => cookie.trim())

    if (process.env.NODE_ENV === 'development') {
      console.log(
        '🔍 Current cookies:',
        currentCookies.map(c => c.split('=')[0])
      )
    }

    let clearedCount = 0
    currentCookies.forEach(cookie => {
      const [name] = cookie.split('=')

      // Check if this cookie matches any GA pattern
      const isAnalyticsCookie = analyticsCookies.some(
        pattern => name.startsWith(pattern) || name.includes('_ga_') || name.includes('_gat_')
      )

      if (isAnalyticsCookie) {
        if (process.env.NODE_ENV === 'development') {
          console.log(`🗑️ Clearing analytics cookie: ${name}`)
        }
        clearedCount++

        // Clear from all possible domains and paths
        const domains = ['', '.sspwallet.io', '.sspwallet.com', 'sspwallet.io', 'sspwallet.com']
        const paths = ['/', '/']

        domains.forEach(domain => {
          paths.forEach(path => {
            const domainPart = domain ? `; domain=${domain}` : ''
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainPart}`
          })
        })
      }
    })

    if (process.env.NODE_ENV === 'development') {
      console.log(`✨ Cleared ${clearedCount} analytics cookies`)
    }
  }

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
    })
  }

  const declineAnalytics = () => {
    savePreferences({
      necessary: true,
      analytics: false,
    })
  }

  // Global functions for cookie management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Function to reopen cookie settings
      window.openCookieSettings = () => {
        setShowBanner(true)
      }

      // Function to check if analytics consent is granted (for GA implementation)
      window.hasAnalyticsConsent = () => {
        try {
          const consent = localStorage.getItem('cookie-consent')
          const analyticsConsent = localStorage.getItem('analytics-consent')

          if (!consent) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 No cookie consent found')
            }
            return false
          }

          const consentData = JSON.parse(consent)
          const hasAnalytics = consentData.analytics === true && analyticsConsent === 'granted'

          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 Analytics consent check:', {
              consentData: consentData.analytics,
              analyticsFlag: analyticsConsent,
              result: hasAnalytics,
            })
          }

          return hasAnalytics
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Error checking analytics consent:', error)
          }
          return false
        }
      }

      // Function to check if analytics consent exists at all
      window.hasConsentChoice = () => {
        const hasChoice = localStorage.getItem('cookie-consent') !== null
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 User has made consent choice:', hasChoice)
        }
        return hasChoice
      }

      // Function to get full consent data (for debugging)
      window.getConsentData = () => {
        try {
          const consent = localStorage.getItem('cookie-consent')
          const analyticsConsent = localStorage.getItem('analytics-consent')
          return {
            consent: consent ? JSON.parse(consent) : null,
            analyticsFlag: analyticsConsent,
          }
        } catch (error) {
          return { error: error.message }
        }
      }
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900'
          >
            <div className='container-custom mx-auto p-4'>
              <div className='flex flex-col items-start gap-4 lg:flex-row lg:items-center'>
                <div className='flex-1'>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                    🍪 We use cookies
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    We use essential cookies for website functionality and optional analytics
                    cookies to help us improve our website. Analytics are completely disabled by
                    default and only activate with your consent.
                  </p>
                  <p className='mt-1 text-xs text-gray-500 dark:text-gray-500'>
                    Read our{' '}
                    <Link
                      href='/cookie-policy'
                      className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                    >
                      Cookie Policy
                    </Link>{' '}
                    for more information.
                  </p>
                </div>

                <div className='flex min-w-fit flex-col gap-2 sm:flex-row'>
                  <button
                    onClick={declineAnalytics}
                    className='cursor-pointer rounded-lg border border-gray-300 px-6 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                  >
                    Decline
                  </button>
                  <button
                    onClick={acceptAll}
                    className='cursor-pointer rounded-lg bg-blue-600 px-6 py-2 text-sm text-white transition-colors hover:bg-blue-700'
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
