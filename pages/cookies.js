import { motion } from 'framer-motion'
import Head from 'next/head'

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookie Policy - SSP Wallet</title>
        <meta
          name='description'
          content='SSP Wallet Cookie Policy. Learn about how we use cookies and similar technologies.'
        />
        <link rel='canonical' href='https://sspwallet.io/cookies' />
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
                  What Are Cookies
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Cookies are small text files that are stored on your device when you visit our
                  website. They help us provide you with a better experience by remembering your
                  preferences.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  How We Use Cookies
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>We use cookies for:</p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Remembering your theme preferences (dark/light mode)</li>
                  <li>Maintaining your session while using our website</li>
                  <li>Analyzing website traffic to improve our service</li>
                  <li>Ensuring the security of our website</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Types of Cookies We Use
                </h2>
                <div className='space-y-4'>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                      Essential Cookies
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                      These cookies are necessary for the website to function properly and cannot be
                      disabled.
                    </p>
                  </div>
                  <div>
                    <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                      Preference Cookies
                    </h3>
                    <p className='text-gray-600 dark:text-gray-400'>
                      These cookies remember your preferences like theme settings and language
                      choices.
                    </p>
                  </div>
                </div>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Managing Cookies
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You can control and manage cookies through your browser settings. Please note that
                  disabling certain cookies may affect the functionality of our website.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Contact Us
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  If you have questions about our use of cookies, please contact us at
                  privacy@sspwallet.io
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
