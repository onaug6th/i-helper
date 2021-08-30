import { ipcMain } from 'electron';
import pluginService from '../plugin.service';

//  打开插件窗体
ipcMain.handle('plugin-start', (event, pluginId: string, isDev: boolean) => {
  pluginService.pluginStart(pluginId, { isDev });
});
