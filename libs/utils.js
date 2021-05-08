import getConfig from 'next/config'

const {
  publicRuntimeConfig: { cdnPrefix, hash },
} = getConfig()

export const cdnify = (path) => {
  if (!path.startsWith('/')) {
    throw new Error('path must begin with /')
  }

  if (!hash) {
    return `${cdnPrefix}${path}`
  }

  return `${cdnPrefix}${path}?hash=${hash}`
}

export const truncate = (text, len = 300) => {
  return !text || text.length < len ? text : text.substring(0, len) + '...'
}
