<!--
 * @Author: hua
 * @Date: 2019-02-01 17:20:34
 * @description: 我的页面
 * @LastEditors  : hua
 * @LastEditTime : 2019-12-30 15:28:38
 -->

<template>
    <div class="my-container">
        <!-- 顶部导航栏 -->
        <header class="top-navbar">
            <div class="nav-item" :class="{ active: activeTab === 'order' }" @click="setActiveTab('order')">
                <div class="nav-icon">📋</div>
                <div class="nav-text">订单</div>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'collect' }" @click="setActiveTab('collect')">
                <div class="nav-icon">🏢</div>
                <div class="nav-text">代收</div>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'pay' }" @click="setActiveTab('pay')">
                <div class="nav-icon">📊</div>
                <div class="nav-text">代付</div>
            </div>
            <div class="nav-item" :class="{ active: activeTab === 'service' }" @click="setActiveTab('service')">
                <div class="nav-icon">🎧</div>
                <div class="nav-text">客服</div>
            </div>
            <!-- 通讯录标签已隐藏 -->
            <!-- <div class="nav-item" :class="{ active: activeTab === 'contacts' }" @click="setActiveTab('contacts')">
                <div class="nav-icon">📞</div>
                <div class="nav-text">通讯录</div>
            </div> -->
            <div class="nav-item" :class="{ active: activeTab === 'profile' }" @click="setActiveTab('profile')">
                <div class="nav-icon">👤</div>
                <div class="nav-text">我的</div>
            </div>
        </header>

        <!-- 主内容区域 -->
        <main class="main-content">
            <!-- 用户信息区域 -->
            <div class="user-info-section">
                <div class="profile-section">
                    <div class="profile-avatar">
                        <vImg :imgUrl="userInfo.head_img" />
                    </div>
                    <div class="profile-details">
                        <div class="phone-number">{{ userInfo.email }}</div>
                        <div class="status-toggle">
                            <span class="status-text">下线</span>
                            <div class="toggle-switch">
                                <input type="checkbox" id="status-toggle" />
                                <label for="status-toggle"></label>
                            </div>
                        </div>
                    </div>
                    <div class="recharge-btn">
                        <button class="btn-recharge">充值</button>
                    </div>
                </div>
            </div>

            <!-- 财务概览 -->
            <div class="financial-overview">
                <div class="overview-item">
                    <div class="overview-label">接单余额</div>
                    <div class="overview-value">0</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">可提余额</div>
                    <div class="overview-value">0</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">冻结余额</div>
                    <div class="overview-value">0</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">订单数</div>
                    <div class="overview-value">0</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">订单总额</div>
                    <div class="overview-value">0</div>
                </div>
                <div class="overview-item">
                    <div class="overview-label">提成</div>
                    <div class="overview-value">0</div>
                </div>
            </div>

            <!-- 功能菜单 -->
            <div class="action-grid">
                <div class="action-item" @click="bindCard">
                    <div class="action-icon">💳</div>
                    <div class="action-text">绑定卡</div>
                </div>
                <div class="action-item" @click="withdraw">
                    <div class="action-icon">💰</div>
                    <div class="action-text">提现</div>
                </div>
                <div class="action-item" @click="myTeam">
                    <div class="action-icon">👥</div>
                    <div class="action-text">我的团队</div>
                </div>
                <div class="action-item" @click="commissionRecord">
                    <div class="action-icon">📊</div>
                    <div class="action-text">分成记录</div>
                </div>
                <div class="action-item" @click="fundDetails">
                    <div class="action-icon">📋</div>
                    <div class="action-text">资金明细</div>
                </div>
                <div class="action-item" @click="callbackAssistant">
                    <div class="action-icon">📤</div>
                    <div class="action-text">回调助手</div>
                </div>
                <div class="action-item" @click="goToSettings">
                    <div class="action-icon">⚙️</div>
                    <div class="action-text">设置</div>
                </div>
                <!-- 添加好友记录功能已隐藏 -->
                <!-- <div class="action-item" @click="goToNewFriend">
                    <div class="action-icon">👤</div>
                    <div class="action-text">添加好友记录</div>
                    <yd-badge v-if="newFriendAlertNumber > 0" type="danger" class="badge">{{newFriendAlertNumber}}</yd-badge>
                </div> -->
            </div>
        </main>
    </div>
</template>
<script>
import CrossLine from '@/components/cross-line/cross-line'
import CrossItem from '@/components/cross-item/cross-item'
import vImg from '@/components/v-img/v-img'
import { mapGetters} from 'vuex'
import { userInfo } from '@/socketioApi/user'
import { Toast } from 'vue-ydui'

