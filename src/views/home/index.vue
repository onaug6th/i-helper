<template>
  <Header />
  <el-menu
    default-active="1-4-1"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    :collapse="true"
  >
    <el-submenu index="1">
      <template #title>
        <i class="el-icon-location"></i>
        <span>导航一</span>
      </template>
      <el-menu-item-group>
        <template #title>分组一</template>
        <el-menu-item index="1-1">选项1</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group title="分组2">
        <el-menu-item index="1-3">选项3</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="2">
      <i class="el-icon-menu"></i>
      <template #title>剪贴板历史</template>
    </el-menu-item>
    <el-menu-item index="3" disabled>
      <i class="el-icon-document"></i>
      <template #title>提醒功能</template>
    </el-menu-item>
    <el-menu-item index="4">
      <i class="el-icon-setting"></i>
      <template #title>待办事项</template>
    </el-menu-item>
    <el-menu-item index="5">
      <i class="el-icon-setting"></i>
      <template #title>文件夹快速复制</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Header from '@/components/header/index.vue';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    const isCollapse = ref(true);

    return {
      isCollapse,
      handleOpen(key: string, keyPath: string) {
        console.log(key, keyPath);
      },
      handleClose(key: string, keyPath: string) {
        console.log(key, keyPath);
      }
    };
  }
});
</script>

<style lang="less" scoped></style>
