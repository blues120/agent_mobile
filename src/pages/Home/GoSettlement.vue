<template>
    <div class="go-settlement">
      <!--选择地址弹窗-->
      <div v-transfer-dom>
        <popup v-model="chooseadd" position="bottom" max-height="65%">
          <div class="fnctop"><span>选择地址</span><span class="closebtn" @click="closezz">X</span></div>
          <div class="addpartbox">
            <group>
              <div v-for="(list,index) in addressList" :key="index"  class="newsmalladdbox">
                <input type="radio" :id="list.id"  :value="list.id" v-model="selectaddressid" @click="selectAdd(list.id)">
                <label :for="list.id"></label>
                <div @click="selectAdd(list.id)" class="addinfobox">
                  <p class="adduserinfo"><span>{{list.name}}</span> <span style="margin-left: 10px;">{{list.mobile}}</span></p>
                  <p>
                    {{list.detail}}
                  </p>
                </div>
                <img src="~@/assets/images/eddit.png" alt="" class="editicon" @click="editAddress(list)">
              </div>
            </group>
          </div>
          <div>
            <p @click="addnewAdd" class="addnewaddbtn"> 添加新地址 </p>
          </div>
        </popup>
      </div>
      <!--编辑/新建地址弹窗-->
      <div v-transfer-dom>
        <popup v-model="edditmyadd" position="bottom" max-height="80%">
          <div class="fnctop"><span>{{createAdd?'新建':'编辑'}}收货地址</span><span class="closebtn" @click="closeeditzz">X</span></div>
          <div class="addpartbox" style="height: 3.4rem">
            <group>
              <div class="aibox">
                <img src="~@/assets/images/gosettlement/addicon.png" alt="" class="newaddicon">
                <span>智能地址</span>
                <cell
                  title="（在下方粘贴整段地址信息，系统自动识别）"
                  is-link
                  :border-intent="false"
                  :arrow-direction="showAiAddress ? 'up' : 'down'"
                  @click.native="showAiAddress = !showAiAddress"></cell>
              </div>
              <div class="slide" :class="showAiAddress?'animate':''">
                <textarea class="AiAddress" name="" v-model="robotAddress" id="AiAddress" placeholder="例：微小妹，13500000000，浙江省杭州市拱墅区某某街道某某门牌号（特别说明：r若要地址识别度高，请隔开展示姓名、电话、地址三段信息"></textarea>
                <p class="funcbtnbox">
                    <span @click="emptAddress">清除内容</span>
                    <span class="subbtnnow" @click="submitAddress">提交</span>
                </p>
              </div>
            </group>
            <div class="groupitem">
              <span>收货人</span>
              <input type="text" placeholder="请填写收货人姓名" class="userName" v-model="newSaveAddressObj.name">
            </div>
            <div class="groupitem">
              <span>手机号码</span>
              <x-input type="tel" :show-clear="false" is-type="china-mobile" placeholder="请填写手机号码" class="userTel"  v-model="newSaveAddressObj.mobile"></x-input>
            </div>
            <group>
              <x-address title="省市区选择" :popup-style="{zIndex: 502}" @on-shadow-change="onShadowChange"  v-model="newSaveAddressObj.value" :list="addressData" placeholder="请选择地址" value-text-align="left"></x-address>
            </group>
            <div class="groupitem">
              <input type="text" placeholder="请输入街道门牌信息" class="adddetail"  v-model="newSaveAddressObj.detail">
            </div>
            <group style="padding-left:8px;background-color: #fff;border: 0;">
              <x-switch title="设为默认地址" v-model="newSaveAddressObj.isDefault"></x-switch>
            </group>
            <div class="funcaddressbox">
              <span class="giewxadd">获取微信收货地址</span>
              <span class="sperateline">|</span>
              <span @click="clearNowAddress">清除当前地址</span>
            </div>
          </div>
          <div  class="newbrnbox">
            <p  class="deletnewaddbtn" v-if="!createAdd" @click="goDelet(newSaveAddressObj.id)"> 删除 </p>
            <p  class="savenewaddbtn" @click="savenewadd"> 保存 </p>
          </div>
        </popup>
      </div>
      <!--地址栏信息部分-->
      <section class="address" v-if="cartType==2" @click="chooseaddress(addressInfoObj?addressInfoObj.id:'')">
        <img src="~@/assets/images/gosettlement/address.png" alt="" class="addressicon">
        <div class="userinfo" v-if="addressInfoObj">
          <div class="uinfotop">
            <span class="uname">{{addressInfoObj.name}}</span>
            <span class="tel">{{addressInfoObj.mobile}}</span>
            <span class="addressflag" v-if="addressInfoObj.isDefault==1">默认</span>
          </div>
          <p>
            {{addressInfoObj.detail}}
          </p>
        </div>
        <div class="userinfo" v-else style="font-size: 16px;line-height: 75px;">暂无地址，现在去添加一个~</div>
        <img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="morecz">
      </section>
      <!--快递配送信息要求部分-->
      <section class="fmsmsg">
          <div class="fmsdetail"  v-if="cartType==2">
            <span>配送方式</span>
            <span>快递</span>
          </div>
          <div class="fmsdetail" v-if="cartType==2">
            <span>运费</span>
            <span>¥ {{postPrice}}</span>
          </div>
          <p class="cloudDescTip" v-if="cartType==1">选择云订单后，商品将以虚拟方式存在您的云库存中</p>
          <div class="fmsask">
            <textarea name="" id=""  placeholder="您对订单有什么要求，可以在这里备注！" v-model="buyerMessage"></textarea>
          </div>
      </section>
      <!--商品信息部分-->
      <section  class="goodsbox">
        <div class="eachGoods" v-for="(list,index) in templeCarList" :key="index">
          <img :src="list.productPicUrl" alt="" class="goodspic">
          <div class="goodsdetail">
              <span>{{list.productName}}</span>
              <p><span>¥ {{list.agentPrice}}</span><span class="goodsnum">X{{list.totalCartProductCount}}</span></p>
          </div>
        </div>
      </section>
      <!--底部结算-->
      <section class="footersettlement">
        <div class="footleft">
          <span>合计： </span><span class="dd-price">¥ {{totalPrice}}</span>
        </div>
        <div class="surebtn" @click="goSureOrder">确认订单</div>
      </section>
      <div v-transfer-dom>
        <confirm v-model="deleAddress"
                 title="删除地址"
                 @on-confirm="sureDelet">
          <p style="text-align:center;">确认删除该地址吗？</p>
        </confirm>
      </div>
      <pay-now :payObj="payObj"></pay-now>
      <page-view></page-view>
    </div>
