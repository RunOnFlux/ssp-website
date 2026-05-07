'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type CellToken = boolean | 'limited' | 'some' | 'varies' | 'rare' | 'na'

interface ComparisonRow {
  ssp: CellToken
  selfCustody: CellToken
  custodial: CellToken
  hardware: CellToken
  exchange: CellToken
}

const comparisonRows: ComparisonRow[] = [
  // 0: True 2-of-2 Multisig
  { ssp: true, selfCustody: false, custodial: false, hardware: false, exchange: false },
  // 1: Built-in Crypto Swap
  { ssp: true, selfCustody: true, custodial: true, hardware: 'limited', exchange: true },
  // 2: Buy/Sell Crypto
  { ssp: true, selfCustody: true, custodial: true, hardware: 'limited', exchange: true },
  // 3: Self-Custody Control
  { ssp: true, selfCustody: true, custodial: false, hardware: true, exchange: false },
  // 4: Mobile 2FA Security
  { ssp: true, selfCustody: false, custodial: false, hardware: false, exchange: 'some' },
  // 5: DApp Integration
  { ssp: true, selfCustody: true, custodial: 'limited', hardware: 'limited', exchange: false },
  // 6: Multi-Chain Support
  {
    ssp: true,
    selfCustody: 'limited',
    custodial: 'limited',
    hardware: 'limited',
    exchange: 'limited',
  },
  // 7: Zero Counterparty Risk
  { ssp: true, selfCustody: true, custodial: false, hardware: true, exchange: false },
  // 8: Open Source
  { ssp: true, selfCustody: 'varies', custodial: false, hardware: 'varies', exchange: false },
  // 9: Security Audited
  { ssp: true, selfCustody: 'rare', custodial: 'some', hardware: 'some', exchange: 'some' },
  // 10: Account Abstraction
  { ssp: true, selfCustody: false, custodial: false, hardware: false, exchange: false },
  // 11: No Single Seed Phrase
  { ssp: true, selfCustody: false, custodial: 'na', hardware: false, exchange: 'na' },
  // 12: Ease of Use
  { ssp: true, selfCustody: 'varies', custodial: true, hardware: false, exchange: true },
  // 13: Transaction Speed
  { ssp: true, selfCustody: true, custodial: true, hardware: false, exchange: true },
  // 14: Privacy Protection
  { ssp: true, selfCustody: true, custodial: false, hardware: true, exchange: false },
]

export function ComparisonSection() {
  const t = useTranslations('Features.comparison')
  const valueLabel = (value: CellToken): string =>
    typeof value === 'boolean' ? '' : t(`values.${value}`)

  return (
    <section className='section-padding dark:bg-dark-900 bg-white'>
      <div className='container-custom'>
        <div className='mb-16 text-center'>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            {t('titlePrefix')} <span className='gradient-text'>{t('titleHighlight')}</span>
            {t('titleSuffix')}
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300'>
            {t('description')}
          </p>
        </div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='hidden lg:block'
        >
          <div className='dark:bg-dark-800 w-full overflow-x-auto rounded-2xl bg-white shadow-lg'>
            <div className='min-w-full overflow-hidden'>
              <table className='w-full'>
                <thead className='dark:bg-dark-700 bg-gray-50'>
                  <tr>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('columns.feature')}
                    </th>
                    <th className='text-primary-600 dark:text-primary-400 px-6 py-4 text-center text-sm font-semibold'>
                      {t('columns.ssp')}
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('columns.selfCustody')}
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('columns.custodial')}
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('columns.hardware')}
                    </th>
                    <th className='px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white'>
                      {t('columns.exchange')}
                    </th>
                  </tr>
                </thead>
                <tbody className='dark:divide-dark-600 divide-y divide-gray-200'>
                  {comparisonRows.map((row, index) => {
                    const renderCell = (value: CellToken) => {
                      if (value === true)
                        return <Check className='mx-auto h-5 w-5 text-green-500' />
                      if (value === false) return <X className='mx-auto h-5 w-5 text-red-500' />
                      return (
                        <span className='text-xs font-medium text-amber-600 dark:text-amber-400'>
                          {valueLabel(value)}
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
                          {t(`rows.${index}.feature`)}
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
          {comparisonRows.map((row, index) => {
            const renderMobileCell = (value: CellToken, label: string) => {
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
                    {valueLabel(value)}
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
                  {t(`rows.${index}.feature`)}
                </h3>
                <p className='mb-4 text-sm text-gray-600 dark:text-gray-300'>
                  {t(`rows.${index}.description`)}
                </p>
                <div className='space-y-3'>
                  {renderMobileCell(row.ssp, t('columns.ssp'))}
                  {renderMobileCell(row.selfCustody, t('columns.selfCustody'))}
                  {renderMobileCell(row.custodial, t('columns.custodial'))}
                  {renderMobileCell(row.hardware, t('columns.hardware'))}
                  {renderMobileCell(row.exchange, t('columns.exchange'))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Cross-page CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className='mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row'
        >
          <Link href='/download' className='btn btn-primary'>
            {t('ctaDownload')}
            <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
          <Link href='/guide' className='btn btn-secondary'>
            {t('ctaGuide')}
          </Link>
          <Link href='/enterprise' className='btn btn-secondary'>
            {t('ctaEnterprise')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
