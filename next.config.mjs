/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@genkit-ai/googleai'],
  serverExternalPackages: ['sharp', 'puppeteer-core', 'chrome-aws-lambda'],
};

module.exports = withPWA(nextConfig);
