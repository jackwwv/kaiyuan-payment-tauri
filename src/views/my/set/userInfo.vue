<!--
 * @Author: hua
 * @Date: 2020-11-22 18:54:26
 * @description: 修改用户信息
 * @LastEditors: hua
 * @LastEditTime: 2020-11-22 19:36:45
-->
<template>
<div>
    <CrossLine></CrossLine>
    <form id="set_info_form">
        <div class="yd-cell-box">
            <div class="yd-cell">
                <div class="yd-cell-item">
                    <div class="yd-cell-left">
                    <span class="yd-cell-icon"></span> 
                    <span>头像：</span>
                    </div> 
                    <div class="yd-cell-right">
                    <div class="yd-input" style="flex-direction: row-reverse;"  @click="bindFile('header_img_file')">
                        <vImg class="head_default" :imgUrl="headImg|| userInfo.head_img" v-if="headImg || userInfo.head_img" />
                        <div class="head_default" v-else>上传</div>
                    </div>
                    <input type="file" id="header_img_file" @change="bindHeaderImg" style="display:none;">
                    </div>
                </div> 
                <div class="yd-cell-item">
                    <div class="yd-cell-left">
                    <span class="yd-cell-icon"></span> 
                    <span>昵称：</span>
                    </div> 
                    <div class="yd-cell-right">
                    <div class="yd-input">
                        <input type="text" name="nickName" v-model="nickName" placeholder="请输入昵称" autocomplete="off">
                        <span class="yd-input-error" v-show="validated_status.nickName"></span> 
                        <span class="yd-input-success" style="display: none;"></span> 
                    </div>
                    </div>
                </div> 
            </div> 
        </div>
    </form>
    <yd-button :loading="loading" class="primary_bk" size="large"  color="#FFF" @click.native="handleSetInfo">确认修改</yd-button>
    <!-- 头像裁剪图 -->
    <!-- <header v-if="cropperShow" style="background-color: rgb(255, 255, 255);
    color: rgb(228, 228, 228);
    position: fixed;
    top: 0px;
    width: 100%;
    height: 1rem !important;z-index:99">
        <div  style="height: 1rem;">
            <div class="yd-navbar-center">
                <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;line-height: 1rem;">拖动框进行裁剪</span>
                <span  @click="confirmCropper"  style="color: rgb(92, 92, 92);font-size: 0.3rem;padding-right: 12px;line-height: 1rem; position: fixed;right: 0px;top: 0px;">使用</span>
            </div>
        </div> 
    </header> -->
      <!-- 截图功能键 -->
      <div class="btn_wrapper"  v-if="cropperShow" style="z-index:100001;position:fixed;bottom:20px;right:20px;">
        <yd-button
          @click.native="confirmCropper"
          type="warning"
          class="cube_img"
        >裁剪</yd-button>
      </div>
    <vueCropper
    v-if="cropperShow"
    ref="cropper_header"
    style="height:100%;position:fixed;z-index:100000;top:1rem "
    :img="option.img"
    :outputSize="option.size"
    :outputType="option.outputType"
    :canMoveBox="option.canMoveBox"
    :canMove="option.canMove"
    :autoCrop="true"
    :centerBox="option.centerBox"
    :autoCropWidth="option.autoCropWidth"
    :autoCropHeight="option.autoCropHeight"
    :fixed="option.fixed"
    :fixedNumber="option.fixedNumber"
    ></vueCropper>
