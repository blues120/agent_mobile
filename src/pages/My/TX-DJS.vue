<template>
  <main class="my">
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
            <cube-slide-item>
            <cube-scroll >
              <ul class="list-wrapper">
                <li v-for="i in 8" :key="i" @click="showDetail">
                  <img src="~@/assets/images/my/djs.png" alt="ICON" class="icon">
                  <div class="mid">
                    <span class="topdsc">采购订单-转采购收入</span>
                    <span>订单编号：20181120175959061792</span>
                    <span>2018-11-23 17：44：23</span>
                  </div>
                  <span class="rig">¥ 16.00</span>
                </li>
              </ul>
              <!--<emptybox></emptybox>-->
              <!--<p class="all-done" v-if="!tabLabels[inde].hasNexPage">已全部加载</p>-->
            </cube-scroll>
          </cube-slide-item>
          <cube-slide-item>
            <cube-scroll >
              <ul class="list-wrapper">
                <li v-for="i in 8" :key="i">
                  <img src="~@/assets/images/my/djs.png" alt="ICON" class="icon">
                  <div class="mid">
                    <span class="topdsc">采购订单-转采购收入</span>
                    <span>订单编号：20181120175959061792</span>
                    <span>2018-11-23 17：44：23</span>
                  </div>
                  <span class="rig">¥ 16.00</span>
                </li>
              </ul>
              <!--<emptybox></emptybox>-->
              <!--<p class="all-done" v-if="!tabLabels[inde].hasNexPage">已全部加载</p>-->
            </cube-scroll>
          </cube-slide-item>
          <cube-slide-item>
            <cube-scroll >
              <ul class="list-wrapper">
                <li v-for="i in 8" :key="i">
                  <img src="~@/assets/images/my/djs.png" alt="ICON" class="icon">
                  <div class="mid">
                    <span class="topdsc">采购订单-转采购收入</span>
                    <span>订单编号：20181120175959061792</span>
                    <span>2018-11-23 17：44：23</span>
                  </div>
                  <span class="rig">¥ 16.00</span>
                </li>
              </ul>
              <!--<emptybox></emptybox>-->
              <!--<p class="all-done" v-if="!tabLabels[inde].hasNexPage">已全部加载</p>-->
            </cube-scroll>
          </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
    <lookdetail :detailObj="detailObj"></lookdetail>
  </main>
</template>

<script>
import CubePage from '@/components/CubePage'
import { findIndex } from '@/common/helpers/util'
import emptybox from '@/components/emptybox'
import lookdetail from '@/components/lookDetail'
export default {
  components: {
    CubePage,
    emptybox,
    lookdetail
  },
  data () {
    return {
      disabled: false,
      tabLabels: [
        {
          label: '待结算',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '0'
        },
        {
          label: '已结算',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '1'
        },
        {
          label: '结算失败',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '2'
        }],
      selectedLabel: '待结算',
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
      detailObj: {
        showDetail: false
      },
      AllResPonseArry: [1, 2, 3]
    }
  },
  created () {
    // this.getResponse()
  },
  methods: {
    showDetail () {
      this.detailObj.showDetail = true
    },
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
    getResponse () {
      console.log('this.selectInde', this.selectInde)
      console.log('this.tabbles', this.tabLabels)
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
    z-index: 116;
    background-color: #f5f5f5;
    padding-top: .46rem;
    .cube-page{
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
        top: .85rem;
        left: 0;
        right: 0;
        bottom: 0;
        .cube-slide-item{
          .list-wrapper{
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            font-size: 0.12rem;
            padding-bottom:.1rem;
            clear: both;
            overflow: hidden;
            li{
              padding: 0 .13rem;
              margin: .05rem 0;
              width: 100%;
              height: .85rem;
              display: flex;
              background-color: #fff;
              align-items: center;
              img{
                width: .49rem;
                height: .49rem;
                margin-right: .11rem;
              }
              div{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                color: #999;
                font-size: .12rem;
                span{
                  display: inline-block;
                  margin: .03rem 0;
                }
                .topdsc{
                  font-size: .14rem;
                  color: #333;
                }
              }
              .rig{
                color: #FF0000;
                font-size: .14rem;
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
