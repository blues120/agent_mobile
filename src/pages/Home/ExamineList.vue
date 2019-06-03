<template>
  <div  class="newdiv">
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
            :data="BigListArry"
            :initial-index="initialIndex"
            :auto-play="autoPlay"
            :show-dots="showDots"
            :refreshResetCurrent="refreshcz"
            :options="slideOptions"
            @scroll="scroll"
            @change="changePage">
            <cube-slide-item  v-for="(lists,index) in BigListArry" :key="index">
              <cube-scroll :ref="'scroll'+index"  :options="scrollOptions"  :data="lists"  @pulling-down="onPullingDown" @pulling-up="onPullingUp" >
                <ul class="list-wrapper" v-if="lists.length>0" >
                  <li  v-for="listitem in lists" :key="listitem.id">
                    <div class="title">
                      <p class="title-text">代理：{{listitem.name}}（{{listitem.mobile}}）<span v-if="listitem.status==0">待审核</span><span v-if="listitem.status==1">准代理</span><span v-if="listitem.status==2">已下单</span><span v-if="listitem.status==3">已上传打款凭证</span><span v-if="listitem.status==4">已代理</span><span v-if="listitem.status==5">已拒绝</span><span v-if="listitem.status==6">已驳回</span></p>
                    </div>
                    <div class="content">
                      <p class="p1">微信号：{{listitem.wechat}} <span class="time">{{listitem.inviteDate}}</span></p>
                      <p class="car-id">身份证号：{{listitem.idCard}}</p>
                      <p class="name">邀请人：{{listitem.inviteName}}（{{listitem.inviteMobile}}）</p>
                      <p class="level">申请等级：{{listitem.gradeName}}</p>
                      <p class="tip" v-if="listitem.status==4">总部添加成功，已成为<span class="red">“{{listitem.gradeName}}”</span>。</p>
                    </div>
                  </li>
                </ul>
                <emptybox v-if="lists.length==0"></emptybox>
                <p class="all-done" v-if="!tabLabels[index].hasNexPage">已全部加载</p>
              </cube-scroll>
            </cube-slide-item>
          </cube-slide>
        </div>
      </div>
    </cube-page>
  </div>
</template>

