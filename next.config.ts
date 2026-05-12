import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// HSTS is terminated at the Vercel/CDN edge, so we don't set Strict-Transport-Security here.
// CSP is intentionally not set yet — wallet-site CSP needs an explicit allowlist for kapa.ai,
// Google Analytics, and Stripe checkout, which is a follow-up hardening task.

const PERMISSIONS_POLICY = [
  'accelerometer=()',
  'autoplay=()',
  'bluetooth=()',
  'camera=()',
  'display-capture=()',
  'fullscreen=(self)',
  'geolocation=()',
  'gyroscope=()',
  'hid=()',
  'magnetometer=()',
  'microphone=()',
  'payment=()',
  'serial=()',
  'usb=()',
  'interest-cohort=()',
].join(', ')

// Next 16 refuses to proxy /_next/image requests whose upstream resolves to
// a private IP (localhost, 127.0.0.1, RFC1918) for SSRF safety. When the CMS
// is local, skip the optimizer so images still render in dev.
const cmsIsLocal = /^(https?:\/\/)?(localhost|127\.0\.0\.1)/.test(process.env.SSP_CMS_URL ?? '')

// Allow /_next/image to optimize images served from whichever CMS host the
// site is pointed at. Falls back to localhost:3000 when SSP_CMS_URL is unset.
const cmsRemotePatterns = (() => {
  try {
    const u = new URL(process.env.SSP_CMS_URL ?? 'http://localhost:3000')
    return [
      {
        protocol: u.protocol.replace(':', '') as 'http' | 'https',
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: '/media/**',
      },
    ]
  } catch {
    return [
      { protocol: 'http' as const, hostname: 'localhost', port: '3000', pathname: '/media/**' },
    ]
  }
})()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: cmsIsLocal,
    remotePatterns: cmsRemotePatterns,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: { scrollRestoration: true },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: PERMISSIONS_POLICY },
        ],
      },
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
