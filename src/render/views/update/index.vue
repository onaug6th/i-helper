<template>
  <div class="update">
    <header>
      <div></div>
      <div>
        <i class="iconfont icon-close" @click="close"></i>
      </div>
    </header>
    <div class="update-main">
      <div class="update-title">发现新版本 v{{ state.version }}</div>
      <ul class="update-list">
        <li v-for="(updateItem, index) in state.updateList" :key="index">{{ index + 1 }}. {{ updateItem }}</li>
      </ul>
      <div class="update-version">
        <span>当前版本：v{{ state.localVersion }} </span>

        <span class="update-version__more" @click="openMore">更多</span>
      </div>

      <div class="update-btn">
        <el-button round size="small" @click="close">暂不更新</el-button>
        <el-button type="primary" round size="small" @click="download">立即下载</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'update',
  setup() {
    const { proxy }: any = getCurrentInstance();
    const { isDev } = useRoute().query;
    const state = reactive({
      canUpdate: false,
      updateList: [],
      name: '',
      version: '',
      localVersion: '',
      more: '',
      isDev
    });

    function close() {
      proxy.$ipcClient('update-win-close');
    }

    function openMore() {
      state.more;
    }

    function download() {
      proxy.$ipcClient('update-download');
    }

    proxy.$ipcClient('get-update-info').then(({ canUpdate, updateList, name, version, localVersion, more }) => {
      state.canUpdate = canUpdate;
      state.updateList = updateList;
      state.name = name;
      state.version = version;
      state.localVersion = localVersion;
      state.more = more;
    });

    return { state, close, openMore, download };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
