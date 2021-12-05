import { ComputedRef } from '@vue/reactivity';
import * as utils from '@/render/utils';
import { computed } from '@vue/runtime-core';

export default function usePlugin({
  isStore,
  plugin,
  proxy,
  visibleModel,
  isDev,
  emit,
  userId,
  state
}: {
  isStore: boolean;
  plugin: ComputedRef<any>;
  proxy: any;
  visibleModel: any;
  isDev: boolean;
  userId: ComputedRef<string>;
  emit: any;
  state: any;
}): any {
  const versionText = computed(() => {
    const [version, latestVersion] = isStore
      ? [plugin.value.localVersion, plugin.value.version]
      : [plugin.value.version, plugin.value.latestVersion];

    if (version && latestVersion && plugin.value.canUpdate) {
      return `本地版本：${version}，最新版本：${latestVersion}`;
    } else {
      return isStore ? latestVersion : version;
    }
  });
  /**
   * 下载插件
   */
  function downloadPlugin() {
    emit('download');
  }

  /**
   * 更新插件
   */
  async function updatePlugin() {
    await proxy.$ipcClient('plugin-update', plugin.value.id);
    proxy.$notify({
      type: 'success',
      message: '更新成功'
    });
    proxy.$eventBus.emit('installed-update');
    proxy.$eventBus.emit('store-plugin-update');
  }

  /**
   * 打开插件
   */
  function pluginStart() {
    proxy.$ipcClient('plugin-start', plugin.value.id, isDev);
    visibleModel.value = false;
  }

  /**
   * 重新加载插件
   */
  async function reload() {
    const result = await proxy.$ipcClient('dev-plugin-reload', plugin.value.id);
    proxy.$notify({
      type: 'success',
      message: '重新加载成功'
    });

    emit('reload', result);
  }

  /**
   * 打包插件
   */
  async function build() {
    await proxy.$ipcClient('dev-plugin-build', plugin.value.id);
    proxy.$notify({
      type: 'success',
      message: '打包成功'
    });
  }

  /**
   * 确认删除
   */
  async function confirmDel() {
    await proxy.$confirm('此操作将永久删除该插件, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    delPlugin();
  }

  /**
   * 删除插件
   */
  async function delPlugin() {
    const event = isDev ? 'dev-plugin-del' : 'plugin-del';
    await proxy.$ipcClient(event, plugin.value.id);
    visibleModel.value = false;

    proxy.$eventBus.emit('installed-update');
    proxy.$eventBus.emit('store-plugin-update');

    proxy.$notify({
      type: 'success',
      message: '删除成功'
    });

    //  更新商店面板
    if (isDev) {
      emit('remove', plugin);
    }
  }

  /**
   * 发布确认
   */
  async function publishConfirm() {
    if (!userId.value) {
      await proxy.$alert('请先登录账号', '提醒');
      return (state.showRegister = true);
    }
    const result = await proxy.$ipcClient('plugin-detail-server', plugin.value.id);
    if (result) {
      if (result.authorId !== userId.value) {
        return proxy.$alert('这个插件的作者不是当前账号哦', '提醒');
      }

      if (!utils.compareVersion(result.version, plugin.value.version)) {
        return proxy.$alert('发布的版本小于商店中已发布的版本，请将版本号升级后再试', '提醒');
      }
    }
    state.showDialog = true;
  }

  /**
   * 发布插件
   * @param desc
   */
  async function publish(desc: string) {
    const result = await proxy.$ipcClientLoading('dev-plugin-publish', plugin.value.id, desc);
    proxy.$notify({
      type: 'success',
      message: '提交审核成功'
    });

    proxy.$eventBus.emit('installed-update');
    proxy.$eventBus.emit('store-plugin-update');
    proxy.$eventBus.emit('dev-updateList');

    emit('publish', result);
  }

  /**
   * 在文件夹中查看
   */
  async function showInFolder() {
    await proxy.$ipcClient('dev-plugin-showInFolder', plugin.value.id);
  }

  /**
   * 更新json读取文件路径
   */
  async function updateJsonPath() {
    const result = await proxy.$ipcClient('dev-plugin-updateJsonPath', plugin.value.id);
    if (result) {
      proxy.$notify({
        type: 'success',
        message: '修改json读取路径成功'
      });
    }

    emit('reload', result);
  }

  return {
    versionText,

    downloadPlugin,
    updatePlugin,
    pluginStart,
    reload,
    build,
    confirmDel,
    publishConfirm,
    publish,
    showInFolder,
    updateJsonPath
  };
}
