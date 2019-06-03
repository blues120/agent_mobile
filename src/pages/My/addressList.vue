<template>
  <div class="address-list">
    <div class="addressItem" v-for="(list,inde) in addressList" :key="inde">
      <div class="top">
        <p class="addtop">
          <span>收货人：{{list.name}}</span>
          <span class="usertel">{{list.mobile}}</span>
        </p>
        <p class="detail">
          收货地址：{{list.address + list.detail}}
        </p>
      </div>
      <div class="bot">
        <p @click.prevent="setDefaultAdd(list.id)">
          <input type="radio" :id="list.id"  :value="list.id" v-model="selectaddressid">
          <label :for="list.id"></label>
          <span>设为默认</span>
        </p>
        <div class="fncright">
          <p  @click="editAdd(list.id)">
            <img src="~@/assets/images/my/editnew.png" class="moreicon">
            <span>编辑</span>
          </p>
          <p @click="deleteThisAdd(list.id)">
            <img src="~@/assets/images/my/deletnew.png" class="moreicon">
            <span>删除</span>
          </p>
        </div>
      </div>
    </div>
    <edit-address :AddressInfoObj="AddressInfoObj" @needUpdate="needUpdate"></edit-address>
    <p  class="newaddadd" @click="newadd">新增收货地址</p>
  </div>
</template>

<script>
import {TransferDom, Confirm} from 'vux'
import Qs from 'qs'
import editAddress from '@/components/editAddress'
export default {
  name: 'addlist',
  data () {
    return {
      selectaddressid: '', // 当前选中的地址的id
      addressList: [], // 获取的地址列表
      AddressInfoObj: {
        edditmyadd: false, // 是否显示编辑框
        createAdd: false, // 是否是新增，默认是false不是新增是编辑
        showAiAddress: false, // 是否显示智能地址
        newSaveAddressObj: {},
        deleAddress: false,
        robotAddress: '' // 粘贴的智能识别的地址
      }
    }
  },
  created () {
    this.getAddressList()
  },
  directives: {
    TransferDom
  },
  components: {
    editAddress,
    Confirm
  },
  methods: {
    needUpdate () {
      this.getAddressList()
    },
    setDefaultAdd (id) { // 将某个地址设为默认地址
      var param = {
        addressId: id
      }
      param = Qs.stringify(param)
      this.$http.post('address/setdefault', param).then((res) => {
        if (res.data.code == 200) {
          this.$vux.toast.text('设置成功', 'middle')
          this.selectaddressid = id
        }
      }, () => {})
    },
    getAddressList () {
      this.$http.get('placeOrders/getAgentShippingAddressList').then((res) => {
        this.addressList = res.data.data
        for (var i in this.addressList) {
          if (this.addressList[i].isDefault==1) {
            this.selectaddressid = this.addressList[i].id
          }
        }
      }, () => {})
    },
    deleteThisAdd (id) {
      this.AddressInfoObj.goDeletAddressId = id
      this.AddressInfoObj.deleAddress = true
    },
    editAdd (id) {
      this.AddressInfoObj.edditmyadd = true
      this.AddressInfoObj.createAdd = false
      for (var i in this.addressList) {
        if (this.addressList[i].id == id) {
          this.AddressInfoObj.newSaveAddressObj = this.addressList[i]
          console.log('this.addressList[i]', this.addressList[i])
          if (this.addressList[i].isDefault == 1) {
            this.AddressInfoObj.newSaveAddressObj.isDefault = true
          } else {
            this.AddressInfoObj.newSaveAddressObj.isDefault = false
          }
          this.AddressInfoObj.newSaveAddressObj.value = [this.addressList[i].provinceId.toString(), this.addressList[i].cityId.toString(), this.addressList[i].countyId.toString()]
        }
      }
    },
    newadd () {
      this.AddressInfoObj.edditmyadd = true
      this.AddressInfoObj.robotAddress = ''
      this.AddressInfoObj.createAdd = true
      var newSaveAddressObj = {
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
      this.AddressInfoObj.newSaveAddressObj = newSaveAddressObj
    }
  }
}
</script>

<style lang="less" scoped>
  .address-list{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 103;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    input[type="radio"]{
      display:none;
    }
    input[type="radio"] + label:before {
      content: '';
      display: inline-block;
      width: .16rem;
      height: .16rem;
      border:.01rem solid;
      border-radius: 50%;
      vertical-align: middle;
      margin:0 .05rem 0 0rem;
      transition: all .5s;
    }
    input[type="radio"]:checked + label:before {
      background-image: url('~@/assets/images/gosettlement/checked.png');
      background-repeat: no-repeat;
      background-size: cover;
    }
    .addressItem{
      width: 100%;
      margin-bottom: .1rem;
      background-color: #fff;
      height: 1.06rem;
      display: flex;
      flex-direction: column;
      padding: 0 .14rem;
      .top{
        display: flex;
        min-height: .7rem;
        border-bottom: .01rem solid #f5f5f5;
        flex-direction: column;
        justify-content: center;
        .addtop{
          width: 100%;
          display: flex;
          justify-content: space-between;
        }
        .detail{
          margin-top: .06rem;
          text-align: justify;
          display: -webkit-box;
          line-height: 1.4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp:2;
          overflow: hidden;
        }
      }
      .bot{
        width: 100%;
        height: .36rem;
        display: flex;
        align-items: center;
        .fncright{
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          p{
            height: 100%;
            display: flex;
            margin: 0 .1rem;
            align-items: center;
            img{
              width: .2rem;
              height: .2rem;
              margin-right: .06rem;
            }
          }
        }
      }
    }
    .newaddadd{
      width:3.11rem;
      height:.44rem;
      background:rgba(0,162,233,1);
      border-radius:.22rem;
      color: #fff;
      text-align: center;
      line-height: .44rem;
      margin: .5rem auto .15rem;
      font-size: .16rem;
    }
  }
  /deep/.weui-cells{
    margin-top: 0 !important;
  }
  /deep/.weui-cell__hd{
    /*display: none;*/
  }
  /*地址栏信息样式*/
  /deep/.weui-cells:before{
    border: 0 !important;
  }
  /deep/.weui-cells:after{
    border: 0 !important;
  }
</style>
