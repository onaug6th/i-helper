<template>
  <header class="header">
    <div class="header-left"></div>
    <div class="header-center"></div>
    <div class="header-right">
      <button class="icon flex-center" :title="isAlwaysOnTop ? '取消置顶' : '窗口置顶'" @click="toggleOnTop">
        <i class="iconfont flex-center" :class="isAlwaysOnTop ? 'icon-thepin-active' : 'icon-thepin'"></i>
      </button>

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
  emits: ['close'],
  setup(props, { emit }) {
    const store = useStore();
    const { windowId } = store.getters;

    const currentRouteName = ref(useRoute().name);
    //  是否置顶
    const isAlwaysOnTop = ref(false);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    /**
     * 切换置顶
     */
    function toggleOnTop() {
      //  主界面是否置顶
      ipcRenderer.send('browser-main-window-onTop', !isAlwaysOnTop.value);
      isAlwaysOnTop.value = !isAlwaysOnTop.value;
    }

    /**
     * 点击关闭
     */
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
      close,
      toggleOnTop,
      isAlwaysOnTop
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
