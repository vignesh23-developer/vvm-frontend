import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vaazhgavalamudan-bizdev.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        pathname: '**',
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
    ],
  },
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
