// This file is deprecated. Please use next.config.mjs instead.
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'png.pngtree.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'cdn3d.iconscout.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' ,
        hostname: 'ice.ir',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'creazilla-store.fra1.digitaloceanspaces.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp', 'chrome-aws-lambda', 'puppeteer-core']
  },
  allowedDevOrigins: ['*'],
};

export default nextConfig;

    