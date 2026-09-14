import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import { WebVitalsReporter } from '@/components/analytics/web-vitals-reporter'
import CookieConsent from '@/components/cookie-consent'
import { Footer } from '@/components/footer/footer'
import { Header } from '@/components/header/header'
import { ThemeProvider } from '@/components/theme-provider'
import { routing } from '@/i18n/routing'
import { createSoftwareApplicationJsonLd } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsroom',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#f59e0b',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://sspwallet.io'),
  title: {
    default: 'SSP Wallet — Secure, Simple, Powerful Crypto Wallet',
    template: '%s | SSP Wallet',
  },
  description:
    'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/ssp-logo-black.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    siteName: 'SSP Wallet',
    images: [{ url: '/og-image.png', width: 1200, height: 630, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@sspwallet_io',
    creator: '@sspwallet_io',
    images: ['/og-image.png'],
  },
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!routing.locales.includes(locale as never)) notFound()
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${montserrat.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <div className='flex min-h-screen flex-col overflow-x-hidden'>
              <Header />
              <main className='flex-1 overflow-x-hidden pt-16 md:pt-20'>{children}</main>
              <Footer />
            </div>
            <WebVitalsReporter />
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>

        {/* Flux AI documentation assistant (self-hosted, github.com/RunOnFlux/ownllm).
            Served by the assistant itself; its origin is the endpoint. */}
        <Script
          src='https://ownllmrouter.app.runonflux.io/widget.js'
          strategy='lazyOnload'
          data-title='Ask SSP AI'
          data-subject='SSP Wallet'
          data-launcher-label='Ask AI'
          data-accent='#fbbf24'
          data-logo='/Icon%20Logo%20White.svg'
          data-logo-light='/Icon%20Logo%20Black.svg'
          data-launcher-bg='#1f2937'
          data-suggestions='What is SSP Wallet and how does the 2-of-2 security work?|How do I restore my wallet?|Which chains does SSP support?|How do I set up SSP Key?'
        />
        <Script
          id='ssp-software-application-jsonld'
          type='application/ld+json'
          strategy='afterInteractive'
        >
          {JSON.stringify(createSoftwareApplicationJsonLd())}
        </Script>
      </body>
    </html>
  )
}
