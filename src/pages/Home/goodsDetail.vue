<template>
  <div class="goods-detail">
    <div class="goodsdeailtop">
      <cube-slide ref="slide" :data="productObj.pictureList" class="goodspic">
        <cube-slide-item v-for="(item, index) in productObj.pictureList" :key="index" >
          <img :src="item.picUrl" style="width: 100%;height: 100%">
        </cube-slide-item>
      </cube-slide>
      <p>
        <span class="jhpric">进货价：¥ {{productObj.retailPrice}}</span>
        <span class="lspric">零售价：¥ {{productObj.marketPrice}}</span>
      </p>
      <p>
        <span>销售：{{productObj.salesActual}}</span>
        <span>库存：{{productObj.stockAmount}}</span>
      </p>
      <p class="ggbox" @click="goChooseSize" v-if="productObj.SizeActiveId">
        <span>请选择规格</span>
        <img src="~@/assets/images/my/arrow_icon.png" alt="">
      </p>
    </div>
    <p class="deco"><span>商品详情</span></p>
    <pre class="goodsdesc" v-html="goodsdesc"></pre>
    <div class="goosdetailfooter">
      <p style="border-right: 1px solid rgba(245,245,245,1);" @click="goIndex">
        <img src="~@/assets/images/gopurchase/goodstohome.png" alt="" class="icon">
        <span>首页</span>
      </p>
      <p @click="goDetail">
        <img src="~@/assets/images/gopurchase/goodstocar.png" alt="" class="icon">
        <span class="redpoint" v-if="productObj.isinShopCar"></span>
        <span>购物车</span>
      </p>
      <p class="joincar" @click="addCart">
        <span>加入购物车</span>
      </p>
    </div>
    <choose-size ref="choseSize" :productObj="productObj" v-if="productObj" v-on:goJoinCar="addCart" @changeListInCarNum="changeListInCarNum"></choose-size>
  </div>
</template>

<script>
import ChooseSize from '@/components/chooseSize'
export default {
  name: 'GoodsDetail',
  created () {
    this.productId = this.$route.query.productid
    this.cartType = localStorage.getItem('cartType')
    this.upgradePurchase = localStorage.getItem('upgradePurchase')
    if (this.$route.query.upgradeLevelId) {
      this.upgradeLevelId = this.$route.query.upgradeLevelId
    }
    this.getGoodsDetail()
  },
  data () {
    return {
      goodsdesc: '', // 产品描述直接从接口获取
      cartType: 2, // 1:云购物车 2：实体购物车. 默认实体购物车
      productId: '',
      isinShopCar: false, // 加入过购物车之后显示小红点
      upgradePurchase: false, // ture 表示升级补货，false普通进货
      upgradeLevelId: '', // 升级的id信息(升级补货的情况下必填，普通情况不填）
      productObj: ''
    }
  },
  methods: {
    goDetail () {
      this.$router.push({name: 'GoTruck'})
    },
    goIndex () {
      this.$router.replace({name: 'Home'})
    },
    goChooseSize () {
      this.productObj.toChooseSize = true
    },
    getGoodsDetail () {
      this.$http.get('stock/getProductDetail', {
        params: {
          productId: this.productId,
          upgradePurchase: this.upgradePurchase,
          cartType: this.cartType,
          upgradeLevelId: this.upgradeLevelId || ''
        }
      }).then((res) => {
        this.goodsdesc = res.data.data.htmlDesc
        this.productObj = {
          count: 0,
          pictureList: res.data.data.pictureList, // 轮播图列表
          primaryPicFilePath: res.data.data.sizeList.length > 0 ? res.data.data.sizeList[0].picUrl : '', // 默认小图路径
          marketPrice: res.data.data.marketPrice, // 零售价
          productName: res.data.data.productName, // 产品的名称
          productId: this.productId, // 产品的id
          retailPrice: res.data.data.retailPrice, // 进货价
          SizeretailPrice: res.data.data.sizeList.length > 0 ? res.data.data.sizeList[0].marketPrice : '', // 进货价
          salesActual: res.data.data.salesActual, // 已经销售数量
          sizeList: res.data.data.sizeList, // 产品的规格
          SizeInCarNum : res.data.data.sizeList.length > 0 ? (res.data.data.sizeList[0].updateProductCount ? res.data.data.sizeList[0].updateProductCount : 0) : (res.data.data.upperProduct ? res.data.data.upperProduct : 0), // 默认选中的规格的产品在购物车中的数量
          SizeActiveId: res.data.data.sizeList.length > 0 ? res.data.data.sizeList[0].id : '', // 默认当前选中的规格id是第一个规格或者空
          stockAmount: res.data.data.stockAmount, // 产品库存
          cartType: this.cartType,
          defaultbuyNum: 1, // 默认要买的数量，点击选择规格的时候可以选择
          isinShopCar: false, // 购物车底部是否有小红点
          toChooseSize: false // 默认当前不是在选择尺寸的状态
        }
      }, () => {})
    },
    // 添加到购物车
    addCart () {
      this.productObj.toChooseSize = true
      // if (this.productObj.sizeList.length > 0) {
      //   this.productObj.toChooseSize = true
      // } else {
      //   this.$refs.choseSize.addProductToCart()
      // }
    },
    // 加入进货车成功之后需要同步改变dom上具体数量
    changeListInCarNum (buynum) {
      var sizeList = this.productObj.sizeList
      for (var i in sizeList) {
        if (sizeList[i].id == this.productObj.SizeActiveId) {
          sizeList[i].updateProductCount = buynum
        }
      }
      this.productObj.sizeList = sizeList
      this.productObj.SizeInCarNum = buynum
    }
  },
  components: {
    ChooseSize
  }
}
</script>

<style lang="less" scoped>
.goods-detail{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow-y: scroll;
  bottom: 0;
  z-index: 96;
  padding-top: .46rem;
  margin: auto;
  background-color:#f5f5f5;
  .goodsdeailtop{
    display: flex;
    flex-direction: column;
    background-color: #fff;
    width: 100%;
    .goodspic{
      width: 3.75rem;
      height: 2.26rem;
    }
    p{
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 .2rem;
      height: .45rem;
      font-size: .14rem;
      color: #666;
      .jhpric{
        color: #FF0000;
        font-size: .18rem;
      }
      .lspric{
        text-decoration: line-through;
      }
      img{
        width: .1rem;
        height: .17rem;
      }
    }
    .ggbox{
      border-top: .1rem solid #f5f5f5;
      height:.55rem;
    }
  }
  .deco{
    height: .5rem;
    width: 100%;
    text-align: center;
    line-height: .46rem;
    background-color: #f5f5f5;
    font-size: .18rem;
    text-align: center;
    color: #00A2E9;
    span{
      font-weight: bold;
      padding: 0 .08rem .05rem;
      border-bottom: .02rem solid #00A2E9;
    }
  }
  .goodsdesc{
    width: 100%;
    overflow: hidden;
    margin-bottom: .8rem;
    /deep/img{
      max-width: 100%;
    }
  }
  .goosdetailfooter{
    width: 100%;
    z-index: 100;
    height: .5rem;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    background-color: #fff;
    color:rgba(51,51,51,1);
    p{
      display: flex;
      width: .76rem;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      img{
        width: .17rem;
        height: .17rem;
        margin-bottom: .04rem;
      }
      .redpoint{
        width: .08rem;
        height: .08rem;
        border-radius: 100%;
        position: absolute;
        top: .05rem;
        right: .26rem;
        background-color: red;
      }
    }
    .joincar{
      flex: 1;
      background-color: #00A2E9;
      color: #fff;
      font-size: .16rem;
    }
  }
}
</style>
