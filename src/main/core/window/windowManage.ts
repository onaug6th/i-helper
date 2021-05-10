//  创建窗口
import { BrowserWindow, ipcMain, BrowserWindowConstructorOptions, BrowserView } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';

//  创建窗口的参数模型
interface CreateBrowserWindowParams {
  //  路径
  option: BrowserWindowConstructorOptions;
  //  窗体路径
  url: string;
  //  窗体名称
  name: string;
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

  /**
   * 视图集合
   * @private
   * @type {{
   *     [propName: string]: BrowserView;
   *   }}
   * @memberof WindowManage
   */
  pluginViews: {
    [propName: string]: { [propName: number]: BrowserView };
  } = {};

  //  主面板
  mainWindow: BrowserWindow;

  /**
   * 创建窗口
   * @param param0 窗口配置
   */
  createBrowserWindow({ option, url, name }: CreateBrowserWindowParams): BrowserWindow | null {
    const windows = this.windows;
    //  窗体名称
    let windowName = name;

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
        return null;
      }
    }

    let window: BrowserWindow | null;

    window = new BrowserWindow(option);
    this.addWindow(windowName, window);

    if (global.isDev) {
      window.webContents.openDevTools();
    }

    //  主动发布windowId
    ipcMain.handleOnce('get-window-id', async () => {
      return window.id;
    });

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
    const option = browserWindowOptions.main;

    this.mainWindow = this.createBrowserWindow({ option, url, name: 'main' });
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
    const option = browserWindowOptions.note;

    return this.createBrowserWindow({ option, url, name });
  }

  /**
   * 创建插件窗口
   * @param id
   * @param isDev
   * @returns
   */
  createPluginBrowserWindow(id: string, isDev = false): BrowserWindow | null {
    const url = this.getWebUrl(`plugin?id=${id}&isDev=${isDev}`);
    const name = id;
    const option = browserWindowOptions.plugin;

    return this.createBrowserWindow({ option, url, name });
  }

  createPluginApiWin(name, url, option) {
    return this.createBrowserWindow({ option, url, name });
  }

  /**
   * 根据windowId获取BrowserWindow
   * @param {number} windowId
   * @returns {BrowserWindowResult}
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
   * 新增window
   * @param windowName
   * @param window
   */
  addWindow(windowName: string, window: BrowserWindow) {
    this.windows[windowName] = window;
  }
  /**
   * 从窗口对象中删除窗口
   * @param name
   */
  deleteWindow(name: string) {
    delete this.windows[name];
  }

  /**
   * 增加plugin的view
   * @param pluginName
   * @param viewId
   * @param view
   */
  addPluginView(pluginName: string, viewId: number, view: BrowserView) {
    if (this.pluginViews[pluginName]) {
      this.pluginViews[pluginName][viewId] = view;
    } else {
      this.pluginViews[pluginName] = { [viewId]: view };
    }
  }

  /**
   * 删除插件的view
   * @param pluginName
   * @param viewId
   */
  deletePluginView(pluginName, viewId) {
    if (this.pluginViews[pluginName]) {
      delete this.pluginViews[pluginName][viewId];
    }
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
