<template>
  <div class="pay-pz">
    <div class="achievebox">
      <div class="top">
        <img src="~@/assets/images/home/white-rig-dir.png" alt="" class="firicon">
        <p>2019-05</p>
        <img src="~@/assets/images/home/white-rig-dir.png" alt="" class="secicon">
      </div>
      <div class="bot">
        <span>月任务剩余</span>
        <span><span class="bigfont">0 </span> 元</span>
        <span>如果您的当前月任务未达标，将影响您的奖励。</span>
      </div>
    </div>
    <div class="achievekh">
      <p>
        <span class="amount">¥ 0.00</span>
        <span class="desc">月任务考核</span>
      </p>
      <p>
        <span class="amount">¥ 0.00</span>
        <span class="desc">当前业绩完成</span>
      </p>
    </div>
    <div class="historyAchieve" @click="gohistory">
      <p class="left">
        <img src="~@/assets/images/home/achieve-calulate.png" alt="" class="icon">
        <span>历史累计业绩</span>
      </p>
      <p class="righ">
        <span class="redcolor">¥2914.00</span>
        <img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="icon">
      </p>
    </div>
    <page-view></page-view>
  </div>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  created () {},
  data () {
    return {}
  },
  methods: {
    gohistory () {
      this.$router.push({name: 'myAchieveHistory'})
    }
  },
  components: {
    PageView
  }
}
</script>

<style lang="less" scoped>
.pay-pz{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 198;
  font-size: .14rem;
  overflow-y: scroll;
  padding-top: .46rem;
  background-color: #f5f6f7;
  margin: auto;
  .achievebox{
    width:100%;
    height: 1.7rem;
    background:url("~@/assets/images/home/achieveBg.png") no-repeat;
    background-size: cover;
    color: #fff;
    .top{
      width: 100%;
      height: .44rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: .01rem solid  rgba(245,245,245,.5);;
      font-size: .16rem;
      img{
        margin: 0 .15rem;
      }
      .firicon{
        transform: rotate(180deg);
      }
    }
    .bot{
      height: 1.25rem;
      font-size: .12rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.8;
      .bigfont{
        font-size:.24rem ;
      }
    }
  }
  .achievekh{
    width: 100%;
    height: .68rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    p{
      height: 70%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #999;
      line-height: 1.4;
      border-right: .01rem solid #f5f5f5;
      .amount{
        font-size:.18rem;
        color: #000;
      }
    }
    p:last-child{
      border-right: none;
    }
  }
  .historyAchieve{
    width: 100%;
    height: .5rem;
    margin-top: .1rem;
    display: flex;
    justify-content: space-between;
    padding: 0 .12rem;
    background-color: #fff;
    .left,.righ{
      height: 100%;
      display: flex;
      font-size: .16rem;
      align-items: center;
      .redcolor{
        color: #FF0000;
        font-size: .18rem;
      }
      img{
        width: .14rem;
        height: .15rem;
        margin-right: .1rem;
      }
    }
    .righ{
      img{
        width: .09rem;
        height: .13rem;
        margin:0 0 0 .07rem;
      }
    }
  }
}
</style>
