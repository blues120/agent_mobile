<template>
  <div class="my-orders">
    <cube-page>
      <div slot="content">
        <cube-tab-bar
          show-slider
          :use-transition="disabled"
          ref="tabNav"
          :data="tabLabels"
          v-model="selectedLabel">
          <cube-tab v-for="(item, index) in tabLabels" :key="index"  :label="item.label" class="tabitem">
            <span slot="icon" v-if="item.account">{{item.account}}</span>
            <!-- 默认插槽 -->
            {{item.label}}
          </cube-tab>
        </cube-tab-bar>
        <div class="tab-slide-container">
          <cube-slide
            ref="slide"
            :data="showOrderArry"
            :loop="loop"
            :initial-index="initialIndex"
            :auto-play="autoPlay"
            :show-dots="showDots"
            :options="slideOptions"
            :refreshResetCurrent="refreshcz"
            @scroll="scroll"
            @change="changePage">
            <!--每个循环的单项-->
            <cube-slide-item v-for="(ordersArry,inde) in showOrderArry" :key="inde">
            <cube-scroll  :options="scrollOptions" :ref="'scroll'+inde" :data="ordersArry.orderArry"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
              <section class="searchbox" v-if="inde==0">
                <div>
                  <img src="~@/assets/images/gopurchase/search.png" alt="" class="searchicon" @click="searchstart">
                  <input v-model="key"  name="" value="" placeholder="蓝莓酵素手工皂">
                </div>
                <p class="functioniconbox" >
                  <img src="~@/assets/images/fncNoAct.png" alt="" v-if="watchMoreFnc" >
                  <img src="~@/assets/images/fncAct.png" alt="" v-else  >
                  <button @click="changeFncStatus"></button>
                </p>
              </section>
              <ul class="orderlist" v-if="(inde==0 && key && clickSearch) ?ordersArry.searchArry!== undefined && ordersArry.searchArry.length>0 : ordersArry.orderArry!== undefined && ordersArry.orderArry.length>0">
                <li  v-for="(orderitem,index) in ( key && clickSearch? ordersArry.searchArry:ordersArry.orderArry)" :key="index">
                  <div class="ordertop">
                    <span  v-if="watchMoreFnc">订单编号：{{orderitem.orderNo}}</span>
                    <span  v-else> 上级：{{orderitem.shipmentAgentName}} （{{orderitem.shipmentAgentMobile}}）</span>
                    <span class="orderstatus">{{orderitem.closed===1 ?  '已关闭':orderitem.orderStatus === 1  ? (orderitem.auditStatus && orderitem.auditStatus <3 ? '凭证已提交':orderitem.auditStatus && orderitem.auditStatus === 3 ? '已付款':'待付款'): (orderitem.orderStatus==2 ? '待发货' : (orderitem.orderStatus==3 ? '待收货' : '已完成' )) }}</span>
                  </div>
                  <p class="order-time"  v-if="!watchMoreFnc">{{orderitem.createTime}}</p>
                  <div class="orderinfobox" >
                    <button @click="goOrderDetail(orderitem.id)"></button>
                    <span class="ordertype">{{orderitem.orderClassStr}}</span>
                    <div class="goodspicarrbox" v-if="!watchMoreFnc">
                      <img  v-for="(list,inx) in orderitem.orderDetailsEntityList" :key="inx" :src="list.picUrl" alt="">
                    </div>
                    <p  v-if="!watchMoreFnc" class="actdiv" style="text-align: right;margin-bottom: 8px">
                      <span style="margin-right: 10px">共{{orderitem.orderDetailsEntityList.length}}款商品</span><span class="redcolor">总计： ¥{{orderitem.orderPrice}}</span>
                    </p>
                    <div class="orderinfodetailbox" v-if="watchMoreFnc"  v-for="(list,inx) in orderitem.orderDetailsEntityList" :key="inx">
                      <img :src="list.picUrl" alt="" class="searchicon">
                      <div>
                        <span>{{list.productName}}</span>
                        <p>
                          <span class="redcolor">¥{{list.retailPrice}}</span>
                          <span class="goodscount">x {{list.number}}</span>
                        </p>
                      </div>
                    </div>
                    <p class="allgoods" v-if="watchMoreFnc">合计：<span class="redcolor">¥{{orderitem.orderPrice}}</span>  (运费:¥{{orderitem.freightPrice}})</p>
                  </div>
                  <p class="orderbot" v-if="orderitem.closed==0">
                    <button class="buyagain" v-if="orderitem.orderStatus==2 && orderitem.revokeId" @click="checkCDDetail(orderitem.id,orderitem.revokeId)">{{orderitem.revokeStatusForAgent==1?'撤单中':orderitem.revokeStatusForAgent==2?'撤单驳回':orderitem.revokeStatusForAgent==3?'撤单关闭':orderitem.revokeStatusForAgent==4?'撤单成功':''}}</button>
                    <button v-if="orderitem.orderStatus==2 && orderitem.withdrawalStatus==0 && !orderitem.revokeId" @click="applyCD(orderitem.id)">申请撤单</button>
                    <button class="buyagain" v-if="(orderitem.orderStatus==1 ||orderitem.orderStatus==2) && orderitem.payAuditId" @click="checkPZ(orderitem.payAuditId)">查看凭证</button>
                    <button  v-if="orderitem.orderStatus==1 && (!orderitem.payAuditId || orderitem.auditStatus>3)" @click="cancleOrder(orderitem.id)">取消订单</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==1 && (!orderitem.payAuditId || orderitem.auditStatus>3)" @click="payRightNow(orderitem.id)">立即支付</button>
                    <button v-if="orderitem.orderStatus==3 || (orderitem.orderStatus==4 && orderitem.orderClass==2)" @click="goCheckWL(orderitem.id)">查看物流</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==3" @click="confirmReceipt(orderitem.id)">确认收货</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==4" @click="bugAgain(orderitem.id,orderitem.orderClass)">再次购买</button>
                  </p>
                  <p class="orderbot" v-else>
                    <button  @click="deleteOrder(orderitem.id)">删除订单</button>
                    <button class="buyagain"  @click="bugAgain(orderitem.id,orderitem.orderClass)">再次购买</button>
                  </p>
                </li>
              </ul>
              <div class="emptybox" v-else>
                    <img src="~@/assets/images/gosettlement/emptyInstead.png" alt="" class="emptpic">
                    <span>没有内容可供显示哦~</span>
              </div>
              <p class="all-done" v-if="!tabLabels[selectInde].hasNexPage">已全部加载</p>
            </cube-scroll>
          </cube-slide-item>
          </cube-slide>
        </div>
        <div v-transfer-dom>
          <confirm v-model="warningObj.showWaring"
                   :title="warningObj.tit"
                   @on-confirm="warningObj.onConfirm">
            <p style="text-align:center;">{{warningObj.body}}</p>
          </confirm>
        </div>
      </div>
    </cube-page>
    <pay-now :payObj="payObj"></pay-now>
    <page-view></page-view>
    <logistics-info :logisticsObj="logisticsObj"></logistics-info>
  </div>
