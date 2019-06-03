<template>
  <div class="info-detail">
    <div class="inpubox" style="height: 72px;flex-direction: column;justify-content: center">
      <span>您是否记得账号当前使用的密码？</span>
    </div>
    <p @click="rememberpass">记得密码</p>
    <p @click="forgotpass" class="forgotpass">忘记密码</p>
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
  </div>
</template>

<script>
import inputPass from '@/components/inputPass'
import { XInput } from 'vux'
export default {
  name: 'usermobile',
  data () {
    return {
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      userTel: '17701704110' // 用户绑定的手机号
    }
  },
  created () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userTel = userInfo.mobile
  },
  methods: {
    rememberpass () {
      this.inpuPassObj.inputPasStep = true
    },
    inpuCorrectPass () { // 密码输入正确后反应
      this.$router.push({name: 'changePassWord', query: {mobile: this.userTel}})
    },
    forgotpass () { // 忘记密码跳转其他页面
      this.$router.push({name: 'Forget', query: {userTel: this.userTel, readonly: true}})
    }
  },
  components: {
    XInput,
    inputPass
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
    .forgotpass{
      background-color: #fff;
      color: #000;
      margin-top: .1rem;
    }
  }
</style>
