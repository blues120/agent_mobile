<template>
  <div  class="tempbox">
    <div class="pay-pz" v-if="type=='read'">
    <div class="tit">
      <span class="pztip">!</span>
      <p>
        <span>撤单{{pzObj.status==1?'待审核':pzObj.status==2?'已驳回':pzObj.status==3?'已关闭':pzObj.status==4?'已成功':''}}</span>
        <span v-if="(pzObj.status==3 || pzObj.status==4)">2018-08-08</span>
      </p>
    </div>
    <div>
      <div v-if="pzObj.status==1">
        <p style="border-bottom: none;margin-bottom: -5px"><span class="redcolor">申请同意或超时未处理：</span>撤单成功将退款给您</p>
        <p><span class="redcolor">申请被上级或商家拒绝：</span>您可重新发起新的撤单申请</p>
      </div>
      <div v-else-if="pzObj.status==2">
        <p><span class="redcolor">驳回理由：</span>撤单成功将退款给您</p>
        <p style="line-height: 1.2;color: #999">如有异议可与商家协商后重新发起撤单,超时未撤单将自动关闭</p>
      </div>
      <div v-else-if="pzObj.status==3">
        <p><span class="redcolor">关闭原因：</span>{{pzObj.operateType==1?'用户自行取消':pzObj.operateType==2?pzObj.rejectReason:pzObj.operateType==3?'撤单超时自动关闭':''}}</p>
      </div>
      <div v-else-if="pzObj.status==4">
      <p style="border-bottom: none;margin-bottom: -5px;">退款金额：<span class="redcolor">¥ 122</span></p>
      <p style="color: #999">请自行联系上级退款</p>
      </div>
    </div>
    <div>
      <p class="czpz" v-if="pzObj.status==1">
        <span class="haspay" @click="goChangeApply">修改撤单申请</span>
        <span class="refusepz"   @click="goCancelApply">取消撤单申请</span>
      </p>
      <p class="czpz" v-if="pzObj.status==2">
        <span class="haspay"  @click="goChangeApply" >再次撤单</span>
      </p>
    </div>
    <div class="dkdetail">
      <div class="cdtit">撤单信息</div>
      <p>
        撤单原因:  <span> {{pzObj.reason}}</span>
      </p>
      <p>
        退款金额:  <span style="color:#FF0000;">¥ {{pzObj.refundAmount}}</span>
      </p>
      <p>
        撤单说明:  <span>{{pzObj.exp || "无"}}</span>
      </p>
      <p>
        申请时间:  <span>{{pzObj.createTime}}</span>
      </p>
      <div class="pzpicbox" v-if="list.length>0">
        <span>
          撤单凭证:
        </span>
        <div>
          <img  v-for="(item, index) in list" :src="item.msrc" class="icon" :key="index"  @click="show(index)">
          <div v-transfer-dom>
            <previewer :list="list" ref="previewer"></previewer>
          </div>
        </div>
      </div>
    </div>
    <span class="connectother" @click="callPhone(pzObj.agentMobile)">联系上级</span>
    <div v-transfer-dom>
      <confirm v-model="makeSureObj.show"
               :title="makeSureObj.head"
               confirm-text="是"
               :show-input="makeSureObj.showinput"
               :input-attrs="{type: 'text'}"
               placeholder="请输入您的驳回理由"
               cancel-text="否"
               @on-confirm="makeSureObj.onConfirm">
        <p style="text-align:center;">{{makeSureObj.sureTitle}}</p>
      </confirm>
    </div>
    <input-pass :inpuPassObj="inpuPassObj" @inpuCorrectPass="inpuCorrectPass"></input-pass>
  </div>
    <div class="pay-pz" v-else>
      <div class="newgoodsbox">
        <div class="itembox" v-for="(goods,index) in pzObj.productList" :key="index">
          <img :src="goods.picUrl" alt="" class="goodspicleft">
          <div class="midbox">{{goods.productName}}</div>
          <div class="rigbox">
            <span class="redcolor">¥{{goods.retailPrice}}</span>
            <span>x{{goods.number}}</span>
          </div>
        </div>
        <div class="totalcount">
          <span class="redcolor">总计：¥{{pzObj.totalPrice}} </span>（运费：¥0.00）
        </div>
      </div>
      <group class="transparentdiv">
        <cell title="撤单原因"  value-align="left">*</cell>
      </group>
      <group >
        <x-input v-model.trim="cancelReason" placeholder="请输入您想撤单的原因"></x-input>
      </group>
      <group class="transparentdiv">
        <cell title="撤单退款金额"  value-align="left">*</cell>
      </group>
      <group >
        <x-input :title="'¥'+pzObj.totalPrice" class="redcolor" readonly></x-input>
      </group>
      <group class="transparentdiv">
        <cell title="撤单说明(选填)"  value-align="left"></cell>
      </group>
      <group >
        <x-input v-model.trim="remark"  placeholder="请输入您对本次撤单的说明"></x-input>
      </group>
      <group class="transparentdiv2">
        <cell title="上传凭证"  value-align="left">*</cell>
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
              <span>最多添加3张图片</span>
            </div>
            <input type="file" class="uploadfileold" name="file" accept="image/*" id="file" @change="uploadNow">
          </div>
        </div>
        <div class="subbtn2" @click="goSubmit">确认提交</div>
      </section>
    </div>
  </div>
