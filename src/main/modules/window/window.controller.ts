import { ipcMain } from 'electron';
import windowService from '@/main/modules/window/window.service';

//  切换打开主窗体
ipcMain.handle('window-main-toggle', () => {
  windowService.toggleMainWindow();
});

//  关闭窗体
ipcMain.handle('window-close', (event, windowId) => {
  if (windowId) {
    windowService.closeWindow(windowId);
  }
});

//  隐藏窗体
ipcMain.handle('window-hide', (event, windowId) => {
  if (windowId) {
    windowService.hideWindow(windowId);
  }
});
