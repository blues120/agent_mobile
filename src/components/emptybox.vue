<template>
  <div class="emptybox">
    <img src="~@/assets/images/gosettlement/emptyInstead.png" alt="" class="icon">
    <span>暂无内容可供显示</span>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scope>
  .emptybox{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      width: 2rem;
      height: 1.5rem;
      margin: 1.2rem auto .4rem;
    }
  }
</style>
