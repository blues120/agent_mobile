<template>
  <div class="order-detail">
    <section class="orderstatus" v-if="orderObject.closed==0">
      <p v-if="orderObject.orderStatus==1 && (!orderObject.payAuditId || orderObject.auditStatus>3)">
        <span>等待买家付款</span>
        <span class="tips">{{remainTime}} 后自动取消</span>
      </p>
      <p v-if="orderObject.orderStatus==1 && (orderObject.payAuditId && orderObject.auditStatus<3)">
        <span>已上传打款凭证,审核中</span>
      </p>
      <p v-else-if="orderObject.tabStatus==6">
        <span>交易关闭</span>
        <span class="tips">买家取消</span>
      </p>
      <p v-else-if="orderObject.orderStatus==2">
        <span>已付款,等待卖家发货</span>
      </p>
      <p v-else-if="orderObject.orderStatus==4">
        <span>订单已完成</span>
      </p>
      <img src="~@/assets/images/gosettlement/orderstatus.png" alt=""  v-if="orderObject.orderStatus==1 || orderObject.orderStatus==4">
      <!--已关闭icon-->
      <img src="~@/assets/images/gosettlement/closeicon.png" alt="" v-else-if="orderObject.tabStatus==6">
      <!--待发货icon-->
      <img src="~@/assets/images/gosettlement/waitsend.png" alt="" v-else-if="orderObject.orderStatus==2">
    </section>
    <section class="orderstatus" v-if="orderObject.closed==1">
      <p>
        <span>订单已关闭</span>
      </p>
      <img src="~@/assets/images/gosettlement/closeicon.png">
    </section>
    <!--地址栏信息部分-->
    <section class="address" v-if="orderObject.orderClass==2">
      <img src="~@/assets/images/gosettlement/address.png" alt="" class="addressicon">
      <div class="userinfo">
        <div class="uinfotop">
          <span>{{orderObject.receiptName}}</span>
          <span class="tel">{{orderObject.receiptTel}}</span>
          <!--<span class="addressflag">默认</span>-->
        </div>
        <p>
          {{orderObject.receiptProvince + ' '+ orderObject.receiptCity + ' '+  orderObject.receiptArea + ' '+  orderObject.receiptAddress}}
        </p>
      </div>
      <!--<img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="morecz">-->
    </section>
    <div class="loopItem">
      <p>
        <img src="~@/assets/images/gosettlement/salericon.png" alt="" class="salericon">
        <span>卖家:{{orderObject.shipmentAgentName}}</span>
      </p>
      <p class="redcolor" @click="callPhone(orderObject.shipmentAgentMobile)">
        <img src="~@/assets/images/gosettlement/telphone.png" alt="" class="telicon">
        <span>联系卖家</span>
      </p>
    </div>
    <!--<div class="loopItem" style="margin-bottom: 1px">-->
      <!--<span>配送方式</span>-->
      <!--<span>快递</span>-->
    <!--</div>-->
    <!--<div class="loopItem">-->
      <!--<span>运费</span>-->
      <!--<span class="redcolor">¥11.00</span>-->
    <!--</div>-->
    <div class="loopItem lydivbox">
      <span>买家留言：</span>
      <div class="lydiv">{{orderObject.buyerRemark || '无'}}</div>
    </div>
    <div class="loopItem" style="margin-bottom: 0">
      <span>总运费</span>
      <span class="redcolor">¥{{orderObject.freightPrice}}</span>
    </div>
    <div class="loopItem">
      <span>商品总价</span>
      <span class="redcolor">¥{{orderObject.orderPrice}}</span>
    </div>
    <section >
      <div v-if="orderObject.orderDetailsEntityList.length>0" class="ordergoods" v-for="(list,inde) in orderObject.orderDetailsEntityList" :key="inde">
          <img :src="list.picUrl" alt="">
          <div>
            <span>{{list.productName}}</span>
            <p>
              <span>¥{{list.retailPrice}}</span>
              <span>x {{list.number}}</span>
            </p>
          </div>
      </div>
      <div class="orderinfo">
        <span>订单编号：{{orderObject.orderNo}}</span>
        <span>下单时间：{{orderObject.createTime}}</span>
        <span v-if="orderObject.closeTime">关闭时间：{{orderObject.closeTime}}</span>
      </div>
    </section>
    <section class="orderbot"  v-if="orderObject.closed==0">
      <button class="buyagain" v-if="orderObject.orderStatus==2 && orderObject.revokeId" @click="checkCDDetail(orderObject.id,orderObject.revokeId)">{{orderObject.revokeStatusForAgent==1?'撤单中':orderObject.revokeStatusForAgent==2?'撤单驳回':orderObject.revokeStatusForAgent==3?'撤单关闭':orderObject.revokeStatusForAgent==4?'撤单成功':''}}</button>
      <button v-if="orderObject.orderStatus==2 && orderObject.withdrawalStatus==0 && !orderObject.revokeId" @click="applyCD(orderObject.id)">申请撤单</button>
      <button class="buyagain" v-if="(orderObject.orderStatus==1 ||orderObject.orderStatus==2) && orderObject.payAuditId" @click="checkPZ(orderObject.payAuditId)">查看凭证</button>
      <button  v-if="orderObject.orderStatus==1 && (!orderObject.payAuditId || orderObject.auditStatus>3)" @click="cancleOrder(orderObject.id)">取消订单</button>
      <button class="buyagain" v-if="orderObject.orderStatus==1 && (!orderObject.payAuditId || orderObject.auditStatus>3)" @click="payRightNow(orderObject.id)">立即支付</button>
      <button v-if="orderObject.orderStatus==3 || (orderObject.orderStatus==4 && orderObject.orderClass==2)" @click="goCheckWL(orderObject.id)">查看物流</button>
      <button class="buyagain" v-if="orderObject.orderStatus==3" @click="confirmReceipt(orderObject.id)">确认收货</button>
      <button class="buyagain" v-if="orderObject.orderStatus==4" @click="bugAgain(orderObject.id)">再次购买</button>
    </section>
    <section class="orderbot"  v-else>
      <button  @click="deleteOrder(orderObject.id)">删除订单</button>
      <button class="buyagain"  @click="bugAgain(orderObject.id)">再次购买</button>
    </section>
    <div v-transfer-dom>
      <confirm v-model="warningObj.showWaring"
               :title="warningObj.tit"
               @on-confirm="warningObj.onConfirm">
        <p style="text-align:center;">{{warningObj.body}}</p>
      </confirm>
    </div>
    <pay-now :payObj="payObj"></pay-now>
    <page-view></page-view>
    <logistics-info :logisticsObj="logisticsObj"></logistics-info>
  </div>
