<template>
  <div class="go-purchase">
      <!--<section class="searchbox" >-->
          <!--<img src="~@/assets/images/gopurchase/search.png" alt="" class="searchicon">-->
          <!--<input v-model="searchgoods"  name="" value="" placeholder="蓝莓酵素手工皂">-->
      <!--</section>-->
      <cube-page>
        <div slot="content">
          <cube-tab-bar
            show-slider
            :use-transition="disabled"
            ref="tabNav"
            :data="tabLabels"
            @click="clickHandler"
            v-model="selectedLabel"  v-show="!isDefault"></cube-tab-bar>
          <div class="tab-slide-container" :class="isDefault?'upcontainer':''">
            <cube-slide
              ref="slide"
              :loop="loop"
              :data="AllGoodsListArry"
              :initial-index="initialIndex"
              :auto-play="autoPlay"
              :show-dots="showDots"
              :options="slideOptions"
              :refreshResetCurrent="refreshcz"
              @scroll="scroll"
              @change="changePage">
              <!--每个循环的单项-->
              <cube-slide-item  v-for="(goodsListArry,inde) in AllGoodsListArry" :key="inde">
                <cube-scroll :ref="'scroll'+inde" :options="scrollOptions"  :data="goodsListArry"  @pulling-down="onPullingDown" @pulling-up="onPullingUp" >
                  <ul class="list-wrapper" v-if="goodsListArry.length>0">
                    <li class="goodslistitem" v-for="goodslist in goodsListArry" :key="goodslist.id">
                      <p class="cloudFlag" v-if="cartType==1"></p>
                      <span class="cloudFlagspan" v-if="cartType==1">云库存</span>
                      <button class="libtn"  @click="goDetail(goodslist.id)"></button>
                      <img :src="goodslist.primaryPicFilePath" alt="" class="goodsicon" style="background-color: transparent">
                      <p>{{goodslist.productName}}</p>
                      <div class="botdiv">
                        <p><span class="price">¥{{goodslist.retailPrice}}</span><span>库存：{{goodslist.stockAmount}}</span></p>
                        <img src="~@/assets/images/gopurchase/add.png" alt="" class="addgoods" @click="addgoodsnum(goodslist)" :data-goodsid="goodslist.id">
                      </div>
                    </li>
                  </ul>
                  <emptybox v-if="goodsListArry.length==0"></emptybox>
                  <p class="all-done" v-if="!tabLabels[inde].hasNexPage">已全部加载</p>
                </cube-scroll>
              </cube-slide-item>
            </cube-slide>
          </div>
        </div>
      </cube-page>
      <section class="shopcardiv" @click="goSettlement">
        <img src="~@/assets/images/gopurchase/shopcar.png" alt="" class="shopcar">
        <p v-show="productObj.count">{{productObj.count}}</p>
      </section>
      <choose-size ref="choseSize" :productObj="productObj" v-if="productObj" v-on:goJoinCar="addCart" @ee="cc" @changeListInCarNum="changeListInCarNum"></choose-size>
    <page-view></page-view>
  </div>
</template>

