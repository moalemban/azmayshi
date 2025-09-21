/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
        port: '',
        pathname: '/uploads/**',
      },
       {
        protocol: 'https',
        hostname: 'static.idpay.ir',
        port: '',
        pathname: '/banks/**',
      },
    ],
  },
};

export default nextConfig;
