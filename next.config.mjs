/** @type {import('next').NextConfig} */
import withPWA from '@ducanh2912/next-pwa';

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // Your existing Next.js config...
};

export default pwaConfig(nextConfig);
