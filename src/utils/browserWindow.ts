// 创建窗口
import { BrowserWindow, remote } from 'electron';
import { browserWindowOptions, winURL } from '@/config/browserWindow';

export const createBrowserWindow = (type = 'bootstrap'): BrowserWindow => {
  let window: BrowserWindow | null;
  const { path, option } = browserWindowOptions[type];
  window = new remote.BrowserWindow(option);

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }

  window.loadURL(`${winURL}/#${path}`);

  window.on('closed', () => {
    window = null;
  });
  return window;
};
