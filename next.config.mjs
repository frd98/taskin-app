/** @type {import('next').NextConfig} */
const nextConfig = {
    // This allows production builds to successfully complete even if
    // your project has ESLint or TypeScript errors.
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;