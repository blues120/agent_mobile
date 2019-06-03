<template>
  <main class="my">
    <div class="dkheader">
      <div class="dkinfo">
        <span>可提现金额</span>
        <span class="yedetail">{{userTXObj.balanceIncome}}</span>
        <span>满100.00元可提现</span>
      </div>
      <img src="~@/assets/images/my/headbg.png" alt="ICON" class="headimg">
    </div>
    <cube-page>
      <div slot="content">
        <cube-tab-bar
          show-slider
          :use-transition="disabled"
          ref="tabNav"
          :data="tabLabels"
          v-model="selectedLabel"></cube-tab-bar>
        <div class="tab-slide-container">
          <cube-slide
            ref="slide"
            :loop="loop"
            :data="AllResPonseArry"
            :initial-index="initialIndex"
            :auto-play="autoPlay"
            :show-dots="showDots"
            :options="slideOptions"
            :refreshResetCurrent="refreshcz"
            @scroll="scroll"
            @change="changePage">
            <!--每个循环的单项-->
            <cube-slide-item v-for="(txArry,inde) in AllResPonseArry" :key="inde">
              <cube-scroll :options="scrollOptions"  :ref="'scroll'+inde" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
                <ul class="list-wrapper" v-if="txArry.length>0">
                  <li v-for="(item,index) in  txArry" :key="index" @click="goDetail(item)">
                    <div class="boxleft">
                      <img src="~@/assets/images/my/isuseless.png" alt="ICON" class="icon">
                      <div class="mid">
                        <span>{{item.statusString}}</span>
                        <span class="listime">{{item.operateTime}}</span>
                      </div>
                    </div>
                    <span class="redcolor">¥ {{item.amount}}</span>
                  </li>
                </ul>
                <emptybox v-else></emptybox>
                <p class="all-done" v-if="!tabLabels[inde].hasNexPage && txArry.length!=0">已全部加载</p>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
    <page-view></page-view>
  </main>
</template>

<script>
import PageView from '@/components/PageView'
import CubePage from '@/components/CubePage'
import { findIndex } from '@/common/helpers/util'
import emptybox from '@/components/emptybox'
export default {
  components: {
    PageView,
    CubePage,
    emptybox
  },
  data () {
    return {
      disabled: false,
      tabLabels: [
        {
          label: '提现中',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '1'
        },
        {
          label: '已提现',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '2'
        },
        {
          label: '已失效',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '3'
        },
        {
          label: '全部',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: ''
        }],
      selectedLabel: '提现中',
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
      selectInde: 0, // 当前选择的下标
      limit: 10,
      AllResPonseArry: []
    }
  },
  created () {
    for (var u in this.tabLabels) {
      this.AllResPonseArry.push([])
    }
    var userTXObj = JSON.parse(localStorage.getItem('userTXObj'))
    this.userTXObj = userTXObj
    this.getResponse()
  },
  methods: {
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      this.selectInde = current
      if (!this.tabLabels[this.selectInde].xhrFlag) {
        this.getResponse()
      }
    },
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    },
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.getResponse()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.getResponse()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
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
    goDetail (item) {
      this.$router.push({name: 'TXDetail', query: {txobj: item}})
    },
    getResponse () {
      this.$http.get('incoming/withdrawlist', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit,
          sta: this.tabLabels[this.selectInde].status
        }
      }).then((res) => {
        this.tabLabels[this.selectInde].xhrFlag = true
        this.tabLabels[this.selectInde].hasNexPage = ((res.data.page.totalPage > res.data.page.currPage) ? true : false)
        var currentArry = this.AllResPonseArry[this.selectInde] ? this.AllResPonseArry[this.selectInde] : []
        currentArry = currentArry.concat(res.data.page.list)
        currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
        this.AllResPonseArry[this.selectInde] = currentArry
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
        this.$forceUpdate() // 强制刷新一下页面
        this.$refs.slide.refresh() // 动态添加的轮播强制刷一下
      }, () => {})
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      // console.log('当前活跃下标', index)
      return index
    }
  }
}
</script>

<style lang="less" scoped>
.my{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 113;
  margin: auto;
  background-color: #f5f6f7 ;
  padding-top: .46rem;
  width: 100%;
  font-size: .16rem;
  .dkheader{
    background-color: #fff;
    position: relative;
    box-sizing: border-box;
    z-index: 120;
    .dkinfo{
      width: 100%;
      height: 1.32rem;
      position: absolute;
      box-sizing: border-box;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      color: #fff;
      font-size:.16rem ;
      .yedetail{
        font-size: .36rem;
        margin: .14rem 0;
      }
    }
    .headimg{
      display: block;
      width: 100%;
      height: 2.23rem;
      margin-bottom: .05rem;
    }
  }
  .redcolor{
    color: #FF0000;
  }
  .cube-page{
    padding-top: 2.69rem;
    position: fixed;
      /deep/.wrapper{
        position: relative;
        padding-top: .46rem;
      }
      /deep/ .cube-tab-bar{
        background-color: #fff;
        position: absolute;
        width: 100%;
        top: 0rem;
        left: 0;
        z-index: 114;
        .cube-tab{
          padding: .15rem 0;
        }
        .cube-tab-bar-slider{
          background-color: #00a2e9;
        }
        .cube-tab_active{
          color: #00a2e9;
        }
      }
    /deep/.tab-slide-container{
      position: absolute;
      width: 100%;
      height:100%;
      /*top: .46rem;*/
      left: 0;
      margin-bottom: 1rem;
    }
  }
  .list-wrapper{
    overflow: scroll;
    padding-bottom: .46rem;
    li{
      width: 100%;
      background-color: #fff;
      height: .64rem;
      padding: 0 .13rem;
      display: flex;
      align-items: center;
      margin-top: .1rem;
      justify-content: space-between;
      .boxleft{
        flex: 1;
        display: flex;
        font-size: .16rem;
        color: #333;
        align-items: center;
        img{
          width: .33rem;
          height: .33rem;
          margin-right: .12rem;
        }
        .mid{
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .listime{
            font-size: .14rem;
            color: #999;
            margin-top: .1rem;
          }
        }
      }
    }
  }
  .all-done{
    text-align: center;
  }
}
</style>
