<template>
  <div class="go-purchase">
    <div class="upgradeLevelbox">
      <div class="upgradeProcessingnow">
        <div class="processingtop">
          <div class="upitem">
            <span>当前代理等级</span>
            <span class="bigfont">{{upgradeObj.applyGradeAliasName}}</span>
          </div>
          <div class="upmid">
            <span>申请升级</span>
            <img src="~@/assets/images/home/sj-plane.png" alt="" class="icon">
          </div>
          <div class="upitem">
            <span>申请成为代理</span>
            <span class="bigfont">{{upgradeObj.afterGradeAliasName || '暂无数据'}}</span>
          </div>
        </div>
        <span class="uptime">{{upgradeObj.createTime}}</span>
        <div class="upbot">
          <img src="~@/assets/images/home/sj-processing.png" alt="" class="icon">
          <span>{{upgradeObj.status==0?'升级中, 待审核':upgradeObj.status==1?'待补货':upgradeObj.status==2?'待充值':upgradeObj.status==3?'已通过':upgradeObj.status==4?'已拒绝':upgradeObj.status==5?'已取消':''}}</span>
        </div>
      </div>
      <div class="agentLevelbox">
        <div class="agentbox">
          <div class="top">
            <span class="decorate"></span>
            <span class="tit">升级条件一</span>
            <span class="desc">满足升级条件后可以申请升级</span>
          </div>
          <div class="mid">
            <span>1. 一次性补货 ¥ {{upgradeObj.amount || 0}} ;</span>
            <span class="redcolor">申请升级后，需要完成一次性补货才能升级成功</span>
          </div>
          <div class="bot">
            <span class="greybord">已申请</span>
          </div>
          <img v-if="upgradeObj.flag==1" src="~@/assets/images/home/reaching.png" alt="" class="reachingicon">
        </div>
      </div>
      <div class="upgradeTip" v-if="upgradeObj.upgradeStatus== 0">
        <span class="redcolor" v-if="upgradeObj.changeInvite==1">注意, 您申请升级的代理商等级, 超过当前上级代理商, 升级后, 将不再是当前代理商的下级</span>
        <button class="whitebtn" @click="cancelUpgrade">取消升级</button>
        <button class="recordbtn" @click="goRecordList(1)">升级记录</button>
      </div>
    </div>
  </div>
</template>

<script>
// import Qs from 'qs'
export default {
  created () {
    if (this.$route.query.obj) {
      this.upgradeObj = this.$route.query.obj
    }
    // this.sendRequestxhr()
  },
  data () {
    return {
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
      limit: 10,
      AllGoodsListArry: [[]],
      selectedLabel: '我要升级',
      upgradeObj: {} // 需要升级的对象
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
    }
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
  z-index: 208;
  display: flex;
  flex-direction: column;
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
  .agentbox{
    width: 3.51rem;
    background-color: #fff;
    margin: 0 auto;
    height: 1.6rem;
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
</style>
