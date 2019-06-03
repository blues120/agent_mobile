<template>
  <div v-transfer-dom class="logistibox">
    <popup v-model="logisticsObj.show" position="bottom" max-height="70%" style="background-color: #fff;">
      <div class="logisticstit">
        <span>物流进度</span>
        <img @click="logisticsObj.show=false" src="~@/assets/images/gopurchase/closebtn.png" alt="">
      </div>
      <div class="kdmsg">
        {{logisticsObj.info.com}} : {{ logisticsObj.info.nu}}
      </div>
      <timeline class="timelinebox" v-if="logisticsObj.info.data" >
        <timeline-item  v-for="(item,index) in logisticsObj.info.data" :key="index">
          <h4 :class="{recent:index==0}" style="margin-bottom: 5px;">{{item.context}}</h4>
          <p :class="{recent:index==0}">{{item.time}}</p>
        </timeline-item>
      </timeline>
      <div v-else class="nowuliumsg">
        {{logisticsObj.info.message}}
      </div>
    </popup>
  </div>
</template>

<script>
import {Popup, TransferDom, Timeline, TimelineItem} from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Timeline,
    TimelineItem
  },
  props: ['logisticsObj']
}
</script>

<style lang="less" scope>
.logistibox{
  .logisticstit{
    width: 100%;
    height: .4rem;
    position: relative;
    display: flex;
    justify-content: center;
    font-size: .16rem;
    align-items: center;
    img{
      width: .18rem;
      height: .18rem;
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      right: .18rem;
    }
  }
  .kdmsg,.nowuliumsg{
    box-sizing: border-box;
    width: 90%;
    height: .24rem;
    text-align: center;
    margin: 0 auto;
    border-bottom: .01rem solid #f5f5f5;
  }
  .timelinebox{
    padding: .12rem !important;
    .recent{
      color: #04BE02;
    }
    /deep/.vux-timeline-item-content{
      padding: 0 0 .2rem .27rem;
    }
  }
  .nowuliumsg{
    border-bottom: 0;
    margin: .3rem auto;
  }
}
</style>
