<template>
  <el-dialog title="发布插件" v-model="visibleModel" width="50%">
    <div class="content">请输入插件的简单介绍，方便我们快速审核通过</div>
    <el-input v-model="desc" type="textarea" autocomplete="off" :rows="4"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :disabled="!desc" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import PublishDialog from './index';
export default PublishDialog;
</script>

<style lang="less" scoped>
.content {
  margin-bottom: 10px;
}
</style>
