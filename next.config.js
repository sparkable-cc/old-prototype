const withMDX = require('@next/mdx')({
  extension: /\.mdx$/,
})
const isDev = process.env.NODE_ENV !== 'production'
const buildId = process.env.SOURCE_VERSION || ''

console.log('next.config.js', { isDev, buildId })

module.exports = withMDX({
  pageExtensions: ['js', 'jsx', 'mdx', 'md'],
  poweredByHeader: false,
  generateBuildId: () => buildId,
  publicRuntimeConfig: {
    hash: buildId,
  },
})
