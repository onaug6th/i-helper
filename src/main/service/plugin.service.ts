import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import pluginManage from '@/main/core/plugin/pluginManage';

//  打开指定应用的窗口
ipcMain.on('plugin-open', (event, id) => {
  return windowManage.createPluginBrowserWindow(id);
});

//  获取插件详情
ipcMain.handle('plugin-list-get', () => {
  return pluginManage.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginManage.getPlugin(id);
});
