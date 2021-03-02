//  创建窗口
import { ipcMain } from 'electron';
import { closeWindow, createNoteBrowserWindow } from '@/utils/browserWindow';

ipcMain.on('browser-window-open', (event, result) => {
  const { type, params } = result;
  if (type === 'note') {
    createNoteBrowserWindow(...params);
  }
});

ipcMain.on('browser-window-close', (event, windowId) => {
  if (windowId) {
    closeWindow(windowId);
  }
});
