import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 - Page Not Found | SSP Wallet',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className='flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-6xl font-bold text-gray-900 md:text-8xl dark:text-white'>404</h1>
      <div className='bg-primary-500 mt-4 h-1 w-16' />
      <h2 className='mt-6 text-xl font-medium text-gray-700 md:text-2xl dark:text-gray-300'>
        Page Not Found
      </h2>
      <p className='mt-4 max-w-md text-gray-600 dark:text-gray-400'>
        The page you are looking for doesn&apos;t exist.
      </p>
      <Link href='/en' className='btn btn-primary mt-8'>
        Back to Home
      </Link>
    </div>
  )
}
