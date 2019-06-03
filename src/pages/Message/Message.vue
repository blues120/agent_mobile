<template>
  <main class="message">
    <section class="circle">
      <div class="content">
        <div class="con-left">
          <i class="icon"></i>
          <p class="title">代理圈</p>
        </div>
        <div class="con-right">
          <img src="~@/assets/images/message/iconquanzisel.png" alt="new" class="new">
          <i class="icon"></i>
        </div>
      </div>
    </section>
    <section class="func">
      <ul>
        <li>
          <img src="~@/assets/images/message/xitong.png" alt="ICON" class="icon">
          <p class="text">系统消息</p>
        </li>
        <li>
          <img src="~@/assets/images/message/zixun.png" alt="ICON" class="icon">
          <p class="text">公告资讯</p>
        </li>
        <li>
          <img src="~@/assets/images/message/sucai.png" alt="ICON" class="icon">
          <p class="text">素材库</p>
        </li>
      </ul>
    </section>
  </main>
</template>

<script>
export default {
  name: 'Message'
}
</script>

<style lang="less" scoped>
.message{
  /deep/ .vux-header{
    font-size: 0.18rem;
    color: #333;
    height: .46rem;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
  }
  padding-top: .56rem;
  .circle, .func{
    background-color: #fff;
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
      i.icon{
        display: inline-block;
        width: .22rem;
        height: .22rem;
        margin-right: .05rem;
        background: url('~@/assets/images/message/iconquanzisel.png') no-repeat center/cover;
      }
    }
    .con-right{
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      img.new{
        width: .22rem;
        height: .22rem;
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
  .func{
    margin-top: .1rem;
    ul{
      display: flex;
      li{
        flex: 1;
        padding: .15rem .2rem;
        border-right: 1px solid #f5f5f5;
        img.icon{
          display: block;
          width: .275rem;
          height: .275rem;
          margin: 0 auto .09rem;
        }
        .text{
          text-align: center;
        }
      }
      li:last-child{
        border: none;
      }
    }
  }
}
</style>
