<template>
  <div class="go-purchase">
    <cube-page v-if="!showAgentMsg">
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
              <div class="upgradeLevelbox" v-if="inde==0 && upgradeObj">
                  <div class="agentlevelNow" v-if="upgradeObj.upgradeStatus==-1">
                    <div>
                      <img src="~@/assets/images/home/upgardeIcon.png" alt="" class="icon">
                      <p>
                        <span>当前代理等级</span>
                        <span class="agentlevelName">{{upgradeObj.curGradeName}}</span>
                      </p>
                    </div>
                    <p class="rig">
                      <button @click="goRecordList(1)"></button>
                      <span>升级记录</span>
                      <img src="~@/assets/images/home/white-rig-dir.png" alt="" class="icon">
                    </p>
                  </div>
                  <div class="upgradeProcessingnow" v-if="upgradeObj.upgradeStatus && upgradeObj.upgradeStatus!=-1">
                    <div class="processingtop">
                      <div class="upitem">
                        <span>当前代理等级</span>
                        <span class="bigfont">{{upgradeObj.curGradeName}}</span>
                      </div>
                      <div class="upmid">
                        <span>申请升级</span>
                        <img src="~@/assets/images/home/sj-plane.png" alt="" class="icon">
                      </div>
                      <div class="upitem">
                        <span>申请成为代理</span>
                        <span class="bigfont">{{upgradeObj.gradeAliasName}}</span>
                      </div>
                    </div>
                    <span class="uptime">{{upgradeObj.createTime}}</span>
                    <div class="upbot">
                      <img src="~@/assets/images/home/sj-processing.png" alt="" class="icon">
                      <span>{{upgradeObj.upgradeStatus==0?'升级中, 待审核':upgradeObj.upgradeStatus==1?'待补货':upgradeObj.upgradeStatus==2?'待充值':upgradeObj.upgradeStatus==3?'已通过':upgradeObj.upgradeStatus==4?'已拒绝':upgradeObj.upgradeStatus==5?'已取消':''}}</span>
                    </div>
                  </div>
                  <div class="agentLevelbox" v-if="upgradeObj.isUpGrade== 0">
                    <p class="top" v-if="upgradeObj.gradeAliasName">
                      可升级代理等级： <span>{{upgradeObj.gradeAliasName}}</span>
                    </p>
                    <div class="agentbox">
                      <div class="top">
                        <span class="decorate"></span>
                        <span class="tit">升级条件一</span>
                        <span class="desc">满足升级条件后可以申请升级</span>
                      </div>
                      <div class="mid">
                        <span>1. 一次性补货 ¥{{upgradeObj.amount}} ;</span>
                        <span class="redcolor">申请升级后，需要完成一次性补货才能升级成功</span>
                      </div>
                      <div class="bot">
                        <span v-if="upgradeObj.upgradeStatus==-1 || upgradeObj.upgradeStatus==4 || upgradeObj.upgradeStatus==5">当前{{upgradeObj.flag==1?'':'不'}}可以发起升级</span>
                        <span class="bluebord" v-if="upgradeObj.flag==1 && (upgradeObj.upgradeStatus==-1 || upgradeObj.upgradeStatus==4 || upgradeObj.upgradeStatus==5)">我要升级<button @click="iWantUpgrade"></button></span>
                        <span class="greybord" v-if="upgradeObj.upgradeStatus && upgradeObj.upgradeStatus== 0">已申请</span>
                      </div>
                      <img v-if="upgradeObj.flag==1" src="~@/assets/images/home/reaching.png" alt="" class="reachingicon">
                    </div>
                  </div>
                  <div class="upgradeTip" v-if="upgradeObj.upgradeStatus && upgradeObj.upgradeStatus== 0">
                    <span class="redcolor" v-if="upgradeObj.changeInvite==1">注意, 您申请升级的代理商等级, 超过当前上级代理商, 升级后, 将不再是当前代理商的下级</span>
                    <button class="whitebtn" @click="cancelUpgrade">取消升级</button>
                    <button class="recordbtn" @click="goRecordList(1)">升级记录</button>
                  </div>
                  <div class="maxLevel" v-if="upgradeObj.isUpGrade== 1">
                    <img src="~@/assets/images/home/maxLevel.png" alt="">
                    <span>当前已是最高等级了</span>
                  </div>
              </div>
              <div class="xjssbox" v-if="inde==1">
                <div class="sjtit">
                  <span>当前处理中升级申请：<span class="bluecolor">{{goodsListArry.length || 0}}</span></span>
                  <p class="rigtit">
                    <span>下级升级记录</span>
                    <button @click="goRecordList(2)"></button>
                    <img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="icon">
                  </p>
                </div>
                <div class="agentbox" v-if="goodsListArry.length>0"  v-for="(item,index) in goodsListArry" :key="index">
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
                  <div class="bot">
                    <span class="greybord" @click="showUpgradetips(item.amount || 0)">升级条件</span>
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
              <emptybox v-if="goodsListArry.length==0 && inde ==1"></emptybox>
              <p class="all-done" v-if="!tabLabels[inde].hasNexPage && inde ==1 && goodsListArry.length!=0">已全部加载</p>
            </cube-scroll>
          </cube-slide-item>
        </cube-slide>
      </div>
      </div>
    </cube-page>
    <div class="agentDetail" v-else>
      <div class="processingtop">
        <div class="upitem">
          <span>当前代理等级</span>
          <span class="bigfont">{{upgradeObj.curGradeName}}</span>
        </div>
        <div class="upmid">
          <span>申请升级</span>
          <img src="~@/assets/images/home/sj-plane.png" alt="" class="icon">
        </div>
        <div class="upitem">
          <span>申请成为代理</span>
          <span class="bigfont">{{upgradeObj.gradeAliasName}}</span>
        </div>
      </div>
      <div class="agentitem">
        <span>身份证号</span>
        <input type="text" v-model="idCard">
      </div>
      <div class="agentitem">
        <span>微信号</span>
        <input type="text" v-model="weChat">
      </div>
      <p class="subbtn" @click="upgradeLevelsXhr">完成</p>
    </div>
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
      weChat: '',
      idCard: '',
      tabLabels: [ // 订单状态，全部状态下该值为空，根据前端标签的状态改变。订单状态 1：待付款 2：代发货 3：待收货 4：已完成
        {
          label: '我要升级',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: ''
        },
        {
          label: '下级升级',
          xhrFlag: false, // 每个类别第一页是否已经请求过的请求flag
          page: 1, // 各种类别的请求到第几页了绑定在该类别上
          hasNexPage: false, // 每个类别是否有下一页，默认false
          status: 1
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
      subAgentId: '',
      selectedLabel: '我要升级',
      showAgentMsg: false, // 升级时显示代理信息，否则不显示
      upgradeObj: {} // 我要升级的对象
    }
  },
  methods: {
    sendRequestxhr () {
      if (this.selectInde === 0) {
        this.getAgentDetail() // 我要升级(code end)
      } else if (this.selectInde === 1) {
        this.getXJUpList() // 下级升级
      }
    },
    getAgentDetail () {
      var that = this
      this.$http.get('canUpgradeAgentGradeList').then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          this.upgradeObj = res.data.data
          var scrollnow = 'scroll' + this.selectInde
          this.$forceUpdate() // 强制刷新一下页面
          this.$refs.slide.refresh() // 动态添加的轮播强制刷一下
          setTimeout(() => {
            that.$refs[scrollnow][0].forceUpdate() // 停止上拉或者下拉的刷新 loading 动作
          }, 600)
        }
      }, () => {})
    },
    getXJUpList () {
      var that = this
      var params = {
        upgradeStatus: 0,
        limit: 10,
        page: this.tabLabels[1].page
      }
      params = Qs.stringify(params)
      this.$http.post('getSubAgentUpgradeList', params).then((res) => {
        if (res) {
          this.tabLabels[this.selectInde].xhrFlag = true
          var currentArry = this.AllGoodsListArry[this.selectInde] ? (this.tabLabels[this.selectInde].page==1 ? [] : this.showOrderArry[this.selectInde]) : []
          this.tabLabels[this.selectInde].hasNexPage = ((res.data.data.page.totalPage > res.data.data.page.currPage) ? true : false)
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
    iWantUpgrade () { // 我要升级
      var upgradeObj = this.upgradeObj
      var that = this
      var content = '您申请升级的代理需先完善资料，'
      if (upgradeObj.changeInvite==1) {
        content += '因为您升级的代理等级等于或超过当前上级代理，升级后，将不再是当前代理的下级。'
      }
      content += '是否确认发起升级?'
      this.$vux.confirm.show({
        title: '升级提示',
        content: content,
        onConfirm: () => {
          that.$http.get('agentinfo/info').then((res) => {
            if (res) {
              that.idCard = res.data.data.idCard
              that.weChat = res.data.data.wechat
              that.showAgentMsg = true
            }
          })
        }
      })
    },
    upgradeLevelsXhr () {
      if (!this.idCard) {
        this.$vux.toast.text('请输入身份证号', 'middle')
        return
      }
      if (!this.weChat) {
        this.$vux.toast.text('请输入微信号', 'middle')
        return
      }
      this.$http.get('agentApplyUpgrade', {
        params: {
          weChat: this.weChat,
          idCard: this.idCard
        }
      }).then((res) => {
        if (res) {
          this.onPullingDown()
          this.showAgentMsg = false
        }
      }, () => {})
    },
    cancelUpgrade () { // 取消升级
      var that = this
      this.$vux.confirm.show({
        title: '取消升级',
        content: '确定取消本次升级吗?',
        onConfirm: () => {
          that.$http.get('upgradeApplyCancel').then((res) => {
            if (res) {
              that.onPullingDown()
            }
          }, () => {})
        }
      })
    },
    showUpgradetips (amount) {
      this.$vux.confirm.show({
        content: '申请升级后，需一次性补货' + amount + '元才能升级成功',
        showCancelButton: false,
        onConfirm: () => {}
      })
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
    goRecordList (comefrom) { // 查看我的或者下级代理的升级记录的信息  我的 1 下级的 2
      this.$router.push({name: 'recordList', query: {from: comefrom}})
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
    .upgradeLevelbox{
      .agentlevelNow{
         width: 100%;
        height: .65rem;
        background:linear-gradient(180deg,rgba(90,190,233,1) 0%,rgba(0,162,233,1) 100%);
        display: flex;
        color: #fff;
        justify-content: space-between;
        padding: 0  .13rem;
        border-top: .1rem solid #f5f6f7;
        font-size: .12rem;
        div{
          height: 100%;
          display: flex;
          align-items: center;
          img{
            width: .24rem;
            height: .24rem;
            margin-right: .1rem;
          }
          p{
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            line-height: 1.5;
            .agentlevelName{
              font-size: .16rem;
            }
          }
        }
        .rig{
          display: flex;
          align-items: center;
          position: relative;
          button{
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: transparent;
            outline: none;
            opacity: 0.01;
            top: 0;
            left: 0;
          }
          img{
            width: .12rem;
            height: .12rem;
            margin-left: .06rem;
          }
        }
      }
      .upgradeProcessingnow{
        width: 100%;
        height: 1.59rem;
        background:linear-gradient(180deg,rgba(90,190,233,1) 0%,rgba(0,162,233,1) 87%);
        margin-top: .1rem;
        color: #fff;
        font-size: .14rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .processingtop{
          padding: 0 .41rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: .78rem;
          .upitem{
            display: flex;
            flex-direction: column;
            font-size: .12rem;
            line-height: 1.5;
            .bigfont{
              font-size: .16rem;
            }
          }
          .upmid{
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: .12rem;
            span{
              padding: .06rem  .12rem;
              background-color: #fff;
              color: #00A2E9;
              border-radius: .22rem;
            }
            img{
              width: .9rem;
              height: .11rem;
              margin-top: .1rem;
            }
          }
        }
        .upbot{
          width: 100%;
          height: .54rem;
          border-top: .01rem solid rgba(245,245,245,.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: .14rem;
          img{
            width: .22rem;
            height: .21rem;
            margin-right: .06rem;
          }
        }
      }
      .agentLevelbox{
        width: 100%;
        padding: .12rem;
        p.top{
          display: flex;
          align-items: center;
          margin-bottom: .06rem;
          span{
            padding: .06rem .12rem;
            color: #CBC046;
            background-color:#000 ;
            font-size: .12rem;
            border-radius:.22rem ;
          }
        }
      }
      .upgradeTip{
        width: 100%;
        display: flex;
        padding: .12rem;
        flex-direction: column;
        .redcolor{
          color: #FF0000;
          white-space: normal;
          line-height: 1.5;
          width: 100%;
          margin-bottom: .1rem;
        }
        button{
          width: 3rem;
          height: .4rem;
          border: none;
          background-color: transparent;
          outline: none;
          margin: .05rem auto 0;
          font-size: .16rem;
          border-radius: .4rem;
        }
        .whitebtn{
          background-color: #fff;
          color: #333;
        }
        .recordbtn{
          color: #00A2E9;
        }
      }
      .maxLevel{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        img{
          width: .9rem;
          height: .9rem;
          margin: .4rem 0 .1rem;
        }
        span{
          font-size: .14rem;
          color: #333;
        }
      }
    }
    .xjssbox{
      width: 100%;
      .sjtit{
        margin: .1rem auto;
        width: 100%;
        height: .5rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: .14rem;
        color: #333;
        padding: 0 .12rem;
        .bluecolor{
          color: #00A2E9;
        }
        .rigtit{
          display: flex;
          height: 100%;
          align-items: center;
          color: #999;
          position: relative;
          button{
            width: 100%;
            height: 100%;
            position: absolute;
            background-color: transparent;
            outline: none;
            opacity: 0.01;
            top: 0;
            left: 0;
          }
          img{
            width: .1rem;
            height: .17rem;
            margin-left: .1rem;
          }
        }
      }
    }
    .agentbox{
      width: 3.51rem;
      background-color: #fff;
      margin: 0 auto;
      height: 1.74rem;
      position: relative;
      border-radius: .05rem;
      display: flex;
      flex-direction: column;
      border: .01rem solid #f5f5f5;
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
  .agentDetail{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 306;
    padding-top: .46rem;
    background-color: #f5f6f7;
    margin: auto;
    .processingtop{
      width:3.75rem;
      color: #fff;
      height:.8rem;
      background:linear-gradient(180deg,rgba(90,190,233,1) 0%,rgba(0,162,233,1) 87%);
      padding: 0 .41rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .upitem{
        display: flex;
        flex-direction: column;
        font-size: .12rem;
        line-height: 1.5;
        .bigfont{
          font-size: .16rem;
        }
      }
      .upmid{
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .12rem;
        span{
          padding: .06rem  .12rem;
          background-color: #fff;
          color: #00A2E9;
          border-radius: .22rem;
        }
        img{
          width: .9rem;
          height: .11rem;
          margin-top: .1rem;
        }
      }
    }
    .agentitem{
      width: 100%;
      display: flex;
      align-items: center;
      height: .45rem;
      border-bottom: .01rem solid #f5f5f5;
      color: #333;
      font-size: .14rem;
      background-color: #fff;
      padding: 0 .13rem;
      justify-content: space-between;
      span{
        width: 20%;
      }
      input{
        height: 100%;
        flex: 1;
        outline: none;
      }
    }
  }
}
</style>
