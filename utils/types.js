export default {
  isBoolean: (value) => {
    return typeof value === 'boolean'
  },
  isString: (value) => {
    return typeof value === 'string'
  },
  isArray: (value) => {
    return typeof value === 'object' && value instanceof Array
  },
  isObject: (value) => {
    return typeof value === 'object' && value instanceof Object
  }
}
