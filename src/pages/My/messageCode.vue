<template>
  <div class="info-detail">
    <div class="inpubox">
      <span>我们已发送验证码短信到您的手机：</span>
      <span style="margin-top: .1rem">{{newtel}}</span>
    </div>
    <div class="inputcodebox">
      <div class="inpubox" v-for="(item,inde) in codearry" :key="inde">
        <input type="text" maxlength="1" v-on:input="gochange(inde)" :ref="'input'+inde" v-model="item.code">
      </div>
    </div>
    <div class="codetips" @click="sendcode">{{codeMsg}}</div>
    <page-view></page-view>
  </div>
</template>

<script>
import PageView from '@/components/PageView'
import Qs from 'qs'
export default {
  name: 'usermobile',
  data () {
    return {
      codearry: [{code: ''}, {code: ''}, {code: ''}, {code: ''}],
      tex: '',
      ischangeMobile: '', // 本次验证码功能是否是更换新手机
      newtel: '', // 如果是更换新手机本页面还有个重新发送验证码功能
      countdown: 60, // 倒计时秒数
      codeMsg: '点击获取验证码',
      timer: '' // 倒计时定时器
    }
  },
  created () {
    this.djsStart()
    if (this.$route.query.changeMobile) {
      this.ischangeMobile = this.$route.query.changeMobile
    }
    if (this.$route.query.newtel) {
      this.newtel = this.$route.query.newtel
    }
  },
  methods: {
    gonext () {
      console.log('输入了正确的密码')
    },
    gochange (inde) { // input框自动下一个聚焦
      console.log('当前点击的index下标是：', inde)
      var inpunow = 'input' + inde
      this.$refs[inpunow][0].blur()
      if (parseInt(inde) < 3) {
        var inpunext = 'input' + (parseInt(inde) + 1)
        this.$refs[inpunext][0].focus()
      }
      if (parseInt(inde) == 3) { // 发送请求验证code码
        var codearry = this.codearry
        var newcode = []
        for (var i in codearry) {
          newcode.push(codearry[i].code)
        }
        newcode = newcode.join('')
        if (this.ischangeMobile=='true' || this.ischangeMobile==true) {
          this.xhrChangeTel(newcode) // 更换手机拿的验证码
        } else { // 忘记密码拿的验证码
          this.xhrforgotPass(newcode)
        }
      }
    },
    xhrChangeTel (newcode) {
      var param = {
        newMobile: this.newtel,
        code: newcode
      }
      param = Qs.stringify(param)
      this.$http.post('setnewmobile', param).then((res) => {
        if (res) {
          this.$vux.toast.text('更换手机号成功', 'middle')
          var userInfo = JSON.parse(localStorage.getItem('userInfo'))
          userInfo.mobile = this.newtel
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.$router ? this.$router.back() : window.history.back()
        } else {
          this.$vux.toast.text('验证码错误', 'middle')
          this.codearry = [{code: ''}, {code: ''}, {code: ''}, {code: ''}]
          this.$refs['input0'][0].blur()
        }
      }, () => {})
    },
    xhrforgotPass (newcode) {
      var param = {
        mobile: this.newtel,
        codeType: 3,
        smsCode: newcode
      }
      param = Qs.stringify(param)
      this.$http.post('checkCode', param).then((res) => {
        if (res) {
          this.$router.replace({name: 'changePassWord', query: {code: newcode, mobile: this.newtel}})
        } else {
          this.$vux.toast.text('验证码错误', 'middle')
          this.codearry = [{code: ''}, {code: ''}, {code: ''}, {code: ''}]
          this.$refs['input0'][0].blur()
        }
      }, () => {})
    },
    sendcode () {
      if (this.countdown == 60) {
        if (this.ischangeMobile=='true' || this.ischangeMobile==true) {
          this.newTelgetTxtCode()
        } else {
          this.oldTelgetTxtCode()
        }
      }
    },
    oldTelgetTxtCode () { // 忘记密码获取验证码
      var param = {
        mobile: this.newmobile
      }
      // param = Qs.stringify(param)
      this.$http.get('agentinfo/fpcode', {
        params: param
      }).then((res) => {
        if (res.data.code==200) {
          this.$vux.toast.text('短信验证码发送成功', 'middle')
          this.djsStart()
        }
      }, () => {})
    },
    newTelgetTxtCode () { // 更换手机获取验证码
      var param = {
        mobile: this.newmobile
      }
      // param = Qs.stringify(param)
      this.$http.get('agentinfo/changmobilecode', {
        params: param
      }).then((res) => {
        if (res.data.code==200) {
          this.$vux.toast.text('短信验证码发送成功', 'middle')
          this.djsStart()
        }
      }, () => {})
    },
    djsStart () {
      // 验证码60秒倒计时
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= 60) {
            this.countdown--
            if (this.countdown !== 0) {
              this.codeMsg = this.countdown + '秒后重发'
            } else {
              clearInterval(this.timer)
              this.codeMsg = '重新获取验证码'
              this.countdown = 60
              this.timer = null
            }
          }
        }, 1000)
      }
    }
  },
  components: {
    PageView
  }
}
</script>

<style lang="less" scoped>
  .info-detail{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 119;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    .inpubox{
      width: 100%;
      height: .72rem;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: .1rem;
      padding: 0 .13rem ;
      border-bottom: .01rem solid rgba(245,245,245,1);;
    }
    .inputcodebox{
      width: 100%;
      height: 1.1rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      .inpubox{
        width: .4rem;
        height:.48rem;
        margin: 0 .16rem;
        border-bottom: .03rem solid #00A2E9;
        display: flex;
        align-items: center;
        justify-content: center;
        input{
          width:.3rem;
          height:.34rem;
          outline: none;
          text-align: center;
        }
      }
    }
    .codetips{
      width: 100%;
      height: .5rem;
      background-color: #fff;
      text-align: center;
    }
  }
</style>
