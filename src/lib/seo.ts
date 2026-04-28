import type { Metadata } from 'next'

export const siteUrl = 'https://sspwallet.io'
export const siteName = 'SSP Wallet'
export const siteDescription =
  'True 2-of-2 BIP48 multisignature crypto wallet with Account Abstraction (ERC-4337), supporting 15+ blockchains including Bitcoin and Ethereum.'
export const twitterHandle = '@sspwallet_io'
export const defaultOgImage = `${siteUrl}/og-image.png`

interface OgImage {
  url: string
  width: number
  height: number
  alt: string
}

interface ArticleMeta {
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

interface CreateMetadataInput {
  title: string
  description: string
  path: string
  ogImage?: OgImage
  type?: 'website' | 'article'
  articleMeta?: ArticleMeta
  noindex?: boolean
  canonical?: string
}

function absoluteUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${siteUrl}${url.startsWith('/') ? url : `/${url}`}`
}

export function createMetadata(input: CreateMetadataInput): Metadata {
  const canonical = input.canonical ?? absoluteUrl(input.path)
  const og = input.ogImage ?? {
    url: defaultOgImage,
    width: 1200,
    height: 630,
    alt: siteName,
  }
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: input.type ?? 'website',
      url: canonical,
      siteName,
      title: input.title,
      description: input.description,
      images: [{ url: absoluteUrl(og.url), width: og.width, height: og.height, alt: og.alt }],
      ...(input.type === 'article' && input.articleMeta
        ? {
            publishedTime: input.articleMeta.publishedTime,
            modifiedTime: input.articleMeta.modifiedTime,
            authors: input.articleMeta.author ? [input.articleMeta.author] : undefined,
            tags: input.articleMeta.tags,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title: input.title,
      description: input.description,
      images: [absoluteUrl(og.url)],
    },
  }
}

interface BlogPostingInput {
  title: string
  description: string
  url: string
  imageUrl: string
  authorName: string
  publishDate: string
  modifiedDate?: string
}

export function createBlogPostingJsonLd(input: BlogPostingInput): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.url) },
    headline: input.title,
    description: input.description,
    image: absoluteUrl(input.imageUrl),
    datePublished: input.publishDate,
    dateModified: input.modifiedDate ?? input.publishDate,
    author: { '@type': 'Person', name: input.authorName },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/ssp-logo-black-512x512.png` },
    },
  }
}

export function createBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  }
}

export function createCollectionPageJsonLd(
  items: Array<{ title: string; url: string; date: string }>
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    hasPart: items.map(item => ({
      '@type': 'BlogPosting',
      headline: item.title,
      url: absoluteUrl(item.url),
      datePublished: item.date,
    })),
  }
}

export function createSoftwareApplicationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': ['SoftwareApplication', 'WebApplication'],
    name: siteName,
    alternateName: 'Secure Simple Powerful Wallet',
    description: siteDescription,
    applicationCategory: ['FinanceApplication', 'SecurityApplication', 'UtilitiesApplication'],
    operatingSystem: ['Chrome Extension', 'Browser Extension', 'iOS', 'Android'],
    url: siteUrl,
    downloadUrl: `${siteUrl}/download`,
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
      name: siteName,
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/ssp-logo-black-512x512.png`,
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
        url: `${siteUrl}/support`,
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
    screenshots: [`${siteUrl}/screenshot.png`],
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
}
