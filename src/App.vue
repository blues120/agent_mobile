<template>
  <div id="app">
    <div class="newmainbody" style="padding-top:46px">
      <div v-transfer-dom>
        <loading :show="requestLoading>0?true:false"></loading>
      </div>
      <router-view></router-view>
      <section class="mycommonheaderbox">
        <x-header style="background-color:#fff;" :left-options="leftOptions" :title="title"></x-header>
      </section>
      <page-footer v-if="showFooter"></page-footer>
    </div>
  </div>
</template>

<script>
import {Loading, TransferDom, XHeader} from 'vux'
import pageFooter from '@/components/PageFooter'
import { mapState } from 'vuex'
export default {
  directives: {
    TransferDom
  },
  name: 'App',
  data () {
    return {
      showFooter: true
    }
  },
  methods: {
    hideFooter (name) {
      if (name === 'Home' || name === 'My' || name === 'Message') {
        this.showFooter = true
      } else {
        this.showFooter = false
      }
    }
  },
  components: {
    pageFooter,
    Loading,
    XHeader
  },
  created () {
    this.hideFooter(this.$route.name)
  },
  watch: {
    $route (to, from) {
      this.hideFooter(to.name)
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      path: state => state.route.path,
      requestLoading: state => state.vux.requestLoading,
      sideBarState: state => state.sideBarState
    }),
    leftOptions () {
      return {
        showBack: this.$route.path !== '/home' && this.$route.path !== '/message' && this.$route.path !== '/my' && this.$route.path !== '/bind' && this.$route.path !== '/authorization' && this.$route.path !== '/applyJoin/third-step' && this.$route.path !== '/applyJoin/first-step'
      }
    },
    title () {
      if (this.$route.path === '/home') return '美瘦商城'
      if (this.$route.path === '/message') return '消息'
      if (this.$route.path === '/applyJoin/first-step') return '申请代理商'
      if (this.$route.path === '/applyJoin/second-step') return '申请代理商'
      if (this.$route.path === '/home/go-purchase') return '我要进货'
      if (this.$route.path === '/home/go-purchase/goods-detail') return '商品详情'
      if (this.$route.path === '/home/go-purchase/go-truck') return '进货车'
      if (this.$route.path === '/home/go-purchase/go-settlement') return '确认订单'
      if (this.$route.path === '/home/go-purchase/go-settlement/sub-voucher') return '打款凭证'
      if (this.$route.path === '/home/my-orders/apply-cancel') return '撤单详情'
      if (this.$route.path === '/home/my-orders') return '我的订单'
      if (this.$route.path === '/home/pay-pz') return '查看凭证'
      if (this.$route.path === '/home/my-orders/order-detail') return '订单详情'
      if (this.$route.path === '/home/invitation-agent') return '邀请代理'
      if (this.$route.path === '/home/invitation-agent/create-link') return '邀请代理'
      if (this.$route.path === '/home/examine-list') return '审核代理'
      if (this.$route.path === '/home/my-orders/order-detail/paypz') return '打款凭证'
      if (this.$route.path === '/my') return '我的'
      if (this.$route.path === '/my/set-myinfo') return '编辑资料'
      if (this.$route.path === '/my/set-myinfo/info-detail') return '个人信息'
      if (this.$route.path === '/my/set-myinfo/info-detail/check-id') return '身份证'
      if (this.$route.path === '/my/set-myinfo/info-detail/user-mobile') return '手机号码'
      if (this.$route.path === '/my/set-myinfo/remember-pass') return '修改密码'
      if (this.$route.path === '/my/set-myinfo/common-kd') return '常用发货快递'
      if (this.$route.path === '/my/set-myinfo/address-list') return '收货地址'
      if (this.$route.path === '/my/set-myinfo/care-shop') return '关注商家公众号'
      if (this.$route.path === '/my/tx') return '可提现账户'
      if (this.$route.path === '/my/tx/tx-djs') return '结算'
      if (this.$route.path === '/my/tx/tx-srzd') return '收支账单'
      if (this.$route.path === '/my/tx/tx-ing') return '提现'
      if (this.$route.path === '/my/tx/tx-ing/tx-detail') return '提现详情'
      if (this.$route.path === '/my/tx/tx-sq') return '申请提现'
      if (this.$route.path === '/my/sk-account') return '收款账户'
      if (this.$route.path === '/home/other-orders') return '下级进货'
      if (this.$route.path === '/home/other-orders/xjorder-detail') return '下级进货'
      if (this.$route.path === '/home/other-orders/wait-send') return '待发货统计'
      if (this.$route.path === '/home/y-ck') return '云仓库'
      if (this.$route.path === '/home/y-ck/kc-detail') return '库存商品列表'
      if (this.$route.path === '/home/y-ck/th-dd') return '提货订单'
      if (this.$route.path === '/home/y-ck/th-dd/thdd-detail') return '提货订单详情'
      if (this.$route.path === '/home/y-ck/kc-jl') return '库存记录'
      if (this.$route.path === '/home/jh-relation') return '进货关系'
      if (this.$route.path === '/home/jh-relation/agent-detail') return '代理详情'
      if (this.$route.path === '/home/jh-relation/agent-detail/agentkc-list') return '代理库存'
      if (this.$route.path === '/home/yq-relation') return '邀请关系'
      if (this.$route.path === '/home/yq-relation/yqagent-detail') return '代理详情'
      if (this.$route.path === '/home/sq-zs') return '授权证书'
      if (this.$route.path === '/home/up-process') return '升级处理'
      if (this.$route.path === '/home/up-process/record-list') return '升级记录'
      if (this.$route.path === '/home/up-process/record-list/record-detail') return '升级记录详情'
      if (this.$route.path === '/applyJoin/third-step/agent-detail') return '我的个人信息'
      return this.componentName ? `Demo/${this.componentName}` : '美瘦商城'
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/css/base.less';
*{
  box-sizing: border-box;
}
html, body, #app{
  height: 100%;
  .mycommonheaderbox{
    width: 100%;
    height: .46rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 490;
  }
  /deep/ .vux-header{
    font-size: 0.18rem;
    color: #333;
    height: .46rem;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 490;
  }
  /deep/ .vux-header .vux-header-title{
    font-size: 0.18rem;
    color: #333;
    height: .46rem;
  }
  /deep/ .vux-header .vux-header-left a, .vux-header .vux-header-left button, .vux-header .vux-header-right a, .vux-header .vux-header-right button{
    color:#333;
  }
  /deep/.vux-header .vux-header-left .left-arrow:before{
    border-color:#333;
  }
  /deep/.vux-header-back{
    font-size: 17px;
  }
  /deep/.vux-header .vux-header-title{
    color: #333 !important;
  }
  .newmainbody{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: scroll;
    padding-bottom:.5rem ;
    margin: auto;
  }
  .subbtn{
    width:3.11rem;
    height:.44rem;
    background:rgba(0,162,233,1);
    border-radius:.22rem;
    text-align: center;
    line-height: .44rem;
    color: #fff;
    font-size:.16rem ;
    margin: .3rem auto;
  }
  .all-done{
    line-height: .3rem;
    text-align: center;
  }
}
</style>
