import { ipcMain } from 'electron';
import devManage from '@/main/core/dev/devManage';

//  获取开发者插件窗口
ipcMain.handle('dev-list-get', () => {
  return devManage.getPluginList();
});

//  新增开发者插件
ipcMain.handle('dev-plugin-add', (event, plugin) => {
  return devManage.addPlugin(plugin);
});

//  获取开发者插件详情
ipcMain.handle('dev-plugin-detail-get', (event, id) => {
  return devManage.getPlugin(id);
});

//  删除开发者插件
ipcMain.handle('dev-plugin-del', (event, id) => {
  return devManage.delPlugin(id);
});
