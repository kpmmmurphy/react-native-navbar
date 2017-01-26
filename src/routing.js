import isString from 'lodash.isstring'
import Url from 'url'

export const getPathParts = (url) => {
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

  const parsedUrl = Url.parse(url, true)

  const patterns = Object.keys(routes)
  const pathParts = getPathParts(parsedUrl.pathname)
  let params = {}

  const pattern = patterns.find((p) => {
    const patternParts = getPathParts(p)
    if (patternParts.length !== pathParts.length) return false

    params = {}

    return patternParts.every((patternPart, i) => {
      if (patternPart[0] === ':') {
        params[patternPart.slice(1)] = pathParts[i]
        return true
      }
      return patternPart === pathParts[i]
    })
  })

  const location = {
    pathname: parsedUrl.pathname,
    search: parsedUrl.search,
    query: parsedUrl.query,
    hash: parsedUrl.hash
  }

  return pattern
    ? { pattern, url, location, from, params, component: routes[pattern] }
    : null
}
