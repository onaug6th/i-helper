import { ipcMain } from 'electron';
import windowService from '@/main/modules/window/window.service';
import settingService from '@/main/modules/setting/setting.service';

//  关闭browserWindow
ipcMain.handle('browser-window-close', (event, windowId) => {
  if (windowId) {
    windowService.closeWindow(windowId);
  }
});

//  隐藏browserWindow
ipcMain.handle('browser-window-hide', (event, windowId) => {
  if (windowId) {
    windowService.hideWindow(windowId);
  }
});

//  主界面置顶切换
ipcMain.handle('browser-main-window-onTop', (event, onTop) => {
  windowService.mainWindow.setAlwaysOnTop(onTop);
  settingService.update('isAlwaysOnTop', onTop);
});

//  渲染进程间通信
ipcMain.handle('browser-window-communication', (event, { windowId, params, eventName }) => {
  const win = windowService.getWindowById(windowId);
  win.webContents.send(eventName, params);
});
