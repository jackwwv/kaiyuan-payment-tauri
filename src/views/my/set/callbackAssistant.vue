<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 回调助手页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="callback-assistant-container">
    <!-- 顶部导航栏 -->
    <header class="callback-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">回调助手</div>
      <div class="placeholder-btn"></div>
    </header>

    <!-- 主内容区域 -->
    <main class="callback-content">
      <!-- 账号和密钥信息 -->
      <div class="account-info-section">
        <div class="info-item">
          <span class="info-label">我的账号:</span>
          <span class="info-value">{{ userAccount }}</span>
        </div>
        
        <div class="info-item">
          <span class="info-label">回调地址:</span>
          <div class="info-value-with-action">
            <span class="info-value callback-url">{{ callbackUrl }}</span>
            <button class="copy-btn" @click="copyCallbackUrl">复制</button>
          </div>
        </div>
        
        <div class="info-item">
          <span class="info-label">签名密钥:</span>
          <div class="info-value-with-action">
            <span class="info-value signature-key">{{ signatureKey }}</span>
            <button class="copy-btn" @click="copySignatureKey">复制</button>
          </div>
        </div>
      </div>

      <!-- 密钥更新区域 -->
      <div class="key-update-section">
        <div class="password-input-group">
          <label class="password-label">二级密码:</label>
          <input 
            type="password" 
            v-model="secondaryPassword"
            class="password-input"
            placeholder="请输入二级密码"
          />
        </div>
        
        <button class="update-key-btn" @click="updateKey">
          更新密钥
        </button>
        
        <div class="warning-message">
          注意:请妥善保管您的密钥,切勿转发或泄漏给其他人,若别人已知道密钥,请及时更新!
        </div>
      </div>

      <!-- 自动回调控制区域 -->
      <div class="callback-control-section">
        <div class="callback-circle">
          <div class="callback-status">自动回调</div>
          <button 
            class="toggle-btn" 
            :class="{ 'active': isAutoCallbackEnabled }"
            @click="toggleAutoCallback"
          >
            {{ isAutoCallbackEnabled ? '点击关闭' : '点击开启' }}
          </button>
        </div>
      </div>
    </main>

    <!-- 底部状态栏 -->
    <footer class="callback-footer">
      <div class="status-text">
        {{ isAutoCallbackEnabled ? '自动回调已开启' : '自动回调已关闭' }}
      </div>
      <div class="footer-icons">
        <span class="footer-icon">📁</span>
        <span class="footer-icon">📄</span>
        <span class="footer-icon">⚙️</span>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/socketioApi/user'

export default {
  name: 'CallbackAssistant',
  data() {
    return {
      userAccount: '',
      callbackUrl: 'https://f.ou-bao.xyz/?c=Notify&mid=3964',
      signatureKey: '5e18df76bca646561430b33e48918286f7655820',
      secondaryPassword: '',
      isAutoCallbackEnabled: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    copyCallbackUrl() {
      this.copyToClipboard(this.callbackUrl, '回调地址')
    },
    copySignatureKey() {
      this.copyToClipboard(this.signatureKey, '签名密钥')
    },
    copyToClipboard(text, type) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.$dialog.toast({ mes: `${type}已复制到剪贴板`, icon: 'success' })
        }).catch(() => {
          this.fallbackCopy(text, type)
        })
      } else {
        this.fallbackCopy(text, type)
      }
    },
    fallbackCopy(text, type) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        this.$dialog.toast({ mes: `${type}已复制到剪贴板`, icon: 'success' })
      } catch (err) {
        this.$dialog.toast({ mes: '复制失败', icon: 'error' })
      }
      document.body.removeChild(textArea)
    },
    updateKey() {
      if (!this.secondaryPassword) {
        this.$dialog.toast({ mes: '请输入二级密码', icon: 'error' })
        return
      }
      
      // TODO: 调用API更新密钥
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    toggleAutoCallback() {
      // TODO: 调用API切换自动回调状态
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    async loadUserInfo() {
      try {
        const res = await userInfo()
        if (res && res.data) {
          this.userAccount = res.data.email || res.data.nickName || '未知账号'
          // 更新回调地址中的用户ID
          if (res.data.id) {
            this.callbackUrl = `https://f.ou-bao.xyz/?c=Notify&mid=${res.data.id}`
          }
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
.callback-assistant-container {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.callback-header {
  background: #007bff;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.placeholder-btn {
  width: 40px;
  height: 40px;
}

.back-icon {
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
.callback-content {
  flex: 1;
  padding: 20px;
}

/* 账号信息区域 */
.account-info-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  min-width: 80px;
}

.info-value {
  font-size: 14px;
  color: #666;
  flex: 1;
  word-break: break-all;
}

.info-value-with-action {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
}

.callback-url, .signature-key {
  flex: 1;
  font-family: monospace;
  font-size: 12px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.copy-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
}

.copy-btn:hover {
  background: #0056b3;
}

/* 密钥更新区域 */
.key-update-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.password-input-group {
  margin-bottom: 15px;
}

.password-label {
  display: block;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;
}

.password-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: #007bff;
}

.update-key-btn {
  width: 100%;
  background: #007bff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-bottom: 15px;
}

.update-key-btn:hover {
  background: #0056b3;
}

.warning-message {
  color: #dc3545;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
}

/* 自动回调控制区域 */
.callback-control-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.callback-circle {
  width: 200px;
  height: 200px;
  border: 3px solid #87ceeb;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
}

.callback-status {
  font-size: 18px;
  color: #333;
  font-weight: 600;
  margin-bottom: 10px;
}

.toggle-btn {
  background: #87ceeb;
  color: white;
  border: 2px solid white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: #6bb6d6;
}

.toggle-btn.active {
  background: #28a745;
}

.toggle-btn.active:hover {
  background: #218838;
}

/* 底部状态栏 */
.callback-footer {
  background: #f8f9fa;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-top: 1px solid #e9ecef;
}

.status-text {
  font-size: 14px;
  color: #666;
}

.footer-icons {
  display: flex;
  gap: 10px;
}

.footer-icon {
  font-size: 16px;
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease;
}

.footer-icon:hover {
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .callback-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
    margin-left: 15px;
  }
  
  .back-icon {
    font-size: 20px;
  }
  
  .callback-content {
    padding: 15px;
  }
  
  .account-info-section,
  .key-update-section {
    padding: 15px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .info-label {
    min-width: auto;
  }
  
  .info-value-with-action {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .copy-btn {
    align-self: flex-end;
  }
  
  .callback-circle {
    width: 160px;
    height: 160px;
  }
  
  .callback-status {
    font-size: 16px;
  }
  
  .toggle-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
  
  .callback-footer {
    height: 45px;
    padding: 0 15px;
  }
  
  .status-text {
    font-size: 12px;
  }
  
  .footer-icons {
    gap: 8px;
  }
  
  .footer-icon {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .callback-content {
    padding: 10px;
  }
  
  .account-info-section,
  .key-update-section {
    padding: 12px;
  }
  
  .callback-url, .signature-key {
    font-size: 10px;
    padding: 6px;
  }
  
  .callback-circle {
    width: 140px;
    height: 140px;
  }
  
  .callback-status {
    font-size: 14px;
  }
  
  .toggle-btn {
    font-size: 11px;
    padding: 5px 10px;
  }
  
  .warning-message {
    font-size: 11px;
  }
}
</style>
