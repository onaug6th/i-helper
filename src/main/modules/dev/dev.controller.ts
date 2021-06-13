import { ipcMain } from 'electron';
import devService from './dev.service';

//  获取开发者插件窗口
ipcMain.handle('dev-list', () => {
  return devService.getPluginList();
});

//  新增开发者插件
ipcMain.handle('dev-plugin-add', (event, path) => {
  return devService.addPlugin(path);
});

//  获取开发者插件详情
ipcMain.handle('dev-plugin-detail-get', (event, id) => {
  return devService.getPlugin(id);
});

//  更新开发者插件
ipcMain.handle('dev-plugin-update', (event, id) => {
  return devService.updatePluginByJson(id);
});

//  打包开发者插件
ipcMain.handle('dev-plugin-build', (event, id) => {
  return devService.buildPlugin(id);
});

//  删除开发者插件
ipcMain.handle('dev-plugin-del', (event, id) => {
  return devService.delPlugin(id);
});

//  发布开发者插件
ipcMain.handle('dev-plugin-publish', (event, id, desc) => {
  return devService.publish(id, desc);
});

//  资源文件夹中显示
ipcMain.handle('dev-plugin-showInFolder', (event, id) => {
  return devService.showInFolder(id);
});
