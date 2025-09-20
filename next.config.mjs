/** @type {import('next').NextConfig} */
import nextPwa from "@ducanh2912/next-pwa";

const withPWA = nextPwa({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  serverExternalPackages: ["chrome-aws-lambda"],
  typescript: {
    ignoreBuildErrors: true,
  },
   experimental: {
    serverActions: {
      bodySizeLimit: '4.5mb',
    },
  },
};

export default withPWA(nextConfig);
