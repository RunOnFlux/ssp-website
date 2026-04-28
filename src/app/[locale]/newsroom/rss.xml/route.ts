import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/cms'
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
  const posts = await getAllPosts()
  const items = posts
    .map(
      p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/newsroom/${p.slug}</link>
      <guid>${siteUrl}/newsroom/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} Newsroom</title>
    <link>${siteUrl}/newsroom</link>
    <description>Latest news, product updates, and announcements from SSP.</description>
    <language>en-US</language>
    <atom:link href="${siteUrl}/newsroom/rss.xml" rel="self" type="application/rss+xml" />
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
