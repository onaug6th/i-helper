import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import MiniAppManage from '@/main/core/miniApp/miniAppManage';

//  打开指定应用的窗口
ipcMain.on('miniApp-open', () => {
  windowManage.createAppBrowserWindow({ name: 'onaug6th', url: 'http://localhost:8080' });
});

//  获取小应用列表
ipcMain.handle('miniApp-list-get', () => {
  return MiniAppManage.getAppList();
});
