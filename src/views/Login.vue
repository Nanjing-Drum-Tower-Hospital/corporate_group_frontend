<template>
  <div class="login-page">
    <el-aside class="login-graphic">
      <h2>南京鼓楼医院集团公司</h2>
      <p>管理系统</p>

    </el-aside>
    <el-container class="login-container">
      <el-form @submit.native.prevent="onLogin" class="login-form" ref="loginForm" :model="loginData" label-position="top">
        <h1>登录</h1>
        <el-form-item label="用户名">
          <el-input v-model="loginData.username" placeholder="admin or test"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginData.password" placeholder="admin or test"></el-input>
        </el-form-item>
        <div class="form-actions">
          <el-button type="primary" @click="onLogin">登录</el-button>
          <el-button @click="onClear" type="danger">清空</el-button>
        </div>
      </el-form>
    </el-container>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "login",
  data() {
    return {
      loginData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    onLogin() {
      this.$router.replace({name:"mainPage"})
      console.log('Login data:', this.loginData);
    },
    onClear() {
      this.$refs.loginForm.resetFields();
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
}

.login-graphic {
  flex-basis: 50%;
  background-color: #324157;
  color: #fff;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-container {
  flex-basis: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 300px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-actions {
  text-align: right;
}
</style>
