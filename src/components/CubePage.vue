<template>
  <div class="cube-page">
    <div class="wrapper">
      <main class="content">
        <slot name="content">{{content}}</slot>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less" scoped>
.cube-page{
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f6f7;
  .wrapper{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
