<template>
  <div class="app">
    <h1 class="app-title">
      应用
    </h1>

    <div class="app-list">
      <div v-for="(app, appIndex) in state.appList" class="app-list_item" :key="appIndex" @click="openApp(app)">
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
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, onBeforeMount, reactive } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  setup() {
    //  应用列表
    let state = reactive({
      appList: []
    });

    /**
     * 打开应用
     */
    function openApp(app) {
      ipcRenderer.send('miniApp-open', app.id);
    }

    /**
     * 获取应用列表
     */
    function getAppList() {
      ipcRenderer.invoke('miniApp-list-get').then(result => {
        state.appList = reactive(result);
      });
    }

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,
      openApp
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
