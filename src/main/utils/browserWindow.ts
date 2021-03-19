//  创建窗口
import { BrowserWindow, ipcMain } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';

export const windows: {
  [propName: string]: BrowserWindow;
} = {};
interface CreateBrowserWindowParams {
  type: string;
  path?: string;
}

/**
 * 创建窗口
 * @param param0 窗口配置
 */
export const createBrowserWindow = ({ type = 'home', path = '' }: CreateBrowserWindowParams): BrowserWindow => {
  const windowName = `${type}${path}`;
  //  存在窗口实例
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
  return createBrowserWindow({ type: 'note', path: `note?uid=${uid}` });
};

//  根据windowId获取BrowserWindow返回模型
interface BrowserWindowResult {
  name: string;
  win: BrowserWindow;
}

/**
 * 根据windowId获取BrowserWindow
 * @export
 * @param {number} windowId
 * @returns {BrowserWindow}
 */
export function findWindowById(windowId: number): BrowserWindowResult {
  const windowAttrs = Object.keys(windows);
  let result: BrowserWindowResult;

  for (let i = 0; i < windowAttrs.length; i++) {
    const name = windowAttrs[i];
    const current = windows[name];
    if (current.id === windowId) {
      result = {
        name,
        win: current
      };
      break;
    }
  }
  return result;
}

/**
 * 关闭窗口
 * @param windowId 窗体ID
 */
export const closeWindow = (windowId: number): void => {
  const { win, name } = findWindowById(windowId);
  delete windows[name];
  win.destroy();
};

/**
 * 隐藏窗口
 * @param windowId 窗体ID
 */
export const hideWindow = (windowId: number): void => {
  const { win } = findWindowById(windowId);
  win.hide();
};
