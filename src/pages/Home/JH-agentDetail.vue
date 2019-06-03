<template>
  <div class="first-step">
    <section class="secondbox">
      <img src="~@/assets/images/applyJoin/header.png" alt="" class="headericon">
      <img :src="agentDetailObj.url" alt="" class="msicon">
      <span>{{agentDetailObj.name}}</span>
    </section>
    <div class="bigbox">
      <div class="srdetail">
        <div class="item">
          <img src="~@/assets/images/home/detail1.png" alt="">
          <p>
            <span>¥{{agentDetailObj.monthlyPurchaseAmt || 0}}</span>
            <span class="desc">当月进货金额</span>
          </p>
        </div>
        <div class="item">
          <img src="~@/assets/images/home/detail2.png" alt="">
          <p>
            <span>¥{{agentDetailObj.purchaseAmt  || 0}}</span>
            <span class="desc">累计进货金额</span>
          </p>
        </div>
        <div class="item">
          <img src="~@/assets/images/home/detail3.png" alt="">
          <p>
            <span>¥{{agentDetailObj.monthlyPersonPerformance  || 0}}</span>
            <span class="desc">当月个人业绩</span>
          </p>
        </div>
        <div class="item">
          <img src="~@/assets/images/home/detail4.png" alt="">
          <p>
            <span>¥ {{agentDetailObj.personPerformance || 0}}</span>
            <span class="desc">累计个人业绩</span>
          </p>
        </div>
        <div class="item">
          <img src="~@/assets/images/home/detail5.png" alt="">
          <p>
            <span>¥{{agentDetailObj.monthlyShopSalesAmt  || 0}}</span>
            <span class="desc">当月销售额</span>
          </p>
        </div>
        <div class="item">
          <img src="~@/assets/images/home/detail6.png" alt="">
          <p>
            <span>¥{{agentDetailObj.shopSalesAmt  || 0}}</span>
            <span class="desc">累计销售额</span>
          </p>
        </div>
      </div>
    </div>
    <div class="calutetab">
      <div class="tabitem">
        <span class="redcolor">¥ {{agentDetailObj.goodsBalance  || 0}}</span>
        <span>贷款剩余</span>
      </div>
      <div class="tabitem"  @click="gokucunList(0)">
        <span class="redcolor">{{agentDetailObj.inventoryCloudNum}}</span>
        <span>云库存剩余</span>
      </div>
      <div class="tabitem"  @click="gokucunList(1)">
        <span class="redcolor">{{agentDetailObj.inventoryNum}}</span>
        <span>实际库存剩余</span>
      </div>
    </div>
    <div class="msgbox">
      <div class="leadermsg">
        <span>现在等级</span>
        <span>{{agentDetailObj.gradeName}}</span>
      </div>
      <div class="leadermsg">
        <span>邀请时等级</span>
        <span>{{agentDetailObj.joinGradeName}}</span>
      </div>
      <div class="leadermsg">
        <span>进货上级代理</span>
        <span>{{agentDetailObj.PurchaseName}}</span>
      </div>
      <div class="leadermsg">
        <span>下级进货代理人数</span>
        <span>{{agentDetailObj.subPurchaseNum}}</span>
      </div>
      <div class="leadermsg" v-if="agentDetailObj.mobile">
        <span>电话号码</span>
        <p @click="callPhone(agentDetailObj.mobile)">
          <img src="~@/assets/images/gosettlement/telphone.png" alt="">
          <span>{{agentDetailObj.mobile}}</span>
        </p>
      </div>
      <div class="leadermsg" v-if="agentDetailObj.wechat">
        <span>微信号</span>
        <span>{{agentDetailObj.wechat}}</span>
      </div>
      <div class="leadermsg" v-if="agentDetailObj.createDate">
        <span>加入时间</span>
        <span>{{agentDetailObj.createDate}}</span>
      </div>
    </div>
    <page-view></page-view>
  </div>
</template>

<script>
import PageView from '@/components/PageView'
export default {
  created () {
    if (this.$route.query.agentid) {
      this.agentid = this.$route.query.agentid
      this.getDetail(this.agentid)
    }
  },
  data () {
    return {
      agentid: {}, // 查看的具体的代理商的 agentid
      agentDetailObj: {} // 代理商资料详情对象
    }
  },
  components: {
    PageView
  },
  methods: {
    callPhone (tel) {
      window.location.href = 'tel:' + tel
    },
    getDetail (agentId) {
      this.$http.get('agentSubDetails', {
        params: {
          agentId: agentId
        }
      }).then((res) => {
        if (res) {
          this.agentDetailObj = res.data.data
        }
      }, () => {})
    },
    gokucunList (type) {
      if (this.agentid) {
        this.$router.push({name: 'agentKCList', query: {type: type, agentid: this.agentid}})
      }
    }
  }
}
</script>

<style lang="less" scoped>
  *{
    box-sizing: border-box;
  }
  .first-step{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: .46rem;
    overflow-y: scroll;
    z-index: 241;
    background-color: #f5f6f7;
    .secondbox{
      width: 100%;
      display: flex;
      background-color: #fff;
      flex-direction: column;
      align-items: center;
      span{
        margin:.12rem 0 .23rem ;
        font-size: .16rem;
      }
      .headericon{
        width: 100%;
        height:1.25rem ;
      }
      .msicon{
        width: .91rem;
        height:.92rem ;
        margin-top: -.46rem;
      }
      .nextbtn{
        width:3.11rem;
        height:.44rem;
        color: #fff;
        margin-top: .4rem;
        font-size: .16rem;
        background:rgba(0,162,233,1);
        border: none;
        outline: none;
        border-radius:.22rem;
      }
    }
    .msgbox{
      width: 100%;
      padding:0 .12rem ;
      background-color: #fff;
    }
    .leadermsg{
      width: 100%;
      height: .44rem;
      border-bottom: .01rem solid #f5f5f5;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: space-between;
      p{
        height: 100%;
        display: flex;
        align-items: center;
        color: #FF0000;
        img{
          width: .16rem;
          height: .16rem;
          margin-right: .1rem;
        }
      }
    }
    .bigbox{
      width: 100%;
      padding: 0 .12rem;
      background-color: #fff;
      .srdetail{
        width: 100%;
        height: 1.96rem;
        border-top: .01rem solid #f5f5f5;
        display: flex;
        flex-wrap: wrap;
        margin-bottom: .1rem;
        .item{
          width: 50%;
          height: .65rem;
          display: flex;
          align-items: center;
          img{
            width: .22rem;
            height: .22rem;
            margin: 0 .08rem 0 .26rem;
          }
          p{
            flex: 1;
            display: flex;
            flex-direction: column;
            line-height: 1.5;
            font-size: .16rem;
            color: #333;
            .desc{
              font-size:.14rem ;
              color: #666;
            }
          }
        }
      }
    }
    .calutetab{
      width: 100%;
      height:.54rem ;
      background-color: #fff;
      margin-bottom: .1rem;
      display: flex;
      align-items: center;
      .tabitem{
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: .14rem;
        justify-content: center;
        line-height: 1.4;
        border-right: .01rem solid #f5f5f5;
        color: #333;
        .redcolor{
          color: #FF0000;
        }
      }
      .tabitem:last-child{
        border-right: none;
      }
    }
  }
</style>
