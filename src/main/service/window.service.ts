import { ipcMain } from 'electron';
import windowManage from '@/main/core/window/windowManage';
import settingManage from '@/main/core/setting/settingManage';
//  打开browserWindow
ipcMain.on('browser-window-open', (event, result) => {
  const { type, params } = result;
  if (type === 'note') {
    windowManage.createNoteBrowserWindow(...params);
  }
});

//  关闭browserWindow
ipcMain.on('browser-window-close', (event, windowId) => {
  if (windowId) {
    windowManage.closeWindow(windowId);
  }
});

//  隐藏browserWindow
ipcMain.on('browser-window-hide', (event, windowId) => {
  if (windowId) {
    windowManage.hideWindow(windowId);
  }
});

//  主界面置顶切换
ipcMain.on('browser-main-window-onTop', (event, onTop) => {
  windowManage.mainWindow.setAlwaysOnTop(onTop);
  settingManage.setSetting('common.isAlwaysOnTop', onTop);
});

//  渲染进程间通信
ipcMain.on('browser-window-communication', (event, { windowId, params, eventName }) => {
  const { win } = windowManage.findWindowById(windowId);
  win.webContents.send(eventName, params);
});
