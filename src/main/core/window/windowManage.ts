//  创建窗口
import { BrowserWindow, ipcMain } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';

//  创建窗口的参数模型
interface CreateBrowserWindowParams {
  type: string;
  //  窗体路径
  url: string;
  //  窗体名称
  name?: string;
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
  createBrowserWindow({ type = 'home', url, name = '' }: CreateBrowserWindowParams): BrowserWindow {
    const windows = this.windows;
    //  窗体名称
    let windowName = `${type}${name}`;

    //  存在窗口实例
    if (windows[windowName]) {
      //  窗口实例已被销毁
      if (windows[windowName].isDestroyed()) {
        this.deleteWindow(windowName);
      }
      //  直接打开
      else {
        const window = windows[windowName];
        window.show();
        return window;
      }
    }

    let window: BrowserWindow | null;
    const option = browserWindowOptions[type];

    window = new BrowserWindow(option);
    windows[windowName] = window;

    if (process.env.NODE_ENV === 'development') {
      window.webContents.openDevTools();
    }

    //  不为启动应用时，需要主动发布windowId
    if (type !== 'app') {
      ipcMain.handleOnce('get-window-id', async () => {
        return window.id;
      });
    }

    window.on('closed', () => {
      this.deleteWindow(windowName);
      windowName = null;
      window = null;
    });

    window.loadURL(url);

    return window;
  }

  /**
   * 获取web地址
   * @param routerPath
   * @returns
   */
  getWebUrl(routerPath = ''): string {
    return `${winURL}/#/${routerPath}`;
  }

  /**
   * 创建主界面窗口
   */
  createHomeBrowserWindow(): BrowserWindow {
    if (this.mainWindow) {
      return this.mainWindow;
    }

    const url = this.getWebUrl();

    this.mainWindow = this.createBrowserWindow({ type: 'home', url });
    return this.mainWindow;
  }

  /**
   * 创建便笺窗口
   * @param uid
   * @returns
   */
  createNoteBrowserWindow(uid?: string): BrowserWindow {
    const url = this.getWebUrl(`note?uid=${uid}`);
    const name = uid;

    return this.createBrowserWindow({ type: 'note', url, name });
  }

  /**
   * 创建应用窗体
   * @param param0
   * @returns
   */
  createAppBrowserWindow({ url, name }) {
    return this.createBrowserWindow({ type: 'app', url, name });
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
   * 从窗口对象中删除窗口
   * @param name
   */
  deleteWindow(name) {
    delete this.windows[name];
  }

  /**
   * 根据windowId来关闭窗口
   * @param windowId 窗体ID
   */
  closeWindow(windowId: number): void {
    const { win, name } = this.findWindowById(windowId);
    this.deleteWindow(name);
    if (!win.isDestroyed()) {
      win.destroy();
    }
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
