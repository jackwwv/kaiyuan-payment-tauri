<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 订单标签页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->
<template>
  <div class="order-container">
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
      <!-- 搜索筛选区域 -->
      <div class="search-filter-section">
        <!-- 第一行：支付状态和关键词搜索 -->
        <div class="search-row">
          <div class="payment-status-selector">
            <div class="selector-wrapper" @click="togglePaymentStatusDropdown">
              <span class="selector-text">{{ selectedPaymentStatus }}</span>
              <span class="selector-arrow" :class="{ 'open': showPaymentStatusDropdown }">▼</span>
            </div>
            
            <!-- 支付状态下拉菜单 -->
            <div class="dropdown-menu" v-show="showPaymentStatusDropdown">
              <div 
                class="dropdown-item" 
                v-for="status in paymentStatuses" 
                :key="status.value"
                :class="{ 'selected': selectedPaymentStatus === status.label }"
                @click="selectPaymentStatus(status)"
              >
                {{ status.label }}
              </div>
            </div>
          </div>
          
          <div class="keyword-search">
            <div class="search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                v-model="searchKeyword"
                class="search-input"
                placeholder="请输入关键"
              />
            </div>
          </div>
          
          <button class="search-btn" @click="handleSearch">
            搜索
          </button>
        </div>
        
        <!-- 第二行：日期范围和下线开关 -->
        <div class="filter-row">
          <div class="date-range">
            <input 
              type="date" 
              v-model="startDate"
              class="date-input"
            />
            <span class="date-separator">-</span>
            <input 
              type="date" 
              v-model="endDate"
              class="date-input"
            />
          </div>
          
          <div class="offline-toggle">
            <label class="toggle-label">下线</label>
            <div class="toggle-switch" :class="{ 'active': isOffline }" @click="toggleOffline">
              <div class="toggle-slider"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单列表区域 -->
      <div class="order-list-section">
        <div class="order-list">
          <div class="order-item" v-for="order in orderList" :key="order.id">
            <div class="order-header">
              <span class="order-id">订单号: {{ order.id }}</span>
              <span class="order-status" :class="order.status">{{ order.statusText }}</span>
            </div>
            <div class="order-details">
              <div class="order-info">
                <p>金额: ¥{{ order.amount }}</p>
                <p>时间: {{ order.createTime }}</p>
                <p>客户: {{ order.customer }}</p>
              </div>
              <div class="order-actions">
                <button class="action-btn" @click="viewOrder(order)">查看</button>
                <button class="action-btn primary" @click="processOrder(order)" v-if="order.status === 'pending'">处理</button>
              </div>
            </div>
          </div>
          
          <!-- 无数据提示 -->
          <div class="no-orders" v-if="orderList.length === 0">
            <div class="no-orders-text">没有更多了</div>
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
  name: "order",
  data() {
    return {
      activeTab: 'order', // 默认选中订单
      showPaymentStatusDropdown: false,
      selectedPaymentStatus: '支付状态',
      paymentStatuses: [
        { value: 'all', label: '全部状态' },
        { value: 'pending', label: '待支付' },
        { value: 'paid', label: '已支付' },
        { value: 'processing', label: '处理中' },
        { value: 'completed', label: '已完成' },
        { value: 'cancelled', label: '已取消' },
        { value: 'failed', label: '支付失败' }
      ],
      searchKeyword: '',
      startDate: '',
      endDate: '',
      isOffline: false,
      orderList: [
        // 示例数据
        // {
        //   id: 'ORD001',
        //   status: 'pending',
        //   statusText: '待支付',
        //   amount: '100.00',
        //   createTime: '2024-01-01 10:30',
        //   customer: '张三'
        // }
      ]
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
          // 保持在当前页面
          break;
      }
    },
    togglePaymentStatusDropdown() {
      this.showPaymentStatusDropdown = !this.showPaymentStatusDropdown;
    },
    selectPaymentStatus(status) {
      this.selectedPaymentStatus = status.label;
      this.showPaymentStatusDropdown = false;
      // TODO: 根据选择的支付状态筛选订单
      this.filterOrdersByStatus(status.value);
    },
    filterOrdersByStatus(status) {
      // TODO: 实现按支付状态筛选订单
      console.log('筛选支付状态:', status);
    },
    handleSearch() {
      if (!this.searchKeyword.trim()) {
        this.$dialog.toast({ mes: '请输入搜索关键词', icon: 'error' });
        return;
      }
      
      // TODO: 调用API搜索订单
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' });
    },
    toggleOffline() {
      this.isOffline = !this.isOffline;
      // TODO: 根据下线状态筛选订单
      this.filterOrdersByOffline(this.isOffline);
    },
    filterOrdersByOffline(isOffline) {
      // TODO: 实现按下线状态筛选订单
      console.log('筛选下线状态:', isOffline);
    },
    viewOrder(order) {
      // TODO: 查看订单详情
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' });
    },
    processOrder(order) {
      // TODO: 处理订单
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' });
    },
    init() {
      window.physicsBackRouter = null;
      this.loadOrderData();
    },
    loadOrderData() {
      // TODO: 加载订单数据
      this.orderList = [];
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

.order-container {
  min-height: 100vh;
  background: white;
}

/* 顶部导航栏 */
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

/* 主内容区域 */
.main-content {
  padding-top: 80px;
  padding: 80px 0 20px;
  position: relative;
}

/* 搜索筛选区域 */
.search-filter-section {
  background: white;
  padding: 20px;
  margin: 25px 20px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.payment-status-selector {
  position: relative;
  min-width: 120px;
}

.selector-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.selector-wrapper:hover {
  border-color: #007bff;
}

.selector-text {
  font-size: 14px;
  color: #333;
}

.selector-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
  
  &.open {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 10px 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.selected {
    background: #007bff;
    color: white;
  }
}

.keyword-search {
  flex: 1;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  font-size: 16px;
  color: #666;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: #0056b3;
}

.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-input {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #007bff;
}

.date-separator {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.offline-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &.active {
    background: #007bff;
  }
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
}

.toggle-switch.active .toggle-slider {
  transform: translateX(26px);
}

/* 订单列表区域 */
.order-list-section {
  margin: 0 20px;
}

.order-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.order-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 15px 0;
  
  &:last-child {
    border-bottom: none;
  }
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.order-id {
  font-weight: 600;
  color: #333;
}

.order-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  
  &.pending {
    background: #fff3cd;
    color: #856404;
  }
  
  &.completed {
    background: #d4edda;
    color: #155724;
  }
  
  &.cancelled {
    background: #f8d7da;
    color: #721c24;
  }
}

.order-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-info {
  flex: 1;
  
  p {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
  }
}

.order-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.primary {
    background: #007bff;
    color: white;
    border-color: #007bff;
    
    &:hover {
      background: #0056b3;
    }
  }
}

/* 无数据提示 */
.no-orders {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-orders-text {
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 80px 0 15px;
  }
  
  .search-filter-section {
    margin: 25px 15px 15px;
    padding: 15px;
  }
  
  .search-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .payment-status-selector {
    min-width: auto;
  }
  
  .filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .date-range {
    justify-content: center;
  }
  
  .offline-toggle {
    justify-content: center;
  }
  
  .order-list-section {
    margin: 0 15px;
  }
  
  .nav-text {
    font-size: 10px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 80px 0 10px;
  }
  
  .search-filter-section {
    margin: 15px 10px 10px;
    padding: 12px;
  }
  
  .order-list-section {
    margin: 0 10px;
  }
  
  .order-list {
    padding: 15px;
  }
  
  .order-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .order-details {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .order-actions {
    justify-content: center;
  }
}
</style>
