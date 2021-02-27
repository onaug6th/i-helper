//  创建窗口
import { BrowserWindow, remote } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/config/browserWindow';

export const createBrowserWindow = (type = 'main', path: string): BrowserWindow => {
  let window: BrowserWindow | null;
  const option = browserWindowOptions[type];

  const BrowserFn = type === 'main' ? BrowserWindow : remote.BrowserWindow;
  window = new BrowserFn(option);

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }

  window.loadURL(`${winURL}/#/${path}`);

  window.on('closed', () => {
    window = null;
  });
  return window;
};

/**
 * 打开主界面窗口
 */
export const createMainBrowserWindow = (): BrowserWindow => {
  return createBrowserWindow('main', '');
};

/**
 * 打开便笺窗口
 * @param uid 便笺的uid
 */
export const createNoteBrowserWindow = (uid?: string): BrowserWindow => {
  return createBrowserWindow('note', `note/${uid}`);
};

/**
 * 关闭窗口
 */
export const closeWindow = (): void => {
  remote.getCurrentWindow().close();
};
