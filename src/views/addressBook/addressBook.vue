<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:36
 * @description: 通讯录
 * @LastEditors: Howard
 * @LastEditTime: 2022-03-03 21:12:16
 -->
<template>
  <div class="contacts-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="nav-item" :class="{ active: activeTab === 'order' }" @click="setActiveTab('order')">
        <div class="nav-icon">📋</div>
        <div class="nav-text">订单</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'collect' }" @click="setActiveTab('collect')">
        <div class="nav-icon">🏢</div>
        <div class="nav-text">代收</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'pay' }" @click="setActiveTab('pay')">
        <div class="nav-icon">📊</div>
        <div class="nav-text">代付</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'service' }" @click="setActiveTab('service')">
        <div class="nav-icon">🎧</div>
        <div class="nav-text">客服</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'contacts' }" @click="setActiveTab('contacts')">
        <div class="nav-icon">📞</div>
        <div class="nav-text">通讯录</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="setActiveTab('profile')">
        <div class="nav-icon">👤</div>
        <div class="nav-text">我的</div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content">
    <!-- 头部开始 -->
    <header class="yd-navbar header">
      <div class="yd-navbar-item"></div>
      <div class="yd-navbar-center-box" style="height: 1rem;">
        <div class="yd-navbar-center">
          <span
            class="yd-navbar-center-title"
            style="color: rgb(92, 92, 92); font-size: 0.3rem;"
          >通讯录</span>
        </div>
      </div>
      <div class="yd-navbar-item" @click="defShow=!defShow">
        <!-- <span class="icon-custom-8888 navbar_icon"></span> -->
        <span class="icon-custom-jia2 navbar_icon"></span>
      </div>
    </header>
    <!-- 头部结束 -->
    <!-- 功能栏 -->
    <yd-actionsheet :items="defs" v-model="defShow" cancel="取消"></yd-actionsheet>
    <!-- 群组 -->
    <!-- <yd-accordion>
      <yd-accordion-item title="群聊">
        <div style="padding: .24rem;">
          <dl>
            <dt></dt>
            <dd
              @click="handleJoinGroupRoom(item)"
              v-for="(item, index) in groupRoomList"
              :key="index"
              v-if="item.room"
            >
              <a>
                <img src="@/assets/img/default.jpg" />
                {{item.room.name}}
              </a>
            </dd>
          </dl>
        </div>
      </yd-accordion-item>
    </yd-accordion> -->
    <!-- 列表 -->
    <div class="address-book-list">
      <dl>
        <!-- <dt :ref="String.fromCharCode(64+num)">{{String.fromCharCode(64+num)}}</dt> -->
        <dd
          @click="handleJoinRoom(item)"
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="item.users && item.type==0"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
      <dl>
        <!-- <dt :ref="'#'">#</dt> -->
        <dd
          @click="handleJoinRoom(item)"
          v-for="(item, index) in adderssBookList"
          :key="index"
          v-if="item.users && item.users.first_word == '#'"
        >
          <!-- 循环 -->
          <a>
            <vImg :imgUrl="item.users.head_img" />
            {{item.users.nick_name}}
          </a>
        </dd>
      </dl>
    </div>
    <!-- 导航 -->
    <!-- <div id="pop-address-book-letter" class="clearfix">
      <ul>
        <li v-for="num in 26" :key="num" @click="handleScrollToRef(String.fromCharCode(num+64))">
          <a
            :class="activeName==String.fromCharCode(num+64)?'activeName':''"
          >{{String.fromCharCode(num+64)}}</a>
        </li>
        <li>
          <a :class="activeName=='#'?'activeName':''" @click="handleScrollToRef('#')">#</a>
        </li>
      </ul>
    </div> -->
      </div>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { addressBookGet } from "@/socketioApi/addressBook";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";
