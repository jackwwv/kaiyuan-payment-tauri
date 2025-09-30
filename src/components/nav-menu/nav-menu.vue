<!--
 * @Author: hua
 * @Date: 2019-10-12 17:11:53
 * @description: 
 * @LastEditors: Howard
 * @LastEditTime: 2022-03-24 13:41:36
 -->
<template>
  <div>
    <div
      class="home"
      :style="{ top: top + 'px' }"
      style="position:fixed;"
      id="right-nav"
      @touchmove="touchmove($event)"
    >
      <div  :class="homeActive === true ? 'on homeCon bg-color-red' : 'openHomeCon bg-color-red'">
        <img style="width:70%;"  @click="handleOpenTaobao" :src="taobaoImg"/>
        <img style="margin-top: 0.2rem;width:70%;"  @click="handleOpenQQ" :src="qqImg"/>
        <img  style="margin-top: 0.2rem;width:70%;"  v-if="!isFullscreen" @click="openFullscreen" :src="fullImg"/>
        <img  style="margin-top: 0.2rem;width:70%;"  v-if="isFullscreen" @click="exitFullScreen" :src="shrinkImg"/>
      </div>
      <div :class="homeActive?'pictrue':'openPictrue'" @click="open">
        <img
          :src="
            homeActive === true
              ? closeImg
              : openImg
          "
          :class="homeActive?'image':'openImage'"
        />
      </div>
    </div>
  </div>
</template>
<script>
import screenfull from 'screenfull'
import taobaoImg from '@/assets/img/taobao.jpg'
import qqImg from '@/assets/img/qq.png'
import fullImg from '@/assets/img/full.png'
import shrinkImg from '@/assets/img/shrink.png'
import closeImg from '@/assets/img/close.png'
import openImg from '@/assets/img/open.png'

export default {
  props: {},
  data: function() {
    return {
      top: "",
      homeActive:false,
      isFullscreen: false,
      taobaoImg,
      qqImg,
      fullImg,
      shrinkImg,
      closeImg,
      openImg
    };
  },
  mounted(){
  },
  methods: {
    touchmove(event) {
      event.preventDefault();
      let top =
        event.touches[0].pageY -
        (document.documentElement.scrollTop || document.body.scrollTop) -
        this.$el.clientHeight;

      if (top > 390) top = 390;
      else if (top < 55) top = 55;
      this.top = top;
    },
    open: function() {
      this.homeActive = !this.homeActive
       /*  ? this.$store.commit("CLOSE_HOME")
        : this.$store.commit("OPEN_HOME"); */
     /*  screenfull.toggle() */
    },
    //打开全屏方法
    openFullscreen() {
        screenfull.toggle();
        this.isFullscreen = true
    },
    //退出全屏方法
    exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExiFullscreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();

        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        this.isFullscreen = false
    },
    handleOpenTaobao(){
      if(window.plus){
          plus.runtime.openURL('https://main.m.taobao.com/security-h5-detail/home?ft=t&id=621473040411&fromNormal=true')
      }else{
          window.open('https://main.m.taobao.com/security-h5-detail/home?ft=t&id=621473040411&fromNormal=true')
      }
    },
    handleOpenQQ(){
        if(window.plus){
            plus.runtime.openURL('http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes')
        }else{
            window.open('http://wpa.qq.com/msgrd?v=3&uin=584425439&site=qq&menu=yes')
        }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
/*返回主页按钮*/
.home{position: fixed ;top:7.8rem;color: white;text-align: center;z-index:33;right:0.1rem;}
.home .homeCon{overflow: hidden;width:0.86rem;border-radius:0.5rem;transition:all 0.3s ease-in-out 0s;-webkit-transition:all 0.3s ease-in-out 0s;-moz-transition:all 0.3s ease-in-out 0s;-o-transition:all 0.3s ease-in-out 0s;opacity:0;transform: scale(0);-webkit-transform: scale(0);-ms-transform: scale(0);-moz-transform: scale(0);-o-transform: scale(0);height:0;color:$color-primary;background:#ffffff;}
.home .openHomeCon{overflow: hidden;width:0.86rem;border-radius:0.5rem;transition:all 0.3s ease-in-out 0s;-webkit-transition:all 0.3s ease-in-out 0s;-moz-transition:all 0.3s ease-in-out 0s;-o-transition:all 0.3s ease-in-out 0s;opacity:0;transform: scale(0);-webkit-transform: scale(0);-ms-transform: scale(0);-moz-transform: scale(0);-o-transform: scale(0);height:0;color:$color-primary;background:$color-primary}
.home .homeCon.on{box-shadow: 0px 0px 5px #ddd;opacity:1;transform: scale(1);-webkit-transform: scale(1);-ms-transform: scale(1);-moz-transform: scale(1);-o-transform: scale(1);height:3.2rem;padding: 0.34rem 0;margin-bottom: 0.2rem;}
.home .homeCon .iconfont{font-size:0.48rem;color:#fff;display: inline-block;height: 0.9rem;margin: 0 auto;}
.home .pictrue{background:#fff;width:0.86rem;height:0.86rem;border-radius:50%;border-radius:50%;box-shadow: 0px 0px 5px #ddd;}
.home .pictrue .image{width:70%;height:70%;border-radius:50%;margin-top:15%;}

.home .openPictrue{width:0.86rem;height:0.86rem;border-radius:50%;background:#ffffff;border-radius:50%;box-shadow: 0px 0px 5px #ddd;}
.home .openPictrue .openImage{width:70%;height:70%;border-radius:50%;margin-top:15%;}
</style>
