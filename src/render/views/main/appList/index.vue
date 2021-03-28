<template>
  <div class="app">
    <h1 class="app-title">
      应用
    </h1>

    <div class="app-list">
      <div v-for="(app, appIndex) in appList" class="app-list_item" :key="appIndex" @click="openApp(app)">
        <div class="app-list_item-left">
          <img :src="app.avatar" />
        </div>
        <div class="app-list_item-right">
          <div class="app-list_item-right--title">
            <span>{{ app.name }}</span>
          </div>
          <div class="app-list_item-right--desc">
            {{ app.desc }}
          </div>
        </div>
      </div>

      <webview src="C:\Users\onaug6th\Desktop\新建文件夹\index.html"></webview>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ipcRenderer } from 'electron';
import { defineComponent, onBeforeMount } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  setup() {
    const appList = [
      {
        id: 'a2s14d1s3q5f1e121fs',
        name: 'test',
        path: 'http://localhost:8080',
        avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
        desc: '测试'
      },
      {
        name: '便笺',
        avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
        desc: '桌面纸条便笺'
      },
      {
        name: '剪贴板',
        avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-extension-icon.4b79fb4.png',
        desc: '记录每一个重要的数据'
      },
      {
        name: '提醒',
        avatar: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        desc: '设置提醒'
      },
      {
        name: '待办事项',
        avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-miner.b78347c.png',
        desc: '即将完成的内容和已完成的内容'
      }
    ];

    /**
     * 打开应用
     */
    function openApp(app) {
      ipcRenderer.send('browser-app-open', app.id);
    }

    onBeforeMount(() => {
      console;
    });

    return {
      appList,
      openApp
    };
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
