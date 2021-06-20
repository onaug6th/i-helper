<template>
  <div class="plugin">
    <h1 class="plugin-title">
      插件商店
      <el-button class="plugin-title_refresh" size="mini" @click="refresh">刷新插件商店</el-button>
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
            v-if="!plugin.isDownload"
            type="primary"
            icon="el-icon-download"
            circle
            size="mini"
            title="下载插件"
            @click.stop="download(plugin)"
          >
          </el-button>
          <!-- 更新 -->
        </div>
      </div>
    </div>
  </div>

  <Plugin-drawer v-model:visible="state.openDrawer" type="store" :plugin="currentPlugin" />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, getCurrentInstance, computed } from 'vue';
import PluginDrawer from '@/render/components/pluginDrawer/index.vue';

export default defineComponent({
  name: 'store',
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
          plugin.logoUrl = `http://${plugin.logoUrl}`;
          return plugin;
        })
      );
    }

    /**
     * 下载插件
     */
    async function download() {
      await proxy.$ipcClientLoading('store-download', currentPlugin.value.id);

      //  通知我的插件面板更新列表
      proxy.$eventBus.emit('installed-update');
      currentPlugin.value.isDownload = true;

      proxy.$notify({
        type: 'success',
        message: '下载成功'
      });
    }

    /**
     * 刷新插件列表
     */
    async function refresh() {
      getPluginList();
    }

    //  商店面板监听——插件删除
    proxy.$eventBus.on('store-plugin-del', pluginId => {
      state.pluginList.find(plugin => {
        if (plugin.id === pluginId) {
          plugin.isDownload = false;
        }
      });
    });

    onBeforeMount(() => {
      getPluginList();
    });

    return {
      state,
      currentPlugin,
      choosePlugin,
      download,
      refresh
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