</template>

<script>
import {findIndex} from '@/common/helpers/util'
import {Confirm, TransferDom} from 'vux'
import CubePage from '@/components/CubePage'
import payNow from '@/components/payNow'
import PageView from '@/components/PageView'
import LogisticsInfo from '@/components/LogisticsInfo'
import Qs from 'qs'
export default {
  name: 'myOrders',
  data () {
    return {
      refreshcz: false,
      watchMoreFnc: true, // 当前状态点击是否是查看更多订单详情的状态，默认trues
      selectedLabel: '全部',
      disabled: false,
      clickSearch: false,
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '全部',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: '',
          account: 0
        },
        {
          label: '待付款',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1,
          account: 0
        },
        {
          label: '待发货',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 2,
          account: 0
        },
        {
          label: '待收货',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 3,
          account: 0
        },
        {
          label: '已完成',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 4,
          account: 0
        }
      ],
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
      },
      logisticsObj: {
        show: false,
        info: {}
      },
      scrollOptions: {
        directionLockThreshold: 0,
        pullDownRefresh: {
          threshold: 80,
          stop: 40,
          txt: '刷新成功'
        }, // 下拉刷新
        pullUpLoad: true
      },
      selectInde: 0, // 当前轮播的下标
      limit: 10,
      key: '', // 当前搜索的关键字
      warningObj: {
        showWaring: false, // 默认不展示
        tit: '', // 提示的标题
        body: '', // 提示的文字
        onConfirm: function () {
          console.log('点击了确定')
        }
      },
      orderModeType: '1', // 1：从首页进入。 3：提货订单  4：内购
      showOrderArry: [], // 请求的各个状态的订单列表
      payObj: {
        showWaring: false, // 是否显示离开支付页面默认不显示
        confirmOrder: false, // 是否点击了立即支付
        PayDetailObj: {}, // 支付对象
        inputPasStep: false, // 是否去输入密码
        userPassword: '' // 如果是线下支付，用户输入的登录密码
      }
    }
  },
  components: {
    CubePage,
    Confirm,
    payNow,
    PageView,
    LogisticsInfo
  },
  directives: {
    TransferDom
  },
  watch: {
    'key': {
      handler: function () {
        if (!this.key) {
          this.clickSearch = false
        }
      }
    }
  },
  created () {
    this.selectInde = 0
    if (this.$route.query.orderModeType) {
      this.orderModeType = this.$route.query.orderModeType
    }
    for (var u in this.tabLabels) {
      console.log(u)
      this.showOrderArry.push({})
    }
    this.getAllTypeNum()
    this.getAllorders(this.tabLabels[this.selectInde])
  },
  methods: {
    applyCD (id) { // 跳转到申请撤单页面 动作是填写撤单资料等
      this.$router.push({name: 'applyCancelOrder', query: {id: id, type: 'write'}})
    },
    checkCDDetail (id, revokeId) { // 跳转到申请撤单页面 动作是查看撤单详情
      this.$router.push({name: 'applyCancelOrder', query: {id: id, revokeId: revokeId, type: 'read'}})
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
          this.onPullingDown()
        }
      })
    },
    bugAgain (id, ordertype) { // 再次购买
      localStorage.setItem('cartType', ordertype)
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
    getAllTypeNum () { // 获取各种状态的订单数量
      this.$http.get('orderInfo/getDiffOwnOrderTypeCount').then((res) => {
        if (res) {
          if (res.data.data.all) {
            this.tabLabels[0].account = res.data.data.all || 0
          }
          if (res.data.data.first) {
            this.tabLabels[1].account = res.data.data.first || 0
          }
          if (res.data.data.sec) {
            this.tabLabels[2].account = res.data.data.sec || 0
          }
          if (res.data.data.third) {
            this.tabLabels[3].account = res.data.data.third || 0
          }
          if (res.data.data.four) {
            this.tabLabels[4].account = res.data.data.four || 0
          }
        }
      })
    },
    uniqueObj (array, attr) { // 对象去重方法
      var allArr = [] // 建立新的临时数组
      var idsArr = []
      for (let i = 0; i < array.length; i++) {
        if (idsArr.indexOf(parseInt(array[i][attr])) === -1) {
          idsArr.push(parseInt(array[i][attr]))
          allArr.push(array[i])
        }
      }
      return allArr
    },
    changeFncStatus () {
      this.watchMoreFnc = !this.watchMoreFnc
    },
    goOrderDetail (id) { // 跳转到订单详情页
      this.$router.push({name: 'orderDetail', query: {orderId: id}})
    },
    getAllorders (obj) {
      var that = this
      this.$http.get('orderInfo/getAgentOrderInfoList', {
        params: {
          limit: this.limit,
          page: obj.page,
          orderStatus: obj.status,
          key: this.key,
          orderModeType: this.orderModeType
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          this.tabLabels[this.selectInde].hasNexPage = (res.data.data.totalPage > res.data.data.currPage)
          var currentObj = this.showOrderArry[this.selectInde] ? (obj.page === 1 ? {} : this.showOrderArry[this.selectInde]) : {}
          if (this.key) { // 如果key 存在说明本次显示的结果是搜索结果
            currentObj.searchArry = currentObj.searchArry ? currentObj.searchArry.concat(res.data.data.list) : [].concat(res.data.data.list)
            currentObj.searchArry = this.uniqueObj(currentObj.searchArry, 'id') // 去一下重防止重复请求
            this.showOrderArry[this.selectInde].searchArry = currentObj.searchArry
          } else { // key 不存在说明本次请求结果是订单列表
            currentObj.orderArry = currentObj.orderArry ? currentObj.orderArry.concat(res.data.data.list) : [].concat(res.data.data.list)
            currentObj.orderArry = this.uniqueObj(currentObj.orderArry, 'id') // 去一下重防止重复请求
            this.showOrderArry[this.selectInde].orderArry = currentObj.orderArry
          }
          // console.log('ssdfgh', this.showOrderArry)
          var scrollnow = 'scroll' + this.selectInde
          that.$forceUpdate() // 强制刷新一下页面
          that.$refs.slide.refresh() // 动态添加的轮播强制刷一下
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }, () => {
        console.log('请求失败处理')
      })
    },
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.getAllorders(this.tabLabels[this.selectInde])
      this.getAllTypeNum()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.getAllorders(this.tabLabels[this.selectInde])
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      this.selectInde = current
      if (!this.tabLabels[this.selectInde].xhrFlag) {
        this.getAllorders(this.tabLabels[this.selectInde])
      }
    },
    searchstart () {
      this.showOrderArry[0].searchArry = []
      this.tabLabels[this.selectInde].page = 1
      this.clickSearch = true // 点击过search了
      this.getAllorders(this.tabLabels[this.selectInde])
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
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
    payRightNow (id) {
      this.getPayWay(id)
    },
    getPayWay (orderId) {
      var paras = {
        orderId: orderId
      }
      paras = Qs.stringify(paras)
      this.$http.post('placeOrders/selectPayMethod', paras).then((res) => {
        if (res) {
          this.payObj.PayDetailObj = res.data.data
          this.payObj.orderId = orderId
          this.payObj.choosePayWay = this.payObj.PayDetailObj.payMethod
          this.payObj.confirmOrder = true
          localStorage.setItem('PayDetailObj', JSON.stringify(this.payObj.PayDetailObj))
        }
      }, () => {})
    },
    cancleOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/cancelOrder', param).then((res) => {
        if (res) {
          this.$vux.toast.text('取消成功', 'middle')
          this.onPullingDown()
        }
      })
    },
    deleteOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/deleteOrder', param).then((res) => {
        if (res) {
          this.$vux.toast.text('删除成功', 'middle')
          this.onPullingDown()
        }
      })
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      return index
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
    margin-right: .1rem;
  }
  .my-orders{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 102;
    background-color: #fff;
    padding: 0 .12rem .85rem;
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
    .cube-page{
      top: 0.5rem;
      position: fixed;
      /deep/ .cube-tab-bar{
        background-color: #fff;
        .cube-tab{
          padding: .09rem 0;
        }
        .cube-tab-bar-slider{
          width: 0.4rem !important;
          left: 0.18rem !important;
          height: .03rem;
          background-color: #00a2e9;
        }
        .cube-tab_active{
          color: #00a2e9;
        }
      }
      .tab-slide-container{
        position: fixed;
        top: .82rem;
        left: 0;
        right: 0;
        bottom: 0;
        .cube-slide-item{
          .orderlist{
            width: 100%;
            li{
              width: 100%;
              margin-bottom: .06rem;
              position: relative;
              padding: 0 .1rem;
              background-color: #fff;
              .ordertop{
                width: 100%;
                padding-right: .1rem;
                height:.3rem;
                display: flex;
                align-items: center;
                font-size: .12rem;
                justify-content: space-between;
                .orderstatus{
                  color: #00A2E9
                }
              }
              .order-time{
                font-size: .12rem;
                margin-bottom: .08rem;
                color: #999;
              }
              .orderinfobox{
                clear: both;
                overflow: hidden;
                z-index: 9;
                position: relative;
                button{
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  background-color: transparent;
                  border: none;
                  outline: none;
                  left: 0;
                  z-index: 10;
                }
                border-top: .01rem solid rgba(245,245,245,1);
                .ordertype{
                  padding: .04rem .08rem .04rem;
                  font-size: .14rem;
                  margin: .1rem 0 .05rem;
                  border-radius: .15rem;
                  background-color: #f5f5f5;
                  display: inline-block;
                }
                .goodspicarrbox{
                  width: 100%;
                  display: flex;
                  align-items: center;
                  overflow-x: scroll;
                  height: .85rem;
                  margin-bottom: .15rem;
                  img{
                    width:.75rem ;
                    height: .75rem;
                    margin: .03rem;
                  }
                }
                .orderinfodetailbox{
                  display: flex;
                  align-items: center;
                  height: 1rem;
                  div{
                    flex: 1;
                    padding:.05rem 0 ;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    p{
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      .goodscount{
                        margin-right: .2rem;
                      }
                    }
                  }
                  .actdiv{
                    width: 100%;
                    height: 100%;
                    padding: .15rem;
                    justify-content: flex-end;
                    display: flex;
                    align-items: flex-end;
                  }
                  img{
                    width: 1rem ;
                    height: 1rem;
                    margin:0 .1rem ;
                  }
                }
                .allgoods{
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                  padding: .1rem .2rem;
                  border-bottom: .01rem solid rgba(245,245,245,1);
                }
              }
              .orderbot{
                width: 100%;
                display: flex;
                padding-right: .2rem;
                justify-content: flex-end;
                height: .5rem ;
                align-items: center;
                button{
                  padding: .1rem .12rem;
                  border:.01rem solid rgba(245,245,245,1);
                  border-radius: .3rem;
                  margin: .06rem  0;
                  margin-left: .15rem;
                  background-color: transparent;outline: none;
                }
                .buyagain{
                  border-color: #00A2E9;
                  color: #00A2E9;
                  box-sizing: border-box;
                }
              }
            }
          }
          .all-done{
            line-height: .3rem;
            text-align: center;
          }
        }
      }
    }
    .shopcardiv{
      width:.5rem ;
      height: .5rem;
      border-radius: 100%;
      background-color: #00A2E9;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      right: .4rem;
      bottom: .4rem;
      z-index:999;
      overflow: visible;
      img{
        width: 50%;
        height: 50%;
      }
      p{
        position: absolute;
        top:0.05rem;
        right:-0.03rem;
        border-radius: 100%;
        background-color: #FF0000;
        color: #fff;
        width:0.22rem;
        height:0.22rem;
        line-height:0.22rem;
        font-size: 0.1rem;
        text-align: center;
      }
    }
    .emptybox{
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
      font-size: .16rem;
      img{
        width: 2rem;
        height: 1.5rem;
        margin: 1.2rem auto .4rem;
      }
    }
    .tabitem{
      position: relative;
      span{
        position: absolute;
        top: 0.02rem;
        right:.06rem;
        background-color: #FF0000;
        color: #fff;
        padding: .02rem .05rem;
        font-size: .12rem;
        border-radius: .08rem;
      }
    }
  }
</style>
