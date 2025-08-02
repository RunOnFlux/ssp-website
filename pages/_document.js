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
        <meta property='og:image' content='https://sspwallet.io/logo-light-mode.svg' />
        <meta property='og:image:width' content='596' />
        <meta property='og:image:height' content='224' />
        <meta property='og:image:type' content='image/svg+xml' />

        {/* Twitter Card meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@sspwallet_io' />
        <meta name='twitter:creator' content='@sspwallet_io' />
        <meta name='twitter:image' content='https://sspwallet.io/logo-light-mode.svg' />

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
              downloadUrl:
                'https://chromewebstore.google.com/detail/ssp-wallet/mgfbabcnedcejkfibpafadgkhmkifhbd',
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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
