<template>
  <main class="main">
    <header class="header">
      <div class="portrait">
        <img src="~@/assets/images/meisou_logo.jpg" alt="Logo">
      </div>
      <p class="title">美瘦酵素</p>
    </header>
    <section>
      <ul>
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconshouji"></i>
          </div>
          <cube-input type="tel" v-model.trim="phoneNumber" :maxlength='11' placeholder="请填写您的手机号码" :clearable="clearable"></cube-input>
        </li>
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconmima"></i>
          </div>
          <cube-input type="password" :eye="eye" v-model="password" :maxlength='16' placeholder="请填写您的密码"></cube-input>
        </li>
      </ul>
      <div class="forget-btn"><span @click="ToForget">忘记密码？</span></div>
    </section>
    <section class="bind-wrap"><button type="btn" @click="handleBind">立即绑定</button></section>
    <page-view></page-view>
    <router-view></router-view>
  </main>
</template>

<script>
import Qs from 'qs'
import PageView from '@/components/PageView'
export default {
  name: 'Login',
  data () {
    return {
      phoneNumber: '',
      password: '',
      autocomplete: true,
      eye: {
        open: true,
        reverse: true
      },
      clearable: {
        visible: true,
        blurHidden: false
      },
      toast: ''
    }
  },
  components: {
    PageView
  },
  created () {
    console.log('afjhsbg')
  },
  methods: {
    ToForget () {
      this.$router.push({name: 'Forget'})
    },
    msLogin () {
      var openid = localStorage.getItem('openid')
      var postdata = {
        mobile: this.phoneNumber,
        openId: openid,
        password: this.password
      }
      this.$http.post('agentLogin',
        Qs.stringify(postdata)
      ).then((res) => {
        if (res.data.code === 200) { // 登陆成功
          // 设置Vuex登录标志为true，默认userLogin为false
          this.getUerInfo()
          this.$store.dispatch('setUser', true)
          // Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
          // 我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
          localStorage.setItem('Flag', 'isLogin')
          // 全局存储token
          window.localStorage['X-TOKEN'] = res.data.data.token
          this.$router.push({name: 'Home'})
        } else {
        }
      }, () => {
        console.log('请求失败处理')
      })
    },
    getUerInfo () {
      this.$http.get('info').then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        }
      })
    },
    handleBind () {
      this.canClcik = true
      const reg = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      // const pwdReg = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?.]).*$/  //密码正则
      if (!this.phoneNumber.length) {
        this.toast = this.$createToast({
          txt: '手机号码不得为空',
          time: 1500,
          type: 'txt'
        })
        this.toast.show()
        this.canClcik = false
        return
      } else if (!reg.test(this.phoneNumber)) {
        this.toast = this.$createToast({
          txt: '无效的手机号',
          time: 1500,
          type: 'txt'
        })
        this.toast.show()
        this.canClcik = false
        return
      }
      if (!this.password.length) {
        this.toast = this.$createToast({
          txt: '密码不得为空',
          time: 1500,
          type: 'txt'
        })
        this.toast.show()
        this.canClcik = false
        return
      }
      // else if (!pwdReg.test(this.password)) {
      //   this.toast = this.$createToast({
      //     txt: '密码必须最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
      //     time: 1500,
      //     type: 'txt'
      //   })
      //   this.toast.show()
      //   this.canClcik = false
      //   return
      // }
      // 请求
      this.msLogin()
    }
  }
}
</script>

<style lang="less" scoped>
@deep: ~'>>>';
.main{
  position: relative;
  .header{
    height: 1.5rem;
    width: 100%;
    padding: .1rem;
    box-sizing: border-box;
    background: url('~@/assets/images/login/login_1.png') no-repeat center/cover;
    .portrait{
      width: .8rem;
      height: .8rem;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 100%;
      border: 2px solid #fff;
      box-sizing: border-box;
      margin-bottom: .2rem;
      img{
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    .title{
      font-size: .18rem;
      color: #fff;
      text-align: center;
    }
  }
  .input-group{
    background-color: #fff;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .icon-wrap{
      width: .6rem;
      padding-left: .1rem;
      .iconfont{
        font-size: .18rem;
        color: #9e9e9e;
      }
    }
    @{deep} .cube-input{
      width: 70%;
    }
    @{deep} .cube-input::after{
      display: none;
    }
  }
  .input-group:first-child{
    border-bottom: 1px solid #edeef0;
  }
  .forget-btn{
    color: #6ab4ff;
    text-align: right;
    padding-top: .1rem;
    padding-right: .1rem;
  }
  .bind-wrap{
    margin-top: .4rem;
    button{
      display: block;
      outline: none;
      font-size: .14rem;
      width: 80%;
      margin: 0 auto;
      color: #fff;
      padding: .1rem;
      border-radius: .22rem;
      text-align: center;
      border: none;
      background-color: #5c8dff;
    }
  }
}
</style>
