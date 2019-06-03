<template>
  <div class="info-detail">
    <div class="infoItem" style="height: 60px" @click="changetx">
      <span>更改头像</span>
      <p>
        <img :src="TxPicLocal" class="usericon">
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <div class="infoItem" @click="goInfoDetail">
      <span>完善个人信息</span>
      <p>
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <div class="infoItem" style="margin-top: 10px" @click="wannerGoChangePass">
      <span>修改密码</span>
      <p>
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <div class="infoItem" @click="gocommonkd">
      <span>常用发货快递</span>
      <p>
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <div class="infoItem" @click="goaddlist">
      <span>收货地址</span>
      <p>
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <!--<div class="infoItem">-->
      <!--<span>清除缓存</span>-->
      <!--<p>-->
        <!--<span class="greycolo">521131.00 KB</span>-->
        <!--<img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">-->
      <!--</p>-->
    <!--</div>-->
    <div class="infoItem" @click="gocare">
      <span>关注商家公众号</span>
      <p>
        <img src="~@/assets/images/gosettlement/ri-dir.png" class="moreicon">
      </p>
    </div>
    <x-button class="jcbd"  @click.native="gojcbd">解除绑定</x-button>
    <div v-transfer-dom>
      <x-dialog v-model="changeTX" class="dialog-changetx">
        <div class="changetxtop" style="height: 50px;line-height: 50px;border-bottom: 1px solid #F5F5F5">修改头像</div>
        <div  v-if="TxPic"  class="uploadbox" style="width: 100px;height: 100px;margin: 25px auto;position: relative">
          <img :src="TxPic" class="usericon" style="width: 100%;height: 100%;">
          <img @click="removetx" src="~@/assets/images/gosettlement/closebtn.png" class="deleticon" style="width: 30px;height: 30px;position: absolute;top:-15px;right: -15px">
        </div>
        <div  v-else class="uploadbox" style="width: 100px;height: 100px;margin: 25px auto;position: relative">
            <div class="cssplusbox" style="width: 100px;height: 100px;display:flex;z-index:10;align-items: center;justify-content: center;border: 1px dotted #00a2e9">
              <img src="~@/assets/images/gosettlement/addbtn.png" alt="" class="addressicon" style="width: 40px;height: 40px;">
            </div>
            <input  style="width: 100px;height: 100px;position: absolute;top: 0;left: 0;z-index: 12;opacity: 0" type="file" class="uploadfileold" name="file" accept="image/*" id="file" @change="uploadNow">
        </div>
        <div class="czbtnbox">
          <span style="padding: 10px 30px;background-color:#9c9fa6;color: #fff;display: inline-block;margin: 0px 10px 20px;border-radius: 20px" @click="changeTX=false">取消</span>
          <span style="padding: 10px 30px;background-color:#00a2e9;color: #fff;display: inline-block;margin: 0px 10px 20px;border-radius: 20px" @click="goChangTX">确定</span>
        </div>
      </x-dialog>
    </div>
    <page-view></page-view>
  </div>
</template>

