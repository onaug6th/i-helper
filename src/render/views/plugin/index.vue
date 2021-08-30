<template>
  <div v-if="state.showHeader">
    <Header :title="state.title" :isDev="state.isDev" :btns="state.headerBtns" @add="add" />
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
    const query = useRoute().query;

    const pluginId = query.id;
    const isDev = Boolean(query.isDev);
    const name = query.name as string;
    const header = JSON.parse(query.header as string);

    const state = reactive({
      //  窗体标题
      title: header.title ? name : '',
      //  展示头部栏
      showHeader: header.show,
      //  头部栏按钮配置
      headerBtns: header.btns ? header.btns : null,
      //  是否开发者模式
      isDev: Boolean(isDev)
    });

    //  窗体程序的标题
    if (name) {
      document.title = name;
    }

    //  监听标题更新事件
    proxy.$ipcClientOn('plugin-update-title', (event, title) => {
      state.title = title;
    });

    /**
     * 头部栏点击新增按钮
     */
    function add() {
      proxy.$ipcClient('plugin-btn', 'add', pluginId);
    }

    return { state, add };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
