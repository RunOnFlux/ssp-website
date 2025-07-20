import { motion } from 'framer-motion'
import Head from 'next/head'

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy - SSP Wallet Website</title>
        <meta
          name='description'
          content='Learn about how we use cookies on the sspwallet.io website. Manage your cookie preferences and understand our GDPR-compliant practices.'
        />
        <link rel='canonical' href='https://sspwallet.io/cookie-policy' />
      </Head>

      <div className='section-padding'>
        <div className='container-custom mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className='heading-1 mb-8'>Cookie Policy</h1>

            <div className='prose prose-lg dark:prose-invert max-w-none'>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  1. Introduction
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  This Cookie Policy explains how InFlux Technologies Limited ("we," "us," or "our")
                  uses cookies and similar technologies on our websites sspwallet.io and
                  sspwallet.com ("Website"). This policy should be read alongside our Privacy Policy
                  and Terms of Service.
                </p>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  This policy covers only the Website. For information about data handling in SSP
                  Wallet applications, please refer to our Privacy Policy and Terms of Service.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  2. What Are Cookies
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Cookies are small text files that are placed on your device when you visit our
                  Website. They help us provide you with a better browsing experience by:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Remembering your preferences and settings</li>
                  <li>Understanding how you interact with our Website</li>
                  <li>Improving our Website performance and functionality</li>
                  <li>Providing relevant content and features</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  3. Types of Cookies We Use
                </h2>

                <div className='space-y-6'>
                  <div className='rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20'>
                    <h3 className='mb-2 text-lg font-semibold text-green-900 dark:text-green-100'>
                      3.1 Strictly Necessary Cookies
                    </h3>
                    <p className='mb-2 text-green-800 dark:text-green-200'>
                      These cookies are essential for the Website to function properly and cannot be
                      disabled:
                    </p>
                    <ul className='list-disc space-y-1 pl-6 text-green-700 dark:text-green-300'>
                      <li>
                        <strong>Session Management:</strong> Maintaining your session while browsing
                      </li>
                      <li>
                        <strong>Security:</strong> Protection against cross-site request forgery
                        (CSRF)
                      </li>
                      <li>
                        <strong>Cookie Consent:</strong> Remembering your cookie preferences
                      </li>
                    </ul>
                  </div>

                  <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-700 dark:bg-blue-900/20'>
                    <h3 className='mb-2 text-lg font-semibold text-blue-900 dark:text-blue-100'>
                      3.2 Functional Cookies
                    </h3>
                    <p className='mb-2 text-blue-800 dark:text-blue-200'>
                      These cookies enhance your Website experience and remember your choices:
                    </p>
                    <ul className='list-disc space-y-1 pl-6 text-blue-700 dark:text-blue-300'>
                      <li>
                        <strong>Theme Preferences:</strong> Remembering dark/light mode selection
                      </li>
                      <li>
                        <strong>Language Settings:</strong> Storing your preferred language
                      </li>
                      <li>
                        <strong>Display Preferences:</strong> Font size and layout choices
                      </li>
                    </ul>
                    <p className='mt-2 text-sm text-blue-600 dark:text-blue-400'>
                      You can control these cookies through our cookie banner or browser settings.
                    </p>
                  </div>

                  <div className='rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-700 dark:bg-purple-900/20'>
                    <h3 className='mb-2 text-lg font-semibold text-purple-900 dark:text-purple-100'>
                      3.3 Analytics Cookies
                    </h3>
                    <p className='mb-2 text-purple-800 dark:text-purple-200'>
                      These cookies help us understand how visitors interact with our Website:
                    </p>
                    <ul className='list-disc space-y-1 pl-6 text-purple-700 dark:text-purple-300'>
                      <li>
                        <strong>Google Analytics:</strong> Website traffic and user behavior
                        analysis
                      </li>
                      <li>
                        <strong>Page Views:</strong> Most popular content and pages
                      </li>
                      <li>
                        <strong>User Journey:</strong> How visitors navigate through our Website
                      </li>
                      <li>
                        <strong>Performance Metrics:</strong> Page load times and technical
                        performance
                      </li>
                    </ul>
                    <p className='mt-2 text-sm text-purple-600 dark:text-purple-400'>
                      These cookies require your consent and can be disabled through our cookie
                      banner.
                    </p>
                  </div>
                </div>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  4. Google Analytics
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We use Google Analytics to understand how our Website is used and to improve our
                  services. Google Analytics collects information such as:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Pages visited and time spent on each page</li>
                  <li>How you arrived at our Website (referral sources)</li>
                  <li>Your approximate geographic location (country/region level)</li>
                  <li>Device and browser information</li>
                  <li>Interactions with Website features</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Google Analytics data is anonymized and aggregated. We do not collect personally
                  identifiable information through analytics. For more information, see
                  <a
                    href='https://policies.google.com/privacy'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    Google's Privacy Policy
                  </a>
                  .
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  5. Your Cookie Choices
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.1 Cookie Consent Banner
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  When you first visit our Website, you'll see a cookie consent banner allowing you
                  to:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Accept All:</strong> Enable all functional and analytics cookies
                  </li>
                  <li>
                    <strong>Accept Only Necessary:</strong> Use only essential cookies required for
                    Website function
                  </li>
                  <li>
                    <strong>Customize:</strong> Choose which types of cookies to enable
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.2 Changing Your Preferences
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You can change your cookie preferences at any time by:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Clicking the "Cookie Settings" link in our Website footer</li>
                  <li>Clearing your browser cookies and revisiting our Website</li>
                  <li>Using your browser's cookie management settings</li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.3 Browser Settings
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You can also control cookies through your browser settings:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Chrome:</strong> Settings → Privacy and Security → Site Settings →
                    Cookies
                  </li>
                  <li>
                    <strong>Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking
                    Protection
                  </li>
                  <li>
                    <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                  </li>
                  <li>
                    <strong>Edge:</strong> Settings → Site Permissions → Cookies and Site Data
                  </li>
                </ul>

                <div className='mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20'>
                  <p className='text-amber-800 dark:text-amber-200'>
                    <strong>⚠️ Note:</strong> Disabling cookies may affect Website functionality and
                    your browsing experience.
                  </p>
                </div>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  6. Third-Party Services
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Our Website may include content or links to third-party services that may set
                  their own cookies:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Google Analytics:</strong> Website analytics and performance monitoring
                  </li>
                  <li>
                    <strong>Social Media:</strong> Embedded content from social platforms
                  </li>
                  <li>
                    <strong>CDN Services:</strong> Content delivery networks for faster loading
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  These third-party services are governed by their own privacy policies and cookie
                  practices.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  7. Data Retention
                </h2>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Session Cookies:</strong> Deleted when you close your browser
                  </li>
                  <li>
                    <strong>Persistent Cookies:</strong> Stored for specific periods based on their
                    purpose
                  </li>
                  <li>
                    <strong>Analytics Data:</strong> Retained for up to 26 months as per Google
                    Analytics settings
                  </li>
                  <li>
                    <strong>Preference Cookies:</strong> Stored until you clear them or change your
                    settings
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  8. GDPR Compliance
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  In accordance with the General Data Protection Regulation (GDPR), we:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Only set non-essential cookies with your explicit consent</li>
                  <li>Provide clear information about each type of cookie we use</li>
                  <li>Allow you to withdraw consent at any time</li>
                  <li>Enable granular control over different cookie categories</li>
                  <li>Maintain records of your consent choices</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  9. Updates to This Policy
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We may update this Cookie Policy periodically to reflect changes in our practices,
                  technology, or legal requirements. Material changes will be communicated through
                  our Website and you may be asked to provide fresh consent.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  10. Contact Information
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  For questions about this Cookie Policy or to exercise your rights regarding
                  cookies, please contact:
                </p>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    <strong>InFlux Technologies Limited</strong>
                    <br />
                    Email: privacy@sspwallet.io
                    <br />
                    Subject Line: Cookie Policy Inquiry
                  </p>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
