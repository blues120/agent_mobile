<template>
  <div class="first-step">
    <section class="secondbox">
      <img src="~@/assets/images/applyJoin/header.png" alt="" class="headericon">
      <img :src="preAgentObj.agent.avatorUrl" alt="" class="msicon">
      <span>{{preAgentObj.agent.name}}</span>
      <div class="meginfo">
        <p class="left">代理手机号</p>
        <p class="right">{{preAgentObj.agent.mobile}}</p>
      </div>
      <div class="meginfo">
        <p class="left">代理等级</p>
        <p class="right">{{preAgentObj.gradeAliasName}}</p>
      </div>
      <div class="meginfo">
        <p class="left">代理状态</p>
        <p class="right">{{preAgentObj.agent.reviewStatus==0?'待审核':preAgentObj.agent.reviewStatus==1?'审核通过,准代理':''}}</p>
      </div>
      <button class="nextbtn" @click="goJB(preAgentObj.agent.id)">解除绑定</button>
    </section>
  </div>
</template>

<script>
import { XHeader } from 'vux'
import Qs from 'qs'
export default {
  name: 'firstStep',
  created () {
    if (this.$route.query.preAgentObj) {
      this.preAgentObj = this.$route.query.preAgentObj
    }
  },
  data () {
    return {
      preAgentObj: {} // 我的资料详情
    }
  },
  methods: {
    goJB (id) {
      var that = this
      this.$vux.confirm.show({
        title: '提示',
        content: '你确定要解除绑定吗?',
        onConfirm: () => {
          that.goNextStep(id)
        }
      })
    },
    goNextStep (agentReviewId) {
      var openid = localStorage.getItem('openid')
      var params = {
        agentReviewId: agentReviewId
      }
      params = Qs.stringify(params)
      this.$http.post('quasiAgentUnbindInWechatPage', params).then((res) => {
        if (res.data.code == 200) {
          this.$vux.toast.text('解绑成功', 'middle')
          localStorage.clear()
          localStorage.setItem('openid', openid)
          this.$router.replace({name: 'Bind'})
        }
      }, () => {})
    }
  },
  components: {
    XHeader
  }
}
</script>

<style lang="less" scoped>
  @deep: ~'>>>';
  *{
    box-sizing: border-box;
  }
  .first-step{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: .46rem;
    z-index: 228;
    background-color: #f5f6f7;
    /deep/ .vux-header{
      font-size: 0.18rem;
      color: #333;
      height: .46rem;
      width: 100%;
      z-index: 999;
    }
    .secondbox{
      width: 100%;
      display: flex;
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
        border-radius: .06rem;
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
      .meginfo{
        width: 100%;
        height: .4rem;
        display: flex;
        align-items: center;
        background-color: #fff;
        padding: 0 .13rem;
        justify-content: space-between;
        font-size: .16rem;
        .left{
          width: 30%;
        }
        .right{
          flex: 1;
        }
      }
    }
  }
</style>
