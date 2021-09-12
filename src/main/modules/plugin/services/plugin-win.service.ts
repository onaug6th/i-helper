import { WebPreferences, BrowserWindowConstructorOptions } from 'electron';
//  窗体管理
import windowService from '@/main/modules/window/window.service';
//  插件管理
import pluginService from '@/main/modules/plugin/plugin.service';
//  开发者管理
import devService from '@/main/modules/dev/dev.service';
//  窗口配置，基础地址
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { apisdk, scrollbarCSS } from '@/main/constants/plugin';
import { session, BrowserView } from 'electron';
import * as utils from '@/main/utils';
import merge from 'lodash/merge';

interface OpenPluginWindow {
  pluginWinId: number;
  viewId: number;
}

/**
 * 打开插件窗体
 * @param plugin 插件
 * @param option 窗体配置
 * @param url 窗体地址
 * @param isDev 是否开发模式
 * @param fatherId 窗体的父级窗体ID
 * @param viewUrl 视图地址
 */
function openPluginWindow(
  plugin: Plugin,
  option: BrowserWindowConstructorOptions,
  isDev = false,
  fatherId = null,
  viewUrl = ''
): OpenPluginWindow {
  //  已打开的插件窗体
  const isOpenPluginWin = windowService.getPluginWinItemByPluginId(plugin.id)[0];

  //  已打开插件 且 不存在父窗体ID
  if (isOpenPluginWin && !fatherId) {
    isOpenPluginWin.win.show();

    return {
      pluginWinId: isOpenPluginWin.id,
      viewId: isOpenPluginWin.viewId
    };
  }

  //  创建视图实例
  const initResult = initBrowserView(plugin, viewUrl, isDev);
  //  视图对象
  let viewItem = initResult.viewItem;
  //  挂载方法
  const mount = initResult.mount;

  //  创建插件窗体
  const pluginWindow = windowService.createPluginWin(
    plugin,
    viewItem.webContents.id,
    initResult.viewUrl,
    option,
    isDev,
    fatherId
  );

  //  视图挂载到插件窗体中
  mount(pluginWindow);

  //  插件窗体ID
  let pluginWinId = pluginWindow.id;
  //  视图ID
  let viewId = viewItem.webContents.id;

  //  插件窗体关闭时，回收视图信息或回收子插件窗体
  pluginWindow.on('closed', () => {
    //  从视图窗体映射中移除
    delete windowService.viewWins[viewId];

    //  不存在fatherId，说明是主窗体
    if (!fatherId) {
      //  如设置了关闭后关闭全部子窗体，将全部子窗体关闭
      if (plugin.closeGCChilds) {
        windowService.closePluginAllChildWindow(pluginWinId);
      }
    }

    if (viewItem.webContents.isDevToolsOpened()) {
      viewItem.webContents.closeDevTools();
    }

    //  手动gc
    viewItem = null;
    pluginWinId = null;
    viewId = null;
  });

  //  记录此视图与所属窗体ID的映射关系
  windowService.viewWins[viewId] = { pluginWinId, viewItem, pluginId: plugin.id };

  return {
    pluginWinId,
    viewId
  };
}

/**
 * 生成插件视图
 * @param plugin
 * @param viewUrl
 * @param isDev
 * @returns
 */
function initBrowserView(
  plugin: Plugin,
  viewUrl: string,
  isDev: boolean
): { viewItem: BrowserView; mount: any; viewUrl: string } {
  //  创建插件会话
  const sessionItem = session.fromPartition(plugin.name);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);
  //  读取配置的对象
  const readConfig: PluginDevConfig | Plugin = isDev ? plugin.dev || plugin : plugin;
  //  如没有指定视图地址，默认使用配置中设置的插件地址
  if (!viewUrl) {
    viewUrl = readConfig.main;
  }

  const webPreferences: WebPreferences = {
    //  启用NodeJS集成。
    nodeIntegration: true,
    //  允许调用源模块
    enableRemoteModule: true,
    session: sessionItem
  };

  //  如插件存在预加载文件
  if (plugin.preload) {
    webPreferences.preload = readConfig.preload;
  }

  //  实例化 BrowserView
  const viewItem = new BrowserView({
    webPreferences
  });

  /**
   * 视图挂载
   * @param pluginWindow
   */
  function mount(pluginWindow) {
    //  获取插件窗体的大小
    const { width: pluginWidth, height: pluginHeight } = pluginWindow.getBounds();
    //  BrowserView挂载到插件窗口中
    pluginWindow.setBrowserView(viewItem);

    //  以下代码需在挂载后执行

    //  头部栏高度固定为40
    const headerHeight = 40;
    let y = headerHeight;
    let height = pluginHeight - headerHeight;

    //  无头部配置
    if (plugin.header && !plugin.header.show) {
      y = 0;
      height = pluginHeight;
    }

    //  设置嵌入视图的位置
    viewItem.setBounds({
      x: 0,
      y,
      width: pluginWidth,
      height
    });
    //  设置视图自适应尺寸
    viewItem.setAutoResize({ width: true, height: true });

    //  加载页面地址
    if (viewUrl.startsWith('http') || viewUrl.startsWith('file')) {
      viewItem.webContents.loadURL(viewUrl);
    }
    //  加载文件
    else {
      viewItem.webContents.loadFile(viewUrl);
    }

    if (isDev) {
      viewItem.webContents.openDevTools();
    }

    viewItem.webContents.on('dom-ready', () => {
      if (plugin.useScrollbarCSS) {
        //  注入滚动条样式
        viewItem.webContents.insertCSS(scrollbarCSS);
      }
    });
  }

  return { viewItem, mount, viewUrl };
}

/**
 * 插件启动
 * @param pluginId
 * @param config
 */
function pluginStart(
  pluginId: string,
  config?: { isDev?: boolean; fatherId?: number | null; options?: any; viewUrl?: string }
): OpenPluginWindow {
  const { options = {}, isDev = false, fatherId = null, viewUrl = '' } = config || {};

  //  获取插件信息
  const plugin = isDev ? devService.getPlugin(pluginId) : pluginService.getPlugin(pluginId);
  //  自定义窗体配置
  const winOptions = plugin.winOptions;

  //  如此插件需要监听剪贴板
  if (utils.safeGet(plugin, 'permissions.clipboard')) {
    pluginService.clipboardWatch(pluginId);
  }

  //  通过插件内打开的窗体，因为部分配置可能写在传入配置中，所以需要将传入的配置与插件配置进行合并。
  if (fatherId) {
    merge(plugin, options.pluginOptions);
  }

  //  打开插件窗体
  return openPluginWindow(
    plugin,
    merge({}, browserWindowOptions.plugin, winOptions, options),
    isDev,
    fatherId,
    viewUrl
  );
}

export { pluginStart };
