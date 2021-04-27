<template>
  <div class="app">
    <Header />
    {{ plugin.name }}
    <webview nodeintegration></webview>
  </div>
</template>

<script lang="ts">
// import { ipcRenderer } from 'electron';
import Header from '@render/components/header/index.vue';
import { ipcRenderer } from 'electron';
import { useRoute } from 'vue-router';
import { defineComponent, onMounted, reactive } from 'vue';

export default defineComponent({
  name: 'plugin',
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    const { id, isDev } = route.query;
    let plugin: any = reactive({});
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
        plugin = reactive(result);
        webview = document.querySelector('webview');

        if (plugin.preload) {
          webview.setAttribute('preload', plugin.preload);
        }
        webview.src = plugin.main;
        webview.addEventListener('dom-ready', initWebView);
      });
    });

    return {
      plugin
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
