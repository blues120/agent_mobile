<template>
  <div class="third-step">
    <div class="thirdbox">
      <p class="shtop" @click="GoagentDetail">
        <img src="~@/assets/images/applyJoin/txicon.png" alt="">
        <span>点击可查看并管理个人信息</span>
      </p>
      <div class="shbox">
        <img src="~@/assets/images/applyJoin/isinshenhe.png" alt="">
        <span v-if="actStep==2">您的资质信息已成功提交（审核中）</span>
        <span v-if="actStep==3">恭喜您，你的代理资质已通过</span>
        <span v-if="actStep==3" style="font-size: 12px;margin-top: 5px">请进行首次进货</span>
        <span class="invitor">邀请人：{{preAgentObj.inviteAgentName}}</span>
      </div>
      <div class="stepdecoratebox">
        <div v-for="step in decorateList" :key="step.inde" class="stepeachitem" :class="actStep>=step.inde?'actstepnow':''">
          <p>
            <span class="decostep" >{{step.inde}}</span>
            <span class="stepname">{{step.name}}</span>
          </p>
          <div class="linedeco"  :class="actStep>step.inde?'actlin':''" v-if="step.inde<4"></div>
        </div>
      </div>
      <div class="shdetail">
        <p class="detailitem">
          <span>您选择的代理产品</span>
          <span>{{preAgentObj.productGroupName}}</span>
        </p>
        <p class="detailitem" style="margin-top: 10px;border-top: 10px solid #f5f6f7">
          <span>您选择的代理级别</span>
          <span>{{preAgentObj.gradeAliasName}}</span>
        </p>
        <p class="shtips" v-if="actStep==3" :class="actStep==3?'hasbot':''">{{preAgentObj.gradeAliasName}}首次进货金额需大于等于：<span class="redcolor">¥ {{preAgentObj.agent.firstJoinAmount}}元</span></p>
      </div>
      <span class="shtipNow"  v-if="actStep==2">长按二维码关注微信公众号，及时接受商家动态</span>
      <img src="~@/assets/images/applyJoin/shqricon.png" alt="" class="shqr"  v-if="actStep==2">
      <div class="iwantfncbox"  v-if="actStep==3">
        <p class="iwantitem" @click="goSTPurchase">
          <img src="~@/assets/images/applyJoin/iwantshop.png" alt="">
          <span>我要进货</span>
        </p>
        <p class="iwantitem" @click="goCloudPurchase">
          <img src="~@/assets/images/applyJoin/iwantcloud.png" alt="">
          <span>买云库存</span>
        </p>
        <p class="iwantitem" @click="GoOrders">
          <img src="~@/assets/images/applyJoin/iwantorder.png" alt="">
          <span>我的订单</span>
        </p>
      </div>
      <div class="infotips"  v-if="actStep==3">
        <span>1.选择我要进货则商品会通过物流直接发给您。</span>
        <span>2.选择买云库存则商品会以数量形式存在总部仓库内。</span>
        <span>3.首次进货仅可下一单，完成付款后，即可成为代理。</span>
      </div>
    </div>
    <div v-transfer-dom>
      <confirm v-model="warningObj.showWaring"
               :title="warningObj.tit"
               confirm-text="继续购买"
               cancel-text="我再想想"
               @on-confirm="warningObj.onConfirm">
        <p style="text-align:center;"><span  v-for="(text,index) in  warningObj.body" :key="index" :class="index==1?'redcolor':''" >{{text}}</span></p>
      </confirm>
    </div>
    <page-view></page-view>
  </div>
</template>

