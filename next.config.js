/** @type {import('next').NextConfig} */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: 'akamai',
    path: '/',
    domains: ['assets-1309519128.cos.ap-hongkong.myqcloud.com']
  },
  // images: {
  //   loader: 'akamai',
  //   path: '/',
  // },
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
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    config.module.rules.push({
      test: /\.ttf$/,
      use: [
        {
          loader: 'ttf-loader',
          options: {
            name: './font/[hash].[ext]',
          },
        },
      ]
    })

    return config
  },
}

module.exports = nextConfig
