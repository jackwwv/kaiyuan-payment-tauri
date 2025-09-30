<!--
 * @Author: hua
 * @Date: 2019-02-01 13:57:47
 * @description: 入口页面
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2024-04-15 19:32:25
 -->
<template>
  <yd-layout>
     <!-- 视频标签 -->
    <!-- <div class="videoContainor"> -->
      <video id="localvideo" autoplay @click="switchSize('localvideo')"   @mousedown="down('localvideo')" @touchstart="down('localvideo')"
          @mousemove="move('localvideo')" @touchmove.prevent="move('localvideo')"   
          @mouseup="end" @touchend="end" />
      <video id="remotevideo" autoplay @click="switchSize('remotevideo')" @mousedown="down('remotevideo')" @touchstart="down('remotevideo')"
          @mousemove="move('remotevideo')" @touchmove.prevent="move('remotevideo')"   
          @mouseup="end" @touchend="end"/>
    <!-- </div> -->
    <!-- 公共头部导航  todo 修改头-->
    <yd-navbar 
      slot="navbar" 
      :title="this.$route.meta.title" 
      :class="{ 'room-navbar': this.$route.name === 'room', 'settings-navbar': this.$route.name === 'mySet' || this.$route.name === 'mySetUserInfo' }"
      v-if="this.$route.meta.isShowHead"
    >
      <a href="javascript:;" @click="goHref" slot="left" v-if="this.$route.meta.isShowBack">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </a>
      <a
        href="javascript:;"
        @click="goHrefByDefPath"
        slot="right"
        v-if="this.$route.meta.isShowDef"
        :style="{ color: this.$route.name === 'room' ? 'white' : 'rgb(153, 153, 153)' }"
      >
        <span
          v-if="this.$route.meta.defIconName"
          :class="this.$route.meta.defIconName"
          style="font-size: 0.46rem;"
        ></span>
        <span
          v-if="this.$route.meta.defTextName"
          style="font-size: 0.3rem;"
        >{{this.$route.meta.defTextName}}</span>
      </a>
    </yd-navbar>
    <transition :name="$store.state.routerStatus.transition" mode="out-in">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition :name="$store.state.routerStatus.transition" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <!-- html通知消息 -->
    <notify></notify>
    <!-- 悬浮 已移除 navMenu -->
    
    <!--公共底部导航 - 已隐藏-->
    <!-- <yd-tabbar slot="tabbar" v-if="this.$route.meta.isShowFoot">
      <yd-tabbar-item
        :title="item.name"
        type="link"
        :link="item.router"
        v-for="(item, index) in footerMenu"
        :key="index"
        :class="$store.state.appData.navbarTitle == item.name? 'active': ''"
      >
        <yd-icon
          :name="$store.state.appData.navbarTitle == item.name? item.iconActive: item.icon"
          custom
          slot="icon"
          size="0.54rem"
        ></yd-icon>
        <yd-badge
          slot="badge"
          type="danger"
          v-if="item.name=='消息' && (msgAlertNumber+groupMsgAlertNumber) > 0"
        >{{msgAlertNumber+groupMsgAlertNumber}}</yd-badge>
        <yd-badge
          slot="badge"
          type="danger"
          v-if="item.name=='我的' && newFriendAlertNumber > 0"
        >{{newFriendAlertNumber}}</yd-badge>
      </yd-tabbar-item>
    </yd-tabbar> -->
  </yd-layout>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import storage from "@/utils/localstorage";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";
import { addressBookBegCache } from "@/socketioApi/addressBook";
import {
  addAddressBookBeg,
  getAddressBookBeg,
  updateMsg
} from "@/utils/indexedDB";
import { setDown, setup, setupListen } from "@/utils/socketio";
import { getConst } from "@/socketioApi/config";
import utils from "@/utils/utils";
import router from "./router";
// import navMenu from "@/components/nav-menu/nav-menu"; // removed
import notify from "@/components/notify/notify";
import eruda from "eruda";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { roomGet } from "@/socketioApi/room";

