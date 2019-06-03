<template>
  <div class="go-purchase">
    <section class="searchbox">
      <div>
        <img src="~@/assets/images/gopurchase/search.png" alt="" class="searchicon" @click="searchstart">
        <input v-model="key"  name="" value="" placeholder="搜索团队成员">
      </div>
    </section>
    <cube-page>
      <div slot="content">
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
                <div class="dlsdetailbox" v-for="(list,index) in goodsListArry" :key="index">
                  <div class="left"   @click="checkAgent(list.agentId)">
                    <img :src="list.url" alt="">
                    <p>
                      <span>{{list.name}}</span>
                      <span class="dllevel" v-if="list.gradeAliasName">{{list.gradeAliasName}}</span>
                    </p>
                  </div>
                  <div class="righ"  @click="list.subTeamNum>0?checkTeam(list.agentId):''">
                    <p>
                      <span>直接：<span class="redcolor">{{list.subNum}}</span></span>
                      <span>团队：<span class="redcolor">{{list.subTeamNum}}</span></span>
                    </p>
                    <img src="~@/assets/images/my/arrow_icon.png"  alt="">
                  </div>
                </div>
                <emptybox v-if="goodsListArry.length==0"></emptybox>
                <p class="all-done" v-if="!tabLabels[inde].hasNexPage && inde === 1">已全部加载</p>
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
    if (this.$route.query.key) {
      this.key = this.$route.query.key // 如果是搜索页面点击的搜索
      this.clickSearch = true
    }
    if (this.$route.query.checkid) {
      this.checkid = this.$route.query.checkid // 如果是点击查看某一个代理的下级团队
      this.clickSearch = false
    }
    this.sendRequestxhr()
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
          label: '下级团队',
          xhrFlag: false,
          page: 1,
          account: 0,
          status: 2
        }
      ],
      clickSearch: false,
      checkid: '', // 查看某个代理下面的团队
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
      AllGoodsListArry: [[]],
      selectedLabel: '进货下级'
    }
  },
  methods: {
    sendRequestxhr () {
      if (this.clickSearch) { // 如果是点击的搜索进来展示列表的

      }
      if (this.checkid) {
        this.getxjtdList(this.checkid) // 查询下级团队列表
      }
    },
    checkTeam (id) {
      this.$router.replace({name: 'teamMsg', query: {checkid: id}})
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
      // this.getAllorders(this.tabLabels[this.selectInde])
    },
    getxjtdList (subAgentId) {
      this.$http.get('purchaseSubTeam', {
        params: {
          subAgentId: subAgentId || 0,
          limit: 10,
          page: this.tabLabels[this.selectInde].page
        }
      }).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page === 1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.totalPage > res.data.data.currPage))
          currentArry = currentArry.concat(res.data.data.list)
          currentArry = this.uniqueObj(currentArry, 'productId') // 去一下重防止重复请求
          this.AllGoodsListArry[this.selectInde] = currentArry
          this.$forceUpdate() // 强制刷新一下页面
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
      // const x = Math.abs(pos.x)
      // const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      // const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      // const deltaX = x / slideScrollerWidth * tabItemWidth
      // this.$refs.tabNav.setSliderTransform(deltaX)
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
      if (this.selectInde === 1 && this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.sendRequestxhr()
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    },
    checkAgent (id) {
      this.$router.push({name: 'YQagentDetail', query: {agentid: id}})
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
        top: .96rem;
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
      background-color: #fff;
      flex-direction: column;
      /deep/.vux-slider{
        flex:1
      }
      /deep/.vux-swiper{
        height: 100%;
        margin-top: .1rem;
        overflow-y: scroll;
      }
      .jhxjbox{
        width: 100%;
        background-color: #fff;
        font-size: .14rem;
        display: flex;
        flex-direction: column;
        .jhtit{
          width: 100%;
          padding: 0 .12rem;
          height: .34rem;
          position: relative;
          border-bottom: .01rem solid #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          button{
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            background-color: transparent;
            opacity: .01;
            outline: none;
            left: 0;
          }
          p{
            display: flex;
            align-items: center;
            img{
              width: .05rem ;
              height: .1rem ;
              transition:all 0.2s ease-in-out;
            }
            .todowndirection{
              transform: rotate(90deg);
            }
            span{
              margin-left: .1rem;
              color: #333;
            }
          }
          span{
            color: #999;
          }
        }
        .slidebox{
          overflow: hidden;
          max-height: 0;
          transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
        }
        .actslidebox {
          max-height: 9999px;
          transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
          transition-delay: 0s;
        }
      }
      .dlsdetailbox{
        width: 100%;
        height:.84rem ;
        border-bottom: .01rem solid #f5f5f5;
        padding: 0 .12rem;
        display: flex;
        justify-content: space-between;
        .left{
          height: 100%;
          display: flex;
          align-items: center;
          img{
            width: .7rem;
            height: .7rem;
            border-radius: .7rem;
            margin-right: .2rem;
          }
          p{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .dllevel{
              padding: .06rem .08rem;
              background-color: #000000;
              color: #CBC046;
              font-size: .12rem;
              border-radius: .2rem;
              margin-top: .05rem;
            }
          }
          span{
            font-size: .16rem;
            color: #333;
          }
        }
        .righ{
          height: 100%;
          display: flex;
          align-items: center;
          p{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            line-height: 1.8;
            height: 100%;
            color: #999;
            .redcolor{
              color: #FF0000;
            }
          }
          img{
            width: .1rem;
            height: .17rem;
            margin-left: .2rem;
          }
        }
      }
    }
  }
</style>
