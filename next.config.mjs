/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.idpay.ir',
                port: '',
                pathname: '/banks/**',
            },
            {
                protocol: 'https',
                hostname: 'uploadkon.ir',
                port: '',
                pathname: '/uploads/**',
            }
        ],
    },
    webpack: (config, { isServer }) => {
        config.module.rules.push({
            test: /\.map$/,
            use: 'ignore-loader',
        });
        return config;
    },
};

export default nextConfig;
