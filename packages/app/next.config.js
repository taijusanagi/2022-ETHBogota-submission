const nextConfig = {
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    externalDir: true,
  },
};

/** @type {import('next').NextConfig} */
module.exports = nextConfig;
