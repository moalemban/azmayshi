
import createNextPwa from '@ducanh2912/next-pwa';

const withPWA = createNextPwa({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'uploadkon.ir' },
      { protocol: 'https', hostname: 'cdn3d.iconscout.com' },
      { protocol: 'https', hostname: 'png.pngtree.com' },
      { protocol: 'https', hostname: 'ice.ir' },
    ],
  },
  webpack: (config, { isServer }) => {
    // Ignore .map files
    config.module.rules.push({
      test: /\.map$/,
      use: 'ignore-loader',
    });

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

export default withPWA(nextConfig);
