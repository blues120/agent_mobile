<template>
  <div class="pay-pz">
    <p class="subbtn" @click="goSettlement">一键补货</p>
    <div class="goodsItem" v-for="(list,index) in WaitSendList" :key="index">
      <div class="columdiv">
        <p class="redcolor">x<span class="bigfont">{{list.shippedCount}}</span></p>
        <span>缺货量</span>
      </div>
      <div class="columdiv middiv">
        <p>{{list.productName}}</p>
        <p>
          <span>我的{{list.inventoryType == 1 ? '云': '实体'}}库存：</span>
          <span class="redcolor">{{list.inventoryCount}} 件</span></p>
      </div>
      <div class="columdiv">
        <p style="text-align: right">x{{list.shippedCount}}件</p>
        <span>发货数量</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    if (this.$route.query.from) {
      this.from = this.$route.query.from == 'cloud' ? '1' : '2'
    }
    if (this.$route.query.orderId) {
      this.orderId = this.$route.query.orderId
    }
    this.getGoodsList()
  },
  data () {
    return {
      from: '', // 云库存 1 实体库存2
      orderId: '', // 订单id
      WaitSendList: [] // 待发货商品列表
    }
  },
  methods: {
    getGoodsList () {
      this.$http.get('subPur/physicalOrCloudStockOutOfStockList', {
        params: {
          orderId: this.orderId,
          outOfStockType: this.from
        }
      }).then((res) => {
        if (res) {
          this.WaitSendList = res.data.data
        }
      })
    },
    goSettlement () { // 点击购物车进入进货车页面
      localStorage.setItem('cartType', this.from)
      var objpara = this.WaitSendList
      this.$http.post('subPur/oneButtonReplenishment', objpara).then((res) => {
        if (res.data.code == '200') {
          this.$router.push({name: 'GoTruck', query: {selectArry: res.data.data}})
        }
      }, () => {})
    }
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
  background-color:#f5f5f5;
  .goodsItem{
    width: 100%;
    background-color: #fff;
    margin-top: .1rem;
    height:.64rem ;
    padding: 0  .12rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .columdiv{
      height: 100%;
      padding: .1rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .redcolor{
        color:#FF0000;
        text-align: center;
      }
      span{
        font-size: .12rem;
      }
      .bigfont{
        font-size: .24rem;
      }
    }
    .middiv{
      flex: 1;
      margin-left: .21rem;
    }
  }
  .subbtn{
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0 auto .15rem !important;
  }
  .goodsItem:last-child{
    margin-bottom: .74rem;
  }
}
</style>
