<template>
  <div class="s-header">
    <p v-if="shownavBack">
      <img src="~@/assets/images/applyJoin/leftdir.png" alt="" class="icon">
      <span class="right" @click="goBack">返回</span>
    </p>
    <h4 class="center">{{headerTitle}}</h4>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    headerTitle () {
      return this.$store.getters.getHeaderTitle
    },
    shownavBack (state) {
      return this.$store.getters.getshownavBack
    }
  },
  methods: {
    goBack () {
      this.$router ? this.$router.back() : window.history.back()
    }
  }
}
</script>

<style lang="less" scope>
  .s-header{
    position: absolute;
    top: 0;
    z-index: 100;
    height:.52rem;
    font-size: .18rem;
    width:100%;
    margin:0 auto;
    background-color:#fff;
    color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    p{
      position: absolute;
      height: 100%;
      display: flex;
      align-items: center;
      left: .12rem;
      img{
        width: .2rem;
        height: .2rem;
      }
    }
  }
</style>
