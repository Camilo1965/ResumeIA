/** @type {import('next').NextConfig} */
const nextConfiguration = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
}

export default nextConfiguration
