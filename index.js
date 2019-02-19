import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'

Vue.use(Router)
Vue.use(Vuex)

// 更加简洁地配置: API, vue-router, vuex
import { createStore, createRouter, createApi } from './core'

const vuePacket = (options) => {
  // 状态
  const store = new Vuex.Store(createStore(options.store))

  // 路由
  const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: createRouter(options.router)
  })

  // 请求
  const api = createApi(options.api)
  Vue.$api = Vue.prototype.$api = api

  return { store, router, api }
}

export default vuePacket
