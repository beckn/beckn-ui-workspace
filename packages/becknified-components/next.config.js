/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'fa'],
    defaultLocale: 'en',
    localeDetection: false
  },
  transpilePackages: ['@beckn-ui/molecules'],
  images: {
    domains: [
      'cdn.sanity.io',
      'bazaar.becknprotocol.io',
      'mandi.succinct.in',
      'market.becknprotocol.io',
      'retail-osm-stage.becknprotocol.io',
      'retail-osm-prod.becknprotocol.io'
    ]
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
