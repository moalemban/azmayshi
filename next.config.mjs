import withPWA from '@ducanh2912/next-pwa';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'https',
        hostname: 'static.idpay.ir',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tgju.org',
      },
    ],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

export default pwaConfig(nextConfig);