</div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { Toast, Loading} from 'vue-ydui/dist/lib.rem/dialog'
import { allvalidated, validatedError } from "@/utils/validator"
import CrossLine from '@/components/cross-line/cross-line'
import vImg from '@/components/v-img/v-img'
import { setInfo } from '@/socketioApi/user'
import {uploadBase64} from '@/socketioApi/common'
import { setToken } from '@/utils/auth'
import storage  from  '@/utils/localstorage'
import md5 from 'js-md5'
import { VueCropper } from "vue-cropper"
import {deleteTables} from '@/utils/indexedDB'
import {setup} from '@/utils/socketio'
import lrz from 'lrz'
export default {
    components: {CrossLine, VueCropper, vImg},
    data() {
    return {
        loading:false,
        option: {
            img: "",
            size: 1,
            canScale: true,
            outputType: "png",
            canMove: true,
            canMoveBox: true,
            centerBox: true,
            // 只有自动截图开启 宽度高度才生效
            autoCropWidth: 250,
            autoCropHeight: 250,
            // 开启宽度和高度比例
            fixed: true,
            fixedNumber: [4, 4]
        },
        cropperShow: false,
        nickName: "",
        headImg: "",
        validated_status: {
            nickName:false
        },
        info_option: [
        {
            name: "nickName",
            display:
            "昵称必填|昵称不能大于20位|昵称不能小于10位",
            rules: "required|max_length(20)|min_length(1)"
        },
        {
            name: "headImg",
            display: "确认头像必填",
            rules: "required"
        },
        ],
        passwordShow: false,
        confirmPasswordShow: false
    };
    },
    computed: {
    ...mapGetters([
      "userInfo"
    ])
  },
    created() {
        window.physicsBackRouter = -1
        this.nickName = this.userInfo.nick_name;
    },
    methods: {
        bindFile(name) {
            let btn = document.getElementById(name);
            btn.click();
        },
        bindHeaderImg() {
            let file = event.target.files[0];
            if (file.type.indexOf("image/") == -1) {
                Alert({ mes: "请上传图片!" });
                return;
            }
            lrz(file,{width:1080})
            .then( (rst) =>{
                // 处理成功会执行
                if(rst.filelen > 204800){
                    Alert({mes: "上传图片不能大于2M"})
                }else{
                    this.option.img = rst.base64;
                    this.cropperShow = true;
                }
                console.log(rst)
                
            }).catch(function (err) {
                // 处理失败会执行
                Toast({
                    mes: err,
                    icon: 'error',
                    timeout: 1500
                })
            })
            .always(function () {
                // 不管是成功失败，都会执行
            });
        },
        confirmCropper() {
            this.$refs.cropper_header.getCropData(data => {
                //console.log( process.env)
                this.option.img = data;
                Loading.open('正在上传...')
                uploadBase64({ imgDatas: this.option.img})
                .then(res => {
                    Loading.close()
                    this.headImg = import.meta.env.VUE_APP_CLIENT_SOCKET+res.data.path
                })
                this.cropperShow = false;
            });
        },
        handleSetInfo() {
            //验证处理,返回错误信息
            var errors = allvalidated("set_info_form", this.info_option);
            //根据错误生成input状态
            validatedError(errors, this.validated_status);
            if (errors.length == 0) {
                this.loading = true
                let reqData = {nickName: this.nickName, headImg: this.headImg}
                console.log(reqData)
                setInfo(reqData).then(res=>{
                    this.loading = false
                    Toast({mes:'修改成功',icon: 'success'})
                    console.log("res.data.",res.data)
                    storage.set('user',res.data)
                    this.$store.commit('updateUserInfo', res.data)
                    this.$router.push('/home')
                }).catch(e=>{
                    this.loading = false
                })
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';
.head_default{
    width:50px;
    height:50px;
    border-radius: 25px;
    background:$color-primary;
    line-height: 50px;
    text-align:center;
    color:#fff;
    margin-top:10px;
    margin-bottom:10px;
}
.right{
    width:100%;
    text-align: right;
    padding-right: 0.3rem;
    margin-top: 0.2rem;
    display: inline-block;
    font-size: .28rem;
}
.primary_bk{
    width:90%;
    margin-left:5%;
}
.btn_wrapper{
    position:absolute;
    height:40px; 
    bottom: 10px;
    z-index: 100001;
    right:12px;
}
</style>
        