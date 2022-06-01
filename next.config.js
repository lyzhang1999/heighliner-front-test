/** @type {import('next').NextConfig} */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    loader: 'akamai',
    path: '/',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    styledComponents: true
  },
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config
  },
}

module.exports = nextConfig
