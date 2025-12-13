import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.c2.liara.space',
        port: '',
        pathname: '/aloolaptop/**/**',
      },
    ],
  },
}

export default nextConfig
