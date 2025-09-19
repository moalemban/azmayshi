/** @type {import('next').NextConfig} */
import withPWA from '@ducanh2912/next-pwa';

const pwa = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
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

export default pwa(nextConfig);
