<template>
  <main class="pay-succes">
    <msg v-if="type=='cancel'"  :description="您已成功发起撤单申请,请耐心等待卖家审核" icon="success"></msg>
    <msg v-else :description="showobj.orderStatus>1?'您的订单已付款成功，卖家马不停蹄处理中！':'您已成功提交打款凭证，请耐心等待卖家审核'" icon="success"></msg>
    <section class="order-detail">
      <div class="orderitem">
        <span class="order-left">订单编号 :</span>
        <p>
          {{showobj.orderNo}}
          <span class="order-flag" v-if="showobj.orderClassStr">{{showobj.orderClassStr}}</span>
        </p>
      </div>
      <div class="orderitem">
        <span class="order-left">{{type=='cancel'?'退款':'订单'}}金额 :</span>
        <p class="redcolor">
          ¥{{showobj.orderPrice}}
        </p>
      </div>
      <div class="orderitem" v-if="!type=='cancel'">
        <span class="order-left">货款支付 :</span>
        <p>
          {{showobj.payMethodString}}
        </p>
      </div>
      <div class="orderitem" v-if="type=='cancel'">
        <span class="order-left">撤单原因 :</span>
        <p>
          {{reason}}
        </p>
      </div>
      <div class="orderitem" v-if="type=='cancel' && times">
        <span class="order-left">申请时间 :</span>
        <p>
          {{times}}
        </p>
      </div>
      <div class="orderitem" v-if="showobj.payTime">
        <span class="order-left">付款时间 :</span>
        <p>
          {{showobj.payTime}}
        </p>
      </div>
      <div class="orderitem" style="min-height: 50px" v-if="showobj.orderClass==2 && !type=='cancel'">
        <span class="order-left">收货信息 :</span>
        <div class="speciap">
          <p>
            <input :type="hideContent?'password':'text'" :value="showobj.receiptName + '  ' + showobj.receiptTel" readonly>
            <img src="~@/assets/images/gosettlement/eyeicon.png" alt="" class="eyeicon" @click="hideContent=!hideContent" v-if="!hideContent">
            <img src="~@/assets/images/gosettlement/closeye.png" alt="" class="eyeicon" @click="hideContent=!hideContent" v-else>
          </p>
          <div>
            <input class="addinpu" v-if="hideContent" :type="hideContent?'password':'text'"  :value="showobj.receiptCity + '  ' + showobj.receiptArea + '  ' + showobj.receiptAddress" readonly>
            <p v-else style="line-height: 1.5">{{showobj.receiptCity + '  ' + showobj.receiptArea + '  ' + showobj.receiptAddress}}</p>
          </div>
        </div>
      </div>
    </section>
    <section class="fncbtnbox">
      <p @click="GoIndex">返回代理首页</p>
      <p @click="GoOrderList" class="righp">返回订单列表</p>
    </section>
  </main>
</template>
<script>
import {Msg} from 'vux'
export default {
  name: 'Subvoucher',
  data () {
    return {
      hideContent: false, // 是否可见
      PayDetailObj: {},
      showobj: {},
      reason: '无',
      times: '',
      type: '' // 默认支付成功，特殊 cancel 是撤单申请发送成功
    }
  },
  created () {
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
    if (this.$route.query.reason) {
      this.reason = this.$route.query.reason
    }
    if (this.$route.query.times) {
      this.times = this.$route.query.times
    }
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
      this.getOrderDetail(this.orderId)
    } else {
      this.PayDetailObj = JSON.parse(localStorage.getItem('PayDetailObj'))
      this.getOrderDetail(this.PayDetailObj.orderId)
    }
  },
  destroyed () {
    localStorage.removeItem('PayDetailObj')
  },
  methods: {
    GoIndex () { // 我要进货
      this.$router.replace({name: 'Home'})
    },
    GoOrderList () { // 我要进货
      this.$router.replace({name: 'myOrders'})
    },
    getOrderDetail (orderId) {
      this.$http.get('placeOrders/getAlreadyOrderInfo', {
        params: {
          orderId: orderId
        }
      }).then((res) => {
        if (res) {
          this.showobj = res.data.data
        }
      }, () => {})
    }
  },
  components: {
    Msg
  }
}
</script>
<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  /deep/.weui-msg__desc{
    color: #000;
  }
  .pay-succes{
    position: absolute;
    padding-top: .3rem;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background-color: #fff;
    bottom: 0;
    margin: auto;
    .header{
      background-color: #00a2e9;
      height: .83rem;
      .control-list{
        height: .92rem;
        width: 3.51rem;
        background-color: #fff;
        border-radius: .06rem;
        transform: translateY(.12rem);
        margin: 0 auto;
        padding: .08rem;
        box-sizing: border-box;
        .title{
          padding: .05rem;
          box-sizing: border-box;
          border-bottom: .01rem solid #f5f5f5;
          margin-bottom: .1rem;
        }
        ul{
          display: flex;
          li{
            flex: 1;
            align-items: center;
            .text{
              text-align: center;
            }
            img.icon{
              display: block;
              width: .22rem;
              height: .22rem;
              margin: 0 auto .05rem;
            }
          }
        }
      }
    }
    .order-detail{
      border-top: .01rem solid #F5F5F5;
      border-bottom: .01rem solid #F5F5F5;
      padding-bottom: .1rem;
      .orderitem{
        width: 100%;
        margin-top: .21rem;
        padding: 0 .13rem;
        display: flex;
        align-items: center;
        font-size: .15rem;
        .order-left{
          color: #999;
          margin-right: .1rem;
        }
        .order-flag{
          padding: .05rem .08rem;
          border-radius:.1rem;
          background: rgba(245,245,245,1);
          font-size: .12rem;
        }
        .redcolor{
          color: #FF0000;
        }
        .speciap{
          flex: 1;
          display: flex;
          flex-direction: column;
          p{
            display: flex;
            align-items: center;
            margin: .02rem 0;
            .eyeicon{
              width: .17rem;
              height: .11rem;
            }
            input{
              border: none;
              outline: none;
            }
            .addinpu{
              flex: 1;
            }
          }
        }
      }

    }
    .fncbtnbox{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      p{
        background-color:#FF0000 ;
        padding: .1rem .12rem;
        color: #fff;
        font-size: .14rem;
        margin: .2rem .3rem;
        border-radius: .2rem
      }
      .righp{
        background-color:#09bb07 ;
      }
    }
  }
</style>
