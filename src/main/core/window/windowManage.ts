//  创建窗口
import { BrowserWindow, ipcMain } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';

//  创建窗口的参数模型
interface CreateBrowserWindowParams {
  type: string;
  path?: string;
}

//  根据windowId获取BrowserWindow返回模型
interface BrowserWindowResult {
  name: string;
  win: BrowserWindow;
}

class WindowManage {
  /**
   * 窗体集合
   * {
   *    [窗体名称]: 窗体实例
   * }
   * @private
   * @type {{
   *     [propName: string]: BrowserWindow;
   *   }}
   * @memberof WindowManage
   */
  private windows: {
    [propName: string]: BrowserWindow;
  } = {};

  //  主面板
  mainWindow: BrowserWindow;

  /**
   * 创建窗口
   * @param param0 窗口配置
   */
  createBrowserWindow({ type = 'home', path = '' }: CreateBrowserWindowParams): BrowserWindow {
    const windows = this.windows;
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
  }

  /**
   * 创建主界面窗口
   */
  createHomeBrowserWindow(): BrowserWindow {
    if (this.mainWindow) {
      return this.mainWindow;
    }

    this.mainWindow = this.createBrowserWindow({ type: 'home' });
    return this.mainWindow;
  }

  /**
   * 创建便笺窗口
   * @param uid
   * @returns
   */
  createNoteBrowserWindow(uid?: string): BrowserWindow {
    return this.createBrowserWindow({ type: 'note', path: `note?uid=${uid}` });
  }

  /**
   * 根据windowId获取BrowserWindow
   * @export
   * @param {number} windowId
   * @returns {BrowserWindow}
   */
  findWindowById(windowId: number): BrowserWindowResult {
    const windowAttrs = Object.keys(this.windows);
    let result: BrowserWindowResult;

    for (let i = 0; i < windowAttrs.length; i++) {
      const name = windowAttrs[i];
      const current = this.windows[name];
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
  closeWindow(windowId: number): void {
    const { win, name } = this.findWindowById(windowId);
    delete this.windows[name];
    win.destroy();
  }

  /**
   * 隐藏窗口
   * @param windowId 窗体ID
   */
  hideWindow(windowId: number): void {
    const { win } = this.findWindowById(windowId);
    win.hide();
  }
}

export default new WindowManage();
