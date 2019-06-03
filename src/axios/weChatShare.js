var wx = require('weixin-js-sdk')
const weChat = {
  // 判断是不是在微信里面
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
  // 初始化条件
  initWeXin () {
    if (!this.isWechat()) {
      return
    }
    // this.$http.weChatParam({href:window.location.href}).then(res => {
    //   if (res.code=='SUCCESS') {
    //     wx.config({
    //       debug: false,
    //       appId: res.data.appId,
    //       timestamp: res.data.timestamp,
    //       nonceStr: res.data.nonceStr,
    //       signature: res.data.signature,
    //       jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone']
    //     })
    //     //   this.shareEvent()  这里需要注掉，在具体的页面中去调用该方法
    //   }
    // }).catch(res => {
    // })
  },
  // 微信分享
  shareEvent (dataParams) {
    wx.ready(function () {
      let img_url = window.location.origin + '/static/bg/promote_banner.png'
      let share_link = window.location.origin + '/#/login?a=0&b=' + window.localStorage.getItem('c');
      const {title, desc, link} = dataParams || {}
      let dataShare = {
        title: title || '哈哈哈哈',
        desc: desc || '我是描述信心',
        link: link || share_link,
        icon: img_url,
        imgUrl: img_url,
        type: 'link',
        dataUrl: '',
        success: function () {
        },
        cancel: function () {
        }
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
}

export default weChat
