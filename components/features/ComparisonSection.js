'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const comparisonData = [
  {
    feature: 'True 2-of-2 Multisig',
    ssp: true,
    selfCustody: false,
    custodial: false,
    hardware: false,
    exchange: false,
    description: 'BIP48 true multisignature with dual-device requirement',
  },
  {
    feature: 'Built-in Crypto Swap',
    ssp: true,
    selfCustody: true,
    custodial: true,
    hardware: 'Limited',
    exchange: true,
    description: 'Native DEX integration for seamless token swapping',
  },
  {
    feature: 'Buy/Sell Crypto',
    ssp: true,
    selfCustody: true,
    custodial: true,
    hardware: 'Limited',
    exchange: true,
    description: 'Fiat on-ramp/off-ramp with payment card support',
  },
  {
    feature: 'Self-Custody Control',
    ssp: true,
    selfCustody: true,
    custodial: false,
    hardware: true,
    exchange: false,
    description: 'You own and control your private keys',
  },
  {
    feature: 'Mobile 2FA Security',
    ssp: true,
    selfCustody: false,
    custodial: false,
    hardware: false,
    exchange: 'Some',
    description: 'Mobile app acts as secure second authentication factor',
  },
  {
    feature: 'DApp Integration',
    ssp: true,
    selfCustody: true,
    custodial: 'Limited',
    hardware: 'Limited',
    exchange: false,
    description: 'WalletConnect v2 and direct dApp browser support',
  },
  {
    feature: 'Multi-Chain Support (15+)',
    ssp: true,
    selfCustody: 'Limited',
    custodial: 'Limited',
    hardware: 'Limited',
    exchange: 'Limited',
    description: 'Bitcoin, Ethereum, Polygon, BSC, Avalanche, and more',
  },
  {
    feature: 'Zero Counterparty Risk',
    ssp: true,
    selfCustody: true,
    custodial: false,
    hardware: true,
    exchange: false,
    description: 'No risk of platform bankruptcy or seizure',
  },
  {
    feature: 'Open Source',
    ssp: true,
    selfCustody: 'Varies',
    custodial: false,
    hardware: 'Varies',
    exchange: false,
    description: 'Fully transparent and verifiable code',
  },
  {
    feature: 'Security Audited',
    ssp: true,
    selfCustody: 'Rare',
    custodial: 'Some',
    hardware: 'Some',
    exchange: 'Some',
    description: 'Professional security audit by leading firms',
  },
  {
    feature: 'Account Abstraction (ERC-4337)',
    ssp: true,
    selfCustody: false,
    custodial: false,
    hardware: false,
    exchange: false,
    description: 'Gasless transactions and smart contract wallets',
  },
  {
    feature: 'No Single Seed Phrase',
    ssp: true,
    selfCustody: false,
    custodial: 'N/A',
    hardware: false,
    exchange: 'N/A',
    description: 'Eliminates single seed phrase vulnerability - uses dual-device backup',
  },
  {
    feature: 'Ease of Use',
    ssp: true,
    selfCustody: 'Varies',
    custodial: true,
    hardware: false,
    exchange: true,
    description: 'Simple, intuitive interface for both beginners and experts',
  },
  {
    feature: 'Transaction Speed',
    ssp: true,
    selfCustody: true,
    custodial: true,
    hardware: false,
    exchange: true,
    description: 'Fast transaction signing and blockchain interaction',
  },
  {
    feature: 'Privacy Protection',
    ssp: true,
    selfCustody: true,
    custodial: false,
    hardware: true,
    exchange: false,
    description: 'No personal data collection or transaction tracking',
  },
]

export function ComparisonSection() {
  return (
    <section className='section-padding dark:bg-dark-900 bg-white'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            Why Choose <span className='gradient-text'>SSP Wallet</span>?
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            Compare SSP Wallet to other crypto storage methods and see the difference.
          </p>
        </div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='hidden lg:block'
        >
          <div className='dark:bg-dark-800 w-full overflow-x-auto rounded-2xl bg-white shadow-lg'>
            <div className='min-w-full overflow-hidden'>
              <table className='w-full'>
                <thead className='dark:bg-dark-700 bg-gray-50'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                      Feature
                    </th>
                    <th className='text-primary-600 dark:text-primary-400 px-6 py-4 text-center text-sm font-semibold'>
                      SSP Wallet
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      Self-Custody Wallets
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      Custodial Wallets
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      Hardware Wallets
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      Crypto Exchanges
                    </th>
                  </tr>
                </thead>
                <tbody className='dark:divide-dark-600 divide-y divide-gray-200'>
                  {comparisonData.map((row, index) => {
                    const renderCell = value => {
                      if (value === true)
                        return <Check className='mx-auto h-5 w-5 text-green-500' />
                      if (value === false) return <X className='mx-auto h-5 w-5 text-red-500' />
                      return (
                        <span className='text-xs font-medium text-amber-600 dark:text-amber-400'>
                          {value}
                        </span>
                      )
                    }

                    return (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className='dark:hover:bg-dark-700/50 hover:bg-gray-50'
                      >
                        <td className='px-6 py-4 text-sm font-medium text-gray-900 dark:text-white'>
                          {row.feature}
                        </td>
                        <td className='px-6 py-4 text-center'>{renderCell(row.ssp)}</td>
                        <td className='px-6 py-4 text-center'>{renderCell(row.selfCustody)}</td>
                        <td className='px-6 py-4 text-center'>{renderCell(row.custodial)}</td>
                        <td className='px-6 py-4 text-center'>{renderCell(row.hardware)}</td>
                        <td className='px-6 py-4 text-center'>{renderCell(row.exchange)}</td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <div className='space-y-6 lg:hidden'>
          {comparisonData.map((row, index) => {
            const renderMobileCell = (value, label) => {
              if (value === true)
                return (
                  <div className='flex items-center'>
                    <Check className='mr-2 h-4 w-4 text-green-500' />
                    <span className='text-sm'>{label}</span>
                  </div>
                )
              if (value === false)
                return (
                  <div className='flex items-center'>
                    <X className='mr-2 h-4 w-4 text-red-500' />
                    <span className='text-sm text-gray-500'>{label}</span>
                  </div>
                )
              return (
                <div className='flex items-center'>
                  <span className='mr-2 text-xs font-medium text-amber-600 dark:text-amber-400'>
                    {value}
                  </span>
                  <span className='text-sm'>{label}</span>
                </div>
              )
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className='dark:bg-dark-800 rounded-xl bg-white p-6 shadow-lg'
              >
                <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                  {row.feature}
                </h3>
                <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>{row.description}</p>
                <div className='space-y-3'>
                  {renderMobileCell(row.ssp, 'SSP Wallet')}
                  {renderMobileCell(row.selfCustody, 'Self-Custody Wallets')}
                  {renderMobileCell(row.custodial, 'Custodial Wallets')}
                  {renderMobileCell(row.hardware, 'Hardware Wallets')}
                  {renderMobileCell(row.exchange, 'Crypto Exchanges')}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
