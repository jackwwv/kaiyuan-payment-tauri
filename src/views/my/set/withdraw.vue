<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 提现页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="withdraw-container">
    <!-- 顶部导航栏 -->
    <header class="withdraw-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">提现</div>
      <div class="close-btn" @click="goBack">
        <span class="close-icon">×</span>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="withdraw-content">
      <!-- 账号和余额信息 -->
      <div class="balance-section">
        <div class="balance-item">
          <span class="balance-label">账号:</span>
          <span class="balance-value">{{ maskedAccount }}</span>
        </div>
        
        <div class="balance-item">
          <span class="balance-label">可提余额:</span>
          <span class="balance-amount">¥{{ withdrawableBalance }}</span>
          <button class="transfer-btn" @click="transferToOrder">可提⇌接单</button>
        </div>
        
        <div class="balance-item">
          <span class="balance-label">接单余额:</span>
          <span class="balance-amount">¥{{ orderBalance }}</span>
          <button class="transfer-btn" @click="transferToWithdraw">接单⇌可提</button>
        </div>
        
        <div class="balance-item">
          <span class="balance-label">接单冻结:</span>
          <span class="balance-amount">¥{{ frozenBalance }}</span>
        </div>
      </div>

      <!-- 收款账号信息 -->
      <div class="account-section">
        <div class="account-info">
          <span class="account-label">收款账号:</span>
          <span class="account-details">{{ bankInfo }}</span>
          <button class="modify-btn" @click="modifyAccount">修改</button>
        </div>
      </div>

      <!-- 提现金额输入 -->
      <div class="amount-section">
        <div class="amount-input-group">
          <label class="amount-label">提现额度:</label>
          <div class="amount-input-wrapper">
            <span class="currency-symbol">¥</span>
            <input 
              type="number" 
              v-model="withdrawAmount"
              class="amount-input"
              placeholder="请输入提现金额"
              @input="formatAmount"
            />
          </div>
        </div>
        
        <button 
          class="withdraw-btn" 
          @click="handleWithdraw"
          :disabled="!isValidAmount"
        >
          提现
        </button>
      </div>

      <!-- 提现规则 -->
      <div class="rules-section">
        <div class="rule-item">
          <span class="rule-label">单笔提现:</span>
          <span class="rule-value">¥100 ~ ¥50000</span>
        </div>
        
        <div class="rule-item">
          <span class="rule-label">可提现时间:</span>
          <span class="rule-value">周一至周日 00:00 - 23:59</span>
        </div>
        
        <div class="rule-item">
          <span class="rule-label">手续费:</span>
          <span class="rule-value">提现金额 × 0.00 + 2</span>
        </div>
        
        <div class="rule-note">
          注意: 直接提现需要扣除手续费,系统派单收款不收取手续费
        </div>
      </div>

      <!-- 提现明细 -->
      <div class="details-section">
        <div class="details-header">
          <span class="details-title">提现明细</span>
        </div>
        
        <div class="details-table">
          <div class="table-header">
            <div class="header-cell">时间</div>
            <div class="header-cell">金额</div>
            <div class="header-cell">实到</div>
            <div class="header-cell">状态</div>
          </div>
          
          <div class="table-body">
            <div class="table-row" v-for="(record, index) in withdrawRecords" :key="index">
              <div class="table-cell">{{ record.time }}</div>
              <div class="table-cell">¥{{ record.amount }}</div>
              <div class="table-cell">¥{{ record.actual }}</div>
              <div class="table-cell" :class="getStatusClass(record.status)">
                {{ record.status }}
              </div>
            </div>
            
            <div class="no-more" v-if="withdrawRecords.length === 0">
              没有更多了
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/socketioApi/user'

