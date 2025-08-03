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
                Last updated: July 20, 2025
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
                  6. Wallet-Specific Terms and Self-Custody Responsibilities
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.1 Self-Custody Responsibility
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is a self-custody cryptocurrency wallet. You are entirely responsible
                  for managing and securing your seed phrases, wallet addresses, and digital assets.
                  We do not store, manage, or have access to your seed phrases, passwords, or
                  private keys. Any loss, compromise, or unauthorized access to your wallet is
                  solely your responsibility.
                </p>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  <strong>Critical Warning:</strong> If you lose your seed phrase or password, we
                  cannot assist in recovering your assets. It is critical that you securely store
                  your seed phrase in a safe and offline location.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.2 Third-Party Services and Integrations
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet provides access to third-party services, including but not limited to:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Cryptocurrency swaps and exchanges</strong> (including QuickSwap and
                    other decentralized exchange solutions)
                  </li>
                  <li>
                    <strong>Onramp and offramp services</strong> for purchasing and selling
                    cryptocurrencies
                  </li>
                  <li>
                    <strong>Integration with decentralized applications (DApps)</strong>
                  </li>
                  <li>
                    <strong>WalletConnect protocol</strong> for dApp connections
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  These services are operated by independent providers. We do not control, endorse,
                  or guarantee their availability, functionality, or security. When using
                  third-party services, their respective terms and conditions apply. SSP Wallet is
                  not liable for any loss, errors, or security breaches resulting from these
                  services.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.3 Cryptocurrency Swapping Services
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet integrates QuickSwap and other decentralized exchange (DEX) solutions
                  to allow users to swap cryptocurrencies. However, all swaps are executed on
                  third-party platforms, and SSP Wallet does not facilitate or process the
                  transactions directly.
                </p>
                <div className='mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20'>
                  <h4 className='mb-2 text-lg font-semibold text-amber-900 dark:text-amber-100'>
                    Key Considerations When Using Swap Services:
                  </h4>
                  <ul className='list-disc space-y-2 pl-6 text-amber-800 dark:text-amber-200'>
                    <li>
                      Transactions occur on the blockchain and are <strong>irreversible</strong>{' '}
                      once executed
                    </li>
                    <li>
                      Exchange rates and liquidity are determined by third-party providers and can
                      fluctuate rapidly
                    </li>
                    <li>
                      <strong>Floating rates apply:</strong> The final amount received may differ
                      from the initially displayed estimate due to market volatility
                    </li>
                    <li>
                      Network fees (gas fees) apply and vary depending on blockchain congestion
                    </li>
                    <li>Users must verify all swap details before confirming any transactions</li>
                  </ul>
                </div>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.4 Purchasing and Selling Cryptocurrencies
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet provides access to third-party cryptocurrency onramp and offramp
                  services through integration with Onramper and other providers. These services are
                  provided by independent financial institutions, payment processors, and
                  cryptocurrency exchanges.
                </p>
                <h4 className='mb-2 text-base font-semibold text-gray-900 dark:text-white'>
                  Purchasing Cryptocurrencies:
                </h4>
                <ul className='list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Transactions are processed through third-party providers, not SSP Wallet</li>
                  <li>Payment methods, fees, and exchange rates vary depending on the provider</li>
                  <li>
                    Users must complete identity verification (KYC) as required by third-party
                    providers
                  </li>
                  <li>
                    SSP Wallet does not guarantee the availability, speed, or security of these
                    services
                  </li>
                </ul>
                <h4 className='mt-4 mb-2 text-base font-semibold text-gray-900 dark:text-white'>
                  Selling Cryptocurrencies:
                </h4>
                <ul className='list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Cryptocurrency sales are processed through third-party offramp providers</li>
                  <li>Settlement times and payout methods depend on the service provider</li>
                  <li>
                    <strong>Floating rates may apply,</strong> meaning the final amount received may
                    differ from the quoted price
                  </li>
                  <li>
                    Fees may apply and vary based on market conditions and third-party policies
                  </li>
                </ul>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  6.5 Transaction Accuracy and Blockchain Data
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  The transaction history and balance displayed in SSP Wallet may not always reflect
                  real-time blockchain data due to:
                </p>
                <ul className='list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Blockchain confirmation delays</li>
                  <li>API errors from third-party providers</li>
                  <li>Market fluctuations affecting exchange rates</li>
                  <li>Network congestion or RPC provider issues</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Users should verify important transactions using blockchain explorers or other
                  trusted sources.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  7. No Liability for Trading and Transaction Discrepancies
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet is not responsible for any losses, discrepancies, or issues related to
                  cryptocurrency transactions, including but not limited to:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>
                      Loss of funds due to bugs, technical errors, or issues with third-party
                      services
                    </strong>
                  </li>
                  <li>
                    <strong>Inaccuracies in displayed balances or transaction statuses</strong>{' '}
                    caused by network congestion, API errors, or service delays
                  </li>
                  <li>
                    <strong>Discrepancies between quoted and actual exchange rates</strong> due to
                    floating-rate fluctuations in swap and trading services
                  </li>
                  <li>
                    <strong>
                      Loss of funds due to incorrect addresses or unauthorized transactions
                    </strong>
                  </li>
                  <li>
                    <strong>Slippage in cryptocurrency swaps</strong> resulting in different amounts
                    than initially displayed
                  </li>
                  <li>
                    <strong>Failed transactions or delayed confirmations</strong> due to blockchain
                    network issues
                  </li>
                  <li>
                    <strong>Price movements during transaction processing</strong> that affect final
                    amounts received
                  </li>
                </ul>
                <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20'>
                  <p className='text-red-800 dark:text-red-200'>
                    <strong>Critical Warning:</strong> Users must double-check all transaction
                    details before confirming any transaction. Once a cryptocurrency transaction is
                    broadcast to the blockchain, it is <strong>irreversible</strong> and cannot be
                    undone under any circumstances.
                  </p>
                </div>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  8. Third-Party Service Support and Responsibility
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet integrates with numerous third-party services to provide enhanced
                  functionality. However, we explicitly disclaim responsibility for these services:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>No technical support:</strong> SSP Wallet does not provide technical
                    support for third-party services
                  </li>
                  <li>
                    <strong>Direct contact required:</strong> If you encounter issues with
                    integrated services, you must contact the respective service provider for
                    assistance
                  </li>
                  <li>
                    <strong>No dispute resolution:</strong> We are not responsible for
                    troubleshooting or dispute resolution with third-party providers
                  </li>
                  <li>
                    <strong>Service availability:</strong> Third-party services may become
                    unavailable, discontinued, or change their terms without notice
                  </li>
                  <li>
                    <strong>Data handling:</strong> Third-party services may collect data in
                    accordance with their own privacy policies
                  </li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You are responsible for reviewing the privacy terms and conditions of any
                  third-party service you use through SSP Wallet.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  9. Cryptocurrency and Technology Risk Disclosures
                </h2>

                <div className='mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/20'>
                  <h3 className='mb-2 text-lg font-semibold text-red-900 dark:text-red-100'>
                    Important Risk Warning
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
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  10. Security Best Practices and User Obligations
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  To protect your digital assets and maintain account security, we strongly
                  recommend following these security best practices:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Securely store your seed phrases offline</strong> in multiple safe
                    locations, never on internet-connected devices
                  </li>
                  <li>
                    <strong>Be cautious of phishing attempts and scams</strong> - always verify URLs
                    and never enter your seed phrase on suspicious websites
                  </li>
                  <li>
                    <strong>Keep your wallet software updated</strong> to the latest version to
                    benefit from security improvements
                  </li>
                  <li>
                    <strong>Use strong, unique passwords</strong> for wallet encryption and avoid
                    reusing passwords from other services
                  </li>
                  <li>
                    <strong>Verify transaction details carefully</strong> before confirming any
                    cryptocurrency transaction
                  </li>
                  <li>
                    <strong>Be aware of social engineering attacks</strong> - we will never ask for
                    your seed phrase or private keys
                  </li>
                </ul>
                <div className='mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-900/20'>
                  <p className='text-amber-800 dark:text-amber-200'>
                    <strong>Important:</strong> SSP Wallet is not responsible for losses resulting
                    from compromised seed phrases, phishing attacks, user negligence, or failure to
                    follow security best practices.
                  </p>
                </div>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  11. Legal Compliance and Tax Obligations
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  11.1 Compliance with Local Laws
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Users are entirely responsible for ensuring that their use of SSP Wallet complies
                  with all applicable laws and regulations in their jurisdiction. This includes but
                  is not limited to:
                </p>
                <ul className='list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Cryptocurrency trading and holding regulations</li>
                  <li>Anti-money laundering (AML) requirements</li>
                  <li>Know Your Customer (KYC) obligations</li>
                  <li>Financial services regulations</li>
                  <li>Import/export restrictions on cryptographic software</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We do not guarantee that our services are legal or available in all locations.
                  Users in restricted jurisdictions use the Services at their own risk.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  11.2 Tax and Reporting Obligations
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You are solely responsible for determining and fulfilling any tax obligations
                  arising from cryptocurrency transactions. This includes:
                </p>
                <ul className='list-disc space-y-1 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>Calculating and reporting capital gains or losses</li>
                  <li>Maintaining accurate records of all transactions</li>
                  <li>Filing required tax returns and forms</li>
                  <li>Paying any taxes owed on cryptocurrency activities</li>
                </ul>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  <strong>Important:</strong> SSP Wallet does not provide tax, legal, financial, or
                  investment advice. We do not provide market predictions, financial planning
                  services, or investment recommendations. Consult with qualified professionals
                  regarding your specific obligations.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  12. Enhanced Warranties Disclaimer
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  SSP Wallet and all associated services are provided "as-is" and "as-available"
                  without warranties of any kind, express, implied, or statutory. We specifically
                  disclaim and do not guarantee:
                </p>
                <ul className='list-disc space-y-2 pl-6 text-gray-600 dark:text-gray-400'>
                  <li>
                    <strong>Accuracy or completeness</strong> of displayed balances, transaction
                    history, or market data
                  </li>
                  <li>
                    <strong>Security or uninterrupted operation</strong> of our platform or
                    third-party services
                  </li>
                  <li>
                    <strong>Compatibility</strong> with all devices, browsers, or operating systems
                  </li>
                  <li>
                    <strong>Availability of third-party services</strong> including swaps, onramps,
                    or dApp integrations
                  </li>
                  <li>
                    <strong>Real-time accuracy</strong> of exchange rates, gas fees, or transaction
                    estimates
                  </li>
                  <li>
                    <strong>Successful completion</strong> of any cryptocurrency transaction
                  </li>
                  <li>
                    <strong>Protection against</strong> market volatility, slippage, or price
                    movements
                  </li>
                </ul>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  13. Limitation of Liability and Disclaimers
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  13.1 Complete Disclaimer of Warranties and Liability
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
                  KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING MERCHANTABILITY, FITNESS
                  FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, UNINTERRUPTED OPERATION, SECURITY,
                  ACCURACY, OR PROTECTION AGAINST LOSS OF CRYPTOCURRENCY OR DIGITAL ASSETS.
                </p>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  WE EXPRESSLY DISCLAIM ALL LIABILITY AND RESPONSIBILITY FOR ANY DAMAGES, LOSSES, OR
                  HARM ARISING FROM YOUR USE OF THE SERVICES.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  13.2 Complete Exclusion of Liability
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
                  13.3 No Liability Under Any Circumstances
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
                  14. Indemnification
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
                  15. Privacy and Data Protection
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
                  16. Dispute Resolution
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  16.1 Governing Law
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  These Terms shall be governed by and construed in accordance with the laws of
                  England and Wales, without regard to conflict of law principles.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  16.2 Jurisdiction
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Any disputes arising from these Terms or your use of the Services shall be subject
                  to the exclusive jurisdiction of the courts of England and Wales.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  16.3 Alternative Dispute Resolution
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  Before initiating formal legal proceedings, parties agree to attempt resolution
                  through good faith negotiations for a period of 30 days.
                </p>
              </section>

              <section className='mb-8'>
                <h2 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                  17. Service Modifications and Termination
                </h2>

                <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  17.1 Right to Modify
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  We reserve the right to modify, suspend, or discontinue any part of the Services
                  at any time, with or without notice. However, as open source software, you may
                  continue using existing versions.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  17.2 User Termination
                </h3>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  You may stop using the Services at any time by uninstalling the applications and
                  ceasing to access our websites. Your locally stored wallet data will remain under
                  your control.
                </p>

                <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                  17.3 Effect of Termination
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
                  18. Age Restrictions and Capacity
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
                  19. Updates to Terms
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
                  20. Severability and Entire Agreement
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
                  21. Contact Information
                </h2>
                <p className='mb-4 text-gray-600 dark:text-gray-400'>
                  For questions about these Terms of Service, please contact:
                </p>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
                  <p className='text-gray-600 dark:text-gray-400'>
                    <strong>InFlux Technologies Limited</strong>
                    <br />
                    Email: info@sspwallet.io
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
                  Summary of Key Points
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
                    <strong>No Liability:</strong> We accept no liability for any losses, damages,
                    or trading discrepancies
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
