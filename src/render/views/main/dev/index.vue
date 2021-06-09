<template>
  <div>
    <h1 class="plugin-title">
      开发者模式
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

  <Plugin-drawer
    v-model:visible="state.openDrawer"
    :plugin="currentPlugin"
    :isDev="true"
    @reload="reload"
    @remove="delPlugin"
    @publish="publish"
  />
</template>

<script lang="ts">
import { getCurrentInstance, computed, defineComponent, onBeforeMount, reactive } from 'vue';
import PluginDrawer from '@/render/components/pluginDrawer/index.vue';

export default defineComponent({
  components: {
    PluginDrawer
  },
  setup() {
    const { proxy }: any = getCurrentInstance();

    const state: any = reactive({
      //  插件列表
      pluginList: [],
      //  打开抽屉
      openDrawer: false,
      //  当前插件
      currentIndex: 0
    });

    //  当前插件
    const currentPlugin = computed(() => {
      return state.pluginList[state.currentIndex] || {};
    });

    /**
     * 选择插件
     * @param index
     */
    function choosePlugin(index: number) {
      state.openDrawer = true;
      state.currentIndex = index;
    }

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
      const result = await proxy.$ipcClient('dev-list-get');
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
      currentPlugin,
      choosePlugin,

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