</template>

<script>
import {Previewer, TransferDom, Confirm, Group, Cell, XInput} from 'vux'
import inputPass from '@/components/inputPass'
import Qs from 'qs'
export default {
  created () {
    if (this.$route.query.id) {
      this.orderId = this.$route.query.id
    }
    if (this.$route.query.type) {
      this.type = this.$route.query.type
      if (this.type === 'write') {
        this.getpzDetail() // 查看准备撤单的商品订单详情
      } else {
        if (this.$route.query.revokeId) {
          this.revokeId = this.$route.query.revokeId
          this.getCDpzDetail() // 查看准备撤单的详情
        }
      }
    }
  },
  data () {
    return {
      inpuPassObj: {
        inputPasStep: false,
        userPassword: ''
      },
      makeSureObj: {
        show: false, // 是否显示二次提示框（确认打款，凭证驳回
        type: '', // 1 是同意 2 是驳回
        sureTitle: '', // 二次确认弹出的提示框
        showinput: false, // 默认不显示输入框
        onConfirm: function () {}
      },
      hideAddbtn: false, // 不隐藏添加按钮
      type: '', // write 是 第一次填写申请撤单的理由或者修改申请撤单的理由 read 是 查看撤单的信息（有可能进行一些操作：修改，取消，重新申请撤单等）
      orderId: '', // 订单的id
      pzObj: {},
      list: [], // 上传的凭证图片数组
      refuseReason: '', // 驳回的原因
      tempArry: [], // 临时存放file的数组
      formDataArray: '', // 上传的撤单说明图片数组 formdata
      UploadPicArry: [], // 上传的撤单说明图片显示出来的数组
      cancelReason: '', // 用户想要撤单的原因
      revokeId: '', // 如果是撤单详情进来则会有撤单的id
      picIds: [], // 更新撤单审核的图片id 数组
      remark: '' // 用户对本次撤单的说明
    }
  },
  methods: {
    goChangeApply () {
      this.cancelReason = this.pzObj.reason
      this.remark = this.pzObj.exp
      var picIds = []
      var UploadPicArry = []
      for (var i in this.pzObj.uploadFileEntities) {
        var obj = {
          src: this.pzObj.uploadFileEntities[i].filePath,
          id: this.pzObj.uploadFileEntities[i].id
        }
        UploadPicArry.push(obj)
        picIds.push(this.pzObj.uploadFileEntities[i].id)
      }
      this.picIds = picIds
      this.UploadPicArry = UploadPicArry
      if (this.UploadPicArry.length >= 3) {
        this.hideAddbtn = true
      }
      this.getpzDetail(true)
    },
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
          if (that.UploadPicArry.length >= 3) {
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
      if (this.UploadPicArry.length >= 3) {
        this.hideAddbtn = true
      } else {
        this.hideAddbtn = false
      }
    },
    getNowFormatDate () {
      var date = new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds()
      return currentdate
    },
    goSubmit () {
      if (!this.cancelReason) {
        this.$vux.toast.text('请填写撤单原因~', 'middle')
        return
      }
      if (this.picIds.length === 0 && this.tempArry.length === 0) {
        this.$vux.toast.text('请上传凭证~', 'middle')
        return
      }
      var formDataArray = new FormData()
      for (var i in this.tempArry) {
        formDataArray.append('files', this.tempArry[i])
      }
      formDataArray.append('orderId', this.orderId)
      formDataArray.append('remark', this.remark)
      formDataArray.append('reason', this.cancelReason)
      console.log('this.tempArry', this.tempArry)
      if (this.revokeId) { // 如果有撤单id则是更新撤单详情
        this.updateCDXhr(formDataArray)
      } else { // 申请撤单
        this.createCDXhr(formDataArray)
      }
    },
    createCDXhr (formDataArray) {
      this.formDataArray = formDataArray
      this.$http.post('subPur/submitWithdrawalRequest', this.formDataArray, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res) {
          var times = this.getNowFormatDate()
          this.$router.replace({name: 'paySuccess', query: {type: 'cancel', orderId: this.orderId, reason: this.cancelReason, times: times}})
        }
      }, () => {})
    },
    updateCDXhr (formDataArray) {
      this.formDataArray = formDataArray
      this.formDataArray.append('revokeId', this.revokeId)
      this.formDataArray.append('picIds', this.picIds)
      this.$http.post('subPur/updateWithdrawalRequest', this.formDataArray, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res) {
          this.$vux.toast.text('修改成功!', 'middle')
          this.getCDpzDetail(true) // 查看准备撤单的详情
          this.tempArry = []
        }
      }, () => {})
    },
    callPhone () {
      var tel = this.PayDetailObj.agentEntity ? this.PayDetailObj.agentEntity.mobile : '114'
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
    getpzDetail (showWrite) {
      this.$http.get('orderInfo/applyForWithdrawal', {
        params: {
          orderId: this.orderId
        }
      }).then((res) => {
        if (res) {
          this.pzObj = res.data.data
          if (showWrite) {
            this.type = 'write'
          }
        }
      })
    },
    getCDpzDetail (showRead) {
      this.$http.get('subPur/viewWithdrawalDetails', {
        params: {
          revokeId: this.revokeId
        }
      }).then((res) => {
        if (res) {
          this.pzObj = res.data.data
          if (showRead) {
            this.type = 'read'
          }
          if (this.pzObj.uploadFileEntities && this.pzObj.uploadFileEntities.length > 0) {
            var list = []
            for (var i in this.pzObj.uploadFileEntities) {
              var obj = {
                msrc: this.pzObj.uploadFileEntities[i].filePath,
                src: this.pzObj.uploadFileEntities[i].filePath,
                w: 800,
                h: 400
              }
              list.push(obj)
            }
            this.list = list
          }
        }
      })
    },
    inpuCorrectPass () {
      this.cancelApplyxhr()
    },
    changepz (id) {
      this.$router.replace({name: 'Subvoucher', query: {payAuditId: id}})
    },
    goCancelApply () {
      var that = this
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '提示',
        sureTitle: '是否取消该撤单申请?', // 二次确认弹出的提示框
        onConfirm: function () {
          that.inpuPassObj.inputPasStep = true
        }
      }
    },
    cancelApplyxhr () { // 取消撤单申请
      var param = {
        revokeId: this.revokeId
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/cancelTheWithdrawalRequest', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    }
  },
  directives: {
    TransferDom
  },
  components: {
    Previewer,
    Confirm,
    inputPass,
    Group,
    Cell,
    XInput
  }
}
</script>

