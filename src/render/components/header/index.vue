<template>
  <header class="header">
    <div class="header-left"></div>
    <div class="header-center"></div>
    <div class="header-right">
      <button class="icon" :title="isAlwaysOnTop ? '取消置顶' : '窗口置顶'" @click="toggleOnTop">
        <i class="iconfont" :class="isAlwaysOnTop ? 'icon-pin-fill' : 'icon-pin'"></i>
      </button>

      <button class="icon" title="最小化" @click="minimize">
        <i class="iconfont icon-minus"></i>
      </button>

      <button class="icon" :title="isFullScreen ? '向下还原' : '最大化'" @click="toggleFullScreen">
        <i class="iconfont" :class="isFullScreen ? 'icon-fullscreen-shrink' : 'icon-fullscreen-expand'"></i>
      </button>

      <button class="icon close-window" @click="close" title="关闭">
        <i class="iconfont icon-close"></i>
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import { computed, defineComponent, ref, getCurrentInstance } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    beforeClose: Function
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();
    const store = useStore();
    const { currentWindow, windowId, mainWindowId, setting } = store.getters;

    const currentRouteName = ref(useRoute().name);
    //  是否置顶
    const isAlwaysOnTop = ref(setting.common.isAlwaysOnTop);
    //  是否最大化
    const isFullScreen = ref(false);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    const isHome = computed(() => {
      return windowId === mainWindowId;
    });

    /**
     * 切换置顶
     */
    function toggleOnTop() {
      const afterValue = !isAlwaysOnTop.value;
      isAlwaysOnTop.value = afterValue;

      if (isHome.value) {
        //  主界面置顶
        proxy.$ipcClient('browser-main-window-onTop', afterValue);
        //  更新vuex中的设置
        store.dispatch('app/setNewestSetting');
      } else {
        currentWindow.setAlwaysOnTop(afterValue);
      }
    }

    /**
     * @desc 最小化
     */
    function minimize() {
      currentWindow.minimize();
    }

    /**
     * @desc 切换全屏
     */
    function toggleFullScreen() {
      if (isFullScreen.value) {
        currentWindow.unmaximize();
      } else {
        currentWindow.maximize();
      }
      isFullScreen.value = !isFullScreen.value;
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
        const eventName = isHome.value ? 'browser-window-hide' : 'browser-window-close';
        proxy.$ipcClient(eventName, windowId);
      }
    }

    return {
      currentRouteName,
      close,
      toggleOnTop,
      minimize,
      toggleFullScreen,
      isAlwaysOnTop,
      isFullScreen
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
