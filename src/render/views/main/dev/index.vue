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

  <el-drawer v-model="state.openDrawer" :title="currentPlugin.name" size="40%" direction="rtl">
    <div class="drawer">
      <div class="drawer-row">
        <div class="drawer-row__title">
          插件ID
        </div>
        <div class="drawer-row__value">
          {{ currentPlugin.id }}
        </div>
      </div>

      <div class="drawer-row">
        <div class="drawer-row__title">
          版本号
        </div>
        <div class="drawer-row__value">
          {{ currentPlugin.version }}
        </div>
      </div>

      <div class="drawer-row">
        <div class="drawer-row__title">
          插件路径
        </div>
        <div class="drawer-row__value">
          {{ currentPlugin.main }}
        </div>
      </div>

      <div class="drawer-row">
        <div class="drawer-row__title">
          操作
        </div>
        <div>
          <el-button type="primary" size="small" title="启动开发者插件" @click="openPlugin">启动</el-button>
          <el-button type="success" size="small" title="将插件打包并上传到插件中心" @click="build">打包</el-button>
          <el-button type="warning" size="small" title="重新读取json配置文件并更新信息" @click="reload">
            重新加载
          </el-button>
          <el-button type="danger" plain size="small" title="删除插件" @click="delPlugin">删除</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { getCurrentInstance, computed, defineComponent, onBeforeMount, reactive } from 'vue';
import { ElNotification } from 'element-plus';

export default defineComponent({
  setup() {
    const { ctx }: any = getCurrentInstance();

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
    function choosePlugin(index) {
      state.openDrawer = true;
      state.currentIndex = index;
    }

    /**
     * 打开插件
     */
    function openPlugin() {
      ipcRenderer.send('plugin-open', currentPlugin.value.id, true);
    }

    /**
     * 重新加载插件
     */
    function reload() {
      ipcRenderer.invoke('dev-plugin-update', currentPlugin.value.id).then(plugin => {
        state.pluginList[state.currentIndex] = plugin;
        ElNotification({
          type: 'success',
          message: '更新成功'
        });
      });
    }

    /**
     * 打包插件
     */
    function build() {
      ipcRenderer.invoke('dev-plugin-build', currentPlugin.value.id).then(success => {
        ElNotification({
          type: success ? 'success' : 'error',
          message: success ? '打包成功' : '打包失败'
        });
      });
    }

    /**
     * 删除插件
     * @param index
     */
    function delPlugin() {
      ipcRenderer.invoke('dev-plugin-del', currentPlugin.value.id);
      state.pluginList.splice(state.currentIndex, 1);
      state.openDrawer = false;
      ElNotification({
        type: 'success',
        message: '删除成功'
      });
    }

    /**
     * 获取应用列表
     */
    function getAppList() {
      ipcRenderer.invoke('dev-list-get').then(result => {
        state.pluginList = reactive(result);
      });
    }

    // 监听-如果有新任务则播放音效
    ctx.$eventBus.on('dev-updateList', () => {
      getAppList();
    });

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,
      currentPlugin,
      choosePlugin,
      openPlugin,
      delPlugin,
      build,
      reload
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
