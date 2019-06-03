<template>
  <main class="home">
    <header class="header">
      <nav class="control-list">
        <p class="title">下级进货</p>
        <ul>
          <li @click="goOtherPurchase()">
            <img src="~@/assets/images/home/all.png" alt="" class="icon">
            <p class="text">全部</p>
            <span class="goodaccount" v-if="goodsAccountObj.full">{{goodsAccountObj.full}}</span>
          </li>
          <li @click="goOtherPurchase(1)">
            <img src="~@/assets/images/home/daifukuan.png" alt="" class="icon">
            <p class="text">待付款</p>
            <span class="goodaccount" v-if="goodsAccountObj.pending_payment">{{goodsAccountObj.pending_payment}}</span>
            </li>
          <li @click="goOtherPurchase(2)">
            <img src="~@/assets/images/home/daifahuo.png" alt="" class="icon">
            <p class="text">待发货</p>
            <span class="goodaccount" v-if="goodsAccountObj.be_delivered">{{goodsAccountObj.be_delivered}}</span>
          </li>
          <li @click="goOtherPurchase(3)">
            <img src="~@/assets/images/home/daishouhuo.png" alt="" class="icon">
            <p class="text">待收货</p>
            <span class="goodaccount" v-if="goodsAccountObj.pending_receipt">{{goodsAccountObj.pending_receipt}}</span>
          </li>
          <li @click="goOtherPurchase(4)">
            <img src="~@/assets/images/home/daiqueren.png" alt="" class="icon">
            <p class="text">已完成</p>
            <span class="goodaccount" v-if="goodsAccountObj.finish">{{goodsAccountObj.finish}}</span>
          </li>
        </ul>
      </nav>
    </header>
    <section class="control-center">
      <ul>
        <li @click="Gopurchase">
          <p class="title">我要进货</p>
          <p class="subtitle">随时随地，轻松拿货</p>
          <i class="icon"></i>
        </li>
        <li  @click="GoCloudpurchase">
          <p class="title">买云库存</p>
          <p class="subtitle">随时随地，轻松拿货</p>
          <i class="icon"></i>
        </li>
        <li @click="GoOrders">
          <p class="title" >我的订单</p>
          <p class="subtitle">随时随地，轻松查看</p>
          <i class="icon"></i>
        </li>
        <li @click="goYck">
          <p class="title">云仓库</p>
          <p class="subtitle">随时随地，轻松查看</p>
          <i class="icon"></i>
        </li>
      </ul>
    </section>
    <section class="img-box"><img src="~@/assets/images/home/img@3x.jpg" alt=""></section>
    <section class="more-func">
      <ul>
        <li @click="ToInvitationAgent">
          <img src="~@/assets/images/home/yaoqingdaili@3x.png" alt="" class="icon">
          <p class="text">邀请代理</p>
        </li>
        <li @click="ToExamineList">
          <img src="~@/assets/images/home/shenhedaili@3x.png" alt="" class="icon">
          <p class="text">审核代理</p>
        </li>
        <li>
          <img src="~@/assets/images/home/jiangli@3x.png" alt="" class="icon">
          <p class="text">奖励</p>
        </li>
        <li @click="gomyAchieve">
          <img src="~@/assets/images/home/wodeyeji@3x.png" alt="" class="icon">
          <p class="text">我的业绩</p>
        </li>
        <li @click="goJHRelation">
          <img src="~@/assets/images/home/jinhuoguanxiwang@3x.png" alt="" class="icon">
          <p class="text">进货关系网</p>
        </li>
        <li @click="goYQRelation">
          <img src="~@/assets/images/home/yaoqingguanxiwang@3x.png" alt="" class="icon">
          <p class="text">邀请关系网</p>
        </li>
        <li @click="goSqzs">
          <img src="~@/assets/images/home/shouquanzhengshu@3x.png" alt="" class="icon">
          <p class="text">授权证书</p>
        </li>
        <li @click="goUpgradeLevel">
          <img src="~@/assets/images/home/shengjichuli@3x.png" alt="" class="icon">
          <p class="text">升级处理</p>
        </li>
      </ul>
    </section>
    <page-view></page-view>
  </main>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  name: 'Home',
  created () {
    var openId = localStorage.getItem('openid') || ''
    if (this.$route.query.linkId) {
      this.linkId = this.$route.query.linkId
    }
    if (openId) {
      this.checkUserStatus(openId)
    }
  },
  data () {
    return {
      goodsAccountObj: {} // 所有商品数量统计
    }
  },
  methods: {
    ToInvitationAgent () { // 邀请代理
      this.$router.push({name: 'InvitationAgent',
        query: {
          goInvite: true // 这里是生成邀请不是申请加入
        }
      })
    },
    getAllTypeNum () { // 获取各种状态的订单数量
      var flag = localStorage.getItem('Flag') || ''
      if (flag !== 'isLogin') {
        return false
      }
      this.$http.get('subPur/subDiffTypeOrderCount', {
        params: {
          type: ''
        }
      }).then((res) => {
        if (res && res.data.data) {
          this.goodsAccountObj = res.data.data
        }
      })
    },
    goBeforeLoginUrl (status) { // status :  0 需要登录  1 不需要登录，直接进入主界面  2 代理商关闭 3 准代理
      let url = sessionStorage.getItem('beforeLoginUrl') || ''
      if (status === 0) {
        if (this.linkId) { // 如果有邀请链接说明是点邀请链接进来的新用户
          this.$router.replace({name: 'firstStep', query: {linkId: this.linkId}})
        } else {
          this.$router.replace({name: 'Bind'})
        }
      } else if (status === 1) {
        this.getAllTypeNum()
        if (!url || url.indexOf('/authorization') !== -1) {
          this.$router.replace({name: 'Home'})
        } else {
          if (url === '/') {
            url = '/home'
          }
          this.$router.replace({path: url})
          sessionStorage.removeItem('beforeLoginUrl')
        }
      } else if (status === 2) {
        this.$vux.toast.text('代理商被关闭', 'middle')
      } else if (status === 3) {
        this.$router.replace({name: 'thirdStep'})
      }
    },
    checkUserStatus (openId) {
      // 如果连接中有微信返回的 code，则用此 code 调用后端接口，向微信服务器请求用户信息
      if (openId) {
        this.$http.get('checkWXUserStatus', {
          params: {
            openId: openId
          }
        }).then((res) => {
          if (res) {
            localStorage.setItem('Flag', 'isLogin')
            this.goBeforeLoginUrl(res.data.data.status) // 页面恢复(进入用户一开始请求的页面)
          }
        })
      }
    },
    Gopurchase () { // 我要进货
      localStorage.setItem('cartType', 2)
      localStorage.setItem('upgradePurchase', false)
      this.$router.push({name: 'Gopurchase'})
    },
    GoCloudpurchase () { // 买云库存
      localStorage.setItem('cartType', 1)
      localStorage.setItem('upgradePurchase', false)
      this.$router.push({name: 'Gopurchase'})
    },
    GoOrders () { // 我的订单页面
      this.$router.push({name: 'myOrders', query: {orderModeType: 1}})
    },
    goOtherPurchase (orderStatus) { // 下级进货订单页面
      orderStatus = orderStatus || ''
      this.$router.push({name: 'otherOrders', query: {orderStatus: orderStatus}})
    },
    ToExamineList () { // 审核代理
      this.$router.push({name: 'ExamineList'})
    },
    goYck () { // 我的云仓库
      this.$router.push({name: 'YCK'})
    },
    goSqzs () { // 授权证书
      this.$router.push({name: 'SQZS'})
    },
    goUpgradeLevel () { // 升级处理
      this.$router.push({name: 'UpgradeLevel'})
    },
    goJHRelation () { // 进货关系网
      this.$router.push({name: 'JHRelation'})
    },
    gomyAchieve () { // w我的业绩
      this.$router.push({name: 'myAchieve'})
    },
    goYQRelation () { // 邀请关系网
      this.$router.push({name: 'YQRelation'})
    }
  },
  components: {
    PageView
  }
}
</script>

