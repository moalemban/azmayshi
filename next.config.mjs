/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

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
                hostname: 'cdn3d.iconscout.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'png.pngtree.com',
                port: '',
                pathname: '/**',
            },
             {
                protocol: 'https',
                hostname: 'ice.ir',
                port: '',
                pathname: '/**',
            },
        ],
    },
    experimental: {
        serverExternalPackages: [
            "puppeteer-core",
            "chrome-aws-lambda",
            'jsqr',
            'qr-code-styling',
        ],
    },
};

export default withPWA(nextConfig);
