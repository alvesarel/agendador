/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // For image uploads
    },
  },
}

module.exports = nextConfig