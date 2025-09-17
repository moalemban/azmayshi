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
    ],
  },
  experimental: {
    allowedDevOrigins: ['*'],
  },
  webpack: (config, { isServer }) => {
    // These modules are server-side only, so we don't want to bundle them for the client
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'sharp': false,
            'chrome-aws-lambda': false,
            'puppeteer-core': false,
        };
    }
     config.externals.push('sharp');
     config.externals.push('chrome-aws-lambda');
     config.externals.push('puppeteer-core');

    return config;
  },
};

export default nextConfig;
