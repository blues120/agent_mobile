<template>
  <div class="other-orders">
    <section class="searchbox">
      <div>
        <img src="~@/assets/images/gopurchase/search.png" alt="" class="searchicon" @click="searchstart">
        <input v-model.trim="key"  placeholder="订单号/姓名/电话/商品名称">
      </div>
      <p class="functioniconbox" >
        <img src="~@/assets/images/fncNoAct.png" alt="" v-if="watchMoreFnc" >
        <img src="~@/assets/images/fncAct.png" alt="" v-else  >
        <button @click="changeFncStatus"></button>
      </p>
    </section>
    <cube-page>
      <div slot="content">
        <cube-tab-bar
          :show-slider="true"
          :use-transition="disabled"
          ref="tabNav"
          :data="tabLabels"
          v-model="selectedLabel" v-show="orderStatus==1 || orderStatus==2">
          <cube-tab v-for="(item, index) in tabLabels" :key="index"  :label="item.label" class="tabitem">
            <span slot="icon" v-if="item.account">{{item.account}}</span>
            <!-- 默认插槽 -->
            {{item.label}}
          </cube-tab>
        </cube-tab-bar>
        <div class="tab-slide-container" :class="orderStatus==1 || orderStatus==2?'hasNavTit':''">
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
              <ul class="orderlist" v-if="(key && clickSearch) ?ordersArry.searchArry!== undefined && ordersArry.searchArry.length>0 : ordersArry.orderArry!== undefined && ordersArry.orderArry.length>0">
                <li  v-for="(orderitem,index) in ( key && clickSearch? ordersArry.searchArry:ordersArry.orderArry)" :key="index">
                  <div class="ordertop">
                    <span  v-if="watchMoreFnc">订单编号：{{orderitem.orderNo}}</span>
                    <span  v-else> 下级：{{orderitem.agentName}} （{{orderitem.agentMobile}}）</span>
                    <span class="orderstatus" v-if="orderitem.tabStatusString">{{orderitem.tabStatusString}}</span>
                    <span class="orderstatus" v-else>{{orderitem.orderStatus==1 ? (orderitem.closedStr === '未关闭' ? '待付款': '已关闭' ) : (orderitem.orderStatus==2 ? '待发货' : (orderitem.orderStatus==3 ? '待收货' : '已完成' )) }}</span>
                  </div>
                  <p class="order-time"  v-if="!watchMoreFnc">{{orderitem.createTime}}</p>
                  <div class="orderinfobox" >
                    <button @click="goOrderDetail(orderitem.orderId,orderitem.beDelivered)"></button>
                    <span class="ordertype">{{orderitem.orderClassStr}}</span> <span class="ordertype" v-if="orderitem.orderType!=3">{{orderitem.orderTypeStr}}</span><span class="ordertype" v-if="orderitem.orderRevokeStr">{{orderitem.orderRevokeStr}}</span>
                    <div class="goodspicarrbox" v-if="!watchMoreFnc">
                      <img  v-for="(list,inx) in orderitem.lists" :key="inx" :src="list.picUrl" alt="">
                    </div>
                    <p  v-if="!watchMoreFnc" class="actdiv" style="text-align: right;margin-bottom: 8px">
                      <span style="margin-right: 10px">共{{orderitem.lists.length}}款商品</span><span class="redcolor">总计： ¥{{orderitem.orderPrice}}</span>
                    </p>
                    <div class="orderinfodetailbox" v-if="watchMoreFnc" >
                      <img :src="orderitem.avatarPicUrl" alt="" class="xiajiusericon">
                      <div class="xiajiuserinfo">
                        <p>
                          <span>{{orderitem.agentName}}</span>
                          <span class="xiajiflag">下级订单</span>
                        </p>
                        <span>{{orderitem.createTime}}</span>
                      </div>
                      <div class="goodscount"><span>共 <span class="redcolor">{{orderitem.lists.length}}</span> 款商品 ></span></div>
                    </div>
                    <div class="goodslist"  v-if="watchMoreFnc"  v-for="(list,inx) in orderitem.lists" :key="inx">
                      <span class="decobox"><span class="goodsnamedecora"></span>{{list.productName}}</span>
                      <span>¥{{list.retailPrice}}  <span style="margin-left: 10px">X {{list.number}}</span></span>
                    </div>
                    <p class="allgoods" v-if="watchMoreFnc">合计：<span class="redcolor">¥{{orderitem.orderPrice}}</span>  (运费:¥{{orderitem.freightPrice}})</p>
                  </div>
                  <p class="orderbot">
                    <button v-if="orderitem.orderStatus==1&&!orderitem.auditId &&orderitem.payMethod==4"  @click="orderhasPay(orderitem.orderId)">已付款</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==1&&orderitem.auditId" @click="checkPZ(orderitem.auditId)">打款审核</button>
                    <button  v-if="orderitem.orderStatus==2&&orderitem.beDelivered ==1" @click="goLeaderSend">转上级发货</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==2&&orderitem.beDelivered ==1" @click="postMySelf(orderitem.orderId)">自己发货</button>
                    <button class="buyagain" v-if="orderitem.orderStatus==2&&orderitem.beDelivered ==2&&orderitem.revokeId"  @click="checkCDPZ(orderitem.revokeId)">撤单审核</button>
                    <button  v-if="orderitem.orderStatus==3" @click="goCheckWL(orderitem.orderId)">查看物流</button>
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
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
    <self-delivery :deliveryObj="deliveryObj" @deliverySuccess="deliverySuccess"></self-delivery>
    <logistics-info :logisticsObj="logisticsObj"></logistics-info>
  </div>
