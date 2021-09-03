<template>
  <header class="header">
    <div class="header-left">
      <div v-if="title" class="header-left__title">
        <span>{{ title }}</span>
      </div>
    </div>
    <div class="header-center"></div>
    <div class="header-right">
      <button v-if="isDev" class="icon" title="开发者工具" @click="toggleDevTools">
        <i class="iconfont icon-code"></i>
      </button>

      <button
        v-if="hasBtn('pin')"
        class="icon"
        :title="state.isAlwaysOnTop ? '取消置顶' : '窗口置顶'"
        @click="toggleOnTop"
      >
        <i class="iconfont" :class="state.isAlwaysOnTop ? 'icon-pin-fill' : 'icon-pin'"></i>
      </button>

      <template v-if="hasBtn('resize')">
        <button class="icon" title="最小化" @click="minimize">
          <i class="iconfont icon-minus"></i>
        </button>

        <button class="icon" :title="state.isFullScreen ? '向下还原' : '最大化'" @click="toggleFullScreen">
          <i class="iconfont" :class="state.isFullScreen ? 'icon-fullscreen-shrink' : 'icon-fullscreen-expand'"></i>
        </button>
      </template>

      <template v-if="hasBtn('close')">
        <button class="icon close-window" @click="close" title="关闭">
          <i class="iconfont icon-close"></i>
        </button>
      </template>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, reactive, getCurrentInstance, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  props: {
    title: String,
    beforeClose: Function,
    isDev: Boolean,
    btns: Array
  },
  emits: ['close'],
  setup(props, { emit }) {
    const { proxy }: any = getCurrentInstance();

    const store = useStore();
    const { currentWindow, windowId, mainWindowId, setting } = store.getters;

    const state = reactive({
      //  是否主面板
      isMainWindow: windowId === mainWindowId,
      //  是否置顶
      isAlwaysOnTop: setting.isAlwaysOnTop,
      //  是否最大化
      isFullScreen: false,
      //  默认按钮
      defaultBtns: ['pin', 'resize', 'close']
    });

    //  展示的按钮
    const showBtns = computed(() => {
      return props.btns || state.defaultBtns;
    });

    //  是否拥有指定按钮
    function hasBtn(btn: string): boolean {
      return showBtns.value.includes(btn);
    }

    /**
     * 切换开发者工具
     */
    function toggleDevTools() {
      proxy.$ipcClient('dev-plugin-devTools', windowId);
    }

    /**
     * 切换置顶
     */
    function toggleOnTop() {
      const afterValue = !state.isAlwaysOnTop;
      state.isAlwaysOnTop = afterValue;

      if (state.isMainWindow) {
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
      if (state.isFullScreen) {
        currentWindow.unmaximize();
      } else {
        currentWindow.maximize();
      }
      state.isFullScreen = !state.isFullScreen;
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
        const eventName = state.isMainWindow ? 'browser-window-hide' : 'browser-window-close';
        proxy.$ipcClient(eventName, windowId);
      }
    }

    return {
      state,
      showBtns,
      hasBtn,

      toggleDevTools,

      toggleOnTop,

      minimize,
      toggleFullScreen,

      close
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
