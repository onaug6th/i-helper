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
import { browserWindowOptions, winURL } from '@/main/constants/config/browserWindow';
import { PluginItem, PluginWin, ViewWinMap } from './types';
import * as utils from '@/render/utils';
import pluginService from '../plugin/plugin.service';

class WindowService {
  /**
   * 窗体/插件信息映射
   * {
   *    [窗体ID]: Windows
   * }
   * @private
   * @type {{
   *     [propName: number]: BrowserWindow;
   *   }}
   * @memberof WindowService
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
  addPluginWin(winId: number, data: PluginItem): void {
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
   * @param viewId
   * @param option
   * @param isDev
   * @param fatherId
   * @returns
   */
  createPluginBrowserWindow(
    pluginId: string,
    viewId: number,
    option: BrowserWindowConstructorOptions,
    isDev = false,
    fatherId = null
  ): BrowserWindow {
    const url = this.getWebUrl(`plugin?id=${pluginId}${isDev ? '&isDev=true' : ''}`);
    const win = this.createBrowserWindow({ option, url });

    this.addPluginWin(win.id, {
      id: win.id,
      pluginId,
      viewId,
      win,
      isDev,
      fatherId,
      fatherViewId: utils.safeGet(this.findPluginItemByWindowId(fatherId), 'viewId', null)
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
      return this.findPluginItemByWindowId(windowId).win;
    }
  }

  /**
   * 根据窗体ID获取插件窗体对象
   * @param windowId
   * @returns
   */
  findPluginItemByWindowId(windowId: number): PluginItem {
    return this.pluginWin[windowId];
  }

  /**
   * 根据插件ID寻找插件窗体
   * @param pluginId
   * @returns
   */
  findPluginItemByPluginId(pluginId: string): PluginItem {
    return Object.values(this.pluginWin).find(plugin => plugin.pluginId === pluginId);
  }

  /**
   * 从窗口对象中删除窗口
   * @param id
   */
  deleteWindow(id: number): void {
    delete this.pluginWin[id];
  }

  /**
   * 根据windowId来关闭窗口
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
      const pluginItem = this.findPluginItemByWindowId(windowId);
      win = pluginItem.win;

      //  执行窗体关闭后的某些回调
      pluginService.clipboardOff(pluginItem.pluginId);
    }

    //  摧毁窗体（塔塔开，塔塔开！）
    if (!win.isDestroyed()) {
      win.destroy();
    }
    //  移除内存中的窗体对象
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

  /**
   * 根据视图id获取插件窗体信息
   * @param id
   * @returns
   */
  getPluginByViewId(id: number): PluginItem {
    //  视图所属的插件窗体ID
    const { pluginWinId } = this.viewWinMap[id];
    //  插件窗体信息
    return this.findPluginItemByWindowId(pluginWinId);
  }
}

export default new WindowService();
