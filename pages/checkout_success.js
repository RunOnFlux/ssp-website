import { CheckCircle } from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

export default function CheckoutSuccess() {
  return (
    <>
      <Head>
        <title>Checkout Successful | SSP Wallet</title>
        <meta name='description' content='Your order has been placed successfully.' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <div className='flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
          <CheckCircle className='h-10 w-10 text-green-600 dark:text-green-400' />
        </div>
        <h1 className='mt-6 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white'>
          Checkout Successful!
        </h1>
        <p className='mt-4 max-w-md text-lg text-gray-600 dark:text-gray-400'>
          Your order has been placed successfully. Thank you for your purchase!
        </p>
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-500'>
          You will receive a confirmation email shortly.
        </p>
        <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
          <Link href='/' className='btn btn-primary'>
            Back to Home
          </Link>
          <Link
            href='/support'
            className='btn border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          >
            Contact Support
          </Link>
        </div>
      </div>
    </>
  )
}
