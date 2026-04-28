import { NextResponse } from 'next/server'
import { getAcademyPosts } from '@/lib/cms'
import { siteName, siteUrl } from '@/lib/seo'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET(): Promise<NextResponse> {
  const posts = await getAcademyPosts({ limit: 100 })
  const items = posts
    .filter(p => p.category)
    .map(
      p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/academy/${p.category}/${p.slug}</link>
      <guid>${siteUrl}/academy/${p.category}/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} Academy</title>
    <link>${siteUrl}/academy</link>
    <description>Guides, tutorials, and deep dives on SSP, multisig, security, DeFi, and more.</description>
    <language>en-US</language>
    <atom:link href="${siteUrl}/academy/rss.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60',
    },
  })
}
