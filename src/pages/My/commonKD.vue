<template>
  <div class="common-kd">
    <div class="tips">请确定你最常用的发货快递，选择后将出现在发货列表中</div>
    <scroller lock-x height="-40px" class="scrolbox" ref="scrollerBottom"  @on-scroll="onScroll" @on-scroll-bottom="loadmore" >
      <div class="kdbox">
        <group  v-for="(item,inde) in kdList" class="eachgrop" :key="inde">
          <x-switch :title="item.expressName" @on-change="changekd(item,$event)" :value="item.status==1?true:false"></x-switch>
        </group>
      </div>
    </scroller>
  </div>
</template>

<script>
import Qs from 'qs'
import {XSwitch, Group, Scroller} from 'vux'
export default {
  data () {
    return {
      page: 1, // 第几页数据
      xhrflag: false, // 阻止多次请求的flag
      hasNextPage: false,
      totalPage: 0,
      kdList: []
    }
  },
  mounted () {
    this.getKDList()
  },
  methods: {
    onScroll (pos) {
      // console.log('pos.top', pos.top)
    },
    loadmore () {
      if (this.xhrflag) {
        return
      }
      this.xhrflag = true
      if (this.hasNextPage && this.page < this.totalPage) {
        this.page++
        this.getKDList()
      }
    },
    changekd (e, value) {
      this.changeSwitch(e.id, value)
    },
    changeSwitch (expressId, status) {
      var param = {
        expressId: expressId,
        status: status ? '1' : '0'
      }
      param = Qs.stringify(param)
      this.$http.post('express/using', param).then((res) => {})
    },
    getKDList () {
      this.$http.get('express/list', {
        params: {
          page: this.page,
          limit: 20
        }
      }).then((res) => {
        this.kdList = this.kdList.concat(res.data.data.list)
        this.totalPage = res.data.data.totalPage
        if (res.data.data.currPage < res.data.data.totalPage) {
          this.hasNextPage = true
        } else {
          this.hasNextPage = false
        }
        this.xhrflag = false
      }, () => {})
    }
  },
  components: {
    XSwitch,
    Group,
    Scroller
  }
}
</script>

<style lang="less" scoped>
  .common-kd{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 119;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);
    .tips{
      font-size: .12rem;
      position: fixed;
      top: .46rem;
      left:0;
      z-index: 120;
      color: #FF0000;
      width: 100%;
      height:.42rem ;
      text-align: center;
      line-height: .42rem;
      background-color: #fff;
      margin: .05rem auto;
    }
    .scrolbox{
     /*position: fixed;*/
      margin-top: .49rem;
      left: 0;
      padding-bottom:1rem;
      background-color: #fff;
      width: 100%;
    }
    .kdbox{
      background-color: #fff;
    }
    .eachgrop{
      margin: .03rem auto;
    }
    /deep/.vux-no-group-title{
      margin: 0;
    }
    /deep/.weui-cells:before{
      display: none;
    }
    /deep/.weui-cells:after{
      display: none;
    }
  }
</style>
