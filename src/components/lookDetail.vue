<template>
  <!--查看待结算详情-->
  <div v-transfer-dom class="detail-box">
    <popup v-model="detailObj.showDetail" position="bottom" max-height="70%">
      <div class="fnctop">
        <img src="~@/assets/images/gopurchase/closebtn.png" alt="ICON" class="closeicon" @click="closeeditzz">
        <span>详情</span>
      </div>
      <div class="fnccontent">
        <p>
          <span class="left">收入:</span>
          <span class="redcolor">¥ 8.00</span>
        </p>
        <p>
          <span class="left">订单:</span>
          <span>20181123150533031489</span>
        </p>
        <p>
          <span class="left">买家:</span>
          <span>测试2</span>
        </p>
        <p>
          <span class="left">卖家:</span>
          <span>测试1(138****8888)</span>
        </p>
        <p>
          <span class="left">下单时间:</span>
          <span>2018-11-20 15:05:53</span>
        </p>
        <div class="calutetip">
          <p>采购订单转采购收入=(总商品的下级进货价-总商品的自己进货价)×转采购差价比例- <span class="redcolor">20.00%</span></p>
        </div>
      </div>
      <div class="goodsList">
        <div class="goodsitem" v-for="i in 4">
          <img src="~@/assets/images/gosettlement/tupian@2x.png" alt="ICON" class="goodspic" @click="closeeditzz">
          <div>
            <span class="goodsname">美瘦好尔生健脾胃酵素</span>
            <p>
              <span class="redcolor">¥160.00</span><span class="useless">¥258.00</span>
            </p>
          </div>
          <span>x1</span>
        </div>
      </div>
      <div class="botsrbox">
        收入(元)(160.00-120.00)×1×20.00%
      </div>
    </popup>
  </div>
</template>

<script>
import {TransferDom, Popup} from 'vux'

export default {
  data () {
    return {}
  },
  directives: {
    TransferDom
  },
  components: {
    Popup
  },
  methods: {
    closeeditzz () {
      this.detailObj.showDetail = false
    }
  },
  props: ['detailObj']
}
</script>

<style lang="less" scope>
.detail-box{
  position: relative;
  /deep/.vux-popup-dialog{
    background-color: #fff;
  }
  .fnctop{
    width: 100%;
    height: .3rem;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    border-bottom: .01rem solid rgba(245,245,245,1);
    font-size: .18rem;
    .closeicon{
      width: .16rem;
      height: .16rem;
      position: absolute;
      top: 0;
      bottom: 0;
      left: .15rem;
      margin: auto;
    }
  }
  .fnccontent{
    width: 100%;
    display: flex;
    flex-direction: column;
    padding:.12rem .13rem ;
    font-size: .14rem;
    color: #333;
    line-height: 1.8;
    .left{
      color: #999;
      margin-right: .05rem;
    }
    .redcolor{
      color: #FF0000;
    }
    .calutetip{
      width: 3.51rem;
      height: .61rem;
      border: .01rem solid rgba(238,238,238,1);
      box-shadow:0 .02rem .03rem 0 rgba(235, 232, 232, 0.35);
      border-radius:.05rem;
      padding: 0rem .12rem;
      display: flex;
      align-items: center;
    }
  }
  .goodsList{
    width: 100%;
    height: 1.1rem;
    overflow-y: scroll;
    margin-bottom: .62rem;
    .goodsitem{
      width: 100%;
      height:.8rem ;
      margin-bottom: .05rem;
      padding: 0 .12rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goodspic{
        width: .8rem;
        height: .8rem;
        margin-right: .11rem;
      }
      div{
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        font-size: .16rem;
        color: #333;
        p{
          display: flex;
          margin-top: .1rem;
          align-items: center;
          color:#666 ;
          .useless{
            text-decoration:line-through;
          }
          .redcolor{
            color: #FF0000;
            margin-right: .1rem;
          }
        }
      }
    }
  }
  .botsrbox{
    width:3.51rem;
    height:.39rem;
    position: absolute;
    left: .12rem;
    bottom:.13rem;
    text-align: center;
    line-height: .39rem;
    background:rgba(238,238,238,1);
    box-shadow:0rem .02rem .03rem 0rem rgba(235, 232, 232, 0.35);
    border-radius:.05rem;
  }
}
</style>