export default {
  name: 'Withdraw',
  data() {
    return {
      withdrawAmount: '',
      userAccount: '',
      withdrawableBalance: 0,
      orderBalance: 0,
      frozenBalance: 0,
      bankInfo: '',
      withdrawRecords: [
       
      ]
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    maskedAccount() {
      if (this.userAccount && this.userAccount.length > 4) {
        return this.userAccount.substring(0, 3) + '***' + this.userAccount.substring(this.userAccount.length - 4)
      }
      return this.userAccount
    },
    isValidAmount() {
      const amount = parseFloat(this.withdrawAmount)
      return amount >= 100 && amount <= 50000 && amount <= this.withdrawableBalance
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    transferToOrder() {
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    transferToWithdraw() {
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    modifyAccount() {
      this.$router.push({ name: 'bindCard' })
    },
    formatAmount() {
      // 格式化金额输入
      this.withdrawAmount = this.withdrawAmount.replace(/[^\d.]/g, '')
    },
    handleWithdraw() {
      if (!this.isValidAmount) {
        this.$dialog.toast({ mes: '请输入有效的提现金额', icon: 'error' })
        return
      }

      const amount = parseFloat(this.withdrawAmount)
      if (amount < 100) {
        this.$dialog.toast({ mes: '提现金额不能少于100元', icon: 'error' })
        return
      }

      if (amount > 50000) {
        this.$dialog.toast({ mes: '提现金额不能超过50000元', icon: 'error' })
        return
      }

      if (amount > this.withdrawableBalance) {
        this.$dialog.toast({ mes: '提现金额不能超过可提余额', icon: 'error' })
        return
      }

      // TODO: 调用API提现
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    async loadUserInfo() {
      try {
        const res = await userInfo()
        if (res && res.data) {
          this.userAccount = res.data.email || res.data.nickName || '未知账号'
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果API调用失败，尝试从store获取
        if (this.userInfo && this.userInfo.email) {
          this.userAccount = this.userInfo.email
        } else if (this.userInfo && this.userInfo.nickName) {
          this.userAccount = this.userInfo.nickName
        } else {
          this.userAccount = '未知账号'
        }
      }
    },
    getStatusClass(status) {
      switch(status) {
        case '已完成': return 'status-success'
        case '处理中': return 'status-processing'
        case '失败': return 'status-failed'
        default: return ''
      }
    }
  },
  mounted() {
    this.loadUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.withdraw-container {
  min-height: 100vh;
  background: white;
}

/* 顶部导航栏 */
.withdraw-header {
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

/* 主内容区域 */
.withdraw-content {
  padding: 20px;
}

/* 余额信息区域 */
.balance-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.balance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.balance-item:last-child {
  margin-bottom: 0;
}

.balance-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.balance-value, .balance-amount {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.transfer-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.transfer-btn:hover {
  background: #0056b3;
}

/* 收款账号区域 */
.account-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.account-label {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.account-details {
  font-size: 16px;
  color: #333;
  flex: 1;
  margin: 0 15px;
}

.modify-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modify-btn:hover {
  background: #0056b3;
}

/* 提现金额区域 */
.amount-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.amount-input-group {
  margin-bottom: 20px;
}

.amount-label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 500;
}

.amount-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 0 15px;
  transition: border-color 0.3s ease;
}

.amount-input-wrapper:focus-within {
  border-color: #007bff;
}

.currency-symbol {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-right: 10px;
}

.amount-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 15px 0;
  font-size: 18px;
  color: #333;
}

.amount-input::placeholder {
  color: #999;
}

.withdraw-btn {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.withdraw-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.withdraw-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 提现规则区域 */
.rules-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.rule-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rule-item:last-child {
  margin-bottom: 0;
}

.rule-label {
  font-size: 14px;
  color: #dc3545;
  font-weight: 500;
}

.rule-value {
  font-size: 14px;
  color: #dc3545;
  font-weight: 600;
}

.rule-note {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #dc3545;
  line-height: 1.5;
}

/* 提现明细区域 */
.details-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-header {
  margin-bottom: 15px;
}

.details-title {
  font-size: 16px;
  color: #333;
  font-weight: 600;
}

.details-table {
  border-top: 1px solid #f0f0f0;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  border-radius: 4px 4px 0 0;
}

.header-cell {
  flex: 1;
  padding: 12px 8px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-align: center;
}

.table-body {
  border: 1px solid #f0f0f0;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  flex: 1;
  padding: 12px 8px;
  font-size: 14px;
  color: #333;
  text-align: center;
}

.status-success {
  color: #28a745;
}

.status-processing {
  color: #ffc107;
}

.status-failed {
  color: #dc3545;
}

.no-more {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .withdraw-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon, .close-icon {
    font-size: 20px;
  }
  
  .withdraw-content {
    padding: 15px;
  }
  
  .balance-section, .account-section, .amount-section, .rules-section, .details-section {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  .balance-item, .account-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .transfer-btn, .modify-btn {
    align-self: flex-end;
  }
  
  .amount-input {
    font-size: 16px;
  }
  
  .table-header, .table-row {
    flex-direction: column;
  }
  
  .header-cell, .table-cell {
    padding: 8px;
    text-align: left;
  }
}
</style>
