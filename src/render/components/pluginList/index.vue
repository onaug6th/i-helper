<template>
  <div class="plugin-list">
    <div
      v-for="(plugin, pluginIndex) in state.pluginList"
      class="plugin-list_item"
      :key="pluginIndex"
      @click="choosePlugin(plugin.id)"
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
          @click.stop="pluginStart(plugin)"
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
    <el-empty
      v-if="!pluginList.length"
      description="暂无插件"
      title="将插件压缩包/配置文件拖入应用即可添加插件"
    ></el-empty>
  </div>

  <Plugin-drawer v-model:visible="state.openDrawer" v-bind="$attrs" :type="type" :plugin="currentPlugin" />
</template>

<script lang="ts">
import { getCurrentInstance, defineComponent, computed, reactive, ComputedRef, PropType } from 'vue';
import PluginDrawer from '../pluginDrawer/index.vue';

export default defineComponent({
  components: {
    PluginDrawer
  },
  props: {
    pluginList: {
      type: Array as PropType<Array<Plugin | StorePlugin>>,
      required: true
    },
    type: String
  },
  setup(props) {
    const { proxy }: any = getCurrentInstance();

    //  插件列表
    let state = reactive({
      //  打开抽屉
      openDrawer: false,
      //  插件列表
      pluginList: computed(() => props.pluginList),
      //  当前插件
      currentPluginId: ''
    });

    //  当前插件
    const currentPlugin: ComputedRef<any> = computed(() => {
      return state.pluginList.find(plugin => plugin.id === state.currentPluginId) || {};
    });

    /**
     * 打开插件
     * @param id
     */
    function choosePlugin(id: string) {
      state.openDrawer = true;
      state.currentPluginId = id;
    }

    /**
     * 打开插件
     * @param plugin
     */
    function pluginStart(plugin: Plugin) {
      proxy.$ipcClient('plugin-start', plugin.id);
    }

    /**
     * 下载插件
     * @param plugin
     */
    async function download(plugin: Plugin) {
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
      pluginStart,

      choosePlugin,
      download
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
