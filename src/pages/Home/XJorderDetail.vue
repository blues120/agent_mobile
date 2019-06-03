<template>
  <div class="order-detail">
    <section class="orderstatus" v-if="type=='watch'">
      <div v-if="orderObject.closed!=1">
        <p v-if="orderObject.orderStatus==1 && orderObject.auditId">
          <span>已上传打款凭证,等待卖家审核</span>
        </p>
        <p v-if="orderObject.orderStatus==1&& !orderObject.auditId">
          <span>等待买家付款</span>
          <span class="tips">{{remainTime}} 后自动取消</span>
        </p>
        <p v-else-if="orderObject.orderStatus==2">
          <span>买家已付款</span>
        </p>
        <p v-else-if="orderObject.orderStatus==3">
          <span>等待买家收货</span>
        </p>
        <p v-else-if="orderObject.orderStatus==4">
          <span>交易已完成</span>
        </p>
        <p v-else-if="orderObject.tabStatus==6">
          <span>交易关闭</span>
          <span class="tips">买家取消</span>
        </p>
        <!--待付款icon-->
        <img src="~@/assets/images/gosettlement/orderstatus.png" alt=""  v-if="orderObject.orderStatus==1">
        <!--待发货icon-->
        <img src="~@/assets/images/gosettlement/waitsend.png" alt="" v-else-if="orderObject.orderStatus==2">
        <!--待收货icon-->
        <img src="~@/assets/images/gosettlement/waitsend.png" alt="" v-else-if="orderObject.tabStatus==3">
        <!--已关闭icon-->
        <img src="~@/assets/images/gosettlement/closeicon.png" alt="" v-else-if="orderObject.tabStatus==6">
      </div>
      <div v-else>
        <p >
          <span>订单已关闭</span>
        </p>
        <!--已关闭icon-->
        <img src="~@/assets/images/gosettlement/closeicon.png" alt="">
      </div>
    </section>
    <!--地址栏信息部分-->
    <section class="address" v-if="orderObject.orderClass==2">
      <img src="~@/assets/images/gosettlement/address.png" alt="" class="addressicon">
      <div class="userinfo">
        <div class="uinfotop">
          收货人：
          <span>{{orderObject.receiptName}}</span>
          <span class="tel">{{orderObject.receiptTel}}</span>
          <!--<span class="addressflag">默认</span>-->
        </div>
        <p>
          收货地址：{{orderObject.receiptProvince + ' '+ orderObject.receiptCity + ' '+  orderObject.receiptArea + ' '+  orderObject.receiptAddress}}
        </p>
      </div>
    </section>
    <div class="loopItem"  v-if="type=='watch'">
      <p>
        <img src="~@/assets/images/gosettlement/salericon.png" alt="" class="salericon">
        <span>买家:{{orderObject.name}}</span>
      </p>
      <p class="redcolor" @click="callPhone(orderObject.mobile)">
        <img src="~@/assets/images/gosettlement/telphone.png" alt="" class="telicon">
        <span>联系买家</span>
      </p>
    </div>
    <div class="loopItem" v-else style="padding: 0;margin:-5px 0 0;">
      <popup-picker  class="chosepicker" title="选择发货快递" popup-title="选择物流公司" :data="sexList" v-model="sex" @on-change="onChange"></popup-picker>
    </div>
    <div class="loopItem" v-if="type=='send'" style="margin:1px 0 5px;">
      <span>运单号</span>
      <input type="number" class="kdnumberbox" placeholder="请填写运单号" v-model="kdAccount">
      <!--<img src="~@/assets/images/home/saomaQr.png" alt="" class="kdIcon">-->
    </div>
    <section >
      <div class="loopItem" style="margin-bottom: 0;border-bottom: 1px solid #f5f5f5"  v-if="type=='send'">
        <span>发货商品：</span>
      </div>
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
      <div class="loopItem">
        <span>买家留言：</span>
        <div class="lydiv">{{orderObject.buyerRemark || '无'}}</div>
      </div>
      <div class="loopItem" style="margin:-9px 0 10px" v-if="type=='watch'">
        <span>支付方式</span>
        <span>{{orderObject.payMethodString}}</span>
      </div>
      <div class="loopItem" style="margin:-9px 0 0"  v-if="type=='watch'">
        <span>商品总价</span>
        <span class="redcolor">¥{{orderObject.orderPrice}}</span>
      </div>
      <div class="loopItem"  v-if="type=='watch'">
        <span>总运费</span>
        <span class="redcolor">¥{{orderObject.freightPrice}}</span>
      </div>
      <div class="loopItem"  v-if="type=='watch'">
        <span>订单财务分析</span>
        <span>预计最多赚取<span class="redcolor">¥{{orderObject.freightPrice}}</span>元</span>
      </div>
      <div class="xjorderelationbox">
        <div class="wholebox">
          <div class="userbox">
            <img src="~@/assets/images/home/daiqueren.png" alt="" class="userava">
            <span>zhoutong</span>
            <span class="level">会员</span>
          </div>
          <div class="connectbox">
            <span>下单采购</span>
            <p>
              <img src="~@/assets/images/home/connectRight.png" alt="">
              <img src="~@/assets/images/home/connectRight.png" alt="">
            </p>
            <span>打款</span>
          </div>
        </div>
      </div>
      <div class="orderinfo">
        <span>订单编号：{{orderObject.orderNo}}</span>
        <span>下单时间：{{orderObject.createTime}}</span>
        <span v-if="orderObject.payTime">付款时间：{{orderObject.payTime}}</span>
        <span v-if="orderObject.closeTime">关闭时间：{{orderObject.closeTime}}</span>
      </div>
    </section>
    <section class="orderbot" v-if="type=='watch'&& orderObject.closed!=1">
      <button v-if="orderObject.orderStatus==1&&!orderObject.auditId &&orderObject.payMethod==4"  @click="orderhasPay(orderObject.id)">已付款</button>
      <button class="buyagain" v-if="orderObject.orderStatus==1&&orderObject.auditId" @click="checkPZ(orderObject.auditId)">打款审核</button>
      <button  v-if="orderObject.orderStatus==2&&beDelivered ==1" @click="goLeaderSend">转上级发货</button>
      <button class="buyagain" v-if="orderObject.orderStatus==2&&beDelivered ==1" @click="postMySelf(orderObject.id)">自己发货</button>
      <button class="buyagain" v-if="orderObject.orderStatus==2&&beDelivered ==2&&orderObject.revokeId"  @click="checkCDPZ(orderObject.revokeId)">撤单审核</button>
      <button  v-if="orderObject.orderStatus==3" @click="goCheckWL(orderObject.id)">查看物流</button>
    </section>
    <section v-else>
      <p class="fixedbtn" @click="goSend">确认发货</p>
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
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
    <self-delivery :deliveryObj="deliveryObj" @deliverySuccess="deliverySuccess" @changeType="changeType"></self-delivery>
    <logistics-info :logisticsObj="logisticsObj"></logistics-info>
  </div>