export default {
  components: { notify },
  name: "app",
  created() {
    //eruda.init()
    let that = this;
    //刷新回首页
    this.$router.push("/dashboard");
    utils.h5Plus.bindPhysicsBack(null);
    //获取html节点的字体大小
    this.setHtmlFontSizeToVuex();
    //注册socketio
    setup();
    //拉取配置常量
    getConst().then(res => {
      console.log('getConst',res);
      this.$store.commit("updateState", res.data);
      //检测是否监听断开
      setInterval(() => {
        if (window.apiSocket !== undefined) {
          if (
            window.apiSocket._callbacks.$beg == undefined ||
            window.apiSocket._callbacks.$chat == undefined ||
            window.apiSocket._callbacks.$connect == undefined ||
            window.apiSocket._callbacks.$connecting == undefined ||
            window.apiSocket._callbacks.$disconnect == undefined ||
            window.apiSocket._callbacks.$groupRoom == undefined ||
            window.apiSocket._callbacks.$join == undefined ||
            window.apiSocket._callbacks.$leave == undefined ||
            window.apiSocket._callbacks.$room == undefined ||
            window.apiSocket._callbacks.$send == undefined
          ) {
            setupListen();
          }
        }
      }, res.data.TIME.TIME_OUT.value); //超时时间动态设置
      document.addEventListener("visibilitychange", () => {
        // 不在屏幕前时拉取
        this.initAddressBookBeg()
        // 同步房间
        this.initRoomList()
        if (document.visibilityState == "hidden") {
          this.hiddenTime = new Date().getTime(); //记录页面隐藏时间
        } else {
          let visibleTime = new Date().getTime();
          if ((visibleTime - this.hiddenTime) / 1000 > 10) {
            //页面再次可见的时间-隐藏时间>10S,重连
            setDown();
            console.log("主动关闭连接后重连");
            setTimeout(() => {
              setup(); //打开连接，使用的vuejs，这是socketio的连接方法
            }, 1500); //1.5S后重连
          } else {
            console.log("还没有到断开的时间");
          }
        }
      });
      //app的监听事件

      if (window.plus) {
        //运行环境从前台切换到后台事件
        document.addEventListener("pause", onAppPause, false);
        //运行环境从后台切换到前台事件
        document.addEventListener("resume", onAppReume, false);
        //应用切换到后台运行事件
        document.addEventListener("background", onAppBackground, false);
        //应用切换到前台运行事件
        document.addEventListener("foreground", onAppForeground, false);
        //应用需要清理内存事件
        document.addEventListener("trimmemory", onAppTrimMemory, false);
      } else {
        document.addEventListener(
          "plusready",
          function() {
            //运行环境从前台切换到后台事件
            document.addEventListener("pause", onAppPause, false);
            //运行环境从后台切换到前台事件
            document.addEventListener("resume", onAppReume, false);
            //应用切换到后台运行事件
            document.addEventListener("background", onAppBackground, false);
            //应用切换到前台运行事件
            document.addEventListener("foreground", onAppForeground, false);
            //应用需要清理内存事件
            document.addEventListener("trimmemory", onAppTrimMemory, false);
          },
          false
        );
      }
      function onAppPause() {
        console.log("Application paused!");
        that.$store.commit("updateIsPaused", true);
      }
      function onAppReume() {
        console.log("Application resumed!");
        that.$store.commit("updateIsPaused", false);
      }
      function onAppBackground() {
        console.log("Application background!");
      }
      function onAppForeground(e) {}
      function onAppTrimMemory() {
        console.log("Trim Memory!");
      }
      this.initAddressBookBeg();
    });
  },
  mounted() {
    // 监听路由变化，动态修改room页面的标题颜色
    this.$watch('$route', (newRoute) => {
      this.$nextTick(() => {
        if (newRoute.name === 'room') {
          this.fixRoomNavbarTitleColor();
        } else if (newRoute.name === 'mySet' || newRoute.name === 'mySetUserInfo') {
          this.fixSettingsNavbarTitleColor();
        }
      });
    });
    
    // 初始加载时也检查
    this.$nextTick(() => {
      if (this.$route.name === 'room') {
        this.fixRoomNavbarTitleColor();
      } else if (this.$route.name === 'mySet' || this.$route.name === 'mySetUserInfo') {
        this.fixSettingsNavbarTitleColor();
      }
    });
  },
  methods: {
    ...mapMutations({
      updateMsgList: "updateMsgList",
      updateRoomList: "updateRoomList",
      updateHtmlFontSize: "updateHtmlFontSize"
    }),
    // 修复room页面导航栏标题颜色
    fixRoomNavbarTitleColor() {
      // 使用setTimeout确保DOM完全渲染
      setTimeout(() => {
        const titleElements = document.querySelectorAll('.yd-navbar-center-title');
        titleElements.forEach(element => {
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        });
        
        // 也尝试通过其他选择器查找
        const spanTitles = document.querySelectorAll('span.yd-navbar-center-title');
        spanTitles.forEach(element => {
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        });
        
        // 限制按钮点击区域大小 - 更小的区域
        const leftButtons = document.querySelectorAll('header.yd-navbar.room-navbar a[slot="left"]');
        leftButtons.forEach(element => {
          element.style.display = 'inline-block';
          element.style.width = 'auto';
          element.style.minWidth = '0.6rem';
          element.style.maxWidth = '0.9rem';
          element.style.height = '0.6rem';
          element.style.padding = '0.05rem';
          element.style.margin = '0';
          element.style.textAlign = 'center';
          element.style.lineHeight = '0.5rem';
        });
        
        const rightButtons = document.querySelectorAll('header.yd-navbar.room-navbar a[slot="right"]');
        rightButtons.forEach(element => {
          element.style.display = 'inline-block';
          element.style.width = 'auto';
          element.style.minWidth = '0.6rem';
          element.style.maxWidth = '1.0rem';
          element.style.height = '0.6rem';
          element.style.padding = '0.05rem';
          element.style.margin = '0';
          element.style.textAlign = 'center';
          element.style.lineHeight = '0.5rem';
        });
        
        console.log('已修复room页面标题颜色和按钮区域');
      }, 100);
    },
    // 修复设置页面导航栏标题颜色
    fixSettingsNavbarTitleColor() {
      // 使用setTimeout确保DOM完全渲染
      setTimeout(() => {
        const titleElements = document.querySelectorAll('header.yd-navbar.settings-navbar .yd-navbar-center-title');
        titleElements.forEach(element => {
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        });
        
        // 也尝试通过其他选择器查找
        const spanTitles = document.querySelectorAll('header.yd-navbar.settings-navbar span.yd-navbar-center-title');
        spanTitles.forEach(element => {
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        });
        
        // 查找所有可能的标题元素
        const allTitles = document.querySelectorAll('header.yd-navbar.settings-navbar *');
        allTitles.forEach(element => {
          if (element.textContent && (element.textContent.trim() === '设置' || element.textContent.trim() === '修改用户信息')) {
            element.style.color = 'white';
            element.style.setProperty('color', 'white', 'important');
          }
        });
        
        // 修复按钮区域
        const leftButtons = document.querySelectorAll('header.yd-navbar.settings-navbar a[slot="left"]');
        leftButtons.forEach(element => {
          element.style.display = 'inline-block';
          element.style.width = 'auto';
          element.style.minWidth = '0.6rem';
          element.style.maxWidth = '0.9rem';
          element.style.height = '0.6rem';
          element.style.padding = '0.05rem';
          element.style.margin = '0';
          element.style.textAlign = 'center';
          element.style.lineHeight = '0.5rem';
        });
        
        const rightButtons = document.querySelectorAll('header.yd-navbar.settings-navbar a[slot="right"]');
        rightButtons.forEach(element => {
          element.style.display = 'inline-block';
          element.style.width = 'auto';
          element.style.minWidth = '0.6rem';
          element.style.maxWidth = '1.0rem';
          element.style.height = '0.6rem';
          element.style.padding = '0.05rem';
          element.style.margin = '0';
          element.style.textAlign = 'center';
          element.style.lineHeight = '0.5rem';
        });
        
        console.log('已修复设置页面和修改用户信息页面标题颜色和按钮区域');
      }, 100);
    },
    initAddressBookBeg() {
      if (this.user.token) {
        addressBookBegCache().then(res => {
          let data = res.data;
          console.log("addressBookBegCache",data)
          if(data.length==0){
            return
          }
          data.forEach(item=>{
            // 增加状态,0申请，1通过，2拒绝
            item.status = 0;
            Toast({ mes: `${item.data.nick_name}申请加你好友` });
            let value = item["data"]
            value.status = item.status
            value.user_id = item.focused_user_id
            addAddressBookBeg(value);
          })
          getAddressBookBeg().then(res => {
            let newFriendAlertNumber = 0;
            console.log("通讯录地址" + res);
            if (!res) return;
            if (res.length > 0) {
              res.forEach(item => {
                if (item.status == 0) {
                  newFriendAlertNumber++;
                }
              });
            }
            this.$store.commit("updateNewFriendAlertNumber", newFriendAlertNumber);
          });
        });
      }
    },
    compare(property){ 
        return function(a,b){ 
          var value1 = a[property]; 
          var value2 = b[property]; 
          return -(value1 - value2); 
        } 
    },
    initRoomList() {
      roomGet().then(res => {
        let localRoomList = [];
        if (res.data.list != null) {
          localRoomList = res.data.list;
          console.log(res.data.list)
        }
        console.log(localRoomList)
        userRoomRelationGet().then(resRoomRelation => {
          if (resRoomRelation.data.list != null) {
            localRoomList = localRoomList.concat(resRoomRelation.data.list);
            localRoomList.sort(this.compare('updated_at'))
          }
          console.log(localRoomList)
          this.updateRoomList(localRoomList);
        });
      });
    },
    goHref() {
      let path = router.currentRoute.meta.backPath;
      if (path === -1) {
        this.$router.back();
        return;
      } else {
        this.$router.push({ name: path });
      }
    },
    goHrefByDefPath() {
      let path = router.currentRoute.meta.defPath;
      if (path === -1) {
        this.$router.go(-1);
      } else if (path === null) {
        return;
      } else {
        console.log(path);
        this.$router.push({ name: path });
      }
    },
    setHtmlFontSizeToVuex() {
      let fontSize = document.getElementsByTagName("html")[0].style.fontSize;
      this.updateHtmlFontSize(fontSize.slice(0, fontSize.length - 2));
    },
    // 实现移动端拖拽
    down(valName){
      if(valName === 'localvideo' && this.localVideoLock){
        return 
      }
      if(valName === 'remotevideo' && this.remotevideoLock){
        return 
      }
      let moveDiv = document.getElementById(valName);
      this.flags = true;
      var touch;
      if(event.touches){
          touch = event.touches[0];
      }else {
          touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
    },
    move(valName){
      if(valName === 'localvideo' && this.localVideoLock){
        return 
      }
      if(valName === 'remotevideo' && this.remotevideoLock){
        return 
      }

      let moveDiv = document.getElementById(valName);
      if(this.flags){
        var touch ;
        if(event.touches){
            touch = event.touches[0];
        }else {
            touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx+this.nx;
        this.yPum = this.dy+this.ny;
        moveDiv.style.left = this.xPum+"px";
        moveDiv.style.top = this.yPum +"px";
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener("touchmove",function(){
            event.preventDefault();
        },false);
      }
    },
  //鼠标释放时候的函数
    end(){
      this.flags = false;
    },
    switchSize(valName){
      if(valName === 'localvideo'){
        if(this.remotevideoLock){
          return;
        }
        let localVideo = document.getElementById(valName);
        if(localVideo.style.width !== document.body.clientWidth+"px"){
          localVideo.style.width = document.body.clientWidth+"px";
          localVideo.style.zIndex = 1;
          this.videoLock = true;
          this.localVideoLock = true;
          localVideo.style.left ="0px";
          localVideo.style.top = "0px";
        }else{
          localVideo.style.width = "2.5rem";
          localVideo.style.zIndex = 10;
          this.videoLock = false;
          this.localVideoLock = false;
        }
      }else{
        if(this.localVideoLock){
          return;
        }
        let remotevideo = document.getElementById(valName);
        if(remotevideo.style.width !== document.body.clientWidth+"px"){
          remotevideo.style.marginTop ="0rem";
          remotevideo.style.width = document.body.clientWidth+"px";
          remotevideo.style.zIndex = 1;
          this.videoLock = true;
          this.remotevideoLock = true;
          remotevideo.style.left ="0px";
          remotevideo.style.top = "0px";
        }else{
          remotevideo.style.top = "2.2rem";
          remotevideo.style.width = "2.5rem";
          remotevideo.style.zIndex = 10;
          this.videoLock = false;
          this.remotevideoLock = false;
        }
      }
    }
  },
  watch: {
    $route(to, from) {
      if(to.query.name){
        console.log("to.query.name",to.query.name)
        to.meta.title = to.query.name;
      }
    }
  },
  computed: {
    ...mapGetters([
      "navbarTitle",
      "msgList",
      "currentRoomUuid",
      "currentRoomName",
      "currentRoomType",
      "currentRoomSaveAction",
      "msgAlertNumber",
      "groupMsgAlertNumber",
      "newFriendAlertNumber"
    ]),
    ...mapState(["user"])
  },
  data() {
    return {
      remotevideoLock:false,
      localVideoLock:false,
      videoLock: false,
      flags: false,
      position: { x: 0, y: 0 },
      nx: '', ny: '', dx: '', dy: '', xPum: '', yPum: '',
      hiddenTime: 0,
      footerMenu: [
        {
          icon: "xiaoxi",
          iconActive: "xiaoxi_active",
          name: "消息",
          router: "/home"
        },
        {
          icon: "tongxunlu",
          iconActive: "tongxunlu_active",
          name: "通讯录",
          router: "/addressBook"
        },
        {
          icon: "wode",
          iconActive: "wode_active",
          name: "我的",
          router: "/my"
        }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";
/* 开云支付页面导航栏蓝色样式 - 简化方案 */
header.yd-navbar.room-navbar {
  background-color: #1890ff !important;
  color: white !important;
}

/* 设置页面导航栏蓝色样式 - 与开云支付页面一致 */
header.yd-navbar.settings-navbar {
  background-color: #1890ff !important;
  color: white !important;
}

/* 让所有子元素继承白色 */
header.yd-navbar.room-navbar * {
  color: white !important;
}

/* 设置页面让所有子元素继承白色 */
header.yd-navbar.settings-navbar * {
  color: white !important;
}

/* 特别处理标题 - 使用更强的选择器覆盖内联样式 */
header.yd-navbar.room-navbar .yd-navbar-center-title,
header.yd-navbar.room-navbar .yd-navbar-center-title[style],
header.yd-navbar.room-navbar span.yd-navbar-center-title,
header.yd-navbar.room-navbar span.yd-navbar-center-title[style],
header.yd-navbar.room-navbar .yd-navbar-center-box .yd-navbar-center .yd-navbar-center-title,
header.yd-navbar.room-navbar .yd-navbar-center-box .yd-navbar-center .yd-navbar-center-title[style] {
  color: white !important;
  font-size: 0.3rem !important;
}

/* 设置页面特别处理标题 - 使用更强的选择器覆盖内联样式 */
header.yd-navbar.settings-navbar .yd-navbar-center-title,
header.yd-navbar.settings-navbar .yd-navbar-center-title[style],
header.yd-navbar.settings-navbar span.yd-navbar-center-title,
header.yd-navbar.settings-navbar span.yd-navbar-center-title[style],
header.yd-navbar.settings-navbar .yd-navbar-center-box .yd-navbar-center .yd-navbar-center-title,
header.yd-navbar.settings-navbar .yd-navbar-center-box .yd-navbar-center .yd-navbar-center-title[style] {
  color: white !important;
  font-size: 0.3rem !important;
}

/* 使用CSS all属性强制重置所有样式 */
header.yd-navbar.room-navbar .yd-navbar-center-title[style] {
  all: unset !important;
  color: white !important;
  font-size: 0.3rem !important;
  display: inline !important;
}

/* 设置页面使用CSS all属性强制重置所有样式 */
header.yd-navbar.settings-navbar .yd-navbar-center-title[style] {
  all: unset !important;
  color: white !important;
  font-size: 0.3rem !important;
  display: inline !important;
}

/* 设置页面额外强化标题样式 - 覆盖所有可能的标题元素 */
header.yd-navbar.settings-navbar .yd-navbar-center-box,
header.yd-navbar.settings-navbar .yd-navbar-center-box *,
header.yd-navbar.settings-navbar .yd-navbar-center,
header.yd-navbar.settings-navbar .yd-navbar-center *,
header.yd-navbar.settings-navbar .yd-navbar-center-box .yd-navbar-center,
header.yd-navbar.settings-navbar .yd-navbar-center-box .yd-navbar-center * {
  color: white !important;
}

/* 设置页面使用最高优先级选择器 */
header.yd-navbar.settings-navbar .yd-navbar-center-title[style*="color"],
header.yd-navbar.settings-navbar span[style*="color"],
header.yd-navbar.settings-navbar div[style*="color"] {
  color: white !important;
}

/* 设置页面终极覆盖 - 使用最高优先级 */
header.yd-navbar.settings-navbar *:not(.yd-navbar-left):not(.yd-navbar-right) {
  color: white !important;
}

/* 设置页面强制覆盖所有文本内容 */
header.yd-navbar.settings-navbar {
  color: white !important;
}

header.yd-navbar.settings-navbar * {
  color: white !important;
}

/* 特别处理返回图标 */
header.yd-navbar.room-navbar .yd-back-icon {
  color: white !important;
  fill: white !important;
}

/* 设置页面特别处理返回图标 */
header.yd-navbar.settings-navbar .yd-back-icon {
  color: white !important;
  fill: white !important;
}

/* 特别处理链接 */
header.yd-navbar.room-navbar a {
  color: white !important;
}

/* 设置页面特别处理链接 */
header.yd-navbar.settings-navbar a {
  color: white !important;
}

header.yd-navbar.room-navbar a span {
  color: white !important;
}

header.yd-navbar.settings-navbar a span {
  color: white !important;
}

/* 限制导航栏按钮点击区域大小，避免误点击 - 更小的区域 */
header.yd-navbar.room-navbar a[slot="left"] {
  display: inline-block !important;
  width: auto !important;
  min-width: 0.6rem !important;
  max-width: 0.9rem !important;
  height: 0.6rem !important;
  padding: 0.05rem !important;
  margin: 0 !important;
  text-align: center !important;
  line-height: 0.5rem !important;
}

/* 设置页面限制导航栏按钮点击区域大小 */
header.yd-navbar.settings-navbar a[slot="left"] {
  display: inline-block !important;
  width: auto !important;
  min-width: 0.6rem !important;
  max-width: 0.9rem !important;
  height: 0.6rem !important;
  padding: 0.05rem !important;
  margin: 0 !important;
  text-align: center !important;
  line-height: 0.5rem !important;
}

header.yd-navbar.room-navbar a[slot="right"] {
  display: inline-block !important;
  width: auto !important;
  min-width: 0.6rem !important;
  max-width: 1.0rem !important;
  height: 0.6rem !important;
  padding: 0.05rem !important;
  margin: 0 !important;
  text-align: center !important;
  line-height: 0.5rem !important;
}

/* 设置页面右侧按钮样式 */
header.yd-navbar.settings-navbar a[slot="right"] {
  display: inline-block !important;
  width: auto !important;
  min-width: 0.6rem !important;
  max-width: 1.0rem !important;
  height: 0.6rem !important;
  padding: 0.05rem !important;
  margin: 0 !important;
  text-align: center !important;
  line-height: 0.5rem !important;
}

.yd-navbar + div {
  padding-top: 1.5rem;
}
.fade-enter-active {
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  opacity: 1;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
/*过渡动画*/
/*下一页*/
.next-enter-active {
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  opacity: 1;
  position: fixed;
  width: 100vw;
}

.next-enter,
.next-leave-active {
  opacity: 0;
  -webkit-transform: translate3d(50%, 0, 0);
  transform: translate3d(50%, 0, 0);
}

.next-leave-active {
  opacity: 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}
/*上一页*/
.prev-enter-active {
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
  width: 100vw;
}

.prev-enter,
.prev-leave-active {
  opacity: 0;
  -webkit-transform: translate3d(-50%, 0, 0);
  transform: translate3d(-50%, 0, 0);
}

.prev-active {
  opacity: 0;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

/* 底部选中 */
.active {
  color: $color-primary !important;
}
.videoContainor {
  position: fixed;
  right: 0px;
  top: 1.2rem;
  z-index: 100;
}
#localvideo {
  width: 2.5rem;
  display: none;
  position: absolute;
  z-index: 10;
  margin-top: 0rem;
}
#remotevideo {
  width: 2.5rem;
  top: 2.2rem;
  display: none;
  position: absolute;
  z-index: 10;
}
</style>