import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
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
    ]
  },
  images: {
    remotePatterns: [
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
        hostname: 'i.ytimg.com', // YouTube thumbnails
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com', // YouTube profile/channel images
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Unsplash images
        pathname: '**',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
