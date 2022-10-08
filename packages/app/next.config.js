const nextConfig = {
  env: {
    NETWORK: process.env.NETWORK,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
};

/** @type {import('next').NextConfig} */
module.exports = nextConfig;