<style lang="less" scoped>
.tempbox{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 296;
  overflow-y: scroll;
  padding-top: .46rem;
  margin: auto;
  background-color:#f5f5f5;
  .pay-pz{
    .newgoodsbox{
      width: 100%;
      background-color: #fff;
      border-top: .01rem solid #f5f5f5;
      .itembox{
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height:.96rem;
        padding: 0 .15rem;
        .goodspicleft{
          width: .64rem;
          height: .64rem;
          margin-right: .12rem;
        }
        .midbox{
          flex: 1;
          height: .64rem;
        }
        .rigbox{
          width: .56rem;
          height: .64rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-end;
          span{
            line-height: 1.8;
          }
        }
      }
      .totalcount{
        width: 100%;
        height: .4rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        border-top: .01rem solid #f5f5f5;
        padding-right: .12rem;
      }
    }
    p{
      padding: .1rem .14rem;
      background-color: #fff;
      font-size: .14rem;
      display: flex;
      align-items: center;
      border-bottom: .01rem solid rgba(245,245,245,1);
      .moreic{
        width: .12rem;
        height: .18rem;
      }
    }
    .tit{
      width: 100%;
      padding: .06rem .14rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      border-bottom: .01rem solid rgba(245,245,245,1);
      .pztip{
        width: .15rem;
        height: .15rem;
        background-color: #00A2E9;
        border-radius: .15rem;
        color: #fff;
        text-align: center;
        line-height: .15rem;
        font-size: .12rem;
        margin-right:.1rem ;
      }
      p{
        padding: 0;
        height: 100%;
        flex: 1;
        border-bottom: none;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.5;
      }
    }
    .czpz{
      justify-content: center;
      border-bottom: none;
      margin-bottom: .11rem;
      span{
        padding: .02rem .1rem;
        white-space: nowrap;
        line-height: .25rem;
        margin: 0.04rem .5rem;
        text-align: center;
        color: #fff;
        border-radius: .15rem;
      }
      .haspay{
        background-color: #fc6d5d;
      }
      .refusepz{
        background-color: #00A2E9;
      }
    }
    .dkdetail{
      margin-top: .11rem;
      .cdtit{
        line-height: 1.5;
        padding-left: .14rem;
        margin: .15rem 0 .1rem;
      }
      p{
        color: #999;
        span{
          color: #000;
          margin-left: .1rem
        }
      }
      .pzpicbox{
        color: #999;
        width: 100%;
        background-color: #fff;
        padding: .1rem .16rem;
        display: flex;
        div{
          flex: 1;
          margin-left: .1rem;
          flex-wrap: wrap;
          display: flex;
          img{
            width: .4rem;
            height: .4rem;
            margin: .03rem .05rem;
          }
        }
      }
    }
    .connectother{
      width:3.11rem;
      height:.33rem;
      background:rgba(0,162,233,1);
      border-radius:.17rem;
      color: #fff;
      display: block;
      margin: .1rem auto 1.2rem;
      text-align: center;
      line-height: .33rem;
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
    .subbtn2{
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
    .redcolor{
      color: #FF0000
    }
  }
}
</style>
