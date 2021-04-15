import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import devManage from '@/main/core/dev/devManage';

//  打开指定的开发者插件的窗口
ipcMain.on('dev-open', (event, id) => {
  return windowManage.createPluginBrowserWindow(id);
});

//  获取开发者插件窗口
ipcMain.handle('dev-list-get', () => {
  return devManage.getPluginList();
});

//  新增开发者插件
ipcMain.handle('dev-plugin-add', (event, plugin) => {
  return devManage.addPlugin(plugin);
});
//  新增开发者插件
ipcMain.handle('dev-plugin-detail-get', (event, id) => {
  return devManage.getPlugin(id);
});

//  删除开发者插件
ipcMain.handle('dev-plugin-del', (event, id) => {
  return devManage.delPlugin(id);
});
