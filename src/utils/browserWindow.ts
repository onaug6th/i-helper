//  创建窗口
import { BrowserWindow, ipcMain } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/config/browserWindow';

interface CreateBrowserWindowParams {
  type: string;
  path?: string;
}

/**
 * 创建浏览器窗口
 * @param param0 窗口配置
 */
export const createBrowserWindow = ({ type = 'home', path = '' }: CreateBrowserWindowParams): BrowserWindow => {
  let window: BrowserWindow | null;
  const option = browserWindowOptions[type];

  window = new BrowserWindow(option);

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }

  window.loadURL(`${winURL}/#/${path}`);

  ipcMain.handleOnce('get-window-info', async () => {
    return { windowId: window.id };
  });

  window.on('closed', () => {
    window = null;
  });
  return window;
};

/**
 * 打开主界面窗口
 */
export const createHomeBrowserWindow = (): BrowserWindow => {
  return createBrowserWindow({ type: 'home' });
};

/**
 * 打开便笺窗口
 * @param uid 便笺的uid
 */
export const createNoteBrowserWindow = (uid?: string): BrowserWindow => {
  return createBrowserWindow({ type: 'note', path: `note/${uid}` });
};

/**
 * 关闭窗口
 * @param windowId 窗体ID
 */
export const closeWindow = (windowId: number): void => {
  let window = BrowserWindow.fromId(windowId);
  window.destroy();
  window = null;
};
