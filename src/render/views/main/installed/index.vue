<template>
  <div class="plugin">
    <h1 class="plugin-title">
      我的插件
    </h1>

    <Plugin-list type="installed" :pluginList="state.pluginList">
      <template #empty>
        <div class="empty">暂无插件，去<a @click="goStore">下载安装</a></div>
      </template>
    </Plugin-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import PluginList from '@/render/components/pluginList/index.vue';

export default defineComponent({
  name: 'installed',
  components: {
    PluginList
  },
  setup() {
    const { proxy }: any = getCurrentInstance();
    const router = useRouter();
    //  插件列表
    let state = reactive({
      //  插件列表
      pluginList: []
    });

    /**
     * 获取插件列表
     */
    async function getPluginList() {
      const result = await proxy.$ipcClient('plugin-list');
      state.pluginList = reactive(result);
    }

    /**
     * 跳转商店
     */
    function goStore() {
      router.push({
        path: '/store'
      });
    }

    /**
     * 已安装面板监听——更新列表
     * 1. 下载插件完成安装时
     * 2. 自行拖拽完成安装时
     * 3. 插件完成更新时
     * 4. 插件完成发布时
     */
    proxy.$eventBus.on('installed-update', () => {
      getPluginList();
    });

    onBeforeMount(() => {
      getPluginList();
    });

    return {
      state,
      goStore
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
