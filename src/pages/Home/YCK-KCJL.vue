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
                  <li v-for="(item,index) in goodsListArry" :key="index">
                    <div class="goodsbox">
                      <img v-if="item.changeItem==0" :src="'~@/assets/images/home/kcicon'+inde==0?'4':'6'+'.png'"  class="lefticon">
                      <img v-else-if="item.changeItem==2" :src="'~@/assets/images/home/kcicon'+inde==0?'4':'1'+'.png'"  class="lefticon">
                      <img v-else-if="item.changeItem==3" src="~@/assets/images/home/kcicon1.png"  class="lefticon">
                      <img v-else-if="item.changeItem==4" :src="'~@/assets/images/home/kcicon'+inde==0?'4':'5'+'.png'"  class="lefticon">
                      <img v-else-if="item.changeItem==5" src="~@/assets/images/home/kcicon5.png"  class="lefticon">
                      <img v-else-if="item.changeItem==6" src="~@/assets/images/home/kcicon2.png"  class="lefticon">
                      <img v-else-if="item.changeItem==7" src="~@/assets/images/home/kcicon3.png"  class="lefticon">
                      <img v-else-if="item.changeItem==8" src="~@/assets/images/home/kcicon0.png"  class="lefticon">
                      <img v-else src="~@/assets/images/home/kcicon6.png"  class="lefticon">
                      <div class="mid">
                        <span>{{item.changeItemStr}}</span>
                        <span class="time">{{item.createTime}}</span>
                      </div>
                      <div class="rig">
                        <span>{{item.operatorStyle=='1'?'-':'+'}}{{item.changeNumber}}</span>
                        <img src="~@/assets/images/my/arrow_icon.png" :class="item.showmore?'nowact':'normal'">
                      </div>
                      <button @click="watchMore(index)"></button>
                    </div>
                    <div class="slide" :class="item.showmore?'animate':''">
                      <span class="changecontent" :class="inde === 1?'bluecolor':''" > {{item.remark}}</span>
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
  </div>
</template>

<script>
import {findIndex} from '@/common/helpers/util'
import CubePage from '@/components/CubePage'
import emptybox from '@/components/emptybox'
export default {
  created () {
    this.getRecordList()
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
          label: '云库存',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1
        },
        {
          label: '实体库存',
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
      selectedLabel: '云库存'
    }
  },
  methods: {
    watchMore (i) {
      this.AllGoodsListArry[this.selectInde][i].showmore = !this.AllGoodsListArry[this.selectInde][i].showmore
      this.$forceUpdate() // 强制刷新一下页面
    },
    getRecordList () {
      var that = this
      this.$http.get('myInventory/getInventoryRecords', {
        params: {
          page: this.tabLabels[this.selectInde].page,
          limit: this.limit,
          cartType: this.tabLabels[this.selectInde].status
        }
      }).then((res) => {
        if (res) {
          console.log('res', res)
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page === 1 ? [] : this.showOrderArry[this.selectInde]) : []
          if (this.selectInde === 0) {
            this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.cloudDetails.totalPage > res.data.data.cloudDetails.currPage))
            currentArry = currentArry.concat(res.data.data.cloudDetails.list)
          } else {
            currentArry = currentArry.concat(res.data.data.physicalDetails.list)
          }
          currentArry.forEach((t) => {
            t.showmore = false
          })
          // currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
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
        this.getRecordList()
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
      this.getRecordList()
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.getRecordList()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    }
  },
  components: {
    emptybox,
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
      padding: .1rem  .12rem;
      display: flex;
      align-items: center;
      z-index: 10;
      position: relative;
      button{
        width: 100%;
        height: 100%;
        position: absolute;
        box-sizing: border-box;
        top: 0;
        opacity: 0.01;
        z-index: 20;
        left: 0;
        outline: 0;
        margin: 0;
        padding: 0;
        background-color: transparent;
      }
      .lefticon{
        width: .17rem;
        height: .17rem;
        margin-right: .11rem;
      }
      .mid{
        flex: 1;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: .14rem;
        color: #333;
        .time{
          font-size: .12rem;
          color: #999;
        }
      }
      .rig{
        width: .6rem;
        padding-right: .1rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size:.16rem ;
        color: #FF0000;
        img{
          width: .1rem;
          height: .17rem;
          transform: rotate(90deg);
        }
        .normal{
          animation-name: normal;
          animation-duration: .2s;
        }
        .nowact{
          animation-name: nowact;
          animation-duration: .2s;
          transform: rotate(-90deg);
        }
      }
    }
    .slide {
      padding: 0rem .2rem;
      overflow: hidden;
      background-color: #fff;
      border-bottom: .01rem solid #f5f5f5;
      max-height: 0;
      transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
      display: flex;
      flex-direction: column;
      span{
        padding: .05rem 0;
        display: block;
      }
      .changecontent{
        color: #666;
      }
      .bluecolor{
        color: #00A2E9;
      }
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
}
</style>
