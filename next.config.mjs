/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.tgju.org',
        port: '',
        pathname: '/images/crypto/icons/**',
      },
       {
        protocol: 'https',
        hostname: 'uploadkon.ir',
        port: '',
        pathname: '/uploads/**',
      }
    ],
  },
};

export default nextConfig;
