<template>
  <main class="my">
    <div class="msgbox">
      <img src="~@/assets/images/my/ringball.png" alt="ICON" class="headimg">
      <p>
        <span v-if="txobj.status==1">提现申请已提交，请等待审核</span>
        <span v-if="txobj.status==2 ||txobj.status==3 ||txobj.status == 4 ">{{txobj.statusString}}</span>
        <span v-if="txobj.reason">{{txobj.reason}}</span>
      </p>
    </div>
    <div class="stepbox">
      <div class="boxitem">
        <div class="stepnum" :class="{actStep:txobj.status >= 1}"><p>1</p></div>
        <div class="stepdesc">
          <span>提交申请</span>
          <span class="tx-status">{{txobj.createTime}}</span>
        </div>
      </div>
      <div class="line"></div>
      <div class="boxitem">
        <div class="stepnum" :class="{actStep:txobj.status >= 2}"><p>2</p></div>
        <div class="stepdesc">
          <span>审核中</span>
          <!--<span class="tx-status">2018-11-23 12:35:23</span>-->
        </div>
      </div>
      <div class="line"></div>
      <div class="boxitem">
        <div class="stepnum" :class="{actStep:txobj.status == 3 || txobj.status == 2 ||txobj.status == 4}"><p>3</p></div>
        <div class="stepdesc">
          <span>{{txobj.status == 2 ||txobj.status == 3 ||txobj.status == 4 ? txobj.statusString : '提现成功'}}</span>
          <span class="tx-status" v-if="txobj.operateTime">{{txobj.operateTime}}</span>
        </div>
      </div>
    </div>
    <div class="tx-detail">
      <p class="detail-tit">提现信息</p>
      <div class="tipseach">
        <p class="tipleft">申请提现金额</p>
        <span class="redcolor">¥ {{txobj.amount}}</span>
      </div>
      <!--<div class="tipseach">-->
        <!--<p class="tipleft">提现手续费</p>-->
        <!--<span>¥ {{txobj.amount}}？？？？？？？？？？？？</span>-->
      <!--</div>-->
      <div class="tipseach">
        <p class="tipleft">申请提现人</p>
        <span>{{txobj.name}}</span>
      </div>
      <div class="tipseach">
        <p class="tipleft">提现方式</p>
        <span>{{txobj.methodString}}</span>
      </div>
      <div class="tipseach">
        <p class="tipleft">申请提现时间</p>
        <span>{{txobj.createTime}}</span>
      </div>
    </div>
    <p class="subbtn" v-if="txobj.status==1" @click="cancleTX">取消提现</p>
    <confirm v-model="showWaring"
             title="提醒"
             @on-cancel="onCancel"
             @on-confirm="onConfirm">
      <p style="text-align:center;">确认取消提现吗?</p>
    </confirm>
  </main>
</template>

<script>
import { Confirm } from 'vux'
import Qs from 'qs'
export default {
  data () {
    return {
      txobj: {},
      showWaring: false
    }
  },
  components: {
    Confirm
  },
  created () {
    if (this.$route.query.txobj) {
      this.txobj = this.$route.query.txobj
    }
  },
  methods: {
    cancleTX () {
      this.showWaring = true
    },
    onCancel () {
      console.log('取消')
    },
    onConfirm () {
      this.canceltxXhr()
    },
    canceltxXhr () {
      var that = this
      var params = {
        id: this.txobj.id
      }
      params = Qs.stringify(params)
      this.$http.post('incoming/cancel', params).then((res) => {
        if (res) {
          this.$vux.toast.text('取消成功', 'middle')
          setTimeout(() => {
            that.$router ? that.$router.back() : window.history.back()
          }, 1000)
        }
      })
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
  z-index: 123;
  margin: auto;
  background-color: #fff ;
  padding-top: .46rem;
  width: 100%;
  font-size: .16rem;
  .msgbox{
    width:100%;
    padding: .08rem .13rem;
    background:linear-gradient(180deg,rgba(90,190,233,1) 0%,rgba(0,162,233,1) 100%);
    display: flex;
    align-items: center;
    img{
      width: .2rem;
      height: .2rem;
      margin-right: .15rem;
    }
    p{
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      font-size: .14rem;
      justify-content: center;
      color: #fff;
      line-height: 1.5;
    }
  }
  .stepbox{
    width: 100%;
    height: 2.72rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: .21rem 0;
    justify-content: space-between;
    .boxitem{
      width: 100%;
      height: .32rem;
      display: flex;
      align-items: center;
      .stepnum{
        width: .44rem;
        height: .44rem;
        border-radius: .44rem;
        margin: 0 .13rem 0 .5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: .18rem;
        p{
          width: .32rem;
          border-radius: .32rem;
          height: .32rem;
          display: flex;
          justify-content: center;
          align-items: center;
          border: .02rem solid rgba(160,160,160,1);
          box-sizing: border-box;
        }
      }
      .actStep{
        background-color:  #A1D8F0;
        z-index: 143;
        p{
          border: none;
          background-color: #00A2E9;
          color: #fff;
        }
      }
      .stepdesc{
        display: flex;
        flex-direction: column;
        justify-content: center;
        span{
          font-size: .16rem;
          color: #333;
          line-height: 1.5;
        }
        .tx-status{
          font-size: .14rem;
          color:rgba(153,153,153,1);
        }
      }
    }
    .line{
      width: .02rem;
      height:.68rem ;
      z-index: 123;
      background-color: rgba(220,220,220,1);
      margin-left: .71rem;
    }
  }
  .tx-detail{
    width: 100%;
    border-top: .1rem solid #f5f5f5;
    .detail-tit{
      width: 100%;
      height: .45rem;
      border-bottom: .01rem solid rgba(245,245,245,1);
      padding-left: .12rem;
      line-height: .45rem;
      font-size:.16rem;
    }
    .tipseach{
      width: 100%;
      margin-top: .1rem;
      display: flex;
      align-items: center;
      font-size: .14rem;
      line-height: 1.5;
      .tipleft{
        width: 28%;
        margin-right:.12rem;
        color:#999;
        text-align: right;
      }
    }
  }
  .redcolor{
    color: #FF0000;
  }
}
</style>
