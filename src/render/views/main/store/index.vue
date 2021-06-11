<template>
  <div class="plugin">
    <h1 class="plugin-title">
      插件商店
    </h1>

    <div class="plugin-list">
      <div
        v-for="(plugin, appIndex) in state.pluginList"
        class="plugin-list_item"
        :key="appIndex"
        @click="choosePlugin(appIndex)"
      >
        <div class="plugin-list_item-left">
          <img :src="plugin.logoUrl" />
        </div>
        <div class="plugin-list_item-center">
          <div class="plugin-list_item-center--title">
            <span>{{ plugin.name }}</span>
          </div>
          <div class="plugin-list_item-center--desc">
            {{ plugin.desc }}
          </div>
        </div>
        <div class="plugin-list_item-right">
          <el-button
            type="primary"
            icon="el-icon-download"
            circle
            size="mini"
            title="下载"
            @click.stop="download(plugin)"
          ></el-button>
        </div>
      </div>
    </div>
  </div>

  <Plugin-drawer v-model:visible="state.openDrawer" :plugin="currentPlugin" @remove="delPlugin" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, getCurrentInstance, computed } from 'vue';
import PluginDrawer from '@/render/components/pluginDrawer/index.vue';

export default defineComponent({
  components: {
    PluginDrawer
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
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
    async function getPluginList() {
      const result = await proxy.$ipcClient('store-list');
      state.pluginList = reactive(
        result.map(plugin => {
          plugin.logoUrl = `//${plugin.logoUrl}`;
          return plugin;
        })
      );
    }

    /**
     * 删除插件
     */
    function delPlugin() {
      state.pluginList.splice(state.currentIndex, 1);
      state.openDrawer = false;
    }

    /**
     * 下载插件
     */
    async function download() {
      await proxy.$ipcClient('store-download', currentPlugin.value.id);
    }

    //  开发者面板监听——更新列表
    proxy.$eventBus.on('store-add', plugin => {
      state.pluginList.push(plugin);
    });

    onBeforeMount(() => {
      getPluginList();
    });

    return {
      state,
      currentPlugin,
      choosePlugin,
      delPlugin,
      download
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
