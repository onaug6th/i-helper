import { ipcMain } from 'electron';
import pluginService from '../plugin.service';

ipcMain.on('plugin-app', (event, method, ...args) => {
  pluginService.appApiHandler(event, method, ...args);
});

//  插件——数据库
ipcMain.on('plugin-db', async (event, method, ...args) => {
  pluginService.dbApiHandler(event, method, ...args);
});

ipcMain.on('plugin-clipboard', async (event, method, ...args) => {
  pluginService.clipboardApiHandler(event, method, ...args);
});
