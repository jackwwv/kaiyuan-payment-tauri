<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 绑定银行卡页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="bind-card-container">
    <!-- 顶部导航栏 -->
    <header class="bind-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">绑定银行卡</div>
      <div class="close-btn" @click="goBack">
        <span class="close-icon">×</span>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="bind-content">
      <div class="form-container">
        <!-- 账号 -->
        <div class="form-group">
          <label class="form-label">账号:</label>
          <div class="form-display">{{ maskedAccount }}</div>
        </div>

        <!-- 开户行 -->
        <div class="form-group">
          <label class="form-label">开户行:</label>
          <div class="form-select" @click="showBankList">
            <span class="select-text">{{ selectedBank }}</span>
            <span class="select-arrow">▼</span>
          </div>
        </div>

        <!-- 姓名 -->
        <div class="form-group">
          <label class="form-label">姓名:</label>
          <input 
            type="text" 
            v-model="formData.name"
            class="form-input"
            placeholder="请输入姓名"
          />
        </div>

        <!-- 卡号 -->
        <div class="form-group">
          <label class="form-label">卡号:</label>
          <input 
            type="text" 
            v-model="formData.cardNumber"
            class="form-input"
            placeholder="请输入银行卡号"
            maxlength="19"
          />
        </div>

        <!-- 提交按钮 -->
        <div class="form-actions">
          <button 
            class="submit-btn" 
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            绑定
          </button>
        </div>
      </div>
    </main>

    <!-- 银行选择弹窗 -->
    <div class="bank-modal" v-if="showBankModal" @click="hideBankList">
      <div class="bank-list" @click.stop>
        <div class="bank-header">
          <span class="bank-title">选择开户行</span>
          <span class="bank-close" @click="hideBankList">×</span>
        </div>
        <div class="bank-options">
          <div 
            class="bank-option" 
            v-for="bank in bankList" 
            :key="bank"
            @click="selectBank(bank)"
          >
            {{ bank }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/socketioApi/user'

export default {
  name: 'BindCard',
  data() {
    return {
      formData: {
        name: '',
        cardNumber: ''
      },
      selectedBank: '中国工商银行',
      showBankModal: false,
      bankList: [
        '中国工商银行',
        '中国建设银行',
        '中国农业银行',
        '中国银行',
        '交通银行',
        '招商银行',
        '浦发银行',
        '民生银行',
        '兴业银行',
        '光大银行',
        '华夏银行',
        '中信银行'
      ],
      userAccount: '' // 动态获取用户账号
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
    isFormValid() {
      return this.formData.name && 
             this.formData.cardNumber && 
             this.selectedBank
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    showBankList() {
      this.showBankModal = true
    },
    hideBankList() {
      this.showBankModal = false
    },
    selectBank(bank) {
      this.selectedBank = bank
      this.hideBankList()
    },
    handleSubmit() {
      if (!this.isFormValid) {
        this.$dialog.toast({ mes: '请填写完整信息', icon: 'error' })
        return
      }

      if (this.formData.cardNumber.length < 16) {
        this.$dialog.toast({ mes: '银行卡号长度不正确', icon: 'error' })
        return
      }

      // TODO: 调用API绑定银行卡
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
    }
  },
  mounted() {
    this.loadUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.bind-card-container {
  min-height: 100vh;
  background: #f0f8ff;
}

/* 顶部导航栏 */
.bind-header {
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
.bind-content {
  padding: 30px 20px;
}

.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-input::placeholder {
  color: #999;
}

.form-display {
  padding: 12px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
}

.form-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.form-select:hover {
  border-color: #007bff;
}

.select-text {
  font-size: 16px;
  color: #333;
}

.select-arrow {
  color: #999;
  font-size: 12px;
}

.form-actions {
  margin-top: 30px;
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 银行选择弹窗 */
.bank-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.bank-list {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 60vh;
  overflow: hidden;
}

.bank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.bank-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.bank-close {
  font-size: 24px;
  color: #999;
  cursor: pointer;
}

.bank-options {
  max-height: 40vh;
  overflow-y: auto;
}

.bank-option {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.bank-option:hover {
  background: #f8f9fa;
}

.bank-option:last-child {
  border-bottom: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .bind-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon, .close-icon {
    font-size: 20px;
  }
  
  .bind-content {
    padding: 20px 15px;
  }
  
  .form-container {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-label {
    font-size: 14px;
  }
  
  .form-input, .form-display, .form-select {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
