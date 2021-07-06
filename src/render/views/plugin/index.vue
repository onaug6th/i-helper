<template>
  <div>
    <Header :title="state.title" />
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
    const state = reactive({
      //  窗体标题
      title: ''
    });
    const route = useRoute();
    const { title } = route.query;

    if (title) {
      document.title = title as string;
    }

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
