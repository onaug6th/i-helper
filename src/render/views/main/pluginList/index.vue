<template>
  <div class="plugin">
    <h1 class="plugin-title">
      插件
    </h1>

    <div class="plugin-list">
      <div
        v-for="(plugin, appIndex) in state.appList"
        class="plugin-list_item"
        :key="appIndex"
        @click="openApp(plugin)"
      >
        <div class="plugin-list_item-left">
          <img :src="plugin.logo" />
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
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, onBeforeMount, reactive, getCurrentInstance } from 'vue';

export default defineComponent({
  setup() {
    const { ctx }: any = getCurrentInstance();
    //  插件列表
    let state = reactive({
      appList: []
    });

    /**
     * 打开插件
     * @param plugin
     */
    function openApp(plugin) {
      ipcRenderer.send('plugin-open', plugin.id);
    }

    /**
     * 获取插件列表
     */
    function getAppList() {
      ipcRenderer.invoke('plugin-list-get').then(result => {
        state.appList = reactive(result);
      });
    }

    //  开发者面板监听——更新列表
    ctx.$eventBus.on('pluginList-add', plugin => {
      state.appList.push(plugin);
    });

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
