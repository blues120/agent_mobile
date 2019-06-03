<template>
  <div class="info-detail">
    <div class="uploadIDPicbox" v-for="(pic,inde) in  picArry" :key="inde">
      <img :src="pic.pic" class="idicon"  v-if="pic.pic">
      <img src="~@/assets/images/my/idpic0.png" class="idicon" v-if="(!pic.pic) && inde==0">
      <img src="~@/assets/images/my/idpic1.png" class="idicon" v-if="(!pic.pic) && inde==1">
      <p @click="goUpload(inde)">
        重新上传
        <input  style="width: 100%;height: 100%;position: absolute;top: 0;left: 0;z-index: 12;opacity: 0" type="file" class="uploadfileold" name="file" accept="image/*" id="file" @change="uploadNow">
      </p>
    </div>
  </div>
</template>

<script>
import {XButton, TransferDom} from 'vux'
export default {
  name: 'infoDetail',
  data () {
    return {
      tempArry: [], // 临时存放file的数组
      reUploadinde: 0, // 当前重新上传的是哪一张图片， 0 是身份证正面 1是身份证反面
      formDataArray: new FormData(), // 上传的凭证图片数组 formdata
      picArry: [
        {
          pic: ''
        },
        {
          pic: ''
        }
      ] // 存放用户身份证图片的数组
    }
  },
  methods: {
    goUpload (inde) {
      console.log('inde', inde)
      this.reUploadinde = inde
    },
    uploadNow (e) {
      var that = this
      this.tempArry[this.reUploadinde] = e.target.files[0]
      var reader = new FileReader()
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
        reader.onload = function (e) {
          that.picArry[that.reUploadinde].pic = reader.result
        }
      } else {
        console.log('read fail')
      }
      console.log('tthat.picArry2', that.picArry)
    }
  },
  directives: {
    TransferDom
  },
  components: {
    XButton
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
    color: rgba(51,51,51,1);
    .uploadIDPicbox{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: .32rem;
      .idicon{
        width: 2.4rem;
        height: 1.3rem;
        background-color: #fff;
        margin-bottom: .15rem;
      }
      p{
        font-size: .16rem;
        color: #00A2E9;
        margin-bottom: .15rem;
        position: relative;
      }
    }
  }
</style>
