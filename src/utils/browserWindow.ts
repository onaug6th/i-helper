//  创建窗口
import { BrowserWindow, remote } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/config/browserWindow';

interface CreateBrowserWindowParams {
  type: string;
  path?: string;
  isRenderRemote?: boolean;
}

export const createBrowserWindow = ({
  type = 'home',
  path = '',
  isRenderRemote = false
}: CreateBrowserWindowParams): BrowserWindow => {
  let window: BrowserWindow | null;
  const option = browserWindowOptions[type];
  //  @TODO: August - 主线程和渲染进程打开窗口使用的方法不同
  const BrowserFn = isRenderRemote ? remote.BrowserWindow : BrowserWindow;
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
export const createHomeBrowserWindow = (): BrowserWindow => {
  return createBrowserWindow({ type: 'home', isRenderRemote: true });
};

/**
 * 打开便笺窗口
 * @param uid 便笺的uid
 */
export const createNoteBrowserWindow = (uid?: string): BrowserWindow => {
  return createBrowserWindow({ type: 'note', path: `note/${uid}`, isRenderRemote: true });
};

/**
 * 关闭窗口
 */
export const closeWindow = (): void => {
  remote.getCurrentWindow().close();
};
