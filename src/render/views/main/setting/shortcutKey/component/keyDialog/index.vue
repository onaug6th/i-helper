<template>
  <el-dialog title="请按下新的快捷键" v-model="visibleModel" width="50%">
    <span>{{ showText }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" :disabled="!key" @click="confirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import KeyDialog from './index';
export default KeyDialog;
</script>

<style lang="less" scoped></style>
