<template>
  <div class="info-detail">
    <div class="infoItem" style="height: 60px">
      <span>微信</span>
      <p>
        <x-input  class="xinpu" text-align="right" @on-focus="wetchatchange" :show-clear="false" :value="wechat" v-model="wechat"></x-input>
      </p>
    </div>
    <div class="infoItem">
      <span>姓名</span>
      <p>
        <x-input :readonly="true" class="xinpu" text-align="right" :value="userInfo.name"></x-input>
      </p>
    </div>
    <!--<div class="infoItem">-->
      <!--<span>身份证</span>-->
      <!--<p>-->
        <!--<span>{{userInfo.idCard}}</span>-->
      <!--</p>-->
    <!--</div>-->
    <!--<div class="infoItem" @click="gotoCheckID">-->
      <!--<span>身份证照片</span>-->
      <!--<p>-->
        <!--<span style="color: #00A2E9">点击查看</span>-->
        <!--<img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">-->
      <!--</p>-->
    <!--</div>-->
    <div class="infoItem"  style="margin-top: 10px" @click="gouserMbile">
      <span>手机号码</span>
      <p>
        <span>{{userInfo.mobile}}</span>
      </p>
    </div>
    <popup-picker class="chosepicker" title="性别" popup-title="选择性别" :data="sexList" v-model="sex" @on-change="onChange"></popup-picker>
    <datetime class="chosepicker" v-model="birthday" placeholder="请选择" :min-year=1900 :max-year="MaxYear" format="YYYY-MM-DD" @on-change="changebirth" title="请选择出生日期" year-row="{value}年" month-row="{value}月"  day-row="{value}日"  confirm-text="完成" cancel-text="取消"></datetime>
    <popup-picker class="chosepicker" title="学历" popup-title="选择学历" :data="educateLevelList" v-model="educateLevel" @on-change="onChangeedu"></popup-picker>
    <!--<x-address  class="chosepicker" title="地区" v-model="areavalue" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择地址"></x-address>-->
    <page-view></page-view>
  </div>
</template>

<script>
import {XInput, PopupPicker, Datetime, XAddress, ChinaAddressV4Data} from 'vux'
import Qs from 'qs'
import PageView from '@/components/PageView'
export default {
  name: 'setMyInfo',
  data () {
    return {
      sex: ['女'],
      sexList: [['男', '女']], // 1 是女 0 是男
      wechat: '', // 微信号
      birthday: '', // 用户的出生日期 格式类似于'2000-06'
      MaxYear: new Date().getFullYear(),
      educateLevel: ['本科'], // 学历
      educateLevelList: [['小学', '初中', '中专', '高中', '大专', '本科', '硕士', '博士', '博士后']],
      addressData: ChinaAddressV4Data,
      needUpdate: false, // 离开本页面时不需要刷新
      areavalue: ['320000', '321000', '321084']
    }
  },
  created () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.userInfo = userInfo
    this.birthday = userInfo.birthday
    this.wechat = userInfo.wechat
    if (userInfo.education) {
      this.educateLevel = [userInfo.education]
    }
    this.sex = userInfo.gender == 0 ? ['男'] : ['女']
  },
  beforeDestroy () {
    if (this.needUpdate) {
      this.saveMyInfo()
    }
  },
  methods: {
    onChange (val) { // 改变性别
      console.log('val change', this.sex[0])
      this.needUpdate = true
    },
    wetchatchange () { // 信号改变了
      console.log('wetchatchange')
      this.needUpdate = true
    },
    saveMyInfo () {
      if (!this.birthday) {
        this.$vux.toast.text('生日不能为空', 'middle')
        return
      }
      var param = {
        birthday: this.birthday,
        education: this.educateLevel[0],
        wechat: this.wechat || '',
        gender: this.sex[0]=='女' ? '1' : '0' // 1 是女 0 是男
      }
      param = Qs.stringify(param)
      this.$http.post('update', param).then((res) => {
        if (res.data.code == 200) {
          this.userInfo.birthday = this.birthday
          this.userInfo.education = this.educateLevel[0]
          this.userInfo.wechat = this.wechat
          this.userInfo.gender = (this.sex[0] == '女') ? '1' : '0'
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
        }
      })
    },
    changebirth (value) { // 改变生日
      console.log('change', value)
      this.needUpdate = true
    },
    onChangeedu (val) { // 改变学历
      console.log('val change', val)
      this.needUpdate = true
    },
    onShadowChange (ids, names) { // 改变地区
      console.log(ids, names)
    },
    gojcbd () {
      console.log('点击了解除绑定')
    },
    gotoCheckID () {
      this.$router.push({name: 'checkID'})
    },
    gouserMbile () {
      this.$router.push({name: 'userMobile'})
    }
  },
  components: {
    XInput,
    Datetime,
    PopupPicker,
    PageView,
    XAddress
  }
}
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  .info-detail{
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
    color:#000;
    .chosepicker{
      background-color: #fff;
      height: .45rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: .01rem solid rgba(245,245,245,1);
    }
    /deep/.vux-cell-box:not(:first-child):before{
      display: none;
    }
    /deep/.weui-cell,/deep/.vux-cell-box{
      width: 100%;
    }
    /deep/.weui-cell:before{
      display: none;
    }
    .infoItem{
      width: 100%;
      height:.45rem ;
      padding:0 .12rem;
      justify-content: space-between;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-top: .01rem solid rgba(245,245,245,1);
      p{
        display: flex;
        max-width: 70%;
        align-items: center;
        .xinpu{
          width: 100%;
          padding-right: 0;
        }
        .moreicon{
          width: .07rem;
          height: .12rem;
          margin-left:.09rem ;
        }
        .usericon{
          width: .33rem;
          height: .33rem;
          border-radius: 100%;
        }
        .greycolo{
          color:rgba(153,153,153,1);
        }
      }
    }
    .jcbd{
      margin-top: .2rem;
      width:3.11rem;
      font-size: .16rem;
      height:.44rem;
      color: #fff;
      background:rgba(0,162,233,1);
      border-radius:.22rem;
    }
    .jcbd:active{
      background:rgba(0,162,233,1);
      color: #fff;
    }
  }
</style>
