<template>
  <main class="sub-voucher">
    <section class="warningTip redcolor">请确认您已经成功打款后在创建打款凭证，以下信息请一定认
      真填写</section>
    <group >
      <cell title="线下打款说明"  is-link @click.native="showDKTips=!showDKTips"></cell>
    </group>
    <group >
      <cell title="指定打款账号"  is-link @click.native="showDKAccount=!showDKAccount"></cell>
    </group>
    <div v-transfer-dom>
      <popup v-model="showDKTips" position="bottom" max-height="90%" @on-hide="dkonHide">
        <div class="fnctop"><span>线下打款说明</span><span class="closebtn" @click="closezz" v-if="nowStepStatus!=1">X</span></div>
        <group>
          <cell class="warntipEach redcolor" title="请认真阅读以下线下打款说明及指定打款账号，若因打款金额不对造成的问题，由自己负责，谨记!"></cell>
        </group>
        <group>
          <span class="redcolor speciaspan">注意点</span>
          <cell class="warntipEach" title="线下打款的含义是您自己通过线下操作将钱打给上级的指定账户，线下打款完成并保存截图后，到该平台上传打款凭证。"></cell>
        </group>
        <group>
          <span class="redcolor speciaspan">流程</span>
          <cell class="warntipEach" title="1.将订单需要支付的钱达到上级指定的账户中，同时将您的打款凭证截图保留。"></cell>
          <cell class="warntipEach midcell" title="2.打款成功后，将您的打款凭证上传提交。"></cell>
          <cell class="warntipEach" title="3.上级在审核并确认您的打款申请后，将会第一时间进行发货，请及时留意该订单的状
态变化态变化。线下打款完成并保存截图后，到该平台上传打款凭证。"></cell>
        </group>
        <div>
          <x-button @click.native="goNextStep" plain type="primary" class="iknow" v-if="nowStepStatus===1">下一步</x-button>
          <x-button @click.native="callPhone" plain type="primary" class="iknow" v-else>联系上级</x-button>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup v-model="showDKAccount" position="bottom" max-height="90%" v-if="PayDetailObj.Superiorobj">
        <div class="fnctop"><span>指定打款帐号</span><span class="closebtn" @click="closezz" v-if="nowStepStatus!=2">X</span></div>
        <group>
          <cell class="warntipEach redcolor" title="以下为上级指定财务账户，请选择一种打款方式。"></cell>
        </group>
        <group>
          <cell class="warntipEach" :title="'支付宝账号：'+PayDetailObj.Superiorobj.alipayNick" v-if="PayDetailObj.Superiorobj.alipayNick"></cell>
          <cell class="warntipEach" :title="'支付宝户名：'+PayDetailObj.Superiorobj.alipayNumber" v-if="PayDetailObj.Superiorobj.alipayNumber"></cell>
        </group>
        <group>
          <cell class="warntipEach" :title="'微信名：'+PayDetailObj.Superiorobj.wechatNick" v-if="PayDetailObj.Superiorobj.wechatNick"></cell>
          <cell class="warntipEach" :title="'微信号：'+PayDetailObj.Superiorobj.wechatNumber" v-if="PayDetailObj.Superiorobj.wechatNumber"></cell>
          <div class="wxpayBox" v-if="PayDetailObj.Superiorobj.wechatQrList">
            <p>微信付款码</p>
            <div>

              <img class="previewer-demo-img"  v-for="(item, index) in PayDetailObj.Superiorobj.wechatQrList" :key="index" :src="item" width="100" @click="show(index)">
              <span>点击长按扫码付款</span>
              <div v-transfer-dom>
                <previewer :list="PayDetailObj.Superiorobj.wechatQrList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
              </div>
            </div>
          </div>
        </group>
        <group>
          <cell class="warntipEach" :title="'银行卡账号：'+PayDetailObj.Superiorobj.YXNick" v-if="PayDetailObj.Superiorobj.YXNick"></cell>
          <cell class="warntipEach" :title="'银行卡户名：'+PayDetailObj.Superiorobj.YXNumber" v-if="PayDetailObj.Superiorobj.YXNumber"></cell>
        </group>
        <div>
          <x-button @click.native="callPhone" plain type="primary" class="iknow"> 联系上级~ </x-button>
        </div>
      </popup>
      <popup v-model="showDKAccount" position="bottom" max-height="90%" v-else class="noUpBox">
        <div class="fnctop"><span>提示</span></div>
        <img src="~@/assets/images/gosettlement/hasNoUpUinfo.png" alt="" class="noUpInfo">
        <span class="tip">上级未设置，请自行联系上级获取打款账户。</span>
        <div>
          <x-button @click.native="showDKAccount = false" plain type="primary" class="iknow"> 知道了~ </x-button>
        </div>
      </popup>
    </div>
    <group class="transparentdiv">
      <cell title="打款金额"  value-align="left">*</cell>
    </group>
    <group >
      <x-input title=''   v-model="PayDetailObj.orderTotalPrice" class="redcolor" readonly></x-input>
    </group>
    <group class="transparentdiv">
      <cell title="打款备注(选填)"  value-align="left"></cell>
    </group>
    <group >
      <x-input title=''   v-model="remark"  placeholder="请输入打款说明"></x-input>
    </group>
    <group class="transparentdiv2">
      <cell title="上传打款凭证"  value-align="left">*</cell>
    </group>
    <section>
      <div class="pzbox">
        <div class="isuploadpicbox" v-for="(picItem,index) in UploadPicArry" :key="index">
          <img class="isuploadpic"  :src="picItem.src" >
          <img class="deletbtn" src="~@/assets/images/gosettlement/closebtn.png" alt="" @click="removeUpload(index)" >
        </div>
        <div class="uploadbtnbox" v-if="!hideAddbtn">
          <div class="cssplusbox">
            <img src="~@/assets/images/gosettlement/addbtn.png" alt="" class="addressicon">
            <span>最多添加6张图片</span>
          </div>
          <input type="file" class="uploadfileold" name="file" accept="image/*" id="file" @change="uploadNow">
        </div>
      </div>
      <p class="subbtn" @click="goSubmit">确认提交</p>
    </section>
  </main>
