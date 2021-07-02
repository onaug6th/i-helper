<template>
  <div>
    <Header :title="state.title" />
  </div>
</template>

<script lang="ts">
import Header from '@render/components/header/index.vue';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'plugin',
  components: {
    Header
  },
  setup() {
    let state = reactive({
      //  窗体标题
      title: ''
    });
    const { proxy }: any = getCurrentInstance();

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
