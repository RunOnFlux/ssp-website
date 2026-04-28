import { NextResponse } from 'next/server'
import { siteUrl } from '@/lib/seo'

const ROBOTS = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${siteUrl}/sitemap.xml

# Specific bot instructions
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# AI crawlers — allowed
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

# Block irrelevant paths
Disallow: /api/
Disallow: /_next/
Disallow: /node_modules/

# Allow important files
Allow: /api/sitemap
Allow: /_next/static/
`

export function GET(): NextResponse {
  return new NextResponse(ROBOTS, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
