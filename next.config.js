/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forces Vercel to skip linting and type checks during the build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;