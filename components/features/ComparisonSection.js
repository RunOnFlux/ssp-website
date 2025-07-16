'use client'

import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'

const comparisonData = [
  {
    feature: 'Multi-Signature Security',
    ssp: true,
    traditional: false,
    hardware: true,
  },
  {
    feature: 'Mobile Integration',
    ssp: true,
    traditional: false,
    hardware: false,
  },
  {
    feature: 'DApp Integration',
    ssp: true,
    traditional: true,
    hardware: false,
  },
  {
    feature: 'Multi-Chain Support',
    ssp: true,
    traditional: false,
    hardware: false,
  },
  {
    feature: 'Zero Data Storage',
    ssp: true,
    traditional: false,
    hardware: true,
  },
  {
    feature: 'Open Source',
    ssp: true,
    traditional: false,
    hardware: false,
  },
]

export function ComparisonSection() {
  return (
    <section className='section-padding bg-white dark:bg-dark-900'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            Why Choose <span className='gradient-text'>SSP Wallet</span>?
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            See how SSP Wallet compares to traditional and hardware wallets.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='overflow-x-auto'
        >
          <div className='min-w-full overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-dark-800'>
            <table className='w-full'>
              <thead className='bg-gray-50 dark:bg-dark-700'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                    Feature
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-primary-600 dark:text-primary-400'>
                    SSP Wallet
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                    Traditional Wallets
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                    Hardware Wallets
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-dark-600'>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className='hover:bg-gray-50 dark:hover:bg-dark-700/50'
                  >
                    <td className='px-6 py-4 text-sm font-medium text-gray-900 dark:text-white'>
                      {row.feature}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {row.ssp ? (
                        <Check className='mx-auto h-5 w-5 text-green-500' />
                      ) : (
                        <X className='mx-auto h-5 w-5 text-red-500' />
                      )}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {row.traditional ? (
                        <Check className='mx-auto h-5 w-5 text-green-500' />
                      ) : (
                        <X className='mx-auto h-5 w-5 text-red-500' />
                      )}
                    </td>
                    <td className='px-6 py-4 text-center'>
                      {row.hardware ? (
                        <Check className='mx-auto h-5 w-5 text-green-500' />
                      ) : (
                        <X className='mx-auto h-5 w-5 text-red-500' />
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
