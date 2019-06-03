<template>
  <!--编辑/新建地址弹窗-->
  <div v-transfer-dom class="edit-address">
    <popup v-model="AddressInfoObj.edditmyadd" position="bottom" max-height="80%">
      <div class="fnctop"><span>{{AddressInfoObj.createAdd?'新建':'编辑'}}收货地址</span><span class="closebtn" @click="closeeditzz">X</span></div>
      <div class="addpartbox" style="height: 3.4rem">
        <group>
          <div class="aibox">
            <img src="~@/assets/images/gosettlement/addicon.png" alt="" class="newaddicon">
            <span>智能地址</span>
            <cell
              title="（在下方粘贴整段地址信息，系统自动识别）"
              is-link
              :border-intent="false"
              :arrow-direction="AddressInfoObj.showAiAddress ? 'up' : 'down'"
              @click.native="AddressInfoObj.showAiAddress = !AddressInfoObj.showAiAddress"></cell>
          </div>
          <div class="slide" :class="AddressInfoObj.showAiAddress?'animate':''">
            <textarea class="AiAddress" name="" v-model="AddressInfoObj.robotAddress" id="AiAddress" placeholder="例：微小妹，13500000000，浙江省杭州市拱墅区某某街道某某门牌号（特别说明：r若要地址识别度高，请隔开展示姓名、电话、地址三段信息"></textarea>
            <p class="funcbtnbox">
              <span @click="emptAddress">清除内容</span>
              <span class="subbtnnow" @click="submitAddress">提交</span>
            </p>
          </div>
        </group>
        <div class="groupitem">
          <span>收货人</span>
          <input type="text" placeholder="请填写收货人姓名" class="userName" v-model="AddressInfoObj.newSaveAddressObj.name">
        </div>
        <div class="groupitem">
          <span>手机号码</span>
          <x-input type="tel" :show-clear="false" is-type="china-mobile" placeholder="请填写手机号码" class="userTel"  v-model="AddressInfoObj.newSaveAddressObj.mobile"></x-input>
        </div>
        <group>
          <x-address class="addchose" title="省市区选择" :popup-style="{zIndex: 502}" @on-shadow-change="onShadowChange"  v-model="AddressInfoObj.newSaveAddressObj.value" :list="addressData" placeholder="请选择地址" value-text-align="left"></x-address>
        </group>
        <div class="groupitem">
          <input type="text" placeholder="请输入街道门牌信息" class="adddetail"  v-model="AddressInfoObj.newSaveAddressObj.detail">
        </div>
        <group style="padding-left:8px;background-color: #fff;border: 0;">
          <x-switch title="设为默认地址" v-model="AddressInfoObj.newSaveAddressObj.isDefault"></x-switch>
        </group>
        <div class="funcaddressbox">
          <span class="giewxadd">获取微信收货地址</span>
          <span class="sperateline">|</span>
          <span @click="clearNowAddress">清除当前地址</span>
        </div>
      </div>
      <div  class="newbrnbox">
        <p  class="deletnewaddbtn" v-if="!AddressInfoObj.createAdd" @click="goDelet(AddressInfoObj.newSaveAddressObj.id)"> 删除 </p>
        <p  class="savenewaddbtn" @click="savenewadd"> 保存 </p>
      </div>
    </popup>
    <div v-transfer-dom>
      <confirm v-model="AddressInfoObj.deleAddress"
               title="删除地址"
               @on-confirm="sureDelet">
        <p style="text-align:center;">确认删除该地址吗？</p>
      </confirm>
    </div>
  </div>
</template>

<script>

import { TransferDom, XDialog, Popup, XInput, Confirm, Group, Cell, XButton, ChinaAddressV4Data, XAddress, XSwitch } from 'vux'

export default {
  data () {
    return {
      addressData: ChinaAddressV4Data
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XAddress,
    Group,
    Popup,
    Confirm,
    Cell,
    XButton,
    XInput,
    XSwitch,
    XDialog
  },
  methods: {
    closeeditzz () {
      this.AddressInfoObj.edditmyadd = false
    },
    submitAddress () {
      this.RoBotKnowAddress(this.AddressInfoObj.robotAddress)
    },
    emptAddress () {
      this.AddressInfoObj.robotAddress = ''
    },
    RoBotKnowAddress (str) {
      this.$http.post('placeOrders/addressResolve', {
        addressText: str
      }).then((res) => {
        this.AddressInfoObj.newSaveAddressObj.name = res.data.address.name
        this.AddressInfoObj.newSaveAddressObj.mobile = res.data.address.mobile
        this.AddressInfoObj.newSaveAddressObj.detail = res.data.address.detail
        this.AddressInfoObj.newSaveAddressObj.provinceId = res.data.address.province_id
        this.AddressInfoObj.newSaveAddressObj.cityId = res.data.address.city_id
        this.AddressInfoObj.newSaveAddressObj.countyId = res.data.address.county_id
        this.AddressInfoObj.newSaveAddressObj.value = [res.data.address.province_id, res.data.address.city_id, res.data.address.county_id]
        this.AddressInfoObj.edditmyadd = false
        this.AddressInfoObj.edditmyadd = true
      }, () => {})
    },
    onShadowChange (ids, names) {
      this.AddressInfoObj.newSaveAddressObj.provinceId = ids[0]
      this.AddressInfoObj.newSaveAddressObj.cityId = ids[1]
      this.AddressInfoObj.newSaveAddressObj.countyId = ids[2]
      console.log(ids, names)
    },
    clearNowAddress () {
      var id = this.AddressInfoObj.newSaveAddressObj.id
      this.AddressInfoObj.newSaveAddressObj = {
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
      this.AddressInfoObj.newSaveAddressObj.id = id
    },
    savenewadd () { // 保存地址
      var that = this
      var newSaveAddressObj = this.AddressInfoObj.newSaveAddressObj
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
      if (this.AddressInfoObj.createAdd) { // 如果是新增
        this.$http.post('placeOrders/saveTheShippingAddress', addressEntity).then((res) => {
          this.$vux.toast.text('新增地址成功!', 'middle')
          this.$emit('needUpdate', true) // 列表页需要刷新一下
          setTimeout(() => {
            that.AddressInfoObj.edditmyadd = false
          }, 100)
        }, () => {})
      } else { // 如果是编辑
        addressEntity.id = newSaveAddressObj.id
        this.$http.post('placeOrders/updateTheShippingAddress', addressEntity).then((res) => {
          this.$vux.toast.text('保存地址成功!', 'middle')
          this.$emit('needUpdate', true) // 列表页需要刷新一下
          setTimeout(() => {
            that.AddressInfoObj.edditmyadd = false
          }, 100)
        }, () => {})
      }
    },
    goDelet (id) {
      this.AddressInfoObj.goDeletAddressId = id
      this.AddressInfoObj.deleAddress = true
    },
    sureDelet () {
      var that = this
      this.$http.delete('placeOrders/deleteTheShippingAddress', {
        params: {
          id: this.AddressInfoObj.goDeletAddressId
        }
      }).then((res) => {
        this.$vux.toast.text('地址删除成功!', 'middle')
        this.$emit('needUpdate', true) // 列表页需要刷新一下
        setTimeout(() => {
          that.AddressInfoObj.edditmyadd = false
        }, 100)
      }, () => {})
    }
  },
  props: ['AddressInfoObj']
}
</script>

<style lang="less" scope>
@import "../pages/Home/gosettlement";
.addchose{
  /deep/.weui-cell__hd{
    margin-right: .2rem;
  }
}
</style>
