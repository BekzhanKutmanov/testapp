/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    return config;
  },
}

export default nextConfig
