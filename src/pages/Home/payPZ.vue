<template>
  <div class="pay-pz">
    <p class="tit">
      <span class="pztip">!</span>
      <span>{{revokeId ? '撤单待审核':from=='other'?'下级打款凭证待审核':(pzObj.status==1?'待商家审核':pzObj.status==2?'待代理审核':pzObj.status==3?'已付款':pzObj.status==4?'已失效':pzObj.status==5?'已取消':'')}}</span>
    </p>
    <div v-if="revokeId">
      <p style="color: #fc6d5d;line-height: 1.5">请仔细核实进货代理撤单信息, 确认无误后进行审核操作</p>
    </div>
    <div v-else>
      <p style="color: #999;line-height: 1.5" v-if="from=='other'">请仔细核对下级代理 {{pzObj.agentName}} ( {{pzObj.mobile}} )的打款信息,
        确认无误后进行审核操作</p>
      <p style="color: #fc6d5d;line-height: 1.5" v-else>{{pzObj.status==1?'商家正在审核，请耐心等待':pzObj.status==2?'代理正在审核，请耐心等待':pzObj.status==3?'已付款':pzObj.status==4?'已失效':pzObj.status==5?'已取消':''}}</p>
    </div>
    <div v-if="revokeId">
      <!--本部分已完成-->
      <p class="czpz">
        <span class="haspay" @click="SureCD">确认撤单</span>
        <span class="refusepz" @click="RefuseCD">驳回撤单</span>
      </p>
    </div>
    <div  v-else>
      <!--本部分已完成-->
      <p class="czpz"  v-if="from=='other'">
        <span class="haspay" @click="agreeFK">已付款</span>
        <span class="refusepz" @click="refuseFK">凭证驳回</span>
      </p>
      <!--本部分未完成-->
      <p class="czpz" v-if="from!='other' && (pzObj.status==1 || pzObj.status==2)">
        <span class="haspay" @click="changepz(pzObj.id)">修改打款凭证</span>
        <span class="refusepz" @click="caclepz">取消打款凭证</span>
      </p>
    </div>
    <!--<p style="justify-content: space-between">-->
      <!--<span>打款历史审核</span>-->
      <!--<img src="~@/assets/images/gosettlement/ri-dir.png" alt="" class="moreic">-->
    <!--</p>-->
    <div class="dkdetail" v-if="revokeId">
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
    <div class="dkdetail" v-else>
      <p>
        打款金额:  <span style="color:#FF0000;"> ¥ {{pzObj.orderPrice}}</span>
      </p>
      <p>
        打款备注:  <span>{{pzObj.remark || "无"}}</span>
      </p>
      <p>
      打款单号:  <span>{{pzObj.paySn}}</span>
      </p>
      <p>
      申请时间:  <span>{{pzObj.createTime}}</span>
      </p>
      <div class="pzpicbox" v-if="list.length>0">
        <span>
          打款凭证:
        </span>
        <div>
          <img  v-for="(item, index) in list" :src="item.msrc" class="icon" :key="index"  @click="show(index)">
          <div v-transfer-dom>
            <previewer :list="list" ref="previewer"></previewer>
          </div>
        </div>
     </div>
      <span class="connectother"  v-if="payAuditId" @click="callPhone(pzObj.mobile)">联系{{from=='other'?'下级':'上级'}}</span>
    </div >
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
</template>