<script>
import {XButton, XDialog, TransferDom} from 'vux'
import Qs from 'qs'
import PageView from '@/components/PageView'
export default {
  name: 'infoDetail',
  data () {
    return {
      changeTX: false, // 是否更改头像
      tempArry: [], // 临时存放file的数组
      formDataArray: new FormData(), // 上传的凭证图片数组 formdata
      TxPicLocal: '',
      TxPic: 'https://ws1.sinaimg.cn/large/663d3650gy1fq6824ur1dj20ia0pydlm.jpg'
    }
  },
  created () {
    var userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo.avatorUrl) {
      this.TxPicLocal = userInfo.avatorUrl
      this.TxPic = userInfo.avatorUrl
    }
  },
  methods: {
    goChangTX () {
      console.log('this.tempArry', this.tempArry)
      if (this.tempArry.length === 0) {
        this.$vux.toast.text('上传头像不能为空~', 'middle')
        return
      }
      for (var i in this.tempArry) {
        this.formDataArray.append('avatars', this.tempArry[i])
      }
      this.$http.post('avatar', this.formDataArray, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.TxPicLocal = this.TxPic
          this.$vux.toast.text('头像修改成功~', 'middle')
          this.changeTX = false
        }
      }, () => {})
    },
    changetx () {
      this.changeTX = true
    },
    /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小
        objDiv：一个是容器或者回调函数
        photoCompress()
   */
    photoCompress (file, w, objDiv) {
      var that = this
      var ready = new FileReader()
      // 开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.
      ready.readAsDataURL(file)
      ready.onload = function () {
        var re = this.result
        that.canvasDataURL(re, w, objDiv)
      }
    },
    canvasDataURL (path, obj, callback) {
      var img = new Image()
      img.src = path
      img.onload = function () {
        var that = this
        // 默认按比例压缩
        var w = that.width
        var h = that.height
        var scale = w / h
        w = obj.width || w
        h = obj.height || (w / scale)
        var quality = 0.7 // 默认图片质量为0.7
        // 生成canvas
        var canvas = document.createElement('canvas')
        var ctx = canvas.getContext('2d')
        // 创建属性节点
        var anw = document.createAttribute('width')
        anw.nodeValue = w
        var anh = document.createAttribute('height')
        anh.nodeValue = h
        canvas.setAttributeNode(anw)
        canvas.setAttributeNode(anh)
        ctx.drawImage(that, 0, 0, w, h)
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality)
        // 回调函数返回base64的值
        callback(base64)
      }
    },
    /**
     * 将以base64的图片url数据转换为Blob
     * @param urlData
     *            用url方式表示的base64图片数据
     */
    convertBase64UrlToBlob (urlData) {
      var arr = urlData.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], {type: mime})
    },
    uploadNow (e) {
      var that = this
      var fileObj = e.target.files[0]
      console.log('fileObj.size / 1024', fileObj.size / 1024)
      if (fileObj.size / 1024 >= 1024) {
        this.photoCompress(fileObj, {
          quality: 0.8
        }, function (base64Codes) {
          console.log('压缩后base64Codes', base64Codes)
          var bl = that.convertBase64UrlToBlob(base64Codes)
          console.log('bl', bl)
          // form.append("file", bl, "file_"+Date.parse(new Date()) + '.jpg') // 文件对象
        })
      }
      this.tempArry.push(fileObj)
      // var reader = new FileReader()
      // if (fileObj) {
      //   reader.readAsDataURL(fileObj)
      //   reader.onload = function (e) {
      //     that.TxPic = reader.result
      //   }
      // } else {
      //   console.log('read fail')
      // }
      console.log('thi.files', this.tempArry)
    },
    removetx () {
      this.TxPic = ''
      this.tempArry = []
    },
    gojcbd () {
      var openid = localStorage.getItem('openid')
      var params = {
        openId: openid
      }
      params = Qs.stringify(params)
      this.$http.post('weChatUnbind', params).then((res) => {
        if (res.data.code === 200) {
          this.$vux.toast.text('解绑成功', 'middle')
          localStorage.clear()
          localStorage.setItem('openid', openid)
          this.$router.replace({name: 'Bind'})
        }
      }, () => {})
    },
    goInfoDetail () {
      this.$router.push({name: 'MyInfoDetail'})
    },
    wannerGoChangePass () {
      this.$router.push({name: 'rememberpass'})
    },
    goaddlist () {
      this.$router.push({name: 'addressList'})
    },
    gocommonkd () {
      this.$router.push({name: 'commonKD'})
    },
    gocare () {
      this.$router.push({name: 'careShopQr'})
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XButton,
    XDialog,
    PageView
  }
}
</script>

<style lang="less" scoped>
  .info-detail{
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 103;
    margin: auto;
    background-color: #f5f6f7 ;
    padding-top: .46rem;
    width: 100%;
    font-size: .14rem;
    color: rgba(51,51,51,1);;
    .infoItem{
      width: 100%;
      height:.45rem ;
      padding:0 .12rem;
      justify-content: space-between;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-top: .01rem solid rgba(245,245,245,1);
      p{
        display: flex;
        align-items: center;
        .moreicon{
          width: .1rem;
          height: .17rem;
          margin-left:.09rem ;
        }
        .usericon{
          width: .33rem;
          height: .33rem;
          border-radius: 100%;
        }
        .greycolo{
          color:rgba(153,153,153,1);
        }
      }
    }
    .jcbd{
      margin-top: .2rem;
      width:3.11rem;
      font-size: .16rem;
      height:.44rem;
      color: #fff;
      background:rgba(0,162,233,1);
      border-radius:.22rem;
    }
    .jcbd:active{
      background:rgba(0,162,233,1);
      color: #fff;
    }
  }
</style>
