<template>
  <div class="scroll-nav">
    <div class="cube-content">
      <cube-scroll-nav
        :side="true"
        :data="data"
        :current="current"
        @change="changeHandler"
        @sticky-change="stickyChangeHandler">
        <ul class="prepend-header" slot="prepend">
          <li>11</li>
          <li>22</li>
          <li>333</li>
        </ul>
        <cube-scroll-nav-panel
          v-for="item in data"
          :key="item.name"
          :label="item.name"
          :title="item.name">
          <ul>
            <li v-for="(food, index) in item.foods" :key="index">
              <div>
                <img :src="food.icon">
                <p>{{food.name}}</p>
              </div>
            </li>
          </ul>
        </cube-scroll-nav-panel>
      </cube-scroll-nav>
    </div>
  </div>
</template>

<script>
import goodsData from './goods-list.json'
const goods = goodsData.goods
export default {
  name: 'Retail',
  data () {
    return {
      data: goods,
      current: goods[1].name
    }
  },
  methods: {
    changeHandler (label) {
      console.log(label)
    },
    stickyChangeHandler (current) {
      console.log(current)
    }
  }
}
</script>

<style lang="less" scoped>
.retail{
  .cube-content{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0.49rem;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
}
</style>
