import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import devManage from '@/main/core/dev/devManage';

//  打开指定的开发者小程序的窗口
ipcMain.on('dev-open', (event, id) => {
  return windowManage.createMiniAppBrowserWindow(id);
});

//  获取开发者小程序窗口
ipcMain.handle('dev-list-get', () => {
  return devManage.getAppList();
});
