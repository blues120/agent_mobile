<template>
  <div class="pay-pz">
    <div class="diychartbox">
      <span>云库存一周数据趋势图</span>
      <ve-line :data="chartData" height="260px" :extend="percentExtend"></ve-line>
    </div>
    <div class="circlebox">
      <span>云库存占比</span>
      <ve-pie :data="chartData" height="182px" :settings="chartSettings" :tooltip-visible="false" :legend-visible="false"></ve-pie>
    </div>
    <div class="fncbox">
      <p @click="goKcdetail(1)">
        <img src="~@/assets/images/home/fnc1.png" alt="">
        <span>云库存</span>
      </p>
      <p @click="goKcdetail(2)">
        <img src="~@/assets/images/home/fnc2.png" alt="">
        <span>实体库存</span>
      </p>
      <p @click="goThdd">
        <img src="~@/assets/images/home/fnc3.png" alt="">
        <span>提货订单</span>
      </p>
      <p @click="goKCJL">
        <img src="~@/assets/images/home/fnc4.png" alt="">
        <span>库存记录</span>
      </p>
    </div>
    <p class="subbtn"  @click="goGoodsList(1)">立即提货</p>
    <page-view></page-view>
  </div>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  created () {},
  data () {
    this.chartSettings = {
      radius: 62,
      offsetY: 100
    }
    return {
      percentExtend: {
        // series: {
        //   label: {
        //     show: true,
        //     formatter: function (params) {
        //       if (params.seriesIndex == 2) {
        //         var str = (params.data[1]) * 100 + '%'
        //         return str
        //       }
        //     }
        //   }
        // },
        legend: {
          bottom: 12
        }
      },
      chartData: {
        columns: ['日期', '访问用户', '下单用户'],
        rows: [
          {'日期': '1/1', '访问用户': 1393, '下单用户': 1093},
          {'日期': '1/2', '访问用户': 3530, '下单用户': 3230},
          {'日期': '1/3', '访问用户': 2923, '下单用户': 2623},
          {'日期': '1/4', '访问用户': 1723, '下单用户': 1423},
          {'日期': '1/5', '访问用户': 3792, '下单用户': 3492},
          {'日期': '1/6', '访问用户': 4593, '下单用户': 4293}
        ]
      }
    }
  },
  methods: {
    goKCJL () {
      this.$router.push({name: 'KCJL'})
    },
    goThdd () {
      this.$router.push({name: 'THDD'})
    },
    goGoodsList (type) {
      this.$router.push({name: 'GoodsList', query: {type: type}})
    },
    goKcdetail (inde) {
      this.$router.push({name: 'KCDetail', query: {type: inde}})
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
  background-color:#f5f5f5;
  .diychartbox,.circlebox{
    width: 100%;
    background-color: #fff;
    position: relative;
    span{
      position: absolute;
      right: 0;
      top: .1rem;
      margin: auto;
      left: 0;
      display: block;
      text-align: center;
    }
  }
  .circlebox{
    margin: .1rem 0;
  }
  .fncbox{
    width: 100%;
    height: 1.07rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    p{
      display: flex;
      flex: 1;
      align-items: center;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      padding: .1rem 0 .23rem;
      img{
        width: .45rem;
        height: .45rem;
      }
    }
  }
  .subbtn{
    margin-top: .12rem !important;
  }
}
</style>
