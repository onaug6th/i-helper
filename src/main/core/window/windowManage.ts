/**
 * 新建插件窗体：
 * 通过 pluginWin 来判断插件是否已经打开。
 *
 * 寻找窗体：
 * 通过windows1.id寻找
 *
 * 删除窗体：
 * 通过windows1.id删除
 *
 * 寻找view所属的插件id：
 * 通过views标记的（id：插件id）来寻找所属插件信息。同时在windows1中寻找到插件的主窗体
 *
 * 新增插件的子窗体：
 * 通过views标记的（id：插件id）来寻找所属插件信息。同时在windows1中寻找到插件的主窗体
 * 新增插件窗体后。将插件窗体的 fatherId 指向 插件主窗体ID
 */

//  创建窗口
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';
import { PluginItem, PluginWin, ViewWinMap } from './types';

class WindowManage {
  /**
   * 窗体/插件信息映射
   * {
   *    [窗体ID]: Windows
   * }
   * @private
   * @type {{
   *     [propName: number]: BrowserWindow;
   *   }}
   * @memberof WindowManage
   */
  pluginWin: PluginWin = {};

  /**
   * 视图窗体ID映射
   * 视图ID：窗体ID
   */
  viewWinMap: ViewWinMap = {};

  //  主面板实例
  mainWindow: BrowserWindow;

  constructor() {
    global.pluginWin = this.pluginWin;
    global.viewWinMap = this.viewWinMap;
  }

  /**
   * 创建窗体
   * @param param0
   * @returns 窗体实例
   */
  createBrowserWindow({ option, url }: { option: BrowserWindowConstructorOptions; url: string }): BrowserWindow {
    const win = new BrowserWindow(option);

    win.loadURL(url);

    // if (global.isDev) {
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
  addPluginWin(winId: number, data: PluginItem) {
    this.pluginWin[winId] = data;
  }

  /**
   * 创建主界面窗口
   */
  createHomeBrowserWindow(): BrowserWindow {
    const url = this.getWebUrl();
    const option = browserWindowOptions.main;

    this.mainWindow = this.createBrowserWindow({ option, url });
    return this.mainWindow;
  }

  /**
   * 创建插件窗口
   * @param pluginId
   * @param option
   * @param isDev
   * @param fatherId
   * @returns
   */
  createPluginBrowserWindow(
    pluginId: string,
    option: BrowserWindowConstructorOptions,
    isDev = false,
    fatherId = null
  ): BrowserWindow {
    const url = this.getWebUrl(`plugin?id=${pluginId}&isDev=${isDev}`);
    const win = this.createBrowserWindow({ option, url });

    this.addPluginWin(win.id, {
      id: win.id,
      pluginId,
      win,
      isDev,
      fatherId
    });

    return win;
  }

  /**
   * 根据windowId获取BrowserWindow
   * @param {number} windowId
   * @returns {BrowserWindow}
   */
  findWindowById(windowId: number): BrowserWindow {
    if (windowId === 1) {
      return this.mainWindow;
    } else {
      return this.pluginWin[windowId].win;
    }
  }

  /**
   * 根据插件ID寻找插件窗体
   * @param pluginId
   * @returns
   */
  findPluginById(pluginId: string): PluginItem {
    return Object.values(this.pluginWin).find(plugin => plugin.pulginId === pluginId);
  }

  /**
   * 从窗口对象中删除窗口
   * @param id
   */
  deleteWindow(id: number) {
    if (this.pluginWin[id]) {
      delete this.pluginWin[id];
    }
  }

  /**
   * 根据windowId来关闭窗口
   * @param windowId 窗体ID
   */
  closeWindow(windowId: number): void {
    const win = this.findWindowById(windowId);
    if (!win.isDestroyed()) {
      win.destroy();
    }
    this.deleteWindow(windowId);
  }

  /**
   * 隐藏窗口
   * @param windowId 窗体ID
   */
  hideWindow(windowId: number): void {
    const win = this.findWindowById(windowId);
    win.hide();
  }
}

export default new WindowManage();
