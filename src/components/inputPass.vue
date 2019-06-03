<template>
  <div class="input-pass">
    <!--线上支付输入密码框-->
    <div v-transfer-dom>
      <x-dialog v-model="inpuPassObj.inputPasStep" class="dialog-pass">
        <div class="passwordboxtit">
          <img src="~@/assets/images/gopurchase/closebtn.png" alt="" class="icon" @click="closecheckloginNow">
          验证登录信息
        </div>
        <p>为了您的资金安全，请再次输入您的登录密码！</p>
        <x-input  v-model="inpuPassObj.userPassword" type="password" class="inputpass" placeholder="请输入您的登录密码"></x-input>
        <span class="forgetPass" @click="forgotpass">忘记密码?</span>
        <div class="surebtn" @click="surepass">确认</div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { TransferDom, XDialog, XInput } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog,
    XInput
  },
  methods: {
    forgotpass () {
      this.$router.replace({name: 'Forget'})
    },
    closecheckloginNow () {
      this.inpuPassObj.inputPasStep = false
    },
    surepass () {
      if (!this.inpuPassObj.userPassword) {
        this.$vux.toast.text('登录密码不能为空', 'middle')
        return
      }
      this.$http.get('placeOrders/verifyLoginUserPwd', {
        params: {
          pwd: this.inpuPassObj.userPassword
        }
      }).then((res) => {
        if (res) {
          this.$vux.toast.text('登录密码验证成功~', 'middle')
          this.closecheckloginNow()
          localStorage.setItem('userPass', this.inpuPassObj.userPassword)
          this.$emit('inpuCorrectPass', true) // 输入的登录密码是正确的
        }
      }, () => {})
    }
  },
  props: ['inpuPassObj']
}
</script>

<style lang="less" scope>
@import "../pages/Home/gosettlement";
</style>
