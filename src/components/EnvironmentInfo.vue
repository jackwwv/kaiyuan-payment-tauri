// src/components/EnvironmentInfo.vue
<template>
  <div class="environment-info">
    <h3>🔍 环境信息</h3>
    <div class="info-grid">
      <div class="info-item">
        <label>打包状态:</label>
        <span :class="envInfo.isPackaged ? 'status-packaged' : 'status-dev'">
          {{ envInfo.isPackaged ? '已打包' : '开发模式' }}
        </span>
      </div>
      
      <div class="info-item">
        <label>运行环境:</label>
        <span>{{ envInfo.nodeEnv }}</span>
      </div>
      
      <div class="info-item">
        <label>操作系统:</label>
        <span>{{ envInfo.platform }}</span>
      </div>
      
      <div class="info-item">
        <label>应用版本:</label>
        <span>{{ envInfo.appVersion }}</span>
      </div>
      
      <div class="info-item">
        <label>Electron版本:</label>
        <span>{{ envInfo.electronVersion }}</span>
      </div>
      
      <div class="info-item">
        <label>构建目标:</label>
        <span>{{ envInfo.buildTarget }}</span>
      </div>
      
      <div class="info-item">
        <label>开发工具:</label>
        <span :class="envInfo.devTools ? 'status-enabled' : 'status-disabled'">
          {{ envInfo.devTools ? '启用' : '禁用' }}
        </span>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshInfo" class="btn-refresh">🔄 刷新信息</button>
      <button @click="copyInfo" class="btn-copy">📋 复制信息</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvironmentInfo',
  data() {
    return {
      envInfo: {
        isPackaged: false,
        nodeEnv: 'development',
        platform: 'unknown',
        appVersion: '1.0.0',
        electronVersion: 'unknown',
        buildTarget: 'development',
        devTools: true
      }
    }
  },
  
  mounted() {
    this.detectEnvironment()
  },
  
  methods: {
    detectEnvironment() {
      // 检测环境信息
      this.envInfo = {
        isPackaged: import.meta.env.MODE === 'production',
        nodeEnv: import.meta.env.MODE || 'development',
        platform: navigator.platform,
        appVersion: '1.0.0', // 从package.json获取
        electronVersion: process.versions?.electron || 'unknown',
        buildTarget: this.getBuildTarget(),
        devTools: import.meta.env.MODE !== 'production'
      }
    },
    
    getBuildTarget() {
      // 根据用户代理或其他信息判断构建目标
      const userAgent = navigator.userAgent.toLowerCase()
      if (userAgent.includes('mac')) return 'mac'
      if (userAgent.includes('win')) return 'win'
      if (userAgent.includes('linux')) return 'linux'
      return 'unknown'
    },
    
    refreshInfo() {
      this.detectEnvironment()
      this.$message?.success('环境信息已刷新')
    },
    
    copyInfo() {
      const infoText = `环境信息:
打包状态: ${this.envInfo.isPackaged ? '已打包' : '开发模式'}
运行环境: ${this.envInfo.nodeEnv}
操作系统: ${this.envInfo.platform}
应用版本: ${this.envInfo.appVersion}
Electron版本: ${this.envInfo.electronVersion}
构建目标: ${this.envInfo.buildTarget}
开发工具: ${this.envInfo.devTools ? '启用' : '禁用'}`
      
      if (navigator.clipboard) {
        navigator.clipboard.writeText(infoText).then(() => {
          this.$message?.success('环境信息已复制到剪贴板')
        })
      } else {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = infoText
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        this.$message?.success('环境信息已复制到剪贴板')
      }
    }
  }
}
</script>

<style scoped>
.environment-info {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.environment-info h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-item label {
  font-weight: bold;
  color: #666;
}

.status-packaged {
  color: #28a745;
  font-weight: bold;
}

.status-dev {
  color: #ffc107;
  font-weight: bold;
}

.status-enabled {
  color: #28a745;
}

.status-disabled {
  color: #dc3545;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-refresh, .btn-copy {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-refresh {
  background: #007bff;
  color: white;
}

.btn-copy {
  background: #6c757d;
  color: white;
}

.btn-refresh:hover {
  background: #0056b3;
}

.btn-copy:hover {
  background: #545b62;
}
</style>
