<template>
  <main class="my">
    <div class="payskbox wxsk" v-if="wxAccountObj">
      <img src="~@/assets/images/my/sk-wx.png" alt="ICON" class="waysicon">
      <div class="account-detail">
        <p class="accountname">{{wxAccountObj.accountName}}</p>
        <span style="margin: 6px 0;">微信收款账户</span>
        <p class="account-num">{{wxAccountObj.accountNo}}</p>
      </div>
      <div class="boxright">
        <!--<img src="~@/assets/images/my/tx-wechat.png" alt="ICON" class="skqr">-->
        <p src="" class="skqr plachold"></p>
        <div>
          <span @click="eddit(wxAccountObj.id)">编辑</span>
          <p class="speraline"></p>
          <span @click="delet(wxAccountObj.id)">删除</span>
        </div>
      </div>
    </div>
    <div class="sk-accountbox" @click="goAddSK('1')" v-else>
      <img src="~@/assets/images/my/tx-wechat.png" alt="ICON" class="wayicon">
      <p>添加微信收款账户</p>
      <img src="~@/assets/images/my/addicon.png" alt="ICON" class="addicon">
    </div>
    <div class="payskbox zfbsk" v-if="zfbAccountObj">
      <img src="~@/assets/images/my/sk-zfb.png" alt="ICON" class="waysicon" style="z-index: 220">
      <div class="account-detail">
        <p class="accountname">{{zfbAccountObj.accountName}}</p>
        <span style="margin: 6px 0;">支付宝收款账户</span>
        <p class="account-num">{{zfbAccountObj.accountNo}}</p>
      </div>
      <div class="boxright">
        <p src="" class="skqr plachold"></p>
        <div>
          <span @click="eddit(zfbAccountObj.id)">编辑</span>
          <p class="speraline"></p>
          <span @click="delet(zfbAccountObj.id)">删除</span>
        </div>
      </div>
    </div>
    <div class="sk-accountbox" @click="goAddSK('2')" v-else>
      <img src="~@/assets/images/my/tx-zfb.png" alt="ICON" class="wayicon">
      <p>添加支付宝收款账户</p>
      <img src="~@/assets/images/my/addicon.png" alt="ICON" class="addicon">
    </div>
    <!--<div class="sk-accountbox" @click="goAddSK('3')">-->
      <!--<img src="~@/assets/images/my/tx-yhk.png" alt="ICON" class="wayicon">-->
      <!--<p>添加银行卡收款账户</p>-->
      <!--<img src="~@/assets/images/my/addicon.png" alt="ICON" class="addicon">-->
    <!--</div>-->
    <div v-transfer-dom>
      <x-dialog v-model="addSKAccount" class="dialog-changetx">
        <div class="changetxtop" style="height: 50px;line-height: 50px;border-bottom: 1px solid #F5F5F5">添加{{actInde==1?'微信':(actInde==2?'支付宝':'银行卡')}}收款账户</div>
        <div class="inpuAccount" style="margin-top: 15px;" v-if="actInde==1 || actInde==2">
          <p style="width:205px;margin:5px auto ;height: 44px;border-radius: 22px;border: 1px solid  #00A2E9;display: flex;align-items: center;justify-content: center"><input style="width:90%;height:90%;display:inline-block;padding: 0 10px;border: none;outline: none" type="text" v-model="accountName" placeholder="请输入用户名"></p>
          <p style="width:205px;margin:5px auto ;height: 44px;border-radius: 22px;border: 1px solid  #00A2E9;display: flex;align-items: center;justify-content: center"><input style="width:90%;height:90%;display:inline-block;padding: 0 10px;border: none;outline: none" type="text" v-model="accountNo"  :placeholder="actInde==1?'请输入微信账号':'请输入支付宝账号'"></p>
        </div>
        <!--<div v-if="actInde ==1">-->
          <!--<div  v-if="skWxPic"  class="uploadbox" style="width: 100px;height: 100px;margin: 15px auto 25px;position: relative">-->
            <!--<img :src="skWxPic" class="usericon" style="width: 100%;height: 100%;">-->
            <!--<img @click="removetx" src="~@/assets/images/gosettlement/closebtn.png" class="deleticon" style="width: 30px;height: 30px;position: absolute;top:-15px;right: -15px">-->
          <!--</div>-->
          <!--<div  v-else class="uploadbox" style="width: 100px;height: 100px;margin: 15px auto 25px;position: relative">-->
            <!--<div class="cssplusbox" style="width: 100px;height: 100px;display:flex;z-index:10;align-items: center;justify-content: center;border: 1px dotted #00a2e9">-->
              <!--<img src="~@/assets/images/gosettlement/addbtn.png" alt="" class="addressicon" style="width: 40px;height: 40px;">-->
            <!--</div>-->
            <!--<input  style="width: 100px;height: 100px;position: absolute;top: 0;left: 0;z-index: 12;opacity: 0" type="file" class="uploadfileold" name="file" accept="image/*" id="file" @change="uploadNow">-->
          <!--</div>-->
        <!--</div>-->
        <div class="czbtnbox" style="margin-top: 10px;">
          <span style="padding: 10px 30px;background-color:#9c9fa6;color: #fff;display: inline-block;margin: 0px 10px 20px;border-radius: 20px" @click="addSKAccount=false">取消</span>
          <span style="padding: 10px 30px;background-color:#00a2e9;color: #fff;display: inline-block;margin: 0px 10px 20px;border-radius: 20px" @click="saveAccount">确定</span>
        </div>
      </x-dialog>
    </div>
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
  </main>
