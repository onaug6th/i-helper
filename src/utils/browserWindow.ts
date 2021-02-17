// 创建窗口
import { BrowserWindow } from 'electron';
import { browserWindowOptions, winURL } from '@/config/browserWindow';

export const createBrowserWindow = (type = 'bootstrap', url = '/'): BrowserWindow => {
  let window: BrowserWindow | null;
  window = new BrowserWindow(browserWindowOptions[type].option);

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }

  window.loadURL(`${winURL}/#${url}`);

  window.on('closed', () => {
    window = null;
  });
  return window;
};
