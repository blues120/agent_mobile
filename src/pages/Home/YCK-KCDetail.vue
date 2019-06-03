<template>
  <div class="go-purchase">
    <cube-page>
      <div slot="content">
        <cube-tab-bar
          show-slider
          ref="tabNav"
          :data="tabLabels"
          v-model="selectedLabel"></cube-tab-bar>
        <div class="tab-slide-container">
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
            <cube-slide-item  v-for="(goodsListArry,inde) in AllGoodsListArry" :key="inde" class="swiperboxs">
              <cube-scroll :ref="'scroll'+inde" :options="scrollOptions"  :data="goodsListArry"  @pulling-down="onPullingDown" @pulling-up="onPullingUp" >
                <ul class="tab-swiper vux-center">
                  <li v-if="inde==0" v-for="(item,index) in goodsListArry" :key="index">
                    <div class="goodsbox">
                      <div class="top">
                        <img :src="item.picUrl" alt="">
                        <div>
                          <span class="tit">{{item.productName}}</span>
                          <p>
                            <span class="greycolor">{{type==1?'云':'实体'}}库存: <span class="redcolor">{{item.productCount}}</span></span>
                            <span>商品总价: <span class="redcolor">¥ {{item.totalPrice}}</span></span>
                          </p>
                        </div>
                      </div>
                      <p class="changebox" v-if="type==1"  @click="goGoodsList(2,item.id)">
                        <img src="~@/assets/images/home/changepic.png" alt="">
                        <span>更换</span>
                      </p>
                    </div>
                  </li>
                  <li v-if="inde==1" v-for="(item,index) in goodsListArry" :key="index">
                     <div class="hhjlbox">
                       <img src="~@/assets/images/home/pass.png" v-if="item.status==2" class="hhIconflag">
                       <p class="hhtop">
                         <span>云换货申请</span>
                         <span class="hhtime">{{item.createTime}} 申请</span>
                       </p>
                       <div class="hhbot">
                         <p class="hhbotit">使用 {{item.number}} 个 <span> "{{item.productName}}" </span>置换</p>
                         <div class="hhbotbot">
                           <p>
                             <img src="~@/assets/images/home/rectdecorate.png" alt="">
                             <span>{{item.changeProductName}}</span>
                           </p>
                           <span>x {{item.changeNumber}} </span>
                         </div>
                       </div>
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
    <div class="thrightnow" v-if="type==1 && selectInde ==0" @click="goGoodsList(1)">立即提货</div>
    <page-view></page-view>
  </div>
</template>