</template>

<script>
import {XButton, XDialog, TransferDom} from 'vux'
import Qs from 'qs'
import inputPass from '@/components/inputPass'
export default {
  directives: {
    TransferDom
  },
  components: {
    XButton,
    XDialog,
    inputPass
  },
  data () {
    return {
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      addSKAccount: false, // 当前状态是否是在新增收款账户状态
      skWxPic: '', // 微信的收款码图片
      tempArry: [], // 临时存放file的数组
      actit: '',
      actInde: 1, // 1当前再添加微信收款账户 。2当前在添加支付宝收款账户  3 当前再添加银行卡收款账户
      formDataArray: new FormData(), // 上传的微信的收款码数组 formdata
      userTXObj: {}, // 用户的可提现账户对象
      isEddit: false, // 默认不是编辑收款账户
      accountName: '', // 账户名称
      wxAccountObj: '', // 微信绑定的账号
      zfbAccountObj: '', // 支付宝绑定的账号
      skList: [], // 收款方式列表
      accountNo: '' // 账号
    }
  },
  created () {
    this.getAccount() // 获取已有的收款账户
  },
  methods: {
    uploadNow (e) {
      var that = this
      this.tempArry.push(e.target.files[0])
      var reader = new FileReader()
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function (e) {
          that.skWxPic = reader.result
        }
      } else {
        console.log('read fail')
      }
      console.log('thi.files', this.tempArry)
    },
    removetx () {
      this.skWxPic = ''
      this.tempArry = []
    },
    goAddSK (inde) {
      this.isEddit = false
      this.actInde = inde
      this.addSKAccount = true
    },
    getAccount () {
      this.$http.get('account/list').then((res) => {
        if (res) {
          var lists = res.data.data
          for (var m in lists) {
            if (lists[m].accountType==1) {
              this.wxAccountObj = lists[m]
            }
            if (lists[m].accountType==2) {
              this.zfbAccountObj = lists[m]
            }
          }
          this.skList = lists
        }
      })
    },
    saveAccount () {
      if (!this.accountName) {
        this.$vux.toast.text('用户名不能为空!', 'middle')
        return
      }
      if (!this.accountNo) {
        this.$vux.toast.text('账号不能为空!', 'middle')
        return
      }
      this.inpuPassObj.inputPasStep = true
    },
    inpuCorrectPass () { // 密码输入正确后反应
      var params = {
        accountType: this.actInde,
        accountName: this.accountName,
        accountNo: this.accountNo
      }
      if (this.isEddit) { // 如果是编辑收款信息
        params.id = this.edditid
        params = Qs.stringify(params)
        this.updateXhr(params)
      } else {
        params = Qs.stringify(params)
        this.addXhr(params)
      }
    },
    addXhr (params) {
      this.$http.post('account/save', params).then((res) => {
        if (res) {
          this.addSKAccount = false
          this.getAccount()
          this.$vux.toast.text('新增成功', 'middle')
        }
      })
    },
    updateXhr (params) {
      this.$http.post('account/update', params).then((res) => {
        if (res) {
          this.addSKAccount = false
          this.getAccount()
          this.$vux.toast.text('更新成功', 'middle')
        }
      })
    },
    eddit (id) { // 编辑id是id 的收款账户
      var list = this.skList
      for (var i in list) {
        if (list[i].id == id) {
          this.addSKAccount = true // 跳出输入账户，账号页面
          this.isEddit = true // 是编辑状态
          this.accountName = list[i].accountName
          this.accountNo = list[i].accountNo // 将当前的信息带入
          this.edditid = id // 当前编辑的id
        }
      }
    },
    delet (id) { // 删除某个收款账户
      this.deletXhr(id)
    },
    deletXhr (id) {
      var params = {
        id: id
      }
      params = Qs.stringify(params)
      this.$http.post('account/delete', params).then((res) => {
        if (res) {
          var list = this.skList
          for (var i in list) {
            if (list[i].id == id) {
              if (list[i].accountType == 1) {
                this.wxAccountObj = ''
              }
              if (list[i].accountType == 2) {
                this.zfbAccountObj = ''
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 143;
  margin: auto;
  background-color: #f5f6f7 ;
  padding-top: .46rem;
  width: 100%;
  font-size: .16rem;
  .sk-accountbox{
    width: 100%;
    height: .45rem;
    background-color: #fff;
    margin-top: .1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 .12rem;
    .wayicon{
      margin-right:.11rem ;
      width: .22rem;
      height: .22rem;
    }
    p{
      flex: 1;
      font-size: .16rem;
      color: #333;
    }
  }
  .payskbox{
    width:95%;
    height: 1rem;
    border-radius: .1rem;
    display: flex;
    color: #fff;
    align-items: center;
    margin: .1rem auto 0;
    .waysicon{
      width: .5rem;
      height: .5rem;
      margin: 0 .1rem;
    }
    .account-detail{
      flex: 1;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: center;
      .accountname,.account-num{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
    }
    .boxright{
      .skqr{
        width: .6rem;
        height: .6rem;
        margin:.05rem  .1rem;
      }
      .plachold{
        width: .4rem;
        height: .4rem;
      }
      div{
        display: flex;
        margin-right: .12rem;
        align-items: center;
        .speraline{
          width: .01rem;
          height: .2rem;
          background-color: #fff;
          margin: 0 .06rem;
        }
        span{
          margin: 0 .01rem;
        }
      }
    }
  }
  .wxsk{
    background-color: #66d565;
  }
  .zfbsk{
    background-color: #07a0f8;
  }
}
</style>
