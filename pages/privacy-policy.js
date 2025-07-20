import { motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - SSP Wallet Ecosystem</title>
        <meta
          name='description'
          content='Privacy Policy for the complete SSP Wallet ecosystem. Learn how we protect your privacy across our website, browser extension, mobile app, and relay service.'
        />
        <link rel='canonical' href='https://sspwallet.io/privacy-policy' />
      </Head>

      <div className='section-padding'>
        <div className='container-custom mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className='heading-1 mb-8'>Privacy Policy</h1>

            <div className='prose prose-lg dark:prose-invert max-w-none'>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  1. Introduction
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  This Privacy Policy ("Policy") describes how InFlux Technologies Limited, a UK
                  company ("we," "us," or "our"), handles information in connection with the SSP
                  Wallet ecosystem, including our websites (sspwallet.io and sspwallet.com), SSP
                  Wallet browser extension, SSP Key mobile application, SSP Relay service, and
                  related services (collectively, the "Services").
                </p>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is designed with privacy-by-design principles. We are committed to
                  minimizing data collection and ensuring user control over their cryptocurrency
                  assets and personal information.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  2. Our Privacy-First Approach
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is a self-custody cryptocurrency wallet that implements the following
                  privacy principles:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>No Private Key Access:</strong> We never have access to, store, or
                    transmit your private keys, seed phrases, or wallet passwords
                  </li>
                  <li>
                    <strong>Local Storage Only:</strong> All sensitive wallet data is stored locally
                    on your devices using AES-GCM encryption
                  </li>
                  <li>
                    <strong>Minimal Data Collection:</strong> We collect only the minimum data
                    necessary to facilitate secure device communication
                  </li>
                  <li>
                    <strong>Temporary Data:</strong> Communication data is automatically deleted
                    within 15 minutes
                  </li>
                  <li>
                    <strong>No Tracking:</strong> We do not use analytics, tracking pixels, or
                    behavioral monitoring tools
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  3. Information We Do NOT Collect
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  In accordance with our privacy-first design, we explicitly do not collect:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Private keys, seed phrases, or wallet passwords</li>
                  <li>Transaction history or blockchain data</li>
                  <li>Wallet balances or portfolio information</li>
                  <li>Personal identification information (name, address, phone number)</li>
                  <li>Email addresses (except for voluntary support communications)</li>
                  <li>Browsing history or behavioral analytics</li>
                  <li>Location data or device identifiers for tracking purposes</li>
                  <li>
                    IP addresses for user profiling (though standard web server logs may temporarily
                    contain IP addresses)
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  4. Information We Do Collect
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  4.1 Technical Communication Data
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  To enable secure 2-of-2 multisignature functionality between your browser wallet
                  and mobile app, our SSP Relay service temporarily stores:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Synchronization Data:</strong> Public keys and extended public keys
                    (xpubs) for device pairing (15-minute retention)
                  </li>
                  <li>
                    <strong>Transaction Requests:</strong> Partially signed transaction data
                    awaiting second signature (15-minute retention)
                  </li>
                  <li>
                    <strong>Firebase Tokens:</strong> Push notification tokens for mobile alerts
                    (persistent until token refresh)
                  </li>
                </ul>

                <h3 className='mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                  4.2 Device Security Data
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  For enhanced security, we generate device fingerprints using:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Canvas rendering characteristics</li>
                  <li>Browser and device specifications</li>
                  <li>Screen resolution and color depth</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  <strong>Important:</strong> This fingerprinting is used solely for additional
                  encryption layers, not for tracking or advertising purposes.
                </p>

                <h3 className='mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                  4.3 Website Usage Data
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Our website may collect standard web server logs including:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>IP addresses (for security and rate limiting)</li>
                  <li>Browser type and version</li>
                  <li>Referring websites</li>
                  <li>Access timestamps</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  5. Third-Party Services
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.1 Onramper (Fiat On/Off-Ramp)
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  When you choose to use fiat on/off-ramp services, you will be redirected to
                  Onramper, a third-party service. Your interaction with Onramper is subject to
                  their privacy policy and terms of service. We share only:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Your wallet address (with your explicit consent)</li>
                  <li>Selected blockchain network</li>
                </ul>

                <h3 className='mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.2 WalletConnect Integration
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet supports WalletConnect v2 for dApp connections. When you connect to
                  external applications:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Your wallet address may be shared with the connected dApp</li>
                  <li>Transaction requests are processed through our secure 2-of-2 system</li>
                  <li>We do not monitor or store your dApp interactions</li>
                </ul>

                <h3 className='mb-3 mt-6 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.3 Firebase Cloud Messaging
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We use Firebase Cloud Messaging to send push notifications about pending
                  transactions. This service stores device tokens but does not access message
                  content.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  6. Data Security and Encryption
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We implement multiple layers of security:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Local Encryption:</strong> All sensitive data is encrypted using AES-GCM
                    with PBKDF2 key derivation
                  </li>
                  <li>
                    <strong>Device Fingerprint Encryption:</strong> Additional encryption layer
                    using device-specific characteristics
                  </li>
                  <li>
                    <strong>BIP48 Key Derivation:</strong> Industry-standard hierarchical
                    deterministic key generation
                  </li>
                  <li>
                    <strong>Secure Transmission:</strong> All communications use HTTPS/WSS
                    encryption
                  </li>
                  <li>
                    <strong>Automatic Deletion:</strong> Temporary communication data is
                    automatically deleted within 15 minutes
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  7. Data Retention and Deletion
                </h2>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Synchronization Data:</strong> Automatically deleted after 15 minutes
                  </li>
                  <li>
                    <strong>Transaction Requests:</strong> Automatically deleted after 15 minutes
                  </li>
                  <li>
                    <strong>Push Tokens:</strong> Stored until device uninstalls app or token
                    refresh
                  </li>
                  <li>
                    <strong>Web Server Logs:</strong> Retained for security purposes for a maximum
                    of 30 days
                  </li>
                  <li>
                    <strong>Local Wallet Data:</strong> Under your complete control; can be deleted
                    by uninstalling applications
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  8. Your Rights and Controls
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  As a self-custody wallet user, you maintain complete control over your data:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Data Portability:</strong> Export your seed phrases and wallet data at
                    any time
                  </li>
                  <li>
                    <strong>Data Deletion:</strong> Uninstall applications to remove all local data
                  </li>
                  <li>
                    <strong>Service Termination:</strong> Stop using services at any time without
                    penalty
                  </li>
                  <li>
                    <strong>Communication Control:</strong> Disable push notifications in device
                    settings
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  <strong>Note:</strong> Due to blockchain immutability, transaction data recorded
                  on public blockchains cannot be deleted.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  9. International Transfers
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Our relay servers may be located in various jurisdictions. When you use SSP
                  Wallet, minimal technical data (public keys, transaction requests) may be
                  temporarily processed in these locations. All data remains encrypted and is
                  automatically deleted within 15 minutes.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  10. Open Source Transparency
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is open source software licensed under AGPL-3.0. Our code is publicly
                  auditable, ensuring transparency in our privacy practices. Security audits are
                  performed by third-party organizations including Halborn.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  11. Children's Privacy
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is not intended for use by individuals under 18 years of age. We do not
                  knowingly collect information from children under 18. If you become aware that a
                  child has provided us with personal information, please contact us immediately.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  12. Changes to This Policy
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We may update this Privacy Policy to reflect changes in our practices or legal
                  requirements. We will notify users of material changes through our website and
                  encourage periodic review of this policy.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  13. Contact Information
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  For questions about this Privacy Policy or our data practices, please contact:
                </p>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    <strong>InFlux Technologies Limited</strong>
                    <br />
                    Email: privacy@sspwallet.io
                    <br />
                    Subject Line: Privacy Policy Inquiry
                  </p>
                </div>
                <p className='mt-4 text-gray-600 dark:text-gray-400'>
                  For technical support or general inquiries, please use our support system at{' '}
                  <Link
                    href='/support'
                    className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    sspwallet.io/support
                  </Link>
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
