<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 谷歌验证页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="google-auth-container">
    <!-- 顶部导航栏 -->
    <header class="auth-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">谷歌验证</div>
    </header>

    <!-- 主内容区域 -->
    <main class="auth-content">
      <div class="auth-container">
        <!-- 谷歌验证状态 -->
        <div class="auth-status">
          <div class="status-icon">
            <span class="icon">🔐</span>
          </div>
          <div class="status-text">
            <h3>谷歌验证器</h3>
            <p>为您的账户添加额外的安全保护</p>
          </div>
        </div>

        <!-- 验证码输入 -->
        <div class="verification-section">
          <div class="form-group">
            <label class="form-label">验证码</label>
            <input 
              type="text" 
              v-model="verificationCode"
              class="form-input"
              placeholder="请输入6位验证码"
              maxlength="6"
            />
          </div>

          <div class="form-actions">
            <button 
              class="verify-btn" 
              @click="handleVerify"
              :disabled="!verificationCode || verificationCode.length !== 6"
            >
              验证
            </button>
          </div>
        </div>

        <!-- 操作说明 -->
        <div class="instructions">
          <h4>使用说明：</h4>
          <ol>
            <li>下载并安装 Google Authenticator 应用</li>
            <li>扫描二维码或手动输入密钥</li>
            <li>输入应用生成的6位验证码</li>
            <li>完成验证后即可启用双重验证</li>
          </ol>
        </div>

        <!-- 二维码区域 -->
        <div class="qr-section" v-if="showQR">
          <div class="qr-container">
            <div class="qr-placeholder">
              <span class="qr-icon">📱</span>
              <p>扫描二维码</p>
            </div>
          </div>
          <div class="qr-actions">
            <button class="qr-btn" @click="generateQR">生成二维码</button>
            <button class="qr-btn secondary" @click="showManualKey">手动输入密钥</button>
          </div>
        </div>

        <!-- 手动输入密钥 -->
        <div class="manual-key-section" v-if="showManual">
          <div class="form-group">
            <label class="form-label">密钥</label>
            <div class="key-display">
              <span class="key-text">{{ secretKey }}</span>
              <button class="copy-btn" @click="copyKey">复制</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'GoogleAuth',
  data() {
    return {
      verificationCode: '',
      showQR: false,
      showManual: false,
      secretKey: 'JBSWY3DPEHPK3PXP'
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleVerify() {
      if (!this.verificationCode || this.verificationCode.length !== 6) {
        this.$dialog.toast({ mes: '请输入6位验证码', icon: 'error' })
        return
      }

      // TODO: 调用API验证谷歌验证码
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    generateQR() {
      this.showQR = true
      this.showManual = false
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    showManualKey() {
      this.showManual = true
      this.showQR = false
    },
    copyKey() {
      navigator.clipboard.writeText(this.secretKey).then(() => {
        this.$dialog.toast({ mes: '密钥已复制到剪贴板', icon: 'success' })
      }).catch(() => {
        this.$dialog.toast({ mes: '复制失败，请手动复制', icon: 'error' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.google-auth-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航栏 */
.auth-header {
  background: #007bff;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-btn {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
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
  background-color: rgba(255, 255, 255, 0.1);
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
.auth-content {
  padding: 20px;
}

.auth-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 验证状态 */
.auth-status {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.status-icon {
  margin-right: 15px;
}

.icon {
  font-size: 32px;
}

.status-text h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.status-text p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 验证码输入 */
.verification-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
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
  text-align: center;
  letter-spacing: 2px;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.form-input::placeholder {
  color: #999;
}

.form-actions {
  margin-top: 20px;
}

.verify-btn {
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

.verify-btn:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.verify-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

/* 使用说明 */
.instructions {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.instructions h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.instructions ol {
  margin: 0;
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 二维码区域 */
.qr-section {
  margin-bottom: 20px;
}

.qr-container {
  text-align: center;
  margin-bottom: 20px;
}

.qr-placeholder {
  display: inline-block;
  width: 200px;
  height: 200px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.qr-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.qr-placeholder p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.qr-actions {
  display: flex;
  gap: 10px;
}

.qr-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-btn:hover {
  background: #007bff;
  color: white;
}

.qr-btn.secondary {
  border-color: #6c757d;
  color: #6c757d;
}

.qr-btn.secondary:hover {
  background: #6c757d;
  color: white;
}

/* 手动输入密钥 */
.manual-key-section {
  margin-bottom: 20px;
}

.key-display {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
}

.key-text {
  flex: 1;
  font-family: monospace;
  font-size: 16px;
  color: #333;
  letter-spacing: 1px;
}

.copy-btn {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.copy-btn:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .auth-header {
    height: 50px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon {
    font-size: 20px;
  }
  
  .auth-content {
    padding: 15px;
  }
  
  .auth-container {
    padding: 20px;
  }
  
  .auth-status {
    margin-bottom: 25px;
  }
  
  .icon {
    font-size: 28px;
  }
  
  .status-text h3 {
    font-size: 16px;
  }
  
  .qr-placeholder {
    width: 150px;
    height: 150px;
  }
  
  .qr-icon {
    font-size: 36px;
  }
}
</style>
