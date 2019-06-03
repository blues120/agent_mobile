<template>
  <div class="info-detail">
    <div class="inpubox" style="height: 72px;flex-direction: column;justify-content: center">
      <span>{{mobile}}</span>
      <span style="margin-top: .1rem">请为当前账号设置新的密码</span>
    </div>
    <div class="inpubox">
      <img src="~@/assets/images/my/passlock.png" class="idicon" >
      <x-input type="tel" v-model="userPass" placeholder="请输入新密码" class="inpu"></x-input>
    </div>
    <div class="inpubox">
      <img src="~@/assets/images/my/passlock.png" class="idicon" >
      <x-input type="tel" v-model="userPassAgain" placeholder="请再次输入新密码" class="inpu"></x-input>
    </div>
    <p @click="gocheck">完成</p>
  </div>
</template>

<script>
import { XInput } from 'vux'
import Qs from 'qs'
export default {
  name: 'usermobile',
  data () {
    return {
      userPass: '',
      oldPwd: '', // 老密码
      userPassAgain: '',
      mobile: '', // 修改密码的手机号
      txtCode: '' // 如果是忘记密码获取验证码后过来修改密码的会有短信验证码
    }
  },
  created () {
    this.oldPwd = localStorage.getItem('userPass')
    if (this.$route.query.code) {
      this.txtCode = this.$route.query.code
    }
    if (this.$route.query.mobile) {
      this.mobile = this.$route.query.mobile
    }
  },
  methods: {
    gocheck () {
      if (!this.userPass) {
        this.$vux.toast.text('新密码不能为空!', 'middle')
        return
      }
      if (!this.userPassAgain) {
        this.$vux.toast.text('请确认您的新密码!', 'middle')
        return
      }
      if (this.userPass !== this.userPassAgain) {
        this.$vux.toast.text('两次输入的密码不一致!', 'middle')
        return
      }
      if (this.txtCode) {
        this.txtCodeChangeXhr() // 短信验证码修改
      } else {
        this.oldPassChangeXhr() // 老密码修改新密码
      }
    },
    oldPassChangeXhr () {
      var param = {
        oldPwd: this.oldPwd,
        newPwd: this.userPassAgain
      }
      param = Qs.stringify(param)
      this.$http.post('setnewpwd', param).then((res) => {
        if (res.data.code === 200) {
          this.$vux.toast.text('修改密码成功!', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    txtCodeChangeXhr () {
      var param = {
        code: this.txtCode,
        mobile: this.mobile,
        newPwd: this.userPassAgain
      }
      param = Qs.stringify(param)
      this.$http.post('resetpwd', param).then((res) => {
        if (res.data.code === 200) {
          this.$vux.toast.text('修改密码成功!', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    }
  },
  components: {
    XInput
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
      height: .52rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      margin-top: .1rem;
      padding: 0 .13rem ;
      img{
        width: .12rem;
        height: .15rem;
        margin-right: .04rem;
      }
      .inpu{
        height: 100%;
        flex: 1;
      }
    }
    p{
      width:3.11rem;
      height:.44rem;
      background:rgba(0,162,233,1);
      border-radius:.22rem;
      color: #fff;
      text-align: center;
      line-height: .44rem;
      margin: .3rem auto .15rem;
      font-size: .16rem;
    }
  }
</style>
