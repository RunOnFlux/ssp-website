import Head from 'next/head'
import Link from 'next/link'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | SSP Wallet</title>
        <meta name='description' content='The page you are looking for could not be found.' />
        <meta name='robots' content='noindex, nofollow' />
      </Head>

      <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
        <h1 className='text-6xl font-bold text-gray-900 md:text-8xl dark:text-white'>404</h1>
        <div className='bg-primary-500 mt-4 h-1 w-16' />
        <h2 className='mt-6 text-xl font-medium text-gray-700 md:text-2xl dark:text-gray-300'>
          Page Not Found
        </h2>
        <p className='mt-4 max-w-md text-gray-600 dark:text-gray-400'>
          The page you are looking for doesn&apos;t exist.
        </p>
        <Link href='/' className='btn btn-primary mt-8'>
          Back to Home
        </Link>
      </div>
    </>
  )
}
