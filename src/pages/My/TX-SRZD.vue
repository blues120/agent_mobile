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
            <cube-slide-item v-for="(txArry,inde) in AllResPonseArry" :key="inde">
            <cube-scroll :options="scrollOptions"  :ref="'scroll'+inde" @pulling-down="onPullingDown" @pulling-up="onPullingUp">
              <ul class="list-wrapper" v-if="txArry.length>0">
                <li  v-for="(item,index) in  txArry" :key="index">
                  <div class="szmxtop">
                    <img src="~@/assets/images/my/djs.png" alt="ICON" class="icon">
                    <div class="mid">
                      <span class="topdsc">{{item.itemName}}</span>
                      <span>{{item.createTime}}</span>
                    </div>
                    <span class="rig">¥ {{item.changeAmount}}</span>
                  </div>
                  <div class="szmxbot">
                    {{item.briefing}}
                  </div>
                </li>
              </ul>
              <emptybox v-else></emptybox>
              <p class="all-done"  v-if="!tabLabels[inde].hasNexPage && txArry.length!=0">已全部加载</p>
            </cube-scroll>
          </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
  </main>
</template>

<script>
import CubePage from '@/components/CubePage'
import { findIndex } from '@/common/helpers/util'
import emptybox from '@/components/emptybox'
export default {
  components: {
    CubePage,
    emptybox
  },
  data () {
    return {
      disabled: false,
      showContent001: false,
      tabLabels: [
        {
          label: '收入',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '1'
        },
        {
          label: '支出',
          page: 1,
          xhrFlag: false,
          hasNexPage: true,
          status: '0'
        }],
      selectedLabel: '收入',
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
    if (this.$route.query.inde) {
      this.selectInde = this.$route.query.inde
      this.selectedLabel = this.tabLabels[this.selectInde].label
    }
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
    getResponse () {
      this.$http.get('incoming/list', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit,
          operatorStyle: this.tabLabels[this.selectInde].status
        }
      }).then((res) => {
        this.tabLabels[this.selectInde].xhrFlag = true
        this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.totalPage > res.data.data.currPage) ? true : false)
        var currentArry = this.AllResPonseArry[this.selectInde] ? this.AllResPonseArry[this.selectInde] : []
        currentArry = currentArry.concat(res.data.data.list)
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
              background-color: #fff;
              .szmxtop{
                width: 100%;
                height: .61rem;
                display: flex;
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
              .szmxbot{
                padding: .1rem 0;
                white-space: normal;
                border-top: .01rem solid rgba(245,245,245,1);
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
    /deep/.cube-scroll-wrapper{
      overflow: scroll;
    }
  }
</style>
