<template>
  <div class="go-purchase">
    <cube-scroll ref="scroll" :options="scrollOptions"  :data="goodsListArry"  @pulling-down="onPullingDown" @pulling-up="onPullingUp" >
      <ul class="tab-swiper vux-center">
        <li v-for="(item,index) in goodsListArry" :key="index">
          <div class="goodsItembox">
            <div class="top">
              <img :src="type==1?item.picUrl:item.imgUrl" class="goodpic">
              <div class="mid">
                <span class="goodsnick">{{type==1?item.productName:item.name}}</span>
                <span class="greycolor">{{type==1?'云':'总部'}}库存: <span class="redcolor">{{type==1?item.productCount:item.number}}</span></span>
                <p class="redcolor" @click="showTips" v-if="type==2">换货说明</p>
              </div>
              <div class="rig">
                <x-number v-model="item.startAccount" @on-change="change(item.id,$event)" :min="0" :max="type==1?item.productCount:item.number" fillable width="40px"></x-number>
              </div>
            </div>
            <div class="bot" v-if="type==2"></div>
          </div>
        </li>
      </ul>
      <emptybox v-if="goodsListArry.length==0"></emptybox>
      <p class="all-done" v-if="!hasNexPage">已全部加载</p>
    </cube-scroll>
    <div class="fixbotbox" v-if="type==1" @click="goTH">
      <span class="total">合计： <span class="redcolor">{{totalCount}} 件</span></span>
      <p>
        <img src="~@/assets/images/gopurchase/shopcar.png" alt="">
        <span>下单提货 ({{totalCount}})</span>
      </p>
    </div>
    <div class="thrightnow" v-else @click="goChangeNow">提交换货申请</div>
    <div v-transfer-dom>
      <confirm v-model="warningObj.showWaring"
               :title="warningObj.tit"
               :show-cancel-button="warningObj.showCancel"
               @on-confirm="warningObj.onConfirm">
        <p style="text-align:center;">{{warningObj.body}}</p>
      </confirm>
    </div>
    <page-view></page-view>
    <pay-now :payObj="payObj" @confirmPay="confirmPay"></pay-now>
  </div>
</template>

