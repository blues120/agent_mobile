import axios from 'axios'
import store from './../store'
import Vue from 'vue'

/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      break
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      Vue.$vux.toast.text('登录过期，请重新登录', 'middle')
      localStorage.clear()
      this.$store.dispatch('setUser', false)
      this.$router.replace({name: 'Bind'})
      break
    // 404请求不存在
    case 404:
      // tip('请求的资源不存在');
      break
    default:
      console.log(other)
  }
}
// 新创建 axios 实例配置
const instance = axios.create({
  baseURL: 'http://shms.ijinzao.com/ms-portal/clt/app/', // 测试环境
  // baseURL: 'http://192.168.100.66:8080/clt/app/', // 张伟本地链接
  // baseURL: 'http://192.168.30.73:8080/clt/app/', // 李朝阳本地链接
  // baseURL: 'http://192.168.30.200:8080/clt/app/', // 老朱本地链接
  // baseURL: 'http://192.168.30.65:8080/clt/app/', //  顾亚坤本地连接
  timeout: 5000,
  headers: {
    // 'Content-Type': 'application/json; charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest'
  }
})
// 设置请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
/**
 *  请求拦截器
 *  每次请求前，如果存在token则在请求头中携带token
 *  登录流程控制中，根据本地是否存在token判断用户的登录情况
 *  但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
 *  后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
 *  而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
 */
instance.interceptors.request.use(
  config => {
    store.dispatch('SetLoading', true)
    if (localStorage.getItem('X-TOKEN')) { // 判断token是否存在
      config.headers['X-TOKEN'] = localStorage.getItem('X-TOKEN') // 将token设置成请求头
    }
    return config
  },
  error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => {
    store.dispatch('SetLoading', false)
    if (res.data.code !== 200 && res.data.msg) {
      setTimeout(() => {
        Vue.$vux.toast.text(res.data.msg, 'middle')
      }, 200)
    }
    console.log('res', res)
    if (res.data.code == 200) {
      return res
    }
  },
  // 请求失败
  error => {
    store.dispatch('SetLoading', false)
    const { response } = error
    if (response) {
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      store.commit('changeNetwork', false)
    }
  })

export default instance
