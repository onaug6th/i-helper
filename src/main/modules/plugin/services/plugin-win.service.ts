import { WebPreferences, BrowserWindowConstructorOptions } from 'electron';
//  窗体管理
import windowService from '@/main/modules/window/window.service';
//  插件管理
import pluginService from '@/main/modules/plugin/plugin.service';
//  开发者管理
import devService from '@/main/modules/dev/dev.service';
//  窗口配置，基础地址
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { apisdk, pluginConfigKey, scrollbarCSS } from '@/main/constants/plugin';
import { session, BrowserView } from 'electron';
import * as utils from '@/render/utils';

interface OpenPluginWindow {
  pluginWinId: number;
  viewId: number;
}

/**
 * 打开插件窗体
 * @param pluginId 插件ID
 * @param option 窗体配置
 * @param url 窗体地址
 * @param isDev 是否开发模式
 * @param fatherId 窗体的父级窗体ID
 * @param viewUrl 视图地址
 */
function openPluginWindow(
  pluginId: string,
  option: BrowserWindowConstructorOptions,
  isDev = false,
  fatherId = null,
  viewUrl = ''
): OpenPluginWindow {
  //  获取插件信息
  const plugin = isDev ? devService.getPlugin(pluginId) : pluginService.getPlugin(pluginId);
  //  已打开的插件窗体
  const isOpenPluginWin = windowService.getPluginWinItemByPluginId(plugin[pluginConfigKey.ID]);

  //  已打开插件 且 不为主窗体
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
  const pluginWindow = windowService.createPluginBrowserWindow(
    pluginId,
    viewItem.webContents.id,
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

    //  不存在fatherId，说明是主窗体，将全部子窗体关闭
    if (!fatherId) {
      const pluginWinItems = windowService.pluginWinItems;

      for (const winId in pluginWinItems) {
        const pluginWinItem = pluginWinItems[winId];
        //  如插件窗体的fatherId为本次关闭窗体ID
        const isHisFatherWin = pluginWinItem.fatherId === pluginWinId;

        if (isHisFatherWin) {
          //  在插件窗体关闭后，会进入该窗体的 'close' 回调，进行回收视图
          windowService.closeWindow(pluginWinItem.id);
        }
      }
    }

    if (global.isDev) {
      viewItem.webContents.closeDevTools();
    }

    //  手动gc
    viewItem = null;
    pluginWinId = null;
    viewId = null;
  });

  //  记录此视图与所属窗体ID的映射关系
  windowService.viewWins[viewId] = { pluginWinId, viewItem, pluginId };

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
function initBrowserView(plugin, viewUrl: string, isDev: boolean): { viewItem: BrowserView; mount: any } {
  //  创建插件会话
  const sessionItem = session.fromPartition(plugin[pluginConfigKey.NAME]);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);
  //  读取配置的对象
  const readObj = isDev ? plugin[pluginConfigKey.DEV] || plugin : plugin;
  //  优先使用传入的视图地址
  const url = viewUrl || readObj[pluginConfigKey.MAIN];

  const webPreferences: WebPreferences = {
    //  启用NodeJS集成。
    nodeIntegration: true,
    //  允许调用源模块
    enableRemoteModule: true,
    session: sessionItem
  };

  //  如插件存在预加载文件
  if (plugin[pluginConfigKey.PRELOAD]) {
    webPreferences.preload = readObj[pluginConfigKey.PRELOAD];
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

    //  设置嵌入视图的位置
    viewItem.setBounds({
      x: 0,
      y: headerHeight,
      width: pluginWidth,
      height: pluginHeight - headerHeight
    });
    //  设置视图自适应尺寸
    viewItem.setAutoResize({ width: true, height: true });
    //  加载页面资源
    viewItem.webContents.loadURL(url);

    //  监听生命周期，打开开发者控制台
    viewItem.webContents.on('dom-ready', () => {
      //  注入滚动条样式
      viewItem.webContents.insertCSS(scrollbarCSS);

      if (isDev) {
        viewItem.webContents.openDevTools();
      }
    });
  }

  return { viewItem, mount };
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
  const winOptions = plugin[pluginConfigKey.WIN_OPTIONS];

  if (utils.safeGet(plugin, `${pluginConfigKey.PERMISSIONS}.clipboard`)) {
    pluginService.clipboardWatch(pluginId);
  }

  //  打开插件窗体
  return openPluginWindow(
    pluginId,
    Object.assign({}, browserWindowOptions.plugin, winOptions, options),
    isDev,
    fatherId,
    viewUrl
  );
}

export { pluginStart };
