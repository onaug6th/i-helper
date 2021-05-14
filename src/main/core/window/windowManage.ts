//  新建插件窗体：通过 pluginWinMap 来寻找插件是否已经打开过
//  寻找窗体：通过windows1.id寻找
//  删除窗体：通过windows1.id删除，如果类型为插件，还需要根据窗体的id来寻找其他fatherId为此id的窗体一并销毁掉。
//  寻找view所属的插件id：通过views标记的（id：插件id）来寻找所属插件信息。同时在windows1中寻找到插件的主窗体
//  新增插件的子窗体：通过views标记的（id：插件id）来寻找所属插件信息。同时在windows1中寻找到插件的主窗体，新增插件窗体后。将插件窗体的 fatherId 指向 插件主窗体ID

//  创建窗口
import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
//  窗口配置，基础地址
import { browserWindowOptions, winURL } from '@/main/config/browserWindow';

import { WindowItem, Windows, ViewPluginMap, PluginWinMap } from './types';
class WindowManage {
  /**
   * 窗体集合
   * {
   *    [窗体ID]: Windows
   * }
   * @private
   * @type {{
   *     [propName: string]: BrowserWindow;
   *   }}
   * @memberof WindowManage
   */
  windows: Windows = {};

  /**
   * 视图插件ID映射
   */
  viewPluginMap: ViewPluginMap = {};

  /**
   * 插件窗体映射
   */
  pluginWinMap: PluginWinMap = {};

  //  主面板实例
  mainWindow: BrowserWindow;

  /**
   * 创建窗体
   * @param param0
   * @returns 窗体实例
   */
  createBrowserWindowPro({
    option,
    type,
    url
  }: {
    option: BrowserWindowConstructorOptions;
    type: string;
    url: string;
  }) {
    const win = new BrowserWindow(option);

    win.loadURL(url);

    if (global.isDev) {
      win.webContents.openDevTools();
    }

    this.addWindowPro(win.id, {
      id: win.id,
      type,
      win
    });

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
   * @param id
   * @param data
   */
  addWindowPro(id: number, data: WindowItem) {
    this.windows[id] = data;
  }

  /**
   * 创建主界面窗口
   */
  createHomeBrowserWindow(): BrowserWindow {
    const url = this.getWebUrl();
    const option = browserWindowOptions.main;

    this.mainWindow = this.createBrowserWindowPro({ option, url, type: 'main' });
    return this.mainWindow;
  }

  /**
   * 创建插件窗口
   * @param id
   * @param isDev
   * @returns
   */
  createPluginBrowserWindow(id: string, isDev = false): BrowserWindow | null {
    const url = this.getWebUrl(`plugin?id=${id}&isDev=${isDev}`);
    const type = 'plugin';
    const option = browserWindowOptions.plugin;

    return this.createBrowserWindowPro({ option, url, type });
  }

  /**
   * 根据windowId获取BrowserWindow
   * @param {number} windowId
   * @returns {BrowserWindow}
   */
  findWindowById(windowId: number): BrowserWindow {
    return this.windows[windowId].win;
  }

  /**
   * 从窗口对象中删除窗口
   * @param name
   */
  deleteWindow(name: string) {
    delete this.windows[name];
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
