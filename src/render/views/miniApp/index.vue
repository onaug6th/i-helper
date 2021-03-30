<template>
  <div class="app">
    <Header />
    {{ minAppDetail.name }}
    <webview src="C:\Users\onaug6th\Desktop\新建文件夹\index.html"></webview>
  </div>
</template>

<script lang="ts">
// import { ipcRenderer } from 'electron';
import Header from '@render/components/header/index.vue';
import { ipcRenderer } from 'electron';
import { useRoute } from 'vue-router';
import { defineComponent, onBeforeMount, onMounted, reactive } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  name: 'miniApp',
  components: {
    Header
  },
  setup() {
    const route = useRoute();
    let minAppDetail: any = reactive({});
    let webview: any;

    /**
     * 设置webView
     */
    function setWebView() {
      webview.openDevTools();
      webview.src = minAppDetail.path;
      webview.removeEventListener('dom-ready', setWebView);
    }

    onBeforeMount(() => {
      ipcRenderer.invoke('miniApp-detail-get', route.query.id).then(result => {
        minAppDetail = reactive(result);
      });
    });

    onMounted(() => {
      webview = document.querySelector('webview');
      webview.addEventListener('dom-ready', setWebView);
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
