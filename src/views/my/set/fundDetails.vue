<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 资金变动明细页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="fund-details-container">
    <!-- 顶部导航栏 -->
    <header class="fund-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">资金变动明细</div>
      <div class="close-btn" @click="goBack">
        <span class="close-icon">×</span>
      </div>
    </header>

    <!-- 筛选和导出区域 -->
    <div class="filter-section">
      <div class="filter-controls">
        <!-- 日期选择 -->
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

        <!-- 类型选择 -->
        <div class="type-selector">
          <select v-model="selectedType" class="type-select">
            <option value="">全部类型</option>
            <option value="backend_recharge">后台充值余额</option>
            <option value="frontend_recharge">前台充值余额</option>
            <option value="recharge_frozen">充值冻结</option>
            <option value="recharge_order">充值接单余额</option>
            <option value="recharge_receivable">充值应回款</option>
            <option value="balance_transfer">接单可提余额互转</option>
            <option value="merchant_commission">码商订单分成</option>
            <option value="night_reward">夜间接单奖励</option>
            <option value="register_gift">注册赠送余额</option>
            <option value="withdrawal_refund">提现退还</option>
            <option value="order_frozen">接单冻结</option>
            <option value="deduct_frozen">扣除冻结</option>
            <option value="frozen_refund">冻结退还</option>
            <option value="replenish_deduction">补单扣除</option>
            <option value="order_receivable">订单回款</option>
            <option value="accumulated_receivable">订单累计应回款</option>
            <option value="merchant_deduction">码商应回款扣除</option>
            <option value="merchant_refund">码商应回款退还</option>
            <option value="audit_increase">审核增加应回款</option>
          </select>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="query-btn" @click="handleQuery">查询</button>
          <button class="export-btn" @click="handleExport">导出</button>
        </div>
      </div>
    </div>

    <!-- 资金明细列表 -->
    <div class="fund-list-section">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell">时间</div>
        <div class="header-cell">类型</div>
        <div class="header-cell">原余额</div>
        <div class="header-cell">金额</div>
        <div class="header-cell">备注</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div class="table-row" v-for="(record, index) in fundRecords" :key="index">
          <div class="table-cell">{{ record.time }}</div>
          <div class="table-cell">{{ record.type }}</div>
          <div class="table-cell">¥{{ record.originalBalance }}</div>
          <div class="table-cell" :class="getAmountClass(record.amount)">
            {{ record.amount > 0 ? '+' : '' }}¥{{ record.amount }}
          </div>
          <div class="table-cell">{{ record.remarks }}</div>
        </div>

        <!-- 无数据提示 -->
        <div class="no-data" v-if="fundRecords.length === 0">
          没有
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FundDetails',
  data() {
    return {
      startDate: '',
      endDate: '',
      selectedType: '',
      fundRecords: [
        // 示例数据
        // {
        //   time: '2024-01-01 10:30',
        //   type: '后台充值余额',
        //   originalBalance: '1000.00',
        //   amount: 500.00,
        //   remarks: '管理员充值'
        // },
        // {
        //   time: '2024-01-02 14:20',
        //   type: '订单回款',
        //   originalBalance: '1500.00',
        //   amount: 200.00,
        //   remarks: '订单完成回款'
        // },
        // {
        //   time: '2024-01-03 09:15',
        //   type: '提现退还',
        //   originalBalance: '1700.00',
        //   amount: -100.00,
        //   remarks: '提现失败退还'
        // },
        // {
        //   time: '2024-01-04 16:45',
        //   type: '码商订单分成',
        //   originalBalance: '1600.00',
        //   amount: 150.00,
        //   remarks: '订单分成收入'
        // },
        // {
        //   time: '2024-01-05 11:30',
        //   type: '接单冻结',
        //   originalBalance: '1750.00',
        //   amount: -300.00,
        //   remarks: '接单冻结资金'
        // }
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleQuery() {
      if (!this.startDate || !this.endDate) {
        this.$dialog.toast({ mes: '请选择开始和结束日期', icon: 'error' })
        return
      }

      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.$dialog.toast({ mes: '开始日期不能大于结束日期', icon: 'error' })
        return
      }

      // TODO: 调用API查询资金明细
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    handleExport() {
      if (!this.startDate || !this.endDate) {
        this.$dialog.toast({ mes: '请选择开始和结束日期', icon: 'error' })
        return
      }

      // TODO: 调用API导出资金明细
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    getAmountClass(amount) {
      if (amount > 0) {
        return 'amount-positive'
      } else if (amount < 0) {
        return 'amount-negative'
      }
      return ''
    }
  },
  mounted() {
    // 设置默认日期为最近30天
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    this.endDate = today.toISOString().split('T')[0]
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0]
  }
}
</script>

<style lang="scss" scoped>
.fund-details-container {
  min-height: 100vh;
  background: white;
}

/* 顶部导航栏 */
.fund-header {
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

/* 筛选区域 */
.filter-section {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
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

.type-selector {
  flex: 1;
  min-width: 200px;
}

.type-select {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.type-select:focus {
  outline: none;
  border-color: #007bff;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.query-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.query-btn:hover {
  background: #0056b3;
}

.export-btn {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.export-btn:hover {
  background: #e55a2b;
}

/* 资金明细列表区域 */
.fund-list-section {
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
.table-cell:nth-child(4) {
  color: #333;
  font-weight: 600;
}

.amount-positive {
  color: #28a745 !important;
}

.amount-negative {
  color: #dc3545 !important;
}

.no-data {
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .fund-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon, .close-icon {
    font-size: 20px;
  }
  
  .filter-section {
    padding: 15px;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .date-range {
    justify-content: center;
  }
  
  .type-selector {
    min-width: auto;
  }
  
  .action-buttons {
    justify-content: center;
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
  .fund-header {
    padding: 0 10px;
  }
  
  .filter-section {
    padding: 10px;
  }
  
  .date-range {
    flex-direction: column;
    gap: 5px;
  }
  
  .date-separator {
    display: none;
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
    flex: 1.5; /* 类型列较宽 */
  }
  
  .header-cell:nth-child(3),
  .table-cell:nth-child(3) {
    flex: 1; /* 原余额列 */
  }
  
  .header-cell:nth-child(4),
  .table-cell:nth-child(4) {
    flex: 1; /* 金额列 */
  }
  
  .header-cell:nth-child(5),
  .table-cell:nth-child(5) {
    flex: 1.3; /* 备注列稍宽 */
  }
}
</style>
