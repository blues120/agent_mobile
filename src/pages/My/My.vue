<template>
  <main class="my">
    <header class="header">
      <div class="content">
        <div class="portrait"><img :src='userInfo.avatorUrl'></div>
        <div class="info"  @click="editMyinfo">
          <p class="name">{{userInfo.name}}</p>
          <p class="shenfen">
            <img src='~@/assets/images/my/hg.png' >
            <span>{{userInfo.gradeAliasName}}</span>
          </p>
          <p class="phone-number">{{userInfo.mobile}} <i class="icon"></i></p>
        </div>
      </div>
    </header>
    <section class="cash-account" @click="goTX">
      <div class="content">
        <div class="con-left">
          <i class="icon"></i>
          <div class="info">
            <p class="title">可提现账户</p>
            <p class="msg">待结算：{{userTXObj.balanceIncomeAuditing}}元</p>
          </div>
        </div>
        <div class="con-right">
          <span class="text">可提现：</span>
          <span class="money">{{userTXObj.balanceIncome}}元</span>
          <i class="icon"></i>
        </div>
      </div>
    </section>
    <!--<section class="loan-account" @click="goDK">-->
      <!--<div class="content">-->
        <!--<div class="con-left">-->
          <!--<i class="icon icondk"></i>-->
          <!--<div class="info">-->
            <!--<p class="title">贷款账户</p>-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="con-right">-->
          <!--<span class="text">贷款余额：</span>-->
          <!--<span class="money">9996.00元</span>-->
          <!--<i class="icon"></i>-->
        <!--</div>-->
      <!--</div>-->
    <!--</section>-->
    <!--<section class="more-list">-->
      <!--<ul class="list-item">-->
        <!--<li>-->
          <!--<div class="content">-->
            <!--<div class="con-left">-->
              <!--<i class="icon iconzd"></i>-->
              <!--<div class="info">账单</div>-->
            <!--</div>-->
            <!--<div class="con-right">-->
              <!--<i class="icon"></i>-->
            <!--</div>-->
          <!--</div>-->
        <!--</li>-->
        <!--<li>-->
          <!--<div class="content">-->
            <!--<div class="con-left">-->
              <!--<i class="icon icontj"></i>-->
              <!--<div class="info">商品出货统计</div>-->
            <!--</div>-->
            <!--<div class="con-right">-->
              <!--<i class="icon"></i>-->
            <!--</div>-->
          <!--</div>-->
        <!--</li>-->
      <!--</ul>-->
    <!--</section>-->
    <section class="icon-list">
      <div class="content">
        <div class="icon-item" @click="goSKAccount">
          <img src="~@/assets/images/my/zhanghao.png" alt="ICON" class="icon">
          <p class="text">收款账户</p>
        </div>
        <!--<div class="icon-item">-->
          <!--<img src="~@/assets/images/my/shangcheng.png" alt="ICON" class="icon">-->
          <!--<p class="text">内购商城</p>-->
        <!--</div>-->
        <!--<div class="icon-item">-->
          <!--<img src="~@/assets/images/my/dingdan.png" alt="ICON" class="icon">-->
          <!--<p class="text">内购订单</p>-->
        <!--</div>-->
        <div class="icon-item" @click="callZB">
          <img src="~@/assets/images/my/zongbu.png" alt="ICON" class="icon">
          <p class="text">联系总部</p>
        </div>
      </div>
    </section>
    <section class="logo-img"><img src="~@/assets/images/my/meishou_footer_icon.png" alt="Logo"><p class="text">美瘦酵素</p></section>
    <page-view></page-view>
  </main>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  name: 'My',
  components: {
    PageView
  },
  data () {
    return {
      userInfo: {}, // 用户信息对象
      userTXObj: {} // 用户的可提现账户对象
    }
  },
  created () {
    this.getUerInfo()
    this.getTXInfo()
  },
  methods: {
    editMyinfo () { // 编辑我的信息
      this.$router.push({name: 'setMyInfo'})
    },
    goTX () {
      this.$router.push({name: 'TX'})
    },
    goDK () {
      this.$router.push({name: 'DK'})
    },
    goSKAccount () {
      this.$router.push({name: 'SKAccount'})
    },
    callZB () {
      var tel = '4006891090' // 美瘦总部座机
      window.location.href = 'tel:' + tel
    },
    getUerInfo () {
      this.$http.get('info').then((res) => {
        if (res.data.code == 200) {
          this.userInfo = res.data.data
          localStorage.setItem('userInfo', JSON.stringify(res.data.data))
        }
      })
    },
    getTXInfo () {
      this.$http.get('incoming/info').then((res) => {
        if (res.data.code == 200) {
          this.userTXObj = res.data.data
          localStorage.setItem('userTXObj', JSON.stringify(res.data.data))
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.my{
  .header{
    width: 100%;
    height: 1.45rem;
    background: url('~@/assets/images/my/header_bg.png') no-repeat center/cover;
    display: flex;
    align-items: center;
    margin-bottom: .1rem;
    .content{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .portrait{
        width: .79rem;
        height: .79rem;
        border-radius: 100%;
        overflow: hidden;
        margin-right: .1rem;
        border: 1px solid #ddd;
        img{
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .info{
        .name{
          margin-bottom: .1rem;
        }
        .shenfen{
          display: inline-flex;
          align-items: center;
          padding: .02rem .06rem;
          border-radius: .25rem;
          background-color: #0b0808;
          text-align: right;
          line-height: .25rem;
          color: #f5b507;
          img{
            width: .2rem;
            height: .2rem;
            margin-right: .04rem;
          }
          span{
            white-space: nowrap;
            display: inline-block;
          }
        }
        .phone-number{
          i.icon{
            display: inline-block;
            width: .2rem;
            height: .22rem;
            background: url('~@/assets/images/my/edit_icon.png') no-repeat center/cover;
          }
        }
      }
    }
  }
  .cash-account, .loan-account, .more-list{
    background-color: #fff;
    margin-bottom: .1rem;
  }
  .more-list{
    .list-item{
      li{
        border-bottom: 1px solid #f5f5f5;
      }
      li:last-child{
        border: none;
      }
    }
  }
  .content{
    width: 3.51rem;
    margin: 0 auto;
    display: flex;
    padding: .13rem 0;
    justify-content: space-between;
    .con-left{
      display: flex;
      align-items: center;
      .info{
        .msg{
          color: #999;
          margin-top: .05rem;
        }
      }
      i.icon{
        display: inline-block;
        width: .22rem;
        height: .22rem;
        margin-right: .05rem;
        background: url('~@/assets/images/my/ketixian.png') no-repeat center/cover;
      }
      i.icondk{
        background: url('~@/assets/images/my/dk.png') no-repeat center/cover;
      }
      i.iconzd{
        background: url('~@/assets/images/my/zd.png') no-repeat center/cover;
      }
      i.icontj{
        background: url('~@/assets/images/my/tj.png') no-repeat center/cover;
      }
    }
    .con-right{
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      .money{
        color: #f00;
      }
      i.icon{
        display: inline-block;
        width: .1rem;
        height: .16rem;
        background: url('~@/assets/images/my/arrow_icon.png') no-repeat center/cover;
        margin-left: .05rem;
      }
    }
  }
  .icon-list{
    display: flex;
    background-color: #fff;
    margin-bottom: .15rem;
    .content{
      padding: 0;
      .icon-item{
        padding: .1rem;
        img.icon{
          display: block;
          width: .22rem;
          height: .22rem;
          margin: 0 auto .08rem;
        }
      }
    }
  }
  .logo-img{
    img{
      display: block;
      width: .55rem;
      height: .55rem;
      margin: 0 auto .05rem;
    }
    .text{
      text-align: center;
    }
  }
}
</style>
