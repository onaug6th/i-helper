<template>
  <el-dialog title="注册账户" v-model="visibleModel" width="50%">
    <el-form ref="ruleForm" status-icon :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="rePassword">
        <el-input type="password" v-model="form.rePassword" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item class="submit-row">
        <el-button type="primary" @click="submitForm">注册</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import Register from './index';
export default Register;
</script>

<style lang="less" scoped>
.submit-row {
  text-align: center;
}
</style>
