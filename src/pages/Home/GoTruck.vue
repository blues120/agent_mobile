<template>
  <div class="set-myinfo">
    <!--警告提示符-->
    <div v-transfer-dom>
      <popup v-model="showError" position="top" :show-mask="false">
        <div class="position-vertical-demo">
          您尚未选中任何商品奥~
        </div>
      </popup>
    </div>
    <!--弹出警告-->
    <div v-transfer-dom>
      <confirm v-model="showWaring"
               title="提示"
               @on-cancel="onCancel"
               @on-confirm="onConfirm">
        <p style="text-align:center;">确定删除该商品吗？</p>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showWaringSingle"
               title="提示"
               @on-cancel="onCancel"
               @on-confirm="deletsingle">
        <p style="text-align:center;">确定删除该商品吗？</p>
      </confirm>
    </div>
    <!--全选和编辑-->
    <section class="fncbox" v-if="goodsList.length>0">
        <div>
          <input type="checkbox" id="chooseall"  @change="chooseall()"  v-model="checks">
          <label for="chooseall">全选</label>
        </div>
        <p @click="deletgoods" v-if="goDelet" class="deletbtn">删除</p>
        <p @click="editgoods" v-else>编辑</p>
    </section>
    <!--商品信息部分-->
    <section  class="goodsbox" v-if="goodsList.length>0">
      <div  class="eachGoods"  v-for="(goods,index) in goodsList" v-bind:key="index">
        <input type="checkbox" :id="goods.cartId"  :value="goods.cartId" v-model="goodsArry">
        <label :for="goods.cartId"></label>
        <img :src="goods.productPicUrl" alt="" class="goodspic">
        <div class="goodsdeletPart" v-show="goDelet">
          <div class="countdiv">
            <p class="countbtnleft"  :class="goods.totalCartProductCount ==1?'noreduce':''" @click="goods.totalCartProductCount>1?reduceGoods(goods):''">-</p>
            <x-input type="number" class="accountinpu" text-align="center" :show-clear="false" v-model="goods.totalCartProductCount"  @on-blur="changeGoodsNum(goods)" @on-focus="saveTemp(goods)"></x-input>
            <p class="countbtnright" @click="addGoods(goods)">+</p>
          </div>
          <p class="deletpart" @click="deleteThis(goods.cartId)">删除</p>
        </div>
        <div class="goodsdetail" v-show="!goDelet">
          <span class="productname">{{goods.productName}}</span>
          <div><span v-if="goods.sizeName" class="productsizename">{{goods.sizeName}}</span></div>
          <p><span>¥{{goods.agentPrice}} <span class="cloudFlag" v-if="cartType==1">云库存</span> </span><span class="goodsnum">X{{goods.totalCartProductCount}}</span></p>
        </div>
      </div>
    </section>
    <div class="empbox" v-else>
      <img src="~@/assets/images/gopurchase/goodstocar.png" alt="" class="icon">
      <span>进货车空空如也，赶紧去逛逛吧!</span>
      <p @click="goShop">去选购</p>
    </div>
    <!--底部结算-->
    <section class="footersettlement" v-if="goodsList.length>0">
      <div class="footleft">
        <span>合计： </span><span class="dd-price">¥{{totalPrice}}</span>
      </div>
      <div class="surebtn" @click="gobackedit" v-if="goDelet" >完成</div>
      <div class="surebtn" @click="gosettlement" v-else >结算 <span v-show="goodsArry.length>0">({{goodsArry.length}})</span></div>
    </section>
  </div>
</template>

