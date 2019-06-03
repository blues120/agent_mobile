<template>
  <div class="bigbox">
    <div class="invitation-agent">
      <section class="product">
        <p class="tip">邀请代理想代理的产品 <span v-if="goInvite">（单选）</span>：</p>
        <ul>
          <li :class="{'active': Chooseproductid === product.id}" v-for="product in productGroup" :key="product.id" @click.prevent="goInvite?chooseProduct(product.id):''">
            <label>
              <input type="radio" v-model="Chooseproductid" :value="product.id" name="product">
              <p class="title">{{product.name}}</p>
              <p class="subtitle">{{product.description}}</p>
              <i class="icon"></i>
            </label>
          </li>
        </ul>
      </section>
      <section class="level">
        <p class="tip">你想发展代理的级别 <span v-if="goInvite">（可单或多选）</span>：</p>
        <ul>
          <li :class="{'active':goInvite?(level.indexOf(grade.id) != -1):(level === grade.id)}" v-for="grade in gradeList" :key="grade.id">
            <label>
              <input v-model="level" :type="goInvite?'checkbox':'radio'" :value="grade.id">
              <p class="title">{{grade.gradeAliasName}} <span class="level" v-if="goInvite">跨级推荐</span></p>
              <p class="subtitle">首次进货金额至少达到：￥{{grade.firstJoinAmount}}元</p>
              <i class="icon"></i>
            </label>
          </li>
        </ul>
      </section>
      <div class="create-link" @click="ToCreateLink" v-if="goInvite">生成邀请链接</div>
      <div class="create-link" @click="goNextStep" v-else>下一步</div>
    </div>
    <page-view></page-view>
  </div>
</template>

<script>
import Qs from 'qs'
import PageView from '@/components/PageView'
export default {
  name: 'InvitationAgent',
  data () {
    return {
      Chooseproductid: '', // 选择邀请代理的产品id
      productGroup: [], // 接口返回的可选择的产品组合
      level: '', // 想要发展的代理级别
      gradeList: [], // 我想发展的代理数组
      inviteId: '', // 邀请人的 agentId
      linkId: '',
      goInvite: false, // 是否是邀请别人默认false为申请加入
      applyerTel: '' // 申请者手机号码
    }
  },
  created () {
    this.goInvite = this.$route.query.goInvite
    this.applyerTel = this.$route.query.applyerTel
    if (this.$route.query.inviteId) {
      this.inviteId = this.$route.query.inviteId
    }
    if (this.goInvite) {
      this.level = []
    } else {
      this.level = ''
    }
    if (this.$route.query.linkId) {
      this.geDLList(this.$route.query.linkId)
    } else {
      this.geAllProduct(true) // 如果是邀请别人的话，先获取所有的产品组合
    }
  },
  methods: {
    chooseProduct (id) {
      if (this.Chooseproductid !== id) {
        this.Chooseproductid = id
        this.level = []
        // this.level = [] // 重新选择产品组合后清空已经选择的代理级别
        this.geDLProductRequest()
      }
    },
    ToCreateLink () {
      this.createInviteLink()
    },
    goNextStep () {
      if (!this.goInvite) { // 如果是申请加入，下一步是去填写资料
        if (!this.level) {
          this.$vux.toast.text('请选择代理级别~', 'middle')
          return
        }
        this.$router.push({name: 'secondStep',
          query: {
            applyerTel: this.applyerTel,
            inviteId: this.inviteId,
            gradeId: this.level,
            productGroupId: this.Chooseproductid
          }
        })
      }
    },
    geDLList (linkId) {
      this.$http.get('queryCanApplyGradeAndProductList', {
        params: {
          'linkId': linkId || '1'
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.productGroup = [].concat(res.data.data.productGroup)
          this.gradeList = res.data.data.gradeList
        }
      })
    },
    geAllProduct (flag) {
      this.$http.get('product/getAllProductGroup').then((res) => {
        if (res.data.code === 200) {
          this.productGroup = res.data.data
          if (res.data.data.length > 0) {
            this.Chooseproductid = res.data.data[0].id
            if (flag) {
              this.geDLProductRequest() // 根据选择的希望代理的产品组合请求对应的代理级别（不同产品组合代理价格也不一样）
            }
          }
        }
      })
    },
    geDLProductRequest () {
      this.$http.get('getAgentGradeCondition',
        {
          params: {
            productGroupId: this.Chooseproductid
          }
        }
      ).then((res) => {
        if (res.data.code === 200) {
          this.gradeList = res.data.data.gradeList
        }
      })
    },
    createInviteLink () {
      if (this.level.length === 0) {
        this.$vux.toast.text('请选择代理等级', 'middle')
        return
      }
      var objpara = {
        productGroupId: this.Chooseproductid,
        grades: this.level.join(',')
      }
      objpara = Qs.stringify(objpara)
      this.$http.post('generatorInviteQrcode', objpara).then((res) => {
        if (res.data.code === 200) {
          localStorage.setItem('linkId', res.data.data.linkId)
          this.$router.push({
            name: 'CreateLink', query: {shareObj: res.data.data}
          })
        }
      })
    }
  },
  components: {
    PageView
  }
}
</script>

<style lang="less" scoped>
.bigbox{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 148;
  background-color: #f5f6f7;
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
  .invitation-agent{
    padding: .46rem .12rem .85rem;
    .tip{
      padding: .1rem 0;
    }
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: scroll;
    ul{
      li{
        border-radius: .05rem;
        margin-bottom: .1rem;
        color: #333;
        background-color: #fff;
        label{
          padding: .12rem .2rem;
          display: block;
          position: relative;
          .title{
            margin-bottom: .05rem;
            span.level{
              display: inline-block;
              padding: .06rem .12rem;
              background-color: #000;
              color: #cbc046;
              border-radius: .12rem;
              font-size: .13rem;
              margin-left: .1rem;
            }
          }
          .subtitle{
            max-width: 2.66rem;
            font-size: .12rem;
            line-height: .15rem;
            word-break:break-all;
            color: #666;
          }
          i.icon{
            display: block;
            width: .22rem;
            height: .16rem;
            position: absolute;
            top: 50%;
            right: .2rem;
            transform: translateY(-50%);
            background: url('~@/assets/images/invitation_agent/arrow.png') no-repeat center/cover;
          }
          input[type="radio"], input[type="checkbox"]{
            display: none;
            opacity: 0;
          }
        }
      }
      li.active{
        color: #fff;
        background: linear-gradient(left, #f59074, #fb735d);
        .subtitle{
          color: #fff;
        }
      }
      li:last-child{
        margin: 0;
      }
    }
    .product{
      margin-bottom: .2rem;
    }
    .create-link{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #00a2e9;
      line-height: .5rem;
      text-align: center;
      color: #fff;
      font-size: .16rem;
    }
  }
}
</style>
