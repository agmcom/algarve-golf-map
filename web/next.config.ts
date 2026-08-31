import type { NextConfig } from 'next'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
  async redirects() {
    return [
      // The easyJet guide post was renamed after it had been indexed under the old slug.
      // 308 so search engines pass ranking to the current URL instead of hitting a 404.
      {
        source: '/guide/how-much-does-easyjet-charge-for-golf-clubs-to-the-algarve',
        destination: '/guide/golf-clubs-on-easyjet-rules-sizes-and-what-it-actually-costs',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
