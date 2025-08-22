import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        {/* Meta tags for SEO */}
        <meta charSet='utf-8' />
        <meta name='robots' content='index, follow' />
        <meta name='googlebot' content='index, follow' />

        {/* Preconnect to external domains for performance */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />

        {/* Favicon and app icons */}
        <link rel='icon' href='/Icon Logo Black.svg' type='image/svg+xml' />
        <link rel='apple-touch-icon' sizes='180x180' href='/Icon Logo Black.svg' />
        <link rel='icon' type='image/png' sizes='32x32' href='/Icon Logo Black.svg' />
        <link rel='icon' type='image/png' sizes='16x16' href='/Icon Logo Black.svg' />
        <link rel='shortcut icon' href='/Icon Logo Black.svg' />

        {/* Theme color for mobile browsers */}
        <meta name='theme-color' content='#f59e0b' />
        <meta name='msapplication-TileColor' content='#f59e0b' />

        {/* Open Graph meta tags */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='SSP Wallet' />
        {/* <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' /> */}

        {/* Twitter Card meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@sspwallet_io' />
        <meta name='twitter:creator' content='@sspwallet_io' />
        {/* <meta name='twitter:image' content='https://sspwallet.io/og-image.png' /> */}

        {/* Enhanced Structured data for search engines */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['SoftwareApplication', 'WebApplication'],
              name: 'SSP Wallet',
              alternateName: 'Secure Simple Powerful Wallet',
              description:
                'Revolutionary BIP48 true 2-of-2 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin, Ethereum, and more.',
              applicationCategory: [
                'FinanceApplication',
                'SecurityApplication',
                'UtilitiesApplication',
              ],
              operatingSystem: ['Chrome Extension', 'Browser Extension', 'iOS', 'Android'],
              url: 'https://sspwallet.io',
              downloadUrl: 'https://sspwallet.io/download',
              softwareVersion: '2.0.0',
              datePublished: '2023-01-01',
              dateModified: new Date().toISOString().split('T')[0],
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
                  url: 'https://sspwallet.io/logo.svg',
                },
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1000',
                bestRating: '5',
                worstRating: '1',
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
            }),
          }}
        />
        <script
          async
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
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
