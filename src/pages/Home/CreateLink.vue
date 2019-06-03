<template>
  <div class="create-link">
    <div class="create-content">
      <section class="create-header">
        <div class="photo"><img :src="shareObj.avatorUrl" alt=""></div>
        <div class="info">
          <p class="title">{{shareObj.name}}</p>
          <div>
            <span class="level">{{shareObj.gradeAliasName}}</span>
          </div>
        </div>
      </section>
      <section class="show-code">
        <img :src="shareObj.linkUrl" alt="">
        <p class="text">扫一扫上面的二维码，即可申请代理。</p>
        <button class="create-link-btn" @click="toshowzz" style="outline: none">邀请代理</button>
        <p class="tip">在微信中直接分享此页面给意向代理，他点击注册后将成为您的代理商</p>
        <p class="time">该链接将于<span>{{shareObj.expire}}天内有效</span></p>
      </section>
    </div>
    <section class="invitezz" v-show="showZZ" @click="hidezz">
      <span>请点击右上角</span>
      <span>通过【发送给朋友】</span>
      <span>或【分享到朋友圈】</span>
      <img src="~@/assets/images/invitation_agent/toprig-share.png" alt="" class="icon">
    </section>
  </div>
</template>
<script>
const wx = window['wx']
export default {
  name: 'CreateLink',
  created () {
    if (this.$route.query.shareObj) {
      this.shareObj = this.$route.query.shareObj
    }
  },
  data () {
    return {
      showZZ: false // 是否展示遮罩
    }
  },
  methods: {
    toshowzz () {
      this.showZZ = true
    },
    hidezz () {
      this.showZZ = false
    },
    creatXhr () {
      // if (!this.isWechat()) {
      //   return
      // }
      var url = window.location.href.split('#')[0]
      url = encodeURIComponent(url)
      this.$http.get('weChat/share', {
        params: {
          url: url
        }
      }).then((res) => {
        if (res) {
          wx.config({
            debug: false,
            appId: res.data.data.appId,
            timestamp: res.data.data.timestamp,
            nonceStr: res.data.data.nonceStr,
            signature: res.data.data.signature,
            jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
          })
          this.shareEvent() // 这里需要注掉，在具体的页面中去调用该方法
        }
      })
    },
    isWechat () {
      var ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
      } else {
        return false
      }
    },
    equipmentCheck () {
      let u = navigator.userAgent
      let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      let isStr = ''
      if (isAndroid) {
        isStr = 'android'
      }
      if (isiOS) {
        isStr = 'ios'
      }
      return isStr
    },
    // 微信分享
    shareEvent (dataParams) {
      var url = window.location.href.split('#')[0]
      wx.ready(function () {
        var linkId = localStorage.getItem('linkId')
        let img_url = 'http://shms.ijinzao.com/share.jpg'
        let share_link = 'http://shms.ijinzao.com/?linkId=' + linkId
        const {title, desc, link} = dataParams || {}
        let dataShare = {
          title: title || '哈哈哈哈我是测试标题',
          desc: desc || '我是描述信息',
          link: link || share_link,
          icon: img_url,
          imgUrl: img_url,
          type: 'link',
          dataUrl: '',
          success: function () {},
          cancel: function () {}
        }
        // 分享到朋友圈
        wx.onMenuShareTimeline(dataShare)
        // // 分享给微信好友
        wx.onMenuShareAppMessage(dataShare)
        // // 分享到QQ好友
        wx.onMenuShareQQ(dataShare)
        // // 分享到微博
        wx.onMenuShareWeibo(dataShare)
        // // 分享到QQ空间
        wx.onMenuShareQZone(dataShare)
      })
    }
  },
  mounted () {
    this.creatXhr()
  }
}
</script>
<style lang="less" scoped>
.create-link{
  position: fixed;
  padding-top: .45rem;
  top: 0;
  left: 0;
  right: 0;
  z-index: 201;
  background-color: #f5f6f7;
  height: 100vh;
  .create-content{
    background-color: #fff;
    padding: .1rem 0;
    .create-header{
      display: flex;
      margin-bottom: .15rem;
      border-bottom: 2px solid #f5f5f5;
      padding: 0 .12rem .1rem;
      .photo{
        width: .62rem;
        height: .62rem;
        border: .03rem solid #ccc;
      }
      .info{
        padding: 0 .1rem;
        .title{
          margin-bottom: .1rem;
        }
        .level{
          display: inline-block;
          padding: .05rem;
          background-color: #ff0000;
          color: #fffefe;
          border-radius: .12rem;
        }
      }
    }
    .show-code{
      img{
        display: block;
        width: 1.22rem;
        height: 1.22rem;
        margin: 0 auto .15rem;
      }
      .text, .tip, .time{
        text-align: center;
        border-bottom: 2px solid #f5f5f5;
        padding-bottom: .15rem;
      }
      .create-link-btn{
        display: block;
        border: none;
        line-height: .44rem;
        padding: 0 1rem;
        background-color: #00a2e9;
        margin: .15rem auto;
        border-radius: .22rem;
        color: #fff;
        font-size: .14rem;
      }
      .tip{
        border: none;
        line-height: .22rem;
      }
      .time{
        border: none;
        color: #999;
        span{
          color: #f00;
        }
      }
    }
  }
  .invitezz{
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    z-index: 992;
    background-color: rgba(0,0,0,.7);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: .18rem;
    padding-top: 1.1rem;
    span{
      margin: .06rem 0 .06rem .4rem ;
      display: inline-block;
      letter-spacing: .02rem;
    }
    img{
      position: absolute;
      width: .9rem;
      height: .9rem;
      top: .2rem;
      right: .2rem;
    }
  }
}
</style>