<script>
import { Previewer, TransferDom, Confirm } from 'vux'
import inputPass from '@/components/inputPass'
import Qs from 'qs'
export default {
  created () {
    if (this.$route.query.payAuditId) {
      this.payAuditId = this.$route.query.payAuditId
      this.getpzDetail()
    }
    if (this.$route.query.revokeId) {
      this.revokeId = this.$route.query.revokeId
      this.getCDpzDetail()
    }
    if (this.$route.query.from) {
      this.from = this.$route.query.from
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
      from: '', // other 是 查看下级订单的打款凭证 my 是查看我自己订单的打款凭证
      payAuditId: '', // 如果有打款的id 说明是 进来查看打款凭证的（有可能是查看自己的打款凭证，有可能是查看下级订单的打款凭证根据from判断）
      revokeId: '', // 如果有revokeId 则说明是进来查看撤单凭证的
      pzObj: {},
      list: [],
      refuseReason: '' // 驳回的原因
    }
  },
  methods: {
    callPhone (tel) {
      window.location.href = 'tel:' + tel
    },
    show (index) {
      this.$refs.previewer.show(index)
    },
    getpzDetail () {
      this.$http.get('orderInfo/checkCertificate', {
        params: {
          payAuditId: this.payAuditId
        }
      }).then((res) => {
        if (res) {
          this.pzObj = res.data.data
          var PayDetailObj = res.data.data
          localStorage.setItem('PayDetailObj', JSON.stringify(PayDetailObj))
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
    getCDpzDetail () {
      this.$http.get('subPur/viewWithdrawalDetails', {
        params: {
          revokeId: this.revokeId
        }
      }).then((res) => {
        if (res) {
          this.pzObj = res.data.data
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
      if (this.makeSureObj.type === 1) { // 如果是同意付款
        this.agreeFKxhr()
      }
      if (this.makeSureObj.type === 2) { // 如果是驳回付款
        this.refuseFKxhr(this.refuseReason)
      }
      if (this.makeSureObj.type === 3) { // 如果是同意撤单申请
        this.SureCDxhr()
      }
      if (this.makeSureObj.type === 4) { // 如果是驳回撤单申请
        this.RefuseCDxhr(this.refuseReason)
      }
      if (this.makeSureObj.type === 5) { // 如果是取消该打款凭证
        this.caclepzxhr()
      }
    },
    agreeFK () {
      var that = this
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '提示',
        type: '1',
        sureTitle: '是否已经收到货款?', // 二次确认弹出的提示框
        onConfirm: function () {
          that.inpuPassObj.inputPasStep = true
        }
      }
    },
    refuseFK () {
      var that = this
      this.refuseReason = ''
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '是否驳回该打款凭证?', // 二次确认弹出的提示框
        type: '2',
        showinput: true,
        onConfirm (msg) {
          if (msg) {
            that.refuseReason = msg
            that.inpuPassObj.inputPasStep = true
          } else {
            that.$vux.toast.text('请输入驳回理由', 'middle')
          }
        }
      }
    },
    agreeFKxhr () {
      var param = {
        payAuditId: this.payAuditId
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/agreePaymentCertificate', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    refuseFKxhr (reason) {
      var param = {
        payAuditId: this.payAuditId,
        reason: reason
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/rejectCertificate', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    changepz (id) {
      this.$router.replace({name: 'Subvoucher', query: {payAuditId: id}})
    },
    caclepz () {
      var that = this
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '提示',
        type: '5',
        sureTitle: '是否取消该打款凭证?', // 二次确认弹出的提示框
        onConfirm: function () {
          that.inpuPassObj.inputPasStep = true
        }
      }
    },
    caclepzxhr (reason) {
      var param = {
        payAuditId: this.payAuditId
      }
      param = Qs.stringify(param)
      this.$http.post('orderInfo/revokePaymentCertificate', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    RefuseCD () {
      var that = this
      this.refuseReason = ''
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '确定要驳回该撤单申请么?', // 二次确认弹出的提示框
        type: '4',
        showinput: true,
        onConfirm (msg) {
          if (msg) {
            that.refuseReason = msg
            that.inpuPassObj.inputPasStep = true
          } else {
            that.$vux.toast.text('请输入驳回理由!', 'middle')
          }
        }
      }
    },
    RefuseCDxhr (reason) {
      var param = {
        revokeId: this.revokeId,
        reason: reason
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/rejectCertificate', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          this.$router ? this.$router.back() : window.history.back()
        }
      })
    },
    SureCD () {
      var that = this
      this.makeSureObj = {
        show: true, // 是否显示二次提示框（确认打款，凭证驳回
        head: '确认撤单',
        type: '3',
        sureTitle: '确定要确认撤单吗?', // 二次确认弹出的提示框
        onConfirm: function () {
          that.inpuPassObj.inputPasStep = true
        }
      }
    },
    SureCDxhr () {
      var param = {
        revokeId: this.revokeId
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/confirmWithdrawal', param).then((res) => {
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
    inputPass
  }
}
</script>

<style lang="less" scoped>
.pay-pz{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  overflow-y: scroll;
  padding-top: .46rem;
  margin: auto;
  background-color:#f5f5f5;
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
    height: .42rem;
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
}
</style>
