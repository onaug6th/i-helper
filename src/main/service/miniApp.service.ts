import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import miniAppManage from '@/main/core/miniApp/miniAppManage';

//  打开指定应用的窗口
ipcMain.on('miniApp-open', (event, id) => {
  return windowManage.createMiniAppBrowserWindow(id);
});

//  获取小程序详情
ipcMain.handle('miniApp-list-get', () => {
  return miniAppManage.getAppList();
});

//  获取小程序详情
ipcMain.handle('miniApp-detail-get', (event, id) => {
  return miniAppManage.getMiniApp(id);
});