</template>
<script>
import payNow from '@/components/payNow'
import PageView from '@/components/PageView'
import {Confirm, TransferDom} from 'vux'
import LogisticsInfo from '@/components/LogisticsInfo'
import Qs from 'qs'
export default {
  name: 'orderDetail',
  created () {
    this.orderId = this.$route.query.orderId
    this.getOrderDetail()
  },
  directives: {
    TransferDom
  },
  components: {
    payNow,
    Confirm,
    PageView,
    LogisticsInfo
  },
  data () {
    return {
      xhrflag: false,
      buyerTips: '', // 买家留言
      orderId: '', // 订单的id
      payObj: {
        showWaring: false, // 是否显示离开支付页面默认不显示
        confirmOrder: false, // 是否点击了立即支付
        PayDetailObj: {}, // 支付对象
        inputPasStep: false, // 是否去输入密码
        userPassword: '' // 如果是线下支付，用户输入的登录密码
      },
      warningObj: {
        showWaring: false, // 默认不展示
        tit: '', // 提示的标题
        body: '', // 提示的文字
        onConfirm: function () {
          console.log('点击了确定')
        }
      },
      remainTime: '', // 倒计时时间
      timerOut: '', // 延时定时器
      logisticsObj: {
        show: false,
        info: {}
      },
      orderObject: {} // 存储订单详情的对象
    }
  },
  beforeDestroy () {
    clearTimeout(this.timerOut)
  },
  methods: {
    getOrderDetail () {
      this.$http.get('orderInfo/getOrderDetail', {
        params: {
          orderId: this.orderId
        }
      }).then((res) => {
        this.orderObject = res.data.data
        if (this.orderObject.orderStatus === 1 && this.orderObject.closed === 0 && (!this.orderObject.payAuditId || this.orderObject.auditStatus > 3)) {
          this.endTime = parseInt(new Date(this.orderObject.createTime).getTime() + 86400000)
          setInterval(this.countTime(), 1000)
        }
      }, () => {
        console.log('请求失败处理')
      })
    },
    callPhone (tel) {
      window.location.href = 'tel:' + tel
    },
    payRightNow (id) {
      this.getPayWay(id)
    },
    getPayWay (orderId) {
      var paras = {
        orderId: orderId
      }
      paras = Qs.stringify(paras)
      this.$http.post('placeOrders/selectPayMethod', paras).then((res) => {
        this.payObj.PayDetailObj = res.data.data
        this.payObj.orderId = orderId
        this.payObj.choosePayWay = this.payObj.PayDetailObj.payMethod
        this.payObj.confirmOrder = true
        localStorage.setItem('PayDetailObj', JSON.stringify(this.payObj.PayDetailObj))
      }, () => {})
    },
    cancleOrder (id) {
      var that = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '提示', // 提示的标题
        body: '确认取消此订单吗？', // 提示的文字
        onConfirm: function () {
          that.cancleOrderXhr(id)
        }
      }
    },
    cancleOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/cancelOrder', param).then((res) => {
        this.$vux.toast.text('取消成功', 'middle')
        this.$router.back()
      })
    },
    deleteOrder (id) {
      var that = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '提示', // 提示的标题
        body: '确认删除此订单吗？', // 提示的文字
        onConfirm: function () {
          that.deleteOrderXhr(id)
        }
      }
    },
    deleteOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.delete('orderInfo/deleteOrder', param).then((res) => {
        this.$vux.toast.text('删除成功', 'middle')
        this.$router.back()
      })
    },
    // 倒计时
    countTime () {
      var date = new Date()
      var now = date.getTime()
      var end = this.endTime
      var leftTime = end - now // 时间差
      var d, h, m, s
      if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
        if (s < 10) {
          s = '0' + s
        }
        if (m < 10) {
          m = '0' + m
        }
        if (h < 10) {
          h = '0' + h
        }
      } else {
        this.remainTime = '00天00时00分00秒'
        return
      }
      this.remainTime = d + '天' + h + '时' + m + '分' + s + '秒'
      console.log('remainTime', this.remainTime)
      this.timerOut = setTimeout(this.countTime, 1000)
    },
    checkPZ (id) { // 跳转到打款凭证页
      this.$router.push({name: 'payPZ', query: {payAuditId: id, from: 'my'}})
    },
    goCheckWL (id) {
      this.$http.get('order/express/' + id).then((res) => {
        if (res) {
          this.logisticsObj.show = true
          this.logisticsObj.info = res.data.expressList[0]
        }
      })
    },
    bugAgain (id) { // 再次购买
      var params = {
        orderId: id
      }
      params = Qs.stringify(params)
      this.$http.post('orderInfo/buyAgain', params).then((res) => {
        if (res) {
          window.localStorage.setItem('templeCarList', JSON.stringify(res.data.data.cartList)) // 将选中的商品暂时放入缓存中，确认订单后或者下次进入本页面清除缓存
          this.$router.push({name: 'GoSettlement'})
        }
      })
    },
    applyCD (id) { // 跳转到申请撤单页面 动作是填写撤单资料等
      this.$router.push({name: 'applyCancelOrder', query: {id: id, type: 'write'}})
    },
    checkCDDetail (id, revokeId) { // 跳转到申请撤单页面 动作是查看撤单详情
      this.$router.push({name: 'applyCancelOrder', query: {id: id, revokeId: revokeId, type: 'read'}})
    },
    confirmReceipt (id) { // 确认收货
      var that = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '提示', // 提示的标题
        body: '是否确认收货吗？', // 提示的文字
        onConfirm: function () {
          that.confirmReceiptxhr(id)
        }
      }
    },
    confirmReceiptxhr (id) { // 确认收货
      var params = {
        id: id
      }
      params = Qs.stringify(params)
      this.$http.post('order/receiptConfirm', params).then((res) => {
        if (res) {
          this.getOrderDetail()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  .redcolor {
    color: #FF0000;
  }
  .bluecolor{
    color:#00A2E9 ;
  }
  .order-detail{
    width: 100%;
    position: fixed;
    overflow: scroll;
    padding-top: .46rem;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 108;
    background-color: #f5f5f5;
    .searchbox{
      display: flex;
      align-items: center;
      width: 100%;
      div{
        width:3rem;
        height:0.3rem;
        background:#fff;
        border-radius:16px;
        display: flex;
        align-items: center;
        padding: 0 0.09rem;
        margin: .1rem auto;
        .searchicon{
          width:0.17rem;
          height:0.17rem;
          margin-right: 0.1rem;
        }
        input{
          flex: 1;
          background-color: transparent;
          color: rgba(204,204,204,1);
          font-size: 0.14rem;
          outline: none;
        }
        input::-webkit-input-placeholder{
          color: rgba(204,204,204,1) !important;
        }
      };
      .functioniconbox{
        width: .22rem;
        height: .22rem;
        background-color: transparent;
        position: relative;
        margin-right: .18rem;
        button{
          width: .22rem;
          height: .22rem;
          background-color: transparent;
          outline: none;
          border: none;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
        };
        img{
          width: .22rem;
          height: .22rem;
          z-index: 1;
        }
      }
    }
    .orderstatus{
      width: 100%;
      height:.75rem;
      background:rgba(0,162,233,1);
      color: #fff;
      padding: 0 .12rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: .17rem;
      img{
        width: .49rem;
        height: .44rem;
      }
      p{
        display: flex;
        flex-direction: column;
        .tips{
          font-size: .14rem;
          margin-top: .08rem;
        }
      }
    }
    .address{
      width: 100%;
      box-sizing: border-box;
      height:.75rem ;
      background-color: #fff;
      margin: .1rem 0;
      display: -webkit-box;
      font-size:.12rem ;
      align-items: center;
      .addressicon{
        width: .22rem;
        height: .28rem;
        margin:0 .2rem 0 .15rem;
      }
      .morecz{
        width: .11rem;
        height: .18rem;
        margin:0.2rem .12rem 0 .43rem;
      }
      .userinfo{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        .uinfotop{
          display: flex;
          align-items: center;
          font-size:.15rem ;
          height: .22rem;
          margin: .05rem 0 0.1rem;
          .tel{
            margin: 0 .26rem 0 .16rem;
          }
          .addressflag{
            min-width:.54rem;
            max-width:.54rem;
            height:.21rem;
            background:rgba(0,162,233,1);
            border-radius:.04rem;
            font-size: 0.14rem;
            color: #fff;
            text-align: center;
            line-height: .21rem;
          }
        }
        p{
          color:rgba(153,153,153,1);
          overflow:hidden;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:2;
          line-height:.17rem;
        }
      }
    }
    .loopItem{
      width: 100%;
      height: .41rem;
      margin-bottom: .1rem;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .13rem;
      font-size: .15rem;
      .lydiv{
        flex: 1;
        max-height: .55rem;
        line-height: 1.2;
        outline: none;
        display: -webkit-box;
        font-size: .15rem;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
      }
      p{
        display: flex;
        max-width: 50%;
        align-items: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .salericon{
          width: .22rem;
          height: .21rem;
          margin-right: .12rem;
        }
        .telicon{
          width: .16rem;
          height: .15rem;
          margin-right: .1rem;
        }
      }
    }
    .lydivbox{
      height: auto;
      min-height: .41rem;
      padding: .05rem .13rem;
      max-height:.65rem;
      span{
        display: inline-block;
        margin-top: .04rem;
      }
    }
    .ordergoods{
      width: 100%;
      background:rgba(255,255,255,1);
      height: 1.23rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 .13rem;
      img{
        width: 1rem;
        height: 1rem;
        margin-right: .13rem;
      }
      div{
        height: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        p{
          display: flex;
          justify-content: space-between;
          margin-top: .3rem;
          font-size: .15rem;
        }
      }
    }
    .orderinfo{
      width: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      font-size: .14rem;
      padding:.1rem .13rem ;
      margin: .1rem 0 .6rem;
      span{
        margin: .06rem 0;
      }
    }
    .orderbot{
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #fff;
      height: .49rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      button{
        padding: .09rem .12rem;
        font-size: .12rem;
        outline: none;
        border: .01rem solid rgba(220,220,220,1);
        background-color: transparent;
        border-radius: .15rem;
        margin-right: .13rem;
      }
      .buyagain{
        border-color: #00A2E9;
        color: #00A2E9;
        box-sizing: border-box;
      }
      .bluecolor{
        border-color:#00A2E9 ;
      }
    }
  }
</style>
