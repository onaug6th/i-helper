<template>
  <el-dialog v-model="visibleModel" width="50%">
    <template #title>
      <span class="register" :class="isLogin ? '' : 'active'" @click="switchType('register')">注册账户</span>|
      <span class="login" :class="isLogin ? 'active' : ''" @click="switchType('login')">登录账户</span>
    </template>
    <el-form v-if="isLogin" ref="ruleForm" status-icon :model="loginForm" :rules="rules" label-width="80px">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="loginForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          autocomplete="off"
          @keydown.enter="loginSubmit"
        ></el-input>
      </el-form-item>

      <div class="submit-row">
        <el-button type="primary" @click="loginSubmit">登录</el-button>
      </div>
    </el-form>

    <el-form v-else ref="ruleForm" status-icon :model="registerForm" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="registerForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input
          type="password"
          v-model="registerForm.rePassword"
          autocomplete="off"
          @keydown.enter="registerSubmit"
        ></el-input>
      </el-form-item>

      <div class="submit-row">
        <el-button type="primary" @click="registerSubmit">注册</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import Register from './register';
export default Register;
</script>

<style lang="less" scoped>
.submit-row {
  text-align: center;
}

.register,
.login {
  cursor: pointer;
}

.register {
  margin-right: 5px;
}
.active {
  color: #66b1ff;
}
</style>