<script>
import {findIndex} from '@/common/helpers/util'
import CubePage from '@/components/CubePage'
import emptybox from '@/components/emptybox'
import PageView from '@/components/PageView'
export default {
  created () {
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
    if (this.type == 2) {
      this.tabLabels[0].label = '实体库存商品'
      this.tabLabels[0].status = '2'
      this.selectedLabel = '实体库存商品'
    }
    this.getgoodsList()
  },
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      return index
    }
  },
  data () {
    return {
      type: '1', // 1: 云库存  2; 实体库存
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '云库存商品',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1
        },
        {
          label: '换货记录',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 2
        }
      ],
      loop: false,
      autoPlay: false,
      refreshcz: false,
      showDots: false,
      selectInde: 0,
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
      limit: 10,
      AllGoodsListArry: [[], []],
      selectedLabel: '云库存商品'
    }
  },
  methods: {
    goGoodsList (type, id) {
      this.$router.push({name: 'GoodsList', query: {type: type, id: id}})
    },
    watchMore (i) {
      this.AllGoodsListArry[this.selectInde][i].showmore = !this.AllGoodsListArry[this.selectInde][i].showmore
      this.$forceUpdate() // 强制刷新一下页面
    },
    getgoodsList () {
      var that = this
      if (this.selectInde === 0) {
        this.getgoodsListXhr()
      } else {
        if (this.type==1) {
          this.getRecordListXhr()
        } else {
          var scrollnow = 'scroll' + this.selectInde
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }
    },
    getRecordListXhr () {
      var that = this
      this.$http.get('myInventory/cloudExchangeRecords', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page==1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.totalPage > res.data.data.currPage) ? true : false)
          currentArry = currentArry.concat(res.data.data.list)
          currentArry = this.uniqueObj(currentArry, 'productId') // 去一下重防止重复请求
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
    getgoodsListXhr () {
      var that = this
      this.$http.get('myInventory/getCloudOrPhysicalInventoryDetail', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit,
          cartType: this.tabLabels[this.selectInde].status
        }
      }
      ).then((res) => {
        if (res) {
          console.log('res', res)
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page==1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.totalPage > res.data.data.currPage) ? true : false)
          currentArry = currentArry.concat(res.data.data.list)
          currentArry = this.uniqueObj(currentArry, 'productId') // 去一下重防止重复请求
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
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      this.selectInde = current
      if (!this.tabLabels[this.selectInde].xhrFlag) {
        this.getgoodsList()
      }
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    },
    uniqueObj (array, attr) { // 对象去重方法
      var allArr = [] // 建立新的临时数组
      var idsArr = []
      for (let i = 0; i < array.length; i++) {
        if (idsArr.indexOf(parseInt(array[i][attr])) == -1) {
          idsArr.push(parseInt(array[i][attr]))
          allArr.push(array[i])
        }
      }
      return allArr
    },
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.getgoodsList()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.getgoodsList()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    }
  },
  components: {
    emptybox,
    PageView,
    CubePage
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
  background-color: #fff;
  padding: 0 .12rem .5rem;
  @keyframes nowact {
    from {transform: rotate(90deg);}
    to {transform: rotate(-90deg);}
  }
  @keyframes normal {
    from {transform: rotate(-90deg);}
    to {transform: rotate(90deg);}
  }
  .cube-page{
    top: 0;
    padding-top: .46rem;
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
      top: .78rem;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .all-done{
    line-height: .3rem;
    text-align: center;
  }
  .swiperboxs{
    flex: 1;
    line-height: 1.5;
    .goodsbox{
      width: 100%;
      background-color: #fff;
      margin-top: .09rem;
      clear: both;
      overflow: hidden;
      font-size: .14rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .top{
        width: 100%;
        height: 1.2rem;
        display: flex;
        align-items: center;
        border-bottom: .01rem solid #F5F5F5;
        img{
          width: 1rem;
          height: 1rem;
          margin: 0 .1rem 0 .12rem;
        }
        div{
          flex: 1;
          height: 100%;
          color: #333333;
          display: flex;
          flex-direction: column;
          padding:.25rem  0  .35rem;
          justify-content: space-between;
          .greycolor{
            color: #999999;
            margin-right:.3rem;
          }
          .redcolor{
            color: #FF0000;
          }
        }
      }
      .changebox{
        width: .7rem;
        height: .3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: .12rem;
        background-color: #00A2E9;
        color: #fff;
        border-radius: .3rem;
        margin:.05rem .2rem;
        img{
          width: .15rem;
          height: .15rem;
          margin-right: .06rem;
        }
      }
    }
    .hhjlbox{
      width: 3.51rem;
      height: 1.24rem;
      background-color: #fff;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: .09rem auto 0;
      clear: both;
      color: #333;
      overflow: hidden;
      font-size: .14rem;
      .hhIconflag{
        position: absolute;
        top: 0;
        right: 0;
        width: .36rem;
        height: .36rem;
      }
      .hhtop{
        padding: .11rem;
        width: 100%;
        height: .56rem;
        border-bottom: .01rem solid #f5f5f5;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .hhtime{
          font-size: .12rem;
          color: #999;
        }
      }
      .hhbot{
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: .1rem .12rem ;
        .hhbotit {
          span{
            color: #FF0000;
          }
        }
        .hhbotbot{
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          p{
            display: flex;
            align-items: center;
            img{
              width: .13rem;
              height: .13rem;
              margin-right: .08rem;
            }
          }
        }
      }
    }
  }
  .thrightnow{
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
}
</style>
