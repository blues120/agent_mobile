<template>
  <main class="my">
    <div class="applytx">
      <span>提现金额</span>
      <p class="txp">
        <span class="redcolor">¥</span>
        <input type="number" placeholder="请输入提现金额" v-model="txAccount">
      </p>
      <div class="txbot">
        <span>账户可提现余额{{userTXObj.balanceIncome}}元</span>
        <p @click="txall">全部提取</p>
      </div>
    </div>
    <div class="txzhanghao">
      <p class="txdecora">提现到</p>
      <div class="txbox">
        <img src="~@/assets/images/my/tx-wechat.png" alt="ICON" class="txwayimg" v-if="method==1">
        <img src="~@/assets/images/my/tx-zfb.png" alt="ICON" class="txwayimg" v-if="method==2">
        <popup-picker class="chosepicker"  popup-title="提现方式" :value-text-align="'left'" :data="txwayList" v-model="txway" @on-change="onChange"></popup-picker>
        <img src="~@/assets/images/my/tx-way.png" alt="ICON" class="selecticon">
      </div>
    </div>
    <p class="subbtn" @click="goToTX">确认提现</p>
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
  </main>
</template>

<script>
import {PopupPicker} from 'vux'
import inputPass from '@/components/inputPass'
import Qs from 'qs'
export default {
  components: {
    inputPass,
    PopupPicker
  },
  data () {
    return {
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      userTXObj: {},
      txAccount: '', // 提现金额
      txway: [''],
      txwayList: [], // 1 是女 0 是男
      method: '1', // 当前的支付方式  1：微信钱包；2：支付宝；3：银行卡 4：快捷支付
      accountName: '',
      accountNo: '',
      skList: [] // 收款列表
    }
  },
  created () {
    var userTXObj = JSON.parse(localStorage.getItem('userTXObj'))
    this.userTXObj = userTXObj
    this.getAccount() // 获取收款账户
  },
  methods: {
    goToTX () {
      if (this.txAccount && parseInt(this.txAccount) > 0) {
        if (parseInt(this.txAccount) > parseInt(this.userTXObj.balanceIncome)) {
          this.$vux.toast.text('提现超出可提现余额!', 'middle')
          return
        }
        if (parseInt(this.txAccount) < 100) {
          this.$vux.toast.text('提现金额应不小于100!', 'middle')
          return
        }
        this.inpuPassObj.inputPasStep = true
      } else {
        this.$vux.toast.text('请输入提现金额', 'middle')
      }
    },
    txall () {
      this.txAccount = this.userTXObj.balanceIncome
    },
    onChange (val) { // 改变提现方式
      if (this.txway[0]=='微信钱包') {
        this.method = '1'
      } else if (this.txway[0]=='支付宝') {
        this.method = '2'
      } else if (this.txway[0]=='银行卡') {
        this.method = '3'
      }
      for (var i in this.skList) {
        if (this.skList[i].accountType == this.method) {
          this.accountName = this.skList[i].accountName
          this.accountNo = this.skList[i].accountNo
        }
      }
    },
    inpuCorrectPass () {
      this.txXhr()
    },
    getAccount () {
      this.$http.get('account/list').then((res) => {
        if (res) {
          if (res.data.data.length > 0) {
            var tempArry = []
            for (var m in res.data.data) {
              tempArry.push(res.data.data[m].payMethodString)
            }
            this.txway = [res.data.data[0].payMethodString || '微信钱包']
            this.txwayList = [tempArry]
            this.skList = res.data.data
            this.method = res.data.data[0].accountType
            this.accountName = res.data.data[0].accountName
            this.accountNo = res.data.data[0].accountNo
          }
        }
      })
    },
    txXhr () {
      var that = this
      var params = {
        method: this.method,
        amount: this.txAccount,
        accountName: this.accountName,
        accountNo: this.accountNo
      }
      params = Qs.stringify(params)
      this.$http.post('incoming/withdraw', params).then((res) => {
        if (res) {
          this.$vux.toast.text('申请提现成功', 'middle')
          setTimeout(() => {
            that.$router ? that.$router.back() : window.history.back()
          }, 1000)
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
  z-index: 133;
  margin: auto;
  background-color: #f5f6f7 ;
  padding-top: .46rem;
  width: 100%;
  font-size: .16rem;
  .redcolor{
    color: #FF0000;
  }
  .applytx{
    width:3.51rem;
    height: 1.03rem;
    background-color: #fff;
    margin: .1rem auto;
    display: flex;
    flex-direction: column;
    padding: .1rem .1rem 0;
    font-size: .14rem;
    .txp{
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: .01rem solid rgba(245,245,245,1);
      font-size: .16rem;
      padding: .12rem 0;
      input {
        outline: none;
        margin-left: .1rem;
      }
    }
    .txbot{
      width: 100%;
      display: flex;
      align-items: center;
      flex: 1;
      color: rgba(153,153,153,1);
      font-size: .12rem;
      p{
        color:rgba(0,162,233,1);
        margin-left: .2rem;
      }
    }
  }
  .txzhanghao{
    width: 3.51rem;
    height: .86rem;
    margin: 0 auto .5rem;
    border-radius:.08rem .08rem 0 0;
    background-color: #fff;
    .txdecora{
      background:rgba(210,210,210,1);
      border-radius:.08rem .08rem 0 0;
      height: .43rem;
      line-height: .43rem;
      color: #000;
      padding-left: .1rem;
    }
    .txbox{
      height: .43rem;
      flex: 1;
      display: flex;
      align-items: center;
      .txwayimg{
        width: .22rem;
        height: .22rem;
        margin-left: .1rem;
      }
      .chosepicker{
        flex: 1;
      }
      .selecticon{
        width: .15rem;
        height: .11rem;
        margin:0 .1rem ;
      }
    }
  }
  /deep/.vux-cell-box:not(:first-child):before{
    display: none;
  }
  /deep/.weui-cell{
    width: 100%;
    display: flex;
    height: .43rem;
    align-items: center;
    padding:0 .1rem;
  }
  /deep/.weui-cell_access .weui-cell__ft:after{
    display: none;
  }
}
</style>
