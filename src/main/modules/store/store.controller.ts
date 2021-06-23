import { ipcMain } from 'electron';
import storeService from './store.service';

//  获取插件列表
ipcMain.handle('store-list', () => {
  return storeService.pluginList;
});

//  插件下载
ipcMain.handle('store-download', (event, id) => {
  return storeService.download(id);
});
