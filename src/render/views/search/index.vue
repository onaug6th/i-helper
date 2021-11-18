<template>
  <div class="search"></div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'search',
  setup() {
    const { proxy }: any = getCurrentInstance();

    const state: any = reactive({
      isDownload: false
    });

    /**
     * 关闭
     */
    function close() {
      proxy.$ipcClient('search-win-close');
    }

    return { state, close };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
