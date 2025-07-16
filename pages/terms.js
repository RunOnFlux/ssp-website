import { motion } from 'framer-motion'
import Head from 'next/head'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - SSP Wallet</title>
        <meta
          name='description'
          content='SSP Wallet Terms of Service. Read our terms and conditions for using SSP Wallet.'
        />
        <link rel='canonical' href='https://sspwallet.io/terms' />
      </Head>

      <div className='section-padding'>
        <div className='container-custom mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='heading-1 mb-8'>Terms of Service</h1>

            <div className='prose prose-lg dark:prose-invert max-w-none'>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Acceptance of Terms
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  By using SSP Wallet, you agree to be bound by these Terms of Service. If you do
                  not agree to these terms, please do not use our service.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Self-Custody Responsibility
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is a self-custody solution. You are solely responsible for:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Securing your seed phrases and private keys</li>
                  <li>Making secure backups of your wallet data</li>
                  <li>Protecting your devices from unauthorized access</li>
                  <li>All transactions made with your wallet</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  No Warranties
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is provided "as is" without warranties of any kind. We do not guarantee
                  uninterrupted service or that the software will be error-free.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Limitation of Liability
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  In no event shall SSP Wallet be liable for any damages arising from the use or
                  inability to use our software, including but not limited to loss of funds.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  Contact Information
                </h2>
                <p className='text-gray-600 dark:text-gray-400'>
                  For questions about these Terms of Service, please contact us at
                  legal@sspwallet.io
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
