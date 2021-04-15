<template>
  <div
    class="plugin"
    :class="pluginClassName"
    @drop.prevent="drop"
    @dragover.prevent="drapOver"
    @dragleave.prevent="drapLeave"
  >
    <h1 class="plugin-title">
      开发者模式
    </h1>

    <div class="plugin-list">
      <div
        v-for="(plugin, appIndex) in state.pluginList"
        class="plugin-list_item"
        :key="appIndex"
        @click="choosePlugin(plugin)"
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

  <el-drawer v-model="state.openDrawer" :title="state.currentPlugin.name" size="40%" direction="rtl">
    <div class="drawer">
      <div class="drawer-row">
        <div class="drawer-row__title">
          启动插件
        </div>
        <div>
          <el-button type="primary" size="small" @click="openPlugin(state.currentPlugin)">启动</el-button>
        </div>
      </div>

      <div class="drawer-row">
        <div class="drawer-row__title">
          打包
        </div>
        <div>
          <el-button size="small">打包</el-button>
        </div>
      </div>

      <div class="drawer-row">
        <div class="drawer-row__title">
          删除插件
        </div>
        <div>
          <el-button type="danger" plain size="small" @click="delPlugin">删除</el-button>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron';
import { computed, defineComponent, onBeforeMount, reactive } from 'vue';

export default defineComponent({
  setup() {
    const state: any = reactive({
      //  插件列表
      pluginList: [],
      //  打开抽屉
      openDrawer: false,
      //  当前插件
      currentPlugin: {},
      //  拖拽经过
      isDragOver: false
    });

    const pluginClassName = computed(() => {
      const className = [];
      if (state.isDragOver) {
        className.push('isDragOver');
      }
      return className;
    });

    /**
     * 选择插件
     */
    function choosePlugin(plugin) {
      state.openDrawer = true;
      state.currentPlugin = plugin;
    }

    /**
     * 打开插件
     */
    function openPlugin(plugin) {
      ipcRenderer.send('plugin-open', plugin.id);
    }

    /**
     * 删除插件
     */
    function delPlugin(index) {
      ipcRenderer.invoke('dev-plugin-del', state.currentPlugin.id);
      state.pluginList.slice(index, 1);
    }

    /**
     * 获取应用列表
     */
    function getAppList() {
      ipcRenderer.invoke('dev-list-get').then(result => {
        state.pluginList = reactive(result);
      });
    }

    /**
     * 文件放下
     */
    function drop(event) {
      state.isDragOver = false;

      //  拖拽进来的文件
      const files = Array.prototype.slice.call(event.dataTransfer.files);
      //  网络路径
      const uriList = event.dataTransfer.getData('text/uri-list');
      //  拖拽进来的文字
      const text = event.dataTransfer.getData('text/plain');

      uriList;
      text;

      files.forEach(file => {
        //  为插件的描述文件
        if (file.name === 'plugin.json') {
          const fileObj = {
            name: file.name,
            path: file.path
          };

          ipcRenderer.invoke('dev-plugin-add', fileObj).then(result => {
            state.pluginList.push(result);
          });
        }
      });
    }

    /**
     * 拖拽经过
     */
    function drapOver() {
      state.isDragOver = true;
    }

    /**
     * 拖拽离开
     */
    function drapLeave() {
      state.isDragOver = false;
    }

    onBeforeMount(() => {
      getAppList();
    });

    return {
      state,
      pluginClassName,
      choosePlugin,
      openPlugin,
      delPlugin,
      drop,
      drapOver,
      drapLeave
    };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