<script>
import {Confirm, TransferDom, XHeader} from 'vux'
import PageView from '@/components/PageView'
export default {
  name: 'thirdStep',
  data () {
    return {
      actStep: 2, // 当前处于申请成为代理商的第几步,本页面可能为2或3
      decorateList: [
        {
          inde: 1,
          name: '填写代理资料'
        },
        {
          inde: 2,
          name: '代理资质审核'
        },
        {
          inde: 3,
          name: '首次进货'
        },
        {
          inde: 4,
          name: '正式成为代理商'
        }
      ],
      warningObj: {
        showWaring: false, // 默认不展示
        tit: '?', // 提示的标题
        body: ['选择该进货方式商品将以数量形式', '暂存在总部仓库', ', 需要时可向总部提货'], // 提示的文字
        onConfirm: function () {
          console.log('点击了确定')
        }
      },
      preAgentObj: {} // 准代理对象
    }
  },
  created () {
    this.getUerInfo()
  },
  methods: {
    GoOrders () { // 审核代理
      this.$router.push({name: 'myOrders', query: {orderModeType: 1}})
    },
    GoagentDetail () { // 查看我的资料详情
      if (this.preAgentObj) {
        this.$router.push({name: 'preAgentDetail', query: {preAgentObj: this.preAgentObj}})
      }
    },
    goSTPurchase () {
      var self = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '确定选择我要进货?', // 提示的标题
        body: ['选择该进货方式商品将直接', '物流配送', '到您手中'], // 提示的文字
        onConfirm: function () {
          localStorage.setItem('cartType', 2) // 2 实体进货 1 云库存
          localStorage.setItem('upgradePurchase', false)
          self.$router.push({name: 'Gopurchase', query: {firstPurchase: true}})
        }
      }
    },
    getUerInfo () {
      var openId = localStorage.getItem('openid')
      this.$http.get('getAgentReviewStatus', {
        params: {
          openId: openId
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.preAgentObj = res.data.data
          localStorage.setItem('userInfo', res.data.data)
          if (res.data.data.agent.reviewStatus === 0) {
            this.actStep = 2
          } else if (res.data.data.agent.reviewStatus === 1) {
            this.actStep = 3
          }
        }
      })
    },
    goCloudPurchase () {
      var self = this
      this.warningObj = {
        showWaring: true, // 默认不展示
        tit: '确定选择买云库存?', // 提示的标题
        body: ['选择该进货方式商品将以数量形式', '暂存在总部仓库', ', 需要时可向总部提货'], // 提示的文字
        onConfirm: function () {
          localStorage.setItem('cartType', 1) // 2 实体进货 1 云库存
          localStorage.setItem('upgradePurchase', false)
          self.$router.push({name: 'Gopurchase', query: {firstPurchase: true}})
        }
      }
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XHeader,
    PageView,
    Confirm
  }
}
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  *{
    box-sizing: border-box;
  }
  /deep/.input-group .icon-wrap .iconfont{
    font-size: .22rem !important;
  }
  .duanxinicon{
    width: .2rem;
    height: .2rem;
    margin-left: .01rem;
  }
  .third-step{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 130;
    padding-top: .46rem;
    overflow-y: scroll;
    background-color: #f5f6f7;
    ul{
      width: 100%;
      .input-group{
        background-color: #fff;
        box-sizing: border-box;
        border-bottom: .01rem solid #edeef0;
        display: flex;
        align-items: center;
        .icon-wrap{
          width: .5rem;
          padding-left: .1rem;
          .iconfont{
            font-size: .18rem;
            color: #9e9e9e;
          }
        }
        .sendcodebtn{
          min-width: .64rem;
          text-align: left;
          flex: 1;
          margin:0;
          padding: 0;
          outline: none;
          border: none;
          background-color: transparent;
          height: .4rem;
          line-height: .4rem;
          display: inline-block;
          font-size: .14rem;
          color: #00A2E9;
        }
        @{deep} .cube-input{
          width: 65%;
        }
        @{deep} .cube-input::after{
          display: none;
        }
      }
      .input-group:first-child{
        border-bottom: 1px solid #edeef0;
      }
    }
    /deep/ .vux-header{
      font-size: 0.18rem;
      color: #333;
      height: .46rem;
      width: 100%;
      z-index: 999;
    }
    .thirdbox{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      p.shtop{
        width: 100%;
        height: .4rem;
        background-color: #00a2e9;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        img{
          width: .2rem;
          height: .15rem;
          margin-right: .08rem;
        }
        span{
          margin: 0;
          font-size: .14rem;
        }
      }
      .shbox{
        width: 100%;
        display: flex;
        justify-content: space-around;
        padding: .2rem 0 .05rem;
        flex-direction: column;
        align-items: center;
        font-size:.16rem ;
        img{
            width:.8rem ;
            height: .72rem;
            margin-bottom: .1rem;
        }
        .invitor{
          font-size: .11rem;
          padding: .05rem .1rem;
          background-color: #00A2E9;
          border-radius: .12rem;
          color: #fff;
          margin-top: .08rem;
        }
      }
      .stepdecoratebox{
        width: 100%;
        background-color: #fff;
        justify-content:center;
        height: .9rem;
        display: flex;
        align-items: center;
        .stepeachitem{
          height: 100%;
          display: flex;
          align-items: center;
          p{
            width: .45rem;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            span{
              margin:.12rem 0 .23rem ;
              font-size: .16rem;
            }
            .decostep{
              width:.25rem;
              margin: 0;
              text-align: center;
              line-height: .25rem;
              font-size: .14rem;
              height:.25rem;
              border: .01rem solid rgba(204,204,204,1);
              box-sizing: border-box;
              border-radius:.25rem;
            }
            .stepname{
              font-size: .11rem;
              white-space: nowrap;
              margin-bottom: 0;
            }
          }
          .linedeco{
            width: .44rem;
            height: .01rem;
            margin-bottom: .23rem;
            background: rgba(204,204,204,1);
          }
        }
        .actstepnow{
          .decostep{
            background:rgba(0,162,233,1);
            border: none !important;
            color: #fff;
          }
          .stepname{
            color: #00A2E9;
          }
          .actlin{
            background:rgba(0,162,233,1);
          }
        }
      }
      .shdetail{
        width: 100%;
        margin-top: .1rem;
        background-color: #fff;
        font-size: .14rem;
        .detailitem{
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 .12rem;
          height: .4rem;
        }
        .shtips{
          width: 3.45rem;
          margin: 0 auto;
          height: .4rem;
          line-height: .4rem;
          border-top: .01rem solid #f5f5f5;
          color: rgba(153,153,153,1);
          font-size: .12rem;
          .redcolor{
            color: #FF0000;
          }
        }
        .hasbot{
          border-bottom: .01rem solid #f5f5f5;
        }
      }
      .shtipNow{
         font-size: .14rem;
         margin: .26rem auto;
      }
      .shqr{
        width: 1.38rem;
        height:1.27rem ;
        margin-bottom: .4rem;
      }
      .iwantfncbox{
        width: 100%;
        height: .86rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        .iwantitem{
          display: flex;
          flex-direction: column;
          font-size: .14rem;
          align-items: center;
          border-right: .01rem solid rgba(245,245,245,1);
          box-sizing: border-box;
          width: 33%;
          img{
            width: .28rem;
            height: .28rem;
            margin-bottom: .1rem;
          }
        }
        .iwantitem:last-child{
          border-right: none;
        }
      }
      .infotips{
        width: 100%;
        padding: .08rem .13rem;
        display: flex;
        flex-direction: column;
        span{
          font-size: .14rem;
          margin: .05rem 0;
        }
      }
    }
  }
  .redcolor{
    color: #FF0000;
  }
</style>
