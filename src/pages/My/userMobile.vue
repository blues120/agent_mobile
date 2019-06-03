<template>
  <div class="info-detail">
      <div class="usertel">
        <img src="~@/assets/images/my/usertel.png" class="idicon" >
        <span>您当前的手机号码：{{usermobile}}</span>
      </div>
      <p @click="changemobile">更换手机号</p>
      <span class="tip">更换手机号后,下次登录将使用新手机号登录</span>
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
  </div>
</template>

<script>
import inputPass from '@/components/inputPass'
export default {
  name: 'usermobile',
  data () {
    return {
      usermobile: '17701704110',
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      }
    }
  },
  created () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.usermobile = userInfo.mobile
  },
  methods: {
    changemobile () {
      this.inpuPassObj.inputPasStep = true
    },
    inpuCorrectPass () {
      this.$router.push({name: 'Forget', query: {changeMobile: true}})
    }
  },
  components: {
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
    z-index: 109;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    .usertel{
      width: 100%;
      height: 1.58rem;
      margin-top: .1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      font-size:.14rem ;
      color: #333333;
      img{
        width: .63rem;
        height: .63rem;
        margin-bottom: .15rem;
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
      margin: .2rem auto .15rem;
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
