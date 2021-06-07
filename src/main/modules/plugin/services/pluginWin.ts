import { ipcMain, WebPreferences, BrowserWindowConstructorOptions } from 'electron';
//  窗体管理
import windowManage from '@/main/modules/window/window.controller';
//  插件管理
import pluginManage from '@/main/modules/plugin/plugin.controller';
//  开发者管理
import devManage from '@/main/modules/dev/dev.controller';
//  窗口配置，基础地址
import { browserWindowOptions, apisdk, pluginConfigKey } from '@/main/config/browserWindow';
import { session, BrowserView } from 'electron';

/**
 * 打开插件窗体
 * @param pluginId 插件ID
 * @param option 窗体配置
 * @param url 窗体地址
 * @param isDev 是否开发模式
 * @param fatherId 窗体的父级窗体ID
 * @param browserViewUrl 视图地址
 */
function openPluginWindow(
  pluginId: string,
  option: BrowserWindowConstructorOptions,
  isDev = false,
  fatherId = null,
  browserViewUrl = ''
): any {
  //  获取插件信息
  const plugin = isDev ? devManage.getPlugin(pluginId) : pluginManage.getPlugin(pluginId);
  //  插件是否多开
  const multiple = plugin[pluginConfigKey.MULTIPLE];
  //  已打开的插件ID
  const isOpenPlugin = windowManage.findPluginById(plugin[pluginConfigKey.ID]);

  //  已拥有插件 且 非设置多开
  if (isOpenPlugin && !multiple) {
    windowManage.findWindowById(isOpenPlugin.id).show();
  }

  //  创建插件窗体
  const pluginWindow = windowManage.createPluginBrowserWindow(pluginId, option, isDev, fatherId);
  //  插件窗体ID
  let pluginWinId = pluginWindow.id;
  //  创建视图实例
  let browserViewItem = initBrowserView(plugin, pluginWindow, browserViewUrl, isDev);
  //  视图ID
  let browserViewId = browserViewItem.webContents.id;

  //  插件窗体关闭时，回收视图信息或回收子插件窗体
  pluginWindow.on('closed', () => {
    //  从视图窗体映射中移除
    delete windowManage.viewWinMap[browserViewId];

    //  不存在fatherId，说明是主窗体，将全部子窗体关闭
    if (!fatherId) {
      const pluginWin = windowManage.pluginWin;

      for (const winId in pluginWin) {
        const pluginWinItem = pluginWin[winId];
        //  如插件窗体的fatherId为关闭窗体ID
        const isFatherWin = pluginWinItem.fatherId === pluginWinId;

        if (isFatherWin) {
          //  在插件窗体关闭后，会进入该窗体的 'close' 回调，进行回收视图
          windowManage.closeWindow(pluginWinItem.id);
        }
      }
    }

    if (global.isDev) {
      browserViewItem.webContents.closeDevTools();
    }

    //  手动gc
    browserViewItem = null;
    pluginWinId = null;
    browserViewId = null;
  });

  //  记录此视图与所属窗体ID的映射关系
  windowManage.viewWinMap[browserViewId] = { pluginWinId, browserViewItem };

  return {
    pluginWinId,
    browserViewId
  };
}

/**
 * 生成插件视图
 * @param plugin
 * @param pluginWindow
 * @param browserViewUrl
 * @param isDev
 * @returns
 */
function initBrowserView(plugin, pluginWindow, browserViewUrl, isDev): BrowserView {
  //  创建插件会话
  const sessionItem = session.fromPartition(plugin[pluginConfigKey.NAME]);
  //  设置会话预加载文件
  sessionItem.setPreloads([apisdk]);
  //  读取配置的对象
  const readObj = isDev ? plugin[pluginConfigKey.DEV] || plugin : plugin;
  //  优先使用传入的视图地址
  const url = browserViewUrl || readObj[pluginConfigKey.MAIN];

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
  const browserViewItem = new BrowserView({
    webPreferences
  });
  //  获取插件窗体的大小
  const { width: pluginWidth, height: pluginHeight } = pluginWindow.getBounds();
  //  BrowserView挂载到插件窗口中
  pluginWindow.setBrowserView(browserViewItem);

  //  以下代码需在挂载后执行

  //  设置嵌入视图的位置
  browserViewItem.setBounds({
    x: 0,
    //  头部栏高度固定为40
    y: 40,
    width: pluginWidth,
    height: pluginHeight
  });
  //  设置视图自适应尺寸
  browserViewItem.setAutoResize({ width: true, height: true });
  //  加载页面资源
  browserViewItem.webContents.loadURL(url);

  //  监听生命周期，打开开发者控制台
  browserViewItem.webContents.on('dom-ready', () => {
    if (global.isDev) {
      browserViewItem.webContents.openDevTools();
    }
  });

  return browserViewItem;
}

//  打开指定插件窗体
ipcMain.on('plugin-open', (event, pluginId, isDev, fatherId) => {
  const defaultOption = browserWindowOptions.plugin;

  //  打开插件窗体
  openPluginWindow(pluginId, defaultOption, isDev, fatherId);
});

export { openPluginWindow };
