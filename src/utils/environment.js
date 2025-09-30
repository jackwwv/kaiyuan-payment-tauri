// src/utils/environment.js
// Electron环境检测工具

// 在 Tauri 环境中，这些 Node.js 模块不可用
// const { app } = require('electron')
// const path = require('path')
// const os = require('os')

class EnvironmentDetector {
  constructor() {
    this.info = this.detectEnvironment()
  }

  detectEnvironment() {
    return {
      // 基本环境信息
      isPackaged: app.isPackaged,
      nodeEnv: import.meta.env.MODE,
      platform: process.platform,
      arch: process.arch,
      
      // 应用信息
      appName: app.getName(),
      appVersion: app.getVersion(),
      appPath: app.getAppPath(),
      userDataPath: app.getPath('userData'),
      
      // 系统信息
      osType: os.type(),
      osRelease: os.release(),
      osArch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      
      // 构建信息
      buildTime: this.getBuildTime(),
      buildTarget: this.getBuildTarget(),
      
      // 开发工具
      devTools: import.meta.env.MODE !== 'production',
      electronVersion: process.versions.electron,
      chromeVersion: process.versions.chrome,
      nodeVersion: process.versions.node
    }
  }

  getBuildTime() {
    // 从package.json或构建信息中获取
    try {
      // 在浏览器环境中无法直接 require package.json
      return new Date().toISOString()
    } catch (e) {
      return new Date().toISOString()
    }
  }

  getBuildTarget() {
    // 根据文件路径判断构建目标
    const appPath = app.getAppPath()
    if (appPath.includes('.app')) return 'mac'
    if (appPath.includes('.exe')) return 'win'
    if (appPath.includes('AppImage')) return 'linux'
    return 'development'
  }

  // 获取环境摘要
  getSummary() {
    return {
      environment: this.info.isPackaged ? 'production' : 'development',
      platform: this.info.platform,
      buildTarget: this.info.buildTarget,
      version: this.info.appVersion,
      electronVersion: this.info.electronVersion
    }
  }

  // 打印环境信息
  logEnvironment() {
    console.log('🔍 Electron环境信息:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📦 打包状态: ${this.info.isPackaged ? '已打包' : '开发模式'}`)
    console.log(`🌍 运行环境: ${this.info.nodeEnv}`)
    console.log(`💻 操作系统: ${this.info.osType} ${this.info.osRelease}`)
    console.log(`🏗️ 构建目标: ${this.info.buildTarget}`)
    console.log(`📱 应用版本: ${this.info.appVersion}`)
    console.log(`⚡ Electron版本: ${this.info.electronVersion}`)
    console.log(`🔧 开发工具: ${this.info.devTools ? '启用' : '禁用'}`)
    console.log(`📁 应用路径: ${this.info.appPath}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }

  // 检查是否为特定环境
  isDevelopment() {
    return !this.info.isPackaged && this.info.nodeEnv === 'development'
  }

  isProduction() {
    return this.info.isPackaged && this.info.nodeEnv === 'production'
  }

  isMac() {
    return this.info.platform === 'darwin'
  }

  isWindows() {
    return this.info.platform === 'win32'
  }

  isLinux() {
    return this.info.platform === 'linux'
  }
}

module.exports = EnvironmentDetector
