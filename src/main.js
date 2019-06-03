// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { sync } from 'vuex-router-sync'
import RouteTransition from 'vue-route-transition'
import store from './store'
import instance from './axios/http'

import '@/assets/css/iconfont.css'
import {Toast, ToastPlugin, LoadingPlugin, ConfirmPlugin} from 'vux'

import {routes} from './router'
import VueRouter from 'vue-router'

Vue.use(ConfirmPlugin)
Vue.use(RouteTransition)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.component('toast', Toast)

Vue.prototype.$http = instance

store.registerModule('vux', {
  state: {
    requestLoading: 0, // 当前请求数量，大于0的时候表示当前状态还有请求没有返回值
    isLogin: false, // 当前用户是否在登录状态，默认false
    user: {} // 接口返回的用户信息
  },
  mutations: {
    // 保存登录状态
    userStatus (state, flag) {
      state.isLogin = flag
    },
    SET_LOADING (state, boolean) {
      boolean ? ++state.requestLoading : --state.requestLoading
    }
  },
  // 获取属性的状态
  getters: {
    // 获取登录状态
    isLogin: state => state.isLogin
  },
  actions: {
    // 获取登录状态
    setUser ({commit}, flag) {
      commit('userStatus', flag)
    },
    SetLoading ({commit}, boolean) {
      commit('SET_LOADING', boolean)
    }
  }
})

const router = new VueRouter({
  mode: 'hash',
  routes
})
sync(store, router)

// 以下代码复制于vuxdemo需要改动！！！
// simple history management
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})
methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})
const getQueryString = function (name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}
router.beforeEach(function (to, from, next) {
  var linkId = getQueryString('linkId')
  if (linkId) {
    localStorage.setItem('fromInvite', true)
    localStorage.setItem('inviteId', linkId)
  }
  var authorizrFlag = localStorage.getItem('authorizrFlag') || false
  if (!((authorizrFlag == true) || (authorizrFlag == 'true')) && to.path != '/authorization') {
    // 第一次进入项目，保存当前路由地址，授权后还会跳到此地址
    localStorage.setItem('beforeLoginUrl', to.fullPath)
    next('/authorization')
    return false
  }
  if (to.path == '/authorization') {
    next()
    return false
  }
  if (linkId && (to.name == 'Home' || to.name == 'firstStep' || to.name == 'thirdStep')) { // 点击邀请链接，跳转首页
    if (to.query.linkId || to.name == 'thirdStep') {
      next()
      return
    }
    if (to.name == 'Home') {
      next({
        replace: true,
        path: '/home',
        query: {
          linkId: linkId
        }
      })
      return
    }
  }
  // 获取用户信息
  let userInfo = localStorage.getItem('userInfo') || ''
  if (userInfo) {
    // 如果有用户信息说明用户在我们平台注册过
    // 获取用户登录成功后储存的登录标志
    let getFlag = localStorage.getItem('Flag') || ''
    // 如果登录标志存在且为isLogin，即用户已登录
    if (getFlag === 'isLogin') {
      // 设置vuex登录状态为已登录
      store.state.isLogin = true
    } else { // 没有登录标志说明可能已经解绑了账号，需要重新绑定账号
      if (to.name === 'Bind') {
        next()
        return
      }
      next({
        path: '/bind'
      })
    }
    next()
  } else {
    next('/authorization')
    return false
  }
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      // store.commit('updateDirection', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        // store.commit('updateDirection', {direction: ''})
      } else {
        // store.commit('updateDirection', { direction: 'reverse' })
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    // store.commit('updateDirection', {direction: 'forward'})
  }

  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    next()
  }
})
router.afterEach(function (to) {
  isPush = false
  if (process.env.NODE_ENV === 'production') {
    // ga && ga('set', 'page', to.fullPath)
    // ga && ga('send', 'pageview')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
