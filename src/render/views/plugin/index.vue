<template>
  <div class="app">
    <Header />
    {{ minAppDetail.name }}
    <webview nodeintegration></webview>
  </div>
</template>

<script lang="ts">
// import { ipcRenderer } from 'electron';
import Header from '@render/components/header/index.vue';
import { ipcRenderer } from 'electron';
import { useRoute } from 'vue-router';
import { defineComponent, onMounted, reactive } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  name: 'plugin',
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    const { id, isDev } = route.query;
    let minAppDetail: any = reactive({});
    let webview: any;

    /**
     * 设置webView
     */
    function initWebView() {
      isDev && openWebViewDevTools();
      webview.removeEventListener('dom-ready', initWebView);
    }

    /**
     * 打开开发者工具
     */
    function openWebViewDevTools() {
      webview.openDevTools();
    }

    onMounted(() => {
      const event = isDev ? 'dev-plugin-detail-get' : 'plugin-detail-get';

      ipcRenderer.invoke(event, id).then(result => {
        minAppDetail = reactive(result);
        webview = document.querySelector('webview');

        if (minAppDetail.preload) {
          webview.setAttribute('preload', minAppDetail.preload);
        }
        webview.src = minAppDetail.main;
        webview.addEventListener('dom-ready', initWebView);
      });
    });

    return {
      minAppDetail
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
