<template>
  <footer class="footer">
    <ul class="tab-bar">
      <li :class="{'active' : tabIndex === 0}">
        <div class="content" @click="ToAgent">
          <img v-if="tabIndex === 0" src="~@/assets/images/daili_on.png" alt="daili" class="icon">
          <img v-else src="~@/assets/images/daili.png" alt="daili" class="icon">
          <p class="text">代理</p>
        </div>
      </li>
      <!-- <li :class="{'active' : tabIndex === 1}">
        <div class="content" @click="ToRetail">
          <img v-if="tabIndex === 1" src="~@/assets/images/lingshou_on.png" alt="daili" class="icon">
          <img v-else src="~@/assets/images/lingshou.png" alt="daili" class="icon">
          <p class="text">零售</p>
        </div>
      </li> -->
      <li :class="{'active' : tabIndex === 2}">
        <div class="content" @click="ToMessage">
          <img v-if="tabIndex === 2" src="~@/assets/images/xiaoxi_on.png" alt="daili" class="icon">
          <img v-else src="~@/assets/images/xiaoxi.png" alt="daili" class="icon">
          <p class="text">消息</p>
        </div>
      </li>
      <li :class="{'active' : tabIndex === 3}">
        <div class="content" @click="ToMy">
          <img v-if="tabIndex === 3" src="~@/assets/images/wode_on.png" alt="daili" class="icon">
          <img v-else src="~@/assets/images/wode.png" alt="daili" class="icon">
          <p class="text">我的</p>
        </div>
      </li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'TabBar',
  data () {
    return {
      tabIndex: 0
    }
  },
  created () {
    var name = this.$route.name
    if (name === 'Home') {
      this.tabIndex = 0
    } else if (name === 'Message') {
      this.tabIndex = 2
    } else if (name === 'My') {
      this.tabIndex = 3
    }
  },
  methods: {
    ToAgent () {
      this.tabIndex = 0
      this.$router.push({
        path: '/home'
      })
    },
    ToRetail () {
      this.tabIndex = 1
      this.$router.push({
        path: '/retail'
      })
    },
    ToMessage () {
      this.tabIndex = 2
      this.$router.push({
        path: '/message'
      })
    },
    ToMy () {
      this.tabIndex = 3
      this.$router.push({
        path: '/my'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.footer{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: .49rem;
  background-color: #fff;
  z-index: 999;
  .tab-bar{
    display: flex;
    align-items: center;
    height: 100%;
    li{
      flex: 1;
      .content{
        width: .4rem;
        margin: 0 auto;
        img.icon{
          display: block;
          width: .22rem;
          height: .22rem;
          margin: 0 auto .05rem;
        }
        .text{
          text-align: center;
          font-size: .12rem;
        }
      }
    }
    li.active{
      .text{
        color: #00a2e9;
      }
    }
  }
}
</style>
