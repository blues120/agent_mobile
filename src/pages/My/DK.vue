<template>
  <main class="my">
    <div class="dkheader">
      <div class="dkinfo">
        <span>贷款余额</span>
        <span class="yedetail">9992.00</span>
      </div>
      <img src="~@/assets/images/my/headbg.png" alt="ICON" class="headimg">
      <p>
        <img src="~@/assets/images/gosettlement/payonline.png" alt="ICON" class="icon">
        <span>货款账单</span>
      </p>
    </div>
    <section class="more-list">
      <ul class="list-item">
        <li>
          <div class="content">
            <div class="con-left">
              <i class="icon czsq"></i>
              <div class="info">线下贷款充值申请</div>
            </div>
            <div class="con-right">
              <i class="icon"></i>
            </div>
          </div>
        </li>
        <li>
          <div class="content">
            <div class="con-left">
              <i class="icon dksq"></i>
              <div class="info">收入充值贷款申请</div>
            </div>
            <div class="con-right">
              <i class="icon"></i>
            </div>
          </div>
        </li>
        <li>
          <div class="content">
            <div class="con-left">
              <i class="icon zzsh"></i>
              <div class="info">下级贷款充值审核</div>
            </div>
            <div class="con-right">
              <i class="icon"></i>
            </div>
          </div>
        </li>
      </ul>
    </section>
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
      userInfo: {} // 用户信息对象
    }
  },
  created () {
    this.getUerInfo()
  },
  methods: {
    editMyinfo () { // 编辑我的信息
      this.$router.push({name: 'setMyInfo'})
    },
    getUerInfo () {
      var userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo = userInfo
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
      height: .92rem;
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
        margin-top: .12rem;
      }
    }
    .headimg{
      display: block;
      width: 100%;
      height: 2.23rem;
      margin-bottom: .05rem;
    }
    p{
      width: 100%;
      height: .4rem;
      padding: 0 .13rem;
      display: flex;
      margin-bottom: .12rem;
      align-items: center;
      img{
        width: .17rem;
        height: .17rem ;
        margin-right: .1rem;
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
        margin-left: .05rem;
      }
    }
  }
}
</style>
