<template>
  <div v-if="state.showHeader">
    <Header :title="state.title" :isDev="state.isDev" :btns="state.headerBtns" />
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import Header from '@render/components/header/index.vue';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'plugin',
  components: {
    Header
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const { id, isDev } = useRoute().query;
    const state = reactive({
      //  窗体标题
      title: '',
      //  展示头部栏
      showHeader: true,
      //  头部栏按钮配置
      headerBtns: null,
      //  是否开发者模式
      isDev: Boolean(isDev)
    });

    proxy.$ipcClient(state.isDev ? 'dev-plugin-detail' : 'plugin-detail', id).then(plugin => {
      const { name, noTitle, noHeader, header } = plugin;
      if (name) {
        document.title = name;
      }

      if (!noTitle) {
        state.title = name;
      }

      if (noHeader) {
        state.showHeader = false;
      }

      if (header) {
        if (header.btns) {
          state.headerBtns = header.btns;
        }
      }
    });

    proxy.$ipcClientOn('plugin-update-title', (event, title) => {
      state.title = title;
    });

    return { state };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
