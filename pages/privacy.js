import { motion } from 'framer-motion'
import Head from 'next/head'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SSP Wallet</title>
        <meta
          name='description'
          content='SSP Wallet Privacy Policy. Learn how we protect your privacy and data.'
        />
        <link rel='canonical' href='https://sspwallet.io/privacy' />
      </Head>

      <div className='section-padding'>
        <div className='container-custom mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='heading-1 mb-8'>Privacy Policy</h1>

            <div className='prose prose-lg dark:prose-invert max-w-none'>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Our Commitment to Privacy
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is committed to protecting your privacy. This Privacy Policy explains
                  how we collect, use, and safeguard your information when you use our wallet
                  application.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Data We Don't Collect
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is designed with privacy in mind:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>We do not store your private keys or seed phrases</li>
                  <li>We do not collect your transaction history</li>
                  <li>We do not track your wallet balances</li>
                  <li>We do not store personal identification information</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Local Storage
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  All wallet data is stored locally on your device. This includes your encrypted
                  wallet files, preferences, and transaction history. This data never leaves your
                  device unless you explicitly choose to share it.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Contact Us
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  If you have questions about this Privacy Policy, please contact us at
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
