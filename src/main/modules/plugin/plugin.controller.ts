import { ipcMain } from 'electron';
//  插件管理
import pluginService from './plugin.service';
import './controllers/pluginApi';
import './controllers/pluginWin';

//  获取插件列表
ipcMain.handle('plugin-list', () => {
  return pluginService.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginService.getPlugin(id);
});

//  安装插件
ipcMain.handle('plugin-install', (event, path) => {
  return pluginService.installPlugin(path);
});

//  插件删除
ipcMain.handle('plugin-del', (event, id) => {
  return pluginService.delPlugin(id);
});
