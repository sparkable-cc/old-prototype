const isDev = process.env.NODE_ENV !== 'production'
const buildId = process.env.SOURCE_VERSION || ''

console.log('next.config.js', { isDev, buildId })

module.exports = {
  poweredByHeader: false,
  generateBuildId: () => buildId,
  publicRuntimeConfig: {
    hash: buildId,
  },
}