<style lang="less" scoped>
.home{
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
          position: relative;
          .goodaccount{
            position: absolute;
            top: -.06rem;
            right:.15rem;
            background-color: #FF0000;
            color: #fff;
            padding: .02rem .05rem;
            font-size: .12rem;
            border-radius: .08rem;
          }
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
  .control-center{
    padding: .2rem 0;
    ul{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      width: 3.5rem;
      margin: 0 auto;
      padding-top: .1rem;
      li{
        width: 1.7rem;
        height: .7rem;
        border-radius: .05rem;
        margin-top: .1rem;
        padding: .1rem 0 0 .16rem;
        box-sizing: border-box;
        position: relative;
        background-image: url('~@/assets/images/home/bottom_line.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position-y: .08rem;
        .title{
          margin-bottom: .1rem;
          font-size: .15rem;
        }
        .subtitle{
          font-size: .12rem;
          color: #999;
        }
        i.icon{
          display: block;
          width: .30rem;
          height: .30rem;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: .1rem;
        }
      }
      li:nth-of-type(1){
        background-color: #cbeaff;
        i.icon{
          display: block;
          background: url('~@/assets/images/home/jinhuo_icon.png') no-repeat center/cover;
        }
      }
      li:nth-of-type(2){
        background-color: #edd98a;
        i.icon{
          display: block;
          background: url('~@/assets/images/home/yunkucun_icon.png') no-repeat center/cover;
        }
      }
      li:nth-of-type(3){
        background-color: #e9d9fe;
        i.icon{
          display: block;
          height: .28rem;
          width: .24rem;
          background: url('~@/assets/images/home/dingdan_icon.png') no-repeat center/cover;
        }
      }
      li:nth-of-type(4){
        background-color: #f4bf8a;
        i.icon{
          display: block;
          height: .24rem;
          background: url('~@/assets/images/home/cangku_icon.png') no-repeat center/cover;
        }
      }
    }
  }
  .img-box{
    height: 1.1rem;
    margin-bottom: .1rem;
    img{
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .more-func{
    background-color: #fff;
    height: 1.28rem;
    ul{
      width: 3.5rem;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;
      li{
        width: .8rem;
        margin-bottom: .05rem;
        img.icon{
          display: block;
          width: .25rem;
          height: .25rem;
          margin: 0 auto;
          margin-bottom: .05rem;
        }
        .text{
          text-align: center;
        }
      }
    }
  }
}
</style>
