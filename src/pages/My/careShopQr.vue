<template>
  <div class="info-detail">
    <p class="top">
      <img src="~@/assets/images/applyJoin/msicon.png" alt="ICON" class="icon">
      <span>上海美瘦生物科技有限公司</span>
    </p>
    <div class="qrbox">
      <img src="~@/assets/images/my/zongbu.png" alt="ICON" class="shopqr">
      <p>长按二维码关注微信公众号</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'usermobile',
  data () {
    return {
      shopObj: {
        pic: '',
        name: '',
        qr: ''
      }
    }
  },
  created () {

  }
}
</script>

<style lang="less" scoped>
  .info-detail{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 109;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    .top{
      width: 100%;
      height: .84rem;
      display: flex;
      align-items: center;
      padding: 0  .19rem;
      img{
        width: .6rem;
        height: .6rem;
        border-radius: .6rem;
        margin-right: .1rem;
      }
    }
    .qrbox{
      width: 100%;
      height: 4.3rem;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: .18rem;
      color: #00A2E9;
      .shopqr{
        width: 3.5rem;
        height: 3.5rem;
        margin-bottom: .3rem;
      }
    }
  }
</style>
