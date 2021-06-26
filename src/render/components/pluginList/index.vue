<template>
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
          v-if="type === 'installed' || plugin.isDownload"
          type="primary"
          size="mini"
          title="启动插件"
          @click.stop="openPlugin(plugin)"
        >
          启动
        </el-button>

        <el-button
          v-if="type === 'store' && !plugin.isDownload"
          type="primary"
          icon="el-icon-download"
          circle
          size="mini"
          title="下载插件"
          @click.stop="download(plugin)"
        >
        </el-button>
      </div>
    </div>
  </div>

  <Plugin-drawer v-model:visible="state.openDrawer" v-bind="$attrs" :type="type" :plugin="currentPlugin" />
</template>

<script lang="ts">
import { getCurrentInstance, defineComponent, computed, reactive, ComputedRef } from 'vue';
import PluginDrawer from '../pluginDrawer/index.vue';

export default defineComponent({
  components: {
    PluginDrawer
  },
  props: {
    pluginList: Array,
    type: String
  },
  setup(props) {
    const { proxy }: any = getCurrentInstance();

    //  插件列表
    let state = reactive({
      //  打开抽屉
      openDrawer: false,
      pluginList: computed(() => props.pluginList),
      //  当前插件
      currentIndex: 0
    });

    //  当前插件
    const currentPlugin: ComputedRef<any> = computed(() => {
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
     * 打开插件
     * @param plugin
     */
    function openPlugin(plugin) {
      proxy.$ipcClient('plugin-open', plugin.id);
    }

    /**
     * 下载插件
     * @param plugin
     */
    async function download(plugin) {
      await proxy.$ipcClientLoading('store-download', plugin.id);

      //  通知我的插件面板更新列表
      proxy.$eventBus.emit('installed-update');
      //  通知商店面板更新列表
      proxy.$eventBus.emit('store-plugin-update');

      proxy.$notify({
        type: 'success',
        message: '下载成功'
      });
    }

    return {
      state,
      currentPlugin,
      openPlugin,

      choosePlugin,
      download
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
