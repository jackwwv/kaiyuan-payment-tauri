<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 分成记录页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="commission-container">
    <!-- 顶部导航栏 -->
    <header class="commission-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">分成记录</div>
      <div class="close-btn" @click="goBack">
        <span class="close-icon">×</span>
      </div>
    </header>

    <!-- 分成记录列表 -->
    <div class="commission-list-section">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell">时间</div>
        <div class="header-cell">支付方式</div>
        <div class="header-cell">订单金额</div>
        <div class="header-cell">收益率</div>
        <div class="header-cell">分成</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div class="table-row" v-for="(record, index) in commissionRecords" :key="index">
          <div class="table-cell">{{ record.time }}</div>
          <div class="table-cell">{{ record.paymentMethod }}</div>
          <div class="table-cell">¥{{ record.orderAmount }}</div>
          <div class="table-cell">{{ record.yieldRate }}%</div>
          <div class="table-cell">¥{{ record.commission }}</div>
        </div>

        <!-- 无数据提示 -->
        <div class="no-data" v-if="commissionRecords.length === 0">
          没有更多了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommissionRecord',
  data() {
    return {
      commissionRecords: [
        // 示例数据
        // {
        //   time: '2024-01-01 10:30',
        //   paymentMethod: '微信支付',
        //   orderAmount: '1000.00',
        //   yieldRate: '15.5',
        //   commission: '155.00'
        // },
        // {
        //   time: '2024-01-02 14:20',
        //   paymentMethod: '支付宝',
        //   orderAmount: '500.00',
        //   yieldRate: '12.3',
        //   commission: '61.50'
        // },
        // {
        //   time: '2024-01-03 09:15',
        //   paymentMethod: '银行卡',
        //   orderAmount: '2000.00',
        //   yieldRate: '18.0',
        //   commission: '360.00'
        // },
        // {
        //   time: '2024-01-04 16:45',
        //   paymentMethod: '微信支付',
        //   orderAmount: '800.00',
        //   yieldRate: '10.0',
        //   commission: '80.00'
        // },
        // {
        //   time: '2024-01-05 11:30',
        //   paymentMethod: '支付宝',
        //   orderAmount: '1500.00',
        //   yieldRate: '14.2',
        //   commission: '213.00'
        // }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    loadMoreRecords() {
      // TODO: 调用API加载更多分成记录
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    }
  },
  mounted() {
    // 模拟加载数据
    this.loadMoreRecords()
  }
}
</script>

<style lang="scss" scoped>
.commission-container {
  min-height: 100vh;
  background: white;
}

/* 顶部导航栏 */
.commission-header {
  background: #007bff;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn, .close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.back-btn:hover, .close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.back-icon, .close-icon {
  color: white;
  font-size: 24px;
  font-weight: bold;
}

.header-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

/* 分成记录列表区域 */
.commission-list-section {
  background: white;
  margin: 0;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.header-cell {
  flex: 1;
  padding: 15px 10px;
  font-size: 14px;
  color: #666;
  font-weight: 600;
  text-align: center;
  border-right: 1px solid #e9ecef;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  min-height: 400px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  padding: 15px 10px;
  font-size: 14px;
  color: #333;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-cell:last-child {
  border-right: none;
}

/* 金额样式 */
.table-cell:nth-child(3),
.table-cell:nth-child(5) {
  color: #28a745;
  font-weight: 600;
}

/* 收益率样式 */
.table-cell:nth-child(4) {
  color: #007bff;
  font-weight: 600;
}

.no-data {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .commission-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon, .close-icon {
    font-size: 20px;
  }
  
  .table-header, .table-row {
    flex-direction: column;
  }
  
  .header-cell, .table-cell {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px;
  }
  
  .header-cell:last-child, .table-cell:last-child {
    border-bottom: none;
  }
  
  .no-data {
    padding: 40px 20px;
  }
}

@media (max-width: 480px) {
  .commission-header {
    padding: 0 10px;
  }
  
  .header-cell, .table-cell {
    padding: 8px;
    font-size: 12px;
  }
  
  .no-data {
    padding: 30px 15px;
    font-size: 12px;
  }
}

/* 表格列宽优化 */
@media (min-width: 769px) {
  .header-cell:nth-child(1),
  .table-cell:nth-child(1) {
    flex: 1.2; /* 时间列稍宽 */
  }
  
  .header-cell:nth-child(2),
  .table-cell:nth-child(2) {
    flex: 1.1; /* 支付方式列稍宽 */
  }
  
  .header-cell:nth-child(3),
  .table-cell:nth-child(3) {
    flex: 1; /* 订单金额列 */
  }
  
  .header-cell:nth-child(4),
  .table-cell:nth-child(4) {
    flex: 0.8; /* 收益率列稍窄 */
  }
  
  .header-cell:nth-child(5),
  .table-cell:nth-child(5) {
    flex: 1; /* 分成列 */
  }
}
</style>
