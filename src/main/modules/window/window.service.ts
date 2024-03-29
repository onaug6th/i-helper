import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { browserWindowOptions, winURL } from '@/main/constants/config/browserWindow';
import pluginService from '../plugin/plugin.service';
import * as utils from '@/main/utils';

class WindowService {
  /**
   * 插件窗体信息映射
   * {
   *    [窗体ID]: PluginWinItem
   * }
   * @private
   * @type {{
   *     [propName: number]: PluginWinItem;
   *   }}
   * @memberof WindowService
   */
  pluginWinItems: PluginWinItems = {};

  /**
   * 视图窗体ID映射
   * 视图ID：窗体ID
   */
  viewWins: ViewWins = {};

  //  主面板实例
  mainWindow: BrowserWindow;

  //  搜索框窗体实例
  searchWindow: BrowserWindow;

  constructor() {
    global.windowService = this;
    global.pluginWinItems = this.pluginWinItems;
    global.viewWins = this.viewWins;
  }

  /**
   * 创建窗体
   * @param param0
   * @returns 窗体实例
   */
  createBrowserWindow({ option, url }: { option: BrowserWindowConstructorOptions; url: string }): BrowserWindow {
    const win = new BrowserWindow(option);

    win.loadURL(url);

    // if (global.isDevMode) {
    //   win.webContents.openDevTools();
    // }

    return win;
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
   * 增加窗体
   * @param winId
   * @param data
   */
  addPluginWinItem(winId: number, data: PluginWinItem): void {
    this.pluginWinItems[winId] = data;
  }

  /**
   * 创建主界面窗体
   */
  createMainWin(): BrowserWindow {
    const url = this.getWebUrl();
    const option = browserWindowOptions.main;

    this.mainWindow = this.createBrowserWindow({ option, url });
    this.mainWindow.setIcon(global.appLogoPath);
    return this.mainWindow;
  }

  /**
   * 创建搜索窗体
   * @returns
   */
  createSearchWin(): BrowserWindow {
    const url = this.getWebUrl('search');
    const option = browserWindowOptions.search;

    this.searchWindow = this.createBrowserWindow({ option, url });
    return this.searchWindow;
  }

  /**
   * 创建插件窗体
   * @param pluginId
   * @param viewId
   * @param option
   * @param isDev
   * @param fatherId
   * @returns
   */
  createPluginWin(
    plugin: TPlugin,
    viewId: number,
    viewUrl: string,
    option: BrowserWindowConstructorOptions,
    isDev = false,
    fatherId = null
  ): BrowserWindow {
    const query: {
      id?: string;
      isDev?: boolean;
      name?: string;
      header?: string;
    } = {
      id: plugin.id,
      name: plugin.name,
      header: JSON.stringify(plugin.header)
    };

    if (isDev) {
      query.isDev = isDev;
    }

    const queryStr = utils.obj2Query(query);

    const url = this.getWebUrl(`plugin?${queryStr}`);
    const win = this.createBrowserWindow({ option, url });

    const logo = plugin.logoPath;
    const fileExtra = utils.getFileExtra(logo);

    //  @Todo: 尚未处理macOS上的图标逻辑
    if (global.isWindows && fileExtra !== 'gif') {
      win.setIcon(logo);
    }

    this.addPluginWinItem(win.id, {
      id: win.id,
      pluginId: plugin.id,
      viewId,
      win,
      url,
      viewUrl,
      isDev,
      fatherId,
      fatherViewId: utils.safeGet(this.getPluginWinItemByWindowId(fatherId), 'viewId', null)
    });

    return win;
  }

  /**
   * 根据windowId获取BrowserWindow
   * @param {number} windowId
   * @returns {BrowserWindow}
   */
  getWindowById(windowId: number): BrowserWindow {
    if (windowId === 1) {
      return this.mainWindow;
    } else {
      return this.getPluginWinItemByWindowId(windowId).win;
    }
  }

  /**
   * 根据窗体ID获取插件窗体
   * @param windowId
   * @returns
   */
  getPluginWinItemByWindowId(windowId: number): PluginWinItem | null {
    return this.pluginWinItems[windowId];
  }

  /**
   * 根据插件ID寻找插件窗体
   * @param pluginId
   * @returns
   */
  getPluginWinItemByPluginId(pluginId: string): Array<PluginWinItem> {
    const pluginWinItemArr = Object.values(this.pluginWinItems).filter((pluginWinItem: PluginWinItem) => {
      const isTarget = pluginWinItem.pluginId === pluginId;

      if (pluginWinItem.win.isDestroyed()) {
        //  移除内存中的窗体对象
        this.deleteWindow(pluginWinItem.id);
        return false;
      } else {
        return isTarget;
      }
    });

    return pluginWinItemArr;
  }

  /**
   * 根据视图id获取插件窗体
   * @param id
   * @returns
   */
  getPluginWinItemByViewId(id: number): PluginWinItem | null {
    if (this.viewWins[id]) {
      //  视图所属的插件窗体ID
      const { pluginWinId } = this.viewWins[id];
      //  插件窗体
      return this.getPluginWinItemByWindowId(pluginWinId);
    } else {
      return null;
    }
  }

  /**
   * 从窗体对象中删除窗体
   * @param id
   */
  deleteWindow(id: number): void {
    delete this.pluginWinItems[id];
  }

  /**
   * 切换显示主面板
   * @param windowId
   */
  toggleMainWindow(): void {
    const mainWindow = this.mainWindow;
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  }

  /**
   * 根据windowId来关闭窗体
   * @param windowId 窗体ID
   */
  closeWindow(windowId: number): void {
    let win: BrowserWindow;

    //  关闭的为主面板
    if (windowId === 1) {
      win = this.mainWindow;
    }
    //  关闭的窗体为插件窗体
    else {
      const pluginWinItem = this.getPluginWinItemByWindowId(windowId);
      win = pluginWinItem.win;

      //  执行窗体关闭后的某些回调
      pluginService.clipboardOff(pluginWinItem.pluginId);
    }

    //  摧毁窗体（塔塔开，塔塔开！）
    if (!win.isDestroyed()) {
      win.destroy();
    }
    //  移除内存中的窗体对象
    this.deleteWindow(windowId);
  }

  /**
   * 关闭插件的全部子窗体
   * @param pluginWinId
   */
  closePluginAllChildWindow(pluginWinId: number) {
    const pluginWinItems = this.pluginWinItems;

    for (const winId in pluginWinItems) {
      const pluginWinItem = pluginWinItems[winId];
      //  如插件窗体的fatherId为本次关闭窗体ID
      const isHisFatherWin = pluginWinItem.fatherId === pluginWinId;

      if (isHisFatherWin) {
        //  在插件窗体关闭后，会进入该窗体的 'close' 回调，进行回收视图
        this.closeWindow(pluginWinItem.id);
      }
    }
  }

  /**
   * 隐藏窗体
   * @param windowId 窗体ID
   */
  hideWindow(windowId: number): void {
    const win = this.getWindowById(windowId);
    win.hide();
  }
}

export default new WindowService();
