// 生成接口请求列表的模块，即插即用，可在入口文件处配置
// 配置和核心代码分离的设计逻辑
import Axios from 'axios'
import QS from 'qs'

const DEFAULT_CONFIG = {
  BASE : '/api/',
  WITHCREDENTIALS : true,
  TIMEOUT : 30000
}

let config = {}

// 方法聚合
const methods = {
  // GET请求
  get (opts) {
    const params = opts.params || {}
    const options = {
      url: opts.url,
      method: 'get',
      responseType: opts.responseType || 'json',
      params: params
    }
    return request(options)
  },

  // POST请求
  post (opts) {
    const params = opts.params || {}
    const options = {
      url: opts.url,
      method: 'post',
      data: QS.stringify(params)
    }
    return __request(options)
  },

  // 上传
  upload (opts) {
    const params = opts.params || {}
    let formData = new FormData()
    for (let k in params) {
      formData.append(k, params[k])
    }
    const options = {
      url: opts.url,
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    }
    return __request(options)
  },

  // PUT请求
  put (opts) {
    const params = opts.params || {}
    const options = {
      url: opts.url,
      method: 'put',
      data: QS.stringify(params)
    }
    return __request(options)
  },

  // DELETE请求
  delete (opts) {
    const params = opts.params || {}
    const options = {
      url: opts.url,
      method: 'delete',
      data: QS.stringify(params)
    }
    return __request(options)
  }

}

const __excute = (options) => {
  // 方法验证
  if (methods[options.method] === undefined) {
    console.error('请求' + options.name + '的方法不正确！')
    return
  }
  const method = methods[options.method]
  // 返回可以cancel的axios实例
  return method(options)
}

const __request = (options) => {
  options = {...options}
  options.url = config.BASE + options.url
  return Axios(options)
}

// 创建api
const createApi = (options) => {
  config = { ...DEFAULT_CONFIG, ...options }
  Axios.defaults.baseURL = config.BASE
  Axios.defaults.headers.post["Accept"] = "application/json"
  Axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest"
  Axios.defaults.timeout = config.TIMEOUT
  Axios.withCredentials = config.WITHCREDENTIALS
  // 添加请求拦截器
  Axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config
  }, function (error) {
    // 对请求错误做些什么
    config.requestError && config.requestError(error)
    return Promise.reject(error)
  })
  // 添加响应拦截器
  Axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    if (response.data.code === 0) {
      return response.data.data
    } else {
      return Promise.reject(response.data)
    }
  }, function (error) {
    // 对响应错误做点什么
    config.responseError && config.responseError(error)
    return Promise.reject(error)
  })

  let modules = config.MODULES
  let apiModules = {}
  for (module in modules) {
    let apiModule = {}
    modules[module].forEach((item) => {
      apiModule[item.name] = (params) => {
        item.params = params
        return __excute(item)
      }
    })
    apiModules[module] = apiModule
  }
  return apiModules
}

export default createApi