</template>
<script>
import payNow from '@/components/payNow'
import PageView from '@/components/PageView'
import {Confirm, TransferDom, PopupPicker} from 'vux'
import selfDelivery from '@/components/selfDelivery'
import inputPass from '@/components/inputPass'
import LogisticsInfo from '@/components/LogisticsInfo'
import Qs from 'qs'
export default {
  name: 'orderDetail',
  created () {
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    }
    if (this.$route.query.beDelivered) {
      this.beDelivered = this.$route.query.beDelivered
    }
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
    if (this.type !== 'watch') {
      this.getActiveKD()
    }
    this.getOrderDetail()
  },
  directives: {
    TransferDom
  },
  components: {
    payNow,
    Confirm,
    PopupPicker,
    PageView,
    inputPass,
    selfDelivery,
    LogisticsInfo
  },
  data () {
    return {
      type: '',
      sex: [],
      sexList: [], // 1 是女 0 是男
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
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      deliveryObj: {
        selfPostTip: false, // 自己发货提示框
        warningObj: {
          showWaring: false, // 默认不展示
          tit: '', // 提示的标题
          body: '', // 提示的文字
          onConfirm: function () {
            console.log('点击了确定')
          }
        },
        physical: false, // 实体库存是否充足
        cloud: false, // 云库存是否充足
        caozuoId: '', // 点击自己发货的时候保存的操作订单的id
        menus: {
          physical: '<span style="line-height: 1.2;font-size: 16px;">实体库存发货</span>',
          cloud: '<span style="line-height: 1.2;font-size: 16px;">云库存发货</span>'
        }
      },
      kdAccount: '', // 快递单号
      remainTime: '', // 倒计时时间
      orderObject: {}, // 存储订单详情的对象
      logisticsObj: {
        show: false,
        info: {}
      }
    }
  },
  methods: {
    changeType () {
      this.type = 'send'
    },
    goCheckWL (id) {
      this.$http.get('order/express/' + id).then((res) => {
        if (res) {
          this.logisticsObj.show = true
          this.logisticsObj.info = res.data.expressList[0]
        }
      })
    },
    deliverySuccess () {
      this.$router.back()
    },
    postMySelf (id) { // 自己发货前检测云实体库存，缺货列表
      this.deliveryObj.caozuoId = id
      this.$http.get('subPur/selfShipment', {
        params: {
          orderId: id
        }
      }).then((res) => {
        if (res) {
          this.deliveryObj.physical = res.data.data.physical
          this.deliveryObj.cloud = res.data.data.cloud
          if (res.data.data.physical) {
            this.deliveryObj.menus.physical = '<span style="color:#00A2E9;line-height: 1.2;font-size: 16px;">实体库存发货</span>'
          } else {
            this.deliveryObj.menus.physical = '<span style="color:#666;line-height: 1.3;font-size: 15px;">实体库存发货<br/>(<span style="color:#666;font-size:12px;">代理商实体库存不足,查看 <span style="color: #00A2E9"> 缺货</span></span>)</span>'
          }
          if (res.data.data.cloud) {
            this.deliveryObj.menus.cloud = '<span style="color:#00A2E9;line-height: 1.2;font-size: 16px;">云库存代发</span>'
          } else {
            this.deliveryObj.menus.cloud = '<span style="color:#666;line-height: 1.3;font-size: 15px;">云库存发货<br/>(<span style="font-size:12px;">代理商云库存不足,查看 <span style="color: #00A2E9"> 缺货</span></span>)</span>'
          }
          this.deliveryObj.selfPostTip = true
        }
      })
    },
    goSend () { // 去发货
      if (!this.sex[0]) {
        this.$vux.toast.text('发货快递必填!', 'middle')
        return
      }
      if (!this.kdAccount) {
        this.$vux.toast.text('快递单号必填!', 'middle')
        return
      }
      this.sendgoodsXhr()
    },
    sendgoodsXhr () { // 点击确认发货
      var self = this
      var params = {
        orderId: this.orderId,
        freightOrderNo: this.kdAccount,
        logisticsName: this.sex[0]
      }
      params = Qs.stringify(params)
      this.$http.post('subPur/confirmDelivery', params).then((res) => {
        if (res) {
          this.$vux.toast.text('发货成功!', 'middle')
          setTimeout(() => {
            self.$router.back()
          }, 500)
        }
      })
    },
    onChange (val) { // 改变物流
      if (this.sex[0] === '设置更多物流') {
        this.sex = []
        this.$router.push({name: 'commonKD'})
      }
    },
    getActiveKD () {
      this.$http.get('express/agentList', {
        params: {
          limit: 20
        }
      }).then((res) => {
        if (res && res.data.list) {
          var activeKdlist = res.data.list
          var temparry = []
          for (var i in activeKdlist) {
            temparry.push(activeKdlist[i].expressName)
          }
          this.sexList = [temparry.concat(['设置更多物流'])]
        }
      })
    },
    getOrderDetail () {
      this.$http.get('subPur/getSubordinatePurchaseOrderDetail', {
        params: {
          orderId: this.orderId
        }
      }).then((res) => {
        this.orderObject = res.data.data
        if (this.orderObject.orderStatus === 1 && this.orderObject.closed === 0) { // 如果是待付款的则显示定时器
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
    goLeaderSend () { // 转上级发货
      // var that = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '确定要转上级发货吗?', // 提示的标题
        body: '根据商家规定,转上级发货您将赚取¥48.00,且需向上级付款¥482.00', // 提示的文字
        onConfirm: function () {
          // that.cloudPostXhr()
        }
      }
    },
    checkPZ (id) { // 跳转到打款凭证页
      this.$router.push({name: 'payPZ', query: {payAuditId: id, from: 'other'}})
    },
    checkCDPZ (id) { // 跳转到查看撤单凭证页（和打款凭证页公用的一套页面）
      this.$router.push({name: 'payPZ', query: {revokeId: id}})
    },
    orderhasPay (id) {
      this.inpuPassObj.inputPasStep = true
      this.fnczc = id // 本次操作（已付款）的id
    },
    inpuCorrectPass (id) {
      this.hasPayxhr() // 已付款的请求
    },
    hasPayxhr () {
      var self = this
      var param = {
        orderId: this.fnczc
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/paid', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          setTimeout(() => {
            self.$router ? this.$router.back() : window.history.back()
          }, 500)
        }
      })
    },
    getPayWay (orderId) {
      if (this.xhrflag) {
        return false
      }
      this.xhrflag = true
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
        this.xhrflag = false
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
      setTimeout(this.countTime, 1000)
    },
    goCheckPZ (id) {
      this.$router.push({name: 'payPZ', query: {payAuditId: this.orderObject.payAuditId}})
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
      margin-bottom: .1rem;
      div{
        display: flex;
        width: 100%;
        height: 100%;
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
    }
    .address{
      width: 100%;
      box-sizing: border-box;
      height:.75rem ;
      background-color: #fff;
      margin: 0 0 .1rem;
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
          padding-right: .12rem;
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
      .chosepicker{
        width: 100%;
        padding: 0;
      }
      .kdIcon{
        width: .25rem;
        height: .25rem;
        margin: 0 .1rem;
      }
      .kdnumberbox{
        flex: 1;
        height: 100%;
        padding-left: .1rem;
        outline: none;
      }
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
    .xjorderelationbox{
      width: 100%;
      height: 1.2rem;
      background-color: #fff;
      margin: -.09rem 0 .1rem;
      display: flex;
      padding: .1rem;
      align-items: center;
      position: relative;
      .wholebox{
        overflow-x: scroll;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        .userbox{
          height: 100%;
          width: .8rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          font-size: .13rem;
          .userava{
            width: .56rem;
            height: .56rem;
            border-radius: .56rem;
          }
          .level{
            width: .76rem;
            height: .2rem;
            line-height: .2rem;
            color: #fff;
            text-align: center;
            border-radius: .1rem;
            margin-top: .05rem;
            background-color: #00A2E9;
          }
        }
        .connectbox{
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: 0 .16rem;
          p{
            display: flex;
            align-items: center;
            justify-content: center;
            margin: .05rem 0;
            img{
              width: .2rem;
              height: .2rem;
              margin: 0 .03rem;
            }
          }
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
      /*height: .49rem;*/
      display: flex;
      align-items: center;
      justify-content: flex-end;
      button{
        margin: .06rem .13rem .06rem 0;
        padding: .09rem .12rem;
        font-size: .13rem;
        border: .01rem solid rgba(220,220,220,1);
        border-radius: .15rem;
        background-color: transparent;
        outline: none;
      }
      .bluecolor{
        border-color:#00A2E9 ;
      }
      .buyagain{
        border-color: #00A2E9;
        color: #00A2E9;
        box-sizing: border-box;
      }
    }
    .fixedbtn{
      width: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      height: .5rem;
      line-height: .5rem;
      color: #fff;
      background-color: #00A2E9;
      text-align: center;
    }
  }
</style>
