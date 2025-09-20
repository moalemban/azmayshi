import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadkon.ir',
      },
      {
        protocol: 'https',
        hostname: 'cdn3d.iconscout.com',
      },
       {
        protocol: 'https',
        hostname: 'ice.ir',
      },
       {
        protocol: 'https',
        hostname: 'png.pngtree.com',
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for "Module parse failed: Unexpected token" error with chrome-aws-lambda
    config.module.rules.push({
      test: /\.map$/,
      use: 'null-loader',
    });

    // Another way to potentially handle it if the above doesn't work is to exclude it.
    // This is generally not needed if null-loader is used.
    // config.externals.push('chrome-aws-lambda');

    return config;
  },
};

export default withPWA(nextConfig);
