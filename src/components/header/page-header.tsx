import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subTitle?: string
  description: string
  children?: ReactNode
}

export function PageHeader({ title, subTitle, description, children }: PageHeaderProps) {
  return (
    <section className='dark:from-dark-900 dark:to-dark-950 relative overflow-hidden rounded-b-[40px] bg-linear-to-b from-white to-gray-50 pb-12 md:rounded-b-[60px] md:pb-16 lg:rounded-b-[100px] lg:pb-24'>
      <div className='relative z-10 container mx-auto px-4 pt-12 text-center md:px-6 md:pt-16 lg:px-8 lg:pt-24'>
        <div className='mx-auto max-w-[800px] space-y-4 md:space-y-5 lg:space-y-6'>
          <h1 className='text-3xl leading-tight font-bold text-gray-900 md:text-5xl md:leading-tight lg:text-7xl lg:leading-[90px] dark:text-white'>
            {title}
            {subTitle ? (
              <>
                <br className='hidden md:block' />
                <span className='md:hidden'> </span>
                {subTitle}
              </>
            ) : null}
          </h1>
          <p className='mx-auto text-base leading-relaxed font-medium text-gray-600 md:text-lg md:leading-loose lg:text-xl lg:leading-[33px] dark:text-gray-200'>
            {description}
          </p>
          {children ? <div className='mt-6 md:mt-8 lg:mt-10'>{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
