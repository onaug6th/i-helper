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
  props: {
    beforeClose: Function
  },
  emits: ['option-click', 'close'],
  setup(props, { emit }) {
    const store = useStore();
    const { windowId } = store.getters;

    const currentRouteName = ref(useRoute().name);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    async function close() {
      emit('close');
      const { beforeClose } = props;
      if (beforeClose) {
        await beforeClose();
      }
      if (windowId) {
        const eventName = windowId === 1 ? 'browser-window-hide' : 'browser-window-close';
        ipcRenderer.send(eventName, windowId);
      }
    }

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