<script>
import payNow from '@/components/payNow'
import emptybox from '@/components/emptybox'
import PageView from '@/components/PageView'
import {XNumber, Confirm, TransferDom} from 'vux'
import Qs from 'qs'
export default {
  created () {
    if (this.$route.query.id) {
      this.changeid = this.$route.query.id
    }
    if (this.$route.query.type) {
      this.type = this.$route.query.type
      this.getgoodsList()
    }
  },
  data () {
    return {
      warningObj: {
        showWaring: false, // 默认不展示
        tit: '', // 提示的标题
        body: '', // 提示的文字
        showCancel: false, // 是否显示取消按钮
        onConfirm: function () {
          console.log('点击了确定')
        }
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
      page: 1,
      limit: 10,
      hasNexPage: true,
      goodsListArry: [],
      changeid: '', // 如果是换货的话会传进来一个换货的id
      CanInput: true, // 可以输入或者改变换货的数量
      payObj: {
        free: false, // 需要支付的金额是0
        showWaring: false, // 是否显示离开支付页面默认不显示
        confirmOrder: false, // 是否点击了立即支付
        PayDetailObj: {}, // 支付对象
        inputPasStep: false, // 是否去输入密码
        userPassword: '' // 如果是线下支付，用户输入的登录密码
      },
      totalCount: 0, // 如果是立即提货，totalCount是提货的总件数
      type: '1' // 1: 立即提货  2; 进来换货的
    }
  },
  methods: {
    showTips (id) { // 换货说明
      this.warningObj = {
        showCancel: false, // 是否显示取消按钮
        showWaring: true, // 默认不展示
        tit: '换货说明', // 提示的标题
        body: '换货时基于当前的代理价格，不足部分直接付款给公司。', // 提示的文字
        onConfirm: function () {}
      }
    },
    applyHHTips (details, spreadPrice, exchangeId) { // 申请换货的提示 exchangeId 如果需要补差价，传入的 exchangeId
      var that = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '换货提示', // 提示的标题
        showCancel: true, // 是否显示取消按钮
        body: details, // 提示的文字
        onConfirm: function () {
          if (spreadPrice === 0) { // 免费的不需要调selectmethod 方法,请求选择支付方式
            that.payObj = {
              free: true, // 需要支付的金额是0
              exchangeId: exchangeId,
              CloudGoodschange: 1, // 云库存付款类别 1 是换货支付  2 是 提货支付
              showWaring: false, // 是否显示离开支付页面默认不显示
              confirmOrder: true, // 是否点击了立即支付
              PayDetailObj: {}, // 支付对象
              inputPasStep: false, // 是否去输入密码
              userPassword: '' // 如果是线下支付，用户输入的登录密码
            }
          } else { //  需要补差价的，需要请求选择支付方式
            that.getPayWay(exchangeId)
            // that.payObj = {
            //   CloudGoodschange: 1, // 云库存付款类别 1 是换货支付  2 是 提货支付
            //   showWaring: false, // 是否显示离开支付页面默认不显示
            //   confirmOrder: true, // 是否点击了立即支付
            //   PayDetailObj: {}, // 支付对象
            //   inputPasStep: false, // 是否去输入密码
            //   exchangeId: exchangeId,
            //   userPassword: '' // 如果是线下支付，用户输入的登录密码
            // }
          }
        }
      }
    },
    getPayWay (exchangeId) {
      var paras = {
        exchangeId: exchangeId
      }
      paras = Qs.stringify(paras)
      this.$http.post('myInventory/selectPayMethod', paras).then((res) => {
        if (res) {
          this.payObj.PayDetailObj = res.data.data
          this.payObj.free = false
          this.payObj.exchangeId = exchangeId // exchangeId 如果需要补差价，传入的 exchangeId
          this.payObj.CloudGoodschange = 1 // 云库存付款类别 1 是换货支付  2 是 提货支付
          this.payObj.choosePayWay = this.payObj.PayDetailObj.payMethod
          this.payObj.confirmOrder = true
          localStorage.setItem('PayDetailObj', JSON.stringify(this.payObj.PayDetailObj))
        }
      }, () => {})
    },
    confirmPay () { // 付款操作完成~
      var payType = ''
      if (this.payObj.free) {
        payType = 1 // 免费的金额就是1 其他情况和实际一致
      } else {
        payType = this.payObj.PayDetailObj.payMethod
      }
      var params = {
        exchangeId: this.payObj.exchangeId,
        payType: payType,
        payStatus: 1,
        status: 2 // 0:待审核，1:打款凭证，2:通过，3:拒绝，
      }
      params = Qs.stringify(params)
      this.$http.post('cloudWarehouseExchange', params).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功!', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    goTH () { // 立即提货
      if (this.totalCount === 0) {
        this.$vux.toast.text('请先选择商品~', 'middle')
        return
      }
      var params = []
      var templeCarList = []
      var goodsListArry = this.goodsListArry
      for (var n in goodsListArry) {
        if (goodsListArry[n].startAccount) {
          var objEach = {
            productId: goodsListArry[n].productId,
            sizeId: goodsListArry[n].sizeId,
            productName: goodsListArry[n].productName,
            sizeName: goodsListArry[n].sizeName,
            picUrl: goodsListArry[n].picUrl,
            sizePicUrl: goodsListArry[n].sizePicUrl,
            productCount: goodsListArry[n].productCount,
            pickUpQuantity: goodsListArry[n].startAccount
          }
          params.push(objEach)
        }
      }
      this.$http.post('myInventory/orderDelivery', params).then((res) => {
        if (res) {
          templeCarList = res.data.data
          window.localStorage.setItem('templeCarList', JSON.stringify(templeCarList)) // 将选中的商品暂时放入缓存中，确认订单后或者下次进入本页面清除缓存
          this.$router.push({name: 'yckSettlement'})
        }
      })
    },
    getgoodsList () {
      if (this.type === 1) { // 进来提货的，请求云库存列表就行
        this.getgoodsListXhr()
      } else { // 进来换货的，请求换货列表
        this.getcloudHHXhr()
      }
    },
    getgoodsListXhr () {
      var that = this
      this.$http.get('myInventory/getCloudOrPhysicalInventoryDetail', {
        params: {
          page: this.page,
          limit: this.limit,
          cartType: 1
        }
      }).then((res) => {
        if (res) {
          var goodsListArry = this.goodsListArry ? this.page === 1 ? [] : this.goodsListArry : []
          this.hasNexPage = ((res.data.data.totalPage > res.data.data.currPage))
          goodsListArry = goodsListArry.concat(res.data.data.list)
          goodsListArry = this.uniqueObj(goodsListArry, 'productId') // 去一下重防止重复请求
          goodsListArry.forEach((t) => {
            t.startAccount = 0
          })
          this.goodsListArry = goodsListArry
          setTimeout(() => {
            that.$refs['scroll'].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }, () => {})
    },
    getcloudHHXhr () {
      var that = this
      this.$http.get('cloudWarehouseExchangeList', {
        params: {
          id: this.changeid
        }
      }).then((res) => {
        if (res) {
          // 本接口没有分页
          var goodsListArry = res.data.data.list
          goodsListArry.forEach((t) => {
            t.startAccount = 0
          })
          this.hasNexPage = false
          this.goodsListArry = goodsListArry
          setTimeout(() => {
            that.$refs['scroll'].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
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
    onPullingDown () {
      this.page = 1
      this.getgoodsList()
    },
    onPullingUp () {
      if (this.hasNexPage) {
        this.page++
        this.getgoodsList()
      } else {
        this.$refs['scroll'].forceUpdate()
      }
    },
    goChangeNow () {
      if (this.CanInput) { // 没有选择想要交换的货物
        this.$vux.toast.text('请选择置换的商品~', 'middle')
        return
      }
      var productId = ''
      var changeNum = ''
      var productSizeId = ''
      var goodsListArry = this.goodsListArry
      for (var n in goodsListArry) {
        if (!goodsListArry[n].readonly) {
          productId = goodsListArry[n].productId
          productSizeId = goodsListArry[n].sizeId
          changeNum = goodsListArry[n].startAccount
        }
      }
      var params = {
        id: this.changeid,
        productId: productId,
        productSizeId: productSizeId,
        changeNum: changeNum
      }
      params = Qs.stringify(params)
      this.$http.post('cloudWarehouseApplyExchange', params).then((res) => {
        if (res) {
          this.applyHHTips(res.data.data.details, res.data.data.spreadPrice, res.data.data.exchangeId)
        }
      })
    },
    change (id, val) {
      var goodsListArry = this.goodsListArry
      if (this.type === 2) { // 如果是换货
        if (!this.CanInput) { // 不可以输入(已经有商品的换货数量大于0了)
          for (var i in goodsListArry) {
            if (goodsListArry[i].id === id) {
              if (goodsListArry[i].readonly) {
                goodsListArry[i].startAccount = 0
                this.$vux.toast.text('当前换货模式下只能交换一种商品', 'middle')
              }
            }
          }
        } else {
          for (var m in goodsListArry) {
            // 一个input输入大于0的数量后，其他所有的input不可以再次输入
            goodsListArry[m].readonly = true
            if (goodsListArry[m].id === id) {
              goodsListArry[m].readonly = false
            }
          }
        }
        this.CanInput = goodsListArry.every((t) => { // 是否可以输入，不可以输入则弹出提示
          return t.startAccount === 0
        })
        this.goodsListArry = goodsListArry
      } else if (this.type === 1) { // 如果是立即提货
        var totalCount = 0
        for (var j in goodsListArry) {
          totalCount += goodsListArry[j].startAccount
        }
        this.totalCount = totalCount
      }
    }
  },
  directives: {
    TransferDom
  },
  components: {
    emptybox,
    PageView,
    Confirm,
    payNow,
    XNumber
  }
}
</script>

<style lang="less" scoped>
.go-purchase{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: #f5f6f7;
  padding: 0.46rem  0 .5rem;
  .goodsItembox{
    width: 100%;
    margin-top: .1rem;
    font-size: .14rem;
    color: #333;
    background-color: #fff;
    .top{
      width: 100%;
      padding: 0 .12rem;

      height: 1.2rem;
      display: flex;
      align-items: flex-end;
      border-bottom: .01rem solid #f5f5f5;
      .goodpic{
        width: 1rem;
        height: 1rem;
        margin: 0 .06rem .1rem 0;
      }
      .rig{
        width: 1rem;
        height: .3rem;
        margin-bottom: .15rem;
        /deep/.weui-cell{
          padding: 0;
          width: 100%;
          height: 100%;
        }
        /deep/.vux-cell-primary div{
          display: flex;
          width: 100%;
          height: 100%;
        }
        /deep/.vux-number-selector{
          width: .3rem;
          height: .3rem;
          box-sizing: border-box;
          padding: 0;
          background-color: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        /deep/.vux-number-disabled{
          background-color: #C9C9C9;
        }
        /deep/.vux-number-selector-sub{
          border-top-left-radius: .3rem;
          border-bottom-left-radius: .3rem;
        }
        /deep/.vux-number-selector-plus{
          border-top-right-radius: .3rem;
          border-bottom-right-radius: .3rem;
        }
        /deep/.vux-number-input{
          height: .3rem;
          box-sizing: border-box;
          background-color: #C9C9C9;
          color: #000;
          font-size: .15rem;
          border-right: 0;
          border-left: 0;
          outline: none;
        }
        /deep/.vux-number-selector svg{
          fill: #999;
        }
      }
      .mid{
        flex: 1;
        height: 100%;
        display: flex;
        margin-right: .05rem;
        flex-direction: column;
        justify-content: center;
        .goodsnick{
          width: 100%;
          max-width: 1.4rem;
          white-space: nowrap;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .greycolor{
          color: #999;
          margin: .15rem 0;
        }
      }
    }
    .bot{
      width: 100%;
      height: .22rem;
    }
  }
  .thrightnow,.fixbotbox{
    width: 100%;
    height:.49rem ;
    background-color: #00A2E9;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 200;
    font-size: .16rem;
    text-align: center;
    line-height: .49rem;
    color: #fff;
  }
  .redcolor{
    color: #FF0000;
  }
  .fixbotbox{
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: .16rem;
    .total{
      flex: 1;
      color: #333;
      text-align: left;
      padding-left: .12rem;
    }
    p{
      width: 1.42rem;
      background-color: #00A2E9;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img{
        width: .17rem;
        height: .17rem;
        margin-right: .08rem;
      }
    }
  }
}
</style>
