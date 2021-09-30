<template>
  <div class="plugin">
    <h1 class="plugin-title">
      插件商店
      <el-button class="plugin-title_refresh" size="mini" @click="refresh">刷新插件商店</el-button>
    </h1>

    <Plugin-list type="store" :pluginList="state.pluginList" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, getCurrentInstance } from 'vue';
import PluginList from '@/render/components/pluginList/index.vue';

export default defineComponent({
  name: 'store',
  components: {
    PluginList
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    //  插件列表
    let state = reactive({
      //  插件列表
      pluginList: []
    });

    /**
     * 获取插件列表
     *
     * 调用此函数的行为：
     * 1. 下载插件
     * 2. 手动点击刷新
     * 3. 插件删除
     * 4. 默认调用
     *
     * 其中1，3，4。主线程预先完成，根据商店/已安装的插件信息的插件初始化
     * （拉取商店的数据，插件service对比商店的数据信息，商店service更新已安装插件的标记，获取插件列表）
     * 所以调用 'store-list' 会直接获得已经更新完的商店列表数据
     *
     * 2则会重新完成整个初始化的过程，才获取到数据
     * @param forceUpdate 强制更新
     */
    async function getPluginList(forceUpdate = false) {
      const fn = forceUpdate ? proxy.$ipcClientLoading : proxy.$ipcClient;

      const result = await fn('store-list', forceUpdate);

      if (forceUpdate) {
        proxy.$notify({
          type: 'success',
          message: '刷新成功'
        });

        proxy.$eventBus.emit('dev-updateList');
      }

      state.pluginList = reactive(
        result.map(plugin => {
          plugin.logo = `http://${plugin.logo}`;
          return plugin;
        })
      );
    }

    /**
     * 刷新插件列表
     */
    async function refresh() {
      getPluginList(true);
    }

    /**
     * 商店面板监听——列表更新
     * 1. 插件删除后
     * 2. 插件发布后
     * 3. 插件完成更新时
     * 4. 插件下载后
     */
    proxy.$eventBus.on('store-plugin-update', () => {
      getPluginList();
    });

    onBeforeMount(() => {
      getPluginList();
    });

    return {
      state,
      refresh
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
