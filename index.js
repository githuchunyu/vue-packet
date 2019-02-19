import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import core from './core'

Vue.use(Router)
Vue.use(Vuex)

// 更加简洁地配置: API, vue-router, vuex

const vuePacket = (options) => {
  // 状态
  const store = new Vuex.Store(core.createStore(options.store))

  // 路由
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: core.createRouter(options.router)
  })

  // 请求
  const api = core.createApi(options.api)
  Vue.$api = Vue.prototype.$api = api

  return { store, router, api }
}

export default vuePacket
