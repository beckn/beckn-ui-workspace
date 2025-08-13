/** @type {import('next').NextConfig} */
/* eslint-disable no-undef */

const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@beckn-ui/**'],
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: [
      'cdn.sanity.io',
      'bazaar.becknprotocol.io',
      'mandi.succinct.in',
      'market.becknprotocol.io',
      'retail-osm-stage.becknprotocol.io',
      'retail-osm-prod.becknprotocol.io'
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: function (config) {
    config.module.rules.push({
      test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: '[name].[ext]'
        }
      }
    })
    return config
  }
}

module.exports = nextConfig
