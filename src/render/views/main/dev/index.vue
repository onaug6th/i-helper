<template>
  <div>
    <h1 class="plugin-title">
      开发者模式
    </h1>

    <Plugin-list type="dev" :pluginList="state.pluginList" @reload="reload" @remove="delPlugin" @publish="publish" />
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

    /**
     * 重新加载插件
     * @param plugin
     */
    function reload(plugin) {
      state.pluginList[state.currentIndex] = plugin;
    }

    /**
     * 删除插件
     * @param index
     */
    function delPlugin() {
      state.pluginList.splice(state.currentIndex, 1);
      state.openDrawer = false;
    }
    /**
     * 获取应用列表
     */
    async function getAppList() {
      const result = await proxy.$ipcClient('dev-list');
      state.pluginList = reactive(result);
    }

    //  开发者面板监听——更新列表
    proxy.$eventBus.on('dev-updateList', () => {
      getAppList();
    });

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,

      reload,
      delPlugin,
      publish: reload
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
