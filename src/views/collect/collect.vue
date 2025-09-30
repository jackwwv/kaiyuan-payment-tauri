<!--
 * @Author: hua
 * @Date: 2024-01-01 00:00:00
 * @description: 代收标签页面
 * @LastEditors: hua
 * @LastEditTime: 2024-01-01 00:00:00
 -->
<template>
  <div class="collect-container">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="nav-item" :class="{ active: activeTab === 'order' }" @click="setActiveTab('order')">
        <div class="nav-icon">📋</div>
        <div class="nav-text">订单</div>
      </div>
      <div class="nav-item" :class="{ active: activeTab === 'collect' }" @click="setActiveTab('collect')">
        <div class="nav-icon icon-custom-collect-qr"></div>
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
      <!-- 支付类型选择区域 -->
      <div class="payment-type-section">
        <div class="payment-type-selector">
          <div class="selector-wrapper" @click="togglePaymentTypeDropdown">
            <span class="selector-text">{{ selectedPaymentType }}</span>
            <span class="selector-arrow" :class="{ 'open': showPaymentTypeDropdown }">▼</span>
          </div>
          
          <!-- 下拉菜单 -->
          <div class="dropdown-menu" v-show="showPaymentTypeDropdown">
            <div 
              class="dropdown-item" 
              v-for="type in paymentTypes" 
              :key="type.value"
              :class="{ 'selected': selectedPaymentType === type.label }"
              @click="selectPaymentType(type)"
            >
              {{ type.label }}
            </div>
          </div>
        </div>
        
        <!-- 添加账号按钮 -->
        <button class="add-account-btn" @click="addAccount">
          添加账号
        </button>
      </div>

      <!-- 账号列表区域 -->
      <div class="account-list-section">
        <div class="account-list-header">
          <h3>收款账号列表</h3>
          <span class="account-count">共 {{ accountList.length }} 个账号</span>
        </div>
        
        <div class="account-list">
          <div class="account-card" v-for="account in accountList" :key="account.id">
            <div class="card-content">
              <div class="card-left">
                <div class="account-type">{{ account.type }}</div>
                <div class="account-recipient">
                  <span class="recipient-name">{{ account.recipientName }}</span>
                  <span class="recipient-icon">👤</span>
                </div>
                <div class="account-qr">
                  <span class="qr-icon">📱</span>
                </div>
                <div class="account-min-amount">最小收款: {{ account.minAmount || 0 }}</div>
                <div class="account-yield">收益率: {{ account.yieldRate || 0 }}%</div>
                <div class="account-today-count">今日笔数: {{ account.todayCount || 0 }}/{{ account.todayLimit || 0 }}</div>
              </div>
              
              <div class="card-right">
                <div class="account-status">
                  <label class="status-switch">
                    <input type="checkbox" v-model="account.status" @change="toggleStatus(account)" :true-value="'online'" :false-value="'offline'">
                    <span class="switch-slider"></span>
                  </label>
                  <span class="status-text">{{ account.status === 'online' ? '在线' : '下线' }}</span>
                </div>
                <div class="account-number">收款号: {{ account.account }}</div>
                <div class="account-id">账号Id: {{ account.accountId }}</div>
                <div class="account-location">省市: {{ getProvinceCityName(account.province, account.city) }}</div>
                <div class="account-max-amount">最大收款: {{ account.maxAmount }}</div>
                <div class="account-commission">提成: {{ account.commission || 0 }}</div>
                <div class="account-success-rate">成功率: {{ account.successRate || 0 }}%</div>
              </div>
            </div>
            
            <div class="card-actions">
              <button class="action-btn delete" @click="deleteAccount(account)">删除</button>
              <button class="action-btn modify" @click="editAccount(account)">修改</button>
              <button class="action-btn test" @click="testAccount(account)">测试</button>
            </div>
          </div>
          
          <!-- 无数据提示 -->
          <div class="no-accounts" v-if="accountList.length === 0">
            <div class="no-accounts-icon">📱</div>
            <div class="no-accounts-text">暂无收款账号</div>
            <div class="no-accounts-hint">点击"添加账号"开始添加</div>
          </div>
          
          <!-- 没有更多了 -->
          <div class="no-more" v-if="accountList.length > 0">没有更多了</div>
        </div>
      </div>
    </main>

    <!-- 添加账号弹窗 -->
    <div v-if="showAddAccountModal" class="modal-overlay" @click="closeAddAccountModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ isEditMode ? '编辑收款码' : '添加收款码' }}</h3>
            <button class="close-btn" @click="closeAddAccountModal">×</button>
          </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">支付类型:</label>
            <select v-model="addAccountForm.paymentType" class="form-select">
              <option v-for="type in paymentTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">所属省份:</label>
            <select v-model="addAccountForm.province" @change="onProvinceChange" class="form-select">
              <option value="">请选择</option>
              <option v-for="province in provinces" :key="province.value" :value="province.value">
                {{ province.label }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">所属城市:</label>
            <select v-model="addAccountForm.city" class="form-select">
              <option value="">请选择</option>
              <option v-for="city in cities" :key="city.value" :value="city.value">
                {{ city.label }}
              </option>
            </select>
          </div>

          <!-- 银行卡转账特有字段 -->
          <div v-if="isBankTransfer" class="form-group">
            <label class="form-label">开户行:</label>
            <select v-model="addAccountForm.bankName" class="form-select">
              <option value="">请选择</option>
              <option v-for="bank in banks" :key="bank.value" :value="bank.value">
                {{ bank.label }}
              </option>
            </select>
          </div>

          <div v-if="isBankTransfer" class="form-group">
            <label class="form-label">开户支行:</label>
            <input v-model="addAccountForm.branchName" type="text" placeholder="选填" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">收款姓名:</label>
            <input v-model="addAccountForm.recipientName" type="text" placeholder="真实姓名" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">收款账号:</label>
            <input v-model="addAccountForm.account" type="text" placeholder="支付宝/微信/手机号/卡号" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">收款账号ID:</label>
            <input v-model="addAccountForm.accountId" type="text" placeholder="支付宝账号ID" class="form-input">
          </div>

          <div class="form-group">
            <label class="form-label">最大收款:</label>
            <input v-model="addAccountForm.maxAmount" type="number" class="form-input">
          </div>

          <!-- 扫码支付特有字段 -->
          <div v-if="needsQrCode" class="form-group">
            <label class="form-label">收款码:</label>
            <div class="qr-upload-area" @click="uploadQrCode">
              <div v-if="!addAccountForm.qrCode" class="upload-icon">+</div>
              <img v-else :src="addAccountForm.qrCode" alt="收款码" class="qr-preview">
            </div>
            <div v-if="addAccountForm.qrCode" class="qr-actions">
              <button type="button" class="btn-change-qr" @click="uploadQrCode">更换收款码</button>
              <button type="button" class="btn-remove-qr" @click="removeQrCode">删除</button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">状态:</label>
            <div class="status-options">
              <label class="status-option">
                <input type="radio" v-model="addAccountForm.status" value="online">
                <span class="status-dot online"></span>
                在线
              </label>
              <label class="status-option">
                <input type="radio" v-model="addAccountForm.status" value="offline">
                <span class="status-dot offline"></span>
                下线
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="submit-btn" @click="submitAddAccount">{{ isEditMode ? '更新' : '添加' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { Toast } from "vue-ydui/dist/lib.rem/dialog";

export default {
  name: "collect",
  data() {
    return {
      activeTab: 'collect', // 默认选中代收
      showPaymentTypeDropdown: false,
      selectedPaymentType: '全部支付类型',
      paymentTypes: [
        { value: 'all', label: '全部支付类型' },
        { value: 'alipay_scan', label: '支付宝扫码' },
        { value: 'wechat_scan', label: '微信扫码' },
        { value: 'bank_transfer', label: '银行卡转账' },
        { value: 'phone_bill', label: '话费' },
        { value: 'other', label: '其他' },
        { value: 'unionpay', label: '云闪付' },
        { value: 'qq', label: 'QQ' },
        { value: 'alipay_transfer', label: '支付宝转账' },
        { value: 'qq_digital', label: 'QQ说数码' },
        { value: 'bank_conduct', label: '银行进行' },
        { value: 'other_scan', label: '其他扫码' }
      ],
      accountList: [
        // 示例数据
        {
          id: 1,
          type: '微信扫码',
          name: '曾',
          number: '13311113333',
          paymentType: 'wechat_scan',
          province: 'jilin',
          city: 'siping',
          recipientName: '曾',
          account: '13311113333',
          accountId: '1311113333',
          maxAmount: 20000,
          minAmount: 0,
          status: 'offline',
          qrCode: '',
          yieldRate: 0,
          todayCount: 0,
          todayLimit: 0,
          commission: 0,
          successRate: 0
        },
        {
          id: 2,
          type: '支付宝扫码',
          name: '张三',
          number: '138****8888',
          paymentType: 'alipay_scan',
          province: 'beijing',
          city: 'chaoyang',
          recipientName: '张三',
          account: '138****8888',
          accountId: 'zhangsan123',
          maxAmount: 20000,
          minAmount: 100,
          status: 'online',
          qrCode: '',
          yieldRate: 2.5,
          todayCount: 5,
          todayLimit: 10,
          commission: 50,
          successRate: 95
        },
        {
          id: 3,
          type: '银行卡转账',
          name: '李四',
          number: '6222****1234',
          paymentType: 'bank_transfer',
          province: 'shanghai',
          city: 'huangpu',
          bankName: 'icbc',
          branchName: '上海分行',
          recipientName: '李四',
          account: '6222****1234',
          accountId: 'lisi456',
          maxAmount: 50000,
          minAmount: 500,
          status: 'online',
          yieldRate: 1.8,
          todayCount: 3,
          todayLimit: 8,
          commission: 90,
          successRate: 98
        }
      ],
      // 添加账号弹窗相关数据
      showAddAccountModal: false,
      isEditMode: false, // 是否为编辑模式
      addAccountForm: {
        paymentType: 'wechat_scan',
        province: '',
        city: '',
        bankName: '',
        branchName: '',
        recipientName: '',
        account: '',
        accountId: '',
        maxAmount: 20000,
        qrCode: '',
        status: 'online'
      },
      provinces: [
        { value: 'beijing', label: '北京' },
        { value: 'tianjin', label: '天津' },
        { value: 'hebei', label: '河北' },
        { value: 'shanxi', label: '山西' },
        { value: 'neimenggu', label: '内蒙古' },
        { value: 'liaoning', label: '辽宁' },
        { value: 'jilin', label: '吉林' },
        { value: 'heilongjiang', label: '黑龙江' },
        { value: 'shanghai', label: '上海' },
        { value: 'jiangsu', label: '江苏' },
        { value: 'zhejiang', label: '浙江' },
        { value: 'anhui', label: '安徽' },
        { value: 'fujian', label: '福建' },
        { value: 'jiangxi', label: '江西' },
        { value: 'shandong', label: '山东' },
        { value: 'henan', label: '河南' },
        { value: 'hubei', label: '湖北' },
        { value: 'hunan', label: '湖南' },
        { value: 'guangdong', label: '广东' },
        { value: 'guangxi', label: '广西' },
        { value: 'hainan', label: '海南' },
        { value: 'chongqing', label: '重庆' },
        { value: 'sichuan', label: '四川' },
        { value: 'guizhou', label: '贵州' },
        { value: 'yunnan', label: '云南' },
        { value: 'xizang', label: '西藏' },
        { value: 'shaanxi', label: '陕西' },
        { value: 'gansu', label: '甘肃' },
        { value: 'qinghai', label: '青海' },
        { value: 'ningxia', label: '宁夏' },
        { value: 'xinjiang', label: '新疆' }
      ],
      cities: [],
      banks: [
        { value: 'icbc', label: '中国工商银行' },
        { value: 'ccb', label: '中国建设银行' },
        { value: 'abc', label: '中国农业银行' },
        { value: 'boc', label: '中国银行' },
        { value: 'cmb', label: '招商银行' },
        { value: 'spdb', label: '上海浦东发展银行' },
        { value: 'cib', label: '兴业银行' },
        { value: 'cmbc', label: '中国民生银行' }
      ]
    };
  },
  computed: {
    ...mapState(["user"]),
    currentPaymentTypeLabel() {
      const type = this.paymentTypes.find(t => t.value === this.addAccountForm.paymentType);
      return type ? type.label : '微信扫码';
    },
    isBankTransfer() {
      return this.addAccountForm.paymentType === 'bank_transfer';
    },
    needsQrCode() {
      return ['wechat_scan', 'alipay_scan', 'other_scan'].includes(this.addAccountForm.paymentType);
    }
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
      // 根据标签页跳转到对应页面
      switch(tab) {
        case 'order':
          this.$router.push({ name: 'order' });
          break;
        case 'pay':
          this.$router.push({ name: 'dashboard' });
          break;
        case 'service':
          this.$router.push({ name: 'home', query: { from: 'service' } }); // 客服链接到消息页面
          break;
        // 通讯录功能已隐藏
        // case 'contacts':
        //   this.$router.push({ name: 'addressBook' }); // 通讯录
        //   break;
        case 'profile':
          this.$router.push({ name: 'my' });
          break;
        default:
          // 保持在当前页面
          break;
      }
    },
    togglePaymentTypeDropdown() {
      this.showPaymentTypeDropdown = !this.showPaymentTypeDropdown;
    },
    selectPaymentType(type) {
      this.selectedPaymentType = type.label;
      this.showPaymentTypeDropdown = false;
      // TODO: 根据选择的支付类型筛选账号列表
      this.filterAccountsByType(type.value);
    },
    filterAccountsByType(type) {
      // TODO: 实现按支付类型筛选账号
      console.log('筛选支付类型:', type);
    },
    addAccount() {
      // 设置为添加模式
      this.isEditMode = false;
      
      // 根据当前选择的支付类型设置表单默认值
      const selectedType = this.paymentTypes.find(type => type.value === this.selectedPaymentType);
      this.addAccountForm.paymentType = selectedType ? selectedType.value : 'wechat_scan';
      this.addAccountForm.maxAmount = 20000;
      this.addAccountForm.status = 'online';
      
      // 重置表单
      this.addAccountForm.province = '';
      this.addAccountForm.city = '';
      this.addAccountForm.bankName = '';
      this.addAccountForm.branchName = '';
      this.addAccountForm.recipientName = '';
      this.addAccountForm.account = '';
      this.addAccountForm.accountId = '';
      this.addAccountForm.qrCode = '';
      this.cities = [];
      
      this.showAddAccountModal = true;
    },
    editAccount(account) {
      // 设置为编辑模式
      this.isEditMode = true;
      
      // 编辑账号功能
      this.addAccountForm = {
        ...account,
        paymentType: this.getPaymentTypeByLabel(account.type)
      };
      
      // 根据省份加载城市列表
      this.onProvinceChange();
      
      this.showAddAccountModal = true;
    },
    deleteAccount(account) {
      // 删除账号功能
      this.$dialog.confirm({
        title: '确认删除',
        mes: `确定要删除账号 "${account.name}" 吗？`,
        opts: [
          {
            txt: '取消',
            color: '#999',
            callback: () => {}
          },
          {
            txt: '删除',
            color: '#dc3545',
            callback: () => {
              this.performDeleteAccount(account);
            }
          }
        ]
      });
    },
    performDeleteAccount(account) {
      // 执行删除操作
      const index = this.accountList.findIndex(item => item.id === account.id);
      if (index > -1) {
        this.accountList.splice(index, 1);
        // 更新localStorage
        this.updateLocalStorage();
        this.$dialog.toast({ mes: '删除成功', icon: 'success' });
      }
    },
    getPaymentTypeByLabel(label) {
      // 根据标签获取支付类型值
      const typeMap = {
        '支付宝扫码': 'alipay_scan',
        '微信扫码': 'wechat_scan',
        '银行卡转账': 'bank_transfer',
        '话费': 'phone_bill',
        '其他': 'other',
        '云闪付': 'unionpay',
        'QQ': 'qq',
        '支付宝转账': 'alipay_transfer',
        'QQ说数码': 'qq_digital',
        '银行进行': 'bank_conduct',
        '其他扫码': 'other_scan'
      };
      return typeMap[label] || 'wechat_scan';
    },
    getProvinceCityName(provinceValue, cityValue) {
      // 获取省市名称
      const province = this.provinces.find(p => p.value === provinceValue);
      const city = this.cities.find(c => c.value === cityValue);
      const provinceName = province ? province.label : '';
      const cityName = city ? city.label : '';
      return cityName ? `${provinceName}/${cityName}` : provinceName;
    },
    toggleStatus(account) {
      // 切换账号状态
      console.log(`账号 ${account.recipientName} 状态切换为: ${account.status}`);
      this.$dialog.toast({ 
        mes: `账号已${account.status === 'online' ? '上线' : '下线'}`, 
        icon: 'success' 
      });
      // 立即保存到localStorage
      this.saveToLocalStorage(account);
    },
    testAccount(account) {
      // 测试账号功能
      this.$dialog.toast({ 
        mes: '暂未开通权限', 
        icon: 'error' 
      });
    },
    saveAccountToDatabase(account) {
      // 保存账号到数据库
      console.log('保存账号到数据库:', account);
      // TODO: 实现真实的数据库保存逻辑
      // 这里可以使用 localStorage 模拟数据库存储
      const accounts = JSON.parse(localStorage.getItem('collectAccounts') || '[]');
      const existingIndex = accounts.findIndex(acc => acc.id === account.id);
      
      if (existingIndex > -1) {
        accounts[existingIndex] = account;
      } else {
        accounts.push(account);
      }
      
      localStorage.setItem('collectAccounts', JSON.stringify(accounts));
    },
    loadAccountsFromDatabase() {
      // 从localStorage加载账号
      const accounts = JSON.parse(localStorage.getItem('collectAccounts') || '[]');
      this.accountList = accounts;
    },
    // 添加账号弹窗相关方法
    closeAddAccountModal() {
      this.showAddAccountModal = false;
      this.isEditMode = false; // 重置编辑模式
      // 重置表单数据
      this.addAccountForm = {
        paymentType: 'wechat_scan',
        province: '',
        city: '',
        bankName: '',
        branchName: '',
        recipientName: '',
        account: '',
        accountId: '',
        maxAmount: 20000,
        qrCode: '',
        status: 'online'
      };
      this.cities = [];
    },
    onProvinceChange() {
      // 根据省份加载城市列表
      this.cities = [];
      this.addAccountForm.city = '';
      
      // 模拟城市数据
      const cityMap = {
        'beijing': [
          { value: 'dongcheng', label: '东城区' },
          { value: 'xicheng', label: '西城区' },
          { value: 'chaoyang', label: '朝阳区' },
          { value: 'haidian', label: '海淀区' }
        ],
        'shanghai': [
          { value: 'huangpu', label: '黄浦区' },
          { value: 'xuhui', label: '徐汇区' },
          { value: 'changning', label: '长宁区' },
          { value: 'jingan', label: '静安区' }
        ],
        'guangdong': [
          { value: 'guangzhou', label: '广州市' },
          { value: 'shenzhen', label: '深圳市' },
          { value: 'zhuhai', label: '珠海市' },
          { value: 'foshan', label: '佛山市' }
        ],
        'sichuan': [
          { value: 'chengdu', label: '成都市' },
          { value: 'mianyang', label: '绵阳市' },
          { value: 'deyang', label: '德阳市' },
          { value: 'nanchong', label: '南充市' },
          { value: 'yibin', label: '宜宾市' },
          { value: 'dazhou', label: '达州市' },
          { value: 'suining', label: '遂宁市' },
          { value: 'neijiang', label: '内江市' },
          { value: 'leshan', label: '乐山市' },
          { value: 'zigong', label: '自贡市' }
        ],
        'zhejiang': [
          { value: 'hangzhou', label: '杭州市' },
          { value: 'ningbo', label: '宁波市' },
          { value: 'wenzhou', label: '温州市' },
          { value: 'jiaxing', label: '嘉兴市' },
          { value: 'huzhou', label: '湖州市' },
          { value: 'shaoxing', label: '绍兴市' },
          { value: 'jinhua', label: '金华市' },
          { value: 'quzhou', label: '衢州市' },
          { value: 'zhoushan', label: '舟山市' },
          { value: 'taizhou', label: '台州市' },
          { value: 'lishui', label: '丽水市' }
        ],
        'jiangsu': [
          { value: 'nanjing', label: '南京市' },
          { value: 'wuxi', label: '无锡市' },
          { value: 'xuzhou', label: '徐州市' },
          { value: 'changzhou', label: '常州市' },
          { value: 'suzhou', label: '苏州市' },
          { value: 'nantong', label: '南通市' },
          { value: 'lianyungang', label: '连云港市' },
          { value: 'huaian', label: '淮安市' },
          { value: 'yancheng', label: '盐城市' },
          { value: 'yangzhou', label: '扬州市' },
          { value: 'zhenjiang', label: '镇江市' },
          { value: 'taizhou_js', label: '泰州市' },
          { value: 'suqian', label: '宿迁市' }
        ],
        'shandong': [
          { value: 'jinan', label: '济南市' },
          { value: 'qingdao', label: '青岛市' },
          { value: 'zibo', label: '淄博市' },
          { value: 'zaozhuang', label: '枣庄市' },
          { value: 'dongying', label: '东营市' },
          { value: 'yantai', label: '烟台市' },
          { value: 'weifang', label: '潍坊市' },
          { value: 'jining', label: '济宁市' },
          { value: 'taian', label: '泰安市' },
          { value: 'weihai', label: '威海市' },
          { value: 'rizhao', label: '日照市' },
          { value: 'linyi', label: '临沂市' },
          { value: 'dezhou', label: '德州市' },
          { value: 'liaocheng', label: '聊城市' },
          { value: 'binzhou', label: '滨州市' },
          { value: 'heze', label: '菏泽市' }
        ],
        'henan': [
          { value: 'zhengzhou', label: '郑州市' },
          { value: 'kaifeng', label: '开封市' },
          { value: 'luoyang', label: '洛阳市' },
          { value: 'pingdingshan', label: '平顶山市' },
          { value: 'anyang', label: '安阳市' },
          { value: 'hebi', label: '鹤壁市' },
          { value: 'xinxiang', label: '新乡市' },
          { value: 'jiaozuo', label: '焦作市' },
          { value: 'puyang', label: '濮阳市' },
          { value: 'xuchang', label: '许昌市' },
          { value: 'luohe', label: '漯河市' },
          { value: 'sanmenxia', label: '三门峡市' },
          { value: 'nanyang', label: '南阳市' },
          { value: 'shangqiu', label: '商丘市' },
          { value: 'xinyang', label: '信阳市' },
          { value: 'zhoukou', label: '周口市' },
          { value: 'zhumadian', label: '驻马店市' },
          { value: 'jiyuan', label: '济源市' }
        ],
        'hubei': [
          { value: 'wuhan', label: '武汉市' },
          { value: 'huangshi', label: '黄石市' },
          { value: 'shiyan', label: '十堰市' },
          { value: 'yichang', label: '宜昌市' },
          { value: 'xiangyang', label: '襄阳市' },
          { value: 'ezhou', label: '鄂州市' },
          { value: 'jingmen', label: '荆门市' },
          { value: 'xiaogan', label: '孝感市' },
          { value: 'jingzhou', label: '荆州市' },
          { value: 'huanggang', label: '黄冈市' },
          { value: 'xianning', label: '咸宁市' },
          { value: 'suizhou', label: '随州市' },
          { value: 'enshi', label: '恩施土家族苗族自治州' },
          { value: 'xiantao', label: '仙桃市' },
          { value: 'qianjiang', label: '潜江市' },
          { value: 'tianmen', label: '天门市' },
          { value: 'shennongjia', label: '神农架林区' }
        ],
        'fujian': [
          { value: 'fuzhou', label: '福州市' },
          { value: 'xiamen', label: '厦门市' },
          { value: 'putian', label: '莆田市' },
          { value: 'sanming', label: '三明市' },
          { value: 'quanzhou', label: '泉州市' },
          { value: 'zhangzhou', label: '漳州市' },
          { value: 'nanping', label: '南平市' },
          { value: 'longyan', label: '龙岩市' },
          { value: 'ningde', label: '宁德市' }
        ],
        'anhui': [
          { value: 'hefei', label: '合肥市' },
          { value: 'wuhu', label: '芜湖市' },
          { value: 'bengbu', label: '蚌埠市' },
          { value: 'huainan', label: '淮南市' },
          { value: 'maanshan', label: '马鞍山市' },
          { value: 'huaibei', label: '淮北市' },
          { value: 'tongling', label: '铜陵市' },
          { value: 'anqing', label: '安庆市' },
          { value: 'huangshan', label: '黄山市' },
          { value: 'chuzhou', label: '滁州市' },
          { value: 'fuyang', label: '阜阳市' },
          { value: 'suzhou_ah', label: '宿州市' },
          { value: 'liuan', label: '六安市' },
          { value: 'bozhou', label: '亳州市' },
          { value: 'chizhou', label: '池州市' },
          { value: 'xuancheng', label: '宣城市' }
        ],
        'jiangxi': [
          { value: 'nanchang', label: '南昌市' },
          { value: 'jingdezhen', label: '景德镇市' },
          { value: 'pingxiang', label: '萍乡市' },
          { value: 'jiujiang', label: '九江市' },
          { value: 'xinyu', label: '新余市' },
          { value: 'yingtan', label: '鹰潭市' },
          { value: 'ganzhou', label: '赣州市' },
          { value: 'jian', label: '吉安市' },
          { value: 'yichun_jx', label: '宜春市' },
          { value: 'fuzhou_jx', label: '抚州市' },
          { value: 'shangrao', label: '上饶市' }
        ],
        'hunan': [
          { value: 'changsha', label: '长沙市' },
          { value: 'zhuzhou', label: '株洲市' },
          { value: 'xiangtan', label: '湘潭市' },
          { value: 'hengyang', label: '衡阳市' },
          { value: 'shaoyang', label: '邵阳市' },
          { value: 'yueyang', label: '岳阳市' },
          { value: 'changde', label: '常德市' },
          { value: 'zhangjiajie', label: '张家界市' },
          { value: 'yiyang', label: '益阳市' },
          { value: 'chenzhou', label: '郴州市' },
          { value: 'yongzhou', label: '永州市' },
          { value: 'huaihua', label: '怀化市' },
          { value: 'loudi', label: '娄底市' },
          { value: 'xiangxi', label: '湘西土家族苗族自治州' }
        ],
        'guangxi': [
          { value: 'nanning', label: '南宁市' },
          { value: 'liuzhou', label: '柳州市' },
          { value: 'guilin', label: '桂林市' },
          { value: 'wuzhou', label: '梧州市' },
          { value: 'beihai', label: '北海市' },
          { value: 'fangchenggang', label: '防城港市' },
          { value: 'qinzhou', label: '钦州市' },
          { value: 'guigang', label: '贵港市' },
          { value: 'yulin_gx', label: '玉林市' },
          { value: 'baise', label: '百色市' },
          { value: 'hezhou', label: '贺州市' },
          { value: 'hechi', label: '河池市' },
          { value: 'laibin', label: '来宾市' },
          { value: 'chongzuo', label: '崇左市' }
        ],
        'hainan': [
          { value: 'haikou', label: '海口市' },
          { value: 'sanya', label: '三亚市' },
          { value: 'sansha', label: '三沙市' },
          { value: 'danzhou', label: '儋州市' },
          { value: 'wuzhishan', label: '五指山市' },
          { value: 'qionghai', label: '琼海市' },
          { value: 'wenchang', label: '文昌市' },
          { value: 'wanning', label: '万宁市' },
          { value: 'dongfang', label: '东方市' },
          { value: 'dingan', label: '定安县' },
          { value: 'tunchang', label: '屯昌县' },
          { value: 'chengmai', label: '澄迈县' },
          { value: 'lingao', label: '临高县' },
          { value: 'baisha', label: '白沙黎族自治县' },
          { value: 'changjiang', label: '昌江黎族自治县' },
          { value: 'ledong', label: '乐东黎族自治县' },
          { value: 'lingshui', label: '陵水黎族自治县' },
          { value: 'baoting', label: '保亭黎族苗族自治县' },
          { value: 'qiongzhong', label: '琼中黎族苗族自治县' }
        ],
        'chongqing': [
          { value: 'yuzhong', label: '渝中区' },
          { value: 'dadukou', label: '大渡口区' },
          { value: 'jiangbei', label: '江北区' },
          { value: 'shapingba', label: '沙坪坝区' },
          { value: 'jiulongpo', label: '九龙坡区' },
          { value: 'nanan', label: '南岸区' },
          { value: 'beibei', label: '北碚区' },
          { value: 'qijiang', label: '綦江区' },
          { value: 'dadukou_cq', label: '大足区' },
          { value: 'yubei', label: '渝北区' },
          { value: 'banan', label: '巴南区' },
          { value: 'wanzhou', label: '万州区' },
          { value: 'fuling', label: '涪陵区' },
          { value: 'qianjiang_cq', label: '黔江区' },
          { value: 'changshou', label: '长寿区' },
          { value: 'jiangjin', label: '江津区' },
          { value: 'hechuan', label: '合川区' },
          { value: 'yongchuan', label: '永川区' },
          { value: 'nanchuan', label: '南川区' },
          { value: 'bishan', label: '璧山区' },
          { value: 'tongliang', label: '铜梁区' },
          { value: 'rongchang', label: '荣昌区' },
          { value: 'kaizhou', label: '开州区' },
          { value: 'liangping', label: '梁平区' },
          { value: 'wulong', label: '武隆区' },
          { value: 'chengkou', label: '城口县' },
          { value: 'fengdu', label: '丰都县' },
          { value: 'dianjiang', label: '垫江县' },
          { value: 'zhongxian', label: '忠县' },
          { value: 'yunyang', label: '云阳县' },
          { value: 'fengjie', label: '奉节县' },
          { value: 'wushan', label: '巫山县' },
          { value: 'wuxi_cq', label: '巫溪县' },
          { value: 'shizhu', label: '石柱土家族自治县' },
          { value: 'xiushan', label: '秀山土家族苗族自治县' },
          { value: 'youyang', label: '酉阳土家族苗族自治县' },
          { value: 'pengshui', label: '彭水苗族土家族自治县' }
        ],
        'tianjin': [
          { value: 'heping', label: '和平区' },
          { value: 'hedong', label: '河东区' },
          { value: 'hexi', label: '河西区' },
          { value: 'nankai', label: '南开区' },
          { value: 'hebei_tj', label: '河北区' },
          { value: 'hongqiao', label: '红桥区' },
          { value: 'dongli', label: '东丽区' },
          { value: 'xiqing', label: '西青区' },
          { value: 'jinnan', label: '津南区' },
          { value: 'beichen', label: '北辰区' },
          { value: 'wuqing', label: '武清区' },
          { value: 'baodi', label: '宝坻区' },
          { value: 'binhai', label: '滨海新区' },
          { value: 'ninghe', label: '宁河区' },
          { value: 'jinghai', label: '静海区' },
          { value: 'jixian', label: '蓟州区' }
        ],
        'shanxi': [
          { value: 'taiyuan', label: '太原市' },
          { value: 'datong', label: '大同市' },
          { value: 'yangquan', label: '阳泉市' },
          { value: 'changzhi', label: '长治市' },
          { value: 'jincheng', label: '晋城市' },
          { value: 'shuozhou', label: '朔州市' },
          { value: 'jinzhong', label: '晋中市' },
          { value: 'yuncheng', label: '运城市' },
          { value: 'xinzhou', label: '忻州市' },
          { value: 'linfen', label: '临汾市' },
          { value: 'lvliang', label: '吕梁市' }
        ],
        'liaoning': [
          { value: 'shenyang', label: '沈阳市' },
          { value: 'dalian', label: '大连市' },
          { value: 'anshan', label: '鞍山市' },
          { value: 'fushun', label: '抚顺市' },
          { value: 'benxi', label: '本溪市' },
          { value: 'dandong', label: '丹东市' },
          { value: 'jinzhou_ln', label: '锦州市' },
          { value: 'yingkou', label: '营口市' },
          { value: 'fuxin', label: '阜新市' },
          { value: 'liaoyang', label: '辽阳市' },
          { value: 'panjin', label: '盘锦市' },
          { value: 'tieling', label: '铁岭市' },
          { value: 'chaoyang_ln', label: '朝阳市' },
          { value: 'huludao', label: '葫芦岛市' }
        ],
        'jilin': [
          { value: 'changchun', label: '长春市' },
          { value: 'jilin_jl', label: '吉林市' },
          { value: 'siping', label: '四平市' },
          { value: 'liaoyuan', label: '辽源市' },
          { value: 'tonghua', label: '通化市' },
          { value: 'baishan', label: '白山市' },
          { value: 'songyuan', label: '松原市' },
          { value: 'baicheng', label: '白城市' },
          { value: 'yanbian', label: '延边朝鲜族自治州' }
        ],
        'heilongjiang': [
          { value: 'harbin', label: '哈尔滨市' },
          { value: 'qiqihar', label: '齐齐哈尔市' },
          { value: 'jixi', label: '鸡西市' },
          { value: 'hegang', label: '鹤岗市' },
          { value: 'shuangyashan', label: '双鸭山市' },
          { value: 'daqing', label: '大庆市' },
          { value: 'yichun_hl', label: '伊春市' },
          { value: 'jiamusi', label: '佳木斯市' },
          { value: 'qitaihe', label: '七台河市' },
          { value: 'mudanjiang', label: '牡丹江市' },
          { value: 'heihe', label: '黑河市' },
          { value: 'suihua', label: '绥化市' },
          { value: 'daxinganling', label: '大兴安岭地区' }
        ],
        'yunnan': [
          { value: 'kunming', label: '昆明市' },
          { value: 'qujing', label: '曲靖市' },
          { value: 'yuxi', label: '玉溪市' },
          { value: 'baoshan', label: '保山市' },
          { value: 'zhaotong', label: '昭通市' },
          { value: 'lijiang', label: '丽江市' },
          { value: 'puer', label: '普洱市' },
          { value: 'lincang', label: '临沧市' },
          { value: 'chuxiong', label: '楚雄彝族自治州' },
          { value: 'honghe', label: '红河哈尼族彝族自治州' },
          { value: 'wenshan', label: '文山壮族苗族自治州' },
          { value: 'xishuangbanna', label: '西双版纳傣族自治州' },
          { value: 'dali', label: '大理白族自治州' },
          { value: 'dehong', label: '德宏傣族景颇族自治州' },
          { value: 'nujiang', label: '怒江傈僳族自治州' },
          { value: 'diqing', label: '迪庆藏族自治州' }
        ],
        'guizhou': [
          { value: 'guiyang', label: '贵阳市' },
          { value: 'liupanshui', label: '六盘水市' },
          { value: 'zunyi', label: '遵义市' },
          { value: 'anshun', label: '安顺市' },
          { value: 'bijie', label: '毕节市' },
          { value: 'tongren', label: '铜仁市' },
          { value: 'qianxinan', label: '黔西南布依族苗族自治州' },
          { value: 'qiandongnan', label: '黔东南苗族侗族自治州' },
          { value: 'qiannan', label: '黔南布依族苗族自治州' }
        ],
        'gansu': [
          { value: 'lanzhou', label: '兰州市' },
          { value: 'jiayuguan', label: '嘉峪关市' },
          { value: 'jinchang', label: '金昌市' },
          { value: 'baiyin', label: '白银市' },
          { value: 'tianshui', label: '天水市' },
          { value: 'wuwei', label: '武威市' },
          { value: 'zhangye', label: '张掖市' },
          { value: 'pingliang', label: '平凉市' },
          { value: 'jiuquan', label: '酒泉市' },
          { value: 'qingyang', label: '庆阳市' },
          { value: 'dingxi', label: '定西市' },
          { value: 'longnan', label: '陇南市' },
          { value: 'linxia', label: '临夏回族自治州' },
          { value: 'gannan', label: '甘南藏族自治州' }
        ],
        'qinghai': [
          { value: 'xining', label: '西宁市' },
          { value: 'haidong', label: '海东市' },
          { value: 'haibei', label: '海北藏族自治州' },
          { value: 'huangnan', label: '黄南藏族自治州' },
          { value: 'hainan_qh', label: '海南藏族自治州' },
          { value: 'guoluo', label: '果洛藏族自治州' },
          { value: 'yushu', label: '玉树藏族自治州' },
          { value: 'haixi', label: '海西蒙古族藏族自治州' }
        ],
        'ningxia': [
          { value: 'yinchuan', label: '银川市' },
          { value: 'shizuishan', label: '石嘴山市' },
          { value: 'wuzhong', label: '吴忠市' },
          { value: 'guyuan', label: '固原市' },
          { value: 'zhongwei', label: '中卫市' }
        ],
        'xinjiang': [
          { value: 'wulumuqi', label: '乌鲁木齐市' },
          { value: 'kelamayi', label: '克拉玛依市' },
          { value: 'tulufan', label: '吐鲁番市' },
          { value: 'hami', label: '哈密市' },
          { value: 'changji', label: '昌吉回族自治州' },
          { value: 'boertala', label: '博尔塔拉蒙古自治州' },
          { value: 'bayinguoleng', label: '巴音郭楞蒙古自治州' },
          { value: 'akesu', label: '阿克苏地区' },
          { value: 'kezilesu', label: '克孜勒苏柯尔克孜自治州' },
          { value: 'kashi', label: '喀什地区' },
          { value: 'hetian', label: '和田地区' },
          { value: 'yili', label: '伊犁哈萨克自治州' },
          { value: 'tacheng', label: '塔城地区' },
          { value: 'aletai', label: '阿勒泰地区' },
          { value: 'shihezi', label: '石河子市' },
          { value: 'alaer', label: '阿拉尔市' },
          { value: 'tumushuke', label: '图木舒克市' },
          { value: 'wujiaqu', label: '五家渠市' },
          { value: 'beitun', label: '北屯市' },
          { value: 'tieganlike', label: '铁门关市' },
          { value: 'shuanghe', label: '双河市' },
          { value: 'kekedala', label: '可克达拉市' },
          { value: 'kunyu', label: '昆玉市' },
          { value: 'huyanghe', label: '胡杨河市' }
        ],
        'xizang': [
          { value: 'lasa', label: '拉萨市' },
          { value: 'rikaze', label: '日喀则市' },
          { value: 'changdu', label: '昌都市' },
          { value: 'linzhi', label: '林芝市' },
          { value: 'shannan', label: '山南市' },
          { value: 'naqu', label: '那曲市' },
          { value: 'ali', label: '阿里地区' }
        ],
        'neimenggu': [
          { value: 'hohhot', label: '呼和浩特市' },
          { value: 'baotou', label: '包头市' },
          { value: 'wuhai', label: '乌海市' },
          { value: 'chifeng', label: '赤峰市' },
          { value: 'tongliao', label: '通辽市' },
          { value: 'eerduosi', label: '鄂尔多斯市' },
          { value: 'hulunbeier', label: '呼伦贝尔市' },
          { value: 'bayannaoer', label: '巴彦淖尔市' },
          { value: 'wulanchabu', label: '乌兰察布市' },
          { value: 'xinganmeng', label: '兴安盟' },
          { value: 'xilinguole', label: '锡林郭勒盟' },
          { value: 'alashan', label: '阿拉善盟' }
        ],
        'shaanxi': [
          { value: 'xian', label: '西安市' },
          { value: 'tongchuan', label: '铜川市' },
          { value: 'baoji', label: '宝鸡市' },
          { value: 'xianyang', label: '咸阳市' },
          { value: 'weinan', label: '渭南市' },
          { value: 'yanan', label: '延安市' },
          { value: 'hanzhong', label: '汉中市' },
          { value: 'yulin_sx', label: '榆林市' },
          { value: 'ankang', label: '安康市' },
          { value: 'shangluo', label: '商洛市' }
        ],
        'hebei': [
          { value: 'shijiazhuang', label: '石家庄市' },
          { value: 'tangshan', label: '唐山市' },
          { value: 'qinhuangdao', label: '秦皇岛市' },
          { value: 'handan', label: '邯郸市' },
          { value: 'xingtai', label: '邢台市' },
          { value: 'baoding', label: '保定市' },
          { value: 'zhangjiakou', label: '张家口市' },
          { value: 'chengde', label: '承德市' },
          { value: 'cangzhou', label: '沧州市' },
          { value: 'langfang', label: '廊坊市' },
          { value: 'hengshui', label: '衡水市' }
        ]
      };
      
      if (cityMap[this.addAccountForm.province]) {
        this.cities = cityMap[this.addAccountForm.province];
      }
    },
    uploadQrCode() {
      // 实现收款码上传
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // 这里可以添加上传到服务器的逻辑
          const reader = new FileReader();
          reader.onload = (e) => {
            this.addAccountForm.qrCode = e.target.result;
            this.$dialog.toast({ mes: '收款码上传成功', icon: 'success' });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    removeQrCode() {
      this.addAccountForm.qrCode = '';
      this.$dialog.toast({ mes: '收款码已删除', icon: 'success' });
    },
    submitAddAccount() {
      // 提交账号表单（添加或编辑）
      if (!this.validateForm()) {
        return;
      }
      
      if (this.isEditMode) {
        // 编辑模式：更新现有账号
        const accountIndex = this.accountList.findIndex(acc => acc.id === this.addAccountForm.id);
        if (accountIndex > -1) {
          // 更新账号信息
          this.accountList[accountIndex] = {
            ...this.accountList[accountIndex],
            type: this.currentPaymentTypeLabel,
            name: this.addAccountForm.recipientName,
            number: this.addAccountForm.account,
            ...this.addAccountForm
          };
          
          // 保存到localStorage
          this.saveToLocalStorage(this.accountList[accountIndex]);
          
          this.$dialog.toast({ mes: '账号更新成功', icon: 'success' });
        }
      } else {
        // 添加模式：创建新账号
        const newId = Date.now();
        const newAccount = {
          id: newId,
          type: this.currentPaymentTypeLabel,
          name: this.addAccountForm.recipientName,
          number: this.addAccountForm.account,
          minAmount: 0,
          yieldRate: 0,
          todayCount: 0,
          todayLimit: 0,
          commission: 0,
          successRate: 0,
          ...this.addAccountForm
        };
        
        // 添加到账号列表（立即更新界面）
        this.accountList.push(newAccount);
        
        // 保存到localStorage
        this.saveToLocalStorage(newAccount);
        
        this.$dialog.toast({ mes: '账号添加成功', icon: 'success' });
      }
      
      this.closeAddAccountModal();
    },
    validateForm() {
      // 表单验证
      if (!this.addAccountForm.recipientName) {
        this.$dialog.toast({ mes: '请输入收款姓名', icon: 'error' });
        return false;
      }
      if (!this.addAccountForm.account) {
        this.$dialog.toast({ mes: '请输入收款账号', icon: 'error' });
        return false;
      }
      if (this.needsQrCode && !this.addAccountForm.qrCode) {
        this.$dialog.toast({ mes: '请上传收款码', icon: 'error' });
        return false;
      }
      return true;
    },
    init() {
      window.physicsBackRouter = null;
      this.loadAccountData();
    },
    loadAccountData() {
      // 从localStorage加载账号数据
      this.loadFromLocalStorage();
    },
    loadFromLocalStorage() {
      // 从localStorage加载
      const accounts = JSON.parse(localStorage.getItem('collectAccounts') || '[]');
      this.accountList = accounts;
    },
    updateLocalStorage() {
      // 更新localStorage（用于删除等操作）
      localStorage.setItem('collectAccounts', JSON.stringify(this.accountList));
    },
    saveToLocalStorage(account) {
      // 保存单个账号到localStorage
      const accounts = JSON.parse(localStorage.getItem('collectAccounts') || '[]');
      const existingIndex = accounts.findIndex(acc => acc.id === account.id);
      
      if (existingIndex > -1) {
        accounts[existingIndex] = account;
      } else {
        accounts.push(account);
      }
      
      localStorage.setItem('collectAccounts', JSON.stringify(accounts));
    }
  },
  created() {
    this.init();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/base.scss";
@import "@/assets/scss/public.scss";

.collect-container {
  min-height: 100vh;
  background: white;
}

/* 顶部导航栏 */
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

/* 主内容区域 */
.main-content {
  padding-top: 80px;
  padding: 80px 0 20px;
  position: relative;
}

/* 支付类型选择区域 */
.payment-type-section {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  margin-top: 25px;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.payment-type-selector {
  flex: 1;
  position: relative;
}

.selector-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.selector-wrapper:hover {
  border-color: #007bff;
}

.selector-text {
  font-size: 14px;
  color: #333;
}

.selector-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
  
  &.open {
    transform: rotate(180deg);
  }
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 12px 15px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.selected {
    background: #007bff;
    color: white;
  }
}

.add-account-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  position: relative;
  z-index: 2;
  min-width: 100px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-account-btn:hover {
  background: #0056b3;
}

/* 账号列表区域 */
.account-list-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.account-list-header h3 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.account-count {
  font-size: 14px;
  color: #666;
}

.account-list {
  min-height: 200px;
}

/* 卡片式布局 */
.account-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.card-content {
  display: flex;
  padding: 20px;
  gap: 20px;
}

.card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-type {
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
}

.account-recipient {
  display: flex;
  align-items: center;
  gap: 8px;
}

.recipient-name {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.recipient-icon {
  font-size: 14px;
}

.account-qr {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qr-icon {
  font-size: 14px;
}

.account-min-amount,
.account-yield,
.account-today-count,
.account-number,
.account-id,
.account-location,
.account-max-amount,
.account-commission,
.account-success-rate {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.account-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.status-switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}

.status-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 20px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .switch-slider {
  background-color: #28a745;
}

input:checked + .switch-slider:before {
  transform: translateX(20px);
}

.status-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  justify-content: center;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
  min-width: 60px;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &.modify {
    color: #007bff;
    border-color: #007bff;
    
    &:hover {
      background: #007bff;
      color: white;
    }
  }
  
  &.delete {
    color: #dc3545;
    border-color: #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
    }
  }
  
  &.test {
    color: #fd7e14;
    border-color: #fd7e14;
    
    &:hover {
      background: #fd7e14;
      color: white;
    }
  }
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}

/* 无数据提示 */
.no-accounts {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.no-accounts-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.no-accounts-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.no-accounts-hint {
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding: 80px 0 15px;
  }
  
  .payment-type-section {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 15px;
    margin-top: 25px;
    padding: 0 15px;
  }
  
  .account-list-section {
    margin: 0 15px;
  }
  
  .add-account-btn {
    width: 100%;
    height: 48px;
    font-size: 16px;
  }
  
  .nav-text {
    font-size: 10px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .account-item {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .account-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .account-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 80px 0 10px;
  }
  
  .payment-type-section {
    padding: 0 10px;
    margin-bottom: 10px;
    margin-top: 15px;
  }
  
  .account-list-section {
    margin: 0 10px;
    padding: 15px;
  }
  
  .add-account-btn {
    height: 50px;
    font-size: 16px;
    font-weight: 600;
  }
  
  .account-list-section {
    padding: 15px;
  }
  
  .account-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .account-list-header h3 {
    font-size: 16px;
  }
  
  .account-count {
    font-size: 12px;
  }
  
  .account-name {
    font-size: 14px;
  }
  
  .account-number {
    font-size: 12px;
  }
  
  .action-btn {
    padding: 8px 12px;
    font-size: 11px;
  }
}

/* 添加账号弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #666;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.form-select,
.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.qr-upload-area {
  width: 120px;
  height: 120px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.3s ease;
}

.qr-upload-area:hover {
  border-color: #007bff;
  background: #f0f8ff;
}

.upload-icon {
  font-size: 32px;
  color: #999;
  font-weight: 300;
}

.qr-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

.qr-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-change-qr,
.btn-remove-qr {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s ease;
}

.btn-change-qr {
  color: #007bff;
  border-color: #007bff;
}

.btn-change-qr:hover {
  background: #007bff;
  color: white;
}

.btn-remove-qr {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-remove-qr:hover {
  background: #dc3545;
  color: white;
}

.status-options {
  display: flex;
  gap: 20px;
}

.status-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

.status-option input[type="radio"] {
  margin-right: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.status-dot.online {
  background-color: #28a745;
}

.status-dot.offline {
  background-color: #dc3545;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: center;
}

.submit-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background: #0056b3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 15px;
  }
  
  .qr-upload-area {
    width: 100px;
    height: 100px;
  }
  
  .upload-icon {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 100%;
    height: 100%;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .status-options {
    flex-direction: column;
    gap: 10px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 15px;
  }
}
</style>
