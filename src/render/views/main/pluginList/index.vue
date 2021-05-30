<template>
  <div class="plugin">
    <h1 class="plugin-title">
      插件
    </h1>

    <div class="plugin-list">
      <div
        v-for="(plugin, appIndex) in state.pluginList"
        class="plugin-list_item"
        :key="appIndex"
        @click="choosePlugin(appIndex)"
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

  <Plugin-drawer v-model:visible="state.openDrawer" :plugin="currentPlugin" @remove="delPlugin" />
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { defineComponent, onBeforeMount, reactive, getCurrentInstance, computed } from 'vue';
import PluginDrawer from '@/render/components/pluginDrawer/index.vue';

export default defineComponent({
  components: {
    PluginDrawer
  },
  setup() {
    const { ctx }: any = getCurrentInstance();
    //  插件列表
    let state = reactive({
      //  打开抽屉
      openDrawer: false,
      //  插件列表
      pluginList: [],
      //  当前插件
      currentIndex: 0
    });

    //  当前插件
    const currentPlugin = computed(() => {
      return state.pluginList[state.currentIndex] || {};
    });

    /**
     * 打开插件
     * @param index
     */
    function choosePlugin(index: number) {
      state.openDrawer = true;
      state.currentIndex = index;
    }

    /**
     * 获取插件列表
     */
    function getPluginList() {
      ipcRenderer.invoke('plugin-list-get').then(result => {
        state.pluginList = reactive(result);
      });
    }

    /**
     * 删除插件
     */
    function delPlugin() {
      state.pluginList.splice(state.currentIndex, 1);
      state.openDrawer = false;
    }

    //  开发者面板监听——更新列表
    ctx.$eventBus.on('pluginList-add', plugin => {
      state.pluginList.push(plugin);
    });

    onBeforeMount(() => {
      getPluginList();
    });

    return {
      state,
      currentPlugin,
      choosePlugin,
      delPlugin
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
