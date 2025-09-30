<!--
 * @Author: hua
 * @Date: 2019-02-01 14:08:47
 * @description: 首页
 * @LastEditors: hua
 * @LastEditTime: 2020-11-18 20:31:08
 -->
<template>
  <div class="message-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="nav-item" :class="{ active: activeTab === 'order' }" @click="setActiveTab('order')">
        <div class="nav-icon">📋</div>
        <div class="nav-text">订单</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'collect' }" @click="setActiveTab('collect')">
        <div class="nav-icon icon-custom-collect-qr"></div>
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
      <!-- 通讯录标签已隐藏 -->
      <!-- <div class="nav-item" :class="{ active: activeTab === 'contacts' }" @click="setActiveTab('contacts')">
        <div class="nav-icon">📞</div>
        <div class="nav-text">通讯录</div>
      </div> -->
      <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="setActiveTab('profile')">
        <div class="nav-icon">👤</div>
        <div class="nav-text">我的</div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content">
    <!-- 单聊 -->
    <article class="yd-list yd-list-theme4" style="padding-top: 0.5rem;">
      <a
        @click="handleJoinRoom(item)"
        href="javascript:;"
        class="yd-list-item"
        v-for=" (item, index) in roomList"
        :key="index"
        v-if="item.room"
      >
        <div class="yd-list-img">
          <vImg v-if="item.room.type ==3 && item.adminUsers" :imgUrl="item.adminUsers.avatar || ''" />
          <vImg v-else-if="item.room.type ==1" :imgUrl="item.room.image" />
          <vImg
            v-else
            :imgUrl="item.users && item.users.head_img ? item.users.head_img : ''"
          />
          <!-- :style="item.users.online == 1?'':'background: grey;opacity: 0.5'"-->
        </div>
        <div class="yd-list-mes">
          <div class="yd-list-title">
            <span class="title-left room_name" v-if="item.type ==1&& item.adminUsers">{{item.adminUsers.nick_name}}</span>
            <span class="title-left room_name" v-if="item.type ==0 && item.room.type ==0">{{item.users && item.users.nick_name ? item.users.nick_name : '未知用户'}}</span>
            <span class="title-left room_name" v-if="item.room.type == 1">{{item.room.name}}</span>
            <span class="title-right">{{formatTime(item.room.updated_at)}}</span>
          </div>
          <div class="yd-list-other">
            <div>
              <span class="last_msg" v-html="formatLastMsg(item.room.last_msg)"></span>
            </div>
            <div v-if="alert && item.is_alert">
              <yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge>
            </div>
          </div>
        </div>
      </a>
    </article>
    <!-- 群聊 -->
    <!-- <article class="yd-list yd-list-theme4">
      <a
        @click="handleJoinGroupRoom(item)"
        href="javascript:;"
        class="yd-list-item"
        v-for=" (item, index) in groupRoomList"
        :key="index"
        v-if="item.room"
      >
        <div class="yd-list-img">
          <img src="@/assets/img/default.jpg" />
        </div>
        <div class="yd-list-mes">
          <div class="yd-list-title">
            <span class="title-left">{{item.room.name}}</span>
            <span class="title-right">{{formatTime(item.room.updated_at)}}</span>
          </div>
          <div class="yd-list-other">
            <div>
              <span class="demo-list-price" v-html="formatLastMsg(item.room.last_msg)"></span>
            </div>
            <div v-if="alert && item.is_alert">
              <yd-badge v-if="item.unread_number" type="danger">{{item.unread_number}}</yd-badge>
            </div>
          </div>
        </div>
      </a>
    </article> -->
    <!-- <vImg class="loading" :imgUrl="loadingImg" v-if="loading" />-->
    <!-- 参数空时页面 -->
        <vEmpty v-if="roomList.length==0 && loading==false && groupRoomList.length==0"></vEmpty>
      </div>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapMutations,mapState } from "vuex";
import vImg from "@/components/v-img/v-img";
import utils from "@/utils/utils";
import vEmpty from "@/components/v-empty/v-empty";
import { roomGet } from "@/socketioApi/room";
import storage from "@/utils/localstorage";
import { userRoomRelationGet } from "@/socketioApi/userRoomRelation";
import { setup } from "@/utils/socketio";
import { joinChatSend } from "@/socketIoApi/chat";
import { addressBookBegCache } from "@/socketioApi/addressBook";
import {
  addAddressBookBeg,
  getAddressBookBeg,
} from "@/utils/indexedDB";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";

