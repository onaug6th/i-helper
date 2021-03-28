<template>
  <div class="app">
    <Header />

    <webview src="C:\Users\onaug6th\Desktop\新建文件夹\index.html"></webview>
  </div>
</template>

<script lang="ts">
// import { ipcRenderer } from 'electron';
import Header from '@render/components/header/index.vue';
import { defineComponent } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  components: {
    Header
  },
  setup() {
    return {};
  },
  mounted() {
    const webview = document.querySelector('webview');
    webview.addEventListener('dom-ready', () => {
      webview['openDevTools']();
    });
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
