/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@beckn-ui/**'],
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'en',
    localeDetection: false
  },
  images: {
    domains: ['cdn.sanity.io', 'bazaar.becknprotocol.io', 'mandi.succinct.in', 'market.becknprotocol.io']
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