import { joinChatSend } from "@/socketIoApi/chat";
import vImg from "@/components/v-img/v-img";
export default {
  components: { vImg },
  data() {
    return {
      activeTab: 'contacts', // 默认选中通讯录
      reqData: {
        page_no: 1,
        per_page: 10000000
      },
      adderssBookList: [],
      defShow: false,
      activeName: "",
      defs: [
        {
          label: "发起群聊",
          callback: () => {
            this.$store.dispatch("updatePersonList", [])
            this.$router.push({ name: "groupChat" });
          }
        },
        {
          label: "添加朋友",
          callback: () => {
            this.$router.push({ name: "search" });
          }
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["groupRoomList", "htmlFontSize"])
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      // 根据标签页跳转到对应页面
      switch(tab) {
        case 'order':
          this.$router.push({ name: 'order' });
          break;
        case 'collect':
          this.$router.push({ name: 'collect' });
          break;
        case 'pay':
          this.$router.push({ name: 'dashboard' });
          break;
        case 'service':
          this.$router.push({ name: 'home', query: { from: 'service' } }); // 客服链接到消息页面
          break;
        case 'profile':
          this.$router.push({ name: 'my' });
          break;
        default:
          // 保持在当前页面（通讯录页面）
          break;
      }
    },
    // ...mapMutations({
    //   updateGroupRoomList: "updateGroupRoomList"
    // }),
    init() {
      window.physicsBackRouter = null;
      addressBookGet(this.reqData).then(res => {
        if (res.data.addressBookList) {
          this.adderssBookList = res.data.addressBookList;
        }
      });
      // userRoomRelationGet().then(res => {
      //   console.log('userRoomRelationGet', res);
      //   if (res.data.list) {
      //     this.updateGroupRoomList(res.data.list);
      //   }
      //   this.loading = false;
      // });
    },
    handleScrollToRef(value) {
      console.log(this.$refs[value]);
      if (value == "#") {
        document.getElementById("scrollView").scrollTop =
          this.$refs[value].offsetTop - this.htmlFontSize;
      } else {
        document.getElementById("scrollView").scrollTop =
          this.$refs[value][0].offsetTop - this.htmlFontSize;
      }
      this.activeName = value;
      Toast({ mes: value });
    },
    handleScroll() {},
    handleJoinRoom(item) {
      joinChatSend({
        name: item.users && item.users.nick_name ? item.users.nick_name : '未知用户',
        room_uuid: item.room_uuid,
        type: item.room.type,
        save_action: item.save_action
      });
    },
    handleJoinGroupRoom(item) {
      joinChatSend({
        name: item.room.name,
        room_uuid: item.room_uuid,
        type: item.room.type,
        save_action: item.save_action
      });
      // 跳转到开云支付页面
      this.$router.push({
        name: 'room',
        query: {
          name: item.room.name,
          room_uuid: item.room_uuid,
          type: item.room.type,
          save_action: item.save_action
        }
      });
    }
  },
  created() {
    this.init();
  },
  mounted() {
    document
      .getElementById("scrollView")
      .addEventListener("scroll", this.handleScroll);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";

.contacts-container {
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.top-navbar {
  display: flex;
  background: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    background: #007bff;
    color: white;
    border-radius: 8px;
    margin: 0 5px;
  }
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 5px;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}

.main-content {
  padding-top: 80px;
  padding: 80px 20px 20px;
  position: relative;
}

.header {
  background-color: rgb(255, 255, 255);
  height: 1rem;
  color: rgb(228, 228, 228);
  position: fixed;
  width: 100%;
  max-width: 750px;
  min-width: 300px;
}
.activeaddress-book {
  color: red !important;
}
dl {
  background-color: #fff;
}

.address-book-list {
  margin-bottom: 0px;
  position: relative;
  top: 1rem;
}

.address-book-list dt {
  color: #666;
  height: 0.7rem;
  line-height: 0.7rem;
  text-indent: 0.2rem;
  background-color: #f7f7f7;
  position: relative;
  padding-left: 10px;
}

.address-book-list dd {
  border-bottom: 1px solid #ccc;
}

.address-book-list dd:last-child {
  border-bottom: none;
}

.address-book-list dd {
  padding-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
}

.address-book-list dd.hot {
  padding-bottom: 0.25rem;
}

.address-book-list dd.hot a {
  height: 27.5px;
  width: 33.3%;
  float: left;
  border-bottom: none;
  text-align: center;
  height: inherit;
  line-height: inherit;
}

.address-book-list dd a {
  display: block;
  height: 27.5px;
  line-height: 2.75rem;
  position: relative;
  line-height: 27.5px;
}

.address-book-list dd a img {
  float: left;
  /* margin: .25rem .5rem 0 0.25rem; */
  height: 27.5px;
  width: 27.5px;
  margin-right: 5%;
}

.address-book-list dd.hot a span {
  display: block;
  padding-bottom: 0.25rem;
}

.address-book-list dd.hot a img {
  float: none;
  margin: 0.25rem auto 0;
}

.address-book-list dd.hot a {
  width: 33.3%;
  float: left;
  border-bottom: none;
  text-align: center;
  height: inherit;
  line-height: inherit;
}

/* 导航 */
#pop-address-book-letter {
  font-size: 0.6rem;
  position: fixed;
  right: 0;
  top: 50%;
  width: 1rem;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  z-index: 10;
}

#pop-address-book-letter li a {
  display: block;
  /* height:0.9rem;
    line-height: 1.1rem; */
  text-align: center;
  color: #576b95;
  font-size: 0.3rem;
}

.navbar_icon {
  color: rgb(92, 92, 92);
  font-size: 0.45rem;
  margin-left: 0.3rem;
}

dd {
  margin-top: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
}
dd a {
  display: block;
  height: 27.5px;
  line-height: 2.75rem;
  position: relative;
  line-height: 27.5px;
}
dd a img {
  float: left;

  height: 27.5px;
  width: 27.5px;
  margin-right: 5%;
}
.activeName {
  color: #45baf4 !important;
}
</style>
