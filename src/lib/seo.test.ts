import { describe, expect, it } from 'vitest'
import {
  createBlogPostingJsonLd,
  createBreadcrumbJsonLd,
  createCollectionPageJsonLd,
  createMetadata,
  createSoftwareApplicationJsonLd,
  siteName,
  siteUrl,
} from './seo'

describe('siteUrl', () => {
  it('is the production SSP URL', () => {
    expect(siteUrl).toBe('https://sspwallet.io')
  })
})

describe('siteName', () => {
  it('is "SSP Wallet"', () => {
    expect(siteName).toBe('SSP Wallet')
  })
})

describe('createMetadata', () => {
  it('builds a canonical URL from path', () => {
    const m = createMetadata({ title: 'X', description: 'Y', path: '/foo' })
    expect(m.alternates?.canonical).toBe('https://sspwallet.io/foo')
  })

  it('respects an override canonical', () => {
    const m = createMetadata({
      title: 'X',
      description: 'Y',
      path: '/foo',
      canonical: 'https://example.com/x',
    })
    expect(m.alternates?.canonical).toBe('https://example.com/x')
  })

  it('flips to noindex when noindex=true', () => {
    const m = createMetadata({ title: 'X', description: 'Y', path: '/foo', noindex: true })
    expect(m.robots).toEqual({ index: false, follow: true })
  })

  it('promotes a relative ogImage url to absolute', () => {
    const m = createMetadata({
      title: 'X',
      description: 'Y',
      path: '/foo',
      ogImage: { url: '/x.png', width: 1200, height: 630, alt: 'x' },
    })
    expect((m.openGraph?.images as Array<{ url: string }>)[0].url).toBe(
      'https://sspwallet.io/x.png'
    )
  })

  it('preserves an absolute ogImage url', () => {
    const m = createMetadata({
      title: 'X',
      description: 'Y',
      path: '/foo',
      ogImage: { url: 'https://cdn.example.com/x.png', width: 1200, height: 630, alt: 'x' },
    })
    expect((m.openGraph?.images as Array<{ url: string }>)[0].url).toBe(
      'https://cdn.example.com/x.png'
    )
  })

  it('emits article meta when type=article', () => {
    const m = createMetadata({
      title: 'X',
      description: 'Y',
      path: '/n/x',
      type: 'article',
      articleMeta: {
        publishedTime: '2025-01-01',
        modifiedTime: '2025-02-01',
        author: 'SSP Team',
        tags: ['multisig'],
      },
    })
    expect((m.openGraph as { type: string }).type).toBe('article')
  })
})

describe('createSoftwareApplicationJsonLd', () => {
  it('returns SoftwareApplication + WebApplication schema', () => {
    const j = createSoftwareApplicationJsonLd()
    expect((j as { '@type': string[] })['@type']).toEqual(['SoftwareApplication', 'WebApplication'])
    expect((j as { name: string }).name).toBe('SSP Wallet')
  })

  it('includes the full feature list with at least 8 features', () => {
    const j = createSoftwareApplicationJsonLd() as { featureList: string[] }
    expect(j.featureList.length).toBeGreaterThanOrEqual(8)
    expect(j.featureList).toContain('True 2-of-2 BIP48 Multisignature')
  })

  it('lists 12 supported cryptocurrencies', () => {
    const j = createSoftwareApplicationJsonLd() as { supportedCryptocurrencies: string[] }
    expect(j.supportedCryptocurrencies).toHaveLength(12)
  })

  it('publisher.sameAs has every public profile URL', () => {
    const j = createSoftwareApplicationJsonLd() as {
      publisher: { sameAs: string[] }
    }
    expect(j.publisher.sameAs).toContain('https://twitter.com/sspwallet_io')
    expect(j.publisher.sameAs).toContain('https://github.com/RunOnFlux/ssp-wallet')
    expect(j.publisher.sameAs).toContain('https://discord.gg/runonflux')
  })
})

describe('createBlogPostingJsonLd', () => {
  it('builds BlogPosting JSON-LD', () => {
    const j = createBlogPostingJsonLd({
      title: 'X',
      description: 'Y',
      url: '/newsroom/x',
      imageUrl: '/img.png',
      authorName: 'SSP Team',
      publishDate: '2025-01-01',
    })
    expect((j as { '@type': string })['@type']).toBe('BlogPosting')
    expect((j as { headline: string }).headline).toBe('X')
  })

  it('uses publishDate as dateModified when modifiedDate is omitted', () => {
    const j = createBlogPostingJsonLd({
      title: 'X',
      description: 'Y',
      url: '/n/x',
      imageUrl: '/img.png',
      authorName: 'SSP',
      publishDate: '2025-01-01',
    }) as { dateModified: string }
    expect(j.dateModified).toBe('2025-01-01')
  })

  it('absolute-resolves a relative imageUrl', () => {
    const j = createBlogPostingJsonLd({
      title: 'X',
      description: 'Y',
      url: '/n/x',
      imageUrl: '/img.png',
      authorName: 'SSP',
      publishDate: '2025-01-01',
    }) as { image: string }
    expect(j.image).toBe('https://sspwallet.io/img.png')
  })
})

describe('createBreadcrumbJsonLd', () => {
  it('builds BreadcrumbList from items with positions', () => {
    const j = createBreadcrumbJsonLd([{ name: 'Home', url: '/' }, { name: 'Newsroom' }]) as {
      itemListElement: Array<{ position: number; name: string; item?: string }>
    }
    expect(j.itemListElement[0].position).toBe(1)
    expect(j.itemListElement[1].name).toBe('Newsroom')
  })

  it('omits item field when url is missing (terminal breadcrumb)', () => {
    const j = createBreadcrumbJsonLd([{ name: 'A', url: '/a' }, { name: 'B' }]) as {
      itemListElement: Array<{ name: string; item?: string }>
    }
    expect(j.itemListElement[1].item).toBeUndefined()
  })
})

describe('createCollectionPageJsonLd', () => {
  it('builds CollectionPage with hasPart entries', () => {
    const j = createCollectionPageJsonLd([
      { title: 'A', url: '/a', date: '2025-01-01' },
      { title: 'B', url: '/b', date: '2025-02-01' },
    ]) as { '@type': string; hasPart: Array<{ headline: string }> }
    expect(j['@type']).toBe('CollectionPage')
    expect(j.hasPart).toHaveLength(2)
    expect(j.hasPart[0].headline).toBe('A')
  })
})
