<template>
  <div class="info-detail">
    <div class="titip" v-if="!changeMobile">请填写您要找回密码的手机号码</div>
    <div class="inpubox">
      <img src="~@/assets/images/my/newtel.png" class="idicon" >
      <x-input type="tel" v-model="newmobile" :readonly="inpureadyonly" placeholder="请输入手机号码" class="inpu"></x-input>
    </div>
    <p @click="gonext">{{changeMobile?'发送验证码':'下一步'}}</p>
    <span class="tip">一个手机号只能做为一个账号的登录名</span>
    <page-view></page-view>
  </div>
</template>

<script>
import { XInput } from 'vux'
// import Qs from 'qs'
import PageView from '@/components/PageView'
export default {
  name: 'usermobile',
  data () {
    return {
      newmobile: '', // 是否需要带入手机号
      inpureadyonly: false, // 是否不能修改手机号
      changeMobile: false // 是否是更改手机号码而发短信
    }
  },
  created () {
    if (this.$route.query.userTel) {
      this.newmobile = this.$route.query.userTel
    }
    if (this.$route.query.readonly) {
      this.inpureadyonly = true
    }
    if (this.$route.query.changeMobile) {
      this.changeMobile = true
    }
  },
  methods: {
    gonext () {
      if (!this.changeMobile) {
        this.oldTelgetTxtCode()
      } else {
        this.newTelgetTxtCode()
      }
    },
    oldTelgetTxtCode () { // 忘记密码获取验证码
      var param = {
        mobile: this.newmobile,
        codeType: 3
      }
      // param = Qs.stringify(param)
      this.$http.get('sendCode', {
        params: param
      }).then((res) => {
        if (res.data.code === 200) {
          this.$router.replace({name: 'messageCode', query: {changeMobile: false, newtel: this.newmobile}})
        }
      }, () => {})
    },
    newTelgetTxtCode () { // 更换手机获取验证码
      var param = {
        mobile: this.newmobile,
        codeType: 4
      }
      // param = Qs.stringify(param)
      this.$http.get('sendCode', {
        params: param
      }).then((res) => {
        if (res.data.code === 200) {
          this.$router.replace({name: 'messageCode', query: {changeMobile: true, newtel: this.newmobile}})
        }
      }, () => {})
    }
  },
  components: {
    XInput,
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
    z-index: 109;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    .titip{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: .6rem;
      border-top: .01rem solid #f5f5f5;
      font-size: .15rem;
      margin-bottom: .1rem;
      background-color: #ffffff;
    }
    .inpubox{
      width: 100%;
      height: .52rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      margin-top: .1rem;
      padding: 0 .13rem ;
      img{
        width: .15rem;
        height: .2rem;
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
      margin: .4rem auto .15rem;
      font-size: .16rem;
    }
    .tip{
      color:rgba(153,153,153,1);
      font-size: .14rem;
      margin: 0 auto;
      display: block;
      text-align: center;
    }
  }
</style>
