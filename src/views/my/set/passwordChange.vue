<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 修改登录密码页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="password-change-container">
    <!-- 顶部导航栏 -->
    <header class="password-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">修改登录密码</div>
    </header>

    <!-- 主内容区域 -->
    <main class="password-content">
      <div class="form-container">
        <div class="form-group">
          <label class="form-label">当前密码</label>
          <input 
            type="password" 
            v-model="formData.currentPassword"
            class="form-input"
            placeholder="请输入当前密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">新密码</label>
          <input 
            type="password" 
            v-model="formData.newPassword"
            class="form-input"
            placeholder="请输入新密码"
          />
        </div>

        <div class="form-group">
          <label class="form-label">确认新密码</label>
          <input 
            type="password" 
            v-model="formData.confirmPassword"
            class="form-input"
            placeholder="请再次输入新密码"
          />
        </div>

        <div class="form-actions">
          <button 
            class="submit-btn" 
            @click="handleSubmit"
            :disabled="!isFormValid"
          >
            确认修改
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PasswordChange',
  data() {
    return {
      formData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    isFormValid() {
      return this.formData.currentPassword && 
             this.formData.newPassword && 
             this.formData.confirmPassword &&
             this.formData.newPassword === this.formData.confirmPassword
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleSubmit() {
      if (!this.isFormValid) {
        this.$dialog.toast({ mes: '请填写完整信息', icon: 'error' })
        return
      }

      if (this.formData.newPassword !== this.formData.confirmPassword) {
        this.$dialog.toast({ mes: '两次输入的新密码不一致', icon: 'error' })
        return
      }

      if (this.formData.newPassword.length < 6) {
        this.$dialog.toast({ mes: '新密码长度不能少于6位', icon: 'error' })
        return
      }

      // TODO: 调用API修改密码
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    }
  }
}
</script>

<style lang="scss" scoped>
.password-change-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航栏 */
.password-header {
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
.password-content {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .password-header {
    height: 50px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon {
    font-size: 20px;
  }
  
  .password-content {
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
  
  .form-input {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .submit-btn {
    padding: 12px;
    font-size: 14px;
  }
}
</style>
