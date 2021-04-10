<template>
  <div
    class="plugin"
    :class="pluginClassName"
    @drop.prevent="drop"
    @dragover.prevent="drapOver"
    @dragleave.prevent="drapLeave"
  >
    <h1 class="plugin-title">
      开发者模式
    </h1>

    <div class="plugin-list">
      <div
        v-for="(plugin, appIndex) in state.pluginList"
        class="plugin-list_item"
        :key="appIndex"
        @click="openApp(plugin)"
      >
        <div class="plugin-list_item-left">
          <img :src="plugin.avatar" />
        </div>
        <div class="plugin-list_item-right">
          <div class="plugin-list_item-right--title">
            <span>{{ plugin.name }}</span>
          </div>
          <div class="plugin-list_item-right--desc">
            {{ plugin.desc }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-drawer v-model="state.openDrawer" :title="state.currentPlugin.name" size="40%" direction="rtl">
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
import { computed, defineComponent, onBeforeMount, reactive } from 'vue';
// import { useRoute } from 'vue-router';
// import { ipcRenderer } from 'electron';
// import { uuid } from '@render/utils';
// import dayjs from 'dayjs';
// import RightMenu from '@render/components/rightMenu/src/rightMenu';

export default defineComponent({
  setup() {
    const state = reactive({
      //  插件列表
      pluginList: [],
      //  打开抽屉
      openDrawer: false,
      //  当前插件
      currentPlugin: {},
      //  拖拽经过
      isDragOver: false
    });

    const pluginClassName = computed(() => {
      const className = [];
      if (state.isDragOver) {
        className.push('isDragOver');
      }
      return className;
    });

    /**
     * 打开应用
     */
    function openApp(plugin) {
      state.openDrawer = true;
      state.currentPlugin = plugin;
    }

    /**
     * 获取应用列表
     */
    function getAppList() {
      ipcRenderer.invoke('dev-list-get').then(result => {
        state.pluginList = reactive(result);
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
      state.isDragOver = true;
    }

    /**
     * 拖拽离开
     */
    function drapLeave() {
      state.isDragOver = false;
    }

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,
      pluginClassName,
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
