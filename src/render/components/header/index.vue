<template>
  <header class="header">
    <div class="header-left">
      <span>{{ title }}</span>
    </div>
    <div class="header-center"></div>
    <div class="header-right">
      <button v-if="isDevPluginWindow" class="icon" title="开发者工具" @click="toggleDevTools">
        <i class="iconfont icon-code"></i>
      </button>

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
    title: String,
    beforeClose: Function
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();

    const store = useStore();
    const { currentWindow, windowId, mainWindowId, setting } = store.getters;

    const route = useRoute();
    const currentRouteName = ref(route.name);

    //  是否置顶
    const isAlwaysOnTop = ref(setting.isAlwaysOnTop);
    //  是否最大化
    const isFullScreen = ref(false);

    onBeforeRouteUpdate((to, from, next) => {
      currentRouteName.value = to.name;
      next();
    });

    const isMainWindow = computed(() => {
      return windowId === mainWindowId;
    });

    const isDevPluginWindow = computed(() => {
      return currentRouteName.value === 'plugin' && route.query.isDev;
    });

    /**
     * 切换开发者工具
     */
    function toggleDevTools() {
      //  主界面置顶
      proxy.$ipcClient('dev-plugin-devTools', windowId);
    }

    /**
     * 切换置顶
     */
    function toggleOnTop() {
      const afterValue = !isAlwaysOnTop.value;
      isAlwaysOnTop.value = afterValue;

      if (isMainWindow.value) {
        //  主界面置顶
        proxy.$ipcClient('browser-main-window-onTop', afterValue);
        //  更新vuex中的设置
        store.dispatch('app/setSetting');
      } else {
        currentWindow.setAlwaysOnTop(afterValue);
      }
    }

    /**
     * 最小化
     */
    function minimize() {
      currentWindow.minimize();
    }

    /**
     * 切换全屏
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
        const eventName = isMainWindow.value ? 'browser-window-hide' : 'browser-window-close';
        proxy.$ipcClient(eventName, windowId);
      }
    }

    return {
      toggleDevTools,
      isDevPluginWindow,

      isAlwaysOnTop,
      toggleOnTop,

      minimize,
      isFullScreen,
      toggleFullScreen,

      close
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
