<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 邀请码管理页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->
<template>
<div class="invite-code-manage">
    <div class="header">
        <h2>邀请码管理</h2>
        <button class="create-btn" @click="showCreateModal = true">创建邀请码</button>
    </div>
    
    <div class="filter-bar">
        <input v-model="searchKeyword" placeholder="搜索邀请码" @input="searchInviteCodes">
        <select v-model="statusFilter" @change="filterInviteCodes">
            <option value="">全部状态</option>
            <option value="active">有效</option>
            <option value="inactive">无效</option>
        </select>
    </div>
    
    <div class="table-container">
        <table class="invite-table">
            <thead>
                <tr>
                    <th>邀请码</th>
                    <th>创建者</th>
                    <th>使用次数</th>
                    <th>最大次数</th>
                    <th>状态</th>
                    <th>过期时间</th>
                    <th>创建时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in inviteCodeList" :key="item.id">
                    <td>{{ item.code }}</td>
                    <td>{{ item.creator_name || '系统' }}</td>
                    <td>{{ item.used_count }}</td>
                    <td>{{ item.max_uses }}</td>
                    <td>
                        <span :class="['status', item.is_active ? 'active' : 'inactive']">
                            {{ item.is_active ? '有效' : '无效' }}
                        </span>
                    </td>
                    <td>{{ item.expires_at ? formatDate(item.expires_at) : '永不过期' }}</td>
                    <td>{{ formatDate(item.created_at) }}</td>
                    <td>
                        <button @click="toggleStatus(item)" :class="['toggle-btn', item.is_active ? 'deactivate' : 'activate']">
                            {{ item.is_active ? '禁用' : '启用' }}
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- 创建邀请码弹窗 -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
        <div class="modal-content" @click.stop>
            <h3>创建邀请码</h3>
            <form @submit.prevent="createInviteCode">
                <div class="form-group">
                    <label>邀请码（留空自动生成）</label>
                    <input v-model="newInviteCode.code" placeholder="如：WELCOME2024">
                </div>
                <div class="form-group">
                    <label>创建者姓名</label>
                    <input v-model="newInviteCode.creator_name" placeholder="创建者姓名">
                </div>
                <div class="form-group">
                    <label>最大使用次数</label>
                    <input v-model.number="newInviteCode.max_uses" type="number" min="1" placeholder="1">
                </div>
                <div class="form-group">
                    <label>过期时间（可选）</label>
                    <input v-model="newInviteCode.expires_at" type="datetime-local">
                </div>
                <div class="form-group">
                    <label>描述</label>
                    <textarea v-model="newInviteCode.description" placeholder="邀请码描述"></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" @click="showCreateModal = false">取消</button>
                    <button type="submit" :disabled="creating">创建</button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>

<script>
import { createInviteCode, getInviteCodeList } from '@/socketioApi/inviteCode'

export default {
    name: 'InviteCodeManage',
    data() {
        return {
            inviteCodeList: [],
            searchKeyword: '',
            statusFilter: '',
            showCreateModal: false,
            creating: false,
            newInviteCode: {
                code: '',
                creator_name: '',
                max_uses: 1,
                expires_at: '',
                description: ''
            }
        }
    },
    mounted() {
        this.loadInviteCodes()
    },
    methods: {
        async loadInviteCodes() {
            try {
                const res = await getInviteCodeList({ page: 1, limit: 100 })
                if (res.code === 200) {
                    this.inviteCodeList = res.data.list
                }
            } catch (error) {
                console.error('加载邀请码列表失败:', error)
            }
        },
        async createInviteCode() {
            this.creating = true
            try {
                const res = await createInviteCode(this.newInviteCode)
                if (res.code === 200) {
                    this.$toast.success('邀请码创建成功')
                    this.showCreateModal = false
                    this.resetForm()
                    this.loadInviteCodes()
                } else {
                    this.$toast.error(res.msg || '创建失败')
                }
            } catch (error) {
                console.error('创建邀请码失败:', error)
                this.$toast.error('创建失败')
            } finally {
                this.creating = false
            }
        },
        resetForm() {
            this.newInviteCode = {
                code: '',
                creator_name: '',
                max_uses: 1,
                expires_at: '',
                description: ''
            }
        },
        searchInviteCodes() {
            // 实现搜索逻辑
            this.loadInviteCodes()
        },
        filterInviteCodes() {
            // 实现筛选逻辑
            this.loadInviteCodes()
        },
        toggleStatus(item) {
            // 实现状态切换逻辑
            console.log('切换状态:', item)
        },
        formatDate(timestamp) {
            if (!timestamp) return '-'
            return new Date(timestamp * 1000).toLocaleString()
        }
    }
}
</script>

<style lang="scss" scoped>
.invite-code-manage {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
        margin: 0;
        color: #333;
    }
    
    .create-btn {
        background: #4facfe;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }
}

.filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    input, select {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
}

.table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.invite-table {
    width: 100%;
    border-collapse: collapse;
    
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    
    th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
    }
    
    .status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        
        &.active {
            background: #d4edda;
            color: #155724;
        }
        
        &.inactive {
            background: #f8d7da;
            color: #721c24;
        }
    }
    
    .toggle-btn {
        padding: 4px 8px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 12px;
        
        &.activate {
            background: #d4edda;
            color: #155724;
        }
        
        &.deactivate {
            background: #f8d7da;
            color: #721c24;
        }
    }
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 8px;
    width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    
    h3 {
        margin: 0 0 20px 0;
        color: #333;
    }
    
    .form-group {
        margin-bottom: 15px;
        
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
            font-weight: 500;
        }
        
        input, textarea {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        
        textarea {
            height: 80px;
            resize: vertical;
        }
    }
    
    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 20px;
        
        button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            
            &[type="button"] {
                background: #6c757d;
                color: white;
            }
            
            &[type="submit"] {
                background: #4facfe;
                color: white;
                
                &:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }
            }
        }
    }
}
</style>
