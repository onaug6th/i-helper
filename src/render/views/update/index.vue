<template>
  <div class="update">
    <header>
      <div></div>
      <div>
        <i class="iconfont icon-close" @click="close"></i>
      </div>
    </header>
    <div v-if="state.isDownload" class="update-download">
      <div v-if="state.downloadStatus.percent === 100">
        <div class="download-title">
          下载完成，正在启动安装程序
        </div>
      </div>
      <template v-else>
        <div class="download-title">
          正在下载，请稍等...
        </div>
        <div class="download-progress">
          <div class="progress-track">
            <div class="progress-thumb"></div>
          </div>
          {{ state.downloadStatus.percent }}%
        </div>
        <div class="download-detail">
          <span> {{ state.downloadStatus.transferred }} / {{ state.downloadStatus.total }} </span>
          <span v-if="state.downloadStatus.speed" class="download-detail__speed">
            {{ state.downloadStatus.speed }}/s
          </span>
        </div>
      </template>
    </div>
    <div v-else class="update-main">
      <div class="update-title">发现新版本 {{ state.updateInfo.version }}</div>
      <v-md-preview :text="state.updateInfo.body"></v-md-preview>
      <div class="update-version">
        <span>当前版本：v{{ state.updateInfo.localVersion }} </span>

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
import { defineComponent, getCurrentInstance, reactive } from 'vue';

export default defineComponent({
  name: 'update',
  setup() {
    const { proxy }: any = getCurrentInstance();

    const state: any = reactive({
      isDownload: false,
      downloadStatus: {
        //  进度百分比
        percent: 0,
        //  已下载大小
        transferred: 0,
        //  文件总大小
        total: 0
      },
      updateInfo: {}
    });

    /**
     * 关闭
     */
    function close() {
      proxy.$ipcClient('update-win-close');
    }

    /**
     * 打开更多
     */
    function openMore() {
      proxy.$ipcClient('update-open-more');
    }

    /**
     * 下载更新包
     */
    async function download() {
      state.isDownload = true;
      try {
        await proxy.$ipcClient('update-download');
      } catch (error) {
        state.isDownload = false;
      }
    }

    proxy.$ipcClient('update-get-release').then(updateInfo => {
      state.updateInfo = updateInfo;
    });

    proxy.$ipcClientOn('update-download-progress', (event, downloadStatus) => {
      Object.assign(state.downloadStatus, downloadStatus);
    });

    return { state, close, openMore, download };
  }
});
</script>

<style lang="less" scoped>
@import './index.less';
</style>
