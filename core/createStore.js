import types from '../utils/types'

// 生成store
const createStore = (storeConfig) => {
  // 如果是模块模式
  if (storeConfig.modules === true) {
    return createModules(storeConfig.content)
  } else {
    return createModule(storeConfig.content)
  }
}

// 生成模块组
const createModules = (content) => {
  let modules = {}
  for (let moduleName of Object.keys(content)) {
    let item = content[moduleName]
    modules[moduleName] = createModule(item)
  }
  return { modules }
}

// 生成单一模块
const createModule = (content) => {
  let state = {}
  let mutations = {}
  let actions = {}
  for (let key of Object.keys(content)) {
    let item = content[key]
    if (types.isObject(item) && item.state !== undefined) {
      item.key = item.key === undefined ? key : item.key
      state = {...state, ...createState(item)}
      mutations = {...mutations, ...createMutations(item)}
      actions = {...actions, ...createActions(item)}
    } else {
      state[key] = item
    }
  }
  return { state, mutations, actions }
}

// 生成状态
const createState = (item) => {
  if (item.state !== undefined) {
    return { [item.key]: item.state }
  }
  return {}
}

// 生成变化
const createMutations = (item) => {
  let res = {}
  if (item.mutations !== undefined && item.mutations !== false) {
    // 如果是布尔值
    let key = ''
    let func = (state, payload) => { state[key] = payload }
    if (types.isBoolean(item.mutations)) {
      key = 'set'
    }
    // 如果是字符串
    else if (types.isString(item.mutations)) {
      key = item.mutations
    }
    // 如果是对象
    else if (types.isObject(item.mutations)) {
      key = item.mutations.pre
      if (item.mutations.func !== undefined) {
        func = item.mutations.func
      }
    }
    key += '_' + item.key
    res = { [key]: func }
    // 如果是数组
    if (types.isArray(item.mutations)) {
      res = {}
      for (let itema in item.mutations) {
        itema.key = item.key
        res = {...res, ...createMutations(itema)}
      }
    }
  }
  return res
}

// 生成动作
const createActions = (item) => {
  let res = {}
  if (item.actions !== undefined && item.actions !== false) {
    // 如果是对象
    if (types.isObject(item.actions)) {
      let key = item.actions.pre + '_' + item.key
      let func = item.actions.func !== undefined ? item.actions.func : async ({ commit, state }, params) => {
        const api = getApi(item.api)
        const res = (api && await getApi(item.api)(params)) || ''
        commit(item.mutation || 'set_' + item.key, res)
      }
      res = { [key]: func }
    }
    // 如果是数组
    else if (types.isArray(item.actions)) {
      res = {}
      for (let itema in item.actions) {
        itema.key = item.key
        res = {...res, ...createActions(itema)}
      }
    }
  }
  return res
}

// 如果api设置为"user.login"，则转化为this.$api.user.login
const getApi = (api) => {
  const apiArrar = api.split(',')
  let res = this.$api
  for (let i in apiArrar) {
    res = res[i]
  }
  return res
}

export default createStore
