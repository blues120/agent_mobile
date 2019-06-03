<template>
  <div class="pay-pz">
    <div class="decorabox">
      <span>累计业绩总金额</span>
      <span class="bigf">¥2914.00</span>
    </div>
    <div class="yjitem" v-for="i in 6" @click="showDetail">
      <div class="yjleft">
        <img src="~@/assets/images/my/djs.png" alt="" class="icon">
        <p>
          <span>采购订单-进货业绩</span>
          <span class="time">2018-11-21 11：44：23</span>
        </p>
      </div>
      <p class="righ">
        <span class="redcolor">¥2914.00</span>
        <img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="icon">
      </p>
    </div>
    <!--<emptybox></emptybox>-->
    <p class="all-done">已全部加载</p>
    <achievedetail :detailObj="detailObj"></achievedetail>
  </div>
</template>
<script>
import emptybox from '@/components/emptybox'
import achievedetail from '@/components/AchieveDetail'
export default {
  created () {},
  data () {
    return {
      detailObj: {
        showDetail: false
      }
    }
  },
  methods: {
    showDetail () {
      this.detailObj.showDetail = true
    }
  },
  components: {
    emptybox,
    achievedetail
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
  z-index: 228;
  font-size: .14rem;
  overflow-y: scroll;
  padding-top: .46rem;
  background-color: #f5f6f7;
  margin: auto;
  .decorabox{
    width: 100%;
    height: .9rem;
    background:url("~@/assets/images/home/achieveBg.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    color: #fff;
    padding: 0.21rem .13rem .17rem;
    justify-content: space-between;
    .bigf{
      font-size: .18rem;
      font-weight: 500;
    }
  }
  .yjitem{
    width: 100%;
    height: .63rem;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: .01rem solid #f5f5f5;
    align-items: center;
    .yjleft,.righ{
      display: flex;
      height: 100%;
      align-items: center;
    }
    .yjleft{
      img{
        width: .32rem;
        height: .32rem;
        margin: 0 .08rem 0 .12rem;
      }
      p{
        display: flex;
        height: 100%;
        line-height: 1.5;
        flex-direction: column;
        justify-content: center;
        .time{
          font-size: .12rem;
          color: #999;
        }
      }
    }
    .righ{
      .redcolor{
        color: #FF0000;
        font-size: .14rem;
      }
      img{
        width: .09rem;
        height: .13rem;
        margin:0 .12rem 0 .05rem;
      }
    }
  }
  .all-done{
    line-height: .3rem;
    text-align: center;
  }
}
</style>
