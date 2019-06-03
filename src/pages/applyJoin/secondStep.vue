<template>
  <div class="second-step">
    <div class="secondbox">
      <img src="~@/assets/images/applyJoin/header.png" alt="" class="headericon">
      <img src="~@/assets/images/applyJoin/msicon.png" alt="" class="msicon">
      <span>美瘦酵素</span>
      <div class="stepdecoratebox">
        <div v-for="step in decorateList" :key="step.inde" class="stepeachitem" :class="actStep>=step.inde?'actstepnow':''">
          <p>
            <span class="decostep" >{{step.inde}}</span>
            <span class="stepname">{{step.name}}</span>
          </p>
          <div class="linedeco"  :class="actStep>step.inde?'actlin':''" v-if="step.inde<4"></div>
        </div>
      </div>
      <!--第一步-->
      <ul  v-if="actStep1==1">
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconshouji"></i>
          </div>
          <cube-input type="tel" v-model.trim="userphoneNumber" :maxlength='11' placeholder="请填写您的手机号码" :clearable="clearable"></cube-input>
        </li>
        <li class="input-group">
          <div class="icon-wrap">
            <img src="~@/assets/images/applyJoin/duanxin.png" alt="" class="duanxinicon">
          </div>
          <cube-input type="text" v-model="dxcode"  placeholder="短信码"></cube-input>
          <button class="sendcodebtn" @click="getCodeRequest" :disabled="disabled">|  {{time}}</button>
        </li>
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconmima"></i>
          </div>
          <cube-input type="password" :eye="eye" v-model="password" :maxlength='16' placeholder="请填写密码"></cube-input>
        </li>
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconmima"></i>
          </div>
          <cube-input type="password" :eye="eye" v-model="passwordagain" :maxlength='16' placeholder="请确认密码"></cube-input>
        </li>
        <li class="input-group" style="margin-top:10px;">
          <div class="icon-wrap">
            <img src="~@/assets/images/applyJoin/usericon.png" alt="" class="duanxinicon">
          </div>
          <cube-input type="text" v-model="username"  placeholder="请填写姓名"></cube-input>
        </li>
      </ul>
      <!--第二步-->
      <ul  v-if="actStep1==2">
        <li class="input-group">
          <div class="icon-wrap" style="width: .8rem;font-size: 14px;">
            <span>身份证</span>
          </div>
          <cube-input type="text" v-model="useridentfy"  placeholder="请填写身份证号"></cube-input>
        </li>
        <li class="input-group">
          <div class="icon-wrap" style="width: .8rem;font-size: 14px;">
            <span>微信号</span>
          </div>
          <cube-input type="text" v-model="userwx"  placeholder="请填微信号"></cube-input>
        </li>
      </ul>
      <button class="nextbtn" @click="goNextStep">下一步</button>
    </div>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import Qs from 'qs'
