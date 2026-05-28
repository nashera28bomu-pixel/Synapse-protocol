/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['groq-sdk'],
  },
  images: {
    domains: [],
  },
}

module.exports = nextConfig
