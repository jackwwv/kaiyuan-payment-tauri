<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 代付仪表板页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->
<template>
  <div class="dashboard-container">
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
      <!-- 背景装饰 -->
      <div class="background-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
        <div class="shape shape-5"></div>
      </div>

      <!-- 中央派单按钮 -->
      <div class="dispatch-section">
        <button class="dispatch-btn" @click="handleDispatch">
          立即派单
        </button>
        <div class="session-info">
          每隔60分钟会自动下线
        </div>
      </div>

      <!-- 数据展示区域 -->
      <div class="data-section">
        <!-- 顶部余额信息 -->
        <div class="balance-info">
          <span class="balance-item">接单余额: 0元</span>
          <span class="balance-item">接单冻结: 0元</span>
        </div>
        
        <!-- 数据指标网格 -->
        <div class="metrics-grid">
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.totalOrders }}</div>
            <div class="metric-label">总单数</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.completedOrders }}</div>
            <div class="metric-label">完成单数</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.successRate }}%</div>
            <div class="metric-label">成功率</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.totalAmount }}</div>
            <div class="metric-label">总金额</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.completedAmount }}</div>
            <div class="metric-label">完成金额</div>
          </div>
          <div class="metric-item">
            <div class="metric-value">{{ dashboardData.withdraw }}</div>
            <div class="metric-label">提现</div>
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
  name: "dashboard",
  data() {
    return {
      activeTab: 'pay', // 默认选中代付
      dashboardData: {
        totalOrders: 0,
        completedOrders: 0,
        successRate: 0,
        totalAmount: 0,
        completedAmount: 0,
        withdraw: 0
      }
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
        case 'service':
          this.$router.push({ name: 'home', query: { from: 'service' } }); // 客服链接到消息页面
          break;
        // 通讯录功能已隐藏
        // case 'contacts':
        //   this.$router.push({ name: 'addressBook' }); // 通讯录
        //   break;
        case 'profile':
          this.$router.push({ name: 'my' });
          break;
        default:
          // 保持在当前页面
          break;
      }
    },
    handleDispatch() {
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' });
    },
    init() {
      window.physicsBackRouter = null;
      this.loadDashboardData();
    },
    loadDashboardData() {
      // 这里可以从API加载真实的仪表板数据
      // 目前使用模拟数据
      this.dashboardData = {
        totalOrders: 0,
        completedOrders: 0,
        successRate: 0,
        totalAmount: 0,
        completedAmount: 0,
        withdraw: 0
      };
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

.dashboard-container {
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

.dispatch-section {
  text-align: center;
  margin-top: 45px;
  margin-bottom: 40px;
  position: relative;
  z-index: 2;
}

.dispatch-btn {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  margin-bottom: 15px;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 35px rgba(0, 123, 255, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.session-info {
  font-size: 14px;
  color: #666;
  margin-top: 10px;
}

.data-section {
  position: relative;
  z-index: 2;
}

.balance-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 0 10px;
}

.balance-item {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.metric-item {
  text-align: center;
  padding: 20px 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #007bff;
  margin-bottom: 8px;
  line-height: 1;
}

.metric-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}


@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .dispatch-section {
    margin-top: 25px;
  }
  
  .dispatch-btn {
    width: 150px;
    height: 150px;
    font-size: 16px;
  }
  
  .nav-text {
    font-size: 10px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .balance-info {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .metric-item {
    padding: 15px 8px;
  }
  
  .metric-value {
    font-size: 28px;
  }
  
  .metric-label {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .metric-value {
    font-size: 24px;
  }
}
</style>
