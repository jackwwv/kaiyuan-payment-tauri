<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description: 登录
 * @LastEditors: hua
 * @LastEditTime: 2020-10-22 21:15:38
 -->
<template>
<div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
    </div>
    
    <!-- 登录表单卡片 -->
    <div class="login-card">
        <form id="login_form" class="login-form">
            <!-- 手机账号输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">📱</div>
                    <input type="email" name="email" v-model="email" placeholder="请填写手机账号" autocomplete="off">
                    <span class="input-error" v-show="validated_status.email">!</span>
                </div>
            </div>
            
            <!-- 密码输入 -->
            <div class="form-group">
                <div class="input-wrapper">
                    <div class="input-icon">🔒</div>
                    <input @keyup.enter="handleLogin" :type="passwordShow ? 'text' : 'password'" name="password" v-model="password" placeholder="请填写密码" autocomplete="off">
                    <span class="input-error" v-show="validated_status.password">!</span>
                    <div class="password-toggle" @click="handlePasswordShow">
                        <span v-show="!passwordShow">👁️</span>
                        <span v-show="passwordShow">🙈</span>
                    </div>
                </div>
            </div>
            
            <!-- 图形验证码输入 -->
            <div class="form-group">
                <div class="input-wrapper captcha-wrapper">
                    <div class="input-icon">📧</div>
                    <input type="text" name="captcha" v-model="captcha" placeholder="图形验证码" autocomplete="off">
                    <span class="input-error" v-show="validated_status.captcha">!</span>
                    <div class="captcha-image" @click="refreshCaptcha">
                        <span v-if="!captchaCode">{{ captchaCode || '889H' }}</span>
                        <span v-else>{{ captchaCode }}</span>
                    </div>
                </div>
            </div>
        </form>
        
        <!-- 登录按钮 -->
        <yd-button :loading="loading" class="login-btn" size="large" @click.native="handleLogin">登录</yd-button>
        
        <!-- 底部链接 -->
        <div class="bottom-links" >
            <router-link :to="{name: 'authRegister'}" class="register-link">立即注册</router-link>
            <a style="display: none;" href="javascript:;" class="forgot-link">忘记密码?</a>
        </div>
    </div>
</div>
</template>
<script>
import { Toast } from 'vue-ydui/dist/lib.rem/dialog'
import utils from '@/utils/utils'
import { allvalidated, validatedError } from "@/utils/validator"
import CrossLine from '@/components/cross-line/cross-line'
import { login } from '@/socketioApi/user'
import { setToken } from '@/utils/auth'
import storage  from  '@/utils/localstorage'
import {setup} from '@/utils/socketio'
import {deleteTables} from '@/utils/indexedDB'
import vModal from '@/components/v-modal/v-modal'

import md5 from 'js-md5'
export default {
    components: { CrossLine, vModal },
    data() {
    return {
        loading:false,
        email: "",
        password: "",
        captcha: "",
        captchaCode: "889H", // 默认验证码
        validated_status: {
        email: false,
        password: false,
        captcha: false
        },
        login_option: [
        {
            name: "email",
            display: "手机账号必填|手机账号格式不正确",
            rules: "required|phone"
        },
        {
            name: "password",
            display: "密码必填|密码不能大于12位|密码不能小于6位",
            rules: "required|max_length(12)|min_length(6)"
        },
        {
            name: "captcha",
            display: "验证码必填|验证码格式不正确",
            rules: "required|max_length(6)"
        }
        ],
        passwordShow: false
    };
    },
    created() {
        window.physicsBackRouter = null
        //注册socketio
        setup()
    },
    mounted() {
        //this.$refs.redPackRef.openMask()
    },
    methods: {
    handleFingerpring(){
        //开启指纹解锁
        function go() {
            this.$router.push({name:'home'})
        }
        utils.h5Plus.isFingerprint(go)
    },
    handleLogin() {
        //验证处理,返回错误信息
        var errors = allvalidated("login_form", this.login_option);
        //根据错误生成input状态
        validatedError(errors, this.validated_status);
        if (errors.length == 0) {
            // 验证码验证
            if (this.captcha.toUpperCase() !== this.captchaCode.toUpperCase()) {
                Toast({mes: '验证码不正确', icon: 'error'})
                this.refreshCaptcha()
                return
            }
            
            this.loading = true
            login({email:this.email, password:md5(this.password)}).then(res=>{
                console.log(res)
                deleteTables()
                this.loading = false
                this.password = ''
                this.captcha = ''
                Toast({mes:'登录成功'})
                //存token
                this.$store.commit('SET_TOKEN', res.data.token)
                setToken('token',res.data.token)
                storage.set('user',res.data.user)
                this.$store.commit('updateUserInfo', res.data.user)
                setup()
                this.$router.push({name:'dashboard'})
            }).catch(e=>{
                this.loading = false
                this.refreshCaptcha() // 登录失败时刷新验证码
            })
        }
    },
    handlePasswordShow() {
        this.passwordShow = !this.passwordShow
    },
    // 刷新验证码
    refreshCaptcha() {
        // 生成随机验证码
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let result = ''
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        this.captchaCode = result
        this.captcha = '' // 清空输入框
    }
    }
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';

.login-container {
    height: 100vh;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 确保Toast组件能够正常显示 */
:global(.yd-toast) {
    z-index: 9999 !important;
}

:global(.yd-dialog) {
    z-index: 9999 !important;
}

.background-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
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

.login-card {
    position: relative;
    z-index: 10;
    background: white;
    margin: 0;
    border-radius: 20px;
    padding: 30px 25px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    width: 100%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
}

.login-form {
    margin-bottom: 25px;
}

.form-group {
    margin-bottom: 20px;
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
    z-index: 50;
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
    z-index: 100;
}

.password-toggle {
    cursor: pointer;
    padding: 5px;
    font-size: 16px;
    color: #6c757d;
    transition: color 0.3s ease;
    z-index: 100;
    position: relative;
}

.password-toggle:hover {
    color: #4facfe;
}

.captcha-wrapper {
    padding-right: 0;
}

.captcha-image {
    width: 80px;
    height: 40px;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: 10px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    font-size: 16px;
    color: #495057;
    background-image: 
        linear-gradient(45deg, rgba(255,0,0,0.1) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(0,0,255,0.1) 25%, transparent 25%);
    background-size: 10px 10px;
    transition: all 0.3s ease;
    z-index: 100;
    position: relative;
}

.captcha-image:hover {
    background-color: #e9ecef;
    border-color: #4facfe;
}

.login-btn {
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

.login-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.6);
}

.bottom-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.register-link {
    color: #4facfe;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.register-link:hover {
    color: #00f2fe;
    text-decoration: underline;
}

.forgot-link {
    color: #6c757d;
    text-decoration: none;
    transition: color 0.3s ease;
}

.forgot-link:hover {
    color: #495057;
    text-decoration: underline;
}
</style>
    