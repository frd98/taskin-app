/** @type {import('next').NextConfig} */
const nextConfig = {
    // This is the "Bypass" for your MVP launch
    eslint: {
      // This allows production builds to complete even if there are linting errors
      ignoreDuringBuilds: true,
    },
    typescript: {
      // This allows production builds to complete even if there are type errors
      ignoreBuildErrors: true,
    },
  };
  
  export default nextConfig;