export default {
    components: {CrossLine, CrossItem, vImg},
    data() {
        return {
            activeTab: 'profile', // 默认选中我的
            userInfo:{

            }
        }
    },
    computed: {
        // 添加好友记录功能已隐藏，移除相关getter
        // ...mapGetters([
        // "newFriendAlertNumber"
        // ])
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
            // 根据标签页跳转到对应页面
            switch(tab) {
                case 'order':
                    this.$router.push({ name: 'order' });
                    break;
                case 'collect':
                    this.$router.push({ name: 'collect' });
                    break;
                case 'pay':
                    this.$router.push({ name: 'dashboard' });
                    break;
                case 'service':
                    this.$router.push({ name: 'home', query: { from: 'service' } }); // 客服链接到消息页面
                    break;
                // 通讯录功能已隐藏
                // case 'contacts':
                //     this.$router.push({ name: 'addressBook' }); // 通讯录
                //     break;
                default:
                    // 保持在当前页面（我的页面）
                    break;
            }
        },
        bindCard() {
            this.$router.push({ name: 'bindCard' });
        },
        withdraw() {
            this.$router.push({ name: 'withdraw' });
        },
        myTeam() {
            this.$router.push({ name: 'myTeam' });
        },
        commissionRecord() {
            this.$router.push({ name: 'commissionRecord' });
        },
        fundDetails() {
            this.$router.push({ name: 'fundDetails' });
        },
        callbackAssistant() {
            this.$router.push({ name: 'callbackAssistant' });
        },
        goToSettings() {
            this.$router.push({ name: 'mySet' });
        },
        // 添加好友记录功能已隐藏
        // goToNewFriend() {
        //     this.$router.push({ name: 'newFriend' });
        // },
        init(){
            window.physicsBackRouter = null
            userInfo().then(res=>{
                console.log(res)
                this.userInfo = res.data
                this.$store.commit('updateUserInfo', res.data)
            }).catch(error => {
                console.error('获取用户信息失败:', error)
                // 如果获取用户信息失败，可能是未登录，跳转到登录页
                if (error.error_code === 10001 || error.msg === '令牌失效') {
                    this.$router.push({ name: 'authLogin' })
                }
            })
        }
    },
    created() {
        this.init()
    },
    mounted() {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';
@import '@/assets/scss/public.scss';

.my-container {
    min-height: 100vh;
    background: #f5f5f5;
    position: relative;
}

.top-navbar {
    display: flex;
    background: white;
    padding: 15px 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &.active {
        background: #007bff;
        color: white;
        border-radius: 8px;
        margin: 0 5px;
    }
}

.nav-icon {
    font-size: 20px;
    margin-bottom: 5px;
}

.nav-text {
    font-size: 12px;
    font-weight: 500;
}

.main-content {
    padding-top: 80px;
    padding: 80px 0 20px;
    position: relative;
}

/* 用户信息区域 */
.user-info-section {
    background: linear-gradient(135deg, #007bff, #0056b3);
    padding: 30px 20px;
    color: white;
    position: relative;
}

.profile-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.profile-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.profile-details {
    flex: 1;
    margin-left: 20px;
}

.phone-number {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
}

.status-toggle {
    display: flex;
    align-items: center;
    gap: 10px;
}

.status-text {
    font-size: 14px;
    opacity: 0.9;
}

.toggle-switch {
    position: relative;
    width: 50px;
    height: 25px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-switch label {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 25px;
    transition: 0.4s;
}

.toggle-switch label:before {
    position: absolute;
    content: "";
    height: 19px;
    width: 19px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
}

.toggle-switch input:checked + label {
    background-color: #28a745;
}

.toggle-switch input:checked + label:before {
    transform: translateX(25px);
}

.recharge-btn {
    margin-left: 20px;
}

.btn-recharge {
    background: white;
    color: #007bff;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-recharge:hover {
    background: #f8f9fa;
}

/* 财务概览 */
.financial-overview {
    background: white;
    margin: 20px;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.overview-item {
    text-align: center;
}

.overview-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
}

.overview-value {
    font-size: 18px;
    font-weight: 700;
    color: #007bff;
}

/* 功能菜单 */
.action-grid {
    background: white;
    margin: 0 20px 20px;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
}

.action-item:hover {
    background: #f8f9fa;
}

.action-icon {
    font-size: 24px;
    margin-bottom: 8px;
}

.action-text {
    font-size: 12px;
    color: #333;
    text-align: center;
    line-height: 1.2;
}

.badge {
    position: absolute;
    top: 5px;
    right: 5px;
}

.header_wrapper{
    background:#fff;
    width:100%;
    height:2.5rem;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}
.header_img{
    width:1.5rem;
    height:1.5rem;
    position: absolute;
    left: 0.3rem;
    margin-top:0.3rem;
}
.header_name{
    margin-left:2.3rem;
    margin-top:0.3rem;
    font-weight: bold;
    font-size:0.4rem;
}
.header_id{
    margin-left:2.3rem;
    margin-top:0.3rem;
}
.icon_style{
    display: inline-block;
    line-height: 1rem;
}
.icon_right{
    font-weight:bold;
    font-size:0.5rem;
    float:right;
    line-height:1rem;
    color:#aaaaaa;
    position: absolute;
    margin-top: 0.8rem;
    right:0.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .financial-overview {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .action-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .nav-text {
        font-size: 10px;
    }
    
    .nav-icon {
        font-size: 18px;
    }
    
    .profile-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .profile-details {
        margin-left: 0;
    }
    
    .recharge-btn {
        margin-left: 0;
        align-self: flex-end;
    }
}

@media (max-width: 480px) {
    .financial-overview {
        grid-template-columns: 1fr;
    }
    
    .action-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .user-info-section {
        padding: 20px 15px;
    }
    
    .financial-overview,
    .action-grid {
        margin: 15px;
        padding: 15px;
    }
}
</style>