export const appName = 'Little Eleven\'s Life'
export const appDescription = 'Little Eleven\'s Life'

export const iconfontUrl = '//at.alicdn.com/t/c/font_178634_5lx1rpvocj2.js'

let _proxyBaseURL = 'https://worker.powerfulyang.com'

// eslint-disable-next-line node/prefer-global/process
if (process.env.API_ENV === 'local')
  _proxyBaseURL = 'http://localhost:8787'

export const proxyBaseURL = _proxyBaseURL
