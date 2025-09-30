<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 我的团队页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->

<template>
  <div class="team-container">
    <!-- 顶部导航栏 -->
    <header class="team-header">
      <div class="back-btn" @click="goBack">
        <span class="back-icon">‹</span>
      </div>
      <div class="header-title">我的团队</div>
      <div class="close-btn" @click="goBack">
        <span class="close-icon">×</span>
      </div>
    </header>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-controls">
        <!-- 层级选择 -->
        <div class="level-selector">
          <select v-model="selectedLevel" class="level-select">
            <option value="">选择层级</option>
            <option value="1">一级</option>
            <option value="2">二级</option>
            <option value="3">三级</option>
            <option value="4">四级</option>
            <option value="5">五级</option>
          </select>
        </div>

        <!-- 搜索输入框 -->
        <div class="search-input-wrapper">
          <input 
            type="text" 
            v-model="searchKeyword"
            class="search-input"
            placeholder="请输入关键词"
          />
          <span class="search-icon">🔍</span>
        </div>

        <!-- 查询按钮 -->
        <button class="query-btn" @click="handleQuery">查询</button>
      </div>
    </div>

    <!-- 团队列表 -->
    <div class="team-list-section">
      <!-- 表头 -->
      <div class="table-header">
        <div class="header-cell">账号/昵称</div>
        <div class="header-cell">层级</div>
        <div class="header-cell">注册时间</div>
        <div class="header-cell">状态</div>
        <div class="header-cell">收益率</div>
      </div>

      <!-- 表格内容 -->
      <div class="table-body">
        <div class="table-row" v-for="(member, index) in teamMembers" :key="index">
          <div class="table-cell">
            <div class="member-info">
              <div class="member-account">{{ member.account }}</div>
              <div class="member-nickname">{{ member.nickname }}</div>
            </div>
          </div>
          <div class="table-cell">{{ member.level }}</div>
          <div class="table-cell">{{ member.registerTime }}</div>
          <div class="table-cell" :class="getStatusClass(member.status)">
            {{ member.status }}
          </div>
          <div class="table-cell">{{ member.yieldRate }}%</div>
        </div>

        <!-- 无数据提示 -->
        <div class="no-data" v-if="teamMembers.length === 0">
          没有更多了
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyTeam',
  data() {
    return {
      selectedLevel: '',
      searchKeyword: '',
      teamMembers: [
        // 示例数据
        
      ]
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    handleQuery() {
      if (!this.selectedLevel && !this.searchKeyword) {
        this.$dialog.toast({ mes: '请选择层级或输入关键词', icon: 'error' })
        return
      }

      // TODO: 调用API查询团队数据
      this.$dialog.toast({ mes: '暂未开通权限', icon: 'error' })
    },
    getStatusClass(status) {
      switch(status) {
        case '正常': return 'status-normal'
        case '冻结': return 'status-frozen'
        case '禁用': return 'status-disabled'
        default: return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.team-container {
  min-height: 100vh;
  background: #f5f5f5;
}

/* 顶部导航栏 */
.team-header {
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

/* 搜索区域 */
.search-section {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.level-selector {
  flex-shrink: 0;
}

.level-select {
  padding: 10px 15px;
  border: 2px solid #ff6b35;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  min-width: 120px;
}

.level-select:focus {
  outline: none;
  border-color: #ff6b35;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 10px 40px 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-input::placeholder {
  color: #999;
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #999;
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
  flex-shrink: 0;
}

.query-btn:hover {
  background: #0056b3;
}

/* 团队列表区域 */
.team-list-section {
  background: white;
  margin: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  min-height: 200px;
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

.member-info {
  text-align: left;
}

.member-account {
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
}

.member-nickname {
  font-size: 12px;
  color: #666;
}

.status-normal {
  color: #28a745;
  font-weight: 500;
}

.status-frozen {
  color: #ffc107;
  font-weight: 500;
}

.status-disabled {
  color: #dc3545;
  font-weight: 500;
}

.no-data {
  padding: 40px 20px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .team-header {
    height: 50px;
    padding: 0 15px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .back-icon, .close-icon {
    font-size: 20px;
  }
  
  .search-section {
    padding: 15px;
  }
  
  .search-controls {
    flex-direction: column;
    gap: 10px;
  }
  
  .level-selector, .search-input-wrapper, .query-btn {
    width: 100%;
  }
  
  .level-select {
    min-width: auto;
  }
  
  .team-list-section {
    margin: 15px;
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
  
  .member-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .search-section {
    padding: 10px;
  }
  
  .team-list-section {
    margin: 10px;
  }
  
  .header-cell, .table-cell {
    padding: 8px;
    font-size: 12px;
  }
  
  .member-account {
    font-size: 12px;
  }
  
  .member-nickname {
    font-size: 10px;
  }
}
</style>
