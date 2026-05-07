import { XCircle } from 'lucide-react'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { createMetadata } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'CheckoutFailure' })
  return createMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    path: '/checkout_failure',
    noindex: true,
  })
}

export default async function CheckoutFailurePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'CheckoutFailure' })

  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      <div className='flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
        <XCircle className='h-10 w-10 text-red-600 dark:text-red-400' />
      </div>
      <h1 className='mt-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white'>
        {t('heading')}
      </h1>
      <p className='mt-4 max-w-md text-lg text-gray-600 dark:text-gray-400'>{t('description')}</p>
      <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
        <Link href='/download' className='btn btn-primary'>
          {t('tryAgain')}
        </Link>
        <Link
          href='/support'
          className='btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        >
          {t('contactSupport')}
        </Link>
      </div>
    </div>
  )
}
