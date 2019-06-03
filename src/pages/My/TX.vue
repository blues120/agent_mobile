<template>
  <main class="my">
    <div class="dkheader">
      <div class="dkinfo">
        <span>可提现金额</span>
        <span class="yedetail">{{userTXObj.balanceIncome}}</span>
        <span>满100.00元可提现</span>
      </div>
      <img src="~@/assets/images/my/headbg.png" alt="ICON" class="headimg">
      <div class="txfncbox">
        <p @click="godjs">
          <span class="redcolor">¥{{userTXObj.balanceIncomeAuditing}}</span>
          <span>待结算</span>
        </p>
        <p  @click="gotxing">
          <span class="redcolor">¥{{userTXObj.withdrawLockMoney}}</span>
          <span>提现中</span>
        </p>
        <!--<p>-->
          <!--<span class="redcolor">¥208.00？？？</span>-->
          <!--<span>充值贷款中</span>-->
        <!--</p>-->
      </div>
    </div>
    <section class="more-list">
      <ul class="list-item">
        <li @click="gosrzd">
          <div class="content">
            <div class="con-left">
              <i class="icon czsq"></i>
              <div class="info">收入账单</div>
            </div>
            <div class="con-right">
              <span>全部账单</span>
            </div>
          </div>
        </li>
        <li  @click="gosrzd">
          <div class="content">
            <div class="con-left">
              <i class="icon dksq"></i>
              <div class="info">累计收入明细</div>
            </div>
            <div class="con-right">
              <span class="redcolor">¥{{userTXObj.balanceIncomeIn}}</span>
              <i class="icon"></i>
            </div>
          </div>
        </li>
        <li  @click="gozczd">
          <div class="content">
            <div class="con-left">
              <i class="icon zzsh"></i>
              <div class="info">累计支出明细</div>
            </div>
            <div class="con-right">
              <span class="redcolor">¥{{userTXObj.balanceIncomeOut}}</span>
              <i class="icon"></i>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <p class="subbtn" @click="goTX">申请提现</p>
    <page-view></page-view>
  </main>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  components: {
    PageView
  },
  data () {
    return {
      userTXObj: {} // 用户的可提现账户对象
    }
  },
  created () {
    this.getUerInfo()
  },
  methods: {
    godjs () { // 编辑我的信息
      this.$router.push({name: 'TXDJS'})
    },
    gotxing () { // 我的提现中....
      this.$router.push({name: 'TXING'})
    },
    gosrzd () { // 我的收入账单
      this.$router.push({name: 'TXSRZD'})
    },
    gozczd () { // 我的支出账单
      this.$router.push({name: 'TXSRZD', query: {inde: 1}})
    },
    goTX () { // 申请提现
      this.$router.push({name: 'TXSQ'})
    },
    getUerInfo () {
      var userTXObj = JSON.parse(localStorage.getItem('userTXObj'))
      this.userTXObj = userTXObj
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
  z-index: 113;
  margin: auto;
  background-color: #f5f6f7 ;
  padding-top: .46rem;
  width: 100%;
  font-size: .16rem;
  .dkheader{
    background-color: #fff;
    position: relative;
    .dkinfo{
      width: 100%;
      height: 1.32rem;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      color: #fff;
      font-size:.16rem ;
      .yedetail{
        font-size: .36rem;
        margin: .14rem 0;
      }
    }
    .headimg{
      display: block;
      width: 100%;
      height: 2.23rem;
      margin-bottom: .05rem;
    }
    .txfncbox{
      width: 100%;
      height:.64rem;
      display: flex;
      align-items: center;
      margin-bottom: .1rem;
      p{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: .16rem;
        flex: 1;
        height:.46rem;
        border-right: .01rem solid rgba(245,245,245,1);
        .redcolor{
          margin-bottom: .06rem;
        }
      }
    }
  }
  .redcolor{
    color: #FF0000;
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
        width: .17rem;
        height: .17rem;
        margin-right: .1rem;
      }
      i.czsq{
        background: url('~@/assets/images/my/czsq.png') no-repeat center/cover;
      }
      i.dksq{
        background: url('~@/assets/images/my/dksq.png') no-repeat center/cover;
      }
      i.zzsh{
        background: url('~@/assets/images/gosettlement/payunderline.png') no-repeat center/cover;
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
        margin-left: .1rem;
      }
    }
  }
}
</style>
