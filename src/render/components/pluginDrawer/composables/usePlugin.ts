import { ComputedRef } from '@vue/reactivity';

export default function usePlugin({
  plugin,
  proxy,
  visibleModel,
  isDev,
  isInstalled,
  emit,
  state
}: {
  plugin: ComputedRef<any>;
  proxy: any;
  visibleModel: any;
  isDev: ComputedRef<boolean>;
  isInstalled: ComputedRef<boolean>;
  emit: any;
  state: any;
}): any {
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
  function openPlugin() {
    proxy.$ipcClient('plugin-open', plugin.value.id, isDev.value);
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
    const event = isDev.value ? 'dev-plugin-del' : 'plugin-del';
    await proxy.$ipcClient(event, plugin.value.id);
    visibleModel.value = false;

    //  更新商店面板
    if (isInstalled.value) {
      proxy.$eventBus.emit('store-plugin-update');
    }

    proxy.$notify({
      type: 'success',
      message: '删除成功'
    });

    emit('remove', plugin);
  }

  /**
   * 发布确认
   */
  function publishConfirm() {
    if (plugin.value.version === plugin.value.publishVerson) {
      return proxy.$alert('发布的版本与上次发布的版本一致，请将版本号升级后再试', '提醒');
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
      message: '发布成功'
    });

    proxy.$eventBus.emit('installed-update');
    proxy.$eventBus.emit('store-plugin-update');

    emit('publish', result);
  }

  /**
   * 在文件夹中查看
   */
  async function showInFolder() {
    await proxy.$ipcClient('dev-plugin-showInFolder', plugin.value.id);
  }

  return {
    updatePlugin,
    openPlugin,
    reload,
    build,
    confirmDel,
    publishConfirm,
    publish,
    showInFolder
  };
}
