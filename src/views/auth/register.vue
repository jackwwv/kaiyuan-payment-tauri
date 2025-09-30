<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 注册
 * @LastEditors  : hua
 * @LastEditTime : 2020-01-24 16:52:11
 -->
<template>
<div class="register-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
    </div>
    
    <!-- 注册表单卡片 -->
    <div class="register-card">
        <form id="register_form" class="register-form">
            <!-- 头像上传 -->
            <div class="form-group avatar-group">
                <div class="avatar-label">头像</div>
                <div class="avatar-upload" @click="bindFile('header_img_file')">
                    <vImg class="avatar-preview" :imgUrl="headImg" v-if="headImg" />
                    <div class="avatar-placeholder" v-else>
                        <div class="upload-icon">📷</div>
                        <div class="upload-text">上传</div>
                    </div>
                </div>
                <input type="file" id="header_img_file" @change="bindHeaderImg" style="display:none;">
            </div>
            
            <!-- 手机账号输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">📱</div>
                    <input type="email" name="email" v-model="email" placeholder="请填写手机账号" autocomplete="off">
                    <span class="input-error" v-show="validated_status.email">!</span>
                </div>
            </div>
            
            <!-- 登录密码输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">🔒</div>
                    <input @keyup.enter="handleRegister" type="password" name="password" v-model="password" placeholder="请填写登录密码" autocomplete="off">
                    <span class="input-error" v-show="validated_status.password">!</span>
                    <div class="password-toggle" @click="handlePasswordShow($event.target, passwordShow)">
                        <span v-show="!passwordShow">👁️</span>
                        <span v-show="passwordShow">🙈</span>
                    </div>
                </div>
            </div>
            
            <!-- 确认密码输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">🔒</div>
                    <input @keyup.enter="handleRegister" type="password" name="confirm_password" v-model="confirm_password" placeholder="请重复密码" autocomplete="off">
                    <span class="input-error" v-show="validated_status.confirm_password">!</span>
                    <div class="password-toggle" @click="handleConfirmPasswordShow($event.target)">
                        <span v-show="!confirmPasswordShow">👁️</span>
                        <span v-show="confirmPasswordShow">🙈</span>
                    </div>
                </div>
            </div>
            
            <!-- 邀请码输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">🎫</div>
                    <input type="text" name="inviteCode" v-model="inviteCode" @blur="validateInviteCode" placeholder="请填写邀请码" autocomplete="off">
                    <span class="input-error" v-show="validated_status.inviteCode">!</span>
                </div>
            </div>
            
            <!-- 姓名输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">👤</div>
                    <input type="text" name="nickName" v-model="nickName" placeholder="请填写姓名" autocomplete="off">
                    <span class="input-error" v-show="validated_status.nickName">!</span>
                </div>
            </div>
        </form>
        
        <!-- 注册按钮 -->
        <yd-button :loading="loading" class="register-btn" size="large" @click.native="handleRegister">注册</yd-button>
        
        <!-- 登录链接 -->
        <div class="login-link">
            已有账号?<router-link :to="{name: 'authLogin'}">立即登录</router-link>
        </div>
    </div>
    <!-- 头像裁剪图 -->
    <header v-if="cropperShow" style="    background-color: rgb(255, 255, 255);
    color: rgb(228, 228, 228);
    position: fixed;
    top: 0px;
    width: 100%;
    height: 1rem !important;z-index:100001">
        <div  style="height: 1rem;">
            <div class="yd-navbar-center">
                <span class="yd-navbar-center-title" style="color: rgb(92, 92, 92); font-size: 0.3rem;line-height: 1rem;">拖动框进行裁剪</span>
                <span  @click="confirmCropper"  style="color: rgb(92, 92, 92);font-size: 0.3rem;padding-right: 12px;line-height: 1rem; position: absolute;right: 0px;top: 0px;z-index:100002;">使用</span>
            </div>
        </div> 
    </header>
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
import { Toast, Loading, Alert} from 'vue-ydui/dist/lib.rem/dialog'
import { allvalidated, validatedError } from "@/utils/validator"
import CrossLine from '@/components/cross-line/cross-line'
import vImg from '@/components/v-img/v-img'
import { register } from '@/socketioApi/user'
import { validateInviteCode } from '@/socketioApi/inviteCode'
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
        email: "",
        password: "",
        confirm_password: "",
        inviteCode: "",
        headImg: "",
        validated_status: {
            nickName:false,
            email: false,
            password: false,
            confirm_password: false,
            inviteCode: false
        },
        register_option: [
        {
            name: "email",
            display: "手机账号必填|手机账号格式不正确",
            rules: "required|phone"
        },
        {
            name: "password",
            display: "登录密码必填|密码不能大于12位|密码不能小于6位",
            rules: "required|max_length(12)|min_length(6)"
        },
        {
            name: "inviteCode",
            display: "邀请码必填|邀请码格式不正确",
            rules: "required|max_length(20)"
        },
        {
            name: "nickName",
            display: "姓名必填|姓名不能大于20位|姓名不能小于1位",
            rules: "required|max_length(20)|min_length(1)"
        },
        {
            name: "confirm_password",
            display: "密码必填|输入的两次密码不一致",
            rules: "required|same(password)"
        }
        ],
        passwordShow: false,
        confirmPasswordShow: false
    };
    },
    created() {
        window.physicsBackRouter = -1
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
        handleRegister() {
            //验证处理,返回错误信息
            var errors = allvalidated("register_form", this.register_option);
            //根据错误生成input状态
            validatedError(errors, this.validated_status);
            if (errors.length == 0) {
                this.loading = true
                let reqData = {nickName: this.nickName, email: this.email, password: md5(this.password), headImg: this.headImg, inviteCode: this.inviteCode}
                console.log(reqData)
                // if(!this.headImg) {
                //     Toast({mes:'头像必填',icon: 'error',timeout: 1500})
                //     this.loading = false
                //     return
                // }
                register(reqData).then(res=>{
                    this.loading = false
                    deleteTables()
                    this.password = ''
                    
                    // 检查用户是否已激活
                    if (res.data && res.data.is_active === 0) {
                        Toast({mes: res.data.message || '注册成功，请等待管理员激活账号', icon: 'success'})
                        // 注册成功但未激活，跳转到等待激活页面或登录页面
                         //存token
                        this.$store.commit('SET_TOKEN', res.data.token)
                        setToken('token',res.data.token)
                        storage.set('user',res.data.user)
                        this.$store.commit('updateUserInfo', res.data.user)
                        setup()
                        this.$router.push({name: 'authLogin'})
                    } else {
                        Toast({mes:'注册成功',icon: 'success'})
                        //存token
                        this.$store.commit('SET_TOKEN', res.data.token)
                        setToken('token',res.data.token)
                        storage.set('user',res.data.user)
                        this.$store.commit('updateUserInfo', res.data.user)
                        setup()
                        this.$router.push('/dashboard')
                    }
                }).catch(e=>{
                    this.loading = false
                })
            }
        },
        handlePasswordShow(dom) {
            let type = dom.parentNode.firstChild.type
            if( type == 'text'){
            dom.parentNode.firstChild.type = 'password'
            this.passwordShow = false
            }else{
            dom.parentNode.firstChild.type = 'text'
            this.passwordShow = true
            }
        },
        handleConfirmPasswordShow(dom) {
            let type = dom.parentNode.firstChild.type
            if( type == 'text'){
            dom.parentNode.firstChild.type = 'password'
            this.confirmPasswordShow = false
            }else{
            dom.parentNode.firstChild.type = 'text'
            this.confirmPasswordShow = true
            }
        },
        // 邀请码验证
        async validateInviteCode() {
            if (!this.inviteCode || this.inviteCode.length < 3) {
                return
            }
            
            try {
                const res = await validateInviteCode({ inviteCode: this.inviteCode })
                if (res.code === 200) {
                    Toast({ mes: '邀请码验证成功', icon: 'success', timeout: 1500 })
                } else {
                    Toast({ mes: res.msg || '邀请码验证失败', icon: 'error', timeout: 1500 })
                }
            } catch (error) {
                console.error('邀请码验证失败:', error)
                Toast({ mes: '邀请码验证失败', icon: 'error', timeout: 1500 })
            }
        }
        }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';