<script>
import PageView from '@/components/PageView'
import { XHeader } from 'vux'
import Qs from 'qs'
import { findIndex } from '@/common/helpers/util'
import CubePage from '@/components/CubePage'
import emptybox from '@/components/emptybox'
import ChooseSize from '@/components/chooseSize'
var timer = ''
export default {
  name: 'Gopurchase',
  data () {
    return {
      isDefault: false, // 是否是默认组合
      searchgoods: '',
      selectedLabel: '', // 选中的产品类别的名字
      selectInde: '', // 当前状态选中的产品类别的下标
      cartType: 2, // 1:云购物车 2：实体购物车. 默认实体购物车
      disabled: false,
      tabLabels: [],
      loop: false,
      autoPlay: false,
      refreshcz: false,
      stopPropagation: true,
      showDots: false,
      slideOptions: {
        listenScroll: true,
        probeType: 3,
        directionLockThreshold: 0
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
      AllGoodsListArry: [],
      limit: 10, // 默认请求单页的商品数量默认10
      upgradePurchase: false, // 是否为升级补货，true表示升级补货，其他入口进入的默认为false，升级为2 (入口一共是：首次进入，升级补货，一般入口（我要进货，云库存属于一般入口）)
      upgradeLevelId: '', // 代理要升级的的等级id，可以为空，当为升级订单时，该值不可为空(比如说想要2升级3，此处id 就写3)
      productObj: {
        count: 0,
        toChooseSize: false
      },
      firstPurchase: false
    }
  },
  components: {
    CubePage,
    XHeader,
    emptybox,
    PageView,
    ChooseSize
  },
  created () {
    this.cartType = localStorage.getItem('cartType')
    if (localStorage.getItem('upgradePurchase')) {
      this.upgradePurchase = localStorage.getItem('upgradePurchase')
    }
    if (this.$route.query.firstPurchase) { // 如果是一键补货的，会把选中的商品的 id 数组传过来，获取列表成功后，选中数组中的id 的商品将会被选中
      this.firstPurchase = this.$route.query.firstPurchase
    }
    if (this.$route.path === '/home/go-purchase' || this.$route.path === '/home/go-purchase/go-truck') {
      this.getGoodsType() // 获取所有的产品类型
    }
  },
  methods: {
    getAllTypeCallBack () { // 第一次进来请求产品种类完成后请求默认选中的（暂默认第一个）的类别的产品
      this.getAllGoods()
    },
    clickHandler (label) {
      // if you clicked home tab, then print 'Home'
      console.log(label)
      this.selectedLabel = label
    },
    cc (list) {
      this.productObj.toChooseSize = false
      this.productObj.SizeActiveId = list.id
      this.productObj.primaryPicFilePath = list.picUrl
      this.productObj.SizeretailPrice = list.marketPrice
      this.productObj.SizeInCarNum = list.updateProductCount ? list.updateProductCount : 0 // 默认选中的规格的产品在购物车中的数量
      this.productObj.toChooseSize = true
    },
    // 加入进货车成功之后需要同步改变dom上具体数量
    changeListInCarNum (buynum) {
      var NowGoodsList = this.AllGoodsListArry[this.selectInde]
      for (var i in NowGoodsList) {
        if (NowGoodsList[i].id === this.productObj.productId) {
          for (var j in NowGoodsList[i].sizeList) {
            if (NowGoodsList[i].sizeList[j].id === this.productObj.SizeActiveId) {
              NowGoodsList[i].sizeList[j].updateProductCount = buynum
            }
          }
        }
      }
      this.AllGoodsListArry[this.selectInde] = NowGoodsList
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
      this.tabLabels[this.selectInde].page = 1
      this.getAllGoods()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.getAllGoods()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    },
    getGoodsType () {
      var that = this
      this.$http.get('stock/getProductCategories').then((res) => {
        let tables = []
        if (res.data.data.length > 0) {
          tables = res.data.data
          this.isDefault = false
          tables.forEach((t) => {
            var obj = t
            obj.label = t.name // 每个类别的label的name就是请求回来的name字段
            obj.xhrFlag = false // 每个类别第一页是否已经请求过的请求flag
            obj.page = 1 // 各种类别的请求到第几页了绑定在该类别上
            obj.hasNexPage = false // 每个类别是否有下一页，默认false
            t = obj
          })
        } else {
          tables = [{
            label: '默认组合', // 每个类别的label的name就是请求回来的name字段
            id: '',
            xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
            page: 1, // 各种类别的请求到第几页了绑定在该类别上
            hasNexPage: false // 每个类别是否有下一页，默认false
          }]
          this.isDefault = true
        }
        this.tabLabels = tables
        for (var u in this.tabLabels) {
          console.log(u)
          this.AllGoodsListArry.push([])
        }
        this.selectedLabel = this.tabLabels[0].label
        this.selectInde = 0
        if (this.getAllTypeCallBack) {
          this.getAllTypeCallBack()
        }
        setTimeout(() => {
          that.$forceUpdate() // 强制刷新一下页面
          that.$refs.slide.refresh() // 动态添加的轮播强制刷一下
        }, 1000)
      }, () => {})
    },
    getAllGoods () {
      var that = this
      this.$http.get('stock/getAgentPurchaseList', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit,
          categoryId: this.tabLabels[this.selectInde].id,
          upgradePurchase: this.upgradePurchase,
          upgradeLevelId: this.upgradeLevelId,
          cartType: this.cartType
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.list.totalPage > res.data.data.list.currPage))
          var currentArry = this.AllGoodsListArry[this.selectInde] ? this.AllGoodsListArry[this.selectInde] : []
          currentArry = currentArry.concat(res.data.data.list.list)
          currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
          this.productObj.count = res.data.data.cartTotalCount || 0
          this.AllGoodsListArry[this.selectInde] = currentArry
          var scrollnow = 'scroll' + this.selectInde
          this.$forceUpdate() // 强制刷新一下页面
          this.$refs.slide.refresh() // 动态添加的轮播强制刷一下
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }, () => {})
    },
    addgoodsnum (goods) { // 我要进货列表页添加商品到购物车
      var that = this
      if (timer) {
        clearTimeout(timer)
        that.addCart(goods)
        timer = ''
      } else {
        timer = setTimeout(function () {
          that.addCart(goods)
        }, 300)
      }
    },
    addCart (goods) {
      console.log('goods', goods)
      this.productObj.productName = goods.productName
      this.productObj.sizeList = goods.sizeList
      this.productObj.productId = goods.id // 产品的id
      this.productObj.cartType = this.cartType
      this.productObj.defaultbuyNum = 1 // 默认要买的数量，点击选择规格的时候可以选择
      this.productObj.primaryPicFilePath = goods.sizeList.length > 0 ? goods.sizeList[0].picUrl : goods.primaryPicFilePath ? goods.primaryPicFilePath : ''
      // 默认选中的规格的产品在购物车中的数量
      this.productObj.SizeInCarNum = goods.sizeList.length > 0 ? (goods.sizeList[0].updateProductCount ? goods.sizeList[0].updateProductCount : 1) : goods.cartProductCount ? goods.cartProductCount : 1
      this.productObj.SizeActiveId = goods.sizeList.length > 0 ? goods.sizeList[0].id : '' // 默认当前选中的规格id是第一个规格或者空
      this.productObj.SizeretailPrice = goods.sizeList.length > 0 ? goods.sizeList[0].SizeRetailPrice : goods.retailPrice ? goods.retailPrice : 0
      this.productObj.toChooseSize = true
      // if (goods.sizeList.length > 0) {
      //   this.productObj.toChooseSize = true
      // } else {
      //   this.addProductToCart(goods)
      // }
    },
    addProductToCart (goods) {
      var applyNum = goods.cartProductCount ? (goods.cartProductCount + 1) : 1
      var objpara = {
        productId: this.productObj.productId,
        sizeId: this.productObj.SizeActiveId,
        productNum: applyNum,
        cartType: this.productObj.cartType
      }
      objpara = Qs.stringify(objpara)
      this.$http.post('cart/addProductToCart', objpara).then((res) => {
        if (res.data.code === '200') {
          this.$vux.toast.text('加入购物车成功', 'middle')
          goods.cartProductCount++
          this.productObj.count++
        }
      }, () => {})
    },
    goSettlement () { // 点击购物车进入进货车页面
      if (this.productObj.count > 0) {
        this.$router.push({name: 'GoTruck', query: {firstPurchase: this.firstPurchase}})
      }
    },
    goDetail (pid) {
      this.$router.push({name: 'GoodsDetail', query: {productid: pid}})
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      this.selectInde = current
      if (!this.tabLabels[this.selectInde].xhrFlag) {
        this.getAllGoods()
      }
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      console.log('当前活跃下标', index)
      return index
    }
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
    background-color: #fff;
    padding: 0 .12rem .85rem;
    .searchbox{
      width:3rem;
      height:0.3rem;
      background:rgba(245,245,245,1);
      border-radius:16px;
      display: flex;
      align-items: center;
      padding: 0 0.09rem;
      margin: .52rem auto .05rem;
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
    }
    .cube-page{
      /*top: 0.9rem;*/
      top: 0.46rem;
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
        position: fixed;
        /*top: 1.32rem;*/
        top: .78rem;
        left: 0;
        right: 0;
        bottom: 0;
        .cube-slide-item{
          .list-wrapper{
            width: 100%;
            padding: 0 .12rem;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            font-size: 0.12rem;
            li{
              width: 1.64rem;
              height: 2.26rem;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              margin-top: .09rem;
              z-index: 10;
              position: relative;
              .cloudFlag{
                width: 0;
                height: 0;
                border-top:.36rem solid #00A2E9;
                border-left: .36rem solid transparent;
                position: absolute;
                top: 0;
                right: 0;
                z-index: 101;
              }
              .cloudFlagspan{
                position: absolute;
                font-size: .17rem;
                padding: 0;
                color: #fff;
                top: 0px;
                right:-9px;
                transform:scale(.5) rotate(45deg) translate(.1rem);
                z-index: 102;
                margin: auto;
              }
              .libtn{
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: 20;
                background-color: transparent;
                border: none;
                outline: none;
              }
                img.goodsicon{
                  width:100% ;
                  height: 1.64rem;
                  border-radius: .05rem;
                  background-color: #fff;
                }
                .goodsicon+p{
                  color:rgba(51,51,51,1);
                }
                .botdiv {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  width: 100%;
                  height: .18rem;
                  margin-bottom: .11rem;
                  p{
                    color:rgba(153,153,153,1);
                    .price{
                      color: #e73c54;
                      font-size: .15rem;
                      margin-right: .07rem;
                    }
                  }
                  img{
                    width: .18rem;
                    height: .18rem;
                    margin-right: 0.07rem;
                    z-index: 21;
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
      .upcontainer{
        top: 1rem;
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
      z-index:80;
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
        font-size: 0.1rem;
        padding: .02rem .03rem;
      }
    }
  }
</style>