</template>

<script>
import {findIndex} from '@/common/helpers/util'
import {Confirm, TransferDom, Actionsheet} from 'vux'
import CubePage from '@/components/CubePage'
import payNow from '@/components/payNow'
import PageView from '@/components/PageView'
import inputPass from '@/components/inputPass'
import selfDelivery from '@/components/selfDelivery'
import LogisticsInfo from '@/components/LogisticsInfo'
import Qs from 'qs'
export default {
  name: 'otherOrders',
  data () {
    return {
      refreshcz: false,
      watchMoreFnc: true, // 当前状态点击是否是查看更多订单详情的状态，默认trues
      selectedLabel: '全部',
      disabled: false,
      clickSearch: false,
      xhrflag: false,
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '全部',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          account: 0
        }
      ],
      loop: false,
      autoPlay: false,
      showDots: false,
      slideOptions: {
        listenScroll: true,
        probeType: 3
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
      orderStatus: '', // 订单状态 1：待付款 2：代发货 3：待收货 4：已完成 ，全部信息 为空串""
      showOrderArry: [], // 请求的各个状态的订单列表
      payObj: {
        showWaring: false, // 是否显示离开支付页面默认不显示
        confirmOrder: false, // 是否点击了立即支付
        PayDetailObj: {}, // 支付对象
        inputPasStep: false, // 是否去输入密码
        userPassword: '' // 如果是线下支付，用户输入的登录密码
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
      logisticsObj: {
        show: false,
        info: {}
      }
    }
  },
  components: {
    CubePage,
    Confirm,
    payNow,
    PageView,
    inputPass,
    Actionsheet,
    selfDelivery,
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
    if (this.$route.query.orderStatus) {
      this.orderStatus = this.$route.query.orderStatus
    }
    if (this.$route.query.orderStatus === 1) {
      this.tabLabels = [
        {
          label: '待我审核',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          forMeToReview: '2',
          account: 0
        },
        {
          label: '等待付款',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          forMeToReview: '',
          account: 0
        }
      ]
      this.selectedLabel = '待我审核'
    }
    if (this.$route.query.orderStatus === 2) {
      this.tabLabels = [
        {
          label: '待我发货',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          beDelivered: '1',
          account: 0
        },
        {
          label: '待我审核',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          beDelivered: '2',
          account: 0
        },
        {
          label: '已转采购',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          beDelivered: '3',
          account: 0
        },
        {
          label: '已云代发',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          beDelivered: '4',
          account: 0
        }
      ]
      this.selectedLabel = '待我发货'
    }
    for (var u in this.tabLabels) {
      console.log(u)
      this.showOrderArry.push({})
    }
    if (this.orderStatus === 1 || this.orderStatus === 2) {
      this.getAllTypeNum()
    }
    this.getAllorders(this.tabLabels[this.selectInde])
  },
  methods: {
    goCheckWL (id) {
      this.$http.get('order/express/' + id).then((res) => {
        if (res) {
          this.logisticsObj.show = true
          this.logisticsObj.info = res.data.expressList[0]
        }
      })
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
    deliverySuccess () {
      this.onPullingDown()
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
    goOrderDetail (id, beDelivered) { // 跳转到下级进货的订单详情页。看详情
      this.$router.push({name: 'xjOrderDetail', query: {orderId: id, type: 'watch', beDelivered: beDelivered}})
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
    getAllTypeNum () { // 获取各种状态的订单数量
      this.$http.get('subPur/subDiffTypeOrderCount', {
        params: {
          type: this.orderStatus
        }
      }).then((res) => {
        if (res) {
          if (res.data.data.paymentCount) {
            this.tabLabels[1].account = res.data.data.paymentCount
          }
          if (res.data.data.reviewCount) {
            this.tabLabels[0].account = res.data.data.reviewCount
          }
          if (res.data.data.first) {
            this.tabLabels[0].account = res.data.data.first
          }
          if (res.data.data.sec) {
            this.tabLabels[1].account = res.data.data.sec
          }
          if (res.data.data.third) {
            this.tabLabels[2].account = res.data.data.third
          }
          if (res.data.data.four) {
            this.tabLabels[3].account = res.data.data.four
          }
        }
      })
    },
    getAllorders (obj) {
      var that = this
      this.$http.get('subPur/getSubordinatePurchaseList', {
        params: {
          orderStatus: this.orderStatus,
          limit: this.limit,
          page: obj.page,
          forMeToReview: obj.forMeToReview || '',
          key: this.key,
          beDelivered: obj.beDelivered || ''
        }
      }).then((res) => {
        this.tabLabels[this.selectInde].xhrFlag = true
        this.tabLabels[this.selectInde].hasNexPage = (res.data.data.totalPage > res.data.data.currPage)
        var currentObj = this.showOrderArry[this.selectInde] ? (obj.page === 1 ? {} : this.showOrderArry[this.selectInde]) : {}
        if (this.key) { // 如果key 存在说明本次显示的结果是搜索结果
          currentObj.searchArry = currentObj.searchArry ? currentObj.searchArry.concat(res.data.data.list) : [].concat(res.data.data.list)
          currentObj.searchArry = this.uniqueObj(currentObj.searchArry, 'orderId') // 去一下重防止重复请求
          this.showOrderArry[this.selectInde].searchArry = currentObj.searchArry
        } else { // key 不存在说明本次请求结果是订单列表
          currentObj.orderArry = currentObj.orderArry ? currentObj.orderArry.concat(res.data.data.list) : [].concat(res.data.data.list)
          currentObj.orderArry = this.uniqueObj(currentObj.orderArry, 'orderId') // 去一下重防止重复请求
          this.showOrderArry[this.selectInde].orderArry = currentObj.orderArry
        }
        console.log('this.showOrderArry', this.showOrderArry)
        var scrollnow = 'scroll' + this.selectInde
        that.$forceUpdate() // 强制刷新一下页面
        that.$refs.slide.refresh() // 动态添加的轮播强制刷一下
        setTimeout(() => {
          that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
        }, 600)
      }, () => {
        console.log('请求失败处理')
      })
    },
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.getAllorders(this.tabLabels[this.selectInde])
      if (this.orderStatus === 1 || this.orderStatus === 2) {
        this.getAllTypeNum()
      }
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
      console.log('current', current)
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
      // console.log('pos', pos)
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
    cancleOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/cancelOrder', param).then((res) => {
        var showOrderArry = this.showOrderArry
        for (var i in showOrderArry) {
          for (var j in showOrderArry[i].orderArry) {
            if (showOrderArry[i].orderArry[j].id === id) {
              showOrderArry[i].orderArry.splice(j, 1)
            }
          }
        }
        this.$vux.toast.text('取消成功', 'middle')
        this.showOrderArry = showOrderArry
      })
    },
    deleteOrderXhr (id) {
      var param = {
        orderId: id
      }
      param = Qs.stringify(param)
      this.$http.delete('orderInfo/deleteOrder', param).then((res) => {
        var showOrderArry = this.showOrderArry
        for (var i in showOrderArry) {
          for (var j in showOrderArry[i].orderArry) {
            if (showOrderArry[i].orderArry[j].id === id) {
              showOrderArry[i].orderArry.splice(j, 1)
            }
          }
        }
        this.$vux.toast.text('删除成功', 'middle')
        this.showOrderArry = showOrderArry
      })
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      if (this.orderStatus === 1 || this.orderStatus === 2) {
        index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      }
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
  .other-orders{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 102;
    background-color: #fff;
    padding: 0.46rem 0 .85rem;
    .searchbox{
      display: flex;
      align-items: center;
      background-color: #f0eff4;
      width: 100%;
      z-index: 110;
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
      top: .96rem;
      position: fixed;
      /deep/ .cube-tab-bar{
        background-color: #fff;
        .cube-tab{
          padding: .09rem 0;
        }
        .cube-tab-bar-slider{
          background-color: #00a2e9;
        }
        .cube-tab_active{
          color: #00a2e9;
        }
      }
      .tab-slide-container{
        position: absolute;
        top: 0;
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
                  .xiajiusericon{
                    width: .8rem;
                    height: .8rem;
                    margin-right: .1rem;
                    border-radius: .8rem;
                  }
                  .xiajiuserinfo{
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    p{
                      display: flex;
                      justify-content: flex-start;
                      .xiajiflag{
                        margin-left: .1rem;
                        padding: .05rem .06rem;
                        border-radius: .1rem;
                        font-size: .12rem;
                        background-color:#5dbcfc ;
                        color: #fff;
                      }
                    }
                  }
                  .goodscount{
                    display: flex;
                    align-items: center;
                    .redcolor{
                      margin: 0;
                    }
                  }
                }
                .goodslist{
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  margin: .1rem 0;
                  .decobox{
                    display: flex;
                    align-items: center;
                    .goodsnamedecora{
                      display: inline-block;
                      width:.1rem;
                      height:.1rem;
                      background-color: #00A2E9;
                      transform: rotate(45deg);
                      margin: .06rem;
                    }
                  }

                }
                .allgoods{
                  width: 100%;
                  display: flex;
                  justify-content: flex-end;
                  padding: .1rem .2rem;
                  border-top: .01rem solid rgba(245,245,245,1);
                  border-bottom: .01rem solid rgba(245,245,245,1);
                }
              }
              .orderbot{
                width: 100%;
                display: flex;
                padding-right: .1rem;
                justify-content: flex-end;
                /*height: .5rem ;*/
                align-items: center;
                button{
                  padding: .1rem .12rem;
                  border:.01rem solid rgba(245,245,245,1);
                  border-radius: .3rem;
                  margin: .06rem  0;
                  background-color: transparent;outline: none;
                }
                .buyagain{
                  border-color: #00A2E9;
                  color: #00A2E9;
                  box-sizing: border-box;
                  margin-left: .15rem;
                }
              }
            }
            li:last-child{
              margin-bottom: .25rem;
            }
          }
          .all-done{
            line-height: .3rem;
            text-align: center;
          }
        }
      }
      .hasNavTit{
        top: .33rem;
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
