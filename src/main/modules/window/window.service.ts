import { ipcMain } from 'electron';
import windowManage from '@/main/modules/window/window.controller';
import settingManage from '@/main/modules/setting/setting.controller';

//  关闭browserWindow
ipcMain.handle('browser-window-close', (event, windowId) => {
  if (windowId) {
    windowManage.closeWindow(windowId);
  }
});

//  隐藏browserWindow
ipcMain.handle('browser-window-hide', (event, windowId) => {
  if (windowId) {
    windowManage.hideWindow(windowId);
  }
});

//  主界面置顶切换
ipcMain.handle('browser-main-window-onTop', (event, onTop) => {
  windowManage.mainWindow.setAlwaysOnTop(onTop);
  settingManage.setSetting('common.isAlwaysOnTop', onTop);
});

//  渲染进程间通信
ipcMain.handle('browser-window-communication', (event, { windowId, params, eventName }) => {
  const win = windowManage.findWindowById(windowId);
  win.webContents.send(eventName, params);
});
