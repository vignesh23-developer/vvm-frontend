import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// @ts-expect-error - next-pwa doesn't have proper TypeScript types
import withPWAInit from 'next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  disable: false,
  buildExcludes: [/app-build-manifest\.json$/],
})

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/explore/:district',
        destination: '/exploreByDistricts?search=:district',
        permanent: true,
      },
      {
        source: '/en',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'compute-pressure=()',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/_next/static/media/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'vaazhgavalamudan-bizdev.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'vaazhga-valamudan-bizdev.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'vaazhga-valamudan-web-storage.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdnjs.cloudflare.com',
        pathname: '/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withPWA(withNextIntl(nextConfig))