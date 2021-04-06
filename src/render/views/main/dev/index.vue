<template>
  <div class="app" @drop.prevent="drop" @dragover.prevent="drapOver" @dragleave.prevent="drapLeave">
    <h1 class="app-title">
      开发者模式
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

  <el-drawer v-model="state.openDrawer" :title="state.currentApp.name" size="40%" direction="rtl">
    <div>
      <div>
        打包
      </div>
      <div>
        删除
      </div>
    </div>
  </el-drawer>
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
      appList: [],
      openDrawer: false,
      currentApp: {}
    });

    /**
     * 打开应用
     */
    function openApp(app) {
      state.openDrawer = true;
      state.currentApp = app;
    }

    /**
     * 获取应用列表
     */
    function getAppList() {
      ipcRenderer.invoke('dev-list-get').then(result => {
        state.appList = reactive(result);
      });
    }

    /**
     * 文件放下
     */
    function drop() {
      console;
    }

    /**
     * 拖拽经过
     */
    function drapOver() {
      console;
    }

    /**
     * 拖拽离开
     */
    function drapLeave() {
      console;
    }

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,
      openApp,
      drop,
      drapOver,
      drapLeave
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
