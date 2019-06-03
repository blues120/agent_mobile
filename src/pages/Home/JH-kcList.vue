<template>
  <div class="go-purchase">
    <section class="searchbox">
      <div>
        <img src="~@/assets/images/gopurchase/search.png" alt="" class="searchicon" @click="searchstart">
        <input v-model="key"  name="" value="" placeholder="搜索商品">
      </div>
    </section>
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
              <ul class="tab-swiper vux-center" v-if="goodsListArry.length>0">
                <li v-for="(item,index) in goodsListArry" :key="index">
                  <div class="goodsbox">
                    <div class="top">
                      <img :src="item.imgUrl" alt="">
                      <div>
                        <span class="tit">{{item.name}}</span>
                        <p>
                          <span class="greycolor">{{inde==0?'云':'实体'}}库存: <span class="redcolor">{{item.number}}</span></span>
                          <span>商品总价: <span class="redcolor">¥ {{item.number*item.amount}}</span></span>
                        </p>
                      </div>
                    </div>
                    <div class="bot">
                      <span>零售价： <span class="redcolor">¥ {{item.marketPrice}}</span></span>
                      <span>进货价： <span class="redcolor">¥ {{item.amount}}</span></span>
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
      if (this.type === 1) {
        this.selectInde = 1
        this.selectedLabel = '实体库存列表'
      }
    }
    if (this.$route.query.agentid) {
      this.subAgentId = this.$route.query.agentid
    }
    for (var u in this.tabLabels) {
      console.log(u)
      this.showOrderArry.push({})
    }
    this.sendRequestxhr()
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
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      return index
    }
  },
  data () {
    return {
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '云库存列表',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: ''
        },
        {
          label: '实体库存列表',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1
        }
      ],
      clickSearch: false,
      key: '',
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
      showOrderArry: [],
      AllGoodsListArry: [[], []],
      subAgentId: '',
      selectedLabel: '云库存列表'
    }
  },
  methods: {
    sendRequestxhr () {
      if (this.selectInde === 0) {
        this.getcloudKCList() // 云库存列表
      } else if (this.selectInde === 1) {
        this.getSTKCList() // 实体库存列表
      }
    },
    goshowMore (inde) {
      var lists = this.AllGoodsListArry[0]
      if (lists[inde].agentList.length > 0) {
        lists[inde].showMore = !lists[inde].showMore
        this.AllGoodsListArry[0] = lists
      }
      this.$forceUpdate() // 强制刷新一下页面
    },
    searchstart () {
      this.clickSearch = true // 点击过search了
    },
    checkTeam (id) {
      this.$router.push({name: 'teamMsg', query: {checkid: id}})
    },
    checkAgent (id) {
      this.$router.push({name: 'agentDetail', query: {agentid: id}})
    },
    getcloudKCList () {
      var that = this
      this.$http.get('cloudWarehouseList', {
        params: {
          subAgentId: this.subAgentId,
          limit: 10,
          page: this.tabLabels[0].page
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[0] ? (this.tabLabels[0].page === 1 ? [] : this.showOrderArry[0]) : []
          this.tabLabels[0].hasNexPage = ((res.data.data.page.totalPage > res.data.data.page.currPage))
          currentArry = currentArry.concat(res.data.data.page.list)
          currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
          this.AllGoodsListArry[0] = currentArry
          var scrollnow = 'scroll' + this.selectInde
          this.$forceUpdate() // 强制刷新一下页面
          this.$refs.slide.refresh() // 动态添加的轮播强制刷一下
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }, () => {})
    },
    getSTKCList () {
      var that = this
      this.$http.get('warehouseList', {
        params: {
          subAgentId: this.subAgentId,
          limit: 10,
          page: this.tabLabels[1].page
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page === 1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.page.totalPage > res.data.data.page.currPage))
          currentArry = currentArry.concat(res.data.data.page.list)
          currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
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
        this.sendRequestxhr()
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
        if (idsArr.indexOf(parseInt(array[i][attr])) === -1) {
          idsArr.push(parseInt(array[i][attr]))
          allArr.push(array[i])
        }
      }
      return allArr
    },
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.sendRequestxhr()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.sendRequestxhr()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    },
    goWatchLeader (obj) { // 查看上级代理的信息
      this.$router.push({name: 'LeaderMsg', query: {obj: obj}})
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
  padding: 0.46rem 0  0;
  background-color: #f5f6f7;
  z-index: 206;
  display: flex;
  flex-direction: column;
  .cube-page{
    top: 0;
    padding-top: .96rem;
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
      top: 1.28rem;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
  .all-done{
    line-height: .3rem;
    text-align: center;
  }
  .searchbox{
    display: flex;
    align-items: center;
    width: 100%;
    position: fixed;
    left: 0;
    z-index: 206;
    top: .46rem;
    div{
      width:3.2rem;
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
  .swiperboxs{
    flex:1;
    display: flex;
    /*background-color: #fff;*/
    flex-direction: column;
    /deep/.vux-slider{
      flex:1
    }
    /deep/.vux-swiper{
      height: 100%;
      margin-top: .1rem;
      overflow-y: scroll;
    }
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
      .bot{
        width: 100%;
        height: .5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.4;
        font-size: .14rem;
        padding-left: .13rem;
        .redcolor{
          color: #FF0000;
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
  }
}
</style>
