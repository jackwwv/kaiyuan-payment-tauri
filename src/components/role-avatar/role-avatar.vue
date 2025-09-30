<!--
 * @Author: hua
 * @Date: 2025-09-13 22:00:00
 * @description: 角色头像组件 - 支持用户和客服两种角色的默认头像
 * @LastEditors: hua
 * @LastEditTime: 2025-09-13 22:00:00
 -->
<template>
  <div class="role-avatar" :class="avatarClass">
    <img 
      :src="currentSrc" 
      :key="currentSrc" 
      :alt="roleName"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    <!-- 加载状态 -->
    <div v-if="isLoading" class="avatar-loading">
      <div class="loading-spinner"></div>
    </div>
    <!-- 错误状态 -->
    <div v-if="hasError" class="avatar-error">
      <span class="error-icon">👤</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "RoleAvatar",
  props: {
    // 头像URL
    imgUrl: {
      type: String,
      default: ""
    },
    // 角色类型: 'user' | 'service' | 'customer'
    role: {
      type: String,
      default: "user",
      validator: value => ['user', 'service', 'customer'].includes(value)
    },
    // 头像大小: 'small' | 'medium' | 'large'
    size: {
      type: String,
      default: "medium",
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    // 是否显示在线状态
    showOnlineStatus: {
      type: Boolean,
      default: false
    },
    // 在线状态
    isOnline: {
      type: Boolean,
      default: false
    },
    // 是否强制使用默认头像
    forceDefault: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isLoading: false,
      hasError: false,
      imageLoadTimeout: null,
      fallbackActivated: false
    };
  },
  computed: {
    ...mapGetters([
      "DEFAULTIMG",
      "ROLE_AVATARS"
    ]),
    // 角色名称
    roleName() {
      const roleNames = { user: "用户", service: "客服", customer: "客户" };
      return roleNames[this.role] || "用户";
    },
    // 默认头像URL
    defaultAvatarUrl() {
      const defaultAvatars = {
        user: (this.ROLE_AVATARS && this.ROLE_AVATARS.USER) || this.DEFAULTIMG,
        service: (this.ROLE_AVATARS && this.ROLE_AVATARS.SERVICE) || this.DEFAULTIMG,
        customer: (this.ROLE_AVATARS && this.ROLE_AVATARS.CUSTOMER) || this.DEFAULTIMG
      };
      return defaultAvatars[this.role] || this.DEFAULTIMG;
    },
    // 最终头像URL
    avatarUrl() {
      return this.forceDefault ? this.defaultAvatarUrl : (this.imgUrl || this.defaultAvatarUrl);
    },
    // 当前img的src（带错误回退）
    currentSrc() {
      return this.fallbackActivated ? this.defaultAvatarUrl : this.avatarUrl;
    },
    // 头像CSS类
    avatarClass() {
      return [
        `avatar-${this.size}`,
        `avatar-${this.role}`,
        {
          'avatar-loading': this.isLoading,
          'avatar-error': this.hasError,
          'avatar-online': this.showOnlineStatus && this.isOnline
        }
      ];
    }
  },
  methods: {
    // 处理图片加载错误：回退到默认头像
    handleImageError() {
      if (!this.fallbackActivated) {
        this.fallbackActivated = true;
        this.hasError = false; // 使用默认图不显示错误层
      } else {
        this.hasError = true;
      }
      this.isLoading = false;
    },
    // 处理图片加载成功
    handleImageLoad() {
      this.isLoading = false;
      this.hasError = false;
      if (this.imageLoadTimeout) {
        clearTimeout(this.imageLoadTimeout);
        this.imageLoadTimeout = null;
      }
    }
  },
  mounted() {
    // 设置加载超时
    this.imageLoadTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.isLoading = false;
        this.hasError = true;
      }
    }, 5000);
  },
  beforeDestroy() {
    if (this.imageLoadTimeout) {
      clearTimeout(this.imageLoadTimeout);
    }
  }
};
</script>

<style lang="scss" scoped>
.role-avatar {
  position: relative;
  display: inline-block;
  
  img {
    display: block;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.3s ease;
  }
  
  // 尺寸样式
  &.avatar-small {
    width: 24px;
    height: 24px;
    
    img {
      width: 24px;
      height: 24px;
    }
  }
  
  &.avatar-medium {
    width: 32px;
    height: 32px;
    
    img {
      width: 32px;
      height: 32px;
    }
  }
  
  &.avatar-large {
    width: 48px;
    height: 48px;
    
    img {
      width: 48px;
      height: 48px;
    }
  }
  
  // 角色样式
  &.avatar-user {
    img {
      border: 2px solid #4B95F6;
    }
  }
  
  &.avatar-service {
    img {
      border: 2px solid #52CD80;
    }
  }
  
  &.avatar-customer {
    img {
      border: 2px solid #FF9647;
    }
  }
  
  // 在线状态
  &.avatar-online::after {
    content: '';
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background-color: #52CD80;
    border: 2px solid white;
    border-radius: 50%;
  }
  
  // 加载状态
  .avatar-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #4B95F6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  
  // 错误状态
  .avatar-error {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border-radius: 50%;
    border: 2px solid #d9d9d9;
    
    .error-icon {
      font-size: 16px;
      color: #999;
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
