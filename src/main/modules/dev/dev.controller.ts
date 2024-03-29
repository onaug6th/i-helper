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
ipcMain.handle('dev-plugin-detail', (event, id) => {
  return devService.getPlugin(id);
});

//  重载开发者插件
ipcMain.handle('dev-plugin-reload', (event, id) => {
  return devService.reload(id);
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
ipcMain.handle('dev-plugin-publish', (event, id, auditDesc) => {
  return devService.publish(id, auditDesc);
});

//  资源文件夹中显示
ipcMain.handle('dev-plugin-showInFolder', (event, id) => {
  return devService.showInFolder(id);
});

//  更新json读取文件路径
ipcMain.handle('dev-plugin-updateJsonPath', (event, id) => {
  return devService.updateJsonPath(id);
});

//  更新json读取文件路径
ipcMain.handle('dev-plugin-devTools', (event, windowId) => {
  return devService.toggleDevTools(windowId);
});

//  打开开发者文档站点
ipcMain.handle('dev-open-docs', () => {
  return devService.openDocs();
});
