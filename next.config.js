/** @type {import('next').NextConfig} */
const path = require('path')
const nextBuildId = require('next-build-id')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // loader: 'akamai',
    // path: '',
    domains: ['assets-1309519128.cos.ap-hongkong.myqcloud.com']
  },
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    outputStandalone: true,
  },
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    config.module.rules.push({
      test: /\.(woff|woff2|ttf)$/,
      loader: 'url-loader'
    })

    return config
  },
  /**
   * By default, buildId will use the latest git commit hash 
   * from the local git repository (equivalent of git rev-parse HEAD).
   */
  generateBuildId: () => nextBuildId({ dir: __dirname })
}

module.exports = nextConfig
