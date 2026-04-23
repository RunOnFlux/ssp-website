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
        <link rel='icon' href='/favicon.ico' sizes='any' />
        <link rel='icon' type='image/svg+xml' href='/ssp-logo-black.svg' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />

        {/* Theme color for mobile browsers */}
        <meta name='theme-color' content='#f59e0b' />
        <meta name='msapplication-TileColor' content='#f59e0b' />

        {/* Open Graph defaults (pages override) */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='SSP Wallet' />
        <meta property='og:image' content='https://sspwallet.io/og-image.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:image:type' content='image/png' />

        {/* Twitter Card defaults (pages override) */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@sspwallet_io' />
        <meta name='twitter:creator' content='@sspwallet_io' />
        <meta name='twitter:image' content='https://sspwallet.io/og-image.png' />

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
                'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.',
              applicationCategory: [
                'FinanceApplication',
                'SecurityApplication',
                'UtilitiesApplication',
              ],
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
          data-mcp-enabled='true'
          data-mcp-server-url='https://flux.mcp.kapa.ai'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
