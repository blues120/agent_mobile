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
              <div class="xjssbox">
                <div class="agentbox" v-if="goodsListArry.length>0"  v-for="(item,index) in goodsListArry" :key="index">
                  <button class="agentclickbtn" @click="goRecorDetail(item)"></button>
                  <div class="top">
                    <span class="decorate"></span>
                    <span class="tit">{{item.name}}（{{item.mobile}}）</span>
                  </div>
                  <div class="midprocessingbox">
                    <div class="newtop">
                      <p class="proceitem">
                        <span>当前代理等级</span>
                        <span class="bigfont">{{item.applyGradeAliasName}}</span>
                      </p>
                      <div class="miditem">
                        <span>申请升级</span>
                        <img src="~@/assets/images/home/sj-plane-blue.png" alt="" class="reachingicon">
                      </div>
                      <p class="proceitem">
                        <span>申请代理等级</span>
                        <span class="bigfont">{{item.afterGradeAliasName || '暂无数据'}}</span>
                      </p>
                    </div>
                    <span class="midtime">{{item.createTime}}</span>
                  </div>
                  <!--待审核-->
                  <img v-if="item.status==0" src="~@/assets/images/home/up-proce0.png" alt="" class="reachingicon">
                  <!--待补货-->
                  <img v-if="item.status==1" src="~@/assets/images/home/up-proce1.png" alt="" class="reachingicon">
                  <!--已拒绝-->
                  <img v-if="item.status==4" src="~@/assets/images/home/up-proce4.png" alt="" class="reachingicon">
                  <!--已取消-->
                  <img v-if="item.status==5" src="~@/assets/images/home/up-proce5.png" alt="" class="reachingicon">
                </div>
              </div>
              <emptybox v-if="goodsListArry.length==0"></emptybox>
              <p class="all-done" v-if="!tabLabels[inde].hasNexPage && goodsListArry.length!=0">已全部加载</p>
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
import Qs from 'qs'
import CubePage from '@/components/CubePage'
import emptybox from '@/components/emptybox'
import PageView from '@/components/PageView'
export default {
  created () {
    console.log('this.$route.query.from', this.$route.query)
    if (this.$route.query.from) {
      this.from = this.$route.query.from
      this.sendRequestxhr()
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
      from: '', // 查看我的升级记录 1   查看下级的升级记录 2
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '升级中',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 0
        },
        {
          label: '已完成',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1
        },
        {
          label: '已关闭',
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
      AllGoodsListArry: [[], [], []],
      subAgentId: '',
      selectedLabel: '升级中'
    }
  },
  methods: {
    sendRequestxhr () {
      if (this.from == 1) { // 查看我的升级记录
        this.getMyrecordList()
      } else if (this.from == 2) { // 查看下级的升级记录
        this.getOtherrecordList()
      }
    },
    getMyrecordList () {
      var that = this
      var params = {
        upgradeStatus: this.tabLabels[this.selectInde].status,
        limit: 10,
        page: this.tabLabels[this.selectInde].page
      }
      params = Qs.stringify(params)
      this.$http.post('getAgentUpgradeList', params).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page==1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.page.totalPage > res.data.data.page.currPage) ? true : false)
          currentArry = currentArry.concat(res.data.data.page.list ? res.data.data.page.list : [])
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
    getOtherrecordList () {
      var that = this
      var params = {
        upgradeStatus: this.tabLabels[this.selectInde].status,
        limit: 10,
        page: this.tabLabels[this.selectInde].page
      }
      params = Qs.stringify(params)
      this.$http.post('getSubAgentUpgradeList', params).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page==1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.page.totalPage > res.data.data.page.currPage) ? true : false)
          currentArry = currentArry.concat(res.data.data.page.list ? res.data.data.page.list : [])
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
        if (idsArr.indexOf(parseInt(array[i][attr])) == -1) {
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
    goRecorDetail (obj) { // 查看申请升级详情
      this.$router.push({name: 'RecordDetail', query: {obj: obj}})
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
    flex:1;
    display: flex;
    flex-direction: column;
    /deep/.vux-slider{
      flex:1
    }
    /deep/.vux-swiper{
      height: 100%;
      margin-top: .1rem;
      overflow-y: scroll;
    }
    .agentbox{
      width: 3.51rem;
      background-color: #fff;
      margin: .1rem auto 0;
      /*height: 1.74rem;*/
      position: relative;
      border-radius: .05rem;
      display: flex;
      flex-direction: column;
      border: .01rem solid #f5f5f5;
      .agentclickbtn{
        width: 100%;
        height: 100%;
        position: absolute;
        background-color: transparent;
        outline: none;
        opacity: .01;
        top: 0;
        left: 0;
      }
      img{
        position: absolute;
        width: .37rem;
        height: .36rem;
        top: 0;
        right: 0;
      }
      div.top{
        width: 100%;
        height: .47rem;
        padding: 0 .12rem;
        border-bottom:.01rem solid #f5f5f5;
        display: flex;
        align-items: center;
        .decorate{
          width: .02rem ;
          height: .17rem;
          background:rgba(0,162,233,1);
          margin-right: .06rem;
        }
        .tit{
          font-size: .16rem;
          color: #333;
          margin-right: .06rem;
        }
        .desc{
          font-size: .14rem ;
          color: #999;
        }
      }
      .mid{
        width: 100%;
        height: .62rem;
        border-bottom: .01rem solid #f5f5f5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        line-height: 1.8;
        color: #333;
        font-size: .13rem;
        padding: 0 .12rem;
        .redcolor{
          color: #FF0000;
          margin-left: .12rem;
        }
      }
      .bot{
        width: 100%;
        flex: 1;
        display: flex;
        align-items: center;
        font-size: .12rem ;
        color: #999;
        padding: 0 .12rem;
        justify-content: flex-end;
        span{
          position: relative;
          display: inline-block;
          button{
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: transparent;
            outline: none;
            opacity: .01;
            top: 0;
            left: 0;
          }
        }
        .bluebord{
          padding: .06rem .12rem;
          border: .01rem solid #00A2E9;
          color: #00A2E9;
          font-size: .14rem;
          margin-left: .08rem;
          border-radius: .25rem;
        }
        .greybord{
          padding: .06rem .12rem;
          border: .01rem solid #ccc;
          color: #666;
          font-size: .14rem;
          margin-left: .08rem;
          border-radius: .25rem;
        }
      }
      .midprocessingbox{
        width: 100%;
        .newtop{
          width: 100%;
          height: .62rem;
          display: flex;
          padding: 0 .28rem;
          align-items: center;
          justify-content: space-between;
          .proceitem{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: .12rem;
            line-height: 1.6;
            color: #999;
            .bigfont{
              color: #333;
              font-size: .16rem;
            }
          }
          .miditem{
            display: flex;
            flex-direction: column;
            align-items: center;
            img{
              width: .9rem;
              height: .11rem;
              margin-top: .1rem;
              position: static;
            }
          }
        }
        .midtime{
          display: inline-block;
          text-align: center;
          width: 100%;
          font-size: .14rem;
          color: #999;
          border-bottom: .01rem solid #f5f5f5;
          padding: 0 0 .08rem;
        }
      }
    }
  }
}
</style>
