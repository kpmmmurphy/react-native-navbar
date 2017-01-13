import isString from 'lodash.isstring'

export const getUrlParts = (url) => {
  url = isString(url) ? url : url.url
  return url[0] === '/' ? url.split('/').slice(1) : url.split('/')
}

export const isSameUrl = (a, b) => {
  return (isString(a) ? a : a.url) === (isString(b) ? b : b.url)
}

export const findRoute = (url, routes) => {
  let from = 'right'

  if (!isString(url)) {
    from = url.from || 'right'
    url = url.url
  }

  const patterns = Object.keys(routes)
  const urlParts = getUrlParts(url)
  let params = {}

  const pattern = patterns.find((p) => {
    const patternParts = getUrlParts(p)
    if (patternParts.length !== urlParts.length) return false

    params = {}

    return patternParts.every((patternPart, i) => {
      if (patternPart[0] === ':') {
        params[patternPart.slice(1)] = urlParts[i]
        return true
      }
      return patternPart === urlParts[i]
    })
  })

  return pattern ? { pattern, url, from, params, component: routes[pattern] } : null
}
