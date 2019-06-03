<template>
  <div class="pay-pz">
    <div class="decorabox">
      <span>累计业绩总金额</span>
      <span class="bigf">¥2914.00</span>
    </div>
    <div>
      <div class="itemsyear">2018 年</div>
      <div class="historyAchieve" @click="gohistoryList">
        <p class="left">
          <img src="~@/assets/images/home/achieve-money.png" alt="" class="icon">
          <span>11 月业绩余额</span>
        </p>
        <p class="righ">
          <span class="redcolor">¥2914.00</span>
          <img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="icon">
        </p>
      </div>
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
    gohistoryList () {
      this.$router.push({name: 'myAchieveHistoryList'})
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
  z-index: 208;
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
  .itemsyear{
    width: 100%;
    height: .43rem;
    display: flex;
    align-items: center;
    padding:0  .12rem;
  }
  .historyAchieve{
    width: 100%;
    height: .5rem;
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
        width: .16rem;
        height: .16rem;
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
