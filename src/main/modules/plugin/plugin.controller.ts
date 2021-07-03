import { ipcMain } from 'electron';
//  插件管理
import pluginService from './plugin.service';
import './controllers/plugin-api.controller';
import './controllers/plugin-win.controller';

//  获取插件列表
ipcMain.handle('plugin-list', () => {
  return pluginService.pluginList;
});

//  从服务器中获取插件信息
ipcMain.handle('plugin-detail-server', (event, id) => {
  return pluginService.getPluginFromServer(id);
});

//  获取插件详情
ipcMain.handle('plugin-detail', (event, id) => {
  return pluginService.getPlugin(id);
});

//  插件更新
ipcMain.handle('plugin-update', (event, id) => {
  return pluginService.updatePlugin(id);
});

//  安装插件
ipcMain.handle('plugin-install', (event, path) => {
  return pluginService.installPlugin(path);
});

//  插件删除
ipcMain.handle('plugin-del', (event, id) => {
  return pluginService.delPlugin(id);
});