</template>

<script>
import {Confirm, XDialog, TransferDom, Popup, Group, Cell, XButton, ChinaAddressV4Data, XAddress, XSwitch, XInput} from 'vux'
import Qs from 'qs'
import PageView from '@/components/PageView'
import payNow from '@/components/payNow'
export default {
  name: 'GoSettlement',
  components: {
    XAddress,
    Popup,
    Group,
    Confirm,
    Cell,
    XButton,
    XInput,
    XSwitch,
    PageView,
    payNow,
    XDialog
  },
  data () {
    return {
      cartType: 2,
      addressData: ChinaAddressV4Data,
      createAdd: false, // 是否是新建一个地址
      edditmyadd: false, // 是否显示编辑（新建地址弹窗）
      selectaddressid: '', // 选中的地址的id
      chooseadd: false,
      showAiAddress: false, // 是否显示智能地址
      value: [ ],
      userPassword: '', // 用户如果在线支付需要输入的登录密码
      showWaring: false, // 展示warning
      postPrice: 0, // 快递运费
      buyerMessage: '', // 订单的具体要求
      templeCarList: [], // 存放临时商品信息数组
      addressId: '', // 选中的地址的id拼接成的字符串
      addressInfoObj: {}, // 当前选中的地址对象集合
      addressList: [], // 查询到的选择地址列表
      robotAddress: '', // 粘贴的智能识别的地址
      deleAddress: false, // 是否删除地址信息提示框
      goDeletAddressId: '', // 需要删除的地址id
      choosePayWay: '', // 选择支付方式，默认余额支付
      orderId: '', // 确认订单后可以得到订单的 orderId
      newSaveAddressObj: { // 新保存的地址信息对象
        name: '',
        mobile: '',
        detail: '',
        tag: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        value: ['110000', '110100', '110101'],
        isDefault: false // 是否是默认地址
      },
      addressUpdate: true, // 刚进入本页面，默认true代表需要请求一次地址列表，查询之后变为false，用户点击地址栏不需要请求。新增或者编辑过后，重置为true。需要重新请求一次数据
      confirmOrder: false, // 点击确认订单进入确认订单弹窗
      upgradePurchase: false,
      upgradeLevelId: '',
      totalPrice: 0, // 总价格
      firstPurchase: false, // 默认不是首次进货
      payObj: {
        showWaring: false, // 是否显示离开支付页面默认不显示
        confirmOrder: false, // 是否点击了立即支付
        PayDetailObj: {}, // 支付对象
        inputPasStep: false, // 是否去输入密码
        userPassword: '' // 如果是线下支付，用户输入的登录密码
      },
      inputPasStep: false // 默认是否到了输入密码步骤
    }
  },
  directives: {
    TransferDom
  },
  created () {
    if (localStorage.getItem('cartType')) {
      this.cartType = localStorage.getItem('cartType')
    }
    if (localStorage.getItem('upgradePurchase')) {
      this.upgradePurchase = localStorage.getItem('upgradePurchase')
    }
    this.templeCarList = JSON.parse(window.localStorage.getItem('templeCarList'))
    var totalPrice = 0
    for (var i in this.templeCarList) {
      totalPrice += parseFloat(this.templeCarList[i].agentPrice) * parseFloat(this.templeCarList[i].totalCartProductCount)
    }
    this.totalPrice = totalPrice
    this.getDefaultAddress()
  },
  methods: {
    onConfirm () { // 确定离开支付跳转到其他页面
      this.confirmOrder = false
      this.$router.replace({name: 'myOrders'})
    },
    getDefaultAddress () {
      this.$http.get('placeOrders/getAgentDefaultShippingAddress').then((res) => {
        if (res) {
          this.addressInfoObj = res.data.data
          this.addressId = [res.data.data.provinceId, res.data.data.cityId, res.data.data.countyId].join(',')
          this.getPostPrice()
        } else {
          this.addressInfoObj = null
        }
      }, () => {})
    },
    getAddressList (id) {
      if (id) {
        this.selectaddressid = id
      }
      if (this.addressUpdate === true) {
        this.$http.get('placeOrders/getAgentShippingAddressList').then((res) => {
          this.addressList = res.data.data ? res.data.data : []
          this.chooseadd = true
          this.addressUpdate = false
        }, () => {})
      } else {
        this.chooseadd = true
      }
    },
    getPostPrice () {
      this.$http.get('placeOrders/getFreightPrice', {
        params: {
          addressId: this.addressId
        }
      }).then((res) => {
        this.postPrice = res.data.data
      }, () => {})
    },
    goSureOrder () { // 先提交订单，后请求支付方式，选择支付方式支付
      var objpara = {
        buyerMessage: this.buyerMessage,
        address: this.addressInfoObj,
        cartType: this.cartType,
        cartList: this.templeCarList,
        firstPurchase: this.firstPurchase,
        upgradePurchase: this.upgradePurchase,
        upgradeLevelId: this.upgradeLevelId
      }
      this.$http.post('placeOrders/submitOrder', objpara,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ).then((res) => {
        this.orderId = res.data.orderId
        this.getPayWay(this.orderId)
      }, () => {})
    },
    getPayWay (orderId) {
      var paras = {
        orderId: orderId
      }
      paras = Qs.stringify(paras)
      this.$http.post('placeOrders/selectPayMethod', paras).then((res) => {
        this.payObj.PayDetailObj = res.data.data
        this.payObj.orderId = orderId
        this.payObj.choosePayWay = this.payObj.PayDetailObj.payMethod
        this.payObj.confirmOrder = true
        localStorage.setItem('PayDetailObj', JSON.stringify(this.payObj.PayDetailObj))
      }, () => {})
    },
    closezz () {
      this.chooseadd = false
      this.confirmOrder = false
    },
    savenewadd () { // 保存地址
      var that = this
      console.log('this.newSaveAddressObj', this.newSaveAddressObj)
      var newSaveAddressObj = this.newSaveAddressObj
      if (!newSaveAddressObj.name) {
        this.$vux.toast.text('姓名不能为空!', 'middle')
        return false
      }
      if (!newSaveAddressObj.mobile) {
        this.$vux.toast.text('手机不能为空!', 'middle')
        return false
      }
      if (!newSaveAddressObj.provinceId) {
        this.$vux.toast.text('省ID不能为空!', 'middle')
        return false
      }
      if (!newSaveAddressObj.cityId) {
        this.$vux.toast.text('城市不能为空!', 'middle')
        return false
      }
      if (!newSaveAddressObj.countyId) {
        this.$vux.toast.text('区不能为空!', 'middle')
        return false
      }
      if (!newSaveAddressObj.detail) {
        this.$vux.toast.text('详细地址不能为空!', 'middle')
        return false
      }
      var addressEntity = {
        name: newSaveAddressObj.name,
        mobile: newSaveAddressObj.mobile,
        provinceId: newSaveAddressObj.provinceId,
        cityId: newSaveAddressObj.cityId,
        countyId: newSaveAddressObj.countyId,
        detail: newSaveAddressObj.detail,
        isDefault: newSaveAddressObj.isDefault ? '1 ' : '0',
        tag: newSaveAddressObj.tag
      }
      if (this.createAdd) { // 如果是新增
        this.$http.post('placeOrders/saveTheShippingAddress', addressEntity).then((res) => {
          this.$vux.toast.text('新增地址成功!', 'middle')
          this.addressUpdate = true
          if (addressEntity.isDefault == 1 || !this.addressInfoObj) {
            this.addressInfoObj = addressEntity
            this.addressInfoObj.address = newSaveAddressObj.address
            this.addressInfoObj.id = '' // 新增地址是默认地址的话，暂不知道默认地址的id
            this.selectaddressid = '' // 新增地址是默认地址的话，暂不知道默认地址的id
            this.addressId = [addressEntity.provinceId, addressEntity.cityId, addressEntity.countyId].join(',')
            this.getPostPrice()
          }
          setTimeout(() => {
            that.edditmyadd = false
          }, 100)
        }, () => {})
      } else { // 如果是编辑
        addressEntity.id = newSaveAddressObj.id
        this.$http.post('placeOrders/updateTheShippingAddress', addressEntity).then((res) => {
          this.$vux.toast.text('保存地址成功!', 'middle')
          this.addressUpdate = true
          if (addressEntity.isDefault == 1) {
            this.addressInfoObj = addressEntity
            this.addressId = [addressEntity.provinceId, addressEntity.cityId, addressEntity.countyId].join(',')
            this.getPostPrice()
          }
          setTimeout(() => {
            that.edditmyadd = false
          }, 100)
        }, () => {})
      }
    },
    goDelet (id) {
      this.goDeletAddressId = id
      this.deleAddress = true
    },
    sureDelet () {
      var that = this
      this.$http.delete('placeOrders/deleteTheShippingAddress', {
        params: {
          id: this.goDeletAddressId
        }
      }).then((res) => {
        this.$vux.toast.text('地址删除成功!', 'middle')
        for (var i in this.addressList) { // 如果删除地址的时候删到默认地址就在请求一次新的默认地址
          if (this.addressList[i].id == this.goDeletAddressId) {
            if (this.addressList[i].isDefault ==1) {
              this.getDefaultAddress()
            }
          }
        }
        this.addressUpdate = true
        setTimeout(() => {
          that.edditmyadd = false
        }, 100)
      }, () => {})
    },
    submitAddress () {
      this.RoBotKnowAddress(this.robotAddress)
    },
    emptAddress () {
      this.robotAddress = ''
    },
    RoBotKnowAddress (str) {
      this.$http.post('placeOrders/addressResolve', {
        addressText: str
      }).then((res) => {
        this.newSaveAddressObj.name = res.data.address.name
        this.newSaveAddressObj.mobile = res.data.address.mobile
        this.newSaveAddressObj.detail = res.data.address.detail
        this.newSaveAddressObj.provinceId = res.data.address.province_id
        this.newSaveAddressObj.cityId = res.data.address.city_id
        this.newSaveAddressObj.countyId = res.data.address.county_id
        this.newSaveAddressObj.value = [res.data.address.province_id, res.data.address.city_id, res.data.address.county_id]
      }, () => {})
    },
    onShadowChange (ids, names) {
      this.newSaveAddressObj.provinceId = ids[0]
      this.newSaveAddressObj.cityId = ids[1]
      this.newSaveAddressObj.countyId = ids[2]
      this.addressId = ids.join(',')
      this.newSaveAddressObj.address = names.join(' ')
      console.log(ids, names)
    },
    closeeditzz () {
      this.edditmyadd = false
    },
    addnewAdd () { // 点击底部添加新的地址
      this.newSaveAddressObj = {
        name: '',
        mobile: '',
        detail: '',
        tag: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        value: [],
        isDefault: false // 是否是默认地址
      }
      this.createAdd = true
      this.chooseadd = false
      this.edditmyadd = true
    },
    chooseaddress (id) {
      // 将当前点击的地址 id 传入列表 ,当前点击的地址默认选中
      this.getAddressList(id)
    },
    selectAdd (id) { // 选择地址页
      this.selectaddressid = id
      for (var i in this.addressList) {
        if (this.addressList[i].id == id) {
          this.addressInfoObj = this.addressList[i]
          this.addressId = [this.addressList[i].provinceId, this.addressList[i].cityId, this.addressList[i].countyId].join(',')
          this.getPostPrice()
        }
      }
      this.chooseadd = false // 关闭选择地址页面进入编辑地址页
    },
    editAddress (list) {
      this.newSaveAddressObj = list
      if (list.isDefault == 1) {
        this.newSaveAddressObj.isDefault = true
      } else {
        this.newSaveAddressObj.isDefault = false
      }
      this.newSaveAddressObj.value = [list.provinceId.toString(), list.cityId.toString(), list.countyId.toString()]
      this.createAdd = false
      this.chooseadd = false // 关闭选择地址页面进入编辑地址页
      this.edditmyadd = true
    },
    clearNowAddress () {
      var id = this.newSaveAddressObj.id
      this.newSaveAddressObj = {
        name: '',
        mobile: '',
        detail: '',
        tag: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        value: [],
        isDefault: false // 是否是默认地址
      }
      this.newSaveAddressObj.id = id
    }
  }
}
</script>

<style lang="less" scoped>
@import "gosettlement";
</style>
