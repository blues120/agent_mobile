<template>
  <div class="pay-pz">
    <div class="bigbox">
      <div class="decorabox">
        <p>
          <img src="~@/assets/images/home/achieve-decora.png" alt="" class="icon">
          <span>个人业绩</span>
        </p>
      </div>
      <div class="cardBox">
        <div class="top">
          <p><span class="bigsize">0.00 </span><span> 元</span></p>
          <div class="datecurr" @click="goDetail">
            <span>2019-05</span>
            <img src="~@/assets/images/home/white-rig-dir.png" alt="" class="icon">
          </div>
        </div>
        <div class="bot">
          <p class="botitem">
            <span>0.00</span>
            <span class="botdesc">月任务目标</span>
          </p>
          <p class="botitem">
            <span>0</span>
            <span class="botdesc">当前任务剩余</span>
          </p>
        </div>
      </div>
      <span class="bigdesc">如果您的当前月任务未达标，将影响奖励。</span>
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
    goDetail () {
      console.log('goDetail')
      this.$router.push({name: 'myAchieveDetail'})
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
  z-index: 196;
  overflow-y: scroll;
  padding-top: .46rem;
  margin: auto;
  .bigbox{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    padding: .46rem 0 0;
    font-size: .14rem;
    .decorabox{
      width: 100%;
      padding: 0 .12rem;
      border-top: .1rem solid #f5f6f7;
      p{
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: .06rem .09rem;
        background-color: #09BAF2;
        color: #fff;
        border-radius: .25rem;
        margin: .11rem 0;
        img{
          width: .13rem ;
          height: .13rem;
          margin-right: .06rem;
        }
      }
    }
    .cardBox{
      width: 3.51rem;
      height: 1.7rem;
      border-radius: .08rem;
      padding: 0 .06rem;
      color: #fff;
      margin: 0 auto .11rem;
      background:url("~@/assets/images/home/achieveBg.png") no-repeat;
      background-size: cover;
      display: flex;
      flex-direction: column;
      position: relative;
      .top,.bot{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .top{
        border-bottom: .01rem dotted #fff;
        position: relative;
        .datecurr{
          height: 50%;
          width: 30%;
          position: absolute;
          top: 0;
          right: -.12rem;
          display: flex;
          align-items: center;
          justify-content: center;
          img{
            margin-left: .04rem;
          }
        }
        p{
          margin-top: .1rem;
          .bigsize{
            font-size: .24rem;
          }
        }
      }
      .bot{
        .botitem{
          flex: 1;
          height: 70%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-right: .01rem dotted #fff;
          line-height: 1.5;
        }
        .botitem:last-child{
          border-right: none;
        }
      }
    }
    .bigdesc{
      width: 100%;
      text-align: center;
      display: inline-block;
    }
  }
}
</style>
