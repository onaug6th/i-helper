//  创建窗口
import { BrowserWindow, ipcMain } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/config/browserWindow';

interface CreateBrowserWindowParams {
  type: string;
  path?: string;
}

const windows: any = {};

/**
 * 创建浏览器窗口
 * @param param0 窗口配置
 */
export const createBrowserWindow = ({ type = 'home', path = '' }: CreateBrowserWindowParams): BrowserWindow => {
  const windowName = `${type}${path}`;
  //  存在浏览器
  if (windows[windowName]) {
    const window = windows[windowName];
    window.show();
    return window;
  }

  let window: BrowserWindow | null;
  const option = browserWindowOptions[type];

  window = new BrowserWindow(option);
  windows[windowName] = window;

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
  Object.keys(windows).some((i: string) => {
    const window = windows[i];
    if (window.id === windowId) {
      windows[i] = null;
      window.destroy();
    }
  });
};
