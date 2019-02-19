import types from '../utils/types.js'

const createRouter = (routerConfig) => {
  let res = []
  let base = createRoute(routerConfig.base, '')
  base.path = '/'
  res.push(base)
  for (let route of routerConfig.routes) {
    res.push(createRoute(route, ''))
  }
  return res
}

const createRoute = (item, root) => {
  root += '-'
  let res = {}
  let key = ''
  if (types.isString(item)) {
    key = root + item
  } else {
    key = root + item.key
    res.children = item.children.map(child => createRoute(child, root + item.key))
  }
  res.path = getPath(key).toLowerCase()
  res.name = getName(key)
  res.component = () => import('@/views' + getPath(key))
  return res
}

const getPath = (key) => {
  return key.replace(/\-/g, '/')
}
const getName = (key) => {
  return key.replace(/\-/g, '').replace(/\-(\w)/g, $2 => $2.toUpperCase())
}

export default createRouter