<script>
import { findIndex } from '@/common/helpers/util'
import CubePage from '@/components/CubePage'
import emptybox from '@/components/emptybox'
export default {
  name: 'ExamineList',
  data () {
    return {
      //   进入本页面的时候默认请求一次默认代理商状态的列表，每一种状态的代理商列表请求完成都会加上一个标记。
      //   左右滑动切换的时候如果没有请求完成的标记则请求这种状态的代理商审核列表。如有标记则不请求
      //   上啦加载的时候会将本状态的请求返回数据加入到本状态的审核列表中并去重
      //   下拉刷新只会刷新当前状态的列表数据
      Dlstatus: '0', // 0 待审核，1 准代理，4 已代理，5 已拒绝 ，只需要传0145这几种状态， 2：已下单，3：已上传打款凭证，只需要显示
      limit: 20,
      selectedLabel: '待审核',
      selectInde: 0, // 当前状态选中的代理类别下标
      disabled: false,
      refreshcz: false,
      tabLabels: [
        {
          label: '待审核',
          status: '0', // 对应的tabbar的选中状态
          page: 1,
          xhrFlag: false // 本状态对应的代理商数据是否已经发起过请求，false 默认没有，true 发起过
        },
        {
          label: '准代理',
          status: '1',
          page: 1,
          xhrFlag: false
        },
        {
          label: '已代理',
          status: '4',
          page: 1,
          xhrFlag: false
        },
        {
          label: '已拒绝',
          status: '5',
          page: 1,
          xhrFlag: false
        }
      ],
      BigListArry: [[], [], [], []],
      loop: false,
      autoPlay: false,
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
      }
    }
  },
  components: {
    CubePage,
    emptybox
  },
  created () {
    this.geDLProductRequest(0)
  },
  methods: {
    onPullingDown () {
      this.tabLabels[this.selectInde].page = 1
      this.geDLProductRequest(this.selectInde)
    },
    onPullingUp () {
      if (this.tabLabels[this.selectInde].hasNexPage) {
        this.tabLabels[this.selectInde].page++
        this.geDLProductRequest(this.selectInde)
      } else {
        var scrollnow = 'scroll' + this.selectInde
        this.$refs[scrollnow][0].forceUpdate()
      }
    },
    changePage (current) {
      this.selectedLabel = this.tabLabels[current].label
      this.Dlstatus = this.tabLabels[current].status
      this.selectInde = current
      if (!this.tabLabels[current].xhrFlag) {
        this.geDLProductRequest(current)
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
    scroll (pos) {
      const x = Math.abs(pos.x)
      const tabItemWidth = this.$refs.tabNav.$el.clientWidth
      const slideScrollerWidth = this.$refs.slide.slide.scrollerWidth
      const deltaX = x / slideScrollerWidth * tabItemWidth
      this.$refs.tabNav.setSliderTransform(deltaX)
    },
    geDLProductRequest (cur) {
      var that = this
      this.$http.get('agentReviewList',
        {
          params: {
            status: this.Dlstatus,
            limit: this.limit,
            page: this.tabLabels[cur].page
          }
        }
      ).then((res) => {
        if (res.data.code == 200) {
          this.tabLabels[cur].xhrFlag = true
          this.tabLabels[cur].hasNexPage = (res.data.data.reviewList.length == this.limit ? true : false)
          var currentArry = this.BigListArry[cur] ? this.BigListArry[cur] : []
          currentArry = currentArry.concat(res.data.data.reviewList)
          currentArry = this.uniqueObj(currentArry, 'id') // 去一下重防止重复请求
          this.BigListArry[cur] = currentArry
          var scrollnow = 'scroll' + this.selectInde
          this.$forceUpdate() // 强制刷新一下页面
          this.$refs.slide.refresh() // 动态添加的轮播强制刷一下
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          },600)
        }
      })
    }
  },
  computed: {
    initialIndex () {
      let index = 0
      index = findIndex(this.tabLabels, item => item.label === this.selectedLabel)
      return index
    }
  }
}
</script>

<style lang="less" scoped>
  .newdiv{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    clear: both;
    overflow: hidden;
  }
  /deep/ .cube-page{
    padding-top: .46rem;
  }
  /deep/ .vux-header{
    font-size: 0.18rem;
    color: #333;
    height: .46rem;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  /deep/.cube-tab-bar{
    position: fixed;
    width: 100%;
  }
  /deep/.cube-page .tab-slide-container{
    top:.78rem !important;
  }
.cube-page{
  /deep/ .cube-tab-bar{
    background-color: #fff;
    .cube-tab{
      padding: .09rem 0;
    }
    .cube-tab-bar-slider{
      width: .5rem!important;
      left: .22rem!important;
      height: .03rem;
      background-color: #00a2e9;
    }
    .cube-tab_active{
      color: #00a2e9;
    }
  }
  .tab-slide-container{
    position: fixed;
    top: .32rem;
    left: 0;
    right: 0;
    bottom: 0;
    .cube-slide-item{
      .list-wrapper{
        li{
          background-color: #fff;
          margin-bottom: .11rem;
          .title{
            padding: .1rem 0;
            border-bottom: .02rem solid #f5f5f5;
            .title-text{
              width: 3.51rem;
              margin: 0 auto;
              border-left: .02rem solid #00a2e9;
              text-indent: .1rem;
              display: flex;
              justify-content: space-between;
              span{
                color: #00a2e9;
              }
            }
          }
          .content{
            padding: .12rem;
            p{
              margin-bottom: .1rem;
              .time{
                font-size: .12rem;
                color: #999;
              }
              .red{
                color: #f00;
              }
            }
            p.p1{
              display: flex;
              justify-content: space-between;
            }
            p:last-child{
              margin-bottom: 0;
            }
          }
        }
        li:first-child{
          margin-top: .1rem;
        }
        li:last-child{
          margin-bottom: 0;
        }
      }
      .emptybox{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
          width: 2rem;
          height: 1.5rem;
          margin: 1.2rem auto .4rem;
        }
      }
      .all-done{
        line-height: .3rem;
        text-align: center;
      }
    }
  }
}
</style>