</template>

<script>
import {Group, Cell, Popup, XButton, TransferDom, Previewer, XInput} from 'vux'
export default {
  name: 'Subvoucher',
  directives: {
    TransferDom
  },
  data () {
    return {
      nowStepStatus: 1, // 1是显示线下打款说明状态 2显示指定打款账号说明状态 用户首次进入上传凭证页面先显示两个tips，（点击遮罩无法关闭，两个显示完遮罩可以关闭）
      showDKTips: true,
      PayDetailObj: {},
      remark: '', // 打款说明
      showDKAccount: false,
      tempArry: [], // 临时存放file的数组
      formDataArray: new FormData(), // 上传的凭证图片数组 formdata
      UploadPicArry: [], // 上传的凭证图片显示出来的数组
      hideAddbtn: false, // 不隐藏添加按钮
      list: [{
        msrc: 'http://ww1.sinaimg.cn/thumbnail/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
        src: 'http://ww1.sinaimg.cn/large/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
        w: 800,
        h: 400
      }],
      options: {
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
        }
      },
      picIds: [], // 更新撤单审核的图片id 数组
      payAuditId: '' // 打款凭证的 id
    }
  },
  created () {
    this.PayDetailObj = JSON.parse(localStorage.getItem('PayDetailObj')) || {}
    if (this.PayDetailObj.remark) {
      this.remark = this.PayDetailObj.remark
    }
    if (this.$route.query.payAuditId) {
      this.payAuditId = this.$route.query.payAuditId
    }
    if (this.PayDetailObj.orderPrice) {
      this.PayDetailObj.orderTotalPrice = this.PayDetailObj.orderPrice
    }
    var Superiorobj = {} // 保存上级的收款账号具体信息（上级不是上级代理就是美瘦总部）
    // this.PayDetailObj.agentEntity &&
    if (this.PayDetailObj.agentFinanceRechargeAccountEntities.length > 0) {
      for (var i in this.PayDetailObj.agentFinanceRechargeAccountEntities) {
        if (this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountType === 1) {
          Superiorobj.wechatNumber = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountNo
          Superiorobj.wechatNick = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountName
          Superiorobj.wechatQr = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].qrCode
          if (Superiorobj.wechatQr) {
            Superiorobj.wechatQrList = [this.PayDetailObj.agentFinanceRechargeAccountEntities[i].qrCode]
          }
        }
        if (this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountType === 2) {
          Superiorobj.alipayNumber = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountNo
          Superiorobj.alipayNick = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountName
          Superiorobj.alipayQr = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].qrCode
          if (Superiorobj.alipayQr) {
            Superiorobj.alipayQrList = [this.PayDetailObj.agentFinanceRechargeAccountEntities[i].qrCode]
          }
        }
        if (this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountType === 3) {
          Superiorobj.YXNumber = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountNo
          Superiorobj.YXNick = this.PayDetailObj.agentFinanceRechargeAccountEntities[i].accountName
        }
      }
      this.PayDetailObj.Superiorobj = Superiorobj
    }
    var picIds = []
    var UploadPicArry = []
    for (var k in this.PayDetailObj.uploadFileEntities) {
      var obj = {
        src: this.PayDetailObj.uploadFileEntities[k].filePath,
        id: this.PayDetailObj.uploadFileEntities[k].id
      }
      UploadPicArry.push(obj)
      picIds.push(this.PayDetailObj.uploadFileEntities[i].id)
    }
    this.picIds = picIds
    this.UploadPicArry = UploadPicArry
    if (this.UploadPicArry.length >= 6) {
      this.hideAddbtn = true
    }
  },
  methods: {
    uploadNow (e) {
      var that = this
      this.tempArry.push(e.target.files[0])
      var reader = new FileReader()
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function (e) {
          var obj = {
            src: reader.result,
            id: ''
          }
          that.UploadPicArry.push(obj)
          console.log('that.UploadPicArry.length', that.UploadPicArry)
          if (that.UploadPicArry.length >= 6) {
            that.hideAddbtn = true
          }
        }
      } else {
        console.log('read fail')
      }
      console.log('thi.files', this.tempArry)
    },
    removeUpload (index) {
      if (this.UploadPicArry[index].id) { // 删除的是之前存进去的撤单图片凭证
        for (var m in this.picIds) { // 实际保存图片id数组效果删除
          if (this.picIds[m] === this.UploadPicArry[index].id) {
            this.picIds.splice(m, 1)
          }
        }
      } else { // 删除的是新上传的图片 下标应该减去 之前存放的
        console.log('index', index)
        console.log('tempArrybefore', this.tempArry)
        if (index >= this.picIds.length) {
          this.tempArry.splice((index - this.picIds.length), 1)
        } else {
          this.tempArry.splice(index, 1)
        }
        console.log('tempArryfater', this.tempArry)
      }
      this.UploadPicArry.splice(index, 1) // 前端效果上删除
      if (this.UploadPicArry.length >= 6) {
        this.hideAddbtn = true
      } else {
        this.hideAddbtn = false
      }
    },
    goSubmit () {
      if (this.picIds.length === 0 && this.tempArry.length === 0) {
        this.$vux.toast.text('请上传打款凭证', 'middle')
        return
      }
      var formDataArray = new FormData()
      for (var i in this.tempArry) {
        formDataArray.append('files', this.tempArry[i])
      }
      formDataArray.append('orderId', this.PayDetailObj.orderId)
      formDataArray.append('remark', this.remark)
      console.log('this.tempArry', this.tempArry)
      if (this.payAuditId) { // 如果有打款id则是更新打款凭证
        this.updateDKXhr(formDataArray)
      } else { // 第一次提交打款凭证
        this.createDKXhr(formDataArray)
      }
    },
    createDKXhr (formDataArray) {
      this.formDataArray = formDataArray
      this.$http.post('placeOrders/submitThePaymentForReview', this.formDataArray, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res) {
          this.$router.replace({name: 'paySuccess'})
        }
      }, () => {})
    },
    updateDKXhr (formDataArray) {
      this.formDataArray = formDataArray
      this.formDataArray.append('payAuditId', this.payAuditId)
      this.formDataArray.append('picIds', this.picIds)
      this.$http.post('placeOrders/updatePaymentCertificate', this.formDataArray, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res) {
          this.$router ? this.$router.back() : window.history.back()
        }
      }, () => {})
    },
    callPhone () {
      var tel = this.PayDetailObj.agentEntity ? this.PayDetailObj.agentEntity.mobile : this.PayDetailObj.mobile
      window.location.href = 'tel:' + tel
      this.showDKAccount = false
    },
    logIndexChange (arg) {
      console.log(arg)
    },
    dkonHide () {
      if (this.nowStepStatus === 1) {
        this.goNextStep()
        console.log('dkonHide')
      }
    },
    goNextStep () { // 进入下一状态
      this.nowStepStatus = 2
      this.showDKTips = false
      this.showDKAccount = true
    },
    show (index) {
      this.$refs.previewer.show(index)
    },
    closezz () { // 关闭线下打款说明
      this.showDKAccount = false
      this.showDKTips = false
    },
    Gopurchase () { // 我要进货
      this.$router.push({
        path: '/home/go-purchase'
      })
    }
  },
  components: {
    Group,
    Cell,
    Popup,
    XButton,
    Previewer,
    XInput
  }
}
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  .sub-voucher{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 600;
    margin: auto;
    background-color: #f5f6f7;
    .header{
      background-color: #00a2e9;
      height: .83rem;
      .control-list{
        height: .92rem;
        width: 3.51rem;
        background-color: #fff;
        border-radius: .06rem;
        transform: translateY(.12rem);
        margin: 0 auto;
        padding: .08rem;
        box-sizing: border-box;
        .title{
          padding: .05rem;
          box-sizing: border-box;
          border-bottom: .01rem solid #f5f5f5;
          margin-bottom: .1rem;
        }
        ul{
          display: flex;
          li{
            flex: 1;
            align-items: center;
            .text{
              text-align: center;
            }
            img.icon{
              display: block;
              width: .22rem;
              height: .22rem;
              margin: 0 auto .05rem;
            }
          }
        }
      }
    }
    .warningTip{
      width: 100%;
      height: .5rem;
      display: flex;
      align-items: center;
      font-size: .12rem;
      text-align: justify;
      line-height: 1.3;
      padding:0 .13rem ;
    }
    .eachIte{
      width: 100%;
      height: .33rem;
      display: flex;
      align-items: center;
      background-color: #fff;
      justify-content: space-between;
      padding: 0 .13rem;
      font-size: .13rem;
      box-sizing: border-box;
      border-bottom: .01rem solid rgba(245,245,245,1);
      img{
        width: .1rem;
        height: .17rem;
        display: inline-block;
      }
    }
  }
  .redcolor{
    color: #FF0000
  }
  .fnctop{
    width: 100%;
    height: 0.4rem;
    position: relative;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    .closebtn{
      position: absolute;
      width: .3rem;
      height: .3rem;
      top: 0;
      right: .1rem;
      bottom: 0;
      margin: auto;
      text-align: center;
      line-height: .3rem;
    }
  }
  /deep/.weui-cells{
    margin-top: 0;
  }
  /deep/.weui-cell:before{
    border: none;
  }
  /deep/.weui-cells:before{
    display: none;
  }
  /deep/.transparentdiv .weui-cells{
    background-color: transparent;
  }
  /deep/.transparentdiv .weui-cells:after,/deep/.transparentdiv2 .weui-cells:after{
    display: none;
  }
  /deep/.transparentdiv .weui-cell__ft,/deep/.transparentdiv2 .weui-cell__ft{
    color: #FF0000
  }
  .noUpInfo{
    width: 1.74rem;
    height: 1.21rem;
    margin: .6rem 1rem .4rem;
  }
  .noUpBox{
    display: flex;
    flex-direction: column;
    align-items: center;
    span.tip{
      margin-bottom: .22rem;
      color:#999999
    }
    div{
      width: 100%;
      button{
        width: 100%;
      }
    }
  }
  .transparentdiv2{
    margin-top: .08rem;
  }
  .warntipEach{
    font-size: .14rem;
    text-align: justify;
    padding: .05rem .15rem;
  }
  .speciaspan{
    font-size: .18rem;
    margin: .04rem 0 -0.2rem  .13rem;;
    display: inline-block;
  }
  /deep/.speciaspan +.weui-cell{
    padding-top: .05rem;
  }
  .midcell{
    padding: 0 .15rem;
  }
  .iknow{
    border: none;
    background:rgba(0,162,233,1);
    color: #fff;
  }
  .wxpayBox{
    display: flex;
    margin-bottom: .05rem;
    padding-left: .13rem;
    p{
      margin-right:  .13rem
    }
    div{
      display: flex;
      flex-direction: column;
      font-size:.14rem ;
      span{
        margin-top: .07rem;
      }
    }
  }
  .pzbox{
    width: 100%;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;
    padding:.1rem .15rem ;
    .isuploadpicbox,.uploadbtnbox{
      width: 30%;
      height: .7rem;
      margin: 0 1.5% 2%;
      background-color: #fff;
      position: relative;
      .isuploadpic{
        width: 100%;
        height: 100%;
      }
      .deletbtn{
        position: absolute;
        width: .3rem;
        height: .3rem;
        top:-.15rem;
        right: -.15rem;
      }
      .uploadfileold{
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 12;
      }
      .cssplusbox{
        width: 100%;
        height: 100%;
        z-index: 11;
        border: .01rem dashed #1296db;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        font-size: .1rem;
        color: #999;
        align-items: center;
        justify-content: center;
        img{
          width: .4rem;
          height: .4rem;
        }
      }
    }
  }
  .subbtn{
    width: 1.6rem;
    border-radius: .2rem;
    color: #fff;
    text-align: center;
    line-height: .35rem;
    margin: .15rem auto;
    font-size: .15rem;
    height: .35rem;
    background-color: #5c8dff;
  }
</style>
