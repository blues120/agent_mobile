<template>
  <div class="first-step">
    <section class="secondbox">
      <img src="~@/assets/images/applyJoin/header.png" alt="" class="headericon">
      <img :src="obj.avatorUrl" alt="" class="msicon">
      <span>{{obj.name}}</span>
    </section>
    <div class="msgbox">
      <div class="leadermsg"  v-if="obj.gradeAliasName">
        <span>代理等级</span>
        <span>{{obj.gradeAliasName}}</span>
      </div>
      <div class="leadermsg" v-if="obj.mobile">
        <span>电话号码</span>
        <p @click="callPhone(obj.mobile)">
          <img src="~@/assets/images/gosettlement/telphone.png" alt="">
          <span>{{obj.mobile}}</span>
        </p>
      </div>
      <div class="leadermsg" v-if="obj.wechat">
        <span>微信号</span>
        <span>{{obj.wechat}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    if (this.$route.query.obj) {
      this.obj = this.$route.query.obj
      // console.log('this.obj', this.obj)
    }
  },
  data () {
    return {
      obj: {} // 页面内的数据信息对象
    }
  },
  methods: {
    callPhone (tel) {
      window.location.href = 'tel:' + tel
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
    z-index: 241;
    background-color: #f5f6f7;
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
  }
</style>
