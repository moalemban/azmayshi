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
    // These packages are required by the server-side screenshot flow,
    // but are not needed (and cause errors) in the client-side bundle.
    // This configuration tells Next.js to not bundle them for the client.
    config.externals = [...config.externals, 'sharp', 'chrome-aws-lambda', 'puppeteer-core'];
    return config;
  },
};

export default nextConfig;
