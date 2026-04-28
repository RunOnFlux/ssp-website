import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'
import CookieConsent from '@/components/cookie-consent'
import { ThemeProvider } from '@/components/theme-provider'
import { routing } from '@/i18n/routing'

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

const SOFTWARE_APPLICATION_JSON_LD: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': ['SoftwareApplication', 'WebApplication'],
  name: 'SSP Wallet',
  alternateName: 'Secure Simple Powerful Wallet',
  description:
    'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.',
  applicationCategory: ['FinanceApplication', 'SecurityApplication', 'UtilitiesApplication'],
  operatingSystem: ['Chrome Extension', 'Browser Extension', 'iOS', 'Android'],
  url: 'https://sspwallet.io',
  downloadUrl: 'https://sspwallet.io/download',
  datePublished: '2023-01-01',
  author: {
    '@type': 'Organization',
    name: 'InFlux Technologies',
    url: 'https://runonflux.com',
  },
  creator: {
    '@type': 'Organization',
    name: 'InFlux Technologies',
    url: 'https://runonflux.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SSP Wallet',
    url: 'https://sspwallet.io',
    logo: {
      '@type': 'ImageObject',
      url: 'https://sspwallet.io/ssp-logo-black-512x512.png',
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://twitter.com/sspwallet_io',
      'https://github.com/RunOnFlux/ssp-wallet',
      'https://discord.gg/runonflux',
      'https://medium.com/@ssp_wallet',
      'https://www.youtube.com/@ZelLabs',
      'https://docs.sspwallet.io',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@sspwallet.io',
      url: 'https://sspwallet.io/support',
      availableLanguage: ['English'],
    },
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  featureList: [
    'True 2-of-2 BIP48 Multisignature',
    'Account Abstraction (ERC-4337)',
    'WalletConnect v2 Support',
    '15+ Blockchain Support',
    'Built-in Crypto Swap',
    'Fiat On/Off Ramp',
    'Mobile 2FA Security',
    'Open Source & Audited',
  ],
  screenshots: ['https://sspwallet.io/screenshot.png'],
  supportedCryptocurrencies: [
    'Bitcoin (BTC)',
    'Ethereum (ETH)',
    'Litecoin (LTC)',
    'Zcash (ZEC)',
    'Ravencoin (RVN)',
    'Dogecoin (DOGE)',
    'Bitcoin Cash (BCH)',
    'Flux (FLUX)',
    'Polygon (MATIC)',
    'Binance Smart Chain (BSC)',
    'Avalanche (AVAX)',
    'Base',
  ],
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
            {children}
            <CookieConsent />
          </ThemeProvider>
        </NextIntlClientProvider>

        <Script
          id='ssp-software-application-jsonld'
          type='application/ld+json'
          strategy='afterInteractive'
        >
          {JSON.stringify(SOFTWARE_APPLICATION_JSON_LD)}
        </Script>

        <Script
          async
          strategy='afterInteractive'
          src='https://widget.kapa.ai/kapa-widget.bundle.js'
          data-website-id='1d29b730-6686-4ae2-b724-41d41c754e7b'
          data-project-name='SSP'
          data-project-color='#f59e0b'
          data-user-analytics-fingerprint-enabled='true'
          data-search-mode-enabled='true'
          data-project-logo='https://raw.githubusercontent.com/RunOnFlux/ssp-wallet/refs/heads/master/public/ssp-logo-white.svg'
          data-modal-image='https://raw.githubusercontent.com/RunOnFlux/ssp-wallet/refs/heads/master/public/ssp-logo-black.svg'
          data-button-image-width='18'
          data-button-image-height='24'
          data-button-height='3.125rem'
          data-button-width='2.8125rem'
          data-button-text-font-size='0.7rem'
          data-modal-image-width='36'
          data-modal-image-height='48'
          data-modal-disclaimer='This is a custom LLM for answering questions about SSP and other Flux products. The answers are based on the contents of Whitepapers, Documentation, Support articles, API references, website and knowledgebases. Give it a try!'
          data-button-hide='false'
          data-modal-override-open-id='kapa-button'
          data-mcp-enabled='true'
          data-mcp-server-url='https://flux.mcp.kapa.ai'
        />
      </body>
    </html>
  )
}
