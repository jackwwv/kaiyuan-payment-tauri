<!--
 * @Author: hua
 * @Date: 2019-09-03 17:07:10
 * @description:设置页面 
 * @LastEditors: hua
 * @LastEditTime: 2020-11-22 18:54:16
 -->

<template>
  <div class="settings-container">
    <!-- 主内容区域 -->
    <main class="settings-content">
      <!-- 功能选项列表 -->
      <div class="settings-list">
        <div class="settings-item" @click="goToPasswordChange">
          <div class="item-text">修改登录密码</div>
          <div class="item-arrow">›</div>
        </div>
        
        <div class="settings-item" @click="goToSecondaryPassword">
          <div class="item-text">修改二级密码</div>
          <div class="item-arrow">›</div>
        </div>
        
        <div class="settings-item" @click="goToGoogleAuth">
          <div class="item-text">谷歌验证</div>
          <div class="item-arrow">›</div>
        </div>
        
        <!-- 新消息提醒功能已隐藏 -->
        <!-- <div class="settings-item" @click="goToMessageAlert">
          <div class="item-text">新消息提醒</div>
          <div class="item-arrow">›</div>
        </div> -->
        
        <!-- 清空添加好友记录功能已隐藏 -->
        <!-- <div class="settings-item" @click="handleClean('addressBookBeg')">
          <div class="item-text">清空添加好友记录</div>
          <div class="item-arrow">›</div>
        </div> -->
        
        <!-- 清空聊天记录功能已隐藏 -->
        <!-- <div class="settings-item" @click="handleClean('msg')">
          <div class="item-text">清空聊天记录</div>
          <div class="item-arrow">›</div>
        </div> -->
        
        <div class="settings-item" @click="goToUserInfo">
          <div class="item-text">修改用户信息</div>
          <div class="item-arrow">›</div>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <div class="logout-section">
        <button class="logout-btn" @click="handleExit">退出登录</button>
      </div>
    </main>
  </div>
</template>
<script>
import CrossLine from "@/components/cross-line/cross-line";
import CrossItem from "@/components/cross-item/cross-item";
import { Confirm } from "vue-ydui/dist/lib.rem/dialog";
import { deleteTables } from "@/utils/indexedDB";
import { mapGetters } from "vuex";
import { setDown, send } from "@/utils/socketio";
import { clearData } from "@/utils/auth";

export default {
  components: { CrossLine, CrossItem },
  data() {
    return {};
  },
  methods: {
    goToPasswordChange() {
      this.$router.push({ name: 'passwordChange' });
    },
    goToSecondaryPassword() {
      this.$router.push({ name: 'secondaryPassword' });
    },
    goToGoogleAuth() {
      this.$router.push({ name: 'googleAuth' });
    },
    goToMessageAlert() {
      this.$router.push({ name: 'mySetAlert' });
    },
    goToUserInfo() {
      this.$router.push({ name: 'mySetUserInfo' });
    },
    go() {
    },
    handleClean(name) {
      this.$dialog.confirm({
        title: "是否清除",
        mes: "清除后不可还原",
        opts: () => {
          window.indexedDB.deleteDatabase(name);
          this.$dialog.toast({ mes: "清除成功", timeout: 1000 });
        }
      });
    },
    handleExit() {
      Confirm({
        title: "提示",
        mes: "确认退出？退出后本地记录将自动删除！",
        opts: [
          {
            txt: "取消",
            color: false,
            callback: () => {}
          },
          {
            txt: "确定",
            color: true,
            callback: () => {
              //更新在线状态
              clearInterval(window.loginConnectInterval);
              clearTimeout(window.sendTimeOut)
              clearTimeout(window.broadcastTimeOut)
              clearTimeout(window.timeOut);
              send("logoutDisconnect", {}, "logoutDisconnect");
              //监听
              clearData();
              setDown();
              deleteTables();
              setTimeout(() => {
                this.$router.push({ name: "authLogin" });
              }, 100);
            }
          }
        ]
      });
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";

.settings-container {
  min-height: 100vh;
  background: #007bff;
}

/* 主内容区域 */
.settings-content {
  padding: 20px 0;
  background: #007bff;
}

/* 设置列表 */
.settings-list {
  margin: 0 15px;
}

.settings-item {
  background: white;
  margin-bottom: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.settings-item:last-child {
  margin-bottom: 0;
}

.settings-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.item-text {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.item-arrow {
  color: #ccc;
  font-size: 18px;
  font-weight: bold;
}

/* 退出登录区域 */
.logout-section {
  margin: 30px 15px 20px;
  text-align: center;
  background: #007bff;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.logout-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

.logout-btn:active {
  transform: translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-header {
    height: 50px;
  }
  
  .settings-item {
    padding: 12px 15px;
    margin-bottom: 8px;
  }
  
  .item-text {
    font-size: 14px;
  }
  
  .logout-btn {
    padding: 10px 30px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .settings-content {
    padding: 15px 0;
    background: #007bff;
  }
  
  .settings-list {
    margin: 0 10px;
  }
  
  .settings-item {
    margin-bottom: 8px;
  }
  
  .logout-section {
    margin: 20px 10px 15px;
    background: #007bff;
  }
}
</style>