export default {
  components: { vImg, vEmpty },
  name: "home",
  data() {
    return {
      activeTab: 'service', // 默认选中客服（因为客服链接到消息页面）
      alert: true,
      loading: true,
      defShow: false,
      mask_show: false,
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
    ...mapGetters([
      "navbarTitle",
      "roomList",
      "msgList",
      "groupRoomList",
      "RECORD",
      "TEXT",
      "IMG",
      "FILE",
      "GROUP",
      "CHAT_NOTIFY"
    ]),
    ...mapState(["user"])
  },
  methods: {
    ...mapMutations({
      updateRoomList: "updateRoomList",
      updateGroupRoomList: "updateGroupRoomList",
      updateMsgList: "updateMsgList"
    }),
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
        // 通讯录功能已隐藏
        // case 'contacts':
        //   this.$router.push({ name: 'addressBook' }); // 通讯录
        //   break;
        case 'profile':
          this.$router.push({ name: 'my' });
          break;
        case 'service':
          // 客服标签保持在当前页面（消息页面）
          this.activeTab = 'service';
          break;
        default:
          // 保持在当前页面（消息页面）
          break;
      }
    },
    compare(property){ 
        return function(a,b){ 
          var value1 = a[property]; 
          var value2 = b[property]; 
          return -(value1 - value2); 
        } 
    },
    init() {
      window.physicsBackRouter = null;
      // 检查是否是从客服标签跳转过来的
      if (this.$route.query.from === 'service') {
        this.activeTab = 'service';
      }
      if (window.localStorage.getItem("alert") == undefined) {
        this.alert = true;
      } else {
        this.alert = storage.get("alert");
      }
      setTimeout(()=>{
        roomGet().then(res => {
          console.log("222222",res)
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
              //this.updateGroupRoomList(resRoomRelation.data.list);
            }
            console.log("userRoomRelationGet", resRoomRelation);

            this.updateRoomList(localRoomList);
            this.loading = false;
          });
        });
        /* userRoomRelationGet().then(res => {
          if (res.data.list != null) {
            this.updateGroupRoomList(res.data.list);
            this.loading = false;
          }
        }); */
      })
      this.initAddressBookBeg()
      
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
    handleJoinRoom(item) {
      let name = "";
      if(item.type === 1 && item.adminUsers){
        // 管理员消息
        name = item.adminUsers.nick_name || '管理员';
      }else{
        if(item.room.type === this.GROUP){
          name = item.room.name;
        }else{
          // 添加空值检查
          name = item.users && item.users.nick_name ? item.users.nick_name : '未知用户';
        }
      }
      console.log("item",item)

      joinChatSend({
        name: name,
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
    },
    formatTime(value) {
      return utils.time.formatDate(value, "hh:mm:ss");
    },
    formatLastMsg(last_msg) {
      try {
        let data = JSON.parse(last_msg);
        if (data["type"] == this.IMG) {
          return "[图片]";
        }
        if (data["type"] == this.FILE) {
          return "[文件]";
        }
        if (data["type"] == this.RECORD) {
          return "[语音]";
        }
        if (data["type"] == this.TEXT) {
          return data["msg"];
        }
        if (data["type"] == this.CHAT_NOTIFY) {
          return JSON.parse(data["msg"])["msg"];
        }
        return data["msg"];
      } catch (e) {
        return last_msg;
      }
    }
  },
  created() {
    this.init();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";

.message-container {
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
.yd-list-theme4 .yd-list-item .yd-list-img {
  width: 1.2rem;
  padding: 0.6rem 0;
}

.yd-list-theme4 .yd-list-item .yd-list-title {
  line-height: 0.6rem;
}
.title-right {
  font-weight: normal;
  display: inline-block;
  font-size: 12px;
  width: 48%;
  overflow: hidden;
  text-align: right;
}
.title-left {
  width: 50%;
  overflow: hidden;
  display: inline-block;
}
.yd-list-title {
  line-height: 0.4rem !important;
}

.navbar_icon {
  color: rgb(92, 92, 92);
  font-size: 0.45rem;
  margin-left: 0.3rem;
}
.last_msg {
  overflow: hidden;
  width: 2rem;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loading {
  width: 100%;
  height: 100%;
  padding: 0 70px 70px 70px;
  position: fixed;
  z-index: 100;
  top: 0rem;
  background: #fff;
  max-width: 750px;
  min-width: 300px;
}
.room_name {
  overflow: hidden;
  height: 0.4rem;
  line-height: 0.4rem;
}
</style>
<style>
.yd-accordion-head:after {
  background-image: none !important;
}
</style>