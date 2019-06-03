<template>
  <div class="pay-now">
    <!--放弃支付提示框-->
    <div v-transfer-dom>
      <confirm v-model="payObj.showWaring"
               title="未完成支付"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定要离开？</p>
      </confirm>
    </div>
    <!--确认订单弹窗-->
    <div v-transfer-dom>
      <div v-show="payObj.confirmOrder" class="diyZZ" @click="showWaringNow"></div>
      <popup v-if="payObj.PayDetailObj" v-model="payObj.confirmOrder" :hide-on-blur=false :popup-style="{zIndex: 504}" style="background-color: #fff">
        <div class="fnctop"><span>选择付款</span><span class="closebtn" @click="showWaringNow">X</span></div>
        <div class="freebox" v-if="payObj.free">
            <span>需支付 <span class="redcolor">¥ 0.00</span></span>
            <img src="~@/assets/images/home/freeicon.png" alt="">
            <span class="newgreycolor">本订单无需支付任何费用，点击底部确认付款即可</span>
        </div>
        <div class="orderconfirmbox" v-else>
          <p class="ordertit">需支付 <span class="orderprice">¥ {{payObj.PayDetailObj.orderTotalPrice}}</span></p>
          <div class="paymypocket" v-if="payObj.PayDetailObj.payMethod==1">
            <p>
              <img src="~@/assets/images/gosettlement/payonline.png" alt="" class="lefticon">
              微信支付
            </p>
            <input type="radio" :id='payObj.PayDetailObj.payMethod'  :value="payObj.PayDetailObj.payMethod" v-model="payObj.choosePayWay">
            <label :for="payObj.PayDetailObj.payMethod"></label>
          </div>
          <div class="midbox" v-if="payObj.PayDetailObj.payMethod==4">
            <img src="~@/assets/images/gosettlement/payunderline.png" alt="" class="lefticon">
            <div>
              <p>
                线下支付
              </p>
              <p style="font-size: 14px;color: #999;flex:1" class="moretipos" v-if="payObj.PayDetailObj.agentEntity">打款给上级代理 {{payObj.PayDetailObj.agentEntity.name}} <span v-if="payObj.PayDetailObj.agentEntity.mobile">（{{payObj.PayDetailObj.agentEntity.mobile}}) </span></p>
            </div>
            <input type="radio" :id='payObj.PayDetailObj.payMethod'  :value="payObj.PayDetailObj.payMethod" v-model="payObj.choosePayWay">
            <label :for="payObj.PayDetailObj.payMethod"></label>
          </div>
          <p   v-if="payObj.PayDetailObj.payMethod==4" class="orderprice" style="font-size: .1rem;padding: 0 .2rem;line-height: 1.5;margin: .1rem auto .2rem ">备注：你可以使用微信、支付宝、银行卡或是现金等方式将钱转给上级代理</p>
        </div>
        <div  class="newbrnbox"  @click="goPayOrder">
          <p  class="savenewaddbtn">{{payObj.free?'确认付款':payObj.PayDetailObj.payMethod==1?'确认付款':'上传打款凭证'}} </p>
        </div>
      </popup>
    </div>
    <!--线上支付输入密码框-->
    <div v-transfer-dom>
      <x-dialog v-model="payObj.inputPasStep" class="dialog-pass">
        <div class="passwordboxtit">
          <img src="~@/assets/images/gopurchase/closebtn.png" alt="" class="icon" @click="closecheckloginNow">
          验证登录信息
        </div>
        <p>为了您的资金安全，请再次输入您的登录密码！</p>
        <x-input  v-model="payObj.userPassword" type="password" class="inputpass" placeholder="请输入您的登录密码"></x-input>
        <span class="forgetPass" @click="forgotpass">忘记密码?</span>
        <div class="surebtn" @click="surePay">确认</div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import Qs from 'qs'
import { TransferDom, Popup, Confirm, XDialog, XInput } from 'vux'
const wx = window['wx']
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    XDialog,
    XInput,
    Confirm
  },
  methods: {
    onConfirm () {
      if (this.payObj.CloudGoodschange) { // 如果是云库存付款过来的 1 是换货支付  2 是 提货支付
        if (this.payObj.CloudGoodschange==2) { // 提货支付离开就跳转到 提货订单页面
          this.$router.replace({name: 'THDD', query: {actInde: 1}})
        }
      } else { // 普通订单过来的，取消付款就到订单列表页面
        this.$router.replace({name: 'myOrders'})
      }
      this.payObj.confirmOrder = false
    },
    showWaringNow () {
      this.payObj.showWaring = true
    },
    forgotpass () {
      this.$router.replace({name: 'Forget'})
    },
    closecheckloginNow () {
      this.payObj.inputPasStep = false
    },
    goPayOrder () {
      if (this.payObj.free) { // 免费的,直接支付
        this.$emit('confirmPay', true) // 付款操作完成
      } else { // 不是免费的
        if (this.payObj.PayDetailObj.payMethod==1) { // 在线支付
          this.orderPayMsg() // 获取支付信息
        } else if (this.payObj.PayDetailObj.payMethod==4) { // 线下支付
          this.payObj.confirmOrder = false
          this.$router.replace({name: 'Subvoucher'})
          localStorage.removeItem('templeCarList')
        }
      }
    },
    orderPayMsg () { // 获取支付信息
      var that = this
      this.$http.get('pay/orderPay', {
        params: {
          orderId: this.payObj.orderId
        }
      }).then((res) => {
        if (res) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.data.timeStamp, // 必填，生成签名的时间戳
            nonceStr: res.data.data.nonceStr, // 必填，生成签名的随机串
            signature: '', // 必填，签名
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
          })
          wx.ready(function () {
            wx.chooseWXPay({
              timestamp: res.data.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: res.data.data.nonceStr, // 支付签名随机串，不长于 32 位
              package: res.data.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
              signType: res.data.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: res.data.data.paySign, // 支付签名
              success: function (res) { // 支付成功后的回调函数
                that.payObj.confirmOrder = false
                that.$router.replace({name: 'paySuccess'})
                localStorage.removeItem('templeCarList')
              }
            })
          })
        }
      }, () => {})
    },
    surePay () {
      if (!this.payObj.userPassword) {
        this.$vux.toast.text('支付密码不能为空', 'middle')
        return
      }
      this.$http.get('placeOrders/verifyLoginUserPwd', {
        params: {
          pwd: this.payObj.userPassword
        }
      }).then((res) => {
        if (res) {
          this.payXhr()
        }
      }, () => {})
    },
    payXhr () {
      var paras = {
        orderId: this.payObj.orderId
      }
      paras = Qs.stringify(paras)
      this.$http.post('placeOrders/payment', paras).then((res) => {
        if (res) {
          if (res.data.code==200) {
            this.$vux.toast.text('支付成功', 'middle')
            if (this.payObj.CloudGoodschange) { // 如果是云库存付款过来的 无论换货或者提货都要触发
              this.$emit('confirmPay', true) // 付款操作完成
            } else {
              this.$router.replace({name: 'paySuccess'})
              localStorage.removeItem('templeCarList')
            }
          }
        }
      }, () => {})
    }
  },
  props: ['payObj']
}
</script>

<style lang="less" scope>
@import "../pages/Home/gosettlement";
  .freebox{
    width: 100%;
    height: 1.95rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: .16rem;
    .redcolor{
      color: #FF0000;
    }
    img{
      width: .67rem;
      height: .62rem;
      margin: .5rem 0 .24rem;
    }
    .newgreycolor{
      font-size: .14rem;
      color: #999;
    }
  }
</style>
