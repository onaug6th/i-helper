<template>
  <div>
    <h1 class="plugin-title">
      开发者模式
      <el-button type="primary" class="plugin-title_btn" size="mini" title="查看开发者文档" @click="openDocs">
        开发者文档
      </el-button>
    </h1>

    <Plugin-list type="dev" :pluginList="state.pluginList" @reload="reload" @remove="delPlugin" @publish="reload" />
  </div>
</template>

<script lang="ts">
import { getCurrentInstance, defineComponent, onBeforeMount, reactive } from 'vue';
import PluginList from '@/render/components/pluginList/index.vue';

export default defineComponent({
  name: 'dev',
  components: {
    PluginList
  },
  setup() {
    const { proxy }: any = getCurrentInstance();

    const state: any = reactive({
      //  插件列表
      pluginList: []
    });

    const findPluginIndex = ({ id }: { id: string }) =>
      state.pluginList.findIndex((plugin: Plugin) => plugin.id === id);

    /**
     * 重新加载插件
     * @param plugin
     */
    function reload(plugin: Plugin) {
      const index = findPluginIndex(plugin);
      state.pluginList[index] = plugin;
    }

    /**
     * 删除插件
     * @param index
     */
    function delPlugin(plugin: Plugin) {
      const index = findPluginIndex(plugin);
      state.pluginList.splice(index, 1);
      state.openDrawer = false;
    }

    /**
     * 打开文档
     */
    function openDocs() {
      proxy.$ipcClient('dev-open-docs');
    }

    /**
     * 获取应用列表
     */
    async function getDevPluginList() {
      const result = await proxy.$ipcClient('dev-list');
      state.pluginList = reactive(result);
    }

    /**
     * 开发者面板监听——更新列表
     * 1. 拖拽插件配置文件完成安装时
     * 2. 插件发布时
     */
    proxy.$eventBus.on('dev-updateList', () => {
      getDevPluginList();
    });

    onBeforeMount(() => {
      getDevPluginList();
    });

    return {
      state,

      openDocs,
      reload,
      delPlugin
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
