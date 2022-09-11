<template>
  <div class="plugin-list">
    <div
      v-for="(plugin, pluginIndex) in state.pluginList"
      class="plugin-list_item"
      :key="pluginIndex"
      @click="clickPlugin(plugin)"
    >
      <div class="plugin-list_item-left">
        <div v-if="plugin.canUpdate" class="red-point" title="存在可用更新"></div>
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
          v-if="isInstalled"
          class="plugin-list_item-setting"
          icon="el-icon-setting"
          type="primary"
          size="mini"
          title="插件详情"
          @click.stop="choosePlugin(plugin.id)"
        >
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
    <el-empty style="flex: 1" v-if="!pluginList.length" title="将插件压缩包/配置文件拖入应用即可添加插件">
      <template #description>
        <slot name="empty">
          <div class="empty">
            暂无插件
          </div>
        </slot>
      </template>
    </el-empty>
  </div>

  <Plugin-drawer
    v-model:visible="state.openDrawer"
    v-bind="$attrs"
    :type="type"
    :plugin="currentPlugin"
    :isInstalled="isInstalled"
    :isStore="isStore"
    :isDev="isDev"
    @download="download(currentPlugin)"
  />
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
      type: Array as PropType<Array<TPlugin | StorePlugin>>,
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

    const isStore = computed(() => {
      return props.type === 'store';
    });

    const isDev = computed(() => {
      return props.type === 'dev';
    });

    const isInstalled = computed(() => {
      return props.type === 'installed';
    });

    /**
     * 点击插件
     * @param plugin
     */
    function clickPlugin(plugin: TPlugin) {
      if (isStore.value || isDev.value) {
        choosePlugin(plugin.id);
      } else {
        pluginStart(plugin);
      }
    }

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
    function pluginStart(plugin: TPlugin) {
      proxy.$ipcClient('plugin-start', plugin.id);
    }

    /**
     * 下载插件
     * @param plugin
     */
    async function download(plugin: TPlugin) {
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

      isStore,
      isDev,
      isInstalled,

      currentPlugin,

      clickPlugin,
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