.register-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    position: relative;
    overflow: hidden;
}

.background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

.wave {
    position: absolute;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: wave 6s ease-in-out infinite;
}

.wave1 {
    top: -50%;
    left: -50%;
    animation-delay: 0s;
}

.wave2 {
    top: -30%;
    right: -50%;
    animation-delay: 3s;
}

@keyframes wave {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    50% {
        transform: translate(-20px, -20px) rotate(180deg);
    }
}

.register-card {
    position: relative;
    z-index: 2;
    background: white;
    margin: 40px 20px;
    border-radius: 20px;
    padding: 30px 25px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.register-form {
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 20px;
}

.avatar-group {
    text-align: center;
    margin-bottom: 30px;
}

.avatar-label {
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
    font-weight: 500;
}

.avatar-upload {
    display: inline-block;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.avatar-upload:hover {
    transform: scale(1.05);
}

.avatar-preview {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #4facfe;
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

.upload-icon {
    font-size: 24px;
    margin-bottom: 5px;
}

.upload-text {
    font-size: 12px;
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 0 15px;
    transition: all 0.3s ease;
    min-height: 50px;
}

.input-wrapper:focus-within {
    border-color: #4facfe;
    background: white;
    box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.input-icon {
    font-size: 18px;
    margin-right: 12px;
    color: #6c757d;
    min-width: 20px;
}

.input-wrapper input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    color: #333;
    padding: 12px 0;
}

.input-wrapper input::placeholder {
    color: #adb5bd;
    font-size: 15px;
}

.input-error {
    position: absolute;
    right: 45px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: #dc3545;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
}

.password-toggle {
    cursor: pointer;
    padding: 5px;
    font-size: 16px;
    color: #6c757d;
    transition: color 0.3s ease;
}

.password-toggle:hover {
    color: #4facfe;
}

.register-btn {
    width: 100%;
    height: 50px;
    background: linear-gradient(135deg, #4facfe, #00f2fe) !important;
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
    transition: all 0.3s ease;
}

.register-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.login-link {
    text-align: center;
    font-size: 14px;
    color: #6c757d;
}

.login-link a {
    color: #4facfe;
    text-decoration: none;
    font-weight: 500;
    margin-left: 5px;
    transition: color 0.3s ease;
}

.login-link a:hover {
    color: #00f2fe;
    text-decoration: underline;
}

// 保留原有的头像裁剪相关样式
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

.btn_wrapper{
    position:absolute;
    height:40px; 
    bottom: 10px;
    z-index: 100001;
    right:12px;
}
</style>
        