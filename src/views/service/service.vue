<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 客服标签页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->
<template>
  <div class="service-container">
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
      <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="setActiveTab('profile')">
        <div class="nav-icon">👤</div>
        <div class="nav-text">我的</div>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 背景装饰 -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>

      <!-- 客服内容 -->
      <div class="service-content">
        <div class="content-header">
          <h2>客服中心</h2>
          <p>为您提供专业的客户服务</p>
        </div>
        
        <!-- 客服统计 -->
        <div class="service-stats">
          <div class="stat-item">
            <div class="stat-number">{{ serviceData.totalChats }}</div>
            <div class="stat-label">总对话</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ serviceData.activeChats }}</div>
            <div class="stat-label">进行中</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ serviceData.resolvedChats }}</div>
            <div class="stat-label">已解决</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ serviceData.satisfaction }}%</div>
            <div class="stat-label">满意度</div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="quick-actions">
          <h3>快速操作</h3>
          <div class="action-grid">
            <div class="action-item" @click="startNewChat">
              <div class="action-icon">💬</div>
              <div class="action-text">开始新对话</div>
            </div>
            <div class="action-item" @click="viewChatHistory">
              <div class="action-icon">📋</div>
              <div class="action-text">对话历史</div>
            </div>
            <div class="action-item" @click="viewKnowledgeBase">
              <div class="action-icon">📚</div>
              <div class="action-text">知识库</div>
            </div>
            <div class="action-item" @click="contactSupport">
              <div class="action-icon">📞</div>
              <div class="action-text">联系支持</div>
            </div>
          </div>
        </div>

        <!-- 最近对话 -->
        <div class="recent-chats">
          <h3>最近对话</h3>
          <div class="chat-list">
            <div class="chat-item" v-for="chat in recentChats" :key="chat.id">
              <div class="chat-avatar">
                <img :src="chat.avatar" :alt="chat.name" />
              </div>
              <div class="chat-info">
                <div class="chat-name">{{ chat.name }}</div>
                <div class="chat-last-message">{{ chat.lastMessage }}</div>
                <div class="chat-time">{{ chat.time }}</div>
              </div>
              <div class="chat-status" :class="chat.status">
                <span v-if="chat.status === 'online'">在线</span>
                <span v-else-if="chat.status === 'offline'">离线</span>
                <span v-else>忙碌</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";

export default {
  name: "service",
  data() {
    return {
      activeTab: 'service', // 默认选中客服
      serviceData: {
        totalChats: 0,
        activeChats: 0,
        resolvedChats: 0,
        satisfaction: 0
      },
      recentChats: []
    };
  },
  computed: {
    ...mapState(["user"])
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
        case 'profile':
          this.$router.push({ name: 'my' });
          break;
        default:
          // 保持在当前页面
          break;
      }
    },
    startNewChat() {
      Toast({ mes: '开始新对话功能开发中...', icon: 'success' });
    },
    viewChatHistory() {
      Toast({ mes: '查看对话历史功能开发中...', icon: 'success' });
    },
    viewKnowledgeBase() {
      Toast({ mes: '知识库功能开发中...', icon: 'success' });
    },
    contactSupport() {
      Toast({ mes: '联系支持功能开发中...', icon: 'success' });
    },
    init() {
      window.physicsBackRouter = null;
      this.loadServiceData();
    },
    loadServiceData() {
      // 模拟客服数据
      this.serviceData = {
        totalChats: 0,
        activeChats: 0,
        resolvedChats: 0,
        satisfaction: 0
      };
      this.recentChats = [];
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

.service-container {
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

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 60px;
  height: 60px;
  background: #28a745;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 40px;
  height: 40px;
  background: #dc3545;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: #ffc107;
  top: 60%;
  left: 5%;
  animation-delay: 2s;
}

.shape-4 {
  width: 30px;
  height: 30px;
  background: #17a2b8;
  top: 40%;
  right: 20%;
  animation-delay: 3s;
}

.shape-5 {
  width: 50px;
  height: 50px;
  background: #6f42c1;
  top: 70%;
  right: 10%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.service-content {
  position: relative;
  z-index: 2;
}

.content-header {
  text-align: center;
  margin-bottom: 30px;
  
  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
}

.service-stats {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
    border-color: #007bff;
  }
}

.action-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.action-text {
  font-size: 14px;
  color: #333;
  text-align: center;
}

.recent-chats {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 18px;
    color: #333;
    margin-bottom: 15px;
  }
}

.chat-list {
  max-height: 300px;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.chat-info {
  flex: 1;
}

.chat-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.chat-last-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}

.chat-time {
  color: #999;
  font-size: 12px;
}

.chat-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  
  &.online {
    background: #d4edda;
    color: #155724;
  }
  
  &.offline {
    background: #f8d7da;
    color: #721c24;
  }
  
  &.busy {
    background: #fff3cd;
    color: #856404;
  }
}

@media (max-width: 768px) {
  .service-stats {
    flex-direction: column;
  }
  
  .action-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-text {
    font-size: 10px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
}
</style>