<script>
import {Confirm, XHeader, Popup, TransferDom, XInput} from 'vux'
import Qs from 'qs'
export default {
  name: 'GoTruck',
  directives: {
    TransferDom
  },
  data () {
    return {
      showError: false,
      cartType: 2,
      upgradePurchase: false,
      upgradeLevelId: '',
      firstPurchase: false, // 默认不是首次进货
      showWaring: false,
      deletindex: '', // 希望删除的商品的 cartid
      showWaringSingle: false,
      deletAll: false, // 是删除全部
      checks: false, // 默认没有全部选中
      goDelet: false, // 当前是非删除状态
      goodsList: [], // 接口返回的所有的进货车内的商品
      goodsArry: [] // 进货车中选中的商品
    }
  },
  components: {
    XHeader,
    Popup,
    Confirm,
    XInput
  },
  computed: {
    totalPrice: function () {
      var newprice = 0
      for (var i = 0; i < this.goodsArry.length; i++) {
        for (var j = 0; j < this.goodsList.length; j++) {
          if (this.goodsArry[i] === this.goodsList[j].cartId) {
            newprice += this.goodsList[j].agentPrice * this.goodsList[j].totalCartProductCount
          }
        }
      }
      return newprice
    }
  },
  created () {
    if (localStorage.getItem('cartType')) {
      this.cartType = localStorage.getItem('cartType')
    }
    if (this.$route.query.selectArry) { // 如果是一键补货的，会把选中的商品的 id 数组传过来，获取列表成功后，选中数组中的id 的商品将会被选中
      this.goodsArry = this.$route.query.selectArry
    }
    if (this.$route.query.firstPurchase) { // 如果是首次进货
      this.firstPurchase = this.$route.query.firstPurchase
    }
    this.upgradePurchase = localStorage.getItem('upgradePurchase') || false
    this.getCartDetails()
  },
  methods: {

    getCartDetails () {
      this.$http.get('cart/getCartDetails', {
        params: {
          cartType: this.cartType,
          upgradePurchase: this.upgradePurchase,
          upgradeLevelId: this.upgradeLevelId
        }
      }).then((res) => {
        this.goodsList = res.data.data
        if (this.goodsArry.length === this.goodsList.length) {
          this.checks = true
        }
      }, () => {})
    },
    goShop () {
      this.$router ? this.$router.back() : window.history.back()
    },
    chooseall () {
      if (this.checks) {
        var listArr = []
        for (var i = 0; i < this.goodsList.length; i++) {
          listArr.push(this.goodsList[i].cartId)
        }
        this.goodsArry = listArr
      } else {
        this.goodsArry = []
      }
    },
    onCancel () {
      // console.log('on cancel')
    },
    onConfirm (msg) {
      if (this.goodsArry.length > 0) {
        var deletArr = this.goodsList
        for (var i = 0; i < this.goodsArry.length; i++) {
          for (var j = 0; j < deletArr.length; j++) {
            if (this.goodsArry[i] === deletArr[j].cartId) {
              deletArr.splice(j, 1)
            }
          }
        }
        this.goodsList = deletArr
        this.goodsArry = []
        this.goDelet = false
      }
    },
    deletsingle () {
      this.deletGoods(this.deletindex)
      this.goDelet = false
    },
    deletGoods (id) {
      this.$http.delete('cart/deleteProductFromCart', {
        params: {
          cartId: id
        }
      }).then((res) => {
        for (var i in this.goodsList) {
          if (this.goodsList[i].cartId === this.deletindex) {
            this.$vux.toast.text('删除成功', 'middle')
            this.goodsList.splice(i, 1)
          }
        }
      }, () => {})
    },
    deleteThis (index) {
      this.deletindex = index
      this.showWaringSingle = true
    },
    gobackedit: function () {
      this.goDelet = false
    },
    editgoods: function () {
      this.goDelet = true
    },
    deletgoods: function () {
      if (this.goodsArry.length > 0) {
        this.showWaring = true
      } else {
        this.showError = true
      }
    },
    uniqueObj (array, attr) { // 对象去重方法
      var allArr = [] // 建立新的临时数组
      var idsArr = []
      for (let i = 0; i < array.length; i++) {
        if (idsArr.indexOf(parseInt(array[i][attr])) === -1) {
          idsArr.push(parseInt(array[i][attr]))
          allArr.push(array[i])
        }
      }
      return allArr
    },
    gosettlement () { // 点击购物车去结算进入进货车页面
      if (this.goodsArry.length > 0) {
        var templeCarList = []
        for (var i = 0; i < this.goodsArry.length; i++) {
          for (var j = 0; j < this.goodsList.length; j++) {
            if (this.goodsList[j].cartId === this.goodsArry[i]) {
              templeCarList.push(this.goodsList[j])
            }
          }
        }
        templeCarList = this.uniqueObj(templeCarList, 'cartId') // 去一下重
        window.localStorage.setItem('templeCarList', JSON.stringify(templeCarList)) // 将选中的商品暂时放入缓存中，确认订单后或者下次进入本页面清除缓存
        this.$http.post('cart/settleAccounts', {
          firstPurchase: this.firstPurchase,
          upgradePurchase: this.upgradePurchase,
          upgradeLevelId: this.upgradeLevelId,
          list: templeCarList
        }).then((res) => {
          if (res) {
            this.$router.push({name: 'GoSettlement'})
          }
        }, () => {})
      //   console.log('templeCarList', JSON.stringify(templeCarList))
      }
    },
    reduceGoods (goods) {
      var productNum = parseInt(goods.totalCartProductCount) - 1
      this.addProductToCart(goods, productNum)
    },
    addGoods (goods) {
      var productNum = parseInt(goods.totalCartProductCount) + 1
      this.addProductToCart(goods, productNum)
    },
    changeGoodsNum (goods) {
      var result = this.addProductToCart(goods, goods.totalCartProductCount)
      if (!result) {
        goods.totalCartProductCount = localStorage.getItem('templAccount')
      }
    },
    saveTemp (goods) {
      localStorage.setItem('templAccount', parseInt(goods.totalCartProductCount))
    },
    // 设置购物车中商品数量
    addProductToCart (goods, productNum) {
      var objpara = {
        productId: goods.productId,
        sizeId: goods.productSizeId,
        productNum: productNum,
        cartType: this.cartType
      }
      objpara = Qs.stringify(objpara)
      this.$http.post('cart/addProductToCart', objpara).then((res) => {
        if (res.data.code === '200') {
          goods.totalCartProductCount = productNum
          return true
        }
      }, () => {})
    }
  },
  watch: {
    'goodsArry': function () {
      if (this.goodsArry.length === this.goodsList.length) {
        this.checks = true
      } else {
        this.checks = false
      }
    },
    showError (val) {
      if (val) {
        setTimeout(() => {
          this.showError = false
        }, 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  textarea::-webkit-input-placeholder{
    color: rgba(153,153,153,1) !important;
  }
  input[type="checkbox"]{
    display:none;
  }
  input[type="checkbox"] + label:before {
    content: '';
    display: inline-block;
    width: .16rem;
    height: .16rem;
    border:.01rem solid;
    border-radius: 50%;
    vertical-align: middle;
    margin:0 .1rem 0 .24rem;
    transition: all .5s;
  }
  input[type="checkbox"]:checked + label:before {
    background-image: url('~@/assets/images/gosettlement/checked.png');
    background-repeat: no-repeat;
    background-size: cover;
  }

  body{
    font-size: .15rem;
    .set-myinfo{
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 90;
      padding-top: .46rem;
      background-color: #f5f6f7 ;
      .fncbox{
        width: 100%;
        height: .34rem;
        display: flex;
        background-color: #fff;
        justify-content: space-between;
        font-size: .15rem;
        padding-right:.14rem;
        margin-top: .1rem;
        color:rgba(102,102,102,1);
        align-items: center;
        border-bottom: .01rem solid rgba(153,153,153,.1);
        .deletbtn{
          color: red;
        }
      }
      .goodsbox{
        width: 100%;
        background-color: #fff;
        margin-bottom: .5rem;
        .eachGoods{
          width: 100%;
          display: flex;
          align-items: center;
          border-bottom:.01rem solid  rgba(153,153,153,.1);
          .goodspic{
            width: .9rem;
            height: .9rem;
            margin-right:  .1rem;
          }
          .goodsdetail{
            flex: 1;
            height: 1.06rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: .22rem .15rem .20rem 0;
            font-size: .12rem;
            .productsizename{
              font-size: .1rem;
              padding: .05rem .1rem;
              background-color: #F5F5F5;
              border-radius: .15rem;
            }
            p{
              font-size: .15rem;
              width: 100%;
              display: flex;
              justify-content: space-between;
              .goodsnum{
                font-size: .11rem;
              }
              .cloudFlag{
                padding: .02rem .05rem;
                color: #fff;
                font-size: .1rem;
                background-color:#00A2E9 ;
                border-radius: .1rem;
              }
            }
          }
          .goodsdeletPart{
            display: flex;
            flex: 1;
            justify-content: space-around;
            align-items: center;
            .countdiv{
              display: flex;
              align-items: center;
              width: 1rem;
              height: .2rem;
              /deep/.weui-cell{
                padding: 0;
              }
              /deep/.weui-cell:before{
                display: none;
              }
              .accountinpu{
                flex: 1;
                background-color: #f1f1f1;
              }
              .countbtnleft{
                width: .2rem;
                height:.2rem;
                text-align: center;
                line-height: .2rem;
                border-top-left-radius: 50%;
                border-bottom-left-radius: 50%;
                background-color: #fbfbfb;
                border: .01rem solid #f1f1f1;
                box-sizing: border-box;
              }
              .countbtnright{
                width: .2rem;
                height:.2rem;
                text-align: center;
                line-height: .2rem;
                border-top-right-radius: 50%;
                border-bottom-right-radius: 50%;
                background-color: #fbfbfb;
                border: .01rem solid #f1f1f1;
                box-sizing: border-box;
              }
              .noreduce{
                background-color: #f1f1f1 !important;
              }
              input{
                width: .6rem;
                height: 100%;
                text-align: center;
                outline: none;
                background-color: #f1f1f1;
                border: .01rem solid #f1f1f1;
                box-sizing: border-box;
                border-left: none;
                border-right: none;
              }
            }
            .deletpart{
              width: .5rem;
              height: .9rem;
              line-height: .9rem;
              text-align: center;
              font-size: .16rem;
              margin-top: .14rem;
              background-color:#9c9fa6 ;
              color:#fff
            }
          }
        }
        .eachGoods:last-child{
          border-bottom:none
        }
      }
      .empbox{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1.6rem;
        img{
          width: .66rem;
          height: .66rem;
          margin-bottom: .12rem;
        }
        p{
          color: #fff;
          background-color: #00A2E9;
          padding: .12rem .25rem;
          margin-top: .2rem;
          border-radius: .2rem;
        }
      }
      .footersettlement{
        display: flex;
        position: fixed;
        width: 100%;
        height: .49rem;
        background-color: #fff;
        left: 0;
        bottom: 0;
        font-size: .16rem;
        .surebtn{
          width: 1.03rem;
          height: 100%;
          text-align: center;
          line-height: .49rem;
          background:rgba(0,162,233,1);
          color: #fff;
          font-size: .17rem;
        }
        .footleft{
          height: 100%;
          flex: 1;
          display: flex;
          align-items: center;
          padding-left: .14rem;
          .dd-price{
            color: #FF0000;
          }
        }
      }
    }
  }
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #333;
    font-size: .16rem;
    text-align: center;
    padding: 15px;
  }
</style>
