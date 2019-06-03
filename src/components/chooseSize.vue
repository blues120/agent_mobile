<template>
  <div v-transfer-dom class="choose-size" style="overflow: visible;">
    <popup v-model="productObj.toChooseSize" position="bottom" max-height="80%" style="background-color: #fff;overflow: visible;">
        <div class="choosesizebox">
          <img :src="productObj.primaryPicFilePath" alt="" class="goodspic">
          <div class="top">
              <p>
                <span>{{productObj.productName}}</span>
                <span class="goodspric">¥{{productObj.SizeretailPrice}}</span>
              </p>
            <img src="~@/assets/images/gopurchase/closebtn.png" alt="" class="closebtn2" @click="closeZZ">
          </div>
          <div class="middle" v-if="productObj.sizeList!== undefined && productObj.sizeList.length>0">
            <span class="goodssizedesc">产品规格</span>
            <p class="sizebox">
              <span  v-for="(list,index) in productObj.sizeList" :key="index" :class="list.id === productObj.SizeActiveId?'activspan':''" @click="changeActivespan(list)">{{list.sizeName}}</span>
            </p>
          </div>
          <div class="midbot">
            <span>购买数量</span>
            <x-number width="50px" button-style="round" :fillable="true" :min="1" v-model="productObj.SizeInCarNum"></x-number>
          </div>
          <div class="goodsbot" @click="goJoinCar">加入进货车</div>
        </div>
    </popup>
  </div>
</template>

<script>
import Qs from 'qs'
import { TransferDom, Popup, XNumber } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    XNumber
  },
  methods: {
    closeZZ: function () {
      this.productObj.toChooseSize = false
    },
    changeActivespan (list) {
      this.$emit('ee', list)
      this.productObj.SizeActiveId = list.id
      this.productObj.primaryPicFilePath = list.picUrl
      this.productObj.SizeretailPrice = list.SizeRetailPrice
      this.productObj.SizeInCarNum = list.updateProductCount ? list.updateProductCount : 1 // 默认选中的规格的产品在购物车中的数量
    },
    addProductToCart () {
      console.log('this.productObj', this.productObj)
      var buynum = this.productObj.SizeInCarNum
      var objpara = {
        productId: this.productObj.productId,
        sizeId: this.productObj.SizeActiveId,
        productNum: buynum,
        cartType: this.productObj.cartType
      }
      objpara = Qs.stringify(objpara)
      this.$http.post('cart/addProductToCart', objpara).then((res) => {
        if (res.data.code === '200') {
          this.$vux.toast.text('加入购物车成功', 'middle')
          this.productObj.count += this.productObj.defaultbuyNum
          this.productObj.isinShopCar = true
          this.$emit('changeListInCarNum', buynum) // 改变列表中刚才加入购物车的商品对应规格的产品数量
        }
      }, () => {})
    },
    goJoinCar: function () {
      this.closeZZ()
      this.addProductToCart()
    }
  },
  props: ['productObj']
}
</script>

<style lang="less" scope>
  .choosesizebox{
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: visible;
    img.goodspic{
      width: 1rem;
      height: 1rem;
      position: absolute;
      top: -.33rem;
      left: .12rem;
      background-color: #fff;
      border-radius: .1rem;
    }
    .top{
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 .12rem 0 1.22rem;
      height: .7rem;
      font-size: .14rem;
      position: relative;
      color:rgba(51,51,51,1);
      img{
        width: .17rem;
        height: .17rem;
        margin-bottom: .1rem;
      }
      p{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .goodspric{
          color:#FF0000;
          font-size: .15rem;
          margin-top: .12rem;
        }
      }
    }
    .middle{
      padding: 0 .12rem;
      font-size: .16rem;
      .goodssizedesc{
        display: inline-block;
        margin: .05rem .08rem .08rem ;
      }
      .sizebox{
        width: 100%;
        span{
          padding: .07rem .1rem;
          background-color:rgba(245,245,245,1);
          font-size: .14rem;
          height: .3rem;
          display: inline-block;
          margin: .05rem;
          border-radius: .15rem;
          box-sizing: border-box;
        }
        .activspan{
          border: .01rem solid #00A2E9;
          color: #00A2E9;
        }
      }
    }
    .midbot{
      display: flex;
      padding: 0  .2rem 0 .12rem;
      align-items: center;
      width: 100%;
      margin: .15rem .08rem;
      font-size: .16rem;
      justify-content: space-between;
      /deep/.vux-number-selector{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .goodsbot{
      width: 100%;
      height:.48rem ;
      line-height: .48rem;
      text-align: center;
      font-size:.16rem ;
      color: #fff;
      background:rgba(0,162,233,1);
      margin-top: .2rem;
    }
    /deep/.vux-number-round .vux-number-input{
      outline: none;
    }
    /deep/.weui-cell:before{
      display: none;
    }
  }
</style>
