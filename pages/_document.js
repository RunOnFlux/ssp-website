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
        <link rel='icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/logo.svg' />
        <link rel='icon' type='image/png' sizes='32x32' href='/logo.svg' />
        <link rel='icon' type='image/png' sizes='16x16' href='/logo.svg' />

        {/* Theme color for mobile browsers */}
        <meta name='theme-color' content='#f59e0b' />
        <meta name='msapplication-TileColor' content='#f59e0b' />

        {/* Open Graph meta tags */}
        <meta property='og:type' content='website' />
        <meta property='og:site_name' content='SSP Wallet' />

        {/* Twitter Card meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:site' content='@sspwallet_io' />
        <meta name='twitter:creator' content='@sspwallet_io' />

        {/* Structured data for search engines */}
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'SSP Wallet',
              description: 'Secure, Simple, Powerful crypto wallet for multiple blockchains',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Chrome Extension',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '1000',
              },
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
