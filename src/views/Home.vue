<template>
  <div class="home">
    <h1>开元支付</h1>
    <p>欢迎使用开元支付系统</p>
    <p>当前时间: {{ currentTime }}</p>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentTime: new Date().toLocaleString()
    }
  },
  mounted() {
    console.log('Home component mounted')
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}
h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}
p {
  color: #7f8c8d;
  margin: 10px 0;
}
</style>
