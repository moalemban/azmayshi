/** @type {import('next').NextConfig} */
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});


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
            }
        ],
    },
     webpack: (config) => {
        config.externals = [...config.externals, 'jsqr', 'fs'];
        return config;
    },
};

export default withPWA(nextConfig);