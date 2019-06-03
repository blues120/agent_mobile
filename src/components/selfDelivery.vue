<template>
  <div>
    <div v-transfer-dom>
      <confirm v-model="deliveryObj.warningObj.showWaring"
               :title="deliveryObj.warningObj.tit"
               @on-confirm="deliveryObj.warningObj.onConfirm">
        <p style="text-align:center;">{{deliveryObj.warningObj.body}}</p>
      </confirm>
    </div>
    <actionsheet v-model="deliveryObj.selfPostTip" :menus="deliveryObj.menus" @on-click-menu="click" show-cancel></actionsheet>
  </div>
</template>

<script>
import {Confirm, TransferDom, Actionsheet} from 'vux'
import Qs from 'qs'
export default {
  directives: {
    TransferDom
  },
  components: {
    Confirm,
    Actionsheet
  },
  methods: {
    sendGoods (id) { // 跳转到下级进货的订单详情页。去发货
      if (this.$route.path == '/home/other-orders/xjorder-detail') {
        this.$emit('changeType')
      } else {
        this.$router.push({name: 'xjOrderDetail', query: {orderId: id, type: 'send'}})
      }
    },
    cloudPostXhr () { // 云库存代发
      var self = this
      var param = {
        orderId: this.deliveryObj.caozuoId
      }
      param = Qs.stringify(param)
      this.$http.post('subPur/cloudInventoryGeneration', param).then((res) => {
        if (res) {
          this.$vux.toast.text('操作成功', 'middle')
          setTimeout(() => {
            self.$emit('deliverySuccess', true) // 发货成功了，上个页面需要做对应的操作
          }, 500)
        }
      })
    },
    click (key) {
      var that = this
      if (key != 'cancel') {
        if (!this.deliveryObj[key]) { // 如果点击的这个实体库存或者云库存不存在,跳转到补货统计页面
          this.$router.push({name: 'waitSend', query: {from: key, orderId: this.deliveryObj.caozuoId}})
        } else {
          if (key == 'physical') {
            this.sendGoods(this.deliveryObj.caozuoId)
          } else {
            this.deliveryObj.warningObj = {
              showWaring: true, // 默认不展示
              tit: '确认云库存代发?', // 提示的标题
              body: '即将扣除您对应商品额云库存让总部代发,总部将收取代发费¥0.00', // 提示的文字
              onConfirm: function () {
                that.cloudPostXhr()
              }
            }
          }
        }
      }
    }
  },
  props: ['deliveryObj']
}
</script>

<style lang="less" scope>

</style>
