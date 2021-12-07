<template>
  <div class="search">
    <el-input v-model="state.searchKey" placeholder="搜索内容" />
    <div class="search-logo" @click="openMain">
      <img src="@/../public/icon.png" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'search',
  setup() {
    const { proxy }: any = getCurrentInstance();

    const state: any = reactive({
      searchKey: ''
    });

    /**
     * 关闭
     */
    function close() {
      proxy.$ipcClient('search-win-close');
    }

    /**
     * 打开主面板
     */
    function openMain() {
      proxy.$ipcClient('window-main-toggle');
    }

    return { state, openMain, close };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