export default {
  name: 'secondStep',
  data () {
    return {
      userphoneNumber: '', // 用户自己的手机号码
      dxcode: '', // 接口发送的短信验证码
      password: '', // 第一次输入的密码
      username: '', // 用户的姓名
      passwordagain: '', // 确认密码
      useridentfy: '', // 用户身份证
      userwx: '', // 用户微信号
      disabled: false, // 默认发送短信验证码按钮是可以点击的
      time: '验证码',
      clearable: {
        visible: true,
        blurHidden: false
      },
      actStep1: 1, // 当前处于第一步的第一小步（一共有2小步）
      actStep: 1, // 当前处于申请成为代理商的第几步,默认第一部
      decorateList: [
        {
          inde: 1,
          name: '填写代理资料'
        },
        {
          inde: 2,
          name: '代理资质审核'
        },
        {
          inde: 3,
          name: '首次进货'
        },
        {
          inde: 4,
          name: '正式成为代理商'
        }
      ],
      eye: {
        open: true,
        reverse: true
      },
      gradeId: '', // 选择的代理级别id
      productGroupId: '', // 选择的产品id
      inviteId: '' // 邀请者的代理agentid
    }
  },
  created () {
    this.userphoneNumber = this.$route.query.applyerTel
    if (this.$route.query.inviteId) {
      this.inviteId = this.$route.query.inviteId
    }
    if (this.$route.query.gradeId) {
      this.gradeId = this.$route.query.gradeId
    }
    if (this.$route.query.productGroupId) {
      this.productGroupId = this.$route.query.productGroupId
    }
  },
  methods: {
    goNextStep () {
      if (this.actStep1 === 1) {
        if (!this.dxcode) {
          this.$vux.toast.text('请输入短信验证码~', 'middle')
          return
        }
        if (!(this.password && this.passwordagain)) {
          this.$vux.toast.text('请填写密码~', 'middle')
          return
        }
        if (this.password !== this.passwordagain) {
          this.$vux.toast.text('两次输入的密码不一致!', 'middle')
          return
        }
        if (!this.username) {
          this.$vux.toast.text('请填写您的姓名~', 'middle')
          return
        }
        this.actStep1 = 2
      } else {
        this.postUserInfo()
      }
    },
    // 发送用户信息去申请成为代理商
    postUserInfo () {
      var openId = localStorage.getItem('openid')
      var params = {
        name: this.username,
        mobile: this.userphoneNumber,
        smsCode: this.dxcode,
        inviteId: this.inviteId,
        productGroupId: this.productGroupId,
        gradeId: this.gradeId,
        password: this.password,
        wechat: this.userwx,
        openId: openId,
        codeType: 1,
        idCard: this.useridentfy
      }
      params = Qs.stringify(params)
      this.$http.post('applyAgentReview', params).then((res) => {
        if (res.data.code === 200) {
          this.$router.push({name: 'thirdStep'})
        }
      }, () => {})
    },
    // 发送验证码请求
    getCodeRequest () {
      this.disabled = true
      var params = {
        mobile: this.userphoneNumber,
        codeType: 1
      }
      params = Qs.stringify(params)
      this.$http.post('sendCode', params).then((res) => {
        this.disabled = false
        if (res.data.code === 200) {
          this.getCode()
        }
      }, () => {
        this.disabled = false
      })
    },
    // 获取验证码之后倒计时
    getCode: function (options) {
      var that = this
      var currentTime = 60
      this.time = currentTime + ' 秒'
      var interval = setInterval(function () {
        that.time = (currentTime - 1) + ' 秒'
        currentTime--
        if (currentTime <= 0) {
          clearInterval(interval)
          that.time = '重新获取'
          that.disabled = false
        }
      }, 1000)
    }
  },
  components: {
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  *{
    box-sizing: border-box;
  }
  /deep/.input-group .icon-wrap .iconfont{
    font-size: .22rem !important;
  }
  .duanxinicon{
    width: .2rem;
    height: .2rem;
    margin-left: .01rem;
  }
  .second-step{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: .46rem;
    z-index: 120;
    overflow-y: scroll;
    background-color: #f5f6f7;
    ul{
      width: 100%;
      .input-group{
        background-color: #fff;
        box-sizing: border-box;
        border-bottom: .01rem solid #edeef0;
        display: flex;
        align-items: center;
        .icon-wrap{
          width: .5rem;
          padding-left: .1rem;
          .iconfont{
            font-size: .18rem;
            color: #9e9e9e;
          }
        }
        .sendcodebtn{
          min-width: .64rem;
          text-align: left;
          flex: 1;
          margin:0;
          padding: 0;
          outline: none;
          border: none;
          background-color: transparent;
          height: .4rem;
          line-height: .4rem;
          display: inline-block;
          font-size: .14rem;
          color: #00A2E9;
        }
        @{deep} .cube-input{
          width: 65%;
        }
        @{deep} .cube-input::after{
          display: none;
        }
      }
      .input-group:first-child{
        border-bottom: 1px solid #edeef0;
      }
    }
    /deep/ .vux-header{
      font-size: 0.18rem;
      color: #333;
      height: .46rem;
      width: 100%;
      z-index: 999;
    }
    .secondbox{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .stepdecoratebox{
        width: 100%;
        background-color: #fff;
        justify-content:center;
        height: .9rem;
        display: flex;
        align-items: center;
        .stepeachitem{
          height: 100%;
          display: flex;
          align-items: center;
          p{
            width: .45rem;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            .decostep{
              width:.25rem;
              margin: 0;
              text-align: center;
              line-height: .25rem;
              font-size: .14rem;
              height:.25rem;
              border: .01rem solid rgba(204,204,204,1);
              box-sizing: border-box;
              border-radius:.25rem;
            }
            .stepname{
              font-size: .11rem;
              white-space: nowrap;
              margin-bottom: 0;
            }
          }
          .linedeco{
            width: .44rem;
            height: .01rem;
            margin-bottom: .23rem;
            background: rgba(204,204,204,1);
          }
        }
        .actstepnow{
          .decostep{
            background:rgba(0,162,233,1);
            border: none !important;
            color: #fff;
          }
          .stepname{
            color: #00A2E9;
          }
          .actlin{
            background:rgba(0,162,233,1);
          }
        }
      }
      span{
        margin:.12rem 0 .23rem ;
        font-size: .16rem;
      }
      .headericon{
        width: 100%;
        height:1.25rem ;
      }
      .msicon{
        width: .91rem;
        height:.92rem ;
        margin-top: -.46rem;
      }
      .nextbtn{
        width:3.11rem;
        height:.44rem;
        color: #fff;
        margin-top: .1rem;
        font-size: .16rem;
        background:rgba(0,162,233,1);
        border: none;
        outline: none;
        border-radius:.22rem;
      }
    }
  }
</style>
