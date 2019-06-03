<template>
  <div class="first-step">
    <section class="secondbox">
      <img src="~@/assets/images/applyJoin/header.png" alt="" class="headericon">
      <img src="~@/assets/images/applyJoin/msicon.png" alt="" class="msicon">
      <span>美瘦酵素</span>
      <ul>
        <li class="input-group">
          <div class="icon-wrap">
            <i class="iconfont iconshouji"></i>
          </div>
          <cube-input type="tel" v-model.trim="phoneNumber" :maxlength='11' placeholder="请填写您的手机号码" :clearable="clearable"></cube-input>
        </li>
      </ul>
      <button class="nextbtn" @click="goNextStep" :disabled="isdisabled">下一步</button>
    </section>
    <section class="confirmView" :class="showConfirm? 'zzshow':''">
      <div class="confirmbox" :class="showConfirm? 'confirmboxactnow':'confirmboxhidetnow'">
        <p class="tit">提示</p>
        <div class="confibody">
          <span>确认您的邀请人是</span>
          <span class="redcolor">{{shareName}}</span>
          <span style="font-size: 16px">( VIP )</span>
          <span>如果不是，请从其他邀请人处申请</span>
          <p>
            <span @click="hideZZ">取消</span>
            <span @click="suregoNext" class="rigbtn">确认</span>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { XHeader } from 'vux'
export default {
  name: 'firstStep',
  created () {
    if (this.$route.query.linkId) {
      this.linkId = this.$route.query.linkId
    }
  },
  data () {
    return {
      phoneNumber: '',
      linkId: '', // 点击链接的分析linkid
      isdisabled: false,
      shareName: '', // 分享者的名字
      inviteId: '', // 邀请人的 agentId
      shareLevel: '', // 分享者的level
      clearable: {
        visible: true,
        blurHidden: false
      },
      showConfirm: false // 是否展示自定义动画的提示框（带遮罩层）默认false
    }
  },
  methods: {
    goNextStep () {
      this.checkPhoneNumIsExistInAgent()
    },
    hideZZ () {
      this.showConfirm = false
    },
    suregoNext () {
      this.showConfirm = false
      this.$router.push({name: 'InvitationAgent',
        query: {
          linkId: this.linkId,
          goInvite: false, // 不是邀请是申请加入,
          inviteId: this.inviteId, // 邀请人的 agentId
          applyerTel: this.phoneNumber // 申请者的手机号码
        }
      })
    },
    checkPhoneNumIsExistInAgent () {
      if (!this.phoneNumber) {
        this.$vux.toast.text('请填写您的手机号码!', 'middle')
        return
      }
      var that = this
      this.isdisabled = true
      this.$http.get('checkPhoneExist', {
        params: {
          'mobile': this.phoneNumber,
          'linkId': this.linkId
        }
      }).then((res) => {
        setTimeout(() => {
          that.isdisabled = false
        }, 200)
        if (res.data.code == 200) {
          this.shareName = res.data.data.name
          this.inviteId = res.data.data.agentId
          this.shareLevel = res.data.data.gradeAliasName
          this.showConfirm = true
        }
      }, () => {
        console.log('请求失败处理')
      })
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
    z-index: 108;
    background-color: #f5f6f7;
    ul{
      width: 100%;
      .input-group{
        background-color: #fff;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        .icon-wrap{
          width: .6rem;
          padding-left: .1rem;
          .iconfont{
            font-size: .18rem;
            color: #9e9e9e;
          }
        }
        @{deep} .cube-input{
          width: 70%;
        }
        @{deep} .cube-input::after{
          display: none;
        }
      }
      .input-group:first-child{
        border-bottom: 1px solid #edeef0;
      }
    }
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
    .confirmView{
      width: 100%;
      height: 100%;
      position: fixed;
      opacity: 0;
      z-index: -1;
      transition:all .8s;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      background:rgba(0,0,0,.3);
      display: flex;
      align-items: center;
      justify-content: center;
      .confirmbox{
        z-index: 11;
        width:2.90rem;
        height:2.20rem;
        background:rgba(255,255,255,1);
        border-radius:.05rem;
        .tit{
          width: 100%;
          height: .35rem;
          line-height: .35rem;
          font-size: .16rem;
          text-align: center;
          border-bottom: .01rem solid rgba(0,0,0,.1);
        }
        .confibody{
          width: 100%;
          height:1.85rem ;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: .15rem 0 .16rem;
          justify-content: space-between;
          font-size: .14rem;
          .redcolor{
            font-size: .18rem;
            color:#FF0000
          }
          p{
            width: 100%;
            height: .34rem;
            display: flex;
            padding: 0 .2rem;
            justify-content: space-between;
            span{
              width: 1rem;
              height: .34rem;
              text-align: center;
              line-height: .34rem;
              font-size:.16rem ;
              color:rgba(153,153,153,1);
              background:rgba(204,204,204,1);
              border-radius: .17rem;
            }
            .rigbtn{
              background:rgba(0,162,233,1);
              color: #fff;
            }
          }
        }
      }
      .confirmboxactnow{
        animation: beBigSmall .4s;
      }
      .confirmboxhidetnow{
        animation: brHideZZ .8s;
      }
      @keyframes brHideZZ{
        0%{
          transform: scale(1);
        }
        100%{
          transform: scale(0);
        }
      }
      @keyframes beBigSmall{
        0%{
          transform: scale(0);
        }
        75%{
          transform: scale(1.15);
        }
        100%{
          transform: scale(1);
        }
      }
    }
    .zzshow{
      opacity: 1;
      z-index: 20;
    }
  }
</style>
