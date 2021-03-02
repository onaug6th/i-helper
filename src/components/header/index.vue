<template>
  <header class="header">
    <div class="header-left"></div>
    <div class="header-center"></div>
    <div class="header-right">
      <button class="icon flex-center close-window" @click="close" title="关闭">
        <i class="iconfont flex-center icon-close"></i>
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, ref } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  emits: ['option-click', 'close'],
  setup(props, { emit }) {
    props;
    emit;

    const store = useStore();
    const { windowId } = store.getters;

    const currentRouteName = ref(useRoute().name);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    const close = () => {
      ipcRenderer.send('browser-window-close', windowId);
    };

    return {
      currentRouteName,
      close
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
