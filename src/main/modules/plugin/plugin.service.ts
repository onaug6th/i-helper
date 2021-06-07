import { ipcMain } from 'electron';
//  插件管理
import pluginManage from './plugin.controller';
import './services/pluginApi';
import './services/pluginWin';

//  获取插件列表
ipcMain.handle('plugin-list-get', () => {
  return pluginManage.getPluginList();
});

//  获取插件详情
ipcMain.handle('plugin-detail-get', (event, id) => {
  return pluginManage.getPlugin(id);
});

//  安装插件
ipcMain.handle('plugin-install', (event, path) => {
  return pluginManage.installPlugin(path);
});

ipcMain.handle('plugin-del', (event, id) => {
  return pluginManage.delPlugin(id);
});
