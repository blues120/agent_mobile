<template>
  <main class="main">
    <div class="sqbox">
      <p>
        <img src="~@/assets/images/gopurchase/Bitmap.png" alt=""  class="msicon">
        <span>上海美瘦 申请获得</span>
      </p>
      <span class="big">以下权限</span>
      <div>
        <input type="radio" id="1" value="1" v-model="picked">
        <label :for="1">获得你的公开信息（昵称、头像、地区及性别）</label>
      </div>
    </div>
    <div class="loader" v-if="code">正在登录中...</div>
    <div class="subbtn" @click="goWechatSQ" v-else>点击登录</div>
  </main>
</template>

<script>
export default {
  name: 'authorization',
  data () {
    return {
      picked: 1
    }
  },
  created () {
    // 检测会员有没有登录
    var code = this.GetQueryString('code')
    if (code) {
      this.code = code
      // 如果有code 说明是用户授权后获取code 做登录操作
      this.login(code)
    } else {
      this.code = ''
      // if (!localStorage.getItem('UserInfo')) {
      //   this.goWechatSQ()
      // }
    }
  },
  methods: {
    GetQueryString (name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return unescape(r[2]); return null
    },
    goWechatSQ () {
      let ua = window.navigator.userAgent.toLowerCase()
      // 请求微信授权,并跳转到 /WxAuth 路由
      let appId = 'wxc7de28d8533ad7ca'
      let redirectUrl = encodeURIComponent('http://shms.ijinzao.com/#/authorization')
      // 判断是否为正式环境
      if (window.location.origin.indexOf('https://m.xxxxxx.com') !== -1) {
        appId = 'wxc7de28d8533ad7ca'
        redirectUrl = encodeURIComponent('https://m.xxxxxx.com/WxAuth')
      }
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUrl}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      }
    },
    goBeforeLoginUrl (status) { // status :  0 需要登录  1 不需要登录，直接进入主界面  2 代理商关闭 3 准代理
      let url = sessionStorage.getItem('beforeLoginUrl') || ''
      let fromInvite = localStorage.getItem('fromInvite') || ''
      let inviteId = localStorage.getItem('inviteId') || ''
      if (status==0) {
        if (fromInvite && inviteId) { // 如果是邀请过来的
          this.$router.replace({name: 'firstStep', query: {linkId: inviteId}})
          localStorage.removeItem('fromInvite')
          localStorage.removeItem('inviteId')
        } else {
          this.$router.replace({name: 'Bind'})
        }
      } else if (status==1) {
        if (!url || url.indexOf('/authorization') != -1) {
          this.$router.replace({name: 'Home'})
        } else {
          if (url == '/') {
            url = '/home'
          }
          this.$router.replace({path: url})
          sessionStorage.removeItem('beforeLoginUrl')
        }
      } else if (status==2) {
        this.$vux.toast.text('代理商被关闭', 'middle')
      } else if (status==3) {
        this.$router.replace({name: 'thirdStep'})
      }
    },
    login (code) {
      // 如果连接中有微信返回的 code，则用此 code 调用后端接口，向微信服务器请求用户信息
      if (code) {
        this.$http.get('weChat/code', {
          params: {
            code: code
          }
        }).then((res) => {
          if (res) {
            // 保存用户登录状态(Vuex)
            localStorage.setItem('openid', res.data.data.openid)
            localStorage.setItem('userInfo', res.data.data.user)
            localStorage.setItem('access_token', res.data.data.token)
            this.checkUserStatus(res.data.data.openid)
            localStorage.setItem('authorizrFlag', true)
          } else {
            this.$vux.toast.text('登录失败惹 :(', 'middle')
            localStorage.setItem('authorizrFlag', false)
            this.code = ''
          }
        })
      }
    },
    checkUserStatus (openId) {
      // 如果连接中有微信返回的 code，则用此 code 调用后端接口，向微信服务器请求用户信息
      if (openId) {
        this.$http.get('checkWXUserStatus', {
          params: {
            openId: openId
          }
        }).then((res) => {
          if (res) {
            this.goBeforeLoginUrl(res.data.data.status) // 页面恢复(进入用户一开始请求的页面)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
input[type="radio"]{
  display:none;
}
input[type="radio"] + label:before {
  content: '';
  display: inline-block;
  width: .12rem;
  height: .12rem;
  border:.01rem solid;
  border-radius: 50%;
  vertical-align: middle;
  margin:0 .1rem 0 .05rem;
  transition: all .5s;
}
input[type="radio"]:checked + label:before {
  background-image: url('~@/assets/images/gosettlement/checked.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.main{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  overflow-y: scroll;
  padding-top: .46rem;
  margin: auto;
  background-color:#fff;
  .sqbox{
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: .5rem 0 1.5rem;
    padding: 0 .12rem;
    p{
      display: flex;
      align-items: center;
      .msicon{
        width: .5rem;
        height: .5rem;
      }
    }
    .big{
      font-size: .18rem;
      margin: 0rem 0 .25rem;
    }
  }
}

body {
  background: #eaecfa
}

.loader {
  width: 250px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  font-family: helvetica, arial, sans-serif;
  text-transform: uppercase;
  font-weight: 900;
  color:  #00A2E9;
  letter-spacing: 0.2em;

  &::before, &::after {
    content: "";
    display: block;
    width: 15px;
    height: 15px;
    background: #00A2E9;
    position: absolute;
    animation: load .7s infinite alternate ease-in-out;
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }
}

@keyframes load {
  0% { left: 0; height: 30px; width: 15px }
  50% { height: 8px; width: 40px }
  100% { left: 235px; height: 30px; width: 15px}
}
</style>
