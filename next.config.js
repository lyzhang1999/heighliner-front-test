/** @type {import('next').NextConfig} */
const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode:  false,
  images: {
    loader: 'akamai',
    path: '/',
  },
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src')
    return config
  },
}

module.exports = nextConfig
