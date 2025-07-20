import { motion } from 'framer-motion'
import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service - SSP Wallet Ecosystem</title>
        <meta
          name='description'
          content='Terms of Service for the complete SSP Wallet ecosystem including website, browser extension, mobile app, and relay service.'
        />
        <link rel='canonical' href='https://sspwallet.io/terms-of-service' />
      </Head>

      <div className='section-padding'>
        <div className='container-custom mx-auto max-w-4xl'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className='heading-1 mb-8'>Terms of Service</h1>

            <div className='prose prose-lg dark:prose-invert max-w-none'>
              <p className='mb-8 text-lg text-gray-600 dark:text-gray-400'>
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  1. Introduction and Acceptance
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  These Terms of Service ("Terms") constitute a legal agreement between you ("User,"
                  "you," or "your") and InFlux Technologies Limited, a company incorporated in the
                  United Kingdom ("Company," "we," "us," or "our"), governing your use of the entire
                  SSP Wallet ecosystem, including but not limited to:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>SSP Wallet Websites:</strong> sspwallet.io, sspwallet.com, and related
                    web properties
                  </li>
                  <li>
                    <strong>SSP Wallet Browser Extension:</strong> Chrome, Firefox, and other
                    browser wallet applications
                  </li>
                  <li>
                    <strong>SSP Key Mobile Applications:</strong> iOS and Android companion apps for
                    transaction approval
                  </li>
                  <li>
                    <strong>SSP Relay Service:</strong> Communication infrastructure enabling device
                    synchronization
                  </li>
                  <li>
                    <strong>Documentation and Support:</strong> docs.sspwallet.io and related
                    educational resources
                  </li>
                  <li>
                    <strong>APIs and SDKs:</strong> Developer tools and integration services
                    (collectively, the "Services")
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  By downloading, installing, accessing, or using any part of the Services, you
                  acknowledge that you have read, understood, and agree to be bound by these Terms.
                  If you do not agree to these Terms, do not use the Services.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  2. Service Description and Nature
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  2.1 Self-Custody Wallet System
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is a self-custody cryptocurrency wallet that implements a 2-of-2
                  multisignature system requiring two separate devices (browser and mobile) to
                  authorize transactions. Key characteristics include:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Non-Custodial:</strong> We never have access to, control over, or
                    responsibility for your cryptocurrency assets
                  </li>
                  <li>
                    <strong>Open Source:</strong> All software is licensed under AGPL-3.0 and
                    publicly auditable
                  </li>
                  <li>
                    <strong>Self-Hosted:</strong> Users maintain complete control over their private
                    keys and seed phrases
                  </li>
                  <li>
                    <strong>Communication Facilitator:</strong> Our relay service only facilitates
                    secure communication between your devices
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  2.2 Technical Architecture
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  The Services operate using the following technical framework:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>BIP48 Key Derivation:</strong> Industry-standard hierarchical
                    deterministic key generation
                  </li>
                  <li>
                    <strong>AES-GCM Encryption:</strong> Military-grade encryption for local data
                    storage
                  </li>
                  <li>
                    <strong>Device Fingerprinting:</strong> Additional security layer using
                    device-specific characteristics
                  </li>
                  <li>
                    <strong>Temporary Relay Storage:</strong> Communication data automatically
                    deleted within 15 minutes
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  3. User Responsibilities and Obligations
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  3.1 Complete Self-Custody Responsibility
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  As a self-custody wallet user, you acknowledge and accept complete responsibility
                  for:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Seed Phrase Security:</strong> Securing, backing up, and never sharing
                    your 24-word seed phrases for both wallet and key
                  </li>
                  <li>
                    <strong>Password Protection:</strong> Creating and maintaining strong, unique
                    passwords for wallet encryption
                  </li>
                  <li>
                    <strong>Device Security:</strong> Protecting both browser and mobile devices
                    from unauthorized access, malware, and physical theft
                  </li>
                  <li>
                    <strong>Transaction Verification:</strong> Carefully reviewing all transaction
                    details before approval
                  </li>
                  <li>
                    <strong>Backup Maintenance:</strong> Creating and securely storing multiple
                    backups of your seed phrases
                  </li>
                  <li>
                    <strong>Loss Prevention:</strong> Understanding that lost seed phrases or
                    passwords cannot be recovered by us
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  3.2 Prohibited Uses
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You agree not to use the Services for:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Any illegal activities or violation of applicable laws and regulations</li>
                  <li>Money laundering, terrorist financing, or other criminal activities</li>
                  <li>Activities that would violate sanctions or export control laws</li>
                  <li>
                    Attempting to reverse engineer, decompile, or exploit vulnerabilities in the
                    Services
                  </li>
                  <li>
                    Using the Services in jurisdictions where cryptocurrency use is prohibited
                  </li>
                  <li>Creating multiple accounts to circumvent any limitations or restrictions</li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  3.3 Compliance with Laws
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You are solely responsible for compliance with all applicable laws in your
                  jurisdiction, including but not limited to:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Tax reporting and payment obligations</li>
                  <li>Anti-money laundering (AML) and know your customer (KYC) requirements</li>
                  <li>Securities and commodities regulations</li>
                  <li>Consumer protection laws</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  4. Service Provision and Availability
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  4.1 Service Availability
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  While we strive to maintain service availability, we do not guarantee:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Uninterrupted access to relay services</li>
                  <li>Compatibility with all devices, browsers, or operating systems</li>
                  <li>Availability in all jurisdictions</li>
                  <li>Continued operation of third-party blockchain networks</li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  4.2 Third-Party Dependencies
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  The Services integrate with third-party services and networks, including:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Blockchain Networks:</strong> Bitcoin, Ethereum, and other supported
                    blockchains
                  </li>
                  <li>
                    <strong>RPC Providers:</strong> Third-party node providers for blockchain
                    interaction
                  </li>
                  <li>
                    <strong>Onramper:</strong> Fiat on/off-ramp services (subject to their terms)
                  </li>
                  <li>
                    <strong>WalletConnect:</strong> dApp connection protocol
                  </li>
                  <li>
                    <strong>App Stores:</strong> Apple App Store and Google Play Store distribution
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We are not responsible for the availability, security, or functionality of these
                  third-party services and accept no liability for any losses arising from their
                  use, failure, or compromise.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  5. Open Source License and Intellectual Property
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.1 AGPL-3.0 License
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet software is licensed under the GNU Affero General Public License v3.0
                  (AGPL-3.0). This means:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>You have the right to use, modify, and distribute the software</li>
                  <li>Any modifications must also be made available under AGPL-3.0</li>
                  <li>Network use triggers copyleft obligations</li>
                  <li>Source code must remain publicly available</li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  5.2 Trademarks and Branding
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  "SSP Wallet," "SSP Key," related logos, and branding elements are trademarks of
                  InFlux Technologies Limited. The open source license does not grant rights to use
                  our trademarks without permission.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  6. Risk Disclosures and Disclaimers
                </h2>

                <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20'>
                  <h3 className='mb-2 text-lg font-semibold text-red-900 dark:text-red-100'>
                    ⚠️ Important Risk Warning
                  </h3>
                  <p className='text-red-800 dark:text-red-200'>
                    Cryptocurrency involves significant financial risk. Only use funds you can
                    afford to lose entirely. Past performance does not guarantee future results. We
                    provide software tools, not investment advice.
                  </p>
                </div>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.1 Cryptocurrency Risks
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You acknowledge and accept the following risks associated with cryptocurrency use:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Volatility:</strong> Cryptocurrency values can fluctuate dramatically
                  </li>
                  <li>
                    <strong>Irreversibility:</strong> Blockchain transactions cannot be reversed
                  </li>
                  <li>
                    <strong>Regulatory Risk:</strong> Laws may change affecting cryptocurrency
                    legality or taxation
                  </li>
                  <li>
                    <strong>Technical Risk:</strong> Software bugs, network forks, or protocol
                    changes may cause losses
                  </li>
                  <li>
                    <strong>Liquidity Risk:</strong> Markets may become illiquid, preventing asset
                    conversion
                  </li>
                  <li>
                    <strong>Counterparty Risk:</strong> Third-party services may fail, be hacked, or
                    cease operations
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.2 Technology Risks
                </h3>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Device Loss/Theft:</strong> Loss of devices containing wallet data may
                    result in permanent fund loss
                  </li>
                  <li>
                    <strong>Malware/Phishing:</strong> Malicious software or social engineering
                    attacks may compromise security
                  </li>
                  <li>
                    <strong>User Error:</strong> Incorrect addresses, amounts, or other mistakes may
                    cause irreversible losses
                  </li>
                  <li>
                    <strong>Network Attacks:</strong> Blockchain networks may suffer attacks
                    affecting transaction processing
                  </li>
                  <li>
                    <strong>Software Vulnerabilities:</strong> Unknown bugs or security flaws may be
                    discovered
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.3 No Financial Advice
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  The Services provide technology tools only. We do not provide:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Investment advice or recommendations</li>
                  <li>Financial planning or advisory services</li>
                  <li>Tax or legal advice</li>
                  <li>Market predictions or guarantees</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  7. Limitation of Liability and Disclaimers
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  7.1 "AS IS" Provision and Complete Disclaimer
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                  KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY. WE EXPRESSLY DISCLAIM ALL LIABILITY
                  AND RESPONSIBILITY FOR ANY DAMAGES, LOSSES, OR HARM ARISING FROM YOUR USE OF THE
                  SERVICES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE</li>
                  <li>NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
                  <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                  <li>SECURITY OR FREEDOM FROM VULNERABILITIES</li>
                  <li>ACCURACY OR COMPLETENESS OF INFORMATION</li>
                  <li>PROTECTION AGAINST LOSS OF CRYPTOCURRENCY OR DIGITAL ASSETS</li>
                  <li>RECOVERY OF LOST FUNDS, PASSWORDS, OR SEED PHRASES</li>
                  <li>COMPATIBILITY WITH ALL DEVICES OR SYSTEMS</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  WE ACCEPT NO RESPONSIBILITY OR LIABILITY FOR ANY LOSSES, DAMAGES, OR HARM
                  WHATSOEVER ARISING FROM YOUR USE OF THE SERVICES.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  7.2 Complete Exclusion of Liability
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, INFLUX TECHNOLOGIES LIMITED, ITS
                  DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, CONTRACTORS, AND AFFILIATES SHALL HAVE
                  ABSOLUTELY NO LIABILITY WHATSOEVER FOR ANY DAMAGES, LOSSES, CLAIMS, OR HARM OF ANY
                  KIND, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>LOSS OF CRYPTOCURRENCY, DIGITAL ASSETS, OR FUNDS OF ANY KIND</li>
                  <li>DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                  <li>LOST PROFITS, REVENUE, BUSINESS OPPORTUNITIES, OR EXPECTED SAVINGS</li>
                  <li>DATA LOSS, CORRUPTION, OR UNAUTHORIZED ACCESS</li>
                  <li>BUSINESS INTERRUPTION, SYSTEM DOWNTIME, OR SERVICE UNAVAILABILITY</li>
                  <li>THIRD-PARTY ACTIONS, BLOCKCHAIN NETWORK ISSUES, OR PROTOCOL FAILURES</li>
                  <li>HACKING, THEFT, FRAUD, OR OTHER SECURITY BREACHES</li>
                  <li>SOFTWARE BUGS, ERRORS, OR VULNERABILITIES</li>
                  <li>USER ERROR, NEGLIGENCE, OR MISUSE OF THE SERVICES</li>
                  <li>REGULATORY CHANGES OR LEGAL RESTRICTIONS</li>
                  <li>LOSS OF PRIVATE KEYS, SEED PHRASES, OR PASSWORDS</li>
                  <li>ANY OTHER LOSS OR DAMAGE WHATSOEVER</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  THIS EXCLUSION APPLIES REGARDLESS OF THE LEGAL THEORY ON WHICH ANY CLAIM IS BASED,
                  INCLUDING CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR OTHERWISE, AND EVEN IF
                  WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  7.3 No Liability Under Any Circumstances
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  NOTWITHSTANDING ANY OTHER PROVISION IN THESE TERMS, AND TO THE MAXIMUM EXTENT
                  PERMITTED BY APPLICABLE LAW, INFLUX TECHNOLOGIES LIMITED AND ITS AFFILIATES SHALL
                  HAVE NO LIABILITY WHATSOEVER FOR ANY CLAIMS, DAMAGES, LOSSES, OR HARM ARISING FROM
                  OR RELATED TO THE SERVICES. IN JURISDICTIONS WHERE LIABILITY CANNOT BE COMPLETELY
                  EXCLUDED, OUR TOTAL LIABILITY SHALL BE LIMITED TO THE MINIMUM AMOUNT PERMITTED BY
                  LAW.
                </p>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  YOU ACKNOWLEDGE AND AGREE THAT YOU USE THE SERVICES ENTIRELY AT YOUR OWN RISK AND
                  THAT WE BEAR NO RESPONSIBILITY FOR ANY CONSEQUENCES OF YOUR USE.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  8. Indemnification
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You agree to indemnify, defend, and hold harmless InFlux Technologies Limited and
                  its officers, directors, employees, and affiliates from and against any claims,
                  damages, losses, costs, or expenses (including reasonable attorneys' fees) arising
                  from:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Your use or misuse of the Services</li>
                  <li>Your violation of these Terms or applicable laws</li>
                  <li>Your cryptocurrency transactions or activities</li>
                  <li>Loss or theft of your devices, seed phrases, or passwords</li>
                  <li>Claims by third parties related to your use of the Services</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  9. Privacy and Data Protection
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Our collection and use of information is governed by our Privacy Policy, which is
                  incorporated into these Terms by reference. Key privacy principles include:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    Minimal data collection (no private keys, seed phrases, or personal information)
                  </li>
                  <li>Temporary storage (relay data deleted within 15 minutes)</li>
                  <li>Local encryption using AES-GCM and PBKDF2</li>
                  <li>No tracking or behavioral analytics</li>
                  <li>Transparent open source code</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  10. Dispute Resolution
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  10.1 Governing Law
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  These Terms shall be governed by and construed in accordance with the laws of
                  England and Wales, without regard to conflict of law principles.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  10.2 Jurisdiction
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Any disputes arising from these Terms or your use of the Services shall be subject
                  to the exclusive jurisdiction of the courts of England and Wales.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  10.3 Alternative Dispute Resolution
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Before initiating formal legal proceedings, parties agree to attempt resolution
                  through good faith negotiations for a period of 30 days.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  11. Service Modifications and Termination
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  11.1 Right to Modify
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We reserve the right to modify, suspend, or discontinue any part of the Services
                  at any time, with or without notice. However, as open source software, you may
                  continue using existing versions.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  11.2 User Termination
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You may stop using the Services at any time by uninstalling the applications and
                  ceasing to access our websites. Your locally stored wallet data will remain under
                  your control.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  11.3 Effect of Termination
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Upon termination of your use:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Your access to relay services will cease</li>
                  <li>Local wallet data remains under your control</li>
                  <li>Open source license rights continue per AGPL-3.0</li>
                  <li>Provisions regarding liability and indemnification survive</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  12. Age Restrictions and Capacity
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  The Services are not intended for use by individuals under 18 years of age. By
                  using the Services, you represent and warrant that you:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Are at least 18 years old (or the age of majority in your jurisdiction)</li>
                  <li>Have the legal capacity to enter into these Terms</li>
                  <li>Are not prohibited from using the Services under applicable laws</li>
                  <li>Will use the Services in compliance with all applicable laws</li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  13. Updates to Terms
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We may update these Terms periodically to reflect changes in our services, legal
                  requirements, or business practices. Material changes will be communicated
                  through:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Prominent notice on our website</li>
                  <li>In-application notifications</li>
                  <li>Updated version date at the top of these Terms</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Continued use of the Services after changes constitute acceptance of the updated
                  Terms.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  14. Severability and Entire Agreement
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  If any provision of these Terms is found to be unenforceable, the remaining
                  provisions shall remain in full force and effect. These Terms, together with our
                  Privacy Policy and Cookie Policy, constitute the entire agreement between you and
                  InFlux Technologies Limited regarding the Services.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  15. Contact Information
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  For questions about these Terms of Service, please contact:
                </p>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    <strong>InFlux Technologies Limited</strong>
                    <br />
                    Email: legal@sspwallet.io
                    <br />
                    Subject Line: Terms of Service Inquiry
                  </p>
                </div>
                <p className='mt-4 text-gray-600 dark:text-gray-400'>
                  For technical support, please use our support system at{' '}
                  <Link
                    href='/support'
                    className='text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  >
                    sspwallet.io/support
                  </Link>
                </p>
              </section>

              <div className='mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-700 dark:bg-blue-900/20'>
                <h3 className='mb-3 text-lg font-semibold text-blue-900 dark:text-blue-100'>
                  📋 Summary of Key Points
                </h3>
                <ul className='list-disc space-y-2 pl-6 text-blue-800 dark:text-blue-200'>
                  <li>
                    <strong>Self-Custody:</strong> You control your keys and bear all responsibility
                    for security
                  </li>
                  <li>
                    <strong>Open Source:</strong> Software is AGPL-3.0 licensed and publicly
                    auditable
                  </li>
                  <li>
                    <strong>No Warranties:</strong> Services provided "as is" without guarantees
                  </li>
                  <li>
                    <strong>No Liability:</strong> We accept no liability for any losses or damages
                  </li>
                  <li>
                    <strong>Privacy-First:</strong> Minimal data collection with automatic deletion
                  </li>
                  <li>
                    <strong>UK Law:</strong> Governed by English law with UK jurisdiction
